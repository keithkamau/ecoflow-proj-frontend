import { useState } from 'react';
import { offerService } from '../../services/offerService';

const MakeOfferModal = ({ listingId, onClose, onOfferMade }) => {
  const [offeredPrice, setOfferedPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const price = parseFloat(offeredPrice);
    const qty = parseFloat(quantity);

    if (!price || price <= 0) {
      setError('Please enter a valid offered price greater than zero');
      setLoading(false);
      return;
    }
    if (!qty || qty <= 0) {
      setError('Please enter a valid quantity greater than zero');
      setLoading(false);
      return;
    }

    try {
      await offerService.create({
        listing_id: listingId,
        offered_price: price,
        quantity: qty,
      });
      onOfferMade?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to make offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Make an Offer</h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offered Price (KES) *
            </label>
            <input
              type="number"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              placeholder="e.g. 50"
              min="1"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity ({/* unit will be passed from listing context */}units) *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 10"
              min="1"
              step="0.5"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Offer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeOfferModal;
