import { useCRM } from './CRMContext';
import { Eye, Users, Target, Ticket, Download } from 'lucide-react';

export function ViewerDashboard() {
  const { currentUser, customers, leads, tickets } = useCRM();

  const totalCustomers = customers.length;
  const totalLeads = leads.length;
  const totalTickets = tickets.length;
  const activeLeads = leads.filter(l => !['won', 'lost'].includes(l.status)).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Viewer Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name} (Read-Only Access)</p>
      </div>

      {/* Read-only KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
          <div className="text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeLeads}</div>
          <div className="text-gray-600">Active Leads</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-600 rounded-xl">
              <Ticket className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalTickets}</div>
          <div className="text-gray-600">Total Tickets</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-600 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">View Only</div>
          <div className="text-gray-600">Access Level</div>
        </div>
      </div>

      {/* Read-only Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customers (Read-Only)</h3>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>{totalCustomers} customers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Leads (Read-Only)</h3>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>{totalLeads} leads</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-blue-900 font-semibold mb-1">Read-Only Access</h4>
            <p className="text-blue-800 text-sm">
              You have view-only access to all data. You can view reports and export data, but cannot create, edit, or delete records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


