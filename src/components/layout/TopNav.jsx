import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  User,
  Shield,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_NOTIFICATIONS } from '../../data/adminData';

export const TopNav = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenNewRequest,
  onToggleSidebar
}) => {
  const { currentUser, activeRoleId, switchRole, availableRoles } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

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

  // Main menu items for the pill bar
  const navPills = [
    { id: activeRoleId === 'general_user' ? 'staff_dashboard' : activeRoleId === 'dept_admin' ? 'dashboard' : activeRoleId === 'technician' ? 'technician_dashboard' : activeRoleId === 'store_keeper' ? 'inventory_dashboard' : 'superadmin_dashboard', label: 'Overview' },
    { id: 'requests', label: 'Requests' },
    { id: activeRoleId === 'technician' ? 'field_workspace' : 'review_queue', label: activeRoleId === 'technician' ? 'Tasks' : 'Review Queue' },
    { id: 'inventory_items', label: 'Stores' },
    { id: 'reports', label: 'Analytics' },
    { id: 'audit_logs', label: 'Audit' }
  ];

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-8 py-3.5 bg-[#0B0F17]/95 backdrop-blur-md border-b border-[#1A2234]">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity Logo & Name */}
        <div
          onClick={() => onSelectTab(navPills[0].id)}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#bbf246] text-[#020617] flex items-center justify-center font-extrabold shadow-[0_0_20px_rgba(187,242,70,0.45)] transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5 fill-[#020617]" />
          </div>
          <div className="hidden lg:block">
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>Maintenance Request System</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#bbf246]/15 text-[#a3e635] border border-[#a3e635]/30 font-bold">
                UoV
              </span>
            </div>
            <p className="text-[11px] text-slate-400">University of Vavuniya</p>
          </div>
        </div>

        {/* Center: Sleek Horizontal Pill Menu (Exactly matching reference image!) */}
        <nav className="hidden md:flex items-center bg-[#131926] p-1.5 rounded-full border border-[#1F293D] shadow-inner">
          {navPills.map((pill) => {
            const isActive =
              activeTab === pill.id ||
              (pill.id === 'requests' && (activeTab === 'my_requests' || activeTab === 'requests')) ||
              (pill.id === 'dashboard' && activeTab === 'dashboard') ||
              (pill.id === 'staff_dashboard' && activeTab === 'staff_dashboard') ||
              (pill.id === 'review_queue' && activeTab === 'review_queue');

            return (
              <button
                key={pill.id}
                onClick={() => onSelectTab(pill.id)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_20px_rgba(187,242,70,0.5)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#020617]" />}
                <span>{pill.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Role Switcher, Search, Notifications, Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full bg-[#131926] hover:bg-[#1A2234] border border-[#1F293D] text-slate-300 hover:text-white transition-colors"
            title="Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Role Switcher Pill Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131926] hover:bg-[#1A2234] border border-[#1F293D] text-xs font-medium text-slate-200 transition-colors"
              title="Switch role"
            >
              <Shield className="w-3.5 h-3.5 text-[#a3e635]" />
              <span className="hidden sm:inline text-slate-400">Role:</span>
              <span className="font-semibold text-white">
                {availableRoles[Object.keys(availableRoles).find((k) => availableRoles[k].id === activeRoleId)]?.label.split('/')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#131926] rounded-2xl shadow-modal border border-[#1F293D] p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <div className="px-3 py-2 border-b border-[#1F293D]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Switch Active Persona
                  </span>
                </div>
                <div className="py-1 space-y-1">
                  {Object.values(availableRoles).map((role) => {
                    const isCurrent = activeRoleId === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                          isCurrent
                            ? 'bg-[#bbf246]/15 text-[#a3e635] font-bold border border-[#a3e635]/40'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                            {role.description}
                          </div>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#a3e635] flex-shrink-0" />}
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
              onClick={() => setShowNotifPopover(!showNotifPopover)}
              className="relative p-2 rounded-full bg-[#131926] hover:bg-[#1A2234] border border-[#1F293D] text-slate-300 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#a3e635] shadow-[0_0_10px_rgba(163,230,53,0.8)] ring-2 ring-[#0B0F17]" />
              )}
            </button>

            {showNotifPopover && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#131926] rounded-2xl shadow-modal border border-[#1F293D] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <div className="px-4 py-3 border-b border-[#1F293D] bg-[#0E131E] flex items-center justify-between">
                  <span className="font-bold text-white">Notifications</span>
                  <button
                    onClick={() => {
                      setShowNotifPopover(false);
                      onSelectTab('notifications');
                    }}
                    className="text-[11px] text-[#a3e635] hover:underline font-bold"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#1F293D]/60">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotifPopover(false);
                        onSelectTab('notifications');
                      }}
                      className="p-3 cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div
            onClick={() => onSelectTab('profile')}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-[#1F293D] hover:border-[#a3e635] text-white font-bold text-xs flex items-center justify-center cursor-pointer transition-all shadow-md"
            title={`${currentUser.name} (${currentUser.roleName || currentUser.role})`}
          >
            {currentUser.avatar || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
