import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingContext } from '../../context/ListingContexts';
import { offerService } from '../../services/offerService';
import { useAuth } from '../../hooks/useAuth';
import ListingStatusBadge from '../../components/listings/ListingStatusBadge';
import StatusTimeline from '../../components/listings/StatusTimeline';
import MakeOfferModal from '../../components/listings/MakeOfferModal';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentListing, loading, error, fetchListing, deleteListing } = useListingContext();

  const [offers, setOffers] = useState([]);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const isSeller = user?.id === currentListing?.seller_id;

  useEffect(() => {
    fetchListing(id);
  }, [id, fetchListing]);

  useEffect(() => {
    fetchOffers();
  }, [id]);

  const fetchOffers = async () => {
    try {
      const data = await offerService.getAll({ listing_id: id });
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      setOffers([]);
      console.error('Failed to fetch offers:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteListing(id);
      navigate('/listings');
    } catch (err) {
      alert(err?.message || 'Failed to delete listing');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await offerService.update(offerId, { status: "accepted" });
      fetchListing(id);
      fetchOffers();
    } catch (err) {
      alert(err?.message || 'Failed to accept offer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !currentListing) {
    const isNetworkError = error?.toLowerCase?.()?.includes('network error') || error?.toLowerCase?.()?.includes('unable to reach');
    const displayMsg = isNetworkError
      ? 'Unable to connect to the server. Please check that the backend is running.'
      : (error || 'Listing not found');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">{displayMsg}</p>
          {isNetworkError && (
            <p className="text-xs text-gray-400 mt-2">Network error: unable to reach server</p>
          )}
          <button
            onClick={() => navigate('/listings')}
            className="mt-4 text-emerald-500 hover:text-emerald-600 text-sm font-medium"
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  const { material, quantity, condition, location_address, location_lat, location_lng, price_expectation, status, photos, created_at } = currentListing;

  const pendingOffers = offers.filter(o => o.status === "pending");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/listings')}
          className="text-emerald-500 hover:text-emerald-600 text-sm font-medium mb-4"
        >
          Back to listings
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">{material?.type}</h1>
              <p className="text-gray-500 mt-2 text-lg">{quantity} {material?.unit}</p>
            </div>
            <ListingStatusBadge status={status} />
          </div>

          {/* Status Timeline */}
          <div className="mt-6 mb-8 pb-6 border-b border-gray-100">
            <h3 className="text-base font-medium text-gray-700 mb-3">Status Timeline</h3>
            <StatusTimeline currentStatus={status} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            {!isSeller && status === 'waiting' && (
              <button
                onClick={() => setShowOfferModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Make Offer
              </button>
            )}
          </div>

          {/* Offers List */}
          {offers.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Offers ({offers.length})
                {isSeller && pendingOffers.length > 0 && (
                  <span className="text-amber-600 ml-1">
                    · {pendingOffers.length} pending
                  </span>
                )}
              </h3>
              <div className="space-y-2">
                {offers.map((offer) => {
                  const isPending = offer.status === "pending";
                  const isAccepted = offer.status === "accepted";
                  const isRejected = offer.status === "rejected";
                  return (
                    <div key={offer.id} className={`flex items-center justify-between bg-white p-3 rounded-lg border ${isAccepted ? 'border-emerald-300 bg-emerald-50' : isRejected ? 'border-red-100 bg-red-50' : 'border-transparent'}`}>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Recycler #{offer.recycler_id?.slice(0, 8)}</p>
                        {offer.offered_price && (
                          <p className="text-sm text-emerald-600">KES {offer.offered_price.toLocaleString()} / unit</p>
                        )}
                        <p className="text-xs text-gray-500">{offer.status.replace('_', ' ')}</p>
                      </div>
                      {isSeller && isPending && (
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                        >
                          Accept
                        </button>
                      )}
                      {isAccepted && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Selected</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {photos?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo.photo_url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-64 object-cover rounded-xl"
                />
              ))}
            </div>
          )}

          <div className="space-y-5">
            {condition && (
              <div>
                <h3 className="text-base font-medium text-gray-700">Condition</h3>
                <p className="text-gray-600 mt-2 text-base">{condition}</p>
              </div>
            )}

            {location_address && (
              <div>
                <h3 className="text-base font-medium text-gray-700">Location</h3>
                <p className="text-gray-600 mt-2 text-base">{location_address}</p>
                {(location_lat && location_lng) && (
                  <p className="text-sm text-gray-400 mt-1">
                    Coordinates: {location_lat.toFixed(4)}, {location_lng.toFixed(4)}
                  </p>
                )}
              </div>
            )}

            {price_expectation && (
              <div>
                <h3 className="text-base font-medium text-gray-700">Expected Price</h3>
                <p className="text-emerald-600 font-bold text-2xl mt-2">
                  KES {price_expectation.toLocaleString()}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-base font-medium text-gray-700">Posted</h3>
              <p className="text-gray-500 text-base mt-2">
                {new Date(created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {isSeller && (
            <div className="flex gap-4 mt-10 pt-8 border-t border-gray-100">
              <button
                onClick={() => navigate(`/listings/${id}/edit`)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg text-base font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-lg text-base font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {showOfferModal && (
        <MakeOfferModal
          listingId={id}
          onClose={() => setShowOfferModal(false)}
          onOfferMade={() => {
            fetchOffers();
            fetchListing(id);
          }}
        />
      )}
    </div>
  );
};

export default ListingDetailPage;
