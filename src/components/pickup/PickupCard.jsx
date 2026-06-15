import { Link } from 'react-router-dom';
import { Truck, MapPin, Clock, User, Package } from 'lucide-react';

const STATUS_CONFIG = {
  scheduled:  { label: 'Scheduled',  cls: 'badge-completed' },
  on_the_way: { label: 'On the Way', cls: 'badge-pending'   },
  arrived:    { label: 'Arrived',    cls: 'badge-active'    },
  completed:  { label: 'Completed',  cls: 'badge-active'    },
  cancelled:  { label: 'Cancelled',  cls: 'badge-error'     },
};

const fmt = (iso) =>
  new Date(iso).toLocaleString('en-KE', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const capitalise = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

const PickupCard = ({ pickup }) => {
  const { label, cls } = STATUS_CONFIG[pickup.status] ?? STATUS_CONFIG.scheduled;

  return (
    <Link to={`/pickups/${pickup.id}`} className='block' data-testid='pickup-card'>
      <div className='card-hover group'>
        {/* ── Header ──────────────────────────────── */}
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center gap-2.5'>
            <span className='flex items-center justify-center w-9 h-9 rounded-full bg-primary-light shrink-0'>
              <Truck size={16} className='text-primary' />
            </span>
            <div>
              <p className='text-sm font-semibold text-neutral-700'>
                {capitalise(pickup.material?.type)} Pickup
              </p>
              <p className='text-xs text-neutral-400'>#{pickup.id}</p>
            </div>
          </div>
          <span className={cls}>{label}</span>
        </div>

        {/* ── Details ─────────────────────────────── */}
        <ul className='space-y-1.5'>
          <li className='flex items-center gap-2 text-xs text-neutral-500'>
            <Clock size={12} className='text-neutral-400 shrink-0' />
            {fmt(pickup.scheduled_time)}
          </li>
          <li className='flex items-start gap-2 text-xs text-neutral-500'>
            <MapPin size={12} className='text-neutral-400 shrink-0 mt-0.5' />
            <span className='truncate-2'>{pickup.pickup_location?.address}</span>
          </li>
          {pickup.driver && (
            <li className='flex items-center gap-2 text-xs text-neutral-500'>
              <User size={12} className='text-neutral-400 shrink-0' />
              {pickup.driver.name} · {pickup.driver.vehicle}
            </li>
          )}
          <li className='flex items-center gap-2 text-xs text-neutral-500'>
            <Package size={12} className='text-neutral-400 shrink-0' />
            {pickup.material?.quantity} {pickup.material?.unit}
          </li>
        </ul>
      </div>
    </Link>
  );
};

export default PickupCard;
