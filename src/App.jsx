import React, { useState } from 'react';
import './workflow.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketProvider, useTickets } from './context/TicketContext';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { LocationProvider, useLocations } from './context/LocationContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AppLayout } from './components/layout/AppLayout';
import { canAccessTab, getRoleHome } from './auth/accessControl';
import { LoginPage } from './pages/auth/LoginPage';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { CreateRequestPage } from './pages/staff/CreateRequestPage';
import { MyRequestsPage } from './pages/staff/MyRequestsPage';
import { RequestDetailPage } from './pages/staff/RequestDetailPage';
import { UserProfilePage } from './pages/staff/UserProfilePage';
import { WorkflowDashboard } from './pages/WorkflowDashboard';
import { TechnicianWorkloadPage } from './pages/admin/TechnicianWorkloadPage';
import { TaskWorkspacePage } from './pages/technician/TaskWorkspacePage';
import { PartsRequestsPage } from './pages/technician/PartsRequestsPage';
import { InventoryDashboard } from './pages/inventory/InventoryDashboard';
import { AnalyticsDashboard } from './pages/reports/AnalyticsDashboard';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { UserManagementPage } from './pages/superadmin/UserManagementPage';
import { RolesPermissionsPage } from './pages/superadmin/RolesPermissionsPage';
import { CampusLocationsPage } from './pages/superadmin/CampusLocationsPage';
import { WorkflowSettingsPage } from './pages/superadmin/WorkflowSettingsPage';
import { AuditLogsPage } from './pages/superadmin/AuditLogsPage';
import { SystemSettingsPage } from './pages/superadmin/SystemSettingsPage';
import { NotFoundPage, UnauthorizedPage } from './pages/errors/NotFoundPage';

const MainApp = () => {
  const { currentUser } = useAuth();
  return <AccountWorkspace key={currentUser?.id || 'signed-out'} />;
};
const AccountWorkspace = () => {
  const auth = useAuth();
  const requests = useTickets();
  const inventory = useInventory();
  const locations = useLocations();
  const settings = useSettings();
  const notifications = useNotifications();
  const [tab, setTab] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  if (auth.isLoading) return <div className="startup-screen" role="status"><span className="loading-ring" /><p>Loading your account…</p></div>;
  if (!auth.isAuthenticated) return <LoginPage onLoginSuccess={(role) => { setTab(getRoleHome(role)); setSelectedTicketId(null); }} />;
  const activeTab = tab || getRoleHome(auth.activeRoleId);
  const navigate = (id) => setTab(canAccessTab(auth.activeRoleId, id) ? id : '__unauthorized__');
  const selectTicket = (id) => { setSelectedTicketId(id); navigate('request_detail'); };
  const openWorkspace = (id) => { setSelectedTicketId(id); navigate('field_workspace'); };
  const resources = [requests, inventory, locations, settings, notifications];
  const ready = resources.every((resource) => resource.ready);
  const error = resources.find((resource) => resource.error)?.error;
  const reload = () => Promise.all(resources.map((resource) => resource.reload()));
  const view = () => {
    if (!canAccessTab(auth.activeRoleId, activeTab)) return <UnauthorizedPage onGoHome={() => navigate(getRoleHome(auth.activeRoleId))} />;
    switch (activeTab) {
      case 'staff_dashboard': return <StaffDashboard onNavigate={navigate} onSelectTicket={selectTicket} />;
      case 'create_request': return <CreateRequestPage onNavigate={navigate} onSelectTicket={selectTicket} />;
      case 'requests': case 'my_requests': return <MyRequestsPage onNavigate={navigate} onSelectTicket={selectTicket} />;
      case 'request_detail': return <RequestDetailPage key={selectedTicketId} ticketId={selectedTicketId} onBack={() => navigate(auth.activeRoleId === 'general_user' ? 'my_requests' : 'requests')} onOpenWorkspace={openWorkspace} />;
      case 'workflow_dashboard': case 'dashboard': case 'review_queue': case 'technician_dashboard': return <WorkflowDashboard onSelectTicket={selectTicket} onOpenWorkspace={openWorkspace} />;
      case 'field_workspace': return <TaskWorkspacePage key={selectedTicketId} ticketId={selectedTicketId} onBack={() => navigate(getRoleHome(auth.activeRoleId))} />;
      case 'technicians': return <TechnicianWorkloadPage onSelectTicket={selectTicket} />;
      case 'parts_request': return <PartsRequestsPage onOpenWorkspace={auth.activeRoleId === 'technician' ? openWorkspace : selectTicket} />;
      case 'inventory_dashboard': case 'inventory_items': case 'item_requests': case 'transactions': return <InventoryDashboard activeView={activeTab} onNavigate={navigate} />;
      case 'reports': case 'superadmin_dashboard': return <AnalyticsDashboard onNavigate={navigate} onSelectTicket={selectTicket} />;
      case 'users': return <UserManagementPage />;
      case 'permissions': return <RolesPermissionsPage />;
      case 'locations': case 'campus_info': return <CampusLocationsPage />;
      case 'workflow': case 'categories': return <WorkflowSettingsPage />;
      case 'audit_logs': return <AuditLogsPage />;
      case 'settings': return <SystemSettingsPage />;
      case 'notifications': return <NotificationsPage onSelectTicket={selectTicket} />;
      case 'profile': return <UserProfilePage />;
      default: return <NotFoundPage onGoHome={() => navigate(getRoleHome(auth.activeRoleId))} />;
    }
  };
  return <AppLayout activeTab={activeTab} onSelectTab={navigate} onSelectTicket={selectTicket}>
    {!ready ? <section className="ui-panel friendly-empty" role={error ? 'alert' : 'status'}>{error ? <><h1>We could not load the maintenance service</h1><p>{error}</p><button className="ui-button primary" onClick={reload}>Try again</button></> : <><span className="loading-ring" /><p>Loading your maintenance workspace…</p></>}</section> : <>{error && <div role="status" className="connection-notice"><span>Updates could not be refreshed. Your current screen has been kept.</span><button className="text-action" onClick={reload}>Retry</button></div>}{view()}</>}
  </AppLayout>;
};
export default function App() {
  return <ThemeProvider><ToastProvider><AuthProvider><SettingsProvider><TicketProvider><InventoryProvider><LocationProvider><NotificationProvider><MainApp /></NotificationProvider></LocationProvider></InventoryProvider></TicketProvider></SettingsProvider></AuthProvider></ToastProvider></ThemeProvider>;
}
