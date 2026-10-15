import React, { createContext, useContext, useState } from 'react';
import { INITIAL_INVENTORY_ITEMS, INITIAL_ITEM_REQUESTS, INITIAL_TRANSACTIONS } from '../data/inventoryData';
import { useToast } from './ToastContext';
import { useTickets } from './TicketContext';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY_ITEMS);
  const [itemRequests, setItemRequests] = useState(INITIAL_ITEM_REQUESTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const { showToast } = useToast();
  const { updatePartRequest } = useTickets();

  const createItemRequest = (ticket, item, quantity, urgency, technician) => {
    if (!Number.isInteger(quantity) || quantity < 1) return null;
    const request = { id: `REQ-${crypto.randomUUID()}`, ticketId: ticket.id, technician: technician.name, technicianTrade: technician.trade || technician.roleName, itemCode: item.code, itemName: item.name, quantity, unit: item.unit, urgency, requestedAt: new Date().toLocaleString(), status: 'Pending', notes: `For ${ticket.room}` };
    setItemRequests((previous) => [request, ...previous]);
    return request;
  };

  const approveAndIssueItem = (requestId, storeKeeperName = "M. Fernando") => {
    const req = itemRequests.find((r) => r.id === requestId);
    if (!req || req.status !== 'Pending') return;

    // Check stock
    const item = inventory.find((i) => i.code === req.itemCode);
    if (!item) return;

    if (item.stock < req.quantity) {
      showToast(`Insufficient stock (${item.stock} available). Please raise Purchase Request.`, 'danger');
      return;
    }

    // Deduct stock
    const updatedStock = item.stock - req.quantity;
    const newStatus = updatedStock === 0 ? "Out of Stock" : updatedStock <= item.reorderLevel ? "Low Stock" : "In Stock";

    setInventory((prev) =>
      prev.map((i) =>
        i.code === req.itemCode ? { ...i, stock: updatedStock, status: newStatus } : i
      )
    );

    // Update request
    setItemRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "Issued" } : r))
    );

    // Add transaction log
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', Today';
    const newTxn = {
      id: `TXN-2026-${Math.floor(450 + Math.random() * 50)}`,
      timestamp,
      type: "Issue",
      itemCode: item.code,
      itemName: item.name,
      quantity: req.quantity,
      issuedTo: `${req.technician} (${req.technicianTrade})`,
      ticketRef: req.ticketId,
      authorizedBy: `${storeKeeperName} (Store Keeper)`
    };

    setTransactions((prev) => [newTxn, ...prev]);
    updatePartRequest(req.ticketId, req.id, 'Issued');
    showToast(`Issued ${req.quantity} ${req.unit} of ${item.name} for ticket ${req.ticketId}`, 'success');
  };

  const rejectItemRequest = (requestId, reason = "Item not in current stock") => {
    const request = itemRequests.find((item) => item.id === requestId);
    if (!request || request.status !== 'Pending') return;
    setItemRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: `Rejected: ${reason}` } : r))
    );
    updatePartRequest(request.ticketId, request.id, 'Rejected');
    showToast("Item requisition rejected", 'warning');
  };

  const raisePurchaseRequest = (itemCode, requestedQty, urgency = "High") => {
    const item = inventory.find((i) => i.code === itemCode);
    if (!item || !Number.isInteger(requestedQty) || requestedQty < 1 || requestedQty > 500) return;
    const id = `PO-${crypto.randomUUID().slice(0, 8)}`;
    setTransactions((previous) => [{ id, timestamp: new Date().toLocaleString(), type: 'Purchase request', itemCode, itemName: item.name, quantity: requestedQty, issuedTo: 'Central Stores', ticketRef: id, authorizedBy: `Requested · ${urgency}` }, ...previous]);
    showToast(`Purchase request for ${requestedQty} ${item.unit} of ${item.name} recorded in issue history.`, 'success');
  };

  const adjustStock = (itemId, delta, reason = "Physical stock verification") => {
    const item = inventory.find((entry) => entry.id === itemId);
    if (!item || !Number.isFinite(delta)) return;
    const actualDelta = Math.max(0, item.stock + delta) - item.stock;
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.max(0, item.stock + delta);
          const newStatus = newStock === 0 ? "Out of Stock" : newStock <= item.reorderLevel ? "Low Stock" : "In Stock";
          return { ...item, stock: newStock, status: newStatus };
        }
        return item;
      })
    );
    setTransactions((previous) => [{ id: `ADJ-${crypto.randomUUID().slice(0, 8)}`, timestamp: new Date().toLocaleString(), type: 'Stock adjustment', itemCode: item.code, itemName: item.name, quantity: actualDelta, issuedTo: 'Central Stores', ticketRef: 'Stock count', authorizedBy: reason }, ...previous]);
    showToast("Inventory quantity updated", 'success');
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        itemRequests,
        transactions,
        createItemRequest,
        approveAndIssueItem,
        rejectItemRequest,
        raisePurchaseRequest,
        adjustStock
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
