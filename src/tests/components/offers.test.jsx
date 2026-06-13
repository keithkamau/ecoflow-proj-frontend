import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OfferCard from "../../components/offers/OfferCard";
import OfferForm from "../../components/offers/OfferForm";
import PaymentSelector from "../../components/offers/PaymentSelector";
import { formatCurrency, statusLabel, timeAgo } from "../../utils/formatters";
import { validateOfferForm, required, mustBePositive } from "../../utils/validators";

// ── Utilities ────────────────────────────────────────────────────

describe("formatters", () => {
  it("formats currency as KES", () => {
    expect(formatCurrency(750)).toBe("KES 750.00");
    expect(formatCurrency(15.5)).toBe("KES 15.50");
  });

  it("converts status to label", () => {
    expect(statusLabel("pending")).toBe("Pending");
    expect(statusLabel("accepted")).toBe("Accepted");
    expect(statusLabel("completed")).toBe("Completed");
  });

  it("returns relative time", () => {
    expect(timeAgo(new Date().toISOString())).toBe("just now");
    expect(timeAgo(null)).toBe("");
  });
});

describe("validators", () => {
  it("requires a field", () => {
    expect(required("", "Name")).toBe("Name is required");
    expect(required("hello", "Name")).toBeNull();
  });

  it("validates positive numbers", () => {
    expect(mustBePositive(-1, "Price")).toBe("Price must be greater than zero");
    expect(mustBePositive(0, "Price")).toBe("Price must be greater than zero");
    expect(mustBePositive(10, "Price")).toBeNull();
  });

  it("validates offer form", () => {
    const err = validateOfferForm({ offered_price: -1, quantity: 0 });
    expect(err.offered_price).toBeDefined();
    expect(err.quantity).toBeDefined();
  });

  it("passes valid offer form", () => {
    const err = validateOfferForm({ offered_price: 15, quantity: 50 });
    expect(Object.keys(err)).toHaveLength(0);
  });
});

// ── OfferCard ─────────────────────────────────────────────────────

const mockOffer = {
  id: 1,
  listing_id: 1,
  recycler_id: 2,
  offered_price: 15.0,
  quantity: 50,
  status: "pending",
  note: "Weekday pickup",
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 86400000).toISOString(),
};

describe("OfferCard", () => {
  it("renders offer details", () => {
    render(<OfferCard offer={mockOffer} isSeller={true} />);
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it("shows accept/reject buttons for seller on pending", () => {
    render(<OfferCard offer={mockOffer} isSeller={true} />);
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("hides accept/reject for non-pending offers", () => {
    render(<OfferCard offer={{ ...mockOffer, status: "accepted" }} isSeller={true} />);
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
  });

  it("shows note when provided", () => {
    render(<OfferCard offer={mockOffer} isSeller={true} />);
    expect(screen.getByText("Weekday pickup")).toBeInTheDocument();
  });

  it("calls onAccept when clicked", async () => {
    const onAccept = vi.fn();
    render(<OfferCard offer={mockOffer} isSeller={true} onAccept={onAccept} />);
    await userEvent.click(screen.getByText("Accept"));
    expect(onAccept).toHaveBeenCalledWith(1);
  });

  it("calls onReject when clicked", async () => {
    const onReject = vi.fn();
    render(<OfferCard offer={mockOffer} isSeller={true} onReject={onReject} />);
    await userEvent.click(screen.getByText("Reject"));
    expect(onReject).toHaveBeenCalledWith(1);
  });
});

// ── OfferForm ─────────────────────────────────────────────────────

describe("OfferForm", () => {
  it("renders form fields", () => {
    render(<OfferForm onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText(/e.g. 15.00/)).toBeInTheDocument();
    expect(screen.getByText("Submit Offer")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(<OfferForm onSubmit={vi.fn()} onClose={vi.fn()} />);
    await userEvent.click(screen.getByText("Submit Offer"));
    expect(screen.getByText(/Offered price must be greater than zero/i)).toBeInTheDocument();
  });

  it("calls onSubmit with form data", async () => {
    const onSubmit = vi.fn();
    render(<OfferForm listingId={1} onSubmit={onSubmit} onClose={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText(/e.g. 15.00/), "20");
    await userEvent.type(screen.getByPlaceholderText(/e.g. 50/), "100");
    await userEvent.click(screen.getByText("Submit Offer"));
    expect(onSubmit).toHaveBeenCalledWith({
      listing_id: 1,
      offered_price: 20,
      quantity: 100,
      note: undefined,
    });
  });

  it("closes on cancel", async () => {
    const onClose = vi.fn();
    render(<OfferForm onSubmit={vi.fn()} onClose={onClose} />);
    await userEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });
});

// ── PaymentSelector ───────────────────────────────────────────────

describe("PaymentSelector", () => {
  it("renders all payment methods", () => {
    render(<PaymentSelector value="mpesa" onChange={vi.fn()} />);
    expect(screen.getByText("M-Pesa")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
    expect(screen.getByText("Bank Transfer")).toBeInTheDocument();
  });

  it("highlights selected option", () => {
    render(<PaymentSelector value="card" onChange={vi.fn()} />);
    const cardBtn = screen.getByText("Card").closest("button");
    expect(cardBtn.className).toContain("border-primary");
  });

  it("calls onChange when clicked", async () => {
    const onChange = vi.fn();
    render(<PaymentSelector value="mpesa" onChange={onChange} />);
    await userEvent.click(screen.getByText("Card"));
    expect(onChange).toHaveBeenCalledWith("card");
  });
});
