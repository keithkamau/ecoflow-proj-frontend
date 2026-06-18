import api from './api';

export const schedulePickup = async (data) => {
  return api.post('/pickups', data);
};

export const getPickups = async (params = {}) => {
  return api.get('/pickups', { params });
};

export const getPickup = async (id) => {
  return api.get(`/pickups/${id}`);
};

export const updatePickupStatus = async (id, status) => {
  return api.put(`/pickups/${id}`, { status });
};

export const uploadProof = async (id, formData) => {
  return api.post(`/pickups/${id}/proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const assignDriver = async (data) => {
  return api.post(`/pickups/${data.pickup_id}/assign-driver`, { driver_id: data.driver_id });
};

export const getDrivers = async () => {
  return api.get('/pickups/drivers');
};

export const getNearby = async (coords) => {
  const res = await api.get('/locations/nearby', { params: coords });
  const data = res.data ?? res;
  return { data: data.results ?? data };
};
