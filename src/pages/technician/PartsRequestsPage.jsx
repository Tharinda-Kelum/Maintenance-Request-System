import React, { useState } from 'react';
import { Package, ArrowRight, Search, Plus } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useTickets } from '../../context/TicketContext';
import { Modal } from '../../components/common/Modal';

export const PartsRequestsPage = ({ onOpenWorkspace }) => {
  const { itemRequests, inventory, createItemRequest } = useInventory();
  const { tickets } = useTickets();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const tasks = tickets.filter((ticket) => ['TECHNICIAN_ASSIGNED', 'INSPECTION_COMPLETED', 'ARRANGEMENTS_IN_PROGRESS'].includes(ticket.workflowStatus));
  const matching = inventory.filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(query.trim().toLowerCase()));
  const submit = async (event) => {
    event.preventDefault(); if (busy) return;
    const ticket = tasks.find((item) => item.id === ticketId);
    const item = inventory.find((entry) => entry.id === itemId);
    if (!ticket || !item) return;
    setBusy(true);
    const result = await createItemRequest(ticket, item, quantity, 'Normal');
    if (result) { setOpen(false); setQuantity(1); }
    setBusy(false);
  };
  return <div className="portal-page"><div className="page-heading"><div><p className="eyebrow">CENTRAL STORES</p><h1>Parts requests</h1><p>Request materials for an inspected problem and follow their issue status.</p></div><button className="ui-button primary" onClick={() => setOpen(true)} disabled={!tasks.length}><Plus size={17} /> Request parts</button></div><section className="ui-panel"><div className="panel-heading"><h2>My parts requests</h2></div>{itemRequests.length ? itemRequests.map((request) => <article className="request-row" key={request.id}><Package size={22} className="shrink-0" /><div className="request-row-main"><h3>{request.itemName}</h3><p>{request.ticketId} · {request.quantity} {request.unit} · <strong>{request.status}</strong></p><p>{request.notes}</p></div><button className="text-action" onClick={() => onOpenWorkspace(request.ticketId)}>Open request <ArrowRight size={16} /></button></article>) : <div className="friendly-empty"><Package size={30} /><h2>No parts requested yet</h2><p>Use Request parts when materials are needed for an active request.</p></div>}</section><section className="ui-panel"><div className="panel-heading"><h2>Available parts</h2></div><div className="request-toolbar pt-0"><label className="search-field"><Search size={18} /><span className="sr-only">Search parts</span><input placeholder="Search part name or code" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>{matching.length ? matching.map((item) => <div className="request-row" key={item.id}><div className="request-row-main"><h3>{item.name}</h3><p>{item.code} · {item.stock} {item.unit} available</p></div><span className="muted">{item.status}</span></div>) : <div className="friendly-empty"><p>No matching stock items.</p></div>}</section>
    {open && <Modal isOpen onClose={() => { if (!busy) setOpen(false); }} title="Request maintenance parts" footer={<><button className="ui-button secondary" disabled={busy} onClick={() => setOpen(false)}>Cancel</button><button className="ui-button primary" type="submit" form="request-parts" disabled={busy}>{busy ? 'Sending…' : 'Send parts request'}</button></>}><form id="request-parts" className="form-fields" onSubmit={submit}><label>Maintenance request *<select required value={ticketId} onChange={(event) => setTicketId(event.target.value)}><option value="">Choose a request</option>{tasks.map((ticket) => <option key={ticket.id} value={ticket.id}>{ticket.id} — {ticket.title}</option>)}</select></label><label>Stock item *<select required value={itemId} onChange={(event) => setItemId(event.target.value)}><option value="">Choose a part</option>{inventory.map((item) => <option key={item.id} value={item.id}>{item.name} — {item.stock} available</option>)}</select></label><label>Quantity *<input required type="number" min="1" max="500" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label></form></Modal>}
  </div>;
};
