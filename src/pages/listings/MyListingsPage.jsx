// src/pages/listings/MyListingsPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListingContext } from '../../context/ListingContexts';
import ListingCard from '../../components/listings/ListingCard';

const MyListingsPage = () => {
  const navigate = useNavigate();
  const { listings, loading, error, fetchListings } = useListingContext();

  useEffect(() => {
    // TODO: filter by current user ID when auth is ready
    fetchListings({ status: 'active' });
  }, [fetchListings]);

  const handleCardClick = (id) => {
    navigate(`/listings/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <button
            onClick={() => navigate('/listings/new')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Listing
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No listings yet</p>
            <p className="text-sm mt-1">Create your first listing to start selling!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;