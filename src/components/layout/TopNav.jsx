import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Shield,
  CheckCircle2,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_NOTIFICATIONS } from '../../data/adminData';
import universityLogo from '../../../University-of-Vavuniya-Logo-1024x1024.png';

export const TopNav = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onToggleSidebar
}) => {
  const { currentUser, activeRoleId, switchRole, availableRoles } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [notifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleRoleSelect = (roleId) => {
    switchRole(roleId);
    setShowRoleDropdown(false);
    if (roleId === 'general_user') onSelectTab('staff_dashboard');
    else if (roleId === 'dept_admin') onSelectTab('dashboard');
    else if (roleId === 'technician') onSelectTab('technician_dashboard');
    else if (roleId === 'store_keeper') onSelectTab('inventory_dashboard');
    else if (roleId === 'super_admin') onSelectTab('superadmin_dashboard');
  };

  const navPillsByRole = {
    general_user: [
      { id: 'staff_dashboard', label: 'Overview' },
      { id: 'my_requests', label: 'My Requests' },
      { id: 'create_request', label: 'New Request' },
      { id: 'notifications', label: 'Notifications' },
    ],
    dept_admin: [
      { id: 'dashboard', label: 'Overview' },
      { id: 'review_queue', label: 'Review Queue' },
      { id: 'requests', label: 'Requests' },
      { id: 'technicians', label: 'Technicians' },
      { id: 'reports', label: 'Reports' },
    ],
    technician: [
      { id: 'technician_dashboard', label: 'Overview' },
      { id: 'field_workspace', label: 'Workspace' },
      { id: 'parts_request', label: 'Parts' },
      { id: 'requests', label: 'Work Orders' },
    ],
    store_keeper: [
      { id: 'inventory_dashboard', label: 'Overview' },
      { id: 'inventory_items', label: 'Stock' },
      { id: 'item_requests', label: 'Parts Requests' },
      { id: 'transactions', label: 'Transactions' },
    ],
    super_admin: [
      { id: 'superadmin_dashboard', label: 'Overview' },
      { id: 'requests', label: 'Requests' },
      { id: 'reports', label: 'Analytics' },
      { id: 'users', label: 'Users' },
      { id: 'audit_logs', label: 'Audit' },
    ],
  };

  const navPills = navPillsByRole[activeRoleId] || navPillsByRole.general_user;

  return (
    <header
      className="sticky top-0 z-30 px-4 sm:px-8 py-3.5 backdrop-blur-md border-b"
      style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-full transition-colors"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            aria-label="Open navigation menu"
            title="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Left: Brand Identity Logo & Name */}
          <div
            onClick={() => onSelectTab(navPills[0].id)}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <img
              src={universityLogo}
              alt="University of Vavuniya logo"
              className="w-9 h-9 object-contain flex-shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="hidden xl:block">
              <div className="text-sm font-bold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span>Maintenance Request System</span>
                <span
                  className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold"
                  style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-bright)', border: '1px solid var(--accent-border)' }}
                >
                  UoV
                </span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>University of Vavuniya</p>
            </div>
          </div>
        </div>

        {/* Center: Sleek Horizontal Pill Menu */}
        <nav
          className="hidden md:flex items-center p-1.5 rounded-full shadow-inner"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          {navPills.map((pill) => {
            const isActive =
              activeTab === pill.id ||
              (pill.id === 'requests' && (activeTab === 'my_requests' || activeTab === 'requests' || activeTab === 'request_detail')) ||
              (pill.id === 'my_requests' && (activeTab === 'my_requests' || activeTab === 'request_detail')) ||
              (pill.id === 'field_workspace' && activeTab === 'field_workspace') ||
              (pill.id === 'inventory_items' && activeTab === 'inventory_items') ||
              (pill.id === 'dashboard' && activeTab === 'dashboard') ||
              (pill.id === 'staff_dashboard' && activeTab === 'staff_dashboard') ||
              (pill.id === 'review_queue' && activeTab === 'review_queue');

            return (
              <button
                key={pill.id}
                onClick={() => onSelectTab(pill.id)}
                className="px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-2"
                style={isActive ? {
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-text)',
                  boxShadow: 'var(--accent-shadow)'
                } : {
                  color: 'var(--text-secondary)'
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-text)' }} />}
                <span>{pill.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Role Switcher, Search, Notifications, Theme Toggle, Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search */}
          <button
              type="button"
            onClick={onOpenSearch}
            className="p-2 rounded-full transition-colors"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-surface)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}
            title="Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Role Switcher Pill Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifPopover(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              title="Switch role"
              aria-expanded={showRoleDropdown}
            >
              <Shield className="w-3.5 h-3.5" style={{ color: 'var(--accent-bright)' }} />
              <span className="hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>Role:</span>
              <span className="font-semibold hidden sm:inline" style={{ color: 'var(--text-primary)' }}>
                {availableRoles[Object.keys(availableRoles).find((k) => availableRoles[k].id === activeRoleId)]?.label.split('/')[0]}
              </span>
              <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            </button>

            {showRoleDropdown && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl shadow-modal p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                    Switch Active Persona
                  </span>
                </div>
                <div className="py-1 space-y-1">
                  {Object.values(availableRoles).map((role) => {
                    const isCurrent = activeRoleId === role.id;
                    return (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className="w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between"
                        style={isCurrent ? {
                          backgroundColor: 'var(--accent-subtle)',
                          color: 'var(--accent-bright)',
                          fontWeight: 700,
                          border: '1px solid var(--accent-border)'
                        } : {
                          color: 'var(--text-secondary)'
                        }}
                        onMouseEnter={e => { if (!isCurrent) { e.currentTarget.style.backgroundColor = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                        onMouseLeave={e => { if (!isCurrent) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                      >
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-[10px] truncate max-w-[170px]" style={{ color: 'var(--text-muted)' }}>
                            {role.description}
                          </div>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-bright)' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Icon Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifPopover(!showNotifPopover);
                setShowRoleDropdown(false);
              }}
              className="relative p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-surface)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}
              title="Notifications"
              aria-expanded={showNotifPopover}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2"
                  style={{ backgroundColor: 'var(--accent-bright)', boxShadow: 'var(--accent-shadow)', ringColor: 'var(--bg-base)' }}
                />
              )}
            </button>

            {showNotifPopover && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-modal overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 text-xs"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-surface2)' }}
                >
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                  <button
                    type="button"
                    onClick={() => { setShowNotifPopover(false); onSelectTab('notifications'); }}
                    className="text-[11px] hover:underline font-bold"
                    style={{ color: 'var(--accent-bright)' }}
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto" style={{ borderTop: '1px solid var(--border)' }}>
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => { setShowNotifPopover(false); onSelectTab('notifications'); }}
                      className="p-3 cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</span>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Theme Toggle Switch ── */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-300 overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--accent-border)',
              boxShadow: 'var(--accent-shadow)'
            }}
          >
            {/* Track */}
            <span
              className="relative inline-flex items-center w-9 h-5 rounded-full transition-all duration-300"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {/* Knob */}
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
                style={{
                  left: isDark ? '1px' : 'calc(100% - 17px)',
                  backgroundColor: 'var(--accent-text)'
                }}
              >
                {isDark
                  ? <Moon className="w-2.5 h-2.5" style={{ color: 'var(--accent)' }} />
                  : <Sun className="w-2.5 h-2.5" style={{ color: 'var(--accent)' }} />
                }
              </span>
            </span>
            <span className="text-[11px] font-bold hidden sm:inline" style={{ color: 'var(--accent-bright)' }}>
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* User Profile Avatar */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectTab('profile')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onSelectTab('profile');
            }}
            className="w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center cursor-pointer transition-all shadow-md"
            style={{
              background: 'linear-gradient(to top right, var(--bg-surface), var(--bg-card))',
              border: '2px solid var(--border)',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-bright)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            title={`${currentUser.name} (${currentUser.roleName || currentUser.role})`}
          >
            {currentUser.avatar || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
