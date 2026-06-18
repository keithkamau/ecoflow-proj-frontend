// src/components/listings/ListingCard.jsx

const statusColors = {
  waiting: 'bg-gray-100 text-gray-600',
  offer_accepted: 'bg-amber-100 text-amber-800',
  awaiting_pickup: 'bg-blue-100 text-blue-800',
  pickup_complete: 'bg-emerald-100 text-emerald-800',
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
  
  const statusClass = statusColors[status] || statusColors.waiting;
  const icon = materialIcons[material?.type] || '';

  return (
    <div 
      onClick={() => onClick?.(id)}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-300 border-2 border-transparent transition-all duration-300 ease-out cursor-pointer overflow-hidden group"
    >
      {/* Image with zoom effect */}
      {photos?.length > 0 && (
        <div className="overflow-hidden">
          <img 
            src={photos[0].photo_url} 
            alt={material?.type}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg capitalize group-hover:text-emerald-600 transition-colors duration-300">{material?.type || 'Unknown'}</h3>
              <p className="text-sm text-gray-500">{quantity} {material?.unit || 'kg'}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {status}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          {location_address && (
            <p className="text-gray-600 flex items-center gap-1">

              {location_address?.replace("📍 ", "")}
            </p>
          )}
          {price_expectation && (
            <p className="text-emerald-600 font-semibold text-base">
              KES {price_expectation.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
