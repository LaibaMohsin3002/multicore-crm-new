import { useState, useEffect } from 'react';
import { useCRM } from './CRMContext';
import { Building2, Users, Target, TrendingUp, Ticket, Plus, UserPlus, Power, Eye, Search, Activity } from 'lucide-react';
import { apiFetch } from '@/api/client';

interface Business {
  id: number;
  name: string;
  description?: string;
  industry?: string;
  active: boolean;
  owner?: {
    id: number;
    fullName: string;
    email: string;
  };
  createdAt?: string;
}

interface PlatformStats {
  totalBusinesses: number;
  activeBusinesses: number;
  inactiveBusinesses: number;
  totalUsers: number;
  totalLeads: number;
  totalCustomers: number;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  businessName?: string;
}

export function SuperAdminDashboard() {
  const { currentUser } = useCRM();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showCreateOwner, setShowCreateOwner] = useState(false);

  // Owner form state
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerPasswordConfirm, setOwnerPasswordConfirm] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Activity feed (mock data for now - would come from audit logs)
  const [activities] = useState<ActivityItem[]>([
    { id: '1', type: 'business_created', message: 'New business "Acme Corp" created', timestamp: new Date().toISOString(), businessName: 'Acme Corp' },
    { id: '2', type: 'owner_created', message: 'Owner "John Doe" created', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', type: 'business_activated', message: 'Business "Tech Solutions" activated', timestamp: new Date(Date.now() - 7200000).toISOString(), businessName: 'Tech Solutions' },
  ]);

  // Fetch businesses and stats
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [businessesData, statsData] = await Promise.all([
        apiFetch<Business[]>('/api/admin/businesses', { auth: true }).catch(() => []),
        apiFetch<PlatformStats>('/api/admin/stats', { auth: true }).catch(() => null)
      ]);
      setBusinesses(businessesData || []);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (ownerPassword !== ownerPasswordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (ownerPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await apiFetch<any>('/api/admin/owners', {
        method: 'POST',
        body: JSON.stringify({
          name: ownerName,
          email: ownerEmail,
          password: ownerPassword,
          businessName: businessName || null
        }),
        auth: true
      });

      setSuccess(`Owner "${ownerName}" created successfully! ${businessName ? `Business "${businessName}" also created.` : 'Owner can create their business after login.'}`);
      setOwnerName('');
      setOwnerEmail('');
      setOwnerPassword('');
      setOwnerPasswordConfirm('');
      setBusinessName('');
      setShowCreateOwner(false);
      await fetchData();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to create owner');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleToggleBusiness = async (businessId: number, currentStatus: boolean) => {
    try {
      await apiFetch(`/api/admin/businesses/${businessId}/status?active=${!currentStatus}`, {
        method: 'PATCH',
        auth: true
      });
      setSuccess(`Business ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update business status');
      setTimeout(() => setError(''), 5000);
    }
  };

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.owner?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.owner?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-2">Monitor all businesses and platform metrics</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Building2}
          label="Total Businesses"
          value={stats?.totalBusinesses || businesses.length}
          change="+12%"
          color="bg-purple-600"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers || 0}
          change="+15%"
          color="bg-blue-600"
        />
        <StatCard
          icon={Target}
          label="Total Leads"
          value={stats?.totalLeads || 0}
          color="bg-orange-600"
        />
        <StatCard
          icon={Ticket}
          label="Open Tickets"
          value={0}
          color="bg-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <button
              onClick={() => setShowCreateOwner(true)}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Create Business Owner
            </button>
          </div>
        </div>

        {/* Tenant Activity Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tenant Activity Feed</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{activity.message}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                      {activity.businessName && ` • ${activity.businessName}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Businesses Table with Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">All Businesses</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchData}
              className="text-indigo-600 hover:text-indigo-700 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>{searchTerm ? 'No businesses found matching your search.' : 'No businesses yet. Create your first business owner to get started.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Business Name</th>
                  <th className="text-left py-3 px-4 text-gray-600">Industry</th>
                  <th className="text-left py-3 px-4 text-gray-600">Owner</th>
                  <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBusinesses.map(business => (
                  <tr key={business.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                          {business.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-gray-900 font-medium">{business.name}</div>
                          {business.description && (
                            <div className="text-gray-500 text-sm">{business.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {business.industry || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      {business.owner ? (
                        <div>
                          <div className="text-gray-900">{business.owner.fullName}</div>
                          <div className="text-gray-500 text-sm">{business.owner.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No owner</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                        business.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBusiness(business.id, business.active)}
                          className={`p-2 rounded-lg transition-colors ${
                            business.active
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                          title={business.active ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setBusinessName(business.name);
                            setShowCreateOwner(true);
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Create Owner"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Owner Modal */}
      {showCreateOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Business Owner</h2>
            <form onSubmit={handleCreateOwner} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  minLength={6}
                  required
                />
                <p className="text-gray-500 text-sm mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  value={ownerPasswordConfirm}
                  onChange={(e) => setOwnerPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Business Name (Optional)</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Leave empty if owner will create business later"
                />
                <p className="text-gray-500 text-sm mt-1">If provided, a business will be created and assigned to this owner</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Owner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateOwner(false);
                    setOwnerName('');
                    setOwnerEmail('');
                    setOwnerPassword('');
                    setOwnerPasswordConfirm('');
                    setBusinessName('');
                    setError('');
                    setSuccess('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
