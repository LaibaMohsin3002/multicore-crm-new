import { useState } from 'react';
import { useCRM, AppointmentStatus } from './CRMContext';
import { Plus, X, Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';

export function AppointmentScheduler() {
  const { currentUser, appointments, addAppointment, updateAppointment, deleteAppointment, customers, users } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [formData, setFormData] = useState({
    title: '',
    customerId: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: ''
  });

  const tenantAppointments = appointments.filter(a => a.tenantId === currentUser?.tenantId);
  const sortedAppointments = [...tenantAppointments].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const upcomingAppointments = sortedAppointments.filter(
    a => new Date(a.startTime) >= new Date() && a.status === 'scheduled'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addAppointment({
        tenantId: currentUser.tenantId!,
        title: formData.title,
        customerId: formData.customerId,
        assignedTo: currentUser.id,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: 'scheduled',
        location: formData.location,
        notes: formData.notes
      });
      setShowAddModal(false);
      setFormData({
        title: '',
        customerId: '',
        startTime: '',
        endTime: '',
        location: '',
        notes: ''
      });
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-yellow-100 text-yellow-800';
    }
  };

  const groupByDate = (appointments: typeof tenantAppointments) => {
    const grouped: { [key: string]: typeof tenantAppointments } = {};
    appointments.forEach(apt => {
      const date = new Date(apt.startTime).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(apt);
    });
    return grouped;
  };

  const groupedAppointments = groupByDate(sortedAppointments);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Appointments</h1>
          <p className="text-gray-600 mt-2">Schedule and manage customer meetings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Schedule Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Upcoming</span>
          </div>
          <div className="text-gray-900">{upcomingAppointments.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="text-gray-900">
            {tenantAppointments.filter(a => a.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="w-5 h-5 text-orange-600" />
            <span className="text-gray-600">This Week</span>
          </div>
          <div className="text-gray-900">
            {tenantAppointments.filter(a => {
              const aptDate = new Date(a.startTime);
              const now = new Date();
              const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              return aptDate >= now && aptDate <= weekFromNow;
            }).length}
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3>All Appointments</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
              <div key={date}>
                <div className="p-4 bg-gray-50">
                  <h4 className="text-gray-700">{date}</h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {dateAppointments.map(appointment => {
                    const customer = customers.find(c => c.id === appointment.customerId);
                    const assignedUser = users.find(u => u.id === appointment.assignedTo);
                    return (
                      <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-gray-900">{appointment.title}</h4>
                              <span className={`px-2 py-0.5 rounded ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-gray-600">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{customer?.name || 'Unknown'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {new Date(appointment.startTime).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })} - {new Date(appointment.endTime).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                              {appointment.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{appointment.location}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>With: {assignedUser?.name}</span>
                              </div>
                            </div>
                            {appointment.notes && (
                              <p className="mt-2 text-gray-600">{appointment.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {appointment.status === 'scheduled' && (
                              <>
                                <button
                                  onClick={() => updateAppointment(appointment.id, { status: 'completed' })}
                                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => updateAppointment(appointment.id, { status: 'cancelled' })}
                                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {sortedAppointments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No appointments scheduled. Create your first appointment!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center text-gray-600 py-12">
            Calendar view coming soon! Use list view to manage appointments.
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Schedule Appointment</h2>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Office, Zoom link, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Agenda, preparation notes, etc."
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
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
