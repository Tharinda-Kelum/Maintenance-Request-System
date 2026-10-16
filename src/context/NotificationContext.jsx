import React, { createContext, useContext } from 'react';
import { api } from '../api/client';
import { useApiResource } from '../hooks/useApiResource';
import { useToast } from './ToastContext';

const NotificationContext = createContext(null);
export const NotificationProvider = ({ children }) => {
  const resource = useApiResource('/notifications', [], { poll: 15000 });
  const { showToast } = useToast();
  const markAllAsRead = async () => {
    try { await api('/notifications/read-all', { method: 'PATCH' }); resource.setData((previous) => previous.map((item) => ({ ...item, unread: false }))); showToast('All updates marked as read.', 'success'); }
    catch (error) { showToast(error.message, 'error'); }
  };
  const toggleRead = async (id) => {
    const notification = resource.data.find((item) => item.id === id);
    if (!notification) return;
    try { await api(`/notifications/${id}`, { method: 'PATCH', body: { isRead: notification.unread } }); resource.setData((previous) => previous.map((item) => item.id === id ? { ...item, unread: !item.unread } : item)); }
    catch (error) { showToast(error.message, 'error'); }
  };
  return <NotificationContext.Provider value={{ notifications: resource.data, unreadCount: resource.data.filter((item) => item.unread).length, markAllAsRead, toggleRead, loading: resource.loading, ready: resource.ready, error: resource.error, reload: resource.reload }}>{children}</NotificationContext.Provider>;
};
export const useNotifications = () => useContext(NotificationContext);
