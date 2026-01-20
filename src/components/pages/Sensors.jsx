import { useEffect, useState } from 'react';
import { useHelmetStore } from '@stores/helmetStore';

export default function Sensors() {
  const { helmets, selectedHelmet, selectHelmet, fetchHelmets } = useHelmetStore();
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    fetchHelmets();
  }, [fetchHelmets]);

  useEffect(() => {
    if (selectedHelmet) {
      setSensorData(selectedHelmet.sensors);
    }
  }, [selectedHelmet]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Sensor Data</h1>

      {/* Helmet Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Helmet
        </label>
        <select
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={selectedHelmet?.id || ''}
          onChange={(e) => {
            const helmet = helmets.find(h => h.id === e.target.value);
            selectHelmet(helmet);
          }}
        >
          <option value="">Select a helmet...</option>
          {helmets.map((helmet) => (
            <option key={helmet.id} value={helmet.id}>
              {helmet.name || helmet.id}
            </option>
          ))}
        </select>
      </div>

      {/* Sensor Data Display */}
      {sensorData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Temperature */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Temperature</h3>
            <div className="text-4xl font-bold text-blue-600">
              {sensorData.temperature || 'N/A'}°C
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Humidity</h3>
            <div className="text-4xl font-bold text-green-600">
              {sensorData.humidity || 'N/A'}%
            </div>
          </div>

          {/* Gas Level */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Gas Level</h3>
            <div className="text-4xl font-bold text-orange-600">
              {sensorData.gasLevel || 'N/A'} ppm
            </div>
          </div>

          {/* Impact Detection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Impact</h3>
            <div className="text-4xl font-bold text-red-600">
              {sensorData.impact ? 'Detected' : 'Normal'}
            </div>
          </div>

          {/* Battery */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Battery</h3>
            <div className="text-4xl font-bold text-purple-600">
              {sensorData.battery || 'N/A'}%
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Status</h3>
            <div className={`text-2xl font-bold ${
              sensorData.status === 'active' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {sensorData.status || 'Unknown'}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow text-center text-gray-500">
          Select a helmet to view sensor data
        </div>
      )}
    </div>
  );
}
