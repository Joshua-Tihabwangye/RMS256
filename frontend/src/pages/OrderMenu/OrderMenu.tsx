import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { MenuItem } from '../../types';
import { menuApi, ordersApi } from '../../api';
import './OrderMenu.css';

const CATEGORIES: Record<string, { title: string; api: () => Promise<MenuItem[]>; place: (d: { table_number: number; category: string; item_name: string; number_of_people: number }) => Promise<unknown> }> = {
  food: { title: 'Food & Meals', api: menuApi.food, place: ordersApi.food },
  softdrinks: { title: 'Soft Drinks', api: menuApi.drinks, place: ordersApi.drinks },
  alcohol: { title: 'Alcohol', api: menuApi.alcohol, place: ordersApi.alcohol },
  'fast-foods': { title: 'Fast Foods', api: menuApi.fastFood, place: ordersApi.fastFood },
};

export default function OrderMenu() {
  const path = useLocation().pathname.replace(/^\//, '');
  const type = path === 'food' ? 'food' : path === 'softdrinks' ? 'softdrinks' : path === 'alcohol' ? 'alcohol' : path === 'fast-foods' ? 'fast-foods' : '';
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableNumber, setTableNumber] = useState('');
  const [selected, setSelected] = useState<{ item: MenuItem; qty: number } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const config = type ? CATEGORIES[type] : null;

  useEffect(() => {
    if (!config) return;
    config.api().then(setItems).finally(() => setLoading(false));
  }, [config]);

  async function placeOrder() {
    if (!selected || !config || !tableNumber.trim()) return;
    const table = parseInt(tableNumber, 10);
    if (isNaN(table) || table < 1) {
      setMessage({ type: 'error', text: 'Enter a valid table number.' });
      return;
    }
    setMessage(null);
    try {
      await config.place({ table_number: table, category: selected.item.category, item_name: selected.item.name, number_of_people: selected.qty });
      setMessage({ type: 'success', text: 'Order placed successfully!' });
      setSelected(null);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Order failed' });
    }
  }

  if (!config) return <div className="container"><p>Invalid menu.</p></div>;
  if (loading) return <div className="container"><p>Loading menu…</p></div>;

  const byCategory = items.reduce<Record<string, MenuItem[]>>((acc, i) => {
    (acc[i.category] = acc[i.category] || []).push(i);
    return acc;
  }, {});

  return (
    <div className="container order-menu-page">
      <h1>{config.title}</h1>
      <div className="input-group" style={{ maxWidth: 200, marginBottom: '1rem' }}>
        <label htmlFor="table">Table number</label>
        <input id="table" type="number" min={1} value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g. 5" />
      </div>
      {message && <div className={message.type === 'success' ? 'alert alert-success' : 'alert alert-error'}>{message.text}</div>}
      <div className="order-menu-grid">
        {Object.entries(byCategory).map(([cat, list]) => (
          <div key={cat} className="card">
            <h3>{cat}</h3>
            <ul className="menu-list">
              {list.map((item) => (
                <li key={item.id}>
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">${Number(item.price).toFixed(2)}</span>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelected({ item, qty: 1 })}>Order</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {selected && (
        <div className="order-modal card">
          <h3>Order: {selected.item.name}</h3>
          <div className="input-group">
            <label>Quantity (servings)</label>
            <input type="number" min={1} value={selected.qty} onChange={(e) => setSelected((s) => s ? { ...s, qty: Math.max(1, parseInt(e.target.value, 10) || 1) } : null)} />
          </div>
          <p>Total: ${(Number(selected.item.price) * selected.qty).toFixed(2)}</p>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={placeOrder}>Place order</button>
          </div>
        </div>
      )}
    </div>
  );
}
