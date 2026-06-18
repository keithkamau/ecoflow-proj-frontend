import { useState } from 'react';
import { useListingContext } from '../../context/ListingContexts';
import { Recycle, Hash, Package } from 'lucide-react';

const MATERIAL_EMOJIS = {
  plastic: '🥤',
  metal: '🔩',
  glass: '🍾',
  paper: '📄',
  e_waste: '🔌',
  organic: '🌱',
  mixed: '📦',
};

const RecyclerInventoryPage = () => {
  const { inventory, loading, error, fetchInventory } = useListingContext();
  const [recyclerId, setRecyclerId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!recyclerId.trim()) return;
    fetchInventory(recyclerId.trim());
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="text-h3">Recycler Inventory</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            View materials sourced from completed transactions
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter Recycler User ID"
          value={recyclerId}
          onChange={(e) => setRecyclerId(e.target.value)}
          className="input flex-1 max-w-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Loading...' : 'View Inventory'}
        </button>
      </form>

      {error && (
        <div className="alert alert-error mb-4">{error}</div>
      )}

      {inventory && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h5">
              Inventory for Recycler #{inventory.recycler_id}
            </h2>
            <span className="text-sm text-neutral-500">
              {inventory.items?.length || 0} entries
            </span>
          </div>

          {inventory.items?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-neutral-500">
                    <th className="pb-3 font-medium flex items-center gap-1">
                      <Hash size={14} /> Transaction ID
                    </th>
                    <th className="pb-3 font-medium flex items-center gap-1">
                      <Recycle size={14} /> Material
                    </th>
                    <th className="pb-3 font-medium flex items-center gap-1">
                      <Package size={14} /> Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.items.map((item, index) => (
                    <tr key={index} className="border-b border-neutral-100 last:border-0">
                      <td className="py-3 text-neutral-900 font-mono">
                        #{item.transaction_id}
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-2 capitalize">
                          <span className="text-lg">
                            {MATERIAL_EMOJIS[item.material_type] || '📦'}
                          </span>
                          {item.material_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-emerald-600">
                        {item.quantity.toLocaleString()} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <Recycle size={40} className="mx-auto mb-3" />
              <p>No inventory found for this recycler</p>
              <p className="text-xs mt-1">Complete transactions to build inventory</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecyclerInventoryPage;
