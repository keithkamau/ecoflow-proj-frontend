import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

vi.mock("../../services/authService", () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    getMe: vi.fn(),
  },
}));

import { authService } from "../../services/authService";

function renderAuthHook() {
  return renderHook(() => useContext(AuthContext), {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("useAuth", () => {
  it("starts with null user and loading true", () => {
    const { result } = renderAuthHook();
    expect(result.current.user).toBeNull();
  });

  it("login stores tokens and sets user", async () => {
    authService.login.mockResolvedValue({
      access_token: "tok123",
      refresh_token: "rtok123",
    });
    authService.getMe.mockResolvedValue({ id: "1", email: "a@b.com", role: "seller" });

    const { result } = renderAuthHook();
    await act(async () => {
      await result.current.login("a@b.com", "pass");
    });

    expect(localStorage.getItem("access_token")).toBe("tok123");
    expect(localStorage.getItem("refresh_token")).toBe("rtok123");
    expect(result.current.user).toEqual({ id: "1", email: "a@b.com", role: "seller" });
  });

  it("register calls authService.register", async () => {
    authService.register.mockResolvedValue({ access_token: "tok123", refresh_token: "rtok123" });
    authService.getMe.mockResolvedValue({ id: "1", role: "seller" });

    const { result } = renderAuthHook();
    let res;
    await act(async () => {
      res = await result.current.register({ name: "Test", role: "seller" });
    });

    expect(authService.register).toHaveBeenCalledWith({ name: "Test", role: "seller" });
    expect(res.access_token).toBe("tok123");
  });

  it("logout clears tokens and user", async () => {
    localStorage.setItem("access_token", "tok");
    localStorage.setItem("refresh_token", "rtok");

    authService.getMe.mockResolvedValue({ id: "1" });
    const { result } = renderAuthHook();
    await act(async () => {});

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
