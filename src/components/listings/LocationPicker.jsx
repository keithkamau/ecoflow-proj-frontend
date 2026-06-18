import  { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const defaultCenter = [-1.2921, 36.8219]; // Nairobi

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  );
  const [address, setAddress] = useState(initialLocation?.address || '');

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleMapClick = useCallback(async (lat, lng) => {
    setMarkerPosition([lat, lng]);
    const addr = await reverseGeocode(lat, lng);
    setAddress(addr);
    onLocationSelect?.({ lat, lng, address: addr });
  }, [onLocationSelect]);

  const handleAddressSearch = async () => {
    if (!address) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data?.[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const displayName = data[0].display_name;
        setMarkerPosition([lat, lng]);
        setAddress(displayName);
        onLocationSelect?.({ lat, lng, address: displayName });
      }
    } catch {}
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddressSearch();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search address or click map..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        >
          Search
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ zIndex: 0 }}>
        <style>{'.leaflet-tile-loaded { display: block } .leaflet-tile { display: none } .leaflet-tile.leaflet-tile-loaded { display: block } img.leaflet-tile[src*="tile.openstreetmap"]:not([src]) { display: none }'}</style>
        <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 z-[-1]">
          Loading map tiles…
        </span>
        <MapContainer
          center={markerPosition || defaultCenter}
          zoom={markerPosition ? 15 : 12}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleMapClick} />
          {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>
      </div>

      {markerPosition && (
        <p className="text-xs text-gray-600">
          Selected: {address || `${markerPosition[0].toFixed(4)}, ${markerPosition[1].toFixed(4)}`}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
