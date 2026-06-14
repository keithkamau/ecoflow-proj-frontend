// src/pages/listings/ListingDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingContext } from '../../context/ListingContexts';
import ListingStatusBadge from '../../components/listings/ListingStatusBadge';
import StatusTimeline from '../../components/listings/StatusTimeline';
import MakeOfferModal from '../../components/listings/MakeOfferModal';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentListing, loading, error, fetchListing, deleteListing, updateListing } = useListingContext();
  
  const [offers, setOffers] = useState([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isSeller, setIsSeller] = useState(true); // Hardcoded - replace with auth check

  useEffect(() => {
    fetchListing(id);
    fetchOffers();
  }, [id, fetchListing]);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/listings/${id}/offers`);
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch {
      // Silently fail
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteListing(id);
      navigate('/listings');
    } catch {
      // error handled in context
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/offers/${offerId}/accept`, {
        method: 'POST',
      });
      
      if (response.ok) {
        fetchListing(id); // Refresh listing to show new status
        fetchOffers(); // Refresh offers
      }
    } catch {
      alert('Failed to accept offer');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateListing(id, { status: newStatus });
      fetchListing(id);
    } catch {
      alert('Failed to update status');
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">{error || 'Listing not found'}</p>
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

          {/* Status Timeline - Interactive */}
          <div className="mt-6 mb-8 pb-6 border-b border-gray-100">
            <h3 className="text-base font-medium text-gray-700 mb-3">Status Timeline</h3>
            <StatusTimeline 
              currentStatus={status} 
              onStatusChange={handleStatusChange}
              isEditable={isSeller}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            {!isSeller && status === 'active' && (
              <button
                onClick={() => setShowOfferModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Make Offer
              </button>
            )}
            
            {isSeller && status === 'matched' && offers.length > 0 && (
              <button
                onClick={() => handleAcceptOffer(offers[0].id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Accept Offer & Mark Completed
              </button>
            )}
          </div>

          {/* Offers List */}
          {offers.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Offers ({offers.length})</h3>
              <div className="space-y-2">
                {offers.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Recycler #{offer.recycler_id}</p>
                      {offer.offered_price && (
                        <p className="text-sm text-emerald-600">KES {offer.offered_price.toLocaleString()}</p>
                      )}
                      <p className="text-xs text-gray-500">{offer.status}</p>
                    </div>
                    {isSeller && offer.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                ))}
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
        </div>
      </div>

      {/* Offer Modal */}
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
