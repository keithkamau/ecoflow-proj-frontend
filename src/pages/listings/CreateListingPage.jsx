// src/pages/listings/CreateListingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListingContext } from '../../context/ListingContexts';
import PhotoUploadComponent from '../../components/listings/PhotoUploadComponent';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { materials, loading, error, fetchMaterials, createListing } = useListingContext();

  const [formData, setFormData] = useState({
    material_id: '',
    quantity: '',
    condition: '',
    location_address: '',
    price_expectation: '',
  });

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        material_id: parseInt(formData.material_id),
        quantity: parseFloat(formData.quantity),
        price_expectation: formData.price_expectation ? parseFloat(formData.price_expectation) : null,
      };
      await createListing(data);
      navigate('/listings');
    } catch (err) {
      // error handled in context
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/listings')}
          className="text-emerald-500 hover:text-emerald-600 text-sm font-medium mb-4"
        >
          ← Back to listings
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Listing</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Type</label>
            <select
              name="material_id"
              value={formData.material_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select material</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.type} ({m.unit}) {m.reference_price ? `- KES ${m.reference_price}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0.1"
              step="0.1"
              placeholder="e.g. 50"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <textarea
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the condition of your recyclables..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location_address"
              value={formData.location_address}
              onChange={handleChange}
              placeholder="e.g. Nairobi, Kenya"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price (KES)</label>
            <input
              type="number"
              name="price_expectation"
              value={formData.price_expectation}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <PhotoUploadComponent photos={photos} onPhotosChange={setPhotos} />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/listings')}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;