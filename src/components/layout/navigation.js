import { Home, FileText, Plus, Bell, BarChart3, Users, Wrench, Package, ClipboardCheck, History, Building2, ShieldCheck, Settings, ListChecks, ScrollText } from 'lucide-react';
import { canAccessTab, getRoleHome } from '../../auth/accessControl';

export const navigationForRole = (role) => {
  const home = getRoleHome(role);
  const links = [
    [home, role === 'technician' ? 'My tasks' : 'Home', Home],
    [role === 'general_user' ? 'my_requests' : 'requests', role === 'general_user' ? 'My requests' : 'Requests', FileText],
    ['create_request', 'New request', Plus], ['notifications', 'Updates', Bell],
    ['reports', 'Reports', BarChart3], ['technicians', 'Maintenance team', Wrench],
    ['parts_request', 'Parts requests', Package], ['inventory_items', 'Stock items', Package],
    ['item_requests', 'Parts to issue', ClipboardCheck], ['transactions', 'Stock history', History],
    ['users', 'User accounts', Users], ['campus_info', 'Campus locations', Building2],
    ['permissions', 'Roles & access', ShieldCheck], ['workflow', 'Response targets', ListChecks],
    ['audit_logs', 'Activity logs', ScrollText], ['settings', 'System settings', Settings]
  ];
  return links.filter(([id]) => canAccessTab(role, id));
};
export const primaryNavigation = (role) => {
  const links = navigationForRole(role);
  if (role === 'general_user') return links.slice(0, 4);
  if (role === 'store_keeper') return links.filter(([id]) => [getRoleHome(role), 'inventory_items', 'item_requests', 'transactions'].includes(id));
  if (role === 'technician') return links.filter(([id]) => [getRoleHome(role), 'requests', 'parts_request', 'notifications'].includes(id));
  return links.filter(([id]) => [getRoleHome(role), 'requests', 'reports', 'users'].includes(id)).slice(0, 4);
};
