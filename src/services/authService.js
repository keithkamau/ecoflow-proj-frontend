import { api } from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  sendOTP: (phone) => api.post("/auth/send-otp", { phone }),
  verifyOTP: (phone, otp) => api.post("/auth/verify-otp", { phone, otp }),
  refreshToken: (token) => api.post("/auth/refresh-token", { token }),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/users/me"),
  updateMe: (data) => api.put("/users/me", data),
  uploadKYC: (formData) =>
    api.post("/users/me/kyc", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
