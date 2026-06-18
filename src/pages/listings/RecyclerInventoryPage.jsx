import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useListingContext } from '../../context/ListingContexts';
import { Recycle, Hash, Package } from 'lucide-react';

const MATERIAL_EMOJIS = {
  plastic: '\u{1FAD4}',
  metal: '\u{1F529}',
  glass: '\u{1F37E}',
  paper: '\u{1F4C4}',
  e_waste: '\u{1F50C}',
  organic: '\u{1F331}',
  mixed: '\u{1F4E6}',
};

const RecyclerInventoryPage = () => {
  const { user } = useAuth();
  const { inventory, loading, error, fetchInventory } = useListingContext();

  useEffect(() => {
    if (user?.role === 'recycler') {
      fetchInventory(user.id);
    }
  }, [user, fetchInventory]);

  return (
    <div className="page-content animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="text-h3">My Inventory</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Materials sourced from your completed transactions
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">{error}</div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {inventory && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h5">Inventory</h2>
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
                            {MATERIAL_EMOJIS[item.material_type] || '\u{1F4E6}'}
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
              <p>No inventory yet</p>
              <p className="text-xs mt-1">Complete transactions to build inventory</p>
            </div>
          )}
        </div>
      )}

      {!inventory && !loading && user?.role !== 'recycler' && (
        <div className="card text-center py-8 text-neutral-400">
          <Recycle size={40} className="mx-auto mb-3" />
          <p>Only recyclers can view inventory</p>
        </div>
      )}
    </div>
  );
};

export default RecyclerInventoryPage;
