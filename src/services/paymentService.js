import { api } from "./api";

export const paymentService = {
  getAll: () => api.get("/payments/"),
  getByTransaction: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post("/payments/", data),
};
