// src/pages/listings/EditListingPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useListingContext } from '../../context/ListingContexts';
import LocationPicker from '../../components/listings/LocationPicker';
import UnitSelector from '../../components/listings/UnitSelector';
import PhotoUploadComponent from '../../components/listings/PhotoUploadComponent';
import listingService from '../../services/listingService';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { materials, loading, error, fetchMaterials, updateListing } = useListingContext();

  const [formData, setFormData] = useState({
    material_id: '',
    quantity: '',
    condition: '',
    location_address: '',
    price_expectation: '',
  });

  const [unit, setUnit] = useState('');
  const [location, setLocation] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchMaterials();
    const loadListing = async () => {
      try {
        const response = await listingService.getListing(id);
        const listing = response;
        setFormData({
          material_id: listing.material_id.toString(),
          quantity: listing.quantity.toString(),
          condition: listing.condition || '',
          location_address: listing.location_address || '',
          price_expectation: listing.price_expectation?.toString() || '',
        });
        setUnit(listing.unit || '');
        if (listing.location_lat && listing.location_lng) {
          setLocation({
            lat: listing.location_lat,
            lng: listing.location_lng,
            address: listing.location_address,
          });
        }
        setPhotos(listing.photos?.map(p => ({ ...p, isNew: false })) || []);
      } catch (err) {
        setSubmitError(err?.message || 'Failed to load listing');
      }
    };
    loadListing();
  }, [id, fetchMaterials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const selectedMaterial = materials?.find(m => m.id === parseInt(formData.material_id));

      const data = {
        ...formData,
        material_id: parseInt(formData.material_id),
        quantity: parseFloat(formData.quantity),
        unit: unit || selectedMaterial?.unit,
        location_lat: location?.lat,
        location_lng: location?.lng,
        location_address: location?.address || formData.location_address,
        price_expectation: formData.price_expectation ? parseFloat(formData.price_expectation) : null,
      };

      await updateListing(id, data);

      const newPhotos = photos.filter(p => p.isNew);
      for (const photo of newPhotos) {
        await listingService.uploadListingPhoto(id, photo.file);
      }

      navigate(`/listings/${id}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to update listing');
    }
  };

  const selectedMaterial = materials?.find(m => m.id === parseInt(formData.material_id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(`/listings/${id}`)}
          className="text-emerald-500 hover:text-emerald-600 text-sm font-medium mb-4"
        >
          Back to listing
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Listing</h1>

        {(error || submitError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {submitError || error}
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
              {materials?.map((m) => (
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <UnitSelector
            value={unit}
            onChange={setUnit}
            materialUnit={selectedMaterial?.unit}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <textarea
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
            <LocationPicker onLocationSelect={setLocation} initialLocation={location} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Address (manual)</label>
            <input
              type="text"
              name="location_address"
              value={formData.location_address}
              onChange={handleChange}
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
              {loading ? 'Updating...' : 'Update Listing'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/listings/${id}`)}
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

export default EditListingPage;
