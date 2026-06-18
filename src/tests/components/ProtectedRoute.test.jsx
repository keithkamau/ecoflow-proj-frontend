import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../hooks/useAuth";

describe("ProtectedRoute", () => {
  it("renders children when user is authenticated", () => {
    useAuth.mockReturnValue({ user: { id: "1", role: "seller" }, loading: false });
    render(
      <MemoryRouter>
        <ProtectedRoute><div data-testid="child">Protected Content</div></ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute><div data-testid="child">Protected Content</div></ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute><div data-testid="child">Protected Content</div></ProtectedRoute>
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe("");
  });
});
