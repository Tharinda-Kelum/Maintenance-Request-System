import React, { createContext, useContext } from 'react';
import { api } from '../api/client';
import { useApiResource } from '../hooks/useApiResource';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const InventoryContext = createContext(null);
export const InventoryProvider = ({ children }) => {
  const { activeRoleId } = useAuth();
  const { showToast } = useToast();
  const canView = ['technician', 'supervisor', 'maintenance_head', 'store_keeper', 'super_admin'].includes(activeRoleId);
  const canManage = ['store_keeper', 'maintenance_head', 'super_admin'].includes(activeRoleId);
  const inventory = useApiResource('/inventory', [], { enabled: canView, poll: 15000 });
  const requests = useApiResource('/inventory/requests', [], { enabled: canView, poll: 15000 });
  const transactions = useApiResource('/inventory/transactions', [], { enabled: canManage });
  const mutate = async (path, method, body, message) => {
    try { const result = await api(path, { method, body }); showToast(message, 'success'); return result.data || true; }
    catch (error) { showToast(error.message, 'error'); return null; }
  };
  const createItemRequest = async (ticket, item, quantity, urgency) => {
    const result = await mutate('/inventory/requests', 'POST', { ticketId: ticket.id, itemId: item.id, quantity, urgency }, 'Parts request sent to Central Stores.');
    if (result) requests.setData((previous) => [result, ...previous]);
    return result;
  };
  return <InventoryContext.Provider value={{
    inventory: inventory.data, itemRequests: requests.data, transactions: transactions.data,
    loading: inventory.loading || requests.loading || transactions.loading,
    ready: inventory.ready && requests.ready && transactions.ready,
    error: inventory.error || requests.error || transactions.error,
    reload: () => Promise.all([inventory.reload(), requests.reload(), transactions.reload()]),
    createItemRequest,
    approveAndIssueItem: (id) => mutate(`/inventory/requests/${id}/issue`, 'PATCH', {}, 'Parts issued and stock updated.'),
    rejectItemRequest: (id, reason) => mutate(`/inventory/requests/${id}/reject`, 'PATCH', { reason }, 'Parts request rejected.'),
    raisePurchaseRequest: (itemCode, quantity, urgency) => mutate('/inventory/purchase-requests', 'POST', { itemCode, quantity, urgency }, 'Purchase request saved.'),
    adjustStock: (id, delta, reason = 'Stock verification') => mutate(`/inventory/${id}/adjust`, 'POST', { delta, reason }, 'Stock updated.')
  }}>{children}</InventoryContext.Provider>;
};
export const useInventory = () => useContext(InventoryContext);
