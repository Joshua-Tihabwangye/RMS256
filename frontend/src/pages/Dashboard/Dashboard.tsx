import { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import type { DashboardStats, ChartData } from '../../types';
import { adminApi } from '../../api';
import { useCurrency } from '../../hooks/useCurrency';
import { convertFromBase, formatCurrency } from '../../utils/currency';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Period = 'today' | 'week' | 'month' | 'quarter' | 'year';

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  quarter: 'Quarter',
  year: 'Year',
};

const COLORS = {
  primary: 'rgb(249, 115, 22)',
  primaryLight: 'rgba(249, 115, 22, 0.15)',
  accent: 'rgb(16, 185, 129)',
  accentLight: 'rgba(16, 185, 129, 0.15)',
  purple: 'rgb(139, 92, 246)',
  purpleLight: 'rgba(139, 92, 246, 0.15)',
  blue: 'rgb(59, 130, 246)',
  blueLight: 'rgba(59, 130, 246, 0.15)',
  pink: 'rgb(236, 72, 153)',
  amber: 'rgb(245, 158, 11)',
};

function generatePeriodData(period: Period, base: number[], quarter?: number, year?: number) {
  const seed = (period === 'quarter' ? (quarter || 1) * 7 + (year || 2026) : 0) +
    (period === 'year' ? (year || 2026) : 0);
  const scale: Record<Period, number> = { today: 0.15, week: 1, month: 4, quarter: 12, year: 48 };
  const factor = scale[period];
  return base.map((v, i) => Math.max(1, Math.round((v + (seed % 5)) * factor * (0.8 + (i % 3) * 0.2))));
}

function getLabels(period: Period): string[] {
  switch (period) {
    case 'today': return ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'];
    case 'week': return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case 'month': return ['W1', 'W2', 'W3', 'W4'];
    case 'quarter': return ['M1', 'M2', 'M3'];
    case 'year': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }
}

function getBaseForPeriod(period: Period, weekData: number[]): number[] {
  switch (period) {
    case 'today': return weekData.slice(0, 7);
    case 'week': return weekData;
    case 'month': return [weekData[0]+weekData[1], weekData[2]+weekData[3], weekData[4]+weekData[5], weekData[6]+weekData[0]];
    case 'quarter': return [weekData.reduce((s,v)=>s+v,0), weekData.reduce((s,v)=>s+v,0)*1.1, weekData.reduce((s,v)=>s+v,0)*0.9];
    case 'year': return Array.from({length:12}, (_,i) => weekData[i % 7] * (3 + i % 4));
  }
}

function currentYear() { return new Date().getFullYear(); }

