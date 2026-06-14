import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Navigation, Phone, Star, Filter,
  Recycle, ShoppingBag, ChevronRight, Locate,
} from 'lucide-react';
import { getNearby } from '../../services/pickupService';
import { PageLoader } from '../../components/common/LoadingSpinner';

// ── Constants ─────────────────────────────────────────────────
const NAIROBI = [-1.2921, 36.8219];

const MATERIAL_FILTERS = [
  { value: 'all',     label: 'All' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'metal',   label: 'Metal' },
  { value: 'paper',   label: 'Paper' },
  { value: 'glass',   label: 'Glass' },
  { value: 'ewaste',  label: 'E-Waste' },
  { value: 'mixed',   label: 'Mixed' },
];

const MATERIAL_COLORS = {
  plastic: 'bg-blue-100 text-blue-700',
  metal:   'bg-neutral-200 text-neutral-700',
  paper:   'bg-amber-100 text-amber-700',
  glass:   'bg-cyan-100 text-cyan-700',
  ewaste:  'bg-orange-100 text-orange-700',
  mixed:   'bg-purple-100 text-purple-700',
};

// ── Leaflet singleton ─────────────────────────────────────────
let L = null;
const loadLeaflet = async () => {
  if (L) return;
  const mod = await import('leaflet');
  await import('leaflet/dist/leaflet.css');
  L = mod.default;
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

const makeDivIcon = (color, pulse = false) => {
  const ring = pulse
    ? `<span style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ${color};animation:ping 1.4s ease-in-out infinite;opacity:.6;"></span>`
    : '';
  return L.divIcon({
    className: '',
    html: `<span style="position:relative;display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);">${ring}<svg width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></span>`,
    iconSize:    [28, 28],
    iconAnchor:  [14, 28],
    popupAnchor: [0, -32],
  });
};

// ── Small sub-components ──────────────────────────────────────
const RatingStars = ({ value }) => (
  <span className='flex items-center gap-0.5'>
    <Star size={11} className='text-secondary fill-secondary' />
    <span className='text-xs font-semibold text-neutral-700'>{value}</span>
  </span>
);

const MaterialChip = ({ material }) => (
  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${MATERIAL_COLORS[material] ?? 'bg-neutral-100 text-neutral-600'}`}>
    {material}
  </span>
);

const LocationCard = ({ location, active, onClick }) => (
  <button
    onClick={onClick}
    className={[
      'w-full text-left p-3 rounded-lg border-2 transition-all duration-150',
      active
        ? 'border-primary bg-primary-light'
        : 'border-neutral-200 hover:border-primary/40 hover:bg-neutral-50',
    ].join(' ')}
    aria-pressed={active}
  >
    <div className='flex items-start justify-between gap-2'>
      <div className='flex items-center gap-2 min-w-0'>
        <span
          className='flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center'
          style={{ background: location.type === 'recycler' ? '#D1FAE5' : '#FED7AA' }}
        >
          {location.type === 'recycler'
            ? <Recycle size={13} style={{ color: '#10B981' }} />
            : <ShoppingBag size={13} style={{ color: '#F97316' }} />}
        </span>
        <div className='min-w-0'>
          <p className='text-sm font-semibold text-neutral-800 truncate'>{location.name}</p>
          <p className='text-xs text-neutral-500 truncate'>{location.address}</p>
        </div>
      </div>
      <ChevronRight size={14} className='text-neutral-400 flex-shrink-0 mt-0.5' />
    </div>

    <div className='mt-2 flex items-center gap-3 flex-wrap'>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${location.open ? 'bg-primary-light text-primary-dark' : 'bg-neutral-100 text-neutral-500'}`}>
        {location.open ? 'Open' : 'Closed'}
      </span>
      <span className='text-xs text-neutral-500 flex items-center gap-1'>
        <Navigation size={10} />{location.distance_km} km
      </span>
      <RatingStars value={location.rating} />
    </div>

    <div className='mt-2 flex flex-wrap gap-1'>
      {location.materials.map((m) => <MaterialChip key={m} material={m} />)}
    </div>

    {active && (
      <a
        href={`tel:${location.phone.replace(/\s/g, '')}`}
        onClick={(e) => e.stopPropagation()}
        className='mt-2 flex items-center gap-1 text-xs font-semibold text-primary hover:underline'
      >
        <Phone size={11} />{location.phone}
      </a>
    )}
  </button>
);

