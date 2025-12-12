import { useState } from 'react';
import { useCRM } from './CRMContext';
import { Building2, Users, Plus, UserPlus, Settings, Target, Calendar, TrendingUp } from 'lucide-react';
import { apiFetch } from '@/api/client';

export function OwnerDashboard() {
  const { currentUser, customers, leads } = useCRM();
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Business form state
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('');

  // Staff form state
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState<'SALES_MANAGER' | 'SALES_AGENT' | 'SUPPORT_MANAGER' | 'SUPPORT_AGENT'>('SALES_AGENT');

  // Role mapping with IDs (as per user requirement)
  const roleIdMap: Record<string, number> = {
    'SALES_MANAGER': 27,
    'SALES_AGENT': 3,
    'SUPPORT_MANAGER': 28,
    'SUPPORT_AGENT': 29
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch<any>('/api/owner/create-business', {
        method: 'POST',
        body: JSON.stringify({
          name: businessName,
          description: businessDescription,
          industry: businessIndustry
        }),
        auth: true
      });

      setSuccess(`Business "${businessName}" created successfully!`);
      setBusinessName('');
      setBusinessDescription('');
      setBusinessIndustry('');
      setShowCreateBusiness(false);
      
      // Refresh data if needed
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

    try {
      // Get business ID from current user
      const meResponse = await apiFetch<any>('/api/auth/me', { auth: true });
      const businessId = meResponse.businessId;

      if (!businessId) {
        throw new Error('Business ID not found. Please ensure you are associated with a business.');
      }

      // Backend expects form params, so we'll use URLSearchParams
      const params = new URLSearchParams();
      params.append('fullName', staffName);
      params.append('email', staffEmail);
      params.append('password', staffPassword);
      params.append('phone', staffPhone);
      params.append('role', staffRole);

      // Use fetch directly since apiFetch might not handle form data correctly
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/owner/create-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        },
        body: params.toString()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create staff' }));
        throw new Error(errorData.message || 'Failed to create staff');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to create staff');
      }

      setSuccess(`Staff member "${staffName}" created successfully with role ${staffRole}!`);
      setStaffName('');
      setStaffEmail('');
      setStaffPassword('');
      setStaffPhone('');
      setShowCreateStaff(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create staff member');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const businessLeads = leads.filter(l => !['won', 'lost'].includes(l.status));
  const activeCustomers = customers.filter(c => c.status === 'active' || !c.status);

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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => {
            setShowCreateBusiness(true);
            setShowCreateStaff(false);
          }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-gray-900 font-semibold">Create Business</div>
              <div className="text-gray-600 text-sm">Add a new business</div>
            </div>
            <Plus className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </button>

        <button
          onClick={() => {
            setShowCreateStaff(true);
            setShowCreateBusiness(false);
          }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-gray-900 font-semibold">Create Staff</div>
              <div className="text-gray-600 text-sm">Add team members</div>
            </div>
            <Plus className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </button>

        <button
          onClick={() => {/* Navigate to settings */}}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-600 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-gray-900 font-semibold">Business Settings</div>
              <div className="text-gray-600 text-sm">Manage settings</div>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeCustomers.length}</div>
          <div className="text-gray-600">Active Customers</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{businessLeads.length}</div>
          <div className="text-gray-600">Active Leads</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-gray-600">Upcoming Appointments</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-600 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">1</div>
          <div className="text-gray-600">Businesses</div>
        </div>
      </div>

      {/* Create Business Modal */}
      {showCreateBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Business</h2>
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
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={businessIndustry}
                  onChange={(e) => setBusinessIndustry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Technology, Healthcare, Retail"
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
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
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

