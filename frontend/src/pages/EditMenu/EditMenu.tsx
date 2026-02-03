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

const TITLES: Record<string, { title: string; icon: string; subtitle: string }> = {
  'edit-foods': { title: 'Edit Foods', icon: '🍽️', subtitle: 'Manage breakfast, lunch & dinner items' },
  'edit-drinks': { title: 'Edit Drinks', icon: '🥤', subtitle: 'Manage soft drinks & beverages' },
  'edit-alcohol': { title: 'Edit Alcohol', icon: '🍷', subtitle: 'Manage alcoholic beverages' },
  'edit-fast-foods': { title: 'Edit Fast Foods', icon: '🍔', subtitle: 'Manage burgers, pizza, tacos & more' },
};

export default function EditMenu() {
  const path = useLocation().pathname.split('/').filter(Boolean).pop() || '';
  const type = path;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const api = type ? MENU_APIS[type] : null;
  const config = type ? TITLES[type] : null;

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
      setShowAddForm(false);
      setMessage({ type: 'success', text: 'Item added successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to add item' });
    }
  }

  async function removeItem(id: number) {
    if (!api) return;
    try {
      await api.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setMessage({ type: 'success', text: 'Item deleted successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete item' });
    }
  }

  if (!api || !config) return <div className="container"><p>Invalid menu type.</p></div>;

  if (loading) {
    return (
      <div className="edit-menu-page">
        <div className="edit-menu-header">
          <h1>{config.icon} {config.title}</h1>
          <p className="edit-menu-subtitle">{config.subtitle}</p>
        </div>
        <div className="edit-menu-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="edit-menu-page">
      {/* Header */}
      <div className="edit-menu-header">
        <div>
          <h1>{config.icon} {config.title}</h1>
          <p className="edit-menu-subtitle">{config.subtitle}</p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => setShowAddForm(true)}
        >
          <span>+</span> Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="edit-menu-stats">
        <div className="stat-pill">
          <span className="stat-icon">📦</span>
          <span className="stat-value">{items.length}</span>
          <span className="stat-label">Total Items</span>
        </div>
        <div className="stat-pill">
          <span className="stat-icon">📁</span>
          <span className="stat-value">{categories.length}</span>
          <span className="stat-label">Categories</span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? '✓' : '✕'} {message.text}
        </div>
      )}

      {/* Items Table */}
      <div className="items-table-container">
        <div className="modern-table-wrap">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No items yet. Click "Add Item" to get started.</p>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="item-name-cell">{item.name}</span>
                    </td>
                    <td>
                      <span className="price-badge">${Number(item.price).toFixed(2)}</span>
                    </td>
                    <td>
                      <span className="category-badge">{item.category}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm delete-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <>
          <div className="modal-backdrop" onClick={() => setShowAddForm(false)} />
          <div className="add-item-modal">
            <div className="modal-header">
              <h3>Add New Item</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={addItem}>
              <div className="modal-body">
                <div className="input-group">
                  <label>Item Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Grilled Chicken"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 12.99"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <input
                    list="categories"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Lunch"
                    required
                  />
                  <datalist id="categories">
                    {categories.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
