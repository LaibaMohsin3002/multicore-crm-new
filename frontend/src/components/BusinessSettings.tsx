import { useState } from 'react';
import { useCRM } from './CRMContext';
import { Settings, Palette, Bell, Shield } from 'lucide-react';

export function BusinessSettings() {
  const { currentUser, tenants, updateTenant } = useCRM();
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'notifications' | 'permissions'>('general');

  const currentTenant = tenants.find(t => t.id === currentUser?.tenantId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Business Settings</h1>
        <p className="text-gray-600 mt-2">Configure your business settings and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5 inline mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'branding'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Palette className="w-5 h-5 inline mr-2" />
              Branding
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="w-5 h-5 inline mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'permissions'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-5 h-5 inline mr-2" />
              Permissions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  defaultValue={currentTenant?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  defaultValue={currentTenant?.industry}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <textarea
                  defaultValue={currentTenant?.address}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  defaultValue={currentTenant?.branding?.primaryColor || '#6366f1'}
                  className="w-20 h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Secondary Color</label>
                <input
                  type="color"
                  defaultValue={currentTenant?.branding?.secondaryColor || '#8b5cf6'}
                  className="w-20 h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Logo URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Save Branding
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="text-gray-900">Email Notifications</div>
                  <div className="text-gray-600">Receive notifications via email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="text-gray-900">Task Reminders</div>
                  <div className="text-gray-600">Get notified about upcoming tasks</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <p className="text-gray-600">Configure role-based permissions for your team.</p>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">Permission settings are configured per role in the Team Management section.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
