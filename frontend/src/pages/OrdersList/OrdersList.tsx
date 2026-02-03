import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { OrderRow } from '../../types';
import { adminApi } from '../../api';
import './OrdersList.css';

const ORDER_ENDPOINTS: Record<string, () => Promise<OrderRow[]>> = {
  breakfast: () => adminApi.orders('breakfast'),
  lunch: () => adminApi.orders('lunch'),
  supper: () => adminApi.orders('supper'),
  water: () => adminApi.orders('water'),
  juices: () => adminApi.orders('juices'),
  soda: () => adminApi.orders('soda'),
  energydrink: () => adminApi.orders('energydrink'),
  beers: () => adminApi.orders('beers'),
  wines: () => adminApi.orders('wines'),
  whiskeys: () => adminApi.orders('whiskeys'),
  burgers: () => adminApi.orders('burgers'),
  taccos: () => adminApi.orders('taccos'),
  pizza: () => adminApi.orders('pizza'),
  'sand-wich': () => adminApi.orders('sand-wich'),
  chips: () => adminApi.orders('chips'),
};

const CATEGORY_ICONS: Record<string, string> = {
  breakfast: '🍳',
  lunch: '🍽️',
  supper: '🌙',
  water: '💧',
  juices: '🧃',
  soda: '🥤',
  energydrink: '⚡',
  beers: '🍺',
  wines: '🍷',
  whiskeys: '🥃',
  burgers: '🍔',
  taccos: '🌮',
  pizza: '🍕',
  'sand-wich': '🥪',
  chips: '🍟',
};

export default function OrdersList() {
  const { category } = useParams<{ category: string }>();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchOrders = category ? ORDER_ENDPOINTS[category] : null;

  useEffect(() => {
    if (!fetchOrders) return;
    fetchOrders().then(setOrders).finally(() => setLoading(false));
  }, [fetchOrders]);

  if (!fetchOrders) return <div className="container"><p>Invalid category.</p></div>;

  const title = (category || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const icon = category ? CATEGORY_ICONS[category] || '📦' : '📦';

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_price), 0);
  const totalItems = orders.reduce((sum, o) => sum + o.number_of_people, 0);

  if (loading) {
    return (
      <div className="orders-list-page">
        <div className="orders-header">
          <h1>{icon} {title} Orders</h1>
          <p className="orders-subtitle">Loading orders...</p>
        </div>
        <div className="orders-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="orders-list-page">
      {/* Header */}
      <div className="orders-header">
        <div>
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>{icon} {title} Orders</h1>
          <p className="orders-subtitle">View and manage {title.toLowerCase()} orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="orders-stats">
        <div className="order-stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-info">
            <span className="stat-value">{totalOrders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="order-stat-card">
          <span className="stat-icon">🍽️</span>
          <div className="stat-info">
            <span className="stat-value">{totalItems}</span>
            <span className="stat-label">Items Ordered</span>
          </div>
        </div>
        <div className="order-stat-card revenue">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-value">${totalRevenue.toFixed(2)}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <div className="modern-table-wrap">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Table</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No orders yet for this category.</p>
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <span className="table-badge">Table {o.table_number}</span>
                    </td>
                    <td>
                      <span className="item-name-cell">{o.food_type}</span>
                    </td>
                    <td>
                      <span className="qty-badge">{o.number_of_people}</span>
                    </td>
                    <td>${Number(o.unit_price).toFixed(2)}</td>
                    <td>
                      <span className="price-badge">${Number(o.total_price).toFixed(2)}</span>
                    </td>
                    <td>
                      <span className="time-text">{new Date(o.timestamps).toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${o.is_read ? 'read' : 'new'}`}>
                        {o.is_read ? 'Completed' : 'New'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
