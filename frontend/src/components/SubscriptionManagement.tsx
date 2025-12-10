import { useCRM } from './CRMContext';
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function SubscriptionManagement() {
  const { tenants } = useCRM();

  const totalMRR = tenants.reduce((sum, t) => sum + t.billingAmount, 0);
  const activeSubs = tenants.filter(t => t.status === 'active').length;

  const planRevenue = {
    free: tenants.filter(t => t.plan === 'free').reduce((sum, t) => sum + t.billingAmount, 0),
    standard: tenants.filter(t => t.plan === 'standard').reduce((sum, t) => sum + t.billingAmount, 0),
    pro: tenants.filter(t => t.plan === 'pro').reduce((sum, t) => sum + t.billingAmount, 0)
  };

  const planDistribution = [
    { name: 'Free', value: tenants.filter(t => t.plan === 'free').length, color: '#9ca3af' },
    { name: 'Standard', value: tenants.filter(t => t.plan === 'standard').length, color: '#3b82f6' },
    { name: 'Pro', value: tenants.filter(t => t.plan === 'pro').length, color: '#8b5cf6' }
  ];

  const revenueByPlan = [
    { plan: 'Free', revenue: planRevenue.free },
    { plan: 'Standard', revenue: planRevenue.standard },
    { plan: 'Pro', revenue: planRevenue.pro }
  ];

  const upcomingRenewals = tenants.filter(t => {
    const daysUntilRenewal = Math.floor(
      (new Date(t.subscriptionEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilRenewal <= 30 && daysUntilRenewal >= 0;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Subscription & Billing</h1>
        <p className="text-gray-600 mt-2">Monitor revenue and subscriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl mb-1">${totalMRR.toLocaleString()}</div>
          <div className="text-green-100">Monthly Recurring Revenue</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="text-3xl mb-1">{activeSubs}</div>
          <div className="text-blue-100">Active Subscriptions</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="text-3xl mb-1">${(totalMRR / activeSubs || 0).toFixed(0)}</div>
          <div className="text-purple-100">Average Revenue Per Account</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="text-3xl mb-1">{upcomingRenewals.length}</div>
          <div className="text-orange-100">Renewals This Month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Revenue by Plan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="plan" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                {revenueByPlan.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#9ca3af', '#3b82f6', '#8b5cf6'][index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3>Upcoming Renewals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-600">Company</th>
                <th className="text-left py-3 px-4 text-gray-600">Plan</th>
                <th className="text-left py-3 px-4 text-gray-600">Renewal Date</th>
                <th className="text-left py-3 px-4 text-gray-600">Days Until Renewal</th>
                <th className="text-left py-3 px-4 text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingRenewals.map(tenant => {
                const daysUntilRenewal = Math.floor(
                  (new Date(tenant.subscriptionEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                          {tenant.name.charAt(0)}
                        </div>
                        <div className="text-gray-900">{tenant.name}</div>
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
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(tenant.subscriptionEnd).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                        daysUntilRenewal <= 7
                          ? 'bg-red-100 text-red-800'
                          : daysUntilRenewal <= 14
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {daysUntilRenewal} days
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      ${tenant.billingAmount}/mo
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                        tenant.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {upcomingRenewals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No renewals in the next 30 days
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4">All Subscriptions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-600">Company</th>
                <th className="text-left py-3 px-4 text-gray-600">Plan</th>
                <th className="text-left py-3 px-4 text-gray-600">Start Date</th>
                <th className="text-left py-3 px-4 text-gray-600">End Date</th>
                <th className="text-left py-3 px-4 text-gray-600">Monthly Amount</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
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
                      <div className="text-gray-900">{tenant.name}</div>
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
                  <td className="py-3 px-4 text-gray-900">
                    {new Date(tenant.subscriptionStart).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    {new Date(tenant.subscriptionEnd).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    ${tenant.billingAmount}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                      tenant.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : tenant.status === 'suspended'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.status}
                    </span>
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
