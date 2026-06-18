import { useState, useEffect } from 'react';
import listingService from '../../services/listingService';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'offer_accepted', label: 'Offer Accepted' },
  { value: 'awaiting_pickup', label: 'Awaiting Pickup' },
  { value: 'pickup_complete', label: 'Pickup Complete' },
];

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    material_type: '',
    quantity: '',
    status: '',
    date_from: '',
    date_to: '',
  });

  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    listingService.getMaterials().then((res) => setMaterials(res)).catch((err) => console.error('Failed to load materials:', err));
  }, []);

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
      quantity: '',
      status: '',
      date_from: '',
      date_to: '',
    });
    onSearch?.({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Material</label>
          <select
            name="material_type"
            value={filters.material_type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          >
            <option value="">All Materials</option>
            {materials.map((m) => (
              <option key={m.id} value={m.type}>{m.type.charAt(0).toUpperCase() + m.type.slice(1).replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Min Quantity (kg)</label>
          <input
            type="number"
            name="quantity"
            placeholder="At least e.g. 10"
            value={filters.quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
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
