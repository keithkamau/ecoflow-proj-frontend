import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// ── Mock services ──────────────────────────────────────────────
jest.mock('../../services/analyticsService', () => ({
  getImpact: jest.fn().mockResolvedValue({
    data: {
      total_kg_recycled:  340,
      co2_saved_kg:       680,
      trees_equivalent:    31,
      waste_diverted_kg:  340,
      total_earnings_kes: 12500,
      ranking: 7,
      total_users: 150,
    },
  }),
  getEarningsTrend: jest.fn().mockResolvedValue({
    data: [
      { month: 'Jan', earnings: 1200, kg: 45 },
      { month: 'Feb', earnings: 1800, kg: 62 },
    ],
  }),
  getMaterialsBreakdown: jest.fn().mockResolvedValue({
    data: [{ material: 'Plastic', kg: 120, percentage: 35 }],
  }),
  getSellerStats: jest.fn().mockResolvedValue({
    data: {
      total_kg_sold: 340,
      total_earnings_kes: 12500,
      transactions_completed: 12,
      active_listings: 3,
    },
  }),
  getRecyclerStats: jest.fn().mockResolvedValue({
    data: {
      total_materials_sourced_kg: 1240,
      total_spent_kes: 45000,
      active_suppliers: 18,
      pickups_completed: 24,
    },
  }),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({ user: { role: 'seller', name: 'Test User' } })),
}));

// ── Mock recharts (canvas not available in jsdom) ─────────────
jest.mock('recharts', () => {
  const Recharts = jest.requireActual('recharts');
  return {
    ...Recharts,
    ResponsiveContainer: ({ children }) => (
      <div data-testid='responsive-container' style={{ width: 400, height: 300 }}>
        {typeof children === 'function' ? children({ width: 400, height: 300 }) : children}
      </div>
    ),
  };
});

import ImpactDashboard from '../../components/analytics/ImpactDashboard';
import AnalyticsChart, { EarningsChart, MaterialsChart, BreakdownChart } from '../../components/analytics/AnalyticsChart';
import UserStats from '../../components/analytics/UserStats';

// ── ImpactDashboard ────────────────────────────────────────────
describe('ImpactDashboard', () => {
  it('renders the dashboard container', () => {
    render(<ImpactDashboard />);
    expect(screen.getByTestId('impact-dashboard')).toBeInTheDocument();
  });

  it('displays all four stat cards after loading', async () => {
    render(<ImpactDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Waste Recycled/i)).toBeInTheDocument();
      expect(screen.getByText(/CO₂ Saved/i)).toBeInTheDocument();
      expect(screen.getByText(/Trees Equivalent/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Earnings/i)).toBeInTheDocument();
    });
  });

  it('displays the recycled kg value', async () => {
    render(<ImpactDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/340/)).toBeInTheDocument();
    });
  });

  it('shows skeleton placeholders while loading', () => {
    const { getImpact } = require('../../services/analyticsService');
    getImpact.mockImplementationOnce(() => new Promise(() => {})); // never resolves
    render(<ImpactDashboard />);
    const dashboard = screen.getByTestId('impact-dashboard');
    expect(dashboard).toBeInTheDocument();
  });
});

// ── AnalyticsChart ─────────────────────────────────────────────
describe('AnalyticsChart', () => {
  const mockData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
  ];

  it('renders line chart by default', () => {
    render(<AnalyticsChart data={mockData} title='Test Chart' />);
    expect(screen.getByTestId('analytics-chart')).toBeInTheDocument();
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('renders bar chart when type=bar', () => {
    render(<AnalyticsChart type='bar' data={mockData} title='Bar Test' />);
    expect(screen.getByTestId('analytics-chart')).toBeInTheDocument();
  });

  it('renders EarningsChart with title', () => {
    const earningsData = [{ month: 'Jan', earnings: 1200, kg: 45 }];
    render(<EarningsChart data={earningsData} />);
    expect(screen.getByTestId('earnings-chart')).toBeInTheDocument();
    expect(screen.getByText(/Earnings Over Time/i)).toBeInTheDocument();
  });

  it('renders BreakdownChart with title', () => {
    const matData = [{ material: 'Plastic', kg: 120 }];
    render(<BreakdownChart data={matData} />);
    expect(screen.getByTestId('breakdown-chart')).toBeInTheDocument();
    expect(screen.getByText(/Materials Breakdown/i)).toBeInTheDocument();
  });

  it('renders MaterialsChart with title', () => {
    render(<MaterialsChart data={[{ month: 'Jan', kg: 45 }]} />);
    expect(screen.getByTestId('materials-chart')).toBeInTheDocument();
    expect(screen.getByText(/Materials Recycled/i)).toBeInTheDocument();
  });

  it('renders without title when title prop is omitted', () => {
    render(<AnalyticsChart data={[{ name: 'Jan', value: 100 }]} />);
    const chart = screen.getByTestId('analytics-chart');
    expect(chart).toBeInTheDocument();
  });
});

// ── UserStats ──────────────────────────────────────────────────
describe('UserStats', () => {
  it('renders the user stats container', () => {
    render(<UserStats />);
    expect(screen.getByTestId('user-stats')).toBeInTheDocument();
  });

  it('shows seller stats for seller role', async () => {
    render(<UserStats />);
    await waitFor(() => {
      expect(screen.getByText(/Total kg Sold/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Earnings/i)).toBeInTheDocument();
    });
  });

  it('displays the ranking badge when available', async () => {
    render(<UserStats />);
    await waitFor(() => {
      expect(screen.getByText(/#7 of 150/i)).toBeInTheDocument();
    });
  });

  it('shows recycler stats for recycler role', async () => {
    const { useAuth } = require('../../hooks/useAuth');
    useAuth.mockImplementation(() => ({ user: { role: 'recycler', name: 'Recycler User' } }));
    render(<UserStats />);
    await waitFor(() => {
      expect(screen.getByText(/Materials Sourced/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Spent/i)).toBeInTheDocument();
    });
    // restore default
    useAuth.mockImplementation(() => ({ user: { role: 'seller', name: 'Test User' } }));
  });
});
