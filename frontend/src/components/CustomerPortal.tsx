import { useState } from 'react';
import { useCRM } from './CRMContext';
import { User, Ticket as TicketIcon, Calendar, FileText, LogOut, Plus, X } from 'lucide-react';

export function CustomerPortal() {
  const { currentUser, logout, tickets, appointments, addTicket } = useCRM();
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets' | 'appointments' | 'documents'>('profile');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  // Mock customer ID - in real app, this would come from currentUser
  const customerId = 'c1';
  const customerTickets = tickets.filter(t => t.customerId === customerId);
  const customerAppointments = appointments.filter(a => a.customerId === customerId);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.tenantId) {
      addTicket({
        tenantId: currentUser.tenantId,
        customerId,
        title: ticketForm.title,
        description: ticketForm.description,
        category: ticketForm.category,
        priority: ticketForm.priority,
        status: 'open'
      });
      setShowNewTicket(false);
      setTicketForm({ title: '', description: '', category: '', priority: 'medium' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-gray-900">Customer Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{currentUser?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'tickets'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Support Tickets
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'appointments'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'documents'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Documents
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4">Profile Information</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-600 mb-2">Name</label>
                      <div className="text-gray-900">{currentUser?.name}</div>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-2">Email</label>
                      <div className="text-gray-900">{currentUser?.email}</div>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-2">Account Status</label>
                      <div className="text-gray-900">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Active</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-2">Member Since</label>
                      <div className="text-gray-900">{new Date(currentUser?.createdAt || '').toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2>My Support Tickets</h2>
                  <button
                    onClick={() => setShowNewTicket(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    New Ticket
                  </button>
                </div>

                <div className="space-y-3">
                  {customerTickets.map(ticket => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-gray-900">{ticket.title}</h3>
                        <span className={`px-2 py-1 rounded ${
                          ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          ticket.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                          ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-gray-500">
                        <span>{ticket.category}</span>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}

                  {customerTickets.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <TicketIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No support tickets yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <h2>My Appointments</h2>
                <div className="space-y-3">
                  {customerAppointments.map(appointment => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-gray-900">{appointment.title}</h3>
                        <span className={`px-2 py-1 rounded ${
                          appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-gray-600">
                        <div>📅 {new Date(appointment.startTime).toLocaleString()}</div>
                        <div>📍 {appointment.location}</div>
                        {appointment.notes && <div className="mt-2 text-gray-700">{appointment.notes}</div>}
                      </div>
                    </div>
                  ))}

                  {customerAppointments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No appointments scheduled.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h2>Documents & Invoices</h2>
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No documents available yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Submit Support Ticket</h2>
              <button onClick={() => setShowNewTicket(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Technical">Technical Issue</option>
                    <option value="Billing">Billing Question</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
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
                  onClick={() => setShowNewTicket(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
