import { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';
import ImpactDashboard from '../../components/analytics/ImpactDashboard';
import UserStats from '../../components/analytics/UserStats';
import { EarningsChart, MaterialsChart, BreakdownChart } from '../../components/analytics/AnalyticsChart';
import { getEarningsTrend, getMaterialsBreakdown, getRecyclerStats } from '../../services/analyticsService';
import { useAuth } from '../../hooks/useAuth';

const AnalyticsPage = () => {
  const { user }             = useAuth();
  const [earnings, setEarnings] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [recyclerStats, setRecyclerStats] = useState(null);
  const isRecycler = user?.role === 'recycler';

  useEffect(() => {
    getEarningsTrend().then(setEarnings);
    getMaterialsBreakdown().then(setMaterials);
    if (isRecycler) getRecyclerStats().then(setRecyclerStats);
  }, [isRecycler]);

  return (
    <div className='page-content animate-fade-in'>
      {/* ── Header ──────────────────────────────────────── */}
      <div className='section-header'>
        <div className='flex items-center gap-3'>
          <span className='flex items-center justify-center w-10 h-10 rounded-full bg-primary-light'>
            <BarChart2 size={20} className='text-primary' />
          </span>
          <div>
            <h1 className='text-h3'>Analytics</h1>
            <p className='text-xs text-neutral-500 mt-0.5'>Your environmental & financial performance</p>
          </div>
        </div>
      </div>

      {/* ── Impact summary row ───────────────────────────── */}
      <section className='mb-8'>
        <h2 className='text-h5 mb-4'>Environmental Impact</h2>
        <ImpactDashboard />
      </section>

      {/* ── Charts + stats ──────────────────────────────── */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        <div className='lg:col-span-2 space-y-5'>
          <EarningsChart data={earnings} />
          <MaterialsChart data={earnings} />
        </div>
        <div>
          <UserStats />
        </div>
      </div>

      {/* ── Materials breakdown ─────────────────────────── */}
      <section className='mb-8'>
        <h2 className='text-h5 mb-4'>Materials Breakdown</h2>
        <div className='max-w-2xl'>
          <BreakdownChart data={materials} />
        </div>
      </section>

      {/* ── Recycler sourcing stats ──────────────────────── */}
      {isRecycler && recyclerStats && (
        <section>
          <h2 className='text-h5 mb-4'>Sourcing Overview</h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {[
              { label: 'Total Sourced', value: `${(recyclerStats.total_materials_sourced_kg ?? 0).toLocaleString()} kg`, accent: 'border-l-primary' },
              { label: 'Total Spent',   value: `KES ${(recyclerStats.total_spent_kes ?? 0).toLocaleString()}`, accent: 'border-l-secondary' },
              { label: 'Suppliers',     value: recyclerStats.active_suppliers ?? 0, accent: 'border-l-info' },
              { label: 'Pickups Done',  value: recyclerStats.pickups_completed ?? 0, accent: 'border-l-primary' },
            ].map(({ label, value, accent }) => (
              <div key={label} className={`card border-l-4 ${accent}`}>
                <p className='text-xs text-neutral-500 mb-1'>{label}</p>
                <p className='text-h5 font-bold text-neutral-800'>{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AnalyticsPage;
