import { useState } from 'react';
import { useCRM } from './CRMContext';
import { Plus, X, Phone, Mail, Users as MeetingIcon, MessageSquare, Smile, Meh, Frown } from 'lucide-react';

export function InteractionLog() {
  const { currentUser, interactions, addInteraction, customers } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'call' | 'meeting' | 'email' | 'chat'>('all');
  const [formData, setFormData] = useState({
    customerId: '',
    type: 'call' as 'call' | 'meeting' | 'email' | 'chat',
    summary: '',
    sentiment: 'neutral' as 'positive' | 'neutral' | 'negative',
    keywords: '',
    notes: ''
  });

  const tenantInteractions = interactions.filter(i => i.tenantId === currentUser?.tenantId);
  const filteredInteractions = filterType === 'all'
    ? tenantInteractions
    : tenantInteractions.filter(i => i.type === filterType);

  const sortedInteractions = [...filteredInteractions].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addInteraction({
        tenantId: currentUser.tenantId!,
        customerId: formData.customerId,
        userId: currentUser.id,
        type: formData.type,
        summary: formData.summary,
        sentiment: formData.sentiment,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        notes: formData.notes
      });
      setShowAddModal(false);
      setFormData({
        customerId: '',
        type: 'call',
        summary: '',
        sentiment: 'neutral',
        keywords: '',
        notes: ''
      });
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return MeetingIcon;
      case 'chat': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return Smile;
      case 'negative': return Frown;
      default: return Meh;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-500';
      case 'email': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      case 'chat': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Interaction Log</h1>
          <p className="text-gray-600 mt-2">Track all customer communications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Log Interaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span className="text-gray-600">Total</span>
          </div>
          <div className="text-gray-900">{tenantInteractions.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Phone className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Calls</span>
          </div>
          <div className="text-gray-900">
            {tenantInteractions.filter(i => i.type === 'call').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Emails</span>
          </div>
          <div className="text-gray-900">
            {tenantInteractions.filter(i => i.type === 'email').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <MeetingIcon className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600">Meetings</span>
          </div>
          <div className="text-gray-900">
            {tenantInteractions.filter(i => i.type === 'meeting').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Smile className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Positive</span>
          </div>
          <div className="text-gray-900">
            {tenantInteractions.filter(i => i.sentiment === 'positive').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('call')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'call'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calls
            </button>
            <button
              onClick={() => setFilterType('email')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'email'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Emails
            </button>
            <button
              onClick={() => setFilterType('meeting')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'meeting'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Meetings
            </button>
            <button
              onClick={() => setFilterType('chat')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'chat'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chats
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {sortedInteractions.map(interaction => {
              const InteractionIcon = getInteractionIcon(interaction.type);
              const SentimentIcon = getSentimentIcon(interaction.sentiment);
              const customer = customers.find(c => c.id === interaction.customerId);

              return (
                <div
                  key={interaction.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className={`p-3 ${getTypeColor(interaction.type)} rounded-lg h-fit`}>
                    <InteractionIcon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-gray-900">{customer?.name || 'Unknown Customer'}</h4>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {interaction.type.toUpperCase()}
                        </span>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded ${getSentimentColor(interaction.sentiment)}`}>
                          <SentimentIcon className="w-4 h-4" />
                          <span>{interaction.sentiment}</span>
                        </div>
                      </div>
                      <span className="text-gray-500">
                        {new Date(interaction.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">{interaction.summary}</p>

                    {interaction.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {interaction.keywords.map(keyword => (
                          <span key={keyword} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}

                    {interaction.notes && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-gray-600 mb-1">Notes:</div>
                        <p className="text-gray-700">{interaction.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {sortedInteractions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No interactions logged yet. Start tracking customer communications!
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Log Interaction</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="block text-gray-700 mb-2">Interaction Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="chat">Chat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Sentiment</label>
                  <select
                    value={formData.sentiment}
                    onChange={(e) => setFormData({ ...formData, sentiment: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Summary</label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief summary of the interaction"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="pricing, demo, support, etc."
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                  placeholder="Detailed notes about the interaction..."
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
                  Log Interaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
