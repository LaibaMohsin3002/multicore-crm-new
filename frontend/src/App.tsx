import { useState } from 'react';
import { CRMProvider, useCRM } from './components/CRMContext';
import { Sidebar } from './components/Sidebar';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { CompanyDashboard } from './components/CompanyDashboard';
import { CustomerManagement } from './components/CustomerManagement';
import { LeadManagement } from './components/LeadManagement';
import { TaskManagement } from './components/TaskManagement';
import { AppointmentScheduler } from './components/AppointmentScheduler';
import { ProductCatalog } from './components/ProductCatalog';
import { InteractionLog } from './components/InteractionLog';
import { SupportTickets } from './components/SupportTickets';
import { UserRoleManagement } from './components/UserRoleManagement';
import { TenantManagement } from './components/TenantManagement';
import { SubscriptionManagement } from './components/SubscriptionManagement';
import { LoginScreen } from './components/LoginScreen';
import { DealManagement } from './components/DealManagement';
import { AILeadMatching } from './components/AILeadMatching';
import { NotificationCenter } from './components/NotificationCenter';
import { AuditLogView } from './components/AuditLogView';
import { CustomerPortal } from './components/CustomerPortal';
import { BusinessSettings } from './components/BusinessSettings';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { SalesManagerDashboard } from './components/SalesManagerDashboard';
import { SalesAgentDashboard } from './components/SalesAgentDashboard';
import { SupportManagerDashboard } from './components/SupportManagerDashboard';
import { SupportAgentDashboard } from './components/SupportAgentDashboard';
import { FinanceDashboard } from './components/FinanceDashboard';
import { ViewerDashboard } from './components/ViewerDashboard';

function AppContent() {
  const { currentUser, currentView, logout } = useCRM();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!currentUser) {
    return <LoginScreen />;
  }

  // Customer Portal for customer role
  if (currentUser.role === 'customer') {
    return <CustomerPortal />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'super-admin-dashboard':
        return <SuperAdminDashboard />;
      case 'owner-dashboard':
        return <OwnerDashboard />;
      case 'company-dashboard':
        return <CompanyDashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'leads':
        return <LeadManagement />;
      case 'deals':
        return <DealManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'appointments':
        return <AppointmentScheduler />;
      case 'products':
        return <ProductCatalog />;
      case 'interactions':
        return <InteractionLog />;
      case 'tickets':
        return <SupportTickets />;
      case 'users':
        return <UserRoleManagement />;
      case 'tenants':
        return <TenantManagement />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      case 'ai-matching':
        return <AILeadMatching />;
      case 'notifications':
        return <NotificationCenter />;
      case 'audit-logs':
        return <AuditLogView />;
      case 'settings':
        return <BusinessSettings />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'sales-manager-dashboard':
        return <SalesManagerDashboard />;
      case 'sales-agent-dashboard':
        return <SalesAgentDashboard />;
      case 'support-manager-dashboard':
        return <SupportManagerDashboard />;
      case 'support-agent-dashboard':
        return <SupportAgentDashboard />;
      case 'finance-dashboard':
        return <FinanceDashboard />;
      case 'viewer-dashboard':
        return <ViewerDashboard />;
      default:
        // Route to role-specific dashboard
        if (currentUser.role === 'super_admin') {
          return <SuperAdminDashboard />;
        } else if (currentUser.role === 'owner') {
          return <OwnerDashboard />;
        } else if (currentUser.role === 'sales_manager') {
          return <SalesManagerDashboard />;
        } else if (currentUser.role === 'sales_agent') {
          return <SalesAgentDashboard />;
        } else if (currentUser.role === 'support_manager') {
          return <SupportManagerDashboard />;
        } else if (currentUser.role === 'support_agent') {
          return <SupportAgentDashboard />;
        } else if (currentUser.role === 'finance') {
          return <FinanceDashboard />;
        } else if (currentUser.role === 'viewer') {
          return <ViewerDashboard />;
        }
        return <CompanyDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
}