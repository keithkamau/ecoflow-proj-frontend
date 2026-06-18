import { useEffect, useState } from 'react';
import { Leaf, Wind, TreePine, Award, Star, Target, Zap, Globe, TrendingUp } from 'lucide-react';
import ImpactDashboard from '../../components/analytics/ImpactDashboard';
import { EarningsChart } from '../../components/analytics/AnalyticsChart';
import { getImpact, getEarningsTrend } from '../../services/analyticsService';

const BADGES = [
  {
    id: 'first_sale',
    label: 'First Sale',
    desc: 'Complete your first transaction',
    Icon: Star,
    threshold: (imp) => imp?.total_kg_recycled > 0,
    progress: (imp) => imp?.total_kg_recycled > 0 ? 100 : Math.min((imp?.total_kg_recycled ?? 0) / 1 * 100, 99),
    color: '#F97316',
    bg: 'bg-secondary-light',
    ring: 'ring-secondary',
  },
  {
    id: 'green_starter',
    label: 'Green Starter',
    desc: 'Recycle 10 kg of waste',
    Icon: Leaf,
    threshold: (imp) => (imp?.total_kg_recycled ?? 0) >= 10,
    progress: (imp) => Math.min((imp?.total_kg_recycled ?? 0) / 10 * 100, 100),
    color: '#10B981',
    bg: 'bg-primary-light',
    ring: 'ring-primary',
    max: 10,
  },
  {
    id: 'century',
    label: 'Century',
    desc: 'Recycle 100 kg of waste',
    Icon: Target,
    threshold: (imp) => (imp?.total_kg_recycled ?? 0) >= 100,
    progress: (imp) => Math.min((imp?.total_kg_recycled ?? 0) / 100 * 100, 100),
    color: '#10B981',
    bg: 'bg-primary-light',
    ring: 'ring-primary',
    max: 100,
  },
  {
    id: 'eco_champion',
    label: 'Eco Champion',
    desc: 'Recycle 500 kg of waste',
    Icon: Award,
    threshold: (imp) => (imp?.total_kg_recycled ?? 0) >= 500,
    progress: (imp) => Math.min((imp?.total_kg_recycled ?? 0) / 500 * 100, 100),
    color: '#10B981',
    bg: 'bg-primary-light',
    ring: 'ring-primary',
    max: 500,
  },
  {
    id: 'carbon_cutter',
    label: 'Carbon Cutter',
    desc: 'Save 100 kg of CO2',
    Icon: Wind,
    threshold: (imp) => (imp?.co2_saved_kg ?? 0) >= 100,
    progress: (imp) => Math.min((imp?.co2_saved_kg ?? 0) / 100 * 100, 100),
    color: '#3B82F6',
    bg: 'bg-info-light',
    ring: 'ring-info',
    max: 100,
  },
  {
    id: 'tree_friend',
    label: 'Tree Friend',
    desc: 'Equal to planting 10 trees',
    Icon: TreePine,
    threshold: (imp) => (imp?.trees_equivalent ?? 0) >= 10,
    progress: (imp) => Math.min((imp?.trees_equivalent ?? 0) / 10 * 100, 100),
    color: '#10B981',
    bg: 'bg-primary-light',
    ring: 'ring-primary',
    max: 10,
  },
  {
    id: 'electric',
    label: 'Electrified',
    desc: 'Recycle 1,000 kg of waste',
    Icon: Zap,
    threshold: (imp) => (imp?.total_kg_recycled ?? 0) >= 1000,
    progress: (imp) => Math.min((imp?.total_kg_recycled ?? 0) / 1000 * 100, 100),
    color: '#F97316',
    bg: 'bg-secondary-light',
    ring: 'ring-secondary',
    max: 1000,
  },
  {
    id: 'planet_hero',
    label: 'Planet Hero',
    desc: 'Save 500 kg of CO2',
    Icon: Globe,
    threshold: (imp) => (imp?.co2_saved_kg ?? 0) >= 500,
    progress: (imp) => Math.min((imp?.co2_saved_kg ?? 0) / 500 * 100, 100),
    color: '#3B82F6',
    bg: 'bg-info-light',
    ring: 'ring-info',
    max: 500,
  },
];

const LEVELS = [
  { label: 'Seedling', minKg: 0, color: '#6B7280' },
  { label: 'Sprout', minKg: 10, color: '#F97316' },
  { label: 'Growing', minKg: 100, color: '#10B981' },
  { label: 'Flourishing', minKg: 500, color: '#3B82F6' },
  { label: 'Forest Guardian', minKg: 1000, color: '#8B5CF6' },
];

