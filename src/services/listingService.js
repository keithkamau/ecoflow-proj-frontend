import { api } from './api';

export const listingService = {
  getMaterials: () => api.get('/listings/materials'),
  createMaterial: (data) => api.post('/listings/materials', data),
  getListings: (params) => api.get('/listings/', { params }),
  searchListings: (params) => api.get('/listings/search', { params }),
  getListing: (id) => api.get(`/listings/${id}`),
  createListing: (data) => api.post('/listings/', data),
  updateListing: (id, data) => api.put(`/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/listings/${id}`),
  getRecyclerInventory: (recyclerId) => api.get('/listings/recyclers/inventory', {
    params: { recycler_id: recyclerId }
  }),
  getMyListings: (params) => api.get('/listings/mine', { params }),
  uploadListingPhoto: (listingId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/listings/${listingId}/photos`, formData, {
      headers: {}
    });
  }
};

export default listingService;
