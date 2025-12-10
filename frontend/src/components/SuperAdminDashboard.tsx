import { useCRM } from './CRMContext';
import { Building2, Users, Target, TrendingUp, DollarSign, Activity } from 'lucide-react';

export function SuperAdminDashboard() {
  const { tenants, users, leads, customers } = useCRM();

  const totalRevenue = tenants.reduce((sum, t) => sum + t.billingAmount, 0);
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const totalUsers = users.filter(u => u.role !== 'super_admin').length;
  const totalLeads = leads.length;
  const totalCustomers = customers.length;

  const planDistribution = {
    free: tenants.filter(t => t.plan === 'free').length,
    standard: tenants.filter(t => t.plan === 'standard').length,
    pro: tenants.filter(t => t.plan === 'pro').length
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    change, 
    color 
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    change?: string; 
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className="text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {change}
          </span>
        )}
      </div>
      <div className="text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Platform Overview</h1>
        <p className="text-gray-600 mt-2">Monitor all tenants and platform metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Building2}
          label="Active Tenants"
          value={activeTenants}
          change="+12%"
          color="bg-purple-600"
        />
        <StatCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+8%"
          color="bg-green-600"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          change="+15%"
          color="bg-blue-600"
        />
        <StatCard
          icon={Target}
          label="Total Leads"
          value={totalLeads}
          color="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Plan Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Free</span>
                <span className="text-gray-900">{planDistribution.free} tenants</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-400 h-2 rounded-full"
                  style={{ width: `${(planDistribution.free / tenants.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Standard</span>
                <span className="text-gray-900">{planDistribution.standard} tenants</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(planDistribution.standard / tenants.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Pro</span>
                <span className="text-gray-900">{planDistribution.pro} tenants</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(planDistribution.pro / tenants.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Uptime</span>
              <span className="text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database Performance</span>
              <span className="text-green-600">Optimal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage Usage</span>
              <span className="text-yellow-600">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Sessions</span>
              <span className="text-gray-900">142</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4">Recent Tenants</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600">Company</th>
                <th className="text-left py-3 px-4 text-gray-600">Plan</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-gray-600">Users</th>
                <th className="text-left py-3 px-4 text-gray-600">Leads</th>
                <th className="text-left py-3 px-4 text-gray-600">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(tenant => (
                <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-gray-900">{tenant.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                      tenant.plan === 'pro'
                        ? 'bg-purple-100 text-purple-800'
                        : tenant.plan === 'standard'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                      tenant.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : tenant.status === 'suspended'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    {tenant.currentUsers}/{tenant.userLimit}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    {tenant.currentLeads}/{tenant.leadLimit}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    ${tenant.billingAmount}/mo
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
