import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { offerService } from "../../services/offerService";
import OfferForm from "../../components/offers/OfferForm";

export default function CreateOfferPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  async function handleCreate(data) {
    await offerService.create(data);
    setSuccess(true);
    setTimeout(() => navigate("/offers"), 1500);
  }

  if (success) {
    return (
      <div className="page-content animate-fade-in">
        <div className="card card-accent text-center py-12">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">Offer Created!</h2>
          <p className="text-sm text-neutral-500 mt-1">Redirecting to offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in">
      <div className="section-header">
        <div>
          <button
            className="btn btn-ghost btn-sm flex items-center gap-1.5 mb-2"
            onClick={() => navigate("/offers")}
          >
            <ArrowLeft size={16} />
            Back to Offers
          </button>
          <h1 className="text-xl font-bold text-neutral-900">New Offer</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Make an offer on a waste listing
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto mt-6">
        <OfferForm
          onSubmit={handleCreate}
          onClose={() => navigate("/offers")}
        />
      </div>
    </div>
  );
}
