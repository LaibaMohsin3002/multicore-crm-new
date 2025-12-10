import { useCRM } from './CRMContext';
import { FileText, User, Clock } from 'lucide-react';

export function AuditLogView() {
  const { auditLogs, users } = useCRM();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Audit Logs</h1>
        <p className="text-gray-600 mt-2">Track all system actions and changes</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-600">Timestamp</th>
                <th className="text-left py-3 px-4 text-gray-600">User</th>
                <th className="text-left py-3 px-4 text-gray-600">Action</th>
                <th className="text-left py-3 px-4 text-gray-600">Entity</th>
                <th className="text-left py-3 px-4 text-gray-600">Entity ID</th>
                <th className="text-left py-3 px-4 text-gray-600">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => {
                const user = users.find(u => u.id === log.userId);
                return (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">{user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{log.entityType}</td>
                    <td className="py-3 px-4 text-gray-600">{log.entityId}</td>
                    <td className="py-3 px-4 text-gray-600">{log.ipAddress || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {auditLogs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No audit logs yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
