import { api } from "./api";

export const transactionService = {
  getAll: (params) => {
    const query = new URLSearchParams(params || {}).toString();
    return api.get(`/transactions/${query ? `?${query}` : ""}`);
  },
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post("/transactions/", data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
};
