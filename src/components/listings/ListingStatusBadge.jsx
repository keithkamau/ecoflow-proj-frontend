const statusConfig = {
  waiting: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Waiting' },
  offer_accepted: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Offer Accepted' },
  awaiting_pickup: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Awaiting Pickup' },
  pickup_complete: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pickup Complete' },
};

const ListingStatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.waiting;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default ListingStatusBadge;
