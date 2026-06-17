import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (email, password) => api.post("/auth/login", { email, password }),
  refreshToken: (token) => api.post("/auth/refresh-token", { token }),
  getMe: () => api.get("/users/me"),
  updateMe: (data) => api.put("/users/me", data),
  uploadKYC: (formData) =>
    api.post("/users/me/kyc", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
