import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Wrench,
  CheckSquare,
  Package,
  BarChart3,
  Bell,
  Users,
  Building2,
  Settings,
  ShieldCheck,
  FolderKanban,
  LogOut,
  ChevronRight,
  Sliders,
  AlertOctagon,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import { useInventory } from '../../context/InventoryContext';

export const Sidebar = ({ activeTab, onSelectTab, isCollapsed, onToggleCollapse }) => {
  const { currentUser, activeRoleId, switchRole, logout, availableRoles } = useAuth();
  const { tickets } = useTickets();
  const { itemRequests, inventory } = useInventory();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Badge counts
  const pendingReviewCount = tickets.filter((t) => t.status === 'Pending Review' || t.status === 'Submitted').length;
  const technicianTasksCount = tickets.filter((t) => t.status === 'In Progress' || t.status === 'Assigned' || t.status === 'Inspection').length;
  const pendingInventoryCount = itemRequests.filter((r) => r.status === 'Pending').length;
  const lowStockCount = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock').length;

  // Build navigation items based on active role
  const getNavSections = () => {
    switch (activeRoleId) {
      case 'dept_admin':
        return [
          {
            title: 'OPERATIONS',
            items: [
              { id: 'dashboard', label: 'Department Overview', icon: LayoutDashboard },
              { id: 'review_queue', label: 'Review Queue', icon: CheckSquare, badge: pendingReviewCount, badgeColor: 'bg-[#182132] text-[#a3e635] border border-[#1F293D]' },
              { id: 'requests', label: 'Department Requests', icon: FileText },
              { id: 'technicians', label: 'Technician Workload', icon: Wrench },
              { id: 'reports', label: 'Department Reports', icon: BarChart3 }
            ]
          },
          {
            title: 'GENERAL',
            items: [
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: 2 },
              { id: 'locations', label: 'Department Rooms', icon: Building2 }
            ]
          }
        ];

      case 'technician':
        return [
          {
            title: 'FIELD WORK',
            items: [
              { id: 'technician_dashboard', label: 'My Task Queue', icon: CheckSquare, badge: technicianTasksCount, badgeColor: 'bg-[#182132] text-[#a3e635] border border-[#1F293D]' },
              { id: 'field_workspace', label: 'Task Workspace', icon: Wrench },
              { id: 'parts_request', label: 'Parts Requisition', icon: Package },
              { id: 'requests', label: 'All Campus Work Orders', icon: FileText }
            ]
          },
          {
            title: 'COMMUNICATION',
            items: [
              { id: 'notifications', label: 'Job Alerts', icon: Bell }
            ]
          }
        ];

      case 'store_keeper':
        return [
          {
            title: 'STORES & INVENTORY',
            items: [
              { id: 'inventory_dashboard', label: 'Stores Overview', icon: LayoutDashboard },
              { id: 'inventory_items', label: 'Stock Catalog', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} alert` : null, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
              { id: 'item_requests', label: 'Parts Requests', icon: CheckSquare, badge: pendingInventoryCount, badgeColor: 'bg-[#182132] text-[#a3e635] border border-[#1F293D]' },
              { id: 'transactions', label: 'Issuance History', icon: FolderKanban }
            ]
          },
          {
            title: 'GENERAL',
            items: [
              { id: 'requests', label: 'Maintenance Tickets', icon: FileText },
              { id: 'notifications', label: 'Stock Alerts', icon: Bell }
            ]
          }
        ];

      case 'super_admin':
        return [
          {
            title: 'MAIN',
            items: [
              { id: 'superadmin_dashboard', label: 'Global Overview', icon: LayoutDashboard },
              { id: 'requests', label: 'All Requests', icon: FileText },
              { id: 'reports', label: 'Analytics & SLA', icon: BarChart3 },
              { id: 'inventory_items', label: 'Central Stores', icon: Package }
            ]
          },
          {
            title: 'MANAGEMENT',
            items: [
              { id: 'users', label: 'Users Directory', icon: Users },
              { id: 'permissions', label: 'Roles & Permissions', icon: ShieldCheck },
              { id: 'locations', label: 'Campus Locations', icon: Building2 },
              { id: 'categories', label: 'Fault Categories', icon: Layers },
              { id: 'workflow', label: 'Workflow & SLAs', icon: Sliders },
              { id: 'audit_logs', label: 'Audit Security Logs', icon: AlertOctagon },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ]
          }
        ];

      case 'general_user':
      default:
        return [
          {
            title: 'PORTAL',
            items: [
              { id: 'staff_dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'my_requests', label: 'My Requests', icon: FileText },
              { id: 'create_request', label: '+ New Request', icon: CheckSquare, highlight: true },
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: 1 }
            ]
          },
          {
            title: 'RESOURCES',
            items: [
              { id: 'campus_info', label: 'Campus Facility Guide', icon: Building2 }
            ]
          }
        ];
    }
  };

  const navSections = getNavSections();

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onToggleCollapse}
      />

      <aside className="relative z-50 w-72 h-full bg-[#0D111A] text-slate-200 border-r border-[#1F293D] flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1F293D] bg-[#0A0D15]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#bbf246] text-[#020617] flex items-center justify-center font-extrabold text-xs shadow-[0_0_16px_rgba(187,242,70,0.4)]">
              UoV
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Maintenance System
              </h2>
              <span className="text-[10px] text-slate-400 font-medium block">
                University of Vavuniya
              </span>
            </div>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Bar */}
        <div className="px-5 py-3 bg-[#131926] border-b border-[#1F293D] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Viewing Persona
            </span>
            <span className="text-xs font-semibold text-lime-bright truncate block">
              {availableRoles[Object.keys(availableRoles).find((k) => availableRoles[k].id === activeRoleId)]?.label}
            </span>
          </div>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="text-[10px] px-2 py-1 rounded bg-[#1F293D] hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Change
          </button>
        </div>

        {/* Role Menu Popover */}
        {showRoleMenu && (
          <div className="p-2 bg-[#0E131E] border-b border-[#1F293D] space-y-1 text-xs">
            {Object.values(availableRoles).map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  switchRole(role.id);
                  setShowRoleMenu(false);
                  if (role.id === 'general_user') onSelectTab('staff_dashboard');
                  else if (role.id === 'dept_admin') onSelectTab('dashboard');
                  else if (role.id === 'technician') onSelectTab('technician_dashboard');
                  else if (role.id === 'store_keeper') onSelectTab('inventory_dashboard');
                  else if (role.id === 'super_admin') onSelectTab('superadmin_dashboard');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  activeRoleId === role.id
                    ? 'bg-[#bbf246] text-[#020617] font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{role.label}</span>
                {activeRoleId === role.id && <span className="text-[10px] font-extrabold uppercase">Active</span>}
              </button>
            ))}
          </div>
        )}

        {/* Nav List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-[#bbf246] text-[#020617] font-bold shadow-[0_0_16px_rgba(187,242,70,0.4)]'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive ? 'text-[#020617]' : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      {item.badge !== undefined && item.badge !== null && (
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-[#020617] text-[#a3e635]' : 'bg-[#182132] text-[#a3e635] border border-[#1F293D]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1F293D] bg-[#0A0D15] flex items-center justify-between">
          <div
            onClick={() => onSelectTab('profile')}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-lime-bright font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#1F293D]">
              {currentUser.avatar || 'U'}
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.roleName || currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </div>
  );
};
