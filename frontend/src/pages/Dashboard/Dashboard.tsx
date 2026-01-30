import { useState, useEffect } from 'react';
import type { DashboardStats, ChartData } from '../../types';
import { adminApi } from '../../api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.dashboard(), adminApi.chartData()])
      .then(([s, c]) => { setStats(s); setChart(c); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading dashboard…</p></div>;
  if (!stats) return <div className="container"><p>Failed to load dashboard.</p></div>;

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="card stat-card"><span className="stat-label">Daily orders</span><span className="stat-value">{stats.daily_orders}</span></div>
        <div className="card stat-card"><span className="stat-label">Weekly orders</span><span className="stat-value">{stats.weekly_orders}</span></div>
        <div className="card stat-card"><span className="stat-label">Monthly orders</span><span className="stat-value">{stats.monthly_orders}</span></div>
      </div>
      <div className="revenue-grid">
        <div className="card stat-card"><span className="stat-label">Daily revenue</span><span className="stat-value">${stats.daily_revenue.toFixed(2)}</span></div>
        <div className="card stat-card"><span className="stat-label">Weekly revenue</span><span className="stat-value">${stats.weekly_revenue.toFixed(2)}</span></div>
        <div className="card stat-card"><span className="stat-label">Monthly revenue</span><span className="stat-value">${stats.monthly_revenue.toFixed(2)}</span></div>
        <div className="card stat-card"><span className="stat-label">Yearly revenue</span><span className="stat-value">${stats.yearly_revenue.toFixed(2)}</span></div>
      </div>
      <div className="card"><h3>Most placed order (this month)</h3><p>{stats.most_placed_order}</p></div>
      {chart && (
        <div className="card">
          <h3>Orders by day (Mon–Sun)</h3>
          <div className="chart-bars">
            {chart.daily_orders.map((v, i) => {
              const maxVal = Math.max(...chart.daily_orders) || 1;
              const pct = maxVal > 0 ? Math.max(4, (v / maxVal) * 100) : 4;
              return (
                <div key={i} className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: `${pct}%` }} />
                  <span>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                  <span>{v}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
