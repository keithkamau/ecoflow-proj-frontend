import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OfferForm from "../../components/offers/OfferForm";

vi.mock("../../services/listingService", () => ({
  listingService: {
    getMaterials: vi.fn().mockResolvedValue([
      { id: 1, type: "plastic" },
      { id: 2, type: "metal" },
    ]),
  },
}));

describe("OfferForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders form fields", () => {
    render(<OfferForm onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText("New Offer")).toBeInTheDocument();
    expect(screen.getByText("Material Type")).toBeInTheDocument();
    expect(screen.getByText("Price (KSh per unit)")).toBeInTheDocument();
    expect(screen.getByText("Quantity (kg)")).toBeInTheDocument();
    expect(screen.getByText("Submit Offer")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("loads materials on mount", async () => {
    render(<OfferForm onSubmit={vi.fn()} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText("plastic")).toBeInTheDocument();
      expect(screen.getByText("metal")).toBeInTheDocument();
    });
  });

  it("shows Listing ID input when listingId not provided", () => {
    render(<OfferForm onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText("Listing ID (optional)")).toBeInTheDocument();
  });

  it("hides Listing ID input when listingId provided", () => {
    render(<OfferForm listingId={5} onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByText("Listing ID (optional)")).not.toBeInTheDocument();
  });

  it("calls onClose when Cancel clicked", () => {
    const onClose = vi.fn();
    render(<OfferForm onSubmit={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows validation errors on empty submit", async () => {
    render(<OfferForm onSubmit={vi.fn()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Submit Offer"));
    await waitFor(() => {
      expect(screen.getByText(/Material is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Quantity is required/i)).toBeInTheDocument();
    });
  });

  it("calls onSubmit with correct data", async () => {
    const onSubmit = vi.fn();
    const { container } = render(<OfferForm onSubmit={onSubmit} onClose={vi.fn()} />);
    await waitFor(() => expect(screen.getByText("plastic")).toBeInTheDocument());

    const selects = container.querySelectorAll("select");
    fireEvent.change(selects[0], { target: { value: "1" } });
    fireEvent.change(screen.getByPlaceholderText("0.00"), { target: { value: "150" } });
    fireEvent.change(screen.getByPlaceholderText("0"), { target: { value: "50" } });
    fireEvent.click(screen.getByText("Submit Offer"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        listing_id: undefined,
        offered_price: 150,
        quantity: 50,
        note: undefined,
        material_id: 1,
      });
    });
  });
});
