import api from './api';

// ─── Mock data (Nairobi context) ────────────────────────────────
const MOCK_PICKUPS = [
  {
    id: 'p1',
    transaction_id: 'tx1',
    scheduled_time: '2026-06-14T09:00:00Z',
    actual_time: null,
    pickup_location: { address: '45 Ngong Road, Nairobi', lat: -1.2921, lng: 36.7819 },
    status: 'scheduled',
    driver: { id: 'd1', name: 'Joseph Kamau', phone: '+254712345678', vehicle: 'Toyota Pickup', license_plate: 'KCA 123X' },
    material: { type: 'plastic', quantity: 50, unit: 'kg' },
    created_at: '2026-06-12T10:00:00Z',
  },
  {
    id: 'p2',
    transaction_id: 'tx2',
    scheduled_time: '2026-06-10T14:00:00Z',
    actual_time: '2026-06-10T14:25:00Z',
    pickup_location: { address: '12 Kenyatta Avenue, Nairobi', lat: -1.2864, lng: 36.8172 },
    status: 'completed',
    driver: { id: 'd2', name: 'Peter Odhiambo', phone: '+254723456789', vehicle: 'Isuzu Lorry', license_plate: 'KBZ 456Y' },
    material: { type: 'metal', quantity: 120, unit: 'kg' },
    created_at: '2026-06-08T08:00:00Z',
  },
  {
    id: 'p3',
    transaction_id: 'tx3',
    scheduled_time: '2026-06-13T11:00:00Z',
    actual_time: null,
    pickup_location: { address: '88 Moi Avenue, Nairobi', lat: -1.2833, lng: 36.8219 },
    status: 'on_the_way',
    driver: { id: 'd3', name: 'Mary Wanjiku', phone: '+254734567890', vehicle: 'Toyota Van', license_plate: 'KDB 789Z' },
    material: { type: 'paper', quantity: 75, unit: 'kg' },
    created_at: '2026-06-11T07:30:00Z',
  },
];

const MOCK_DRIVERS = [
  { id: 'd1', name: 'Joseph Kamau',   phone: '+254712345678', vehicle: 'Toyota Pickup', license_plate: 'KCA 123X', status: 'available' },
  { id: 'd2', name: 'Peter Odhiambo', phone: '+254723456789', vehicle: 'Isuzu Lorry',   license_plate: 'KBZ 456Y', status: 'on_trip'   },
  { id: 'd3', name: 'Mary Wanjiku',   phone: '+254734567890', vehicle: 'Toyota Van',    license_plate: 'KDB 789Z', status: 'available' },
];

// Set to false once the backend is live
const USE_MOCK = true;

export const schedulePickup = async (data) => {
  if (USE_MOCK) {
    return { data: { ...data, id: `p${Date.now()}`, status: 'scheduled', created_at: new Date().toISOString() } };
  }
  return api.post('/pickups', data);
};

export const getPickups = async (params = {}) => {
  if (USE_MOCK) return { data: MOCK_PICKUPS };
  return api.get('/pickups', { params });
};

export const getPickup = async (id) => {
  if (USE_MOCK) {
    const found = MOCK_PICKUPS.find((p) => p.id === id);
    return { data: found ?? MOCK_PICKUPS[0] };
  }
  return api.get(`/pickups/${id}`);
};

export const updatePickupStatus = async (id, status) => {
  if (USE_MOCK) return { data: { id, status } };
  return api.put(`/pickups/${id}`, { status });
};

export const uploadProof = async (id, formData) => {
  if (USE_MOCK) return { data: { pickup_id: id, success: true } };
  return api.post(`/pickups/${id}/proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const assignDriver = async (data) => {
  if (USE_MOCK) return { data: { ...data, success: true } };
  return api.post('/drivers', data);
};

export const getDrivers = async () => {
  if (USE_MOCK) return { data: MOCK_DRIVERS };
  return api.get('/drivers');
};

const MOCK_NEARBY = [
  {
    id: 'r1', type: 'recycler', name: 'GreenCycle Westlands',
    address: 'Westlands Avenue, Nairobi', lat: -1.2680, lng: 36.8026,
    materials: ['plastic', 'paper', 'metal'], distance_km: 2.1,
    rating: 4.8, open: true, phone: '+254 700 111 222',
  },
  {
    id: 'r2', type: 'recycler', name: 'EcoHub Industrial Area',
    address: 'Industrial Area, Nairobi', lat: -1.3101, lng: 36.8516,
    materials: ['metal', 'ewaste', 'plastic'], distance_km: 4.3,
    rating: 4.5, open: true, phone: '+254 700 333 444',
  },
  {
    id: 'r3', type: 'recycler', name: 'Ngara Scrap Dealers',
    address: 'Ngara Road, Nairobi', lat: -1.2801, lng: 36.8316,
    materials: ['metal', 'glass'], distance_km: 1.8,
    rating: 4.2, open: false, phone: '+254 700 555 666',
  },
  {
    id: 'r4', type: 'recycler', name: 'Paper Masters Kasarani',
    address: 'Kasarani, Nairobi', lat: -1.2201, lng: 36.8916,
    materials: ['paper', 'plastic'], distance_km: 6.7,
    rating: 4.6, open: true, phone: '+254 700 777 888',
  },
  {
    id: 'r5', type: 'recycler', name: 'Kilimani E-Waste Centre',
    address: 'Kilimani, Nairobi', lat: -1.2921, lng: 36.7819,
    materials: ['ewaste', 'metal'], distance_km: 1.2,
    rating: 4.7, open: true, phone: '+254 701 333 444',
  },
  {
    id: 's1', type: 'seller', name: 'Karen Eco Sellers',
    address: 'Karen Road, Nairobi', lat: -1.3211, lng: 36.7116,
    materials: ['plastic', 'paper'], distance_km: 8.2,
    rating: 4.9, open: true, phone: '+254 700 999 000',
  },
  {
    id: 's2', type: 'seller', name: 'Eastleigh Waste Hub',
    address: 'Eastleigh, Nairobi', lat: -1.2680, lng: 36.8476,
    materials: ['mixed', 'plastic'], distance_km: 3.4,
    rating: 4.3, open: true, phone: '+254 701 111 222',
  },
  {
    id: 's3', type: 'seller', name: 'Ruaraka Recyclers Market',
    address: 'Ruaraka, Nairobi', lat: -1.2401, lng: 36.8716,
    materials: ['plastic', 'metal', 'paper'], distance_km: 5.1,
    rating: 4.4, open: false, phone: '+254 701 555 666',
  },
];

export const getNearby = async (coords) => {
  if (USE_MOCK) return { data: MOCK_NEARBY };
  return api.get('/locations/nearby', { params: coords });
};
