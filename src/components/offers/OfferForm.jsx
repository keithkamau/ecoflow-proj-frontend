import { useState } from "react";
import { X } from "lucide-react";
import { validateOfferForm } from "../../utils/validators";

export default function OfferForm({ listingId, onSubmit, onClose }) {
  const [form, setForm] = useState({
    listing_id: listingId || "",
    offered_price: "",
    quantity: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validateOfferForm(form);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        listing_id: Number(form.listing_id),
        offered_price: Number(form.offered_price),
        quantity: Number(form.quantity),
        note: form.note || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-slide-down">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Make an Offer</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="label">Offered Price (per unit)</label>
            <input
              name="offered_price"
              type="number"
              step="0.01"
              min="0.01"
              value={form.offered_price}
              onChange={handleChange}
              className={`input ${errors.offered_price ? "input-error" : ""}`}
              placeholder="e.g. 15.00"
            />
            {errors.offered_price && <p className="error-text">{errors.offered_price}</p>}
          </div>

          <div>
            <label className="label">Quantity (kg)</label>
            <input
              name="quantity"
              type="number"
              step="0.1"
              min="0.1"
              value={form.quantity}
              onChange={handleChange}
              className={`input ${errors.quantity ? "input-error" : ""}`}
              placeholder="e.g. 50"
            />
            {errors.quantity && <p className="error-text">{errors.quantity}</p>}
          </div>

          <div>
            <label className="label">Note (optional)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="input !h-auto min-h-[60px] py-2 resize-none"
              placeholder="Any special instructions..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-tertiary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