// ── Main page ─────────────────────────────────────────────────
const NearbyPage = () => {
  const [locations,  setLocations]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');
  const [activeId,   setActiveId]   = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [geoStatus,  setGeoStatus]  = useState('idle'); // idle | locating | done | denied

  const mapRef      = useRef(null);
  const leafletMap  = useRef(null);
  const markersRef  = useRef({});
  const userMarker  = useRef(null);
  const mapReady    = useRef(false);

  // ── Load nearby data ───────────────────────────────────────
  useEffect(() => {
    getNearby({}).then(({ data }) => {
      setLocations(data);
      setLoading(false);
    });
  }, []);

  // ── Build map once data is loaded ──────────────────────────
  useEffect(() => {
    if (loading || !mapRef.current || mapReady.current) return;
    let mounted = true;

    const buildMap = async () => {
      await loadLeaflet();
      if (!mounted || !mapRef.current) return;

      mapReady.current = true;
      const map = L.map(mapRef.current, { scrollWheelZoom: true }).setView(NAIROBI, 12);
      leafletMap.current = map;

      // Add ping keyframe for user marker
      if (!document.getElementById('nearby-ping-style')) {
        const s = document.createElement('style');
        s.id = 'nearby-ping-style';
        s.textContent = '@keyframes ping{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.8);opacity:0}}';
        document.head.appendChild(s);
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Place markers for each location
      locations.forEach((loc) => {
        const color = loc.type === 'recycler' ? '#10B981' : '#F97316';
        const icon  = makeDivIcon(color);
        const popup = `
          <div style="font-family:sans-serif;min-width:160px;">
            <p style="font-weight:700;font-size:13px;margin:0 0 2px">${loc.name}</p>
            <p style="font-size:11px;color:#6B7280;margin:0 0 4px">${loc.address}</p>
            <p style="font-size:11px;margin:0;color:${loc.open ? '#10B981' : '#9CA3AF'}">${loc.open ? '● Open' : '● Closed'}</p>
            <p style="font-size:11px;margin:4px 0 0;color:#F97316">⭐ ${loc.rating} · ${loc.distance_km} km away</p>
          </div>`;
        const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map).bindPopup(popup);
        marker.on('click', () => setActiveId(loc.id));
        markersRef.current[loc.id] = marker;
      });
    };

    buildMap();

    return () => {
      mounted = false;
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        mapReady.current = false;
        markersRef.current = {};
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // ── Pan to active location ─────────────────────────────────
  useEffect(() => {
    if (!activeId || !leafletMap.current) return;
    const loc = locations.find((l) => l.id === activeId);
    if (!loc) return;
    leafletMap.current.flyTo([loc.lat, loc.lng], 15, { duration: 0.8 });
    markersRef.current[activeId]?.openPopup();
  }, [activeId, locations]);

  // ── Geolocate user ─────────────────────────────────────────
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        setUserCoords({ lat, lng });
        setGeoStatus('done');
        if (!leafletMap.current) return;
        if (userMarker.current) userMarker.current.remove();
        userMarker.current = L.marker([lat, lng], { icon: makeDivIcon('#3B82F6', true) })
          .addTo(leafletMap.current)
          .bindPopup('<b>Your Location</b>')
          .openPopup();
        leafletMap.current.flyTo([lat, lng], 14, { duration: 1 });
      },
      () => setGeoStatus('denied'),
    );
  }, []);

  // ── Filtered list ──────────────────────────────────────────
  const visible = filter === 'all'
    ? locations
    : locations.filter((l) => l.materials.includes(filter));

  const recyclerCount = visible.filter((l) => l.type === 'recycler').length;
  const sellerCount   = visible.filter((l) => l.type === 'seller').length;

  if (loading) return <PageLoader message='Loading nearby locations…' />;

  return (
    <div className='page-content animate-fade-in' data-testid='nearby-page'>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className='section-header'>
        <div>
          <h1 className='text-h3'>Nearby Recyclers & Sellers</h1>
          <p className='text-sm text-neutral-500 mt-0.5'>
            {recyclerCount} recycler{recyclerCount !== 1 ? 's' : ''} · {sellerCount} seller{sellerCount !== 1 ? 's' : ''} near Nairobi
          </p>
        </div>

        {/* Locate me button */}
        <button
          onClick={locateUser}
          disabled={geoStatus === 'locating'}
          className='btn btn-secondary btn-sm flex items-center gap-1.5'
          title='Use my location'
        >
          <Locate size={14} />
          {geoStatus === 'locating' ? 'Locating…' : geoStatus === 'done' ? 'Located' : 'My Location'}
        </button>
      </div>

      {/* ── Material filter bar ─────────────────────────────── */}
      <div className='flex gap-2 flex-wrap mb-4'>
        {MATERIAL_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={[
              'px-3 py-1 rounded-full text-xs font-semibold border transition-colors duration-150',
              filter === value
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-neutral-600 border-neutral-300 hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
        <span className='ml-auto flex items-center gap-1 text-xs text-neutral-500'>
          <Filter size={11} />{visible.length} result{visible.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Legend ─────────────────────────────────────────── */}
      <div className='flex items-center gap-4 mb-3 text-xs text-neutral-500'>
        <span className='flex items-center gap-1.5'>
          <span className='w-3 h-3 rounded-full bg-primary inline-block' />Recycler facility
        </span>
        <span className='flex items-center gap-1.5'>
          <span className='w-3 h-3 rounded-full bg-secondary inline-block' />Waste seller
        </span>
        <span className='flex items-center gap-1.5'>
          <span className='w-3 h-3 rounded-full bg-blue-500 inline-block' />Your location
        </span>
      </div>

      {/* ── Map + List layout ───────────────────────────────── */}
      <div className='flex flex-col lg:flex-row gap-4'>

        {/* Map */}
        <div className='lg:flex-1 card p-0 overflow-hidden'>
          <div
            ref={mapRef}
            style={{ height: '520px', width: '100%' }}
            aria-label='Map of nearby recyclers and sellers'
          />
        </div>

        {/* Sidebar list */}
        <div className='lg:w-80 flex flex-col gap-2 overflow-y-auto' style={{ maxHeight: '520px' }}>
          {visible.length === 0 ? (
            <div className='card text-center py-10'>
              <MapPin size={32} className='text-neutral-300 mx-auto mb-2' />
              <p className='text-sm text-neutral-500'>No locations match this filter.</p>
              <button onClick={() => setFilter('all')} className='btn-primary mt-3 px-4 py-1.5 text-sm'>
                Show All
              </button>
            </div>
          ) : (
            visible
              .sort((a, b) => a.distance_km - b.distance_km)
              .map((loc) => (
                <LocationCard
                  key={loc.id}
                  location={loc}
                  active={activeId === loc.id}
                  onClick={() => setActiveId(activeId === loc.id ? null : loc.id)}
                />
              ))
          )}
        </div>
      </div>

      {/* ── Info footer ─────────────────────────────────────── */}
      {geoStatus === 'denied' && (
        <p className='mt-3 text-xs text-neutral-400 text-center'>
          Location access denied — showing distances from Nairobi CBD.
        </p>
      )}
    </div>
  );
};

export default NearbyPage;
