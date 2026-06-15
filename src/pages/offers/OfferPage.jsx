import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Tag, ExternalLink, Filter, ArrowUpDown } from "lucide-react";
import { offerService } from "../../services/offerService";
import { transactionService } from "../../services/transactionService";
import OfferCard from "../../components/offers/OfferCard";
import OfferForm from "../../components/offers/OfferForm";
import Chat from "../../components/offers/Chat";
import { PageLoader } from "../../components/common/LoadingSpinner";

export default function OfferPage() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

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

  async function handleAccept(offer) {
    const id = typeof offer === "object" ? offer.id : offer;
    const updated = await offerService.update(id, { status: "accepted" });
    await transactionService.create({
      offer_id: updated.id,
      listing_id: updated.listing_id,
      seller_id: 1,
      recycler_id: updated.recycler_id,
      agreed_price: updated.offered_price,
      final_quantity: updated.quantity,
      final_price: updated.offered_price * updated.quantity,
    });
    navigate("/transactions");
  }

  async function handleReject(id) {
    await offerService.update(id, { status: "rejected" });
    fetchOffers();
  }

  const pendingCount = offers.filter((o) => o.status === "pending").length;

  const filteredOffers = useMemo(() => {
    let result = [...offers];
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }
    result.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
    return result;
  }, [offers, statusFilter, sortOrder]);

  if (loading && !offers.length) return <PageLoader message="Loading offers..." />;

  return (
    <div className="page-content">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Offers</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
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

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-neutral-500">
          <Filter size={14} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input input-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button
          className="btn btn-ghost btn-xs flex items-center gap-1"
          onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
        >
          <ArrowUpDown size={14} />
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredOffers.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-12 text-neutral-400">
              <Tag size={40} />
              <p className="mt-3 text-sm font-medium">No offers yet</p>
              <p className="text-xs mt-1">Create your first offer to get started</p>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div key={offer.id} className="relative group cursor-pointer" onClick={() => navigate(`/offers/${offer.id}`)}>
                <OfferCard
                  offer={offer}
                  isSeller={true}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onMessage={(o) => { setSelectedOffer(selectedOffer?.id === o.id ? null : o); }}
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={14} className="text-neutral-400" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              <Tag size={16} />
              Messages
            </h2>
            <div className="min-h-[300px] sm:h-[400px] lg:h-[500px]">
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
