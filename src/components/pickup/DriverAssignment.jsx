import { useState, useEffect } from 'react';
import { User, Truck, Phone, AlertCircle } from 'lucide-react';
import { getDrivers, assignDriver } from '../../services/pickupService';
import LoadingSpinner, { ButtonSpinner } from '../common/LoadingSpinner';

const STATUS_CLS = {
  available: 'badge-active',
  on_trip:   'badge-pending',
  offline:   'badge-neutral',
};
const STATUS_LABEL = { available: 'Available', on_trip: 'On Trip', offline: 'Offline' };

const DriverAssignment = ({ pickupId, onAssigned }) => {
  const [drivers,    setDrivers]    = useState([]);
  const [selected,   setSelected]   = useState('');
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [assigned,   setAssigned]   = useState(false);

  useEffect(() => {
    getDrivers()
      .then((response) => setDrivers(response.data ?? response))
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selected) { setError('Please select a driver'); return; }
    setSubmitting(true);
    try {
      await assignDriver({ pickup_id: pickupId, driver_id: selected });
      setAssigned(true);
      onAssigned?.(selected);
    } catch {
      setError('Failed to assign driver. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (assigned) {
    const driver = drivers.find((d) => d.id === selected);
    return (
      <div className='card text-center py-6' data-testid='driver-assignment'>
        <div className='w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3'>
          <User size={20} className='text-primary' />
        </div>
        <p className='text-sm font-semibold text-neutral-700'>Driver Assigned</p>
        <p className='text-xs text-neutral-500 mt-1'>{driver?.name} · {driver?.vehicle}</p>
        <p className='text-xs text-primary mt-0.5'>{driver?.phone}</p>
      </div>
    );
  }

  const available = drivers.filter((d) => d.status === 'available');

  return (
    <div className='card' data-testid='driver-assignment'>
      <h3 className='text-h5 mb-4'>Assign Driver</h3>

      {loading ? (
        <div className='flex justify-center py-6'>
          <LoadingSpinner variant='eco' size='md' />
        </div>
      ) : (
        <form onSubmit={handleAssign} noValidate>
          <div className='space-y-2 mb-4'>
            {available.length === 0 ? (
              <p className='text-sm text-neutral-500 py-3 text-center'>No drivers available right now.</p>
            ) : (
              available.map((driver) => (
                <label
                  key={driver.id}
                  className={[
                    'flex items-center gap-3 p-3 rounded-md border-2 cursor-pointer transition-all duration-150',
                    selected === driver.id
                      ? 'border-primary bg-primary-light'
                      : 'border-neutral-200 hover:border-primary/40',
                  ].join(' ')}
                >
                  <input
                    type='radio'
                    name='driver'
                    value={driver.id}
                    checked={selected === driver.id}
                    onChange={() => { setSelected(driver.id); setError(''); }}
                    className='sr-only'
                  />
                  <span className='flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 text-neutral-600 shrink-0'>
                    <User size={16} />
                  </span>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-neutral-700'>{driver.name}</p>
                    <div className='flex items-center gap-3 mt-0.5'>
                      <span className='text-xs text-neutral-500 flex items-center gap-1'>
                        <Truck size={11} />{driver.vehicle}
                      </span>
                      <span className='text-xs text-neutral-500 flex items-center gap-1'>
                        <Phone size={11} />{driver.phone}
                      </span>
                    </div>
                  </div>
                  <span className={STATUS_CLS[driver.status] ?? 'badge-neutral'}>
                    {STATUS_LABEL[driver.status] ?? driver.status}
                  </span>
                </label>
              ))
            )}
          </div>

          {error && (
            <p className='error-text flex items-center gap-1 mb-3'>
              <AlertCircle size={11} />{error}
            </p>
          )}

          <button
            type='submit'
            className='btn-primary w-full'
            disabled={submitting || available.length === 0}
          >
            {submitting ? <><ButtonSpinner />Assigning…</> : 'Assign Driver'}
          </button>
        </form>
      )}
    </div>
  );
};

export default DriverAssignment;
