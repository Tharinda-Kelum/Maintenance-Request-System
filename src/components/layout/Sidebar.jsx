import React from 'react';
import { X, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { navigationForRole } from './navigation';
import universityLogo from '../../../University-of-Vavuniya-Logo-1024x1024.png';

export const Sidebar = ({ activeTab, onSelectTab, onToggleCollapse }) => {
  const { currentUser, activeRoleId, activeRoleConfig, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const ref = useDialogFocus(true, onToggleCollapse);
  return <div className="fixed inset-0 z-40 flex">
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onToggleCollapse} />
    <aside ref={ref} role="dialog" aria-modal="true" aria-label="All pages" className="sidebar-panel">
      <div className="sidebar-heading"><img src={universityLogo} alt="University of Vavuniya" /><div><strong>Campus maintenance</strong><small>University of Vavuniya</small></div><button className="icon-button" onClick={onToggleCollapse} aria-label="Close navigation menu"><X size={20} /></button></div>
      <div className="sidebar-account"><strong>{currentUser.name}</strong><span>{activeRoleConfig?.label}</span></div>
      <nav aria-label="All pages" className="sidebar-links">{navigationForRole(activeRoleId).map(([id, label, Icon]) => <button key={id} aria-current={activeTab === id ? 'page' : undefined} className={activeTab === id ? 'active' : ''} onClick={() => onSelectTab(id)}><Icon size={19} /><span>{label}</span>{id === 'notifications' && unreadCount > 0 && <small>{unreadCount}</small>}</button>)}</nav>
      <div className="sidebar-footer"><button className="ui-button secondary" onClick={() => onSelectTab('profile')}><UserCircle size={18} /> My profile</button><button className="icon-button" onClick={logout} aria-label="Sign out" title="Sign out"><LogOut size={19} /></button></div>
    </aside>
  </div>;
};
