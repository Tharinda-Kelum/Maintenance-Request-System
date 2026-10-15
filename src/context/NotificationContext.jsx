import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_NOTIFICATIONS } from '../data/adminData';
import { INITIAL_TICKETS } from '../data/mockData';
import { useTickets } from './TicketContext';

const NotificationContext = createContext(null);
export const NotificationProvider = ({ children }) => {
  const { activeRoleId, currentUser } = useAuth();
  const { tickets } = useTickets();
  const [allNotifications, setAllNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [readActivity, setReadActivity] = useState({});
  const activity = tickets.filter((ticket) => activeRoleId === 'super_admin' || (activeRoleId === 'general_user' && ticket.requester.email === currentUser?.email) || (activeRoleId === 'dept_admin' && ticket.department === currentUser?.department) || (activeRoleId === 'technician' && ticket.assignedTo?.name === currentUser?.name)).flatMap((ticket) => {
    const initialLength = INITIAL_TICKETS.find((item) => item.id === ticket.id)?.timeline.length || 0;
    return ticket.timeline.slice(initialLength).map((event, index) => {
      const id = `activity-${ticket.id}-${index + initialLength}`;
      return { id, category: event.status === 'Assigned' ? 'Assignments' : 'Requests', title: `${ticket.id}: ${event.status}`, message: event.note, timestamp: event.time, ticketId: ticket.id, unread: !readActivity[`${activeRoleId}:${id}`] };
    }).reverse();
  });
  const notifications = [...activity, ...allNotifications.filter((item) => item.roleTarget === 'all' || item.roleTarget === activeRoleId || activeRoleId === 'super_admin')];
  const visibleIds = new Set(notifications.map((item) => item.id));
  const markAllAsRead = () => { setAllNotifications((previous) => previous.map((item) => visibleIds.has(item.id) ? { ...item, unread: false } : item)); setReadActivity((previous) => ({ ...previous, ...Object.fromEntries(activity.map((item) => [`${activeRoleId}:${item.id}`, true])) })); };
  const toggleRead = (id) => { if (id.startsWith('activity-')) { const key = `${activeRoleId}:${id}`; setReadActivity((previous) => ({ ...previous, [key]: !previous[key] })); } else setAllNotifications((previous) => previous.map((item) => item.id === id ? { ...item, unread: !item.unread } : item)); };
  return <NotificationContext.Provider value={{ notifications, unreadCount: notifications.filter((item) => item.unread).length, markAllAsRead, toggleRead }}>{children}</NotificationContext.Provider>;
};
export const useNotifications = () => useContext(NotificationContext);
