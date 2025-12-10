import { useCRM } from './CRMContext';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  CheckCircle, 
  Calendar,
  Ticket,
  MessageSquare,
  Activity,
  Award,
  Clock,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalyticsDashboard() {
  const { currentUser, customers, leads, deals, tasks, tickets, appointments, interactions } = useCRM();

  // Filter by tenant
  const tenantCustomers = customers.filter(c => c.tenantId === currentUser?.tenantId);
  const tenantLeads = leads.filter(l => l.tenantId === currentUser?.tenantId);
  const tenantDeals = deals.filter(d => d.tenantId === currentUser?.tenantId);
  const tenantTasks = tasks.filter(t => t.tenantId === currentUser?.tenantId);
  const tenantTickets = tickets.filter(t => t.tenantId === currentUser?.tenantId);
  const tenantAppointments = appointments.filter(a => a.tenantId === currentUser?.tenantId);
  const tenantInteractions = interactions.filter(i => i.tenantId === currentUser?.tenantId);

  // Lead analytics
  const leadsByStatus = [
    { name: 'New', value: tenantLeads.filter(l => l.status === 'new').length, color: '#3b82f6' },
    { name: 'Contacted', value: tenantLeads.filter(l => l.status === 'contacted').length, color: '#8b5cf6' },
    { name: 'Qualified', value: tenantLeads.filter(l => l.status === 'qualified').length, color: '#10b981' },
    { name: 'Proposal', value: tenantLeads.filter(l => l.status === 'proposal').length, color: '#f59e0b' },
    { name: 'Won', value: tenantLeads.filter(l => l.status === 'won').length, color: '#22c55e' },
    { name: 'Lost', value: tenantLeads.filter(l => l.status === 'lost').length, color: '#ef4444' }
  ];

  // Deal analytics
  const dealsByStage = [
    { name: 'Prospecting', value: tenantDeals.filter(d => d.stage === 'prospecting').length },
    { name: 'Qualification', value: tenantDeals.filter(d => d.stage === 'qualification').length },
    { name: 'Proposal', value: tenantDeals.filter(d => d.stage === 'proposal').length },
    { name: 'Negotiation', value: tenantDeals.filter(d => d.stage === 'negotiation').length },
    { name: 'Won', value: tenantDeals.filter(d => d.stage === 'closed_won').length },
    { name: 'Lost', value: tenantDeals.filter(d => d.stage === 'closed_lost').length }
  ];

  // Task analytics
  const tasksByStatus = [
    { name: 'Pending', value: tenantTasks.filter(t => t.status === 'pending').length, color: '#f59e0b' },
    { name: 'In Progress', value: tenantTasks.filter(t => t.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Completed', value: tenantTasks.filter(t => t.status === 'completed').length, color: '#10b981' },
    { name: 'Cancelled', value: tenantTasks.filter(t => t.status === 'cancelled').length, color: '#6b7280' }
  ];

  // Ticket analytics
  const ticketsByStatus = [
    { name: 'Open', value: tenantTickets.filter(t => t.status === 'open').length },
    { name: 'In Progress', value: tenantTickets.filter(t => t.status === 'in_progress').length },
    { name: 'Waiting', value: tenantTickets.filter(t => t.status === 'waiting').length },
    { name: 'Resolved', value: tenantTickets.filter(t => t.status === 'resolved').length },
    { name: 'Closed', value: tenantTickets.filter(t => t.status === 'closed').length }
  ];

  // Interaction sentiment
  const sentimentData = [
    { name: 'Positive', value: tenantInteractions.filter(i => i.sentiment === 'positive').length, color: '#10b981' },
    { name: 'Neutral', value: tenantInteractions.filter(i => i.sentiment === 'neutral').length, color: '#6b7280' },
    { name: 'Negative', value: tenantInteractions.filter(i => i.sentiment === 'negative').length, color: '#ef4444' }
  ];

  // Calculate key metrics
  const totalLeadValue = tenantLeads.reduce((sum, l) => sum + l.value, 0);
  const totalDealValue = tenantDeals.reduce((sum, d) => sum + d.amount, 0);
  const avgLeadScore = tenantLeads.length > 0 ? tenantLeads.reduce((sum, l) => sum + l.score, 0) / tenantLeads.length : 0;
  const conversionRate = tenantLeads.length > 0 ? (tenantLeads.filter(l => l.status === 'won').length / tenantLeads.length * 100) : 0;

  const MetricCard = ({ 
    icon: Icon, 
    label, 
    value, 
    change, 
    color,
    trend 
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    change?: string; 
    color: string;
    trend?: 'up' | 'down';
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {change}
          </span>
        )}
      </div>
      <div className="text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Analytics & Insights</h1>
        <p className="text-gray-600 mt-2">Comprehensive business performance metrics and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={Users}
          label="Total Customers"
          value={tenantCustomers.length}
          change="+12%"
          color="bg-blue-600"
          trend="up"
        />
        <MetricCard
          icon={Target}
          label="Active Leads"
          value={tenantLeads.filter(l => !['won', 'lost'].includes(l.status)).length}
          change="+8%"
          color="bg-purple-600"
          trend="up"
        />
        <MetricCard
          icon={DollarSign}
          label="Total Deal Value"
          value={`$${totalDealValue.toLocaleString()}`}
          change="+23%"
          color="bg-green-600"
          trend="up"
        />
        <MetricCard
          icon={Award}
          label="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          change="+5%"
          color="bg-orange-600"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={CheckCircle}
          label="Completed Tasks"
          value={tenantTasks.filter(t => t.status === 'completed').length}
          color="bg-emerald-600"
        />
        <MetricCard
          icon={Calendar}
          label="Scheduled Appointments"
          value={tenantAppointments.filter(a => a.status === 'scheduled').length}
          color="bg-cyan-600"
        />
        <MetricCard
          icon={Ticket}
          label="Open Tickets"
          value={tenantTickets.filter(t => ['open', 'in_progress'].includes(t.status)).length}
          color="bg-rose-600"
        />
        <MetricCard
          icon={MessageSquare}
          label="Total Interactions"
          value={tenantInteractions.length}
          color="bg-indigo-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Lead Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Lead Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Deal Pipeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Deal Pipeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dealsByStage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Task Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Task Completion Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tasksByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tasksByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Support Tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Support Ticket Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ticketsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Interaction Sentiment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Customer Interaction Sentiment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="text-gray-600">Average Lead Score</div>
                <div className="text-gray-900">{avgLeadScore.toFixed(1)} / 100</div>
              </div>
              <div className="p-3 bg-blue-600 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="text-gray-600">Total Lead Value</div>
                <div className="text-gray-900">${totalLeadValue.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-green-600 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="text-gray-600">Lead Conversion Rate</div>
                <div className="text-gray-900">{conversionRate.toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-purple-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <div className="text-gray-600">Active Tasks</div>
                <div className="text-gray-900">{tenantTasks.filter(t => ['pending', 'in_progress'].includes(t.status)).length}</div>
              </div>
              <div className="p-3 bg-orange-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Sources */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4">Lead Sources</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from(new Set(tenantLeads.map(l => l.source))).map((source) => {
            const count = tenantLeads.filter(l => l.source === source).length;
            const percentage = (count / tenantLeads.length * 100).toFixed(1);
            return (
              <div key={source} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-900">{count}</div>
                <div className="text-gray-600">{source}</div>
                <div className="text-gray-500 mt-1">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
