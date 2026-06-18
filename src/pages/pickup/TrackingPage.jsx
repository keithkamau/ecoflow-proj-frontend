import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Truck, Clock } from 'lucide-react';
import usePickup from '../../hooks/usePickup';
import PickupTracker from '../../components/pickup/PickupTracker';
import PickupMap from '../../components/pickup/PickupMap';
import ProofUpload from '../../components/pickup/ProofUpload';
import DriverAssignment from '../../components/pickup/DriverAssignment';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const fmt = (iso) =>
  new Date(iso).toLocaleString('en-KE', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const TrackingPage = () => {
  const { id }                      = useParams();
  const { user }                    = useAuth();
  const { currentPickup, loading, error, fetchPickup, uploadProof } = usePickup();
  const [proofDone, setProofDone]   = useState(false);

  useEffect(() => { if (id) fetchPickup(id); }, [id, fetchPickup]);

  const handleProof = async (pickupId, formData) => {
    const res = await uploadProof(pickupId, formData);
    if (res.success) setProofDone(true);
  };

  if (loading) {
    return (
      <div className='page-content flex items-center justify-center min-h-64'>
        <LoadingSpinner variant='eco' size='xl' />
      </div>
    );
  }

  if (error || !currentPickup) {
    return (
      <div className='page-content'>
        <div className='alert-error'>{error || 'Pickup not found.'}</div>
        <Link to='/pickups' className='btn-tertiary mt-4 inline-flex'>
          <ArrowLeft size={14} />Back to Pickups
        </Link>
      </div>
    );
  }

  const p            = currentPickup;
  const isRecycler   = user?.role === 'recycler';
  const showProof    = p.status === 'arrived' && !proofDone;
  const showAssign   = isRecycler && !p.driver_id;
  const driver       = p.driver || null;
  const pickupLoc    = p.pickup_location || { address: p.pickup_address, lat: p.pickup_lat, lng: p.pickup_lng };

  return (
    <div className='page-content animate-fade-in'>
      <Link
        to='/pickups'
        className='inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary mb-5 transition-colors'
      >
        <ArrowLeft size={14} />Back to Pickups
      </Link>

      <div className='flex items-start justify-between mb-6'>
        <div>
          <h1 className='text-h3'>Pickup</h1>
          <p className='text-xs text-neutral-400 mt-0.5'>#{p.id}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-5'>
          <PickupTracker status={p.status} />
          <PickupMap pickupLocation={pickupLoc} />
          {showProof && (
            <ProofUpload pickupId={p.id} onSubmit={handleProof} />
          )}
        </div>

        <div className='space-y-5'>
          <div className='card space-y-3'>
            <h3 className='text-h6'>Pickup Details</h3>
            <div className='flex items-center gap-2.5'>
              <Clock size={14} className='text-neutral-400 shrink-0' />
              <div>
                <p className='text-xs text-neutral-400'>Scheduled for</p>
                <p className='text-sm font-medium text-neutral-700'>{fmt(p.scheduled_time)}</p>
              </div>
            </div>
          </div>

          {driver ? (
            <div className='card space-y-3'>
              <h3 className='text-h6'>Your Driver</h3>
              <div className='flex items-center gap-3'>
                <span className='w-11 h-11 rounded-full bg-primary-light flex items-center justify-center shrink-0'>
                  <Truck size={18} className='text-primary' />
                </span>
                <div>
                  <p className='text-sm font-semibold text-neutral-700'>{driver.name}</p>
                  <p className='text-xs text-neutral-500'>{driver.vehicle} · {driver.license_plate}</p>
                </div>
              </div>
              <a
                href={`tel:${driver.phone}`}
                className='btn-tertiary w-full text-sm'
              >
                <Phone size={14} />{driver.phone}
              </a>
            </div>
          ) : showAssign ? (
            <DriverAssignment pickupId={p.id} />
          ) : (
            <div className='card'>
              <p className='text-sm text-neutral-500 text-center py-4'>
                No driver assigned yet. The recycler will assign one shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
