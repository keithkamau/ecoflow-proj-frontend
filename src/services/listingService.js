import { api } from './api';

export const listingService = {
  getMaterials: () => api.get('/listings/materials'),
  createMaterial: (data) => api.post('/listings/materials', data),
  getListings: (params) => api.get('/listings/listings', { params }),
  searchListings: (params) => api.get('/listings/listings/search', { params }),
  getListing: (id) => api.get(`/listings/listings/${id}`),
  createListing: (data) => api.post('/listings/listings', data),
  updateListing: (id, data) => api.put(`/listings/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/listings/listings/${id}`),
  getRecyclerInventory: (recyclerId) => api.get('/listings/recyclers/inventory', {
    params: { recycler_id: recyclerId }
  }),
  uploadListingPhoto: (listingId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/listings/listings/${listingId}/photos`, formData, {
      headers: {}
    });
  }
};

export default listingService;
