import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  if (loading) return <div className="container"><p>Loading orders…</p></div>;

  const title = (category || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="container orders-list-page">
      <h1>Orders: {title}</h1>
      <div className="card overflow-auto">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Table</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit price</th>
              <th>Total</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6}>No orders.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.table_number}</td>
                  <td>{o.food_type}</td>
                  <td>{o.number_of_people}</td>
                  <td>${Number(o.unit_price).toFixed(2)}</td>
                  <td>${Number(o.total_price).toFixed(2)}</td>
                  <td>{new Date(o.timestamps).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