const BadgeCard = ({ badge, impact, index }) => {
  const earned = badge.threshold(impact);
  const pct = Math.round(badge.progress(impact));

  return (
    <div
      className={`card flex flex-col items-center text-center gap-2 py-5 transition-all duration-500 ${
        earned ? 'animate-badge-earned' : 'opacity-60 grayscale'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`w-12 h-12 rounded-full ${badge.bg} flex items-center justify-center relative`}>
        <badge.Icon size={22} style={{ color: badge.color }} />
        {earned && (
          <span className='absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center'>
            <span className='text-white text-[8px] font-bold'>✓</span>
          </span>
        )}
      </div>
      <div className='w-full'>
        <p className='text-sm font-semibold text-neutral-700'>{badge.label}</p>
        <p className='text-xs text-neutral-400 mt-0.5'>{badge.desc}</p>
      </div>
      {badge.max && (
        <div className='w-full mt-1'>
          <div className='w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden'>
            <div
              className='h-full rounded-full transition-all duration-700 ease-out'
              style={{ width: `${pct}%`, backgroundColor: badge.color }}
            />
          </div>
          <p className='text-[10px] text-neutral-400 mt-0.5'>
            {pct}%{!earned && `  (${(impact?.total_kg_recycled ?? 0).toFixed(0)}/${badge.max} kg)`}
          </p>
        </div>
      )}
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        earned ? 'bg-success-light text-success' : 'bg-neutral-100 text-neutral-400'
      }`}>
        {earned ? 'Earned' : 'Locked'}
      </span>
    </div>
  );
};

const EnvironmentalImpactPage = () => {
  const [impact,   setImpact]   = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [prevKg, setPrevKg] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    getImpact().then((data) => {
      if (prevKg > 0 && data.total_kg_recycled > prevKg) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      setPrevKg(data.total_kg_recycled);
      setImpact(data);
    });
    getEarningsTrend().then(setEarnings);
  }, []);

  const earnedCount = BADGES.filter((b) => b.threshold(impact)).length;
  const totalKg = impact?.total_kg_recycled ?? 0;
  const currentLevel = [...LEVELS].reverse().find((l) => totalKg >= l.minKg) || LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.minKg > totalKg);
  const xpToNext = nextLevel ? nextLevel.minKg - totalKg : 0;
  const levelProgress = nextLevel
    ? ((totalKg - currentLevel.minKg) / (nextLevel.minKg - currentLevel.minKg)) * 100
    : 100;

  return (
    <div className='page-content animate-fade-in'>
      {showLevelUp && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in' onClick={() => setShowLevelUp(false)}>
          <div className='bg-white rounded-2xl p-8 text-center animate-bounce-in shadow-2xl max-w-xs mx-4'>
            <div className='w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3 animate-spin-slow'>
              <TrendingUp size={32} className='text-primary' />
            </div>
            <h2 className='text-xl font-bold text-neutral-900 mb-1'>Level Up!</h2>
            <p className='text-sm text-neutral-500'>New waste recycled!</p>
          </div>
        </div>
      )}

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

      <section className='mb-8'>
        <ImpactDashboard />
      </section>

      <section className='card-accent mb-8 flex items-start gap-4'>
        <Globe size={20} className='text-primary shrink-0 mt-0.5' />
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-2'>
            <div>
              <p className='text-sm font-semibold text-neutral-700'>{currentLevel.label}</p>
              <p className='text-xs text-neutral-500'>
                {nextLevel
                  ? `${xpToNext.toFixed(0)} kg until ${nextLevel.label}`
                  : 'Maximum level reached!'}
              </p>
            </div>
            <span className='text-xs font-bold text-primary'>{totalKg.toFixed(0)} kg</span>
          </div>
          <div className='w-full bg-neutral-200 rounded-full h-2 overflow-hidden'>
            <div
              className='h-full rounded-full transition-all duration-1000 ease-out'
              style={{ width: `${levelProgress}%`, backgroundColor: currentLevel.color }}
            />
          </div>
        </div>
      </section>

      <section className='mb-10'>
        <h2 className='text-h5 mb-4'>Impact Growth</h2>
        <EarningsChart data={earnings} />
      </section>

      <section>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-h5'>Achievements</h2>
          <div className='flex items-center gap-2 text-sm text-neutral-500'>
            <span className='font-semibold text-neutral-700'>{earnedCount}</span>
            <span>/ {BADGES.length} earned</span>
          </div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {BADGES.map((badge, i) => (
            <BadgeCard key={badge.id} badge={badge} impact={impact} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default EnvironmentalImpactPage;
