import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Package, Leaf,
  ArrowRight, PlusCircle, Search,
} from 'lucide-react';
import ImpactDashboard from '../components/analytics/ImpactDashboard';
import PickupCard from '../components/pickup/PickupCard';
import { useAuth } from '../hooks/useAuth';
import usePickup from '../hooks/usePickup';
import { getSellerStats, getRecyclerStats } from '../services/analyticsService';

// ── Quick-action card ──────────────────────────────────────────
const QuickAction = ({ to, Icon, label, desc, variant = 'primary' }) => (
  <Link
    to={to}
    className={`card-hover flex items-center gap-4 group ${variant === 'secondary' ? 'card-accent-orange' : 'card-accent'}`}
  >
    <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
      variant === 'secondary' ? 'bg-secondary-light' : 'bg-primary-light'
    }`}>
      <Icon size={18} className={variant === 'secondary' ? 'text-secondary' : 'text-primary'} />
    </span>
    <div className='flex-1 min-w-0 py-4'>
      <p className='text-sm font-semibold text-neutral-700'>{label}</p>
      <p className='text-xs text-neutral-500 truncate'>{desc}</p>
    </div>
    <ArrowRight size={14} className='text-neutral-400 group-hover:text-primary transition-colors shrink-0' />
  </Link>
);

// ── Summary stat ───────────────────────────────────────────────
const SumStat = ({ label, value, sub }) => (
  <div className='card text-center'>
    <p className='text-2xl font-bold text-neutral-800'>{value}</p>
    <p className='text-xs text-neutral-500 mt-0.5'>{label}</p>
    {sub && <p className='text-xs text-primary mt-1 font-medium'>{sub}</p>}
  </div>
);

const DashboardPage = () => {
  const { user }     = useAuth();
  const { pickups, fetchPickups } = usePickup();
  const [stats, setStats]   = useState(null);
  const isRecycler = user?.role === 'recycler';
  const isSeller   = user?.role === 'seller';

  useEffect(() => {
    fetchPickups();
    if (isSeller)   getSellerStats().then(setStats);
    if (isRecycler) getRecyclerStats().then(setStats);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upcoming = pickups.filter((p) => ['scheduled', 'on_the_way', 'arrived'].includes(p.status));

  return (
    <div className='page-content animate-fade-in'>
      {/* ── Greeting ────────────────────────────────────── */}
      <div className='flex items-center gap-3 mb-8'>
        <span className='flex items-center justify-center w-11 h-11 rounded-full bg-primary-light'>
          <LayoutDashboard size={20} className='text-primary' />
        </span>
        <div>
          <h1 className='text-h3'>
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className='text-sm text-neutral-500 capitalize'>{user?.role ?? 'member'} account</p>
        </div>
      </div>

      {/* ── Summary stats ───────────────────────────────── */}
      {stats && (
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
          {isSeller && <>
            <SumStat label='kg Sold'        value={`${(stats.total_kg_sold ?? 0).toLocaleString()} kg`} />
            <SumStat label='Earnings (KES)' value={`KES ${(stats.total_earnings_kes ?? 0).toLocaleString()}`} />
            <SumStat label='Transactions'   value={stats.transactions_completed ?? 0} />
            <SumStat label='Active Listings' value={stats.active_listings ?? 0} />
          </>}
          {isRecycler && <>
            <SumStat label='Sourced (kg)'   value={`${(stats.total_materials_sourced_kg ?? 0).toLocaleString()} kg`} />
            <SumStat label='Spent (KES)'    value={`KES ${(stats.total_spent_kes ?? 0).toLocaleString()}`} />
            <SumStat label='Suppliers'      value={stats.active_suppliers ?? 0} />
            <SumStat label='Pickups Done'   value={stats.pickups_completed ?? 0} />
          </>}
        </div>
      )}

      {/* ── Environmental impact ─────────────────────────── */}
      <section className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-h5'>Environmental Impact</h2>
          <Link to='/analytics/impact' className='text-sm text-primary font-medium hover:underline flex items-center gap-1'>
            Full report <ArrowRight size={13} />
          </Link>
        </div>
        <ImpactDashboard />
      </section>

      {/* ── Quick actions ────────────────────────────────── */}
      <section className='mb-8'>
        <h2 className='text-h5 mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          {isSeller && <>
            <QuickAction to='/listings/new' Icon={PlusCircle} label='New Listing'    desc='Add waste material to sell' />
            <QuickAction to='/pickups'      Icon={Truck}       label='My Pickups'    desc='View & schedule pickups' variant='secondary' />
          </>}
          {isRecycler && <>
            <QuickAction to='/browse'   Icon={Search}  label='Browse Waste'   desc='Find available listings nearby' />
            <QuickAction to='/pickups'  Icon={Truck}   label='Manage Pickups' desc='Assign drivers & track status' variant='secondary' />
          </>}
          <QuickAction to='/analytics/impact' Icon={Leaf}    label='My Impact'      desc='CO₂ saved & waste diverted' />
          <QuickAction to='/analytics'        Icon={Package} label='Analytics'       desc='Earnings & materials trends' variant='secondary' />
        </div>
      </section>

      {/* ── Upcoming pickups ─────────────────────────────── */}
      {upcoming.length > 0 && (
        <section>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-h5'>Upcoming Pickups</h2>
            <Link to='/pickups' className='text-sm text-primary font-medium hover:underline flex items-center gap-1'>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {upcoming.slice(0, 3).map((p) => (
              <PickupCard key={p.id} pickup={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
