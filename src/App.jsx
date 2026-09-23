import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { InventoryProvider } from './context/InventoryContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

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

// Technician Pages
import { TechnicianDashboard } from './pages/technician/TechnicianDashboard';
import { TaskWorkspacePage } from './pages/technician/TaskWorkspacePage';

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

  // Default starting tab based on active role
  const getDefaultTab = () => {
    switch (activeRoleId) {
      case 'dept_admin':
        return 'dashboard';
      case 'technician':
        return 'technician_dashboard';
      case 'store_keeper':
        return 'inventory_dashboard';
      case 'super_admin':
        return 'superadmin_dashboard';
      case 'general_user':
      default:
        return 'staff_dashboard';
    }
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [selectedTicketId, setSelectedTicketId] = useState('MRS-2026-0148');

  // If role changes, ensure tab is appropriate if needed
  React.useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [activeRoleId]);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setActiveTab(getDefaultTab())} />;
  }

  const handleSelectTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setActiveTab('request_detail');
  };

  const handleOpenWorkspace = (ticketId) => {
    setSelectedTicketId(ticketId);
    setActiveTab('field_workspace');
  };

  // Generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    const defaultCrumb = [{ label: 'Dashboard', onClick: () => setActiveTab(getDefaultTab()) }];

    switch (activeTab) {
      case 'staff_dashboard':
      case 'dashboard':
      case 'technician_dashboard':
      case 'inventory_dashboard':
      case 'superadmin_dashboard':
        return [{ label: 'Overview' }];
      case 'my_requests':
      case 'requests':
        return [...defaultCrumb, { label: 'Requests' }];
      case 'create_request':
        return [...defaultCrumb, { label: 'New Request' }];
      case 'request_detail':
        return [
          ...defaultCrumb,
          { label: 'Requests', onClick: () => setActiveTab('requests') },
          { label: selectedTicketId }
        ];
      case 'review_queue':
        return [...defaultCrumb, { label: 'Verification Queue' }];
      case 'field_workspace':
        return [
          ...defaultCrumb,
          { label: 'Tasks', onClick: () => setActiveTab('technician_dashboard') },
          { label: `Workspace (${selectedTicketId})` }
        ];
      case 'inventory_items':
      case 'item_requests':
      case 'transactions':
        return [...defaultCrumb, { label: 'Inventory Stores' }];
      case 'reports':
        return [...defaultCrumb, { label: 'Reports & Analytics' }];
      case 'users':
        return [...defaultCrumb, { label: 'User Directory' }];
      case 'permissions':
        return [...defaultCrumb, { label: 'Permissions Matrix' }];
      case 'locations':
      case 'campus_info':
        return [...defaultCrumb, { label: 'Campus Locations' }];
      case 'workflow':
      case 'categories':
        return [...defaultCrumb, { label: 'Workflow & SLAs' }];
      case 'audit_logs':
        return [...defaultCrumb, { label: 'Security Audit Logs' }];
      case 'settings':
        return [...defaultCrumb, { label: 'System Settings' }];
      case 'notifications':
        return [...defaultCrumb, { label: 'Notifications' }];
      case 'profile':
        return [...defaultCrumb, { label: 'User Profile' }];
      default:
        return defaultCrumb;
    }
  };

  // Render main screen component
  const renderCurrentView = () => {
    switch (activeTab) {
      // Staff Views
      case 'staff_dashboard':
        return (
          <StaffDashboard
            onNavigate={setActiveTab}
            onSelectTicket={handleSelectTicket}
          />
        );

      case 'create_request':
        return (
          <CreateRequestPage
            onNavigate={setActiveTab}
            onSelectTicket={handleSelectTicket}
          />
        );

      case 'my_requests':
      case 'requests':
        return (
          <MyRequestsPage
            onNavigate={setActiveTab}
            onSelectTicket={handleSelectTicket}
          />
        );

      case 'request_detail':
        return (
          <RequestDetailPage
            ticketId={selectedTicketId}
            onBack={() => setActiveTab('requests')}
            onOpenAssign={(ticket) => {
              // open assign modal
            }}
            onOpenReview={(ticket) => {
              setActiveTab('review_queue');
            }}
          />
        );

      // Dept Admin Views
      case 'dashboard':
      case 'review_queue':
        return (
          <DeptAdminDashboard
            onNavigate={setActiveTab}
            onSelectTicket={handleSelectTicket}
          />
        );

      case 'technicians':
        return <AnalyticsDashboard />;

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
            ticketId={selectedTicketId}
            onBack={() => setActiveTab('technician_dashboard')}
          />
        );

      case 'parts_request':
      case 'inventory_dashboard':
      case 'inventory_items':
      case 'item_requests':
      case 'transactions':
        return <InventoryDashboard />;

      // Reports & Analytics
      case 'reports':
        return activeRoleId === 'dept_admin' ? (
          <DeptReportsPage />
        ) : (
          <AnalyticsDashboard />
        );

      // Super Admin Views
      case 'superadmin_dashboard':
        return <AnalyticsDashboard />;

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
        return <NotFoundPage onGoHome={() => setActiveTab(getDefaultTab())} />;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      breadcrumb={getBreadcrumbs()}
      onSelectTicket={handleSelectTicket}
    >
      {renderCurrentView()}
    </AppLayout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TicketProvider>
          <InventoryProvider>
            <MainApp />
          </InventoryProvider>
        </TicketProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
