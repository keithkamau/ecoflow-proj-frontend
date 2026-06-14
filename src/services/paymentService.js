import { api } from "./api";

export const paymentService = {
  getAll: () => api.get("/payments/"),
  getByTransaction: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post("/payments/", data),
  getByPaymentId: (id) => api.get(`/payments/detail/${id}`),
  confirm: (id, receipt) => api.post(`/payments/${id}/confirm?mpesa_receipt=${receipt}`),
};
