// src/components/listings/ListingCard.jsx
import React from 'react';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-800',
  matched: 'bg-amber-100 text-amber-800',
  completed: 'bg-blue-100 text-blue-800',
  expired: 'bg-gray-100 text-gray-800',
};

const materialIcons = {
  plastic: '',
  metal: '',
  glass: '',
  e_waste: '',
  paper: '',
  organic: '',
  mixed: '',
};

const ListingCard = ({ listing, onClick }) => {
  const { id, material, quantity, status, location_address, price_expectation, photos } = listing;
  
  const statusClass = statusColors[status] || statusColors.active;
  const icon = materialIcons[material?.type] || '';

  return (
    <div 
      onClick={() => onClick?.(id)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">{material?.type || 'Unknown'}</h3>
            <p className="text-sm text-gray-500">{quantity} {material?.unit || 'kg'}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {status}
        </span>
      </div>

      {photos?.length > 0 && (
        <div className="mb-3">
          <img 
            src={photos[0].photo_url} 
            alt={material?.type}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="space-y-1 text-sm">
        {location_address && (
          <p className="text-gray-600 flex items-center gap-1">
             {location_address}
          </p>
        )}
        {price_expectation && (
          <p className="text-emerald-600 font-medium">
            KES {price_expectation.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ListingCard;