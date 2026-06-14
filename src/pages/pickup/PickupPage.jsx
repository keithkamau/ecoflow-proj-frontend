import { useState, useEffect } from 'react';
import { Plus, Truck, Calendar, Clock } from 'lucide-react';
import usePickup from '../../hooks/usePickup';
import PickupCard from '../../components/pickup/PickupCard';
import PickupScheduler from '../../components/pickup/PickupScheduler';
import { SkeletonCard } from '../../components/common/LoadingSpinner';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past',     label: 'Past'     },
];

const UPCOMING_STATUSES = ['scheduled', 'on_the_way', 'arrived'];

const EmptyState = ({ tab, onSchedule }) => (
  <div className='text-center py-14'>
    <div className='w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4'>
      {tab === 'upcoming' ? <Calendar size={28} className='text-primary' /> : <Clock size={28} className='text-primary' />}
    </div>
    <h3 className='text-h5 mb-1'>
      {tab === 'upcoming' ? 'No upcoming pickups' : 'No past pickups yet'}
    </h3>
    <p className='text-sm text-neutral-500 mb-5'>
      {tab === 'upcoming'
        ? 'Schedule your first pickup to get started.'
        : 'Completed pickups will appear here.'}
    </p>
    {tab === 'upcoming' && (
      <button className='btn-primary' onClick={onSchedule}>
        <Plus size={15} />Schedule Pickup
      </button>
    )}
  </div>
);

const PickupPage = () => {
  const { pickups, loading, error, fetchPickups, schedulePickup } = usePickup();
  const [tab,          setTab]          = useState('upcoming');
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => { fetchPickups(); }, [fetchPickups]);

  const upcoming = pickups.filter((p) => UPCOMING_STATUSES.includes(p.status));
  const past      = pickups.filter((p) => !UPCOMING_STATUSES.includes(p.status));
  const list      = tab === 'upcoming' ? upcoming : past;

  const handleScheduled = async (data) => {
    const res = await schedulePickup(data);
    if (res.success) setShowScheduler(false);
  };

  return (
    <div className='page-content animate-fade-in'>
      {/* ── Header ──────────────────────────────────────── */}
      <div className='section-header'>
        <div className='flex items-center gap-3'>
          <span className='flex items-center justify-center w-10 h-10 rounded-full bg-primary-light'>
            <Truck size={20} className='text-primary' />
          </span>
          <div>
            <h1 className='text-h3'>Pickups</h1>
            <p className='text-xs text-neutral-500 mt-0.5'>
              {upcoming.length} upcoming · {past.length} past
            </p>
          </div>
        </div>
        <button
          className='btn-primary btn-sm'
          onClick={() => setShowScheduler((v) => !v)}
        >
          <Plus size={14} />
          {showScheduler ? 'Cancel' : 'Schedule Pickup'}
        </button>
      </div>

      {/* ── Inline scheduler ────────────────────────────── */}
      {showScheduler && (
        <div className='mb-6 max-w-lg' style={{ animation: 'var(--animate-fade-in)' }}>
          <PickupScheduler onScheduled={handleScheduled} />
        </div>
      )}

      {/* ── Error banner ────────────────────────────────── */}
      {error && (
        <div className='alert-error mb-4'>{error}</div>
      )}

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className='flex gap-1 mb-5 border-b border-neutral-200'>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors duration-150',
              tab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700',
            ].join(' ')}
          >
            {label}
            <span className={[
              'ml-2 px-1.5 py-0.5 rounded-full text-xs',
              tab === key ? 'bg-primary-light text-primary' : 'bg-neutral-100 text-neutral-500',
            ].join(' ')}>
              {key === 'upcoming' ? upcoming.length : past.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── List ────────────────────────────────────────── */}
      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <EmptyState tab={tab} onSchedule={() => setShowScheduler(true)} />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {list.map((pickup) => (
            <PickupCard key={pickup.id} pickup={pickup} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PickupPage;
