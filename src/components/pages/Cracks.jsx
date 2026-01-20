import { useEffect, useState } from 'react';
import { useHelmetStore } from '@stores/helmetStore';

export default function Cracks() {
  const { helmets, fetchHelmets } = useHelmetStore();
  const [crackData, setCrackData] = useState([]);

  useEffect(() => {
    fetchHelmets();
  }, [fetchHelmets]);

  useEffect(() => {
    // Extract crack detection data from helmets
    const cracks = helmets
      .filter(helmet => helmet.cracks && helmet.cracks.length > 0)
      .map(helmet => ({
        helmetId: helmet.id,
        helmetName: helmet.name || helmet.id,
        cracks: helmet.cracks
      }));
    setCrackData(cracks);
  }, [helmets]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Crack Detection</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Helmets Scanned</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{helmets.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Helmets with Cracks</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{crackData.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Cracks Detected</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {crackData.reduce((sum, item) => sum + item.cracks.length, 0)}
          </p>
        </div>
      </div>

      {/* Crack Details */}
      <div className="space-y-6">
        {crackData.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center text-gray-500">
            No cracks detected in any helmet
          </div>
        ) : (
          crackData.map((item) => (
            <div key={item.helmetId} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">{item.helmetName}</h2>
                <p className="text-sm text-gray-600">Helmet ID: {item.helmetId}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {item.cracks.map((crack, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${getSeverityColor(crack.severity)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">Crack #{idx + 1}</h3>
                          <p className="text-sm mt-1">
                            Location: {crack.location || 'Unknown'}
                          </p>
                          <p className="text-sm">
                            Length: {crack.length || 'N/A'} mm
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {crack.severity}
                        </span>
                      </div>
                      
                      {crack.timestamp && (
                        <p className="text-xs text-gray-600 mt-2">
                          Detected: {new Date(crack.timestamp).toLocaleString()}
                        </p>
                      )}
                      
                      {crack.image && (
                        <div className="mt-3">
                          <img
                            src={crack.image}
                            alt={`Crack ${idx + 1}`}
                            className="w-full max-w-md rounded border border-gray-300"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