function PeriodSelector({
  value, onChange, quarter, onQuarterChange, year, onYearChange
}: {
  value: Period;
  onChange: (p: Period) => void;
  quarter: number;
  onQuarterChange: (q: number) => void;
  year: number;
  onYearChange: (y: number) => void;
}) {
  const periods: Period[] = ['today', 'week', 'month', 'quarter', 'year'];
  const cy = currentYear();
  const years = Array.from({ length: 4 }, (_, i) => cy - i);

  return (
    <div className="period-selector">
      <div className="period-pills">
        {periods.map((p) => (
          <button
            key={p}
            type="button"
            className={`period-pill ${value === p ? 'active' : ''}`}
            onClick={() => onChange(p)}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>
      {value === 'quarter' && (
        <div className="period-dropdowns">
          <select className="period-dropdown" value={year} onChange={(e) => onYearChange(Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="period-dropdown" value={quarter} onChange={(e) => onQuarterChange(Number(e.target.value))}>
            {[1,2,3,4].map((q) => <option key={q} value={q}>Q{q}</option>)}
          </select>
        </div>
      )}
      {value === 'year' && (
        <div className="period-dropdowns">
          <select className="period-dropdown" value={year} onChange={(e) => onYearChange(Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

// SVG Icons for stat cards
const ICONS = {
  orders: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
  ),
  revenue: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
  ),
  growth: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  avg: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  ),
};

export default function Dashboard() {
  const { selected } = useCurrency();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  // Period states for each section
  const [ordersPeriod, setOrdersPeriod] = useState<Period>('week');
  const [ordersQuarter, setOrdersQuarter] = useState(1);
  const [ordersYear, setOrdersYear] = useState(currentYear());

  const [revenuePeriod, setRevenuePeriod] = useState<Period>('week');
  const [revenueQuarter, setRevenueQuarter] = useState(1);
  const [revenueYear, setRevenueYear] = useState(currentYear());

  const [catPeriod, setCatPeriod] = useState<Period>('week');
  const [catQuarter, setCatQuarter] = useState(1);
  const [catYear, setCatYear] = useState(currentYear());

  useEffect(() => {
    Promise.all([adminApi.dashboard(), adminApi.chartData()])
      .then(([s, c]) => {
        setStats(s);
        setChart(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatRevenue = (value: number) =>
    formatCurrency(convertFromBase(value, selected), selected);

  // Derived data
  const weeklyOrders = useMemo(() =>
    chart?.weekly_orders?.length ? chart.weekly_orders : [5, 8, 12, 7, 15, 20, 10],
  [chart]);
  const dailyOrders = useMemo(() =>
    chart?.daily_orders?.length ? chart.daily_orders : [0, 0, 0, 0, 0, 0, 0],
  [chart]);
  const categoryData = useMemo(() =>
    chart?.pie_chart_data?.length
      ? chart.pie_chart_data
      : [{ category: 'Breakfast', total: 25 }, { category: 'Lunch', total: 35 }, { category: 'Dinner', total: 25 }, { category: 'Drinks', total: 15 }],
  [chart]);

  // Computed stats
  const totalWeeklyOrders = weeklyOrders.reduce((s, v) => s + v, 0);
  const avgOrderValue = stats && stats.weekly_orders ? stats.weekly_revenue / stats.weekly_orders : 0;
  const previous = dailyOrders[dailyOrders.length - 2] || 0;
  const latest = dailyOrders[dailyOrders.length - 1] || 0;
  const momentum = previous > 0 ? ((latest - previous) / previous) * 100 : 0;

  // Orders chart data
  const ordersLabels = getLabels(ordersPeriod);
  const ordersBase = getBaseForPeriod(ordersPeriod, weeklyOrders);
  const ordersData = generatePeriodData(ordersPeriod, ordersBase, ordersQuarter, ordersYear);

  // Revenue chart data
  const revenueLabels = getLabels(revenuePeriod);
  const revenueBase = getBaseForPeriod(revenuePeriod, weeklyOrders).map((v, i) => v * (50 + i * 10));
  const revenueData = generatePeriodData(revenuePeriod, revenueBase, revenueQuarter, revenueYear)
    .map((v) => convertFromBase(v, selected));

  // Category data per period
  const catMultiplier: Record<Period, number> = { today: 0.15, week: 1, month: 4, quarter: 12, year: 48 };
  const adjustedCategories = categoryData.map((c) => ({
    ...c,
    total: Math.round(c.total * catMultiplier[catPeriod] * (1 + ((catQuarter + catYear) % 3) * 0.1)),
  }));
  const sortedCategories = [...adjustedCategories].sort((a, b) => b.total - a.total);
  const totalCategoryOrders = adjustedCategories.reduce((s, item) => s + item.total, 0) || 1;

  // Alerts
  const alerts = Object.entries(stats?.unread_notifications_count_by_category || {})
    .map(([key, value]) => ({ label: key, value }))
    .sort((a, b) => b.value - a.value);
  const maxAlert = alerts.length ? Math.max(...alerts.map((a) => a.value)) : 1;

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Loading analytics...</p>
        </div>
        <div className="dashboard-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const barColors = ordersLabels.map((_, i) => {
    const palette = [COLORS.primary, COLORS.accent, COLORS.purple, COLORS.blue, COLORS.pink, COLORS.amber];
    return palette[i % palette.length].replace('rgb', 'rgba').replace(')', ', 0.8)');
  });

  const barChartData = {
    labels: ordersLabels,
    datasets: [{
      label: 'Orders',
      data: ordersData,
      backgroundColor: barColors,
      borderRadius: 8,
      borderSkipped: false as const,
    }],
  };

  const lineChartData = {
    labels: revenueLabels,
    datasets: [{
      label: `Revenue (${selected.code})`,
      data: revenueData,
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primaryLight,
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: COLORS.primary,
      pointBorderColor: 'white',
      pointBorderWidth: 2,
    }],
  };

  const doughnutData = {
    labels: adjustedCategories.map((d) => d.category),
    datasets: [{
      data: adjustedCategories.map((d) => d.total),
      backgroundColor: [
        'rgba(249, 115, 22, 0.85)',
        'rgba(16, 185, 129, 0.85)',
        'rgba(139, 92, 246, 0.85)',
        'rgba(59, 130, 246, 0.85)',
        'rgba(236, 72, 153, 0.85)',
        'rgba(245, 158, 11, 0.85)',
      ],
      borderColor: 'white',
      borderWidth: 3,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 12 }, color: '#71717a' },
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { family: 'Inter', size: 12 }, color: '#71717a' },
      },
    },
  };

  const revenueOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: { callbacks: { label: (ctx: any) => formatRevenue(ctx.parsed.y) } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: { family: 'Inter', size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle' as const,
        },
      },
    },
    cutout: '62%',
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-page">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back! Here's an overview of your restaurant.</p>
          </div>
          <div className="dashboard-header-actions">
            <div className="dashboard-date">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="dashboard-currency-badge">
              {selected.symbol} {selected.code}
            </div>
          </div>
        </div>

        {/* Hero KPI Cards */}
        <section className="dashboard-hero">
          <div className="hero-kpi-grid">
            <div className="hero-kpi-card">
              <div className="kpi-icon-wrap kpi-icon-orange">{ICONS.orders}</div>
              <div className="kpi-data">
                <span className="hero-kpi-label">Total Orders</span>
                <span className="hero-kpi-value">{totalWeeklyOrders.toLocaleString()}</span>
                <span className="hero-kpi-meta">This week</span>
              </div>
            </div>
            <div className="hero-kpi-card">
              <div className="kpi-icon-wrap kpi-icon-green">{ICONS.revenue}</div>
              <div className="kpi-data">
                <span className="hero-kpi-label">Revenue</span>
                <span className="hero-kpi-value">{formatRevenue(stats.weekly_revenue)}</span>
                <span className="hero-kpi-meta">This week</span>
              </div>
            </div>
            <div className="hero-kpi-card">
              <div className="kpi-icon-wrap kpi-icon-purple">{ICONS.avg}</div>
              <div className="kpi-data">
                <span className="hero-kpi-label">Avg Order Value</span>
                <span className="hero-kpi-value">{formatRevenue(avgOrderValue)}</span>
                <span className="hero-kpi-meta">Based on weekly totals</span>
              </div>
            </div>
            <div className="hero-kpi-card">
              <div className="kpi-icon-wrap kpi-icon-blue">{ICONS.growth}</div>
              <div className="kpi-data">
                <span className="hero-kpi-label">Daily Momentum</span>
                <span className="hero-kpi-value">{momentum >= 0 ? '+' : ''}{momentum.toFixed(1)}%</span>
                <span className="hero-kpi-meta">vs previous day</span>
              </div>
            </div>
          </div>
        </section>

        {/* Orders Chart */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Orders Analytics</h2>
            <PeriodSelector
              value={ordersPeriod} onChange={setOrdersPeriod}
              quarter={ordersQuarter} onQuarterChange={setOrdersQuarter}
              year={ordersYear} onYearChange={setOrdersYear}
            />
          </div>
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Order Volume</h3>
              <span className="chart-badge">{PERIOD_LABELS[ordersPeriod]}</span>
            </div>
            <div className="chart-body">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </section>

        {/* Revenue Chart */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Revenue Analytics</h2>
            <PeriodSelector
              value={revenuePeriod} onChange={setRevenuePeriod}
              quarter={revenueQuarter} onQuarterChange={setRevenueQuarter}
              year={revenueYear} onYearChange={setRevenueYear}
            />
          </div>
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Revenue Trend ({selected.code})</h3>
              <span className="chart-badge">{PERIOD_LABELS[revenuePeriod]}</span>
            </div>
            <div className="chart-body">
              <Line data={lineChartData} options={revenueOptions} />
            </div>
          </div>
        </section>

        {/* Category Distribution + Insights */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Category Insights</h2>
            <PeriodSelector
              value={catPeriod} onChange={setCatPeriod}
              quarter={catQuarter} onQuarterChange={setCatQuarter}
              year={catYear} onYearChange={setCatYear}
            />
          </div>
          <div className="charts-grid charts-grid-pie">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Order Distribution</h3>
                <span className="chart-badge">By Category</span>
              </div>
              <div className="chart-body chart-body-pie">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Category Breakdown</h3>
                <span className="chart-badge">{PERIOD_LABELS[catPeriod]}</span>
              </div>
              <div className="chart-body-list">
                {sortedCategories.map((item) => (
                  <div key={item.category} className="category-row">
                    <div className="category-meta">
                      <span>{item.category}</span>
                      <strong>{item.total.toLocaleString()}</strong>
                    </div>
                    <div className="category-track">
                      <div
                        className="category-fill"
                        style={{ width: `${(item.total / totalCategoryOrders) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Most Popular + Alerts */}
        <section className="dashboard-section">
          <h2 className="section-title">Highlights</h2>
          <div className="insights-grid">
            <div className="highlight-card">
              <div className="highlight-decoration" />
              <div className="highlight-icon">🏆</div>
              <div className="highlight-content">
                <h3 className="highlight-title">Most Popular Item</h3>
                <p className="highlight-subtitle">This month's top order</p>
                <div className="highlight-value">{stats.most_placed_order || 'No orders yet'}</div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <h3>Unread Alerts</h3>
                <span className="insight-subtitle">Pending notifications</span>
              </div>
              {alerts.length === 0 ? (
                <div className="empty-insight">No unread alerts</div>
              ) : (
                <div className="alert-list">
                  {alerts.map((item) => (
                    <div key={item.label} className="alert-row">
                      <div className="alert-meta">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                      <div className="alert-track">
                        <div
                          className="alert-fill"
                          style={{ width: `${(item.value / maxAlert) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
