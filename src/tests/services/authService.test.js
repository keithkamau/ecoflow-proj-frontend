import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../services/api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));

import { authService } from "../../services/authService";
import api from "../../services/api";

beforeEach(() => vi.clearAllMocks());

describe("authService", () => {
  it("register calls api.post", async () => {
    const data = { name: "Test", email: "t@t.com", password: "123456", role: "seller" };
    api.post.mockResolvedValue({ data });
    await authService.register(data);
    expect(api.post).toHaveBeenCalledWith("/auth/register", data);
  });

  it("login calls api.post", async () => {
    api.post.mockResolvedValue({ access_token: "tok", refresh_token: "rtok" });
    await authService.login("a@b.com", "secret");
    expect(api.post).toHaveBeenCalledWith("/auth/login", { email: "a@b.com", password: "secret" });
  });

  it("refreshToken calls api.post", async () => {
    api.post.mockResolvedValue({ access_token: "newtok" });
    await authService.refreshToken("oldtok");
    expect(api.post).toHaveBeenCalledWith("/auth/refresh-token", { token: "oldtok" });
  });

  it("getMe calls api.get", async () => {
    api.get.mockResolvedValue({ id: 1, email: "a@b.com" });
    await authService.getMe();
    expect(api.get).toHaveBeenCalledWith("/users/me");
  });

  it("updateMe calls api.put", async () => {
    const data = { name: "New Name" };
    api.put.mockResolvedValue({ data });
    await authService.updateMe(data);
    expect(api.put).toHaveBeenCalledWith("/users/me", data);
  });

  it("uploadKYC calls api.post with formdata", async () => {
    const fd = new FormData();
    api.post.mockResolvedValue({ data: { status: "pending" } });
    await authService.uploadKYC(fd);
    expect(api.post).toHaveBeenCalledWith("/users/me/kyc", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  });
});
