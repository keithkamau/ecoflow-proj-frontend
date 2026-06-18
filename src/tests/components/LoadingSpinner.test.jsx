import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner, { PageLoader, ButtonSpinner } from "../../components/common/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders ring variant by default", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders dots variant", () => {
    const { container } = render(<LoadingSpinner variant="dots" />);
    const dots = container.querySelectorAll("span > span");
    expect(dots.length).toBe(3);
  });

  it("renders bar variant", () => {
    const { container } = render(<LoadingSpinner variant="bar" />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders eco variant", () => {
    const { container } = render(<LoadingSpinner variant="eco" size="lg" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });
});

describe("PageLoader", () => {
  it("renders with default message", () => {
    render(<PageLoader />);
    expect(screen.getByText("Loading EcoFlow…")).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    render(<PageLoader message="Custom message" />);
    expect(screen.getByText("Custom message")).toBeInTheDocument();
  });

  it("renders eco icon", () => {
    const { container } = render(<PageLoader />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });
});

describe("ButtonSpinner", () => {
  it("renders a small spinner", () => {
    const { container } = render(<ButtonSpinner />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
