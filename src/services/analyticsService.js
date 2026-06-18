import api from './api';

export const getGlobalStats = async () => {
  return api.get('/analytics/global-stats');
};

export const getImpact = async () => {
  return api.get('/analytics/impact');
};

export const getEarningsTrend = async () => {
  return api.get('/analytics/earnings-trend');
};

export const getMaterialsBreakdown = async () => {
  return [];
};

export const getSellerStats = async () => {
  return api.get('/analytics/seller-stats');
};

export const getRecyclerStats = async () => {
  return api.get('/analytics/recycler-stats');
};
