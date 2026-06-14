import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

// Lazily load Leaflet only in the browser to avoid SSR issues
let L = null;
let MapContainer, TileLayer, Marker, Popup;

const loadLeaflet = async () => {
  if (L) return;
  const leaflet      = await import('leaflet');
  const reactLeaflet = await import('react-leaflet');
  await import('leaflet/dist/leaflet.css');

  L           = leaflet.default;
  MapContainer = reactLeaflet.MapContainer;
  TileLayer    = reactLeaflet.TileLayer;
  Marker       = reactLeaflet.Marker;
  Popup        = reactLeaflet.Popup;

  // Fix Leaflet's broken default icon path in bundlers
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

const NAIROBI = [-1.2921, 36.8219];

const PickupMap = ({ pickupLocation, recyclerLocation }) => {
  const mapRef      = useRef(null);
  const leafletReady = useRef(false);

  const center = pickupLocation?.lat
    ? [pickupLocation.lat, pickupLocation.lng]
    : NAIROBI;

  useEffect(() => {
    let map = null;
    let mounted = true;

    const init = async () => {
      await loadLeaflet();
      if (!mounted || !mapRef.current || leafletReady.current) return;

      leafletReady.current = true;
      map = L.map(mapRef.current, { scrollWheelZoom: false }).setView(center, 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      if (pickupLocation?.lat) {
        L.marker([pickupLocation.lat, pickupLocation.lng])
          .addTo(map)
          .bindPopup('<b>Pickup Location</b>');
      }
      if (recyclerLocation?.lat) {
        L.marker([recyclerLocation.lat, recyclerLocation.lng])
          .addTo(map)
          .bindPopup('<b>Recycler Facility</b>');
      }
    };

    init();

    return () => {
      mounted = false;
      if (map) { map.remove(); leafletReady.current = false; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='card p-0 overflow-hidden' data-testid='pickup-map'>
      <div className='px-4 py-3 border-b border-neutral-100 flex items-center gap-2'>
        <MapPin size={14} className='text-primary' />
        <div>
          <p className='text-sm font-semibold text-neutral-700'>Pickup Location</p>
          {pickupLocation?.address && (
            <p className='text-xs text-neutral-500'>{pickupLocation.address}</p>
          )}
        </div>
      </div>
      <div ref={mapRef} style={{ height: '260px', width: '100%' }} aria-label='Map showing pickup location' />
    </div>
  );
};

export default PickupMap;
