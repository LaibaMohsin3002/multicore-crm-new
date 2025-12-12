import { useCRM } from './CRMContext';
import { Target, Users, TrendingUp, CheckCircle, Clock, BarChart3 } from 'lucide-react';

export function SalesManagerDashboard() {
  const { currentUser, leads, customers } = useCRM();

  // Filter leads for this business
  const businessLeads = leads || [];
  const unassignedLeads = businessLeads.filter(l => !l.assignedTo);
  const activeLeads = businessLeads.filter(l => !['won', 'lost'].includes(l.status));
  const wonLeads = businessLeads.filter(l => l.status === 'won').length;
  const pipelineValue = activeLeads.reduce((sum, l) => sum + (l.value || 0), 0);

  // Mock leaderboard data
  const leaderboard = [
    { name: 'John Sales', leads: 12, converted: 8, value: 45000 },
    { name: 'Jane Agent', leads: 10, converted: 6, value: 38000 },
    { name: 'Mike Rep', leads: 8, converted: 5, value: 32000 },
  ];

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    color 
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}</p>
      </div>

      {/* Team/Pipeline KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Target}
          label="Active Leads"
          value={activeLeads.length}
          color="bg-orange-600"
        />
        <StatCard
          icon={Clock}
          label="Unassigned Leads"
          value={unassignedLeads.length}
          color="bg-yellow-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Won Leads"
          value={wonLeads}
          color="bg-green-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Pipeline Value"
          value={`$${pipelineValue.toLocaleString()}`}
          color="bg-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Leads Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Unassigned Leads Queue</h3>
          {unassignedLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No unassigned leads</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unassignedLeads.slice(0, 5).map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-gray-900 font-medium">{lead.title || 'Untitled Lead'}</div>
                    <div className="text-gray-500 text-sm">Score: {lead.score || 0}</div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                    Assign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Leaderboard</h3>
          <div className="space-y-3">
            {leaderboard.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">{member.name}</div>
                    <div className="text-gray-500 text-sm">{member.leads} leads • {member.converted} converted</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-semibold">${member.value.toLocaleString()}</div>
                  <div className="text-gray-500 text-xs">Value</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


