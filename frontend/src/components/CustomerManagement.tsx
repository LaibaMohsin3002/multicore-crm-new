import { useState } from 'react';
import { useCRM } from './CRMContext';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building, 
  Tag, 
  Edit, 
  Trash2,
  X,
  Calendar,
  MessageSquare,
  Target
} from 'lucide-react';

export function CustomerManagement() {
  const { currentUser, customers, addCustomer, updateCustomer, deleteCustomer, users, interactions, appointments, leads } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    tags: '',
    preferences: '',
    interests: ''
  });

  const tenantCustomers = customers.filter(c => c.tenantId === currentUser?.tenantId);
  const filteredCustomers = tenantCustomers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addCustomer({
        tenantId: currentUser.tenantId!,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        status: 'active',
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        preferences: formData.preferences,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        assignedTo: currentUser.id
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        tags: '',
        preferences: '',
        interests: ''
      });
    }
  };

  const selectedCustomerData = selectedCustomer 
    ? customers.find(c => c.id === selectedCustomer)
    : null;

  const customerInteractions = selectedCustomer
    ? interactions.filter(i => i.customerId === selectedCustomer)
    : [];

  const customerAppointments = selectedCustomer
    ? appointments.filter(a => a.customerId === selectedCustomer)
    : [];

  const customerLeads = selectedCustomer
    ? leads.filter(l => l.customerId === selectedCustomer)
    : [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Customers</h1>
          <p className="text-gray-600 mt-2">Manage your customer relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-gray-600">Contact</th>
                <th className="text-left py-3 px-4 text-gray-600">Company</th>
                <th className="text-left py-3 px-4 text-gray-600">Tags</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-gray-600">Assigned To</th>
                <th className="text-left py-3 px-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => {
                const assignedUser = users.find(u => u.id === customer.assignedTo);
                return (
                  <tr 
                    key={customer.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-gray-900">{customer.name}</div>
                          <div className="text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building className="w-4 h-4" />
                        {customer.company || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {assignedUser?.name || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCustomer(customer.id, { 
                              status: customer.status === 'active' ? 'inactive' : 'active' 
                            });
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomer(customer.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Add New Customer</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="vip, enterprise, high-value"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Interests (comma-separated)</label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="Cloud Services, AI Solutions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Preferences</label>
                <textarea
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Communication preferences, special requirements, etc."
                />
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
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCustomer && selectedCustomerData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                  {selectedCustomerData.name.charAt(0)}
                </div>
                <div>
                  <h2>{selectedCustomerData.name}</h2>
                  <p className="text-gray-600">{selectedCustomerData.company}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <div className="text-gray-600 mb-1">Email</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="w-4 h-4" />
                    {selectedCustomerData.email}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Phone</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Phone className="w-4 h-4" />
                    {selectedCustomerData.phone}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-600 mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCustomerData.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Status</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                    selectedCustomerData.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCustomerData.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4">Timeline</h3>
              <div className="space-y-4">
                {customerInteractions.map(interaction => (
                  <div key={interaction.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900">{interaction.type.toUpperCase()}</span>
                        <span className="text-gray-500">{new Date(interaction.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700">{interaction.summary}</p>
                      {interaction.keywords.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {interaction.keywords.map(keyword => (
                            <span key={keyword} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {customerAppointments.map(appointment => (
                  <div key={appointment.id} className="flex gap-3 p-4 bg-purple-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900">{appointment.title}</span>
                        <span className="text-gray-500">{new Date(appointment.startTime).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700">{appointment.notes}</p>
                    </div>
                  </div>
                ))}

                {customerLeads.map(lead => (
                  <div key={lead.id} className="flex gap-3 p-4 bg-orange-50 rounded-lg">
                    <Target className="w-5 h-5 text-orange-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900">{lead.title}</span>
                        <span className={`px-2 py-1 rounded ${
                          lead.status === 'won' ? 'bg-green-100 text-green-800' :
                          lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-gray-700">{lead.description}</p>
                      <div className="text-gray-600 mt-2">Value: ${lead.value.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
