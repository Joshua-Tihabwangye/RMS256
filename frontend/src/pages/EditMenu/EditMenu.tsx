import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { MenuItem } from '../../types';
import { adminApi } from '../../api';
import './EditMenu.css';

const MENU_APIS: Record<string, { list: () => Promise<MenuItem[]>; add: (d: Partial<MenuItem>) => Promise<MenuItem>; delete: (id: number) => Promise<void> }> = {
  'edit-foods': adminApi.menu.food,
  'edit-drinks': adminApi.menu.drinks,
  'edit-alcohol': adminApi.menu.alcohol,
  'edit-fast-foods': adminApi.menu.fastFood,
};

const TITLES: Record<string, string> = {
  'edit-foods': 'Edit Foods',
  'edit-drinks': 'Edit Drinks',
  'edit-alcohol': 'Edit Alcohol',
  'edit-fast-foods': 'Edit Fast Foods',
};

export default function EditMenu() {
  const path = useLocation().pathname.split('/').filter(Boolean).pop() || '';
  const type = path;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const api = type ? MENU_APIS[type] : null;
  const title = type ? TITLES[type] : '';

  useEffect(() => {
    if (!api) return;
    api.list().then(setItems).finally(() => setLoading(false));
  }, [api]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!api || !name.trim() || !price.trim() || !category.trim()) return;
    setMessage(null);
    try {
      const created = await api.add({ name: name.trim(), price: price.trim(), category: category.trim() });
      setItems((prev) => [...prev, created]);
      setName(''); setPrice(''); setCategory('');
      setMessage({ type: 'success', text: 'Item added.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Add failed' });
    }
  }

  async function removeItem(id: number) {
    if (!api) return;
    try {
      await api.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setMessage({ type: 'error', text: 'Delete failed' });
    }
  }

  if (!api) return <div className="container"><p>Invalid menu.</p></div>;
  if (loading) return <div className="container"><p>Loading…</p></div>;

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="container edit-menu-page">
      <h1>{title}</h1>
      {message && <div className={message.type === 'success' ? 'alert alert-success' : 'alert alert-error'}>{message.text}</div>}
      <form onSubmit={addItem} className="card add-form">
        <h3>Add item</h3>
        <div className="input-group"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div className="input-group"><label>Price</label><input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
        <div className="input-group">
          <label>Category</label>
          <input list="categories" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <datalist id="categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
      <div className="items-table-wrap card">
        <table className="items-table">
          <thead>
            <tr><th>Name</th><th>Price</th><th>Category</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>{item.category}</td>
                <td><button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(item.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
