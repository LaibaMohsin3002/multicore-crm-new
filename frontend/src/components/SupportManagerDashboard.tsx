import { useCRM } from './CRMContext';
import { Ticket, Users, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

export function SupportManagerDashboard() {
  const { currentUser, tickets } = useCRM();

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const highPriorityTickets = tickets.filter(t => t.priority === 'high' || t.priority === 'urgent');
  const slaBreaches = tickets.filter(t => t.status === 'open' && t.priority === 'urgent'); // Mock SLA breach detection
  const teamWorkload = [
    { name: 'Support Agent 1', tickets: 8, resolved: 12 },
    { name: 'Support Agent 2', tickets: 5, resolved: 15 },
    { name: 'Support Agent 3', tickets: 10, resolved: 8 },
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
        <h1 className="text-3xl font-bold text-gray-900">Support Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}</p>
      </div>

      {/* SLA & Ticket Health KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Ticket}
          label="Open Tickets"
          value={openTickets.length}
          color="bg-red-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="High Priority"
          value={highPriorityTickets.length}
          color="bg-orange-600"
        />
        <StatCard
          icon={Clock}
          label="SLA Breaches"
          value={slaBreaches.length}
          color="bg-yellow-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Resolution"
          value="2.5h"
          color="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Workload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Workload</h3>
          <div className="space-y-3">
            {teamWorkload.map((member, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-900 font-medium">{member.name}</div>
                  <div className="text-gray-600 text-sm">{member.tickets} active</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(member.tickets / 15) * 100}%` }}
                  />
                </div>
                <div className="text-gray-500 text-xs mt-1">{member.resolved} resolved today</div>
              </div>
            ))}
          </div>
        </div>

        {/* Unassigned Tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Unassigned Tickets</h3>
          {tickets.filter(t => !t.assignedTo && t.status === 'open').length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Ticket className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No unassigned tickets</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets
                .filter(t => !t.assignedTo && t.status === 'open')
                .slice(0, 5)
                .map(ticket => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-gray-900 font-medium">{ticket.title || 'Untitled Ticket'}</div>
                      <div className="text-gray-500 text-sm">
                        {ticket.priority ? `Priority: ${ticket.priority}` : 'No priority'}
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                      Assign
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


