import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OfferCard from "../../components/offers/OfferCard";

const baseOffer = {
  id: 1,
  listing_id: 1,
  recycler_id: "abc-123",
  offered_price: 150,
  quantity: 50,
  status: "pending",
  note: "Weekday pickup preferred",
  created_at: new Date().toISOString(),
};

describe("OfferCard", () => {
  it("renders price and quantity", () => {
    render(<OfferCard offer={baseOffer} />);
    expect(screen.getByText(/KES 150/)).toBeInTheDocument();
    expect(screen.getByText(/Qty: 50/)).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<OfferCard offer={baseOffer} />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders note when present", () => {
    render(<OfferCard offer={baseOffer} />);
    expect(screen.getByText("Weekday pickup preferred")).toBeInTheDocument();
  });

  it("does not render note section when note is absent", () => {
    const { container } = render(<OfferCard offer={{ ...baseOffer, note: null }} />);
    const noteElements = container.querySelectorAll(".bg-neutral-50");
    expect(noteElements.length).toBe(0);
  });

  it("shows Accept/Reject for seller on pending offer", () => {
    render(<OfferCard offer={baseOffer} isSeller={true} />);
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("does not show Accept/Reject when isSeller is false", () => {
    render(<OfferCard offer={baseOffer} isSeller={false} />);
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
    expect(screen.queryByText("Reject")).not.toBeInTheDocument();
  });

  it("does not show Accept/Reject for non-pending status", () => {
    render(<OfferCard offer={{ ...baseOffer, status: "accepted" }} isSeller={true} />);
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
    expect(screen.queryByText("Reject")).not.toBeInTheDocument();
  });

  it("calls onAccept when Accept clicked", () => {
    const onAccept = vi.fn();
    render(<OfferCard offer={baseOffer} isSeller={true} onAccept={onAccept} />);
    fireEvent.click(screen.getByText("Accept"));
    expect(onAccept).toHaveBeenCalledWith(1);
  });

  it("calls onReject when Reject clicked", () => {
    const onReject = vi.fn();
    render(<OfferCard offer={baseOffer} isSeller={true} onReject={onReject} />);
    fireEvent.click(screen.getByText("Reject"));
    expect(onReject).toHaveBeenCalledWith(1);
  });

  it("calls onMessage when Message clicked", () => {
    const onMessage = vi.fn();
    render(<OfferCard offer={baseOffer} onMessage={onMessage} />);
    fireEvent.click(screen.getByText("Message"));
    expect(onMessage).toHaveBeenCalledWith(baseOffer);
  });
});
