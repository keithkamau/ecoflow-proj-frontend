import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = {
  primary:   '#10B981',
  secondary: '#F97316',
  info:      '#3B82F6',
  neutral:   '#9CA3AF',
};

// ── Custom tooltip ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className='card py-2 px-3 text-xs shadow-md'>
      <p className='font-semibold text-neutral-700 mb-1'>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {prefix}{p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ── Line chart: e.g. earnings over time ───────────────────────
export const EarningsChart = ({ data = [] }) => (
  <div className='card' data-testid='earnings-chart'>
    <h3 className='text-h6 mb-4'>Earnings Over Time (KES)</h3>
    <ResponsiveContainer width='100%' height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
        <XAxis dataKey='month' tick={{ fontSize: 11, fill: '#9CA3AF' }} />
        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
        <Tooltip content={<CustomTooltip prefix='KES ' />} />
        <Line
          type='monotone'
          dataKey='earnings'
          name='Earnings'
          stroke={COLORS.primary}
          strokeWidth={2.5}
          dot={{ r: 4, fill: COLORS.primary }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// ── Bar chart: kg recycled per month ─────────────────────────
export const MaterialsChart = ({ data = [] }) => (
  <div className='card' data-testid='materials-chart'>
    <h3 className='text-h6 mb-4'>Materials Recycled (kg)</h3>
    <ResponsiveContainer width='100%' height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
        <XAxis dataKey='month' tick={{ fontSize: 11, fill: '#9CA3AF' }} />
        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey='kg' name='kg' fill={COLORS.primary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ── Bar chart: materials breakdown ────────────────────────────
export const BreakdownChart = ({ data = [] }) => (
  <div className='card' data-testid='breakdown-chart'>
    <h3 className='text-h6 mb-4'>Materials Breakdown</h3>
    <ResponsiveContainer width='100%' height={220}>
      <BarChart data={data} layout='vertical' margin={{ top: 4, right: 16, bottom: 0, left: 48 }}>
        <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' horizontal={false} />
        <XAxis type='number' tick={{ fontSize: 11, fill: '#9CA3AF' }} />
        <YAxis dataKey='material' type='category' tick={{ fontSize: 11, fill: '#6B7280' }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey='kg' name='kg' fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ── Default export: generic configurable chart ────────────────
const AnalyticsChart = ({ type = 'line', data = [], title, dataKey = 'value', color }) => {
  const fill = color ?? (type === 'bar' ? COLORS.secondary : COLORS.primary);

  return (
    <div className='card' data-testid='analytics-chart'>
      {title && <h3 className='text-h6 mb-4'>{title}</h3>}
      <ResponsiveContainer width='100%' height={220}>
        {type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
            <XAxis dataKey='name' tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <Tooltip />
            <Bar dataKey={dataKey} fill={fill} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
            <XAxis dataKey='name' tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <Tooltip />
            <Line type='monotone' dataKey={dataKey} stroke={fill} strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
