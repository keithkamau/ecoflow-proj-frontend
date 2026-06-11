// src/components/listings/ListingStatusBadge.jsx
import React from 'react';

const statusConfig = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Active' },
  matched: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Matched' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
  expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expired' },
};

const ListingStatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default ListingStatusBadge;