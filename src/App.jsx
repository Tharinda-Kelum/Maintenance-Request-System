import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketProvider, useTickets } from './context/TicketContext';
import { InventoryProvider } from './context/InventoryContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { LocationProvider } from './context/LocationContext';
import { SettingsProvider } from './context/SettingsContext';
import { AssignTechnicianModal } from './pages/admin/AssignTechnicianModal';
import { ReviewTicketDrawer } from './pages/admin/ReviewTicketDrawer';
import { AppLayout } from './components/layout/AppLayout';
import { canAccessTab, getRoleHome } from './auth/accessControl';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { CreateRequestPage } from './pages/staff/CreateRequestPage';
import { MyRequestsPage } from './pages/staff/MyRequestsPage';
import { RequestDetailPage } from './pages/staff/RequestDetailPage';
import { UserProfilePage } from './pages/staff/UserProfilePage';

// Department Admin Pages
import { DeptAdminDashboard } from './pages/admin/DeptAdminDashboard';
import { DeptReportsPage } from './pages/admin/DeptReportsPage';
import { TechnicianWorkloadPage } from './pages/admin/TechnicianWorkloadPage';

// Technician Pages
import { TechnicianDashboard } from './pages/technician/TechnicianDashboard';
import { TaskWorkspacePage } from './pages/technician/TaskWorkspacePage';
import { PartsRequestsPage } from './pages/technician/PartsRequestsPage';

// Inventory Pages
import { InventoryDashboard } from './pages/inventory/InventoryDashboard';

// Reports & Analytics
import { AnalyticsDashboard } from './pages/reports/AnalyticsDashboard';

// Notifications
import { NotificationsPage } from './pages/notifications/NotificationsPage';

// Super Admin Pages
import { UserManagementPage } from './pages/superadmin/UserManagementPage';
import { RolesPermissionsPage } from './pages/superadmin/RolesPermissionsPage';
import { CampusLocationsPage } from './pages/superadmin/CampusLocationsPage';
import { WorkflowSettingsPage } from './pages/superadmin/WorkflowSettingsPage';
import { AuditLogsPage } from './pages/superadmin/AuditLogsPage';
import { SystemSettingsPage } from './pages/superadmin/SystemSettingsPage';

// Error Pages
import { NotFoundPage, UnauthorizedPage } from './pages/errors/NotFoundPage';

const MainApp = () => {
  const { isAuthenticated, activeRoleId } = useAuth();
  const { tickets } = useTickets();

  const [activeTab, setActiveTab] = useState('staff_dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState('MRS-2026-0148');
  const [assignTicket, setAssignTicket] = useState(null);
  const [reviewTicket, setReviewTicket] = useState(null);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={(roleId) => setActiveTab(getRoleHome(roleId))} />;
  }

  const navigateTo = (tabId) => {
    setActiveTab(canAccessTab(activeRoleId, tabId) ? tabId : '__unauthorized__');
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    navigateTo('request_detail');
  };

  const handleOpenWorkspace = (ticketId) => {
    setSelectedTicketId(ticketId);
    navigateTo('field_workspace');
  };

  // Render main screen component
  const renderCurrentView = () => {
    if (!canAccessTab(activeRoleId, activeTab)) {
      return <UnauthorizedPage onGoHome={() => navigateTo(getRoleHome(activeRoleId))} />;
    }

    switch (activeTab) {
      // Staff Views
      case 'staff_dashboard':
        return (
          <StaffDashboard
            onNavigate={navigateTo}
            onSelectTicket={handleSelectTicket}
          />
        );

      case 'create_request':
        return (
          <CreateRequestPage
            onNavigate={navigateTo}
            onSelectTicket={handleSelectTicket}
          />
        );

      case 'my_requests':
      case 'requests':
        return (
          <MyRequestsPage
            onNavigate={navigateTo}
            onSelectTicket={handleSelectTicket}
          />
        );

      case 'request_detail':
        return (
          <RequestDetailPage
            key={selectedTicketId}
            ticketId={selectedTicketId}
            onBack={() => navigateTo(activeRoleId === 'general_user' ? 'my_requests' : 'requests')}
            onOpenAssign={(ticket) => setAssignTicket(ticket)}
            onOpenReview={(ticket) => setReviewTicket(ticket)}
          />
        );

      // Dept Admin Views
      case 'dashboard':
      case 'review_queue':
        return (
          <DeptAdminDashboard
            reviewOnly={activeTab === 'review_queue'}
            onNavigate={navigateTo}
            onSelectTicket={handleSelectTicket}
          />
        );

      case 'technicians':
        return <TechnicianWorkloadPage onSelectTicket={handleSelectTicket} />;

      // Technician Views
      case 'technician_dashboard':
        return (
          <TechnicianDashboard
            onOpenWorkspace={handleOpenWorkspace}
            onSelectTicket={handleSelectTicket}
          />
        );

      case 'field_workspace':
        return (
          <TaskWorkspacePage
            key={selectedTicketId}
            ticketId={selectedTicketId}
            onBack={() => navigateTo('technician_dashboard')}
          />
        );

      case 'parts_request':
        return <PartsRequestsPage onOpenWorkspace={handleOpenWorkspace} />;
      case 'inventory_dashboard':
      case 'inventory_items':
      case 'item_requests':
      case 'transactions':
        return <InventoryDashboard activeView={activeTab} onNavigate={navigateTo} />;

      // Reports & Analytics
      case 'reports':
        return activeRoleId === 'dept_admin' ? (
          <DeptReportsPage />
        ) : (
          <AnalyticsDashboard onNavigate={navigateTo} onSelectTicket={handleSelectTicket} />
        );

      // Super Admin Views
      case 'superadmin_dashboard':
        return <AnalyticsDashboard onNavigate={navigateTo} onSelectTicket={handleSelectTicket} />;

      case 'users':
        return <UserManagementPage />;

      case 'permissions':
        return <RolesPermissionsPage />;

      case 'locations':
      case 'campus_info':
        return <CampusLocationsPage />;

      case 'workflow':
      case 'categories':
        return <WorkflowSettingsPage />;

      case 'audit_logs':
        return <AuditLogsPage />;

      case 'settings':
        return <SystemSettingsPage />;

      case 'notifications':
        return <NotificationsPage onSelectTicket={handleSelectTicket} />;

      case 'profile':
        return <UserProfilePage />;

      default:
        return <NotFoundPage onGoHome={() => navigateTo(getRoleHome(activeRoleId))} />;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onSelectTab={navigateTo}
      onSelectTicket={handleSelectTicket}
    >
      {renderCurrentView()}
      {assignTicket && <AssignTechnicianModal key={assignTicket.id} isOpen ticket={tickets.find((ticket) => ticket.id === assignTicket.id)} onClose={() => setAssignTicket(null)} />}
      {reviewTicket && <ReviewTicketDrawer key={reviewTicket.id} isOpen ticket={tickets.find((ticket) => ticket.id === reviewTicket.id)} onClose={() => setReviewTicket(null)} onAssignAfterApprove={(ticket) => setAssignTicket(ticket)} />}
    </AppLayout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <SettingsProvider>
            <TicketProvider>
              <InventoryProvider>
                <LocationProvider>
                  <NotificationProvider>
                    <MainApp />
                  </NotificationProvider>
                </LocationProvider>
              </InventoryProvider>
            </TicketProvider>
          </SettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
