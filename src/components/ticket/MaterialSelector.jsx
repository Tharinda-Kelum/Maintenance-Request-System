import React, { useId } from 'react';
import { Plus, X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const MaterialSelector = ({ value, onChange, disabled = false, usage = false }) => {
  const id = useId();
  const { inventory, loading, error, reload } = useInventory();
  const update = (index, patch) => onChange(value.map((row, position) => position === index ? { ...row, ...patch } : row));
  return <fieldset className="material-selector" disabled={disabled}>
    <legend>{usage ? 'Actual materials used' : 'Materials needed'}</legend>
    <p className="form-hint">{usage ? 'Enter how many of each item you actually used. Enter 0 for unused items. Add any other materials you used.' : 'Choose one or more inventory items and enter the quantity for each. Leave empty if no materials are needed.'}</p>
    {error && <div className="form-error" role="alert">{error} <button type="button" className="text-action" onClick={reload}>Retry inventory</button></div>}
    {value.map((row, index) => <div className="material-row" key={index}>
      <label htmlFor={`${id}-item-${index}`}>Material {index + 1}<select id={`${id}-item-${index}`} required value={row.itemId} onChange={(event) => update(index, { itemId: event.target.value })}>
        <option value="">Choose a material</option>
        {row.itemId && !inventory.some((item) => item.id === row.itemId) && <option value={row.itemId}>{row.name || 'Previously selected material'}</option>}
        {inventory.map((item) => <option key={item.id} value={item.id} disabled={value.some((other, position) => position !== index && other.itemId === item.id)}>{item.name} ({item.stock} {item.unit} available)</option>)}
      </select></label>
      <label htmlFor={`${id}-quantity-${index}`}>{usage ? 'Used quantity' : 'Quantity'}<input id={`${id}-quantity-${index}`} type="number" required min={usage ? '0' : '1'} max="500" step="1" value={row.quantity} onChange={(event) => update(index, { quantity: event.target.value === '' ? '' : Number(event.target.value) })} /></label>
      <button type="button" className="ui-button secondary" aria-label={`Remove material ${index + 1}`} onClick={() => onChange(value.filter((_, position) => position !== index))}><X size={17} /></button>
    </div>)}
    {!inventory.length && !error && <p className="form-hint">{loading ? 'Loading materials…' : 'No inventory items are available. Describe any other materials in the notes below.'}</p>}
    <button type="button" className="ui-button secondary" disabled={!inventory.length || value.length >= Math.min(inventory.length, 50)} onClick={() => onChange([...value, { itemId: '', quantity: 1 }])}><Plus size={17} /> Add material</button>
    <p className="form-hint">{usage ? 'Usage is recorded in your report. Stock is handled separately through Central Stores.' : 'This records material needs. Use Parts requests to request stock from Central Stores.'}</p>
  </fieldset>;
};
