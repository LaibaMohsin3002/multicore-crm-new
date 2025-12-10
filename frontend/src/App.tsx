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
      default:
        return currentUser.role === 'super_admin' ? <SuperAdminDashboard /> : <CompanyDashboard />;
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