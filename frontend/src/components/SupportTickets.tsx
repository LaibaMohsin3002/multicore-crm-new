import { useState } from 'react';
import { useCRM, TicketStatus, TicketPriority } from './CRMContext';
import { Plus, X, Ticket as TicketIcon, AlertCircle, Clock } from 'lucide-react';

export function SupportTickets() {
  const { currentUser, tickets, addTicket, updateTicket, deleteTicket, customers, users } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    title: '',
    description: '',
    category: '',
    priority: 'medium' as TicketPriority
  });

  const tenantTickets = tickets.filter(t => t.tenantId === currentUser?.tenantId);
  const filteredTickets = filterStatus === 'all'
    ? tenantTickets
    : tenantTickets.filter(t => t.status === filterStatus);

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addTicket({
        tenantId: currentUser.tenantId!,
        customerId: formData.customerId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'open',
        assignedTo: currentUser.id
      });
      setShowAddModal(false);
      setFormData({
        customerId: '',
        title: '',
        description: '',
        category: '',
        priority: 'medium'
      });
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedTicketData = selectedTicket ? tickets.find(t => t.id === selectedTicket) : null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Support Tickets</h1>
          <p className="text-gray-600 mt-2">Manage customer support requests</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TicketIcon className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Open</span>
          </div>
          <div className="text-gray-900">
            {tenantTickets.filter(t => t.status === 'open').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="text-gray-900">
            {tenantTickets.filter(t => t.status === 'in_progress').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-gray-600">Urgent</span>
          </div>
          <div className="text-gray-900">
            {tenantTickets.filter(t => t.priority === 'urgent').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TicketIcon className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Resolved</span>
          </div>
          <div className="text-gray-900">
            {tenantTickets.filter(t => t.status === 'resolved').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TicketIcon className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Total</span>
          </div>
          <div className="text-gray-900">{tenantTickets.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('open')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'open'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'in_progress'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'resolved'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolved
            </button>
            <button
              onClick={() => setFilterStatus('closed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'closed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {sortedTickets.map(ticket => {
              const customer = customers.find(c => c.id === ticket.customerId);
              const assignedUser = users.find(u => u.id === ticket.assignedTo);

              return (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900">{ticket.title}</h3>
                        <span className={`px-2 py-0.5 rounded ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-2">{ticket.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>Customer: {customer?.name || 'Unknown'}</span>
                      <span>Category: {ticket.category}</span>
                      {assignedUser && <span>Assigned: {assignedUser.name}</span>}
                    </div>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}

            {sortedTickets.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No tickets found. Great job keeping the queue clear!
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Create Support Ticket</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select customer...</option>
                  {customers
                    .filter(c => c.tenantId === currentUser?.tenantId)
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.email}
                      </option>
                    ))}
                </select>
              </div>

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
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Technical, Billing, Feature Request, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
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
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTicket && selectedTicketData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2>{selectedTicketData.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-0.5 rounded ${getStatusColor(selectedTicketData.status)}`}>
                    {selectedTicketData.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.5 rounded ${getPriorityColor(selectedTicketData.priority)}`}>
                    {selectedTicketData.priority} priority
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-gray-600 mb-2">Description</div>
                <p className="text-gray-900">{selectedTicketData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-600 mb-2">Category</div>
                  <div className="text-gray-900">{selectedTicketData.category}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-2">Created</div>
                  <div className="text-gray-900">
                    {new Date(selectedTicketData.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-gray-600 mb-2">Update Status</div>
                <div className="flex flex-wrap gap-2">
                  {['open', 'in_progress', 'waiting', 'resolved', 'closed'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateTicket(selectedTicketData.id, { 
                        status: status as TicketStatus,
                        ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {})
                      })}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedTicketData.status === status
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    deleteTicket(selectedTicketData.id);
                    setSelectedTicket(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
