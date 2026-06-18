import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RoleGuard from "../../components/auth/RoleGuard";

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../hooks/useAuth";

describe("RoleGuard", () => {
  it("renders children when user has allowed role", () => {
    useAuth.mockReturnValue({ user: { id: "1", role: "seller" }, loading: false });
    render(
      <MemoryRouter>
        <RoleGuard roles={["seller"]}><div data-testid="child">Seller Content</div></RoleGuard>
      </MemoryRouter>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("redirects to dashboard when user has wrong role", () => {
    useAuth.mockReturnValue({ user: { id: "1", role: "seller" }, loading: false });
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <RoleGuard roles={["admin"]}><div data-testid="child">Admin Only</div></RoleGuard>
      </MemoryRouter>
    );
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    render(
      <MemoryRouter initialEntries={["/seller"]}>
        <RoleGuard roles={["seller"]}><div data-testid="child">Seller Content</div></RoleGuard>
      </MemoryRouter>
    );
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    const { container } = render(
      <MemoryRouter>
        <RoleGuard roles={["seller"]}><div data-testid="child">Content</div></RoleGuard>
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe("");
  });
});
