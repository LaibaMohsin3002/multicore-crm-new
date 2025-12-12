import { useCRM } from './CRMContext';
import { Ticket, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export function SupportAgentDashboard() {
  const { currentUser, tickets } = useCRM();

  // Filter tickets assigned to current user
  const myTickets = tickets.filter(t => t.assignedTo === currentUser?.id || !t.assignedTo);
  const openTickets = myTickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const resolvedToday = myTickets.filter(t => t.status === 'resolved'); // Mock: would filter by date

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Agent Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-600 rounded-xl">
              <Ticket className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{openTickets.length}</div>
          <div className="text-gray-600">My Open Tickets</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-600 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{resolvedToday.length}</div>
          <div className="text-gray-600">Resolved Today</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">2.5h</div>
          <div className="text-gray-600">Avg Resolution Time</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Ticket Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Ticket Queue</h3>
          {openTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Ticket className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No open tickets</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openTickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-900 font-medium">{ticket.title || 'Untitled Ticket'}</div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.priority || 'medium'}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">{ticket.description || 'No description'}</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                      Reply
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Composer & Internal Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Reply to Ticket</label>
              <textarea
                placeholder="Type your reply..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={4}
              />
              <button className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Send Reply
              </button>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Add Internal Note</label>
              <textarea
                placeholder="Internal note (not visible to customer)..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
              />
              <button className="mt-2 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


