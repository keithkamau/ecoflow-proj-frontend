// src/pages/listings/ListingDetailPage.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingContext } from '../../context/ListingContexts';
import ListingStatusBadge from '../../components/listings/ListingStatusBadge';

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
    } catch (err) {
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

  const { material, quantity, condition, location_address, price_expectation, status, photos, created_at } = currentListing;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/listings')}
          className="text-emerald-500 hover:text-emerald-600 text-sm font-medium mb-4"
        >
          ← Back to listings
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">{material?.type}</h1>
              <p className="text-gray-500 mt-1">{quantity} {material?.unit}</p>
            </div>
            <ListingStatusBadge status={status} />
          </div>

          {photos?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo.photo_url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="space-y-4">
            {condition && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Condition</h3>
                <p className="text-gray-600 mt-1">{condition}</p>
              </div>
            )}

            {location_address && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Location</h3>
                <p className="text-gray-600 mt-1">📍 {location_address}</p>
              </div>
            )}

            {price_expectation && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Expected Price</h3>
                <p className="text-emerald-600 font-semibold text-lg mt-1">
                  KES {price_expectation.toLocaleString()}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700">Posted</h3>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => navigate(`/listings/${id}/edit`)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg text-sm font-medium transition-colors"
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