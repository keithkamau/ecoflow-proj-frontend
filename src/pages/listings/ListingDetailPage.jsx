// src/pages/listings/ListingDetailPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingContext } from '../../context/ListingContexts';
import ListingStatusBadge from '../../components/listings/ListingStatusBadge';
import StatusTimeline from '../../components/listings/StatusTimeline';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentListing, loading, error, fetchListing, deleteListing } = useListingContext();

  useEffect(() => {
    fetchListing(id);
  }, [id, fetchListing]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteListing(id);
      navigate('/listings');
    } catch {
      // error handled in context
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
            ← Back to listings
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
          ← Back to listings
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
                <p className="text-gray-600 mt-2 text-base">{location_address?.replace("📍 ", "")}</p>
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
    </div>
  );
};

export default ListingDetailPage;
