import { useCRM } from './CRMContext';
import { DollarSign, TrendingUp, FileText, Download } from 'lucide-react';

export function FinanceDashboard() {
  const { currentUser, leads, customers } = useCRM();

  // Calculate finance metrics (read-only)
  const totalSales = leads.filter(l => l.status === 'won').reduce((sum, l) => sum + (l.value || 0), 0);
  const monthlyRevenue = totalSales; // Mock calculation
  const activeCustomers = customers.filter(c => c.status === 'active' || !c.status).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}</p>
      </div>

      {/* Read-only KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-600 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">${totalSales.toLocaleString()}</div>
          <div className="text-gray-600">Total Sales</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">${monthlyRevenue.toLocaleString()}</div>
          <div className="text-gray-600">Monthly Revenue</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeCustomers}</div>
          <div className="text-gray-600">Active Customers</div>
        </div>
      </div>

      {/* Read-only Sales/Transactions View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sales Transactions</h3>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Sales transactions view (read-only)</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Finance Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <FileText className="w-5 h-5 text-gray-600 mb-2" />
            <div className="text-gray-900 font-medium">Sales Report</div>
            <div className="text-gray-500 text-sm">Export sales data</div>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <DollarSign className="w-5 h-5 text-gray-600 mb-2" />
            <div className="text-gray-900 font-medium">Revenue Report</div>
            <div className="text-gray-500 text-sm">Export revenue data</div>
          </button>
        </div>
      </div>
    </div>
  );
}


