// src/pages/listings/ListingsPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListingContext } from '../../context/ListingContexts';
import ListingCard from '../../components/listings/ListingCard';
import SearchBar from '../../components/listings/SearchBar';

const ListingsPage = () => {
  const { listings, loading, error, fetchListings } = useListingContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (filters) => {
    fetchListings(filters);
  };

  const handleCardClick = (id) => {
    navigate(`/listings/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Browse Listings</h1>
          <button
            onClick={() => navigate('/listings/new')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Listing
          </button>
        </div>

        <SearchBar onSearch={handleSearch} />

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <p className="text-lg">No listings found</p>
            <p className="text-sm mt-1">Be the first to post a recyclable!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;