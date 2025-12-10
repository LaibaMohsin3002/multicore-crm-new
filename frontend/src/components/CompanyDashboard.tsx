import { useCRM } from './CRMContext';
import { Users, Target, Calendar, TrendingUp, CheckCircle, Clock, Ticket as TicketIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function CompanyDashboard() {
  const { currentUser, customers, leads, tasks, appointments, tickets } = useCRM();

  const tenantCustomers = customers.filter(c => c.tenantId === currentUser?.tenantId);
  const tenantLeads = leads.filter(l => l.tenantId === currentUser?.tenantId);
  const tenantTasks = tasks.filter(t => t.tenantId === currentUser?.tenantId);
  const tenantAppointments = appointments.filter(a => a.tenantId === currentUser?.tenantId);
  const tenantTickets = tickets.filter(t => t.tenantId === currentUser?.tenantId);

  const pendingTasks = tenantTasks.filter(t => t.status === 'pending').length;
  const upcomingAppointments = tenantAppointments.filter(a => a.status === 'scheduled').length;
  const openTickets = tenantTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  const leadsByStatus = {
    new: tenantLeads.filter(l => l.status === 'new').length,
    contacted: tenantLeads.filter(l => l.status === 'contacted').length,
    qualified: tenantLeads.filter(l => l.status === 'qualified').length,
    proposal: tenantLeads.filter(l => l.status === 'proposal').length,
    won: tenantLeads.filter(l => l.status === 'won').length,
    lost: tenantLeads.filter(l => l.status === 'lost').length
  };

  const leadPipelineData = [
    { name: 'New', value: leadsByStatus.new },
    { name: 'Contacted', value: leadsByStatus.contacted },
    { name: 'Qualified', value: leadsByStatus.qualified },
    { name: 'Proposal', value: leadsByStatus.proposal },
    { name: 'Won', value: leadsByStatus.won }
  ];

  const activityData = [
    { month: 'Jul', leads: 12, customers: 8 },
    { month: 'Aug', leads: 19, customers: 11 },
    { month: 'Sep', leads: 15, customers: 9 },
    { month: 'Oct', leads: 22, customers: 14 },
    { month: 'Nov', leads: 28, customers: 18 },
    { month: 'Dec', leads: 24, customers: 15 }
  ];

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subValue, 
    color,
    trend
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    subValue?: string;
    color: string;
    trend?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {trend}
          </span>
        )}
      </div>
      <div className="text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
      {subValue && <div className="text-gray-500 mt-1">{subValue}</div>}
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={tenantCustomers.length}
          subValue={`${tenantCustomers.filter(c => c.status === 'active').length} active`}
          color="bg-blue-600"
          trend="+12%"
        />
        <StatCard
          icon={Target}
          label="Active Leads"
          value={tenantLeads.filter(l => !['won', 'lost'].includes(l.status)).length}
          subValue={`${leadsByStatus.won} converted`}
          color="bg-orange-600"
          trend="+8%"
        />
        <StatCard
          icon={CheckCircle}
          label="Pending Tasks"
          value={pendingTasks}
          subValue={`${tenantTasks.filter(t => t.status === 'completed').length} completed`}
          color="bg-green-600"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Appointments"
          value={upcomingAppointments}
          subValue={`Next: Today`}
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Lead Pipeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leadPipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Growth Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="leads" stroke="#f97316" strokeWidth={2} />
              <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {tenantTasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <div className="text-gray-900">{task.title}</div>
                    <div className="text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-white ${
                  task.type === 'call' ? 'bg-blue-500' :
                  task.type === 'meeting' ? 'bg-purple-500' :
                  task.type === 'email' ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {task.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Quick Stats</h3>
            {openTickets > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">
                {openTickets} open tickets
              </span>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">High-Value Leads</span>
              </div>
              <span className="text-gray-900">{tenantLeads.filter(l => l.score >= 70).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Tasks This Week</span>
              </div>
              <span className="text-gray-900">{tenantTasks.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">This Week's Appointments</span>
              </div>
              <span className="text-gray-900">{upcomingAppointments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TicketIcon className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700">Support Tickets</span>
              </div>
              <span className="text-gray-900">{tenantTickets.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
