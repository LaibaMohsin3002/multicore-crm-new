import { useState } from 'react';
import { useCRM, PlanType } from './CRMContext';
import { Plus, X, Building2, Users, Target, TrendingUp } from 'lucide-react';

export function TenantManagement() {
  const { tenants, addTenant, updateTenant } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    plan: 'free' as PlanType
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const planLimits = {
      free: { users: 3, leads: 100, storage: 5, amount: 0 },
      standard: { users: 10, leads: 1000, storage: 20, amount: 99 },
      pro: { users: 50, leads: 10000, storage: 100, amount: 299 }
    };

    const limits = planLimits[formData.plan];
    
    addTenant({
      name: formData.name,
      plan: formData.plan,
      status: 'active',
      userLimit: limits.users,
      leadLimit: limits.leads,
      storageLimit: limits.storage,
      currentUsers: 0,
      currentLeads: 0,
      currentStorage: 0,
      subscriptionStart: new Date().toISOString().split('T')[0],
      subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      billingAmount: limits.amount
    });
    
    setShowAddModal(false);
    setFormData({
      name: '',
      plan: 'free'
    });
  };

  const getPlanColor = (plan: PlanType) => {
    switch (plan) {
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'free': return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Tenant Management</h1>
          <p className="text-gray-600 mt-2">Manage all companies using the platform</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Tenant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span className="text-gray-600">Total Tenants</span>
          </div>
          <div className="text-gray-900">{tenants.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Active</span>
          </div>
          <div className="text-gray-900">{tenants.filter(t => t.status === 'active').length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Total Users</span>
          </div>
          <div className="text-gray-900">{tenants.reduce((sum, t) => sum + t.currentUsers, 0)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-orange-600" />
            <span className="text-gray-600">Total Leads</span>
          </div>
          <div className="text-gray-900">{tenants.reduce((sum, t) => sum + t.currentLeads, 0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tenants.map(tenant => (
          <div key={tenant.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  {tenant.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-gray-900">{tenant.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded ${getPlanColor(tenant.plan)}`}>
                      {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${getStatusColor(tenant.status)}`}>
                      {tenant.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Users</span>
                <span className="text-gray-900">{tenant.currentUsers} / {tenant.userLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(tenant.currentUsers / tenant.userLimit) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Leads</span>
                <span className="text-gray-900">{tenant.currentLeads} / {tenant.leadLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${(tenant.currentLeads / tenant.leadLimit) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Storage</span>
                <span className="text-gray-900">{tenant.currentStorage} / {tenant.storageLimit} GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(tenant.currentStorage / tenant.storageLimit) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Monthly Revenue</span>
                <span className="text-gray-900">${tenant.billingAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subscription Ends</span>
                <span className="text-gray-900">{new Date(tenant.subscriptionEnd).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => updateTenant(tenant.id, { 
                  status: tenant.status === 'active' ? 'suspended' : 'active' 
                })}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                  tenant.status === 'active'
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {tenant.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Add New Tenant</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Subscription Plan</label>
                <div className="space-y-3">
                  {[
                    { plan: 'free' as PlanType, price: '$0/mo', users: 3, leads: 100, storage: 5 },
                    { plan: 'standard' as PlanType, price: '$99/mo', users: 10, leads: 1000, storage: 20 },
                    { plan: 'pro' as PlanType, price: '$299/mo', users: 50, leads: 10000, storage: 100 }
                  ].map(({ plan, price, users, leads, storage }) => (
                    <label
                      key={plan}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.plan === plan
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="plan"
                          value={plan}
                          checked={formData.plan === plan}
                          onChange={(e) => setFormData({ ...formData, plan: e.target.value as PlanType })}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <div>
                          <div className="text-gray-900">{plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
                          <div className="text-gray-600">{price}</div>
                        </div>
                      </div>
                      <div className="text-gray-600">
                        {users} users · {leads} leads · {storage}GB
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
