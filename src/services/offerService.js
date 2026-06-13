import { api } from "./api";

export const offerService = {
  getAll: (params) => {
    const query = new URLSearchParams(params || {}).toString();
    return api.get(`/offers/${query ? `?${query}` : ""}`);
  },
  getById: (id) => api.get(`/offers/${id}`),
  create: (data) => api.post("/offers/", data),
  update: (id, data) => api.put(`/offers/${id}`, data),
  delete: (id) => api.delete(`/offers/${id}`),
};
