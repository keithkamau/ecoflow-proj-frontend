import { Clock, Truck, MapPin, CheckCircle } from 'lucide-react';

const STEPS = [
  { key: 'scheduled',  label: 'Scheduled',  desc: 'Pickup confirmed & queued',   Icon: Clock       },
  { key: 'on_the_way', label: 'On the Way',  desc: 'Driver is en route to you',  Icon: Truck       },
  { key: 'arrived',    label: 'Arrived',     desc: 'Driver is at your location', Icon: MapPin      },
  { key: 'completed',  label: 'Completed',   desc: 'Pickup successfully done',   Icon: CheckCircle },
];

const ORDER = ['scheduled', 'on_the_way', 'arrived', 'completed'];

const PickupTracker = ({ status = 'scheduled' }) => {
  const currentIdx = ORDER.indexOf(status);

  return (
    <div className='card' data-testid='pickup-tracker'>
      <h3 className='text-h5 mb-5'>Pickup Status</h3>

      <div className='relative'>
        {/* Grey connector line */}
        <div className='absolute left-5 top-5 bottom-5 w-0.5 bg-neutral-200' aria-hidden='true' />
        {/* Green progress fill */}
        <div
          className='absolute left-5 top-5 w-0.5 bg-primary transition-all duration-700'
          style={{ height: currentIdx > 0 ? `${(currentIdx / (STEPS.length - 1)) * 100}%` : '0%' }}
          aria-hidden='true'
        />

        <ol className='relative space-y-6' aria-label='Pickup progress'>
          {STEPS.map((step, idx) => {
            const done   = idx < currentIdx;
            const active = idx === currentIdx;
            const Icon   = step.Icon;

            return (
              <li key={step.key} className='flex items-start gap-4'>
                {/* Step dot */}
                <span
                  className={[
                    'relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 border-2 transition-all duration-300',
                    done   ? 'bg-primary border-primary text-white'         : '',
                    active ? 'bg-primary-light border-primary text-primary' : '',
                    !done && !active ? 'bg-white border-neutral-300 text-neutral-400' : '',
                  ].filter(Boolean).join(' ')}
                  aria-hidden='true'
                >
                  <Icon size={16} />
                </span>

                {/* Step text */}
                <div className='pt-2 flex-1'>
                  <p className={`text-sm font-semibold ${active ? 'text-primary' : done ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${active || done ? 'text-neutral-500' : 'text-neutral-300'}`}>
                    {step.desc}
                  </p>
                </div>

                {active && <span className='mt-2 badge-active text-xs shrink-0'>Current</span>}
                {done   && <CheckCircle size={14} className='text-primary mt-3 shrink-0' />}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default PickupTracker;
