import { useState } from 'react';
import { useCRM, UserRole } from './CRMContext';
import { Plus, X, Users, Shield, Edit, Trash2 } from 'lucide-react';

export function UserRoleManagement() {
  const { currentUser, users, addUser, updateUser, deleteUser } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'sales_agent' as UserRole
  });

  const tenantUsers = users.filter(u => u.tenantId === currentUser?.tenantId);

  const roleOptions: UserRole[] = ['owner', 'sales_manager', 'sales_agent', 'support_manager', 'support_agent', 'finance', 'viewer'];

  const rolePermissions = {
    owner: ['All business permissions', 'Manage all users', 'Access all data', 'Configure settings', 'Manage subscription'],
    sales_manager: ['Manage sales team', 'View all leads', 'Assign tasks', 'View reports'],
    sales_agent: ['Manage assigned leads', 'Create tasks', 'Log interactions'],
    support_manager: ['Manage support team', 'View all tickets', 'Escalate tickets', 'View reports'],
    support_agent: ['Manage assigned tickets', 'Log interactions', 'Update ticket status'],
    finance: ['View financial data', 'Manage invoices', 'Generate reports'],
    viewer: ['View-only access', 'No editing permissions']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        tenantId: currentUser.tenantId,
        status: 'active'
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        role: 'sales_agent'
      });
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'sales_manager': return 'bg-blue-100 text-blue-800';
      case 'sales_agent': return 'bg-cyan-100 text-cyan-800';
      case 'support_manager': return 'bg-orange-100 text-orange-800';
      case 'support_agent': return 'bg-yellow-100 text-yellow-800';
      case 'finance': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: UserRole) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Team Management</h1>
          <p className="text-gray-600 mt-2">Manage users and roles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="text-gray-600">Total Users</span>
          </div>
          <div className="text-gray-900">{tenantUsers.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Active</span>
          </div>
          <div className="text-gray-900">{tenantUsers.filter(u => u.status === 'active').length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600">Owners</span>
          </div>
          <div className="text-gray-900">{tenantUsers.filter(u => u.role === 'owner').length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Sales Team</span>
          </div>
          <div className="text-gray-900">
            {tenantUsers.filter(u => u.role === 'sales_manager' || u.role === 'sales_agent').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3>Team Members</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-600">User</th>
                <th className="text-left py-3 px-4 text-gray-600">Role</th>
                <th className="text-left py-3 px-4 text-gray-600">Permissions</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-gray-600">Joined</th>
                <th className="text-left py-3 px-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenantUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-gray-900">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600">
                      {rolePermissions[user.role as keyof typeof rolePermissions]?.[0] || 'No permissions'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateUser(user.id, { status: user.status === 'active' ? 'suspended' : 'active' })}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <div key={role} className="p-4 border border-gray-200 rounded-lg">
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full mb-3 ${getRoleColor(role as UserRole)}`}>
                {getRoleName(role as UserRole)}
              </div>
              <ul className="space-y-1 text-gray-600">
                {permissions.map((permission, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Add Team Member</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{getRoleName(role)}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-gray-700 mb-2">Selected Role Permissions:</div>
                <ul className="space-y-1 text-gray-600">
                  {rolePermissions[formData.role]?.map((permission, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                      {permission}
                    </li>
                  ))}
                </ul>
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
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}