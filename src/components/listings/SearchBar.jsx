// src/components/listings/SearchBar.jsx
import React, { useState } from 'react';

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    onSearch?.(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      material_type: '',
      status: '',
      min_quantity: '',
      max_quantity: '',
    });
    onSearch?.({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select
          name="material_type"
          value={filters.material_type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        >
          {materialOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <input
          type="number"
          name="min_quantity"
          placeholder="Min quantity"
          value={filters.min_quantity}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />

        <input
          type="number"
          name="max_quantity"
          placeholder="Max quantity"
          value={filters.max_quantity}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchBar;