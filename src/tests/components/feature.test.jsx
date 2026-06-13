import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionTimeline from "../../components/offers/TransactionTimeline";

// ── Mocks ──────────────────────────────────────────────────────
const mockNavigate = vi.fn();
const mockOfferData = {
  id: 1, listing_id: 1, recycler_id: 2,
  offered_price: 15, quantity: 50, status: "pending",
  note: "Weekday pickup",
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 86400000).toISOString(),
};
const mockTxData = {
  id: 1, listing_id: 1, offer_id: 1,
  seller_id: 2, recycler_id: 1,
  agreed_price: 15, final_quantity: 50, final_price: 750,
  status: "completed",
  created_at: "2026-06-12T21:31:36.005304",
  completed_at: "2026-06-13T06:19:45.233014",
};

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

vi.mock("../../services/api", () => {
  const mockGet = vi.fn();
  const mockPut = vi.fn();
  return {
    api: {
      get: mockGet,
      put: mockPut,
      post: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock("../../components/offers/Chat", () => ({
  default: () => null,
}));

async function mockOfferService() {
  const { api } = await import("../../services/api");
  api.get.mockResolvedValue(mockOfferData);
  api.put.mockResolvedValue(mockOfferData);
}

async function mockTxService() {
  const { api } = await import("../../services/api");
  api.get.mockResolvedValue(mockTxData);
}

async function mockNotFound() {
  const { api } = await import("../../services/api");
  api.get.mockRejectedValue(new Error("not found"));
}

// ── TransactionTimeline ────────────────────────────────────────

describe("TransactionTimeline", () => {
  it("renders all 5 steps", () => {
    render(<TransactionTimeline currentStatus="offer_accepted" />);
    expect(screen.getByText("Offer Accepted")).toBeInTheDocument();
    expect(screen.getByText("Pickup Scheduled")).toBeInTheDocument();
    expect(screen.getByText("Picked Up")).toBeInTheDocument();
    expect(screen.getByText("Payment Pending")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("highlights current step as active", () => {
    render(<TransactionTimeline currentStatus="completed" />);
    expect(screen.getByText("Completed").className).toContain("primary");
  });

  it("shows future steps as unvisited", () => {
    render(<TransactionTimeline currentStatus="offer_accepted" />);
    expect(screen.getByText("Completed").className).toContain("neutral-400");
  });

  it("handles unknown status gracefully", () => {
    render(<TransactionTimeline currentStatus="unknown_status" />);
    expect(screen.getByText("Offer Accepted").className).not.toContain("primary");
  });
});

// ── OfferDetailPage ────────────────────────────────────────────

describe("OfferDetailPage", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("shows loading then offer details", async () => {
    await mockOfferService();
    const { default: OfferDetailPage } = await import("../../pages/offers/OfferDetailPage");
    render(<OfferDetailPage />);
    expect(screen.getByText(/Loading offer/)).toBeInTheDocument();
    expect(await screen.findByText("Weekday pickup")).toBeInTheDocument();
  });

  it("shows not found when offer missing", async () => {
    await mockNotFound();
    const { default: OfferDetailPage } = await import("../../pages/offers/OfferDetailPage");
    render(<OfferDetailPage />);
    expect(await screen.findByText("Offer not found")).toBeInTheDocument();
  });

  it("calls back navigation", async () => {
    await mockOfferService();
    const { default: OfferDetailPage } = await import("../../pages/offers/OfferDetailPage");
    render(<OfferDetailPage />);
    const back = await screen.findByText("Back");
    await userEvent.click(back);
    expect(mockNavigate).toHaveBeenCalledWith("/offers");
  });
});

// ── TransactionDetailPage ──────────────────────────────────────

describe("TransactionDetailPage", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("shows loading then transaction details", async () => {
    await mockTxService();
    const { default: TransactionDetailPage } = await import("../../pages/offers/TransactionDetailPage");
    render(<TransactionDetailPage />);
    expect(screen.getByText(/Loading transaction/)).toBeInTheDocument();
    expect(await screen.findByText("Transaction #1")).toBeInTheDocument();
    expect(await screen.findByText("KES 750.00")).toBeInTheDocument();
    expect(await screen.findByText("50 kg")).toBeInTheDocument();
  });

  it("shows not found when transaction missing", async () => {
    await mockNotFound();
    const { default: TransactionDetailPage } = await import("../../pages/offers/TransactionDetailPage");
    render(<TransactionDetailPage />);
    expect(await screen.findByText("Transaction not found")).toBeInTheDocument();
  });

  it("renders timeline", async () => {
    await mockTxService();
    const { default: TransactionDetailPage } = await import("../../pages/offers/TransactionDetailPage");
    render(<TransactionDetailPage />);
    expect(await screen.findByText("Offer Accepted")).toBeInTheDocument();
    const completedItems = await screen.findAllByText("Completed");
    expect(completedItems.length).toBeGreaterThanOrEqual(1);
  });

  it("calls back navigation", async () => {
    await mockTxService();
    const { default: TransactionDetailPage } = await import("../../pages/offers/TransactionDetailPage");
    render(<TransactionDetailPage />);
    const back = await screen.findByText("Back");
    await userEvent.click(back);
    expect(mockNavigate).toHaveBeenCalledWith("/transactions");
  });
});
