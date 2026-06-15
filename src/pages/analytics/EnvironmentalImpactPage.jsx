import { useEffect, useState } from 'react';
import { Leaf, Wind, TreePine, Award, Star, Target, Zap, Globe } from 'lucide-react';
import ImpactDashboard from '../../components/analytics/ImpactDashboard';
import { EarningsChart } from '../../components/analytics/AnalyticsChart';
import { getImpact, getEarningsTrend } from '../../services/analyticsService';

// ── Gamification badge definitions ────────────────────────────
const BADGES = [
  {
    id: 'first_sale',
    label: 'First Sale',
    desc: 'Completed your first transaction',
    Icon: Star,
    threshold: (imp) => imp?.total_kg_recycled > 0,
    color: '#F97316',   // secondary orange
    bg: 'bg-secondary-light',
    ring: 'ring-secondary',
  },
  {
    id: 'green_starter',
    label: 'Green Starter',
    desc: 'Recycled your first 10 kg',
    Icon: Leaf,
    threshold: (imp) => (imp?.total_kg_recycled ?? 0) >= 10,
    color: '#10B981',
    bg: 'bg-primary-light',
    ring: 'ring-primary',
  },
  {
    id: 'century',
    label: 'Century',
    desc: 'Recycled 100 kg of waste',
    Icon: Target,
    threshold: (imp) => (imp?.total_kg_recycled ?? 0) >= 100,
    color: '#10B981',
    bg: 'bg-primary-light',
    ring: 'ring-primary',
  },
  {
    id: 'eco_champion',
    label: 'Eco Champion',
    desc: 'Recycled 500 kg of waste',
    Icon: Award,
    threshold: (imp) => (imp?.total_kg_recycled ?? 0) >= 500,
    color: '#10B981',
    bg: 'bg-primary-light',
    ring: 'ring-primary',
  },
  {
    id: 'carbon_cutter',
    label: 'Carbon Cutter',
    desc: 'Saved 100 kg of CO₂',
    Icon: Wind,
    threshold: (imp) => (imp?.co2_saved_kg ?? 0) >= 100,
    color: '#3B82F6',
    bg: 'bg-info-light',
    ring: 'ring-info',
  },
  {
    id: 'tree_friend',
    label: 'Tree Friend',
    desc: 'Equal to planting 10 trees',
    Icon: TreePine,
    threshold: (imp) => (imp?.trees_equivalent ?? 0) >= 10,
    color: '#10B981',
    bg: 'bg-primary-light',
    ring: 'ring-primary',
  },
  {
    id: 'electric',
    label: 'Electrified',
    desc: 'Recycled 1,000 kg of waste',
    Icon: Zap,
    threshold: (imp) => (imp?.total_kg_recycled ?? 0) >= 1000,
    color: '#F97316',
    bg: 'bg-secondary-light',
    ring: 'ring-secondary',
  },
  {
    id: 'planet_hero',
    label: 'Planet Hero',
    desc: 'Saved 500 kg of CO₂',
    Icon: Globe,
    threshold: (imp) => (imp?.co2_saved_kg ?? 0) >= 500,
    color: '#3B82F6',
    bg: 'bg-info-light',
    ring: 'ring-info',
  },
];

// ── Badge card ─────────────────────────────────────────────────
const BadgeCard = ({ badge, earned }) => {
  const { label, desc, Icon, bg, color } = badge;
  return (
    <div
      className={[
        'card flex flex-col items-center text-center gap-2 py-5 transition-all duration-300',
        earned ? '' : 'opacity-40 grayscale',
      ].join(' ')}
    >
      <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center`}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className='text-sm font-semibold text-neutral-700'>{label}</p>
        <p className='text-xs text-neutral-400 mt-0.5'>{desc}</p>
      </div>
      {earned
        ? <span className='badge-active text-xs'>Earned</span>
        : <span className='badge-neutral text-xs'>Locked</span>}
    </div>
  );
};

const EnvironmentalImpactPage = () => {
  const [impact,   setImpact]   = useState(null);
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    getImpact().then(({ data }) => setImpact(data));
    getEarningsTrend().then(({ data }) => setEarnings(data));
  }, []);

  return (
    <div className='page-content animate-fade-in'>
      {/* ── Header ──────────────────────────────────────── */}
      <div className='section-header'>
        <div className='flex items-center gap-3'>
          <span className='flex items-center justify-center w-10 h-10 rounded-full bg-primary-light'>
            <Leaf size={20} className='text-primary' />
          </span>
          <div>
            <h1 className='text-h3'>My Impact</h1>
            <p className='text-xs text-neutral-500 mt-0.5'>Your environmental contribution at a glance</p>
          </div>
        </div>
      </div>

      {/* ── Big stats ───────────────────────────────────── */}
      <section className='mb-8'>
        <ImpactDashboard />
      </section>

      {/* ── Context callout ─────────────────────────────── */}
      {impact && (
        <div className='card-accent mb-8 flex items-start gap-4'>
          <Globe size={20} className='text-primary shrink-0 mt-0.5' />
          <div>
            <p className='text-sm font-semibold text-neutral-700'>Your contribution matters</p>
            <p className='text-sm text-neutral-500 mt-0.5'>
              By recycling <strong>{impact.total_kg_recycled} kg</strong> of waste, you have prevented{' '}
              <strong>{impact.co2_saved_kg} kg of CO₂</strong> emissions — equivalent to planting{' '}
              <strong>{impact.trees_equivalent} trees</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ── Impact over time ────────────────────────────── */}
      <section className='mb-10'>
        <h2 className='text-h5 mb-4'>Impact Growth</h2>
        <EarningsChart data={earnings} />
      </section>

      {/* ── Gamification badges ─────────────────────────── */}
      <section>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-h5'>Achievements</h2>
          <span className='text-sm text-neutral-500'>
            {BADGES.filter((b) => b.threshold(impact)).length}/{BADGES.length} earned
          </span>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {BADGES.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={badge.threshold(impact)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default EnvironmentalImpactPage;
