import api from './api';

// ─── Mock data ───────────────────────────────────────────────────
const MOCK_IMPACT = {
  total_kg_recycled: 340,
  co2_saved_kg: 680,
  trees_equivalent: 31,
  waste_diverted_kg: 340,
  total_earnings_kes: 12500,
  ranking: 7,
  total_users: 150,
};

const MOCK_EARNINGS_TREND = [
  { month: 'Jan', earnings: 1200, kg: 45 },
  { month: 'Feb', earnings: 1800, kg: 62 },
  { month: 'Mar', earnings: 900,  kg: 30 },
  { month: 'Apr', earnings: 2400, kg: 85 },
  { month: 'May', earnings: 3100, kg: 110 },
  { month: 'Jun', earnings: 3100, kg: 108 },
];

const MOCK_MATERIALS = [
  { material: 'Plastic', kg: 120, percentage: 35 },
  { material: 'Metal',   kg: 90,  percentage: 26 },
  { material: 'Paper',   kg: 60,  percentage: 18 },
  { material: 'Glass',   kg: 45,  percentage: 13 },
  { material: 'E-Waste', kg: 25,  percentage: 7  },
];

const MOCK_SELLER_STATS = {
  total_listings: 8,
  active_listings: 3,
  total_kg_sold: 340,
  total_earnings_kes: 12500,
  avg_price_per_kg: 36.76,
  transactions_completed: 12,
};

const MOCK_RECYCLER_STATS = {
  total_materials_sourced_kg: 1240,
  total_spent_kes: 45000,
  active_suppliers: 18,
  pickups_completed: 24,
  top_materials: MOCK_MATERIALS,
};

const USE_MOCK = true;

export const getImpact = async () => {
  if (USE_MOCK) return { data: MOCK_IMPACT };
  return api.get('/analytics/impact');
};

export const getEarningsTrend = async () => {
  if (USE_MOCK) return { data: MOCK_EARNINGS_TREND };
  return api.get('/analytics/transactions');
};

export const getMaterialsBreakdown = async () => {
  if (USE_MOCK) return { data: MOCK_MATERIALS };
  return api.get('/analytics/transactions');
};

export const getSellerStats = async () => {
  if (USE_MOCK) return { data: MOCK_SELLER_STATS };
  return api.get('/analytics/sellers');
};

export const getRecyclerStats = async () => {
  if (USE_MOCK) return { data: MOCK_RECYCLER_STATS };
  return api.get('/analytics/recyclers');
};
