import { useCRM } from './CRMContext';
import { Target, CheckCircle, Calendar, Plus, MessageSquare } from 'lucide-react';

export function SalesAgentDashboard() {
  const { currentUser, leads, tasks, appointments } = useCRM();

  // Filter leads assigned to current user
  const myLeads = leads.filter(l => l.assignedTo === currentUser?.id || !l.assignedTo);
  const activeLeads = myLeads.filter(l => !['won', 'lost'].includes(l.status));
  const pendingTasks = tasks.filter(t => t.status === 'pending' && t.assignedTo === currentUser?.id);
  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeLeads.length}</div>
          <div className="text-gray-600">My Active Leads</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{pendingTasks.length}</div>
          <div className="text-gray-600">Pending Tasks</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</div>
          <div className="text-gray-600">Upcoming Appointments</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">My Leads</h3>
            <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {activeLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No leads assigned</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeLeads.slice(0, 5).map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-gray-900 font-medium">{lead.title || 'Untitled Lead'}</div>
                    <div className="text-gray-500 text-sm">Status: {lead.status} • Score: {lead.score || 0}</div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks & Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks & Appointments</h3>
          <div className="space-y-3">
            {pendingTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-gray-900">{task.title || 'Untitled Task'}</div>
                  <div className="text-gray-500 text-sm">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            ))}
            {upcomingAppointments.slice(0, 2).map(apt => (
              <div key={apt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-gray-900">{apt.title || 'Appointment'}</div>
                  <div className="text-gray-500 text-sm">{apt.startTime ? new Date(apt.startTime).toLocaleString() : 'N/A'}</div>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && upcomingAppointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks or appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Composer */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Activity</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter activity note..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Log
          </button>
        </div>
      </div>
    </div>
  );
}


