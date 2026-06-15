import { useState } from 'react';
import { Calendar, Clock, MapPin, FileText, AlertCircle } from 'lucide-react';
import { ButtonSpinner } from '../common/LoadingSpinner';

const TIME_SLOTS = [
  { value: '08:00', label: '8:00 AM – 10:00 AM (Morning)' },
  { value: '10:00', label: '10:00 AM – 12:00 PM (Late Morning)' },
  { value: '13:00', label: '1:00 PM – 3:00 PM (Afternoon)' },
  { value: '15:00', label: '3:00 PM – 5:00 PM (Late Afternoon)' },
];

const todayStr = () => new Date().toISOString().split('T')[0];

const PickupScheduler = ({ transactionId, onScheduled }) => {
  const [form, setForm] = useState({ date: '', time: '', address: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.date)           e.date    = 'Please select a date';
    if (!form.time)           e.time    = 'Please choose a time slot';
    if (!form.address.trim()) e.address = 'Pickup address is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await onScheduled?.({
        transaction_id: transactionId,
        scheduled_time: `${form.date}T${form.time}:00Z`,
        pickup_location: { address: form.address },
        notes: form.notes,
      });
      setSuccess(true);
      setForm({ date: '', time: '', address: '', notes: '' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className='card text-center py-8' data-testid='pickup-scheduler'>
        <div className='w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3'>
          <Calendar size={24} className='text-primary' />
        </div>
        <h3 className='text-h5 mb-1' style={{ color: 'var(--color-primary)' }}>Pickup Scheduled!</h3>
        <p className='text-sm text-neutral-500'>Your driver will be notified and arrive at the selected time slot.</p>
        <button className='btn-ghost mt-4 text-sm' onClick={() => setSuccess(false)}>Schedule another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='card space-y-4' data-testid='pickup-scheduler' noValidate>
      <h3 className='text-h5'>Schedule a Pickup</h3>

      {/* Date */}
      <div>
        <label className='label' htmlFor='pickup-date'>
          <Calendar size={13} className='inline mr-1' />Pickup Date
        </label>
        <input
          id='pickup-date'
          type='date'
          min={todayStr()}
          value={form.date}
          onChange={set('date')}
          className={`input ${errors.date ? 'input-error' : ''}`}
          aria-describedby={errors.date ? 'date-err' : undefined}
        />
        {errors.date && (
          <p id='date-err' className='error-text flex items-center gap-1'>
            <AlertCircle size={11} />{errors.date}
          </p>
        )}
      </div>

      {/* Time slot */}
      <div>
        <label className='label' htmlFor='pickup-time'>
          <Clock size={13} className='inline mr-1' />Time Slot
        </label>
        <select
          id='pickup-time'
          value={form.time}
          onChange={set('time')}
          className={`input ${errors.time ? 'input-error' : ''}`}
          aria-describedby={errors.time ? 'time-err' : undefined}
        >
          <option value=''>Select a time slot…</option>
          {TIME_SLOTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {errors.time && (
          <p id='time-err' className='error-text flex items-center gap-1'>
            <AlertCircle size={11} />{errors.time}
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className='label' htmlFor='pickup-address'>
          <MapPin size={13} className='inline mr-1' />Pickup Address
        </label>
        <input
          id='pickup-address'
          type='text'
          placeholder='e.g. 45 Ngong Road, Nairobi'
          value={form.address}
          onChange={set('address')}
          className={`input ${errors.address ? 'input-error' : ''}`}
          aria-describedby={errors.address ? 'addr-err' : undefined}
        />
        {errors.address && (
          <p id='addr-err' className='error-text flex items-center gap-1'>
            <AlertCircle size={11} />{errors.address}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className='label' htmlFor='pickup-notes'>
          <FileText size={13} className='inline mr-1' />Special Instructions (optional)
        </label>
        <textarea
          id='pickup-notes'
          rows={3}
          placeholder='Gate code, contact number, access notes…'
          value={form.notes}
          onChange={set('notes')}
          className='input h-auto py-2 resize-none'
        />
      </div>

      <button type='submit' className='btn-primary w-full' disabled={submitting}>
        {submitting ? <><ButtonSpinner />Scheduling…</> : 'Confirm Pickup'}
      </button>
    </form>
  );
};

export default PickupScheduler;
