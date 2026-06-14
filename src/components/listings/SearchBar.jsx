// src/components/listings/SearchBar.jsx
import { useState } from 'react';

const materialOptions = [
  { value: '', label: 'All Materials' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'metal', label: 'Metal' },
  { value: 'glass', label: 'Glass' },
  { value: 'e_waste', label: 'E-Waste' },
  { value: 'paper', label: 'Paper' },
  { value: 'organic', label: 'Organic' },
  { value: 'mixed', label: 'Mixed' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'matched', label: 'Matched' },
  { value: 'completed', label: 'Completed' },
  { value: 'expired', label: 'Expired' },
];

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    material_type: '',
    status: '',
    min_quantity: '',
    max_quantity: '',
    lat: '',
    lng: '',
    radius_km: '',
    date_from: '',
    date_to: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== '')
    );
    onSearch?.(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      material_type: '',
      status: '',
      min_quantity: '',
      max_quantity: '',
      lat: '',
      lng: '',
      radius_km: '',
      date_from: '',
      date_to: '',
    });
    onSearch?.({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Material</label>
          <select
            name="material_type"
            value={filters.material_type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          >
            {materialOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Min Quantity</label>
          <input
            type="number"
            name="min_quantity"
            placeholder="Min qty e.g. 10"
            value={filters.min_quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Max Quantity</label>
          <input
            type="number"
            name="max_quantity"
            placeholder="Max qty e.g. 100"
            value={filters.max_quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Latitude</label>
          <input
            type="number"
            step="any"
            name="lat"
            placeholder="Lat e.g. -1.2921"
            value={filters.lat}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Longitude</label>
          <input
            type="number"
            step="any"
            name="lng"
            placeholder="Lng e.g. 36.8219"
            value={filters.lng}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Radius (km)</label>
          <input
            type="number"
            name="radius_km"
            placeholder="Radius km e.g. 10"
            value={filters.radius_km}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date From</label>
          <input
            type="date"
            name="date_from"
            value={filters.date_from}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date To</label>
          <input
            type="date"
            name="date_to"
            value={filters.date_to}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg text-base font-medium transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-3 border border-gray-200 rounded-lg text-base text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
