import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useHelmetStore } from '@stores/helmetStore';
import 'leaflet/dist/leaflet.css';

export default function Location() {
  const { helmets, fetchHelmets } = useHelmetStore();

  useEffect(() => {
    fetchHelmets();
  }, [fetchHelmets]);

  const defaultCenter = [0, 0];
  const helmetsWithLocation = helmets.filter(h => h.location?.lat && h.location?.lng);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Location Tracking</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <MapContainer
          center={helmetsWithLocation[0]?.location || defaultCenter}
          zoom={13}
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {helmetsWithLocation.map((helmet) => (
            <Marker
              key={helmet.id}
              position={[helmet.location.lat, helmet.location.lng]}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{helmet.name || helmet.id}</h3>
                  <p className="text-sm">Status: {helmet.status}</p>
                  {helmet.sensors && (
                    <p className="text-sm">Battery: {helmet.sensors.battery}%</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Helmet List */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Helmets</h2>
        <div className="space-y-2">
          {helmets.map((helmet) => (
            <div
              key={helmet.id}
              className="flex justify-between items-center p-4 border border-gray-200 rounded"
            >
              <div>
                <h3 className="font-medium">{helmet.name || helmet.id}</h3>
                <p className="text-sm text-gray-600">
                  {helmet.location?.lat && helmet.location?.lng
                    ? `${helmet.location.lat.toFixed(6)}, ${helmet.location.lng.toFixed(6)}`
                    : 'Location not available'}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  helmet.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {helmet.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
