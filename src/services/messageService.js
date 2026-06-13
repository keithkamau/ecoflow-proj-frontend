import { api } from "./api";

export const messageService = {
  getByOffer: (offerId) => api.get(`/messages/${offerId}`),
  send: (data) => api.post("/messages/", data),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
};
