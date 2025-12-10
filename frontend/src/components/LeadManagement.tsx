import { useState } from 'react';
import { useCRM, LeadStatus } from './CRMContext';
import { 
  Plus, 
  Search, 
  Target, 
  TrendingUp, 
  X,
  Edit,
  Trash2,
  ArrowRight,
  Tag,
  DollarSign,
  User
} from 'lucide-react';

export function LeadManagement() {
  const { currentUser, leads, addLead, updateLead, deleteLead, convertLeadToCustomer, users } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    phone: '',
    description: '',
    source: '',
    tags: ''
  });

  const tenantLeads = leads.filter(l => l.tenantId === currentUser?.tenantId);
  const filteredLeads = tenantLeads.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         l.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const leadsByStatus = {
    new: tenantLeads.filter(l => l.status === 'new').length,
    contacted: tenantLeads.filter(l => l.status === 'contacted').length,
    qualified: tenantLeads.filter(l => l.status === 'qualified').length,
    proposal: tenantLeads.filter(l => l.status === 'proposal').length,
    negotiation: tenantLeads.filter(l => l.status === 'negotiation').length,
    won: tenantLeads.filter(l => l.status === 'won').length,
    lost: tenantLeads.filter(l => l.status === 'lost').length
  };

  const totalValue = tenantLeads
    .filter(l => !['won', 'lost'].includes(l.status))
    .reduce((sum, l) => sum + l.value, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addLead({
        tenantId: currentUser.tenantId!,
        title: formData.title,
        description: formData.description,
        status: 'new',
        score: 50,
        value: parseFloat(formData.value) || 0,
        source: formData.source,
        assignedTo: currentUser.id,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setShowAddModal(false);
      setFormData({
        title: '',
        name: '',
        email: '',
        phone: '',
        description: '',
        value: '',
        source: '',
        tags: ''
      });
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      new: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      qualified: 'bg-cyan-100 text-cyan-800',
      proposal: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-yellow-100 text-yellow-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const selectedLeadData = selectedLead ? leads.find(l => l.id === selectedLead) : null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Leads</h1>
          <p className="text-gray-600 mt-2">Track and manage your sales pipeline</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl mb-1">{tenantLeads.filter(l => !['won', 'lost'].includes(l.status)).length}</div>
          <div className="text-blue-100">Active Leads</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl mb-1">${(totalValue / 1000).toFixed(0)}K</div>
          <div className="text-green-100">Pipeline Value</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
          </div>
          <div className="text-3xl mb-1">{leadsByStatus.qualified + leadsByStatus.proposal + leadsByStatus.negotiation}</div>
          <div className="text-purple-100">Hot Leads</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="text-3xl mb-1">{leadsByStatus.won}</div>
          <div className="text-orange-100">Converted</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.map(lead => {
              const assignedUser = users.find(u => u.id === lead.assignedTo);
              return (
                <div
                  key={lead.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedLead(lead.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{lead.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{lead.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <span className="text-gray-900">${lead.value.toLocaleString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {lead.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{assignedUser?.name}</span>
                    </div>
                    <div className="text-gray-500">{lead.source}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Add New Lead</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Estimated Value ($)</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Source</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Website, Referral, Cold Call, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="enterprise, high-value, urgent"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedLead && selectedLeadData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2>{selectedLeadData.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${getStatusColor(selectedLeadData.status)}`}>
                    {selectedLeadData.status}
                  </span>
                  <span className={`px-2 py-1 rounded ${getScoreColor(selectedLeadData.score)}`}>
                    Score: {selectedLeadData.score}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-gray-600 mb-2">Description</div>
                <p className="text-gray-900">{selectedLeadData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-600 mb-2">Estimated Value</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    ${selectedLeadData.value.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-2">Source</div>
                  <div className="text-gray-900">{selectedLeadData.source}</div>
                </div>
              </div>

              <div>
                <div className="text-gray-600 mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {selectedLeadData.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-gray-600 mb-2">Update Status</div>
                <div className="flex flex-wrap gap-2">
                  {['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateLead(selectedLeadData.id, { status: status as LeadStatus })}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedLeadData.status === status
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    convertLeadToCustomer(selectedLeadData.id);
                    setSelectedLead(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Convert to Customer
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    deleteLead(selectedLeadData.id);
                    setSelectedLead(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}