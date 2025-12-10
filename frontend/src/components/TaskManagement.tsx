import { useState } from 'react';
import { useCRM, TaskStatus } from './CRMContext';
import { Plus, X, CheckCircle, Clock, XCircle, Phone, Mail, Users as MeetingIcon, MessageCircle, Trash2 } from 'lucide-react';

export function TaskManagement() {
  const { currentUser, tasks, addTask, updateTask, deleteTask, customers, leads } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'call' as 'call' | 'follow_up' | 'meeting' | 'email',
    dueDate: '',
    relatedType: 'none' as 'none' | 'customer' | 'lead',
    relatedId: ''
  });

  const tenantTasks = tasks.filter(t => t.tenantId === currentUser?.tenantId);
  const filteredTasks = filterStatus === 'all' 
    ? tenantTasks 
    : tenantTasks.filter(t => t.status === filterStatus);

  const sortedTasks = [...filteredTasks].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addTask({
        tenantId: currentUser.tenantId!,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: 'pending',
        assignedTo: currentUser.id,
        createdBy: currentUser.id,
        dueDate: formData.dueDate,
        relatedTo: formData.relatedType !== 'none' 
          ? { type: formData.relatedType as 'customer' | 'lead', id: formData.relatedId }
          : undefined
      });
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        type: 'call',
        dueDate: '',
        relatedType: 'none',
        relatedId: ''
      });
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return MeetingIcon;
      case 'follow_up': return MessageCircle;
      default: return CheckCircle;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-500';
      case 'email': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      case 'follow_up': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Tasks</h1>
          <p className="text-gray-600 mt-2">Manage follow-ups and activities</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Pending</span>
          </div>
          <div className="text-gray-900">{tenantTasks.filter(t => t.status === 'pending').length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="text-gray-900">{tenantTasks.filter(t => t.status === 'in_progress').length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="text-gray-900">{tenantTasks.filter(t => t.status === 'completed').length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-gray-600">Overdue</span>
          </div>
          <div className="text-gray-900">
            {tenantTasks.filter(t => isOverdue(t.dueDate, t.status)).length}
          </div>
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
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
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
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {sortedTasks.map(task => {
              const TaskIcon = getTaskIcon(task.type);
              const overdue = isOverdue(task.dueDate, task.status);
              let relatedInfo = '';
              if (task.relatedTo) {
                if (task.relatedTo.type === 'customer') {
                  const customer = customers.find(c => c.id === task.relatedTo?.id);
                  relatedInfo = customer ? `Customer: ${customer.name}` : '';
                } else {
                  const lead = leads.find(l => l.id === task.relatedTo?.id);
                  relatedInfo = lead ? `Lead: ${lead.title}` : '';
                }
              }

              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
                    overdue ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-3 ${getTypeColor(task.type)} rounded-lg`}>
                    <TaskIcon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900">{task.title}</h3>
                      {overdue && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{task.description}</p>
                    {relatedInfo && (
                      <div className="text-gray-500 mb-2">{relatedInfo}</div>
                    )}
                    <div className="flex items-center gap-4 text-gray-500">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className={`px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => updateTask(task.id, { 
                          status: task.status === 'pending' ? 'in_progress' : 'completed' 
                        })}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        {task.status === 'pending' ? 'Start' : 'Complete'}
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {sortedTasks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No tasks found. Create your first task to get started!
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Add New Task</h2>
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
                  <label className="block text-gray-700 mb-2">Task Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="follow_up">Follow Up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Related To</label>
                  <select
                    value={formData.relatedType}
                    onChange={(e) => setFormData({ ...formData, relatedType: e.target.value as any, relatedId: '' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="none">None</option>
                    <option value="customer">Customer</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
                {formData.relatedType !== 'none' && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Select {formData.relatedType === 'customer' ? 'Customer' : 'Lead'}
                    </label>
                    <select
                      value={formData.relatedId}
                      onChange={(e) => setFormData({ ...formData, relatedId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      {formData.relatedType === 'customer'
                        ? customers
                            .filter(c => c.tenantId === currentUser?.tenantId)
                            .map(c => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))
                        : leads
                            .filter(l => l.tenantId === currentUser?.tenantId)
                            .map(l => (
                              <option key={l.id} value={l.id}>
                                {l.title}
                              </option>
                            ))}
                    </select>
                  </div>
                )}
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}