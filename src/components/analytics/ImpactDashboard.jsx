import { useEffect, useState } from 'react';
import { Leaf, Wind, TreePine, Banknote } from 'lucide-react';
import { getImpact } from '../../services/analyticsService';

const STATS = [
  {
    key: 'total_kg_recycled',
    label: 'Waste Recycled',
    unit: 'kg',
    Icon: Leaf,
    accent: 'border-l-primary',
    iconBg: 'bg-primary-light',
    iconColor: 'text-primary',
    valueColor: 'text-primary',
  },
  {
    key: 'co2_saved_kg',
    label: 'CO₂ Saved',
    unit: 'kg',
    Icon: Wind,
    accent: 'border-l-primary',
    iconBg: 'bg-primary-light',
    iconColor: 'text-primary',
    valueColor: 'text-primary',
  },
  {
    key: 'trees_equivalent',
    label: 'Trees Equivalent',
    unit: 'trees',
    Icon: TreePine,
    accent: 'border-l-primary',
    iconBg: 'bg-primary-light',
    iconColor: 'text-primary',
    valueColor: 'text-primary',
  },
  {
    key: 'total_earnings_kes',
    label: 'Total Earnings',
    unit: 'KES',
    unitPrefix: true,
    Icon: Banknote,
    accent: 'border-l-secondary',
    iconBg: 'bg-secondary-light',
    iconColor: 'text-secondary',
    valueColor: 'text-secondary',
  },
];

const ImpactDashboard = () => {
  const [impact,  setImpact]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImpact()
      .then(setImpact)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4' data-testid='impact-dashboard'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='card animate-pulse h-28' />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4' data-testid='impact-dashboard'>
      {STATS.map(({ key, label, unit, unitPrefix, Icon, accent, iconBg, iconColor, valueColor }) => {
        const raw       = impact?.[key] ?? 0;
        const formatted = key === 'total_earnings_kes'
          ? raw.toLocaleString('en-KE')
          : raw.toLocaleString();

        return (
          <div key={key} className={`card border-l-4 ${accent} flex flex-col gap-3`}>
            <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon size={16} className={iconColor} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${valueColor} leading-tight`}>
                {unitPrefix && <span className='text-sm mr-0.5 font-semibold'>{unit} </span>}
                {formatted}
                {!unitPrefix && unit && <span className='text-sm ml-1 font-medium text-neutral-500'>{unit}</span>}
              </p>
              <p className='text-xs text-neutral-500 mt-1'>{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImpactDashboard;
