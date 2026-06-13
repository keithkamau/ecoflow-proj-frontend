import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw, Tag } from "lucide-react";
import { offerService } from "../../services/offerService";
import OfferCard from "../../components/offers/OfferCard";
import OfferForm from "../../components/offers/OfferForm";
import Chat from "../../components/offers/Chat";
import { PageLoader } from "../../components/common/LoadingSpinner";

export default function OfferPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [error, setError] = useState(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await offerService.getAll();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  async function handleCreate(data) {
    await offerService.create(data);
    setShowForm(false);
    fetchOffers();
  }

  async function handleAccept(id) {
    await offerService.update(id, { status: "accepted" });
    fetchOffers();
  }

  async function handleReject(id) {
    await offerService.update(id, { status: "rejected" });
    fetchOffers();
  }

  const pendingCount = offers.filter((o) => o.status === "pending").length;

  if (loading && !offers.length) return <PageLoader message="Loading offers..." />;

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Offers</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {pendingCount} pending &middot; {offers.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm" onClick={fetchOffers} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            New Offer
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {offers.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-12 text-neutral-400">
              <Tag size={40} />
              <p className="mt-3 text-sm font-medium">No offers yet</p>
              <p className="text-xs mt-1">Create your first offer to get started</p>
            </div>
          ) : (
            offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isSeller={true}
                onAccept={handleAccept}
                onReject={handleReject}
                onMessage={(o) => setSelectedOffer(selectedOffer?.id === o.id ? null : o)}
              />
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              <Tag size={16} />
              Messages
            </h2>
            <div className="h-[500px]">
              <Chat offerId={selectedOffer?.id} />
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <OfferForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
