// src/services/listingService.js
import api from './api';

export const listingService = {
  // Materials
  getMaterials: () => api.get('/listings/materials'),
  createMaterial: (data) => api.post('/listings/materials', data),

  // Listings
  getListings: (params = {}) => api.get('/listings/listings', { params }),
  searchListings: (params = {}) => api.get('/listings/listings/search', { params }),
  getListing: (id) => api.get(`/listings/listings/${id}`),
  createListing: (data) => api.post('/listings/listings', data),
  updateListing: (id, data) => api.put(`/listings/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/listings/listings/${id}`),

  // Inventory
  getRecyclerInventory: (recyclerId) => api.get('/listings/recyclers/inventory', {
    params: { recycler_id: recyclerId }
  }),
};

export default listingService;