import { useState, useEffect } from 'react';
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
import { Line, Bar, Pie } from 'react-chartjs-2';
import type { DashboardStats, ChartData } from '../../types';
import { adminApi } from '../../api';
import './Dashboard.css';

// Register Chart.js components
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

const STAT_CARDS = [
  { key: 'daily_orders', label: 'Daily Orders', icon: '📦', color: 'primary' },
  { key: 'weekly_orders', label: 'Weekly Orders', icon: '📊', color: 'accent' },
  { key: 'monthly_orders', label: 'Monthly Orders', icon: '📈', color: 'secondary' },
];

const REVENUE_CARDS = [
  { key: 'daily_revenue', label: 'Daily Revenue', icon: '💵', color: 'primary' },
  { key: 'weekly_revenue', label: 'Weekly Revenue', icon: '💰', color: 'accent' },
  { key: 'monthly_revenue', label: 'Monthly Revenue', icon: '🏦', color: 'secondary' },
  { key: 'yearly_revenue', label: 'Yearly Revenue', icon: '💎', color: 'cool' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.dashboard(), adminApi.chartData()])
      .then(([s, c]) => {
        setStats(s);
        setChart(c);
      })
      .finally(() => setLoading(false));
  }, []);

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

  // Charts data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const barChartData = {
    labels: weekDays,
    datasets: [
      {
        label: 'Orders',
        data: chart?.daily_orders || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(167, 139, 250, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const lineChartData = {
    labels: weekDays,
    datasets: [
      {
        label: 'Revenue ($)',
        data: chart?.weekly_orders?.map((v, i) => v * (50 + i * 10)) || [200, 350, 300, 450, 500, 600, 400],
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
      },
    ],
  };

  const pieChartData = {
    labels: chart?.pie_chart_data?.map(d => d.category) || ['Breakfast', 'Lunch', 'Dinner', 'Drinks'],
    datasets: [
      {
        data: chart?.pie_chart_data?.map(d => d.total) || [25, 35, 25, 15],
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
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12,
          },
          color: '#71717a',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12,
          },
          color: '#71717a',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: 'Inter',
            size: 12,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's an overview of your restaurant.</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Order Stats */}
      <section className="dashboard-section">
        <h2 className="section-title">📦 Orders Overview</h2>
        <div className="stats-grid">
          {STAT_CARDS.map((card) => (
            <div key={card.key} className={`stat-card ${card.color}`}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-content">
                <span className="stat-label">{card.label}</span>
                <span className="stat-value">
                  {stats[card.key as keyof DashboardStats]?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Revenue Stats */}
      <section className="dashboard-section">
        <h2 className="section-title">💰 Revenue Overview</h2>
        <div className="stats-grid stats-grid-4">
          {REVENUE_CARDS.map((card) => (
            <div key={card.key} className={`stat-card ${card.color}`}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-content">
                <span className="stat-label">{card.label}</span>
                <span className="stat-value">
                  ${(stats[card.key as keyof DashboardStats] as number)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts Row */}
      <section className="dashboard-section">
        <h2 className="section-title">📊 Analytics</h2>
        <div className="charts-grid">
          {/* Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">📈 Weekly Orders</h3>
              <span className="chart-badge">This Week</span>
            </div>
            <div className="chart-body">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Line Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">💵 Revenue Trend</h3>
              <span className="chart-badge">This Week</span>
            </div>
            <div className="chart-body">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </section>

      {/* Pie Chart & Most Placed */}
      <section className="dashboard-section">
        <div className="charts-grid charts-grid-pie">
          {/* Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">🥧 Order Distribution</h3>
              <span className="chart-badge">By Category</span>
            </div>
            <div className="chart-body chart-body-pie">
              <Pie data={pieChartData} options={pieOptions} />
            </div>
          </div>

          {/* Most Placed Order */}
          <div className="highlight-card">
            <div className="highlight-icon">🏆</div>
            <div className="highlight-content">
              <h3 className="highlight-title">Most Popular Item</h3>
              <p className="highlight-subtitle">This month's top order</p>
              <div className="highlight-value">{stats.most_placed_order || 'No orders yet'}</div>
            </div>
            <div className="highlight-decoration" />
          </div>
        </div>
      </section>
    </div>
  );
}
