import { Link } from 'react-router-dom';
import { Truck, MapPin, Clock, User } from 'lucide-react';

const STATUS_CONFIG = {
  scheduled:  { label: 'Scheduled',  cls: 'badge-completed' },
  on_the_way: { label: 'On the Way', cls: 'badge-pending'   },
  arrived:    { label: 'Arrived',    cls: 'badge-active'    },
  in_progress: { label: 'In Progress', cls: 'badge-active'  },
  completed:  { label: 'Completed',  cls: 'badge-active'    },
  cancelled:  { label: 'Cancelled',  cls: 'badge-error'     },
};

const fmt = (iso) =>
  new Date(iso).toLocaleString('en-KE', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const PickupCard = ({ pickup }) => {
  const { label, cls } = STATUS_CONFIG[pickup.status] ?? STATUS_CONFIG.scheduled;
  const address = pickup.pickup_address || pickup.pickup_location?.address;
  const driver = pickup.driver || null;

  return (
    <Link to={`/pickups/${pickup.id}/track`} className='block' data-testid='pickup-card'>
      <div className='card-hover group'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center gap-2.5'>
            <span className='flex items-center justify-center w-9 h-9 rounded-full bg-primary-light shrink-0'>
              <Truck size={16} className='text-primary' />
            </span>
            <div>
              <p className='text-sm font-semibold text-neutral-700'>Pickup</p>
              <p className='text-xs text-neutral-400'>#{pickup.id}</p>
            </div>
          </div>
          <span className={cls}>{label}</span>
        </div>

        <ul className='space-y-1.5'>
          <li className='flex items-center gap-2 text-xs text-neutral-500'>
            <Clock size={12} className='text-neutral-400 shrink-0' />
            {fmt(pickup.scheduled_time)}
          </li>
          {address && (
            <li className='flex items-start gap-2 text-xs text-neutral-500'>
              <MapPin size={12} className='text-neutral-400 shrink-0 mt-0.5' />
              <span className='truncate-2'>{address}</span>
            </li>
          )}
          {driver && (
            <li className='flex items-center gap-2 text-xs text-neutral-500'>
              <User size={12} className='text-neutral-400 shrink-0' />
              {driver.name}
            </li>
          )}
        </ul>
      </div>
    </Link>
  );
};

export default PickupCard;
