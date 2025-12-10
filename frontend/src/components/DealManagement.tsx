import { useState } from 'react';
import { useCRM, DealStage } from './CRMContext';
import { Plus, X, DollarSign, TrendingUp, Target, User } from 'lucide-react';

export function DealManagement() {
  const { currentUser, deals, addDeal, updateDeal, deleteDeal, customers, leads, users } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    probability: '50',
    expectedCloseDate: '',
    customerId: '',
    leadId: '',
    tags: ''
  });

  const tenantDeals = deals.filter(d => d.tenantId === currentUser?.tenantId);

  const dealsByStage = {
    prospecting: tenantDeals.filter(d => d.stage === 'prospecting').length,
    qualification: tenantDeals.filter(d => d.stage === 'qualification').length,
    proposal: tenantDeals.filter(d => d.stage === 'proposal').length,
    negotiation: tenantDeals.filter(d => d.stage === 'negotiation').length,
    closed_won: tenantDeals.filter(d => d.stage === 'closed_won').length,
    closed_lost: tenantDeals.filter(d => d.stage === 'closed_lost').length
  };

  const totalValue = tenantDeals
    .filter(d => d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + d.amount, 0);

  const weightedValue = tenantDeals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((sum, d) => sum + (d.amount * d.probability / 100), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addDeal({
        tenantId: currentUser.tenantId!,
        title: formData.title,
        description: formData.description,
        stage: 'prospecting',
        amount: parseFloat(formData.amount),
        probability: parseInt(formData.probability),
        expectedCloseDate: formData.expectedCloseDate,
        assignedTo: currentUser.id,
        customerId: formData.customerId || undefined,
        leadId: formData.leadId || undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        amount: '',
        probability: '50',
        expectedCloseDate: '',
        customerId: '',
        leadId: '',
        tags: ''
      });
    }
  };

  const getStageColor = (stage: DealStage) => {
    const colors = {
      prospecting: 'bg-gray-100 text-gray-800',
      qualification: 'bg-blue-100 text-blue-800',
      proposal: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-yellow-100 text-yellow-800',
      closed_won: 'bg-green-100 text-green-800',
      closed_lost: 'bg-red-100 text-red-800'
    };
    return colors[stage];
  };

  const selectedDealData = selectedDeal ? deals.find(d => d.id === selectedDeal) : null;

  const winRate = tenantDeals.length > 0
    ? (dealsByStage.closed_won / (dealsByStage.closed_won + dealsByStage.closed_lost)) * 100
    : 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Deals</h1>
          <p className="text-gray-600 mt-2">Manage your sales pipeline</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl mb-1">${(totalValue / 1000).toFixed(0)}K</div>
          <div className="text-green-100">Total Pipeline Value</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
          </div>
          <div className="text-3xl mb-1">${(weightedValue / 1000).toFixed(0)}K</div>
          <div className="text-purple-100">Weighted Pipeline</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="text-3xl mb-1">{tenantDeals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length}</div>
          <div className="text-blue-100">Active Deals</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="text-3xl mb-1">{winRate.toFixed(0)}%</div>
          <div className="text-orange-100">Win Rate</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3>Deal Pipeline</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-6 gap-4">
            {(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] as DealStage[]).map(stage => {
              const stageDeals = tenantDeals.filter(d => d.stage === stage);
              const stageValue = stageDeals.reduce((sum, d) => sum + d.amount, 0);
              const stageName = stage.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

              return (
                <div key={stage} className="space-y-3">
                  <div className="text-center">
                    <div className={`px-3 py-1 rounded ${getStageColor(stage)} inline-block mb-2`}>
                      {stageName}
                    </div>
                    <div className="text-gray-900">{stageDeals.length} deals</div>
                    <div className="text-gray-600">${(stageValue / 1000).toFixed(0)}K</div>
                  </div>
                  <div className="space-y-2">
                    {stageDeals.map(deal => (
                      <div
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal.id)}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="text-gray-900 mb-1">{deal.title}</div>
                        <div className="text-gray-600">${deal.amount.toLocaleString()}</div>
                        <div className="text-gray-500">{deal.probability}% prob.</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Add New Deal</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Deal Title</label>
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
                  <label className="block text-gray-700 mb-2">Deal Amount ($)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Expected Close Date</label>
                <input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Related Customer (Optional)</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">None</option>
                    {customers.filter(c => c.tenantId === currentUser?.tenantId).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Related Lead (Optional)</label>
                  <select
                    value={formData.leadId}
                    onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">None</option>
                    {leads.filter(l => l.tenantId === currentUser?.tenantId).map(l => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="enterprise, high-priority, q4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  Add Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedDeal && selectedDealData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2>{selectedDealData.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-0.5 rounded ${getStageColor(selectedDealData.stage)}`}>
                    {selectedDealData.stage.replace('_', ' ')}
                  </span>
                  <span className="text-gray-600">${selectedDealData.amount.toLocaleString()}</span>
                  <span className="text-gray-600">{selectedDealData.probability}% probability</span>
                </div>
              </div>
              <button onClick={() => setSelectedDeal(null)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-gray-600 mb-2">Description</div>
                <p className="text-gray-900">{selectedDealData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-600 mb-2">Expected Close Date</div>
                  <div className="text-gray-900">{new Date(selectedDealData.expectedCloseDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-2">Assigned To</div>
                  <div className="text-gray-900">{users.find(u => u.id === selectedDealData.assignedTo)?.name}</div>
                </div>
              </div>

              {selectedDealData.tags.length > 0 && (
                <div>
                  <div className="text-gray-600 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDealData.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-gray-600 mb-2">Move to Stage</div>
                <div className="flex flex-wrap gap-2">
                  {(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] as DealStage[]).map(stage => (
                    <button
                      key={stage}
                      onClick={() => updateDeal(selectedDealData.id, { 
                        stage,
                        ...(stage === 'closed_won' || stage === 'closed_lost' ? { closedAt: new Date().toISOString() } : {})
                      })}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedDealData.stage === stage
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {stage.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    deleteDeal(selectedDealData.id);
                    setSelectedDeal(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
