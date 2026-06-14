import { useEffect, useState } from 'react';
import { Package, DollarSign, TrendingUp, Award, BarChart2 } from 'lucide-react';
import { getSellerStats, getRecyclerStats, getImpact } from '../../services/analyticsService';
import { useAuth } from '../../hooks/useAuth';

const StatRow = ({ Icon, label, value, sub, iconCls = 'text-primary', bgCls = 'bg-primary-light' }) => (
  <div className='flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0'>
    <span className={`w-9 h-9 rounded-full ${bgCls} flex items-center justify-center shrink-0`}>
      <Icon size={15} className={iconCls} />
    </span>
    <div className='flex-1 min-w-0'>
      <p className='text-xs text-neutral-500'>{label}</p>
      <p className='text-sm font-semibold text-neutral-800 truncate'>{value}</p>
    </div>
    {sub && <span className='text-xs text-neutral-400 shrink-0'>{sub}</span>}
  </div>
);

const UserStats = () => {
  const { user } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [impact,  setImpact]  = useState(null);
  const [loading, setLoading] = useState(true);

  const isRecycler = user?.role === 'recycler';

  useEffect(() => {
    const fetches = [
      isRecycler ? getRecyclerStats() : getSellerStats(),
      getImpact(),
    ];
    Promise.all(fetches)
      .then(([s, imp]) => { setStats(s.data); setImpact(imp.data); })
      .finally(() => setLoading(false));
  }, [isRecycler]);

  if (loading) {
    return (
      <div className='card animate-pulse' data-testid='user-stats'>
        <div className='h-4 w-1/3 bg-neutral-200 rounded mb-4' />
        {[...Array(4)].map((_, i) => (
          <div key={i} className='flex items-center gap-3 py-3 border-b border-neutral-100'>
            <div className='w-9 h-9 rounded-full bg-neutral-200' />
            <div className='flex-1 space-y-1.5'>
              <div className='h-3 w-2/5 bg-neutral-200 rounded' />
              <div className='h-3.5 w-1/3 bg-neutral-200 rounded' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='card' data-testid='user-stats'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-h6'>Your Stats</h3>
        {impact?.ranking && (
          <span className='badge-active text-xs flex items-center gap-1'>
            <Award size={11} />#{impact.ranking} of {impact.total_users}
          </span>
        )}
      </div>

      {isRecycler ? (
        <>
          <StatRow Icon={Package}   label='Materials Sourced'   value={`${(stats?.total_materials_sourced_kg ?? 0).toLocaleString()} kg`} />
          <StatRow Icon={DollarSign} label='Total Spent'         value={`KES ${(stats?.total_spent_kes ?? 0).toLocaleString()}`} iconCls='text-secondary' bgCls='bg-secondary-light' />
          <StatRow Icon={BarChart2}  label='Active Suppliers'    value={stats?.active_suppliers ?? 0} />
          <StatRow Icon={TrendingUp} label='Pickups Completed'   value={stats?.pickups_completed ?? 0} />
        </>
      ) : (
        <>
          <StatRow Icon={Package}   label='Total kg Sold'        value={`${(stats?.total_kg_sold ?? 0).toLocaleString()} kg`} />
          <StatRow Icon={DollarSign} label='Total Earnings'       value={`KES ${(stats?.total_earnings_kes ?? 0).toLocaleString()}`} iconCls='text-secondary' bgCls='bg-secondary-light' />
          <StatRow Icon={BarChart2}  label='Transactions'         value={stats?.transactions_completed ?? 0} />
          <StatRow Icon={TrendingUp} label='Active Listings'      value={stats?.active_listings ?? 0} />
        </>
      )}
    </div>
  );
};

export default UserStats;
