import { useEffect, useState } from 'react';
import { useHelmetStore } from '@stores/helmetStore';
import { useAlertStore } from '@stores/alertStore';

export default function Dashboard() {
  const { helmets, fetchHelmets } = useHelmetStore();
  const { alerts, fetchAlerts } = useAlertStore();
  const [stats, setStats] = useState({
    totalHelmets: 0,
    activeHelmets: 0,
    criticalAlerts: 0,
    warnings: 0
  });

  useEffect(() => {
    fetchHelmets();
    fetchAlerts();
  }, [fetchHelmets, fetchAlerts]);

  useEffect(() => {
    const active = helmets.filter(h => h.status === 'active').length;
    const critical = alerts.filter(a => a.severity === 'critical').length;
    const warnings = alerts.filter(a => a.severity === 'warning').length;

    setStats({
      totalHelmets: helmets.length,
      activeHelmets: active,
      criticalAlerts: critical,
      warnings: warnings
    });
  }, [helmets, alerts]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Helmets</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalHelmets}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Helmets</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeHelmets}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Critical Alerts</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.criticalAlerts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Warnings</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.warnings}</p>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded border-l-4 ${
                alert.severity === 'critical'
                  ? 'border-red-500 bg-red-50'
                  : 'border-yellow-500 bg-yellow-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{alert.type}</h4>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
                <span className="text-xs text-gray-500">{alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
