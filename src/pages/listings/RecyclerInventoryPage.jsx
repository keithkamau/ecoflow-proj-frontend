// src/pages/listings/RecyclerInventoryPage.jsx
import React, { useState } from 'react';
import { useListingContext } from '../../context/ListingContexts';

const RecyclerInventoryPage = () => {
  const { inventory, loading, error, fetchInventory } = useListingContext();
  const [recyclerId, setRecyclerId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!recyclerId) return;
    fetchInventory(parseInt(recyclerId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Recycler Inventory</h1>

        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-3">
          <input
            type="number"
            placeholder="Enter Recycler ID"
            value={recyclerId}
            onChange={(e) => setRecyclerId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'View'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {inventory && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Inventory for Recycler #{inventory.recycler_id}
              </h2>
              <span className="text-sm text-gray-500">
                {inventory.items?.length || 0} materials
              </span>
            </div>

            {inventory.items?.length > 0 ? (
              <div className="space-y-3">
                {inventory.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {item.material_type === 'plastic' && ''}
                        {item.material_type === 'metal' && ''}
                        {item.material_type === 'glass' && ''}
                        {item.material_type === 'e_waste' && ''}
                        {item.material_type === 'paper' && ''}
                        {item.material_type === 'organic' && ''}
                        {item.material_type === 'mixed' && ''}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {item.material_type.replace('_', '-')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.listing_count} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">
                        {item.total_quantity.toLocaleString()} kg
                      </p>
                      {item.total_spent && (
                        <p className="text-sm text-gray-500">
                          KES {item.total_spent.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No inventory found for this recycler</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecyclerInventoryPage;