import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Tag } from "lucide-react";
import { offerService } from "../../services/offerService";
import { listingService } from "../../services/listingService";
import OfferCard from "../../components/offers/OfferCard";
import Chat from "../../components/offers/Chat";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

export default function OfferDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await offerService.getById(id);
      setOffer(data);
      try {
        const listingData = await listingService.getListing(data.listing_id);
        setListing(listingData);
      } catch {}
    } catch {
      setOffer(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleAccept(offerId) {
    try {
      await offerService.update(offerId, { status: "accepted" });
    } catch {
      // refetch to sync with backend state
    }
    fetch();
  }

  async function handleReject(offerId) {
    await offerService.update(offerId, { status: "rejected" });
    fetch();
  }

  const recipientId = offer && listing
    ? (user?.id === listing.seller_id ? offer.recycler_id : listing.seller_id)
    : null;

  if (loading) return <PageLoader message="Loading offer..." />;

  if (!offer) {
    return (
      <div className="page-content">
        <div className="card text-center py-12 text-neutral-400">
          <Tag size={40} className="mx-auto mb-3" />
          <p className="text-sm font-medium">Offer not found</p>
          <button className="btn btn-ghost btn-sm mt-4" onClick={() => navigate("/offers")}>
            Back to Offers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content max-w-4xl mx-auto">
      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate("/offers")}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <OfferCard
            offer={offer}
            isSeller={true}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
            <Tag size={16} />
            Messages
          </h2>
          <div className="min-h-[300px] sm:h-[400px]">
            <Chat offerId={offer.id} recipientId={recipientId} currentUserId={user?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
