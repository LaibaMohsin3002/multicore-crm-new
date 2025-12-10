import { useCRM } from './CRMContext';
import {
  LayoutDashboard,
  Users,
  Target,
  CheckSquare,
  Calendar,
  Package,
  MessageSquare,
  Ticket,
  Settings,
  Building2,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserCog,
  DollarSign,
  Sparkles,
  Bell,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { currentUser, currentView, switchView, logout } = useCRM();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  if (!currentUser) return null;

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.role === 'admin';
  const isCustomer = currentUser.role === 'customer';
  const isSalesRole = ['owner', 'sales_manager', 'sales_agent'].includes(currentUser.role);
  const isSupportRole = ['owner', 'support_manager', 'support_agent'].includes(currentUser.role);
  const isManagerRole = ['owner', 'sales_manager', 'support_manager'].includes(currentUser.role);
  const isFinanceRole = currentUser.role === 'finance';
  const isViewerRole = currentUser.role === 'viewer';

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const NavItem = ({ 
    icon: Icon, 
    label, 
    view, 
    badge 
  }: { 
    icon: any; 
    label: string; 
    view: string; 
    badge?: number 
  }) => (
    <button
      onClick={() => switchView(view)}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
        currentView === view
          ? 'bg-indigo-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        {isOpen && <span>{label}</span>}
      </div>
      {badge !== undefined && badge > 0 && isOpen && (
        <span className={`px-2 py-0.5 rounded-full ${
          currentView === view ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );

  const SectionHeader = ({ label, section }: { label: string; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
    >
      {isOpen && <span>{label}</span>}
      {isOpen && (
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            expandedSections.includes(section) ? 'rotate-180' : ''
          }`}
        />
      )}
    </button>
  );

  return (
    <>
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${isSuperAdmin ? 'bg-purple-600' : 'bg-indigo-600'} p-2 rounded-xl`}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              {isOpen && (
                <div>
                  <div className="text-gray-900">{isSuperAdmin ? 'Platform' : 'CRM'}</div>
                  <div className="text-gray-500">{currentUser.name}</div>
                </div>
              )}
            </div>
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {isSuperAdmin ? (
            <>
              <NavItem icon={LayoutDashboard} label="Dashboard" view="super-admin-dashboard" />
              <NavItem icon={Building2} label="Tenants" view="tenants" />
              <NavItem icon={CreditCard} label="Subscriptions" view="subscriptions" />
              <NavItem icon={Settings} label="Platform Settings" view="platform-settings" />
            </>
          ) : (
            <>
              <NavItem icon={LayoutDashboard} label="Dashboard" view="company-dashboard" />
              
              {isOpen && <SectionHeader label="SALES" section="sales" />}
              {(!isOpen || expandedSections.includes('sales')) && (
                <>
                  <NavItem icon={Users} label="Customers" view="customers" />
                  <NavItem icon={Target} label="Leads" view="leads" />
                  <NavItem icon={DollarSign} label="Deals" view="deals" />
                  <NavItem icon={CheckSquare} label="Tasks" view="tasks" />
                  <NavItem icon={Calendar} label="Appointments" view="appointments" />
                  <NavItem icon={Package} label="Products" view="products" />
                </>
              )}

              {isOpen && <SectionHeader label="ENGAGEMENT" section="engagement" />}
              {(!isOpen || expandedSections.includes('engagement')) && (
                <>
                  <NavItem icon={MessageSquare} label="Interactions" view="interactions" />
                  <NavItem icon={Ticket} label="Support Tickets" view="tickets" />
                </>
              )}

              {(currentUser.role === 'owner' || currentUser.role === 'sales_manager' || currentUser.role === 'sales_agent') && (
                <>
                  {isOpen && <SectionHeader label="AI & INSIGHTS" section="ai" />}
                  {(!isOpen || expandedSections.includes('ai')) && (
                    <>
                      <NavItem icon={Sparkles} label="AI Matching" view="ai-matching" />
                      <NavItem icon={TrendingUp} label="Analytics" view="analytics" />
                    </>
                  )}
                </>
              )}

              {isOpen && <SectionHeader label="SYSTEM" section="system" />}
              {(!isOpen || expandedSections.includes('system')) && (
                <>
                  <NavItem icon={Bell} label="Notifications" view="notifications" />
                  {(currentUser.role === 'owner' || currentUser.role === 'sales_manager' || currentUser.role === 'support_manager') && (
                    <>
                      <NavItem icon={FileText} label="Audit Logs" view="audit-logs" />
                    </>
                  )}
                </>
              )}

              {(currentUser.role === 'owner' || currentUser.role === 'sales_manager' || currentUser.role === 'support_manager') && (
                <>
                  {isOpen && <SectionHeader label="ADMIN" section="admin" />}
                  {(!isOpen || expandedSections.includes('admin')) && (
                    <>
                      <NavItem icon={UserCog} label="Team" view="users" />
                      <NavItem icon={Settings} label="Settings" view="settings" />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}