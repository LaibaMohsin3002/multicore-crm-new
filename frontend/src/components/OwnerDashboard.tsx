import { useState, useEffect } from 'react';
import { useCRM } from './CRMContext';
import { Building2, Users, Plus, UserPlus, Settings, Target, Calendar, TrendingUp, Ticket, DollarSign, Activity } from 'lucide-react';
import { apiFetch } from '@/api/client';

interface StaffMember {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
}

export function OwnerDashboard() {
  const { currentUser, customers, leads, tickets } = useCRM();
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [businessId, setBusinessId] = useState<number | null>(null);

  // Business form state
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessTimezone, setBusinessTimezone] = useState('');

  // Staff form state
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState<'SALES_MANAGER' | 'SALES_AGENT' | 'SUPPORT_MANAGER' | 'SUPPORT_AGENT'>('SALES_AGENT');

  // Fetch business ID and staff list
  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      const meResponse = await apiFetch<any>('/api/auth/me', { auth: true });
      const bid = meResponse.businessId;
      setBusinessId(bid);
      
      if (bid) {
        // Fetch staff list - would need an endpoint like /api/business/{id}/staff
        // For now, we'll use a placeholder
        // const staff = await apiFetch<StaffMember[]>(`/api/business/${bid}/staff`, { auth: true });
        // setStaffList(staff || []);
      }
    } catch (err: any) {
      console.warn('Failed to fetch business info:', err);
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch<any>('/api/business', {
        method: 'POST',
        body: JSON.stringify({
          name: businessName,
          address: businessAddress,
          phone: businessPhone,
          timezone: businessTimezone
        }),
        auth: true
      });

      setSuccess(`Business "${businessName}" created successfully!`);
      setBusinessName('');
      setBusinessAddress('');
      setBusinessPhone('');
      setBusinessTimezone('');
      setShowCreateBusiness(false);
      await fetchBusinessInfo();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create business');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!businessId) {
      setError('Business ID not found. Please create or complete your business profile first.');
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch<any>(`/api/business/${businessId}/staff`, {
        method: 'POST',
        body: JSON.stringify({
          name: staffName,
          email: staffEmail,
          password: staffPassword,
          phone: staffPhone || '',
          role: staffRole
        }),
        auth: true
      });

      setSuccess(`Staff member "${staffName}" created successfully with role ${staffRole}!`);
      setStaffName('');
      setStaffEmail('');
      setStaffPassword('');
      setStaffPhone('');
      setShowCreateStaff(false);
      await fetchBusinessInfo();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create staff member');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs
  const openLeads = leads.filter(l => !['won', 'lost'].includes(l.status)).length;
  const pipelineValue = leads
    .filter(l => !['won', 'lost'].includes(l.status))
    .reduce((sum, l) => sum + (l.value || 0), 0);
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const activeCustomers = customers.filter(c => c.status === 'active' || !c.status).length;

  // Recent activity (mock - would come from audit logs)
  const recentActivity = [
    { id: '1', type: 'staff_created', message: 'Staff member "John Sales" created', timestamp: new Date().toISOString() },
    { id: '2', type: 'lead_created', message: 'New lead "Acme Corp" added', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', type: 'ticket_resolved', message: 'Ticket #123 resolved', timestamp: new Date(Date.now() - 7200000).toISOString() },
  ];

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subValue, 
    color
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    subValue?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {subValue && (
          <span className="text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {subValue}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Owner Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}</p>
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

      {/* Company KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Target}
          label="Open Leads"
          value={openLeads}
          subValue="+8%"
          color="bg-orange-600"
        />
        <StatCard
          icon={DollarSign}
          label="Pipeline Value"
          value={`$${pipelineValue.toLocaleString()}`}
          subValue="+12%"
          color="bg-green-600"
        />
        <StatCard
          icon={Ticket}
          label="Open Tickets"
          value={openTickets}
          color="bg-red-600"
        />
        <StatCard
          icon={Users}
          label="Active Customers"
          value={activeCustomers}
          subValue="+5%"
          color="bg-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowCreateBusiness(true);
                  setShowCreateStaff(false);
                }}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                Create Business
              </button>
              <button
                onClick={() => {
                  if (!businessId) {
                    setError('Please create or complete your business profile first');
                    return;
                  }
                  setShowCreateStaff(true);
                  setShowCreateBusiness(false);
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Staff
              </button>
            </div>
          </div>
        </div>

        {/* Staff List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Staff List</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            {staffList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No staff members yet</p>
                <p className="text-xs mt-1">Create your first staff member</p>
              </div>
            ) : (
              <div className="space-y-2">
                {staffList.map(staff => (
                  <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-gray-900 font-medium">{staff.fullName}</div>
                      <div className="text-gray-500 text-sm">{staff.email} • {staff.role}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{activity.message}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Business Modal */}
      {showCreateBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Business Profile</h2>
            <form onSubmit={handleCreateBusiness} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Timezone</label>
                <input
                  type="text"
                  value={businessTimezone}
                  onChange={(e) => setBusinessTimezone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., America/New_York"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Business'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateBusiness(false);
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

      {/* Create Staff Modal */}
      {showCreateStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Staff Member</h2>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  minLength={6}
                  required
                />
                <p className="text-gray-500 text-sm mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Role *</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="SALES_MANAGER">Sales Manager (ID: 27)</option>
                  <option value="SALES_AGENT">Sales Agent (ID: 3)</option>
                  <option value="SUPPORT_MANAGER">Support Manager (ID: 28)</option>
                  <option value="SUPPORT_AGENT">Support Agent (ID: 29)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateStaff(false);
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
