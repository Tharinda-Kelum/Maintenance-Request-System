import React from 'react';
import { Search, Bell, Sun, Moon, Menu, UserCircle } from 'lucide-react';
import { primaryNavigation } from './navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSettings } from '../../context/SettingsContext';
import universityLogo from '../../../University-of-Vavuniya-Logo-1024x1024.png';

export const TopNav = ({ activeTab, onSelectTab, onOpenSearch, onToggleSidebar }) => {
  const { currentUser, activeRoleId, activeRoleConfig } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const { settings } = useSettings();
  const links = primaryNavigation(activeRoleId);
  const themeLabel = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-brand-group">
          <button className="icon-button menu-button" onClick={onToggleSidebar} aria-label="Open navigation menu" title="All pages">
            <Menu size={21} />
          </button>
          <button className="brand-button" onClick={() => onSelectTab(links[0][0])}>
            <img src={universityLogo} alt="University of Vavuniya" />
            <span><strong>{settings.systemName}</strong><small>University of Vavuniya</small></span>
          </button>
        </div>
        <div className="header-actions">
          <button className="icon-button" onClick={onOpenSearch} aria-label="Search requests" title="Search (Ctrl+K)">
            <Search size={20} />
          </button>
          <button className="icon-button notification-button" onClick={() => onSelectTab('notifications')} aria-label={`Notifications, ${unreadCount} unread`} title="Notifications">
            <Bell size={20} />{unreadCount > 0 && <span>{unreadCount}</span>}
          </button>
          <button className="icon-button" onClick={toggleTheme} title={themeLabel} aria-label={themeLabel}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="profile-button" onClick={() => onSelectTab('profile')} title="My profile">
            <span className="profile-avatar">{currentUser.avatar || <UserCircle size={21} />}</span>
            <span className="profile-copy"><strong>{currentUser.name}</strong><small>{activeRoleConfig?.label.split('/')[0].trim()}</small></span>
          </button>
        </div>
      </div>
      <nav className="main-navigation" aria-label="Main navigation">
        {links.map(([id, label, Icon]) => {
          const active = activeTab === id
            || (id === 'my_requests' && ['requests', 'request_detail'].includes(activeTab))
            || (id === 'requests' && activeTab === 'request_detail');
          return (
            <button key={id} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} onClick={() => onSelectTab(id)}>
              <Icon size={17} /><span>{label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
