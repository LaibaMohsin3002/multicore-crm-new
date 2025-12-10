import { useState } from 'react';
import { useCRM } from './CRMContext';
import { Sparkles, TrendingUp, Check, X, Brain } from 'lucide-react';

export function AILeadMatching() {
  const { currentUser, aiRecommendations, updateAIRecommendation, customers, leads } = useCRM();

  const tenantRecommendations = aiRecommendations.filter(r => r.tenantId === currentUser?.tenantId);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('pending');

  const filteredRecommendations = filterStatus === 'all'
    ? tenantRecommendations
    : tenantRecommendations.filter(r => r.status === filterStatus);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-indigo-600" />
          <h1>AI-Powered Lead Matching</h1>
        </div>
        <p className="text-gray-600">AI-generated recommendations for customer-business matches and lead insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <Sparkles className="w-8 h-8 mb-4" />
          <div className="text-3xl mb-1">{tenantRecommendations.length}</div>
          <div className="text-indigo-100">Total Recommendations</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-4" />
          <div className="text-3xl mb-1">{tenantRecommendations.filter(r => r.status === 'pending').length}</div>
          <div className="text-purple-100">Pending Review</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Check className="w-8 h-8 mb-4" />
          <div className="text-3xl mb-1">{tenantRecommendations.filter(r => r.status === 'accepted').length}</div>
          <div className="text-green-100">Accepted</div>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white">
          <X className="w-8 h-8 mb-4" />
          <div className="text-3xl mb-1">{tenantRecommendations.filter(r => r.status === 'rejected').length}</div>
          <div className="text-gray-100">Rejected</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            {(['all', 'pending', 'accepted', 'rejected'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {filteredRecommendations.map(recommendation => (
              <div key={recommendation.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{recommendation.title}</h3>
                      <span className={`px-3 py-1 rounded-full ${
                        recommendation.type === 'lead_match' ? 'bg-blue-100 text-blue-800' :
                        recommendation.type === 'customer_suggestion' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {recommendation.type.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                        <Sparkles className="w-4 h-4" />
                        <span>Score: {recommendation.score}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{recommendation.description}</p>
                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                      <div className="text-gray-600 mb-2">AI Reasoning:</div>
                      <p className="text-gray-900">{recommendation.reasoning}</p>
                    </div>
                  </div>
                </div>

                {recommendation.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateAIRecommendation(recommendation.id, { status: 'accepted' })}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => updateAIRecommendation(recommendation.id, { status: 'rejected' })}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {recommendation.status !== 'pending' && (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full ${
                    recommendation.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {recommendation.status.charAt(0).toUpperCase() + recommendation.status.slice(1)}
                  </div>
                )}
              </div>
            ))}

            {filteredRecommendations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No recommendations found. AI will generate insights as you add more data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
