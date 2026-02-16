import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { MenuItem } from '../../types';
import { adminApi, settingsApi } from '../../api';
import CurrencyControls from '../../components/CurrencyControls';
import { useCurrency } from '../../hooks/useCurrency';
import { formatPriceInCurrency, getSymbolForCode, normalizeCurrencyCode } from '../../utils/currency';
import './EditMenu.css';

const MENU_APIS: Record<string, { list: () => Promise<MenuItem[]>; add: (d: Partial<MenuItem>) => Promise<MenuItem>; update: (id: number, d: Partial<MenuItem>) => Promise<MenuItem>; delete: (id: number) => Promise<void> }> = {
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
  const { currencies, selected, selectedCode, setSelectedCode } = useCurrency();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [currencySaving, setCurrencySaving] = useState(false);
  const api = type ? MENU_APIS[type] : null;
  const config = type ? TITLES[type] : null;

  useEffect(() => {
    if (!api) return;
    api.list().then(setItems).finally(() => setLoading(false));
  }, [api]);

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .get()
      .then((s) => {
        if (cancelled) return;
        setSelectedCode(normalizeCurrencyCode(s.currency_code));
      })
      .catch((err) => {
        if (cancelled) return;
        setMessage({
          type: 'error',
          text: err instanceof Error
            ? `Failed to load global currency: ${err.message}`
            : 'Failed to load global currency.',
        });
      });
    return () => {
      cancelled = true;
    };
  }, [setSelectedCode]);

  const handleCurrencyChange = useCallback(async (code: string) => {
    const normalized = normalizeCurrencyCode(code);
    const previousCode = selectedCode;
    setCurrencySaving(true);
    try {
      const updated = await settingsApi.update({
        currency_code: normalized,
        currency_symbol: getSymbolForCode(normalized),
      });
      const savedCode = normalizeCurrencyCode(updated.currency_code || normalized);
      setSelectedCode(savedCode);
      setMessage({
        type: 'success',
        text: `Currency saved globally: ${getSymbolForCode(savedCode)} ${savedCode}`,
      });
      setTimeout(() => setMessage(null), 2500);
    } catch (err) {
      setSelectedCode(previousCode);
      setMessage({
        type: 'error',
        text: err instanceof Error
          ? `Currency was not saved globally: ${err.message}`
          : 'Currency was not saved globally.',
      });
    } finally {
      setCurrencySaving(false);
    }
  }, [selectedCode, setSelectedCode]);

  function openAddModal() {
    setEditingItem(null);
    setName('');
    setPrice('');
    setCategory('');
    setMessage(null);
    setModalMode('add');
  }

  function openEditModal(item: MenuItem) {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    const p = Number(item.price);
    setPrice(Number.isFinite(p) ? (p % 1 === 0 ? String(p) : p.toFixed(2)) : '');
    setMessage(null);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditingItem(null);
    setMessage(null);
  }

  async function submitItem(e: React.FormEvent) {
    e.preventDefault();
    if (!api || !name.trim() || !price.trim() || !category.trim()) return;
    const priceValue = Number(price);
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      setMessage({ type: 'error', text: 'Enter a valid price.' });
      return;
    }
    const priceToSave = parseFloat(priceValue.toFixed(2));
    const payload = { name: name.trim(), price: String(priceToSave), category: category.trim() };
    setMessage(null);
    setSaving(true);
    try {
      if (modalMode === 'edit' && editingItem) {
        const updated = await api.update(editingItem.id, payload);
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setMessage({ type: 'success', text: 'Item updated successfully!' });
      } else {
        const created = await api.add(payload);
        setItems((prev) => [...prev, created]);
        setMessage({ type: 'success', text: 'Item added successfully!' });
      }
      setName('');
      setPrice('');
      setCategory('');
      // Show success briefly then close
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save item. Please try again.' });
    } finally {
      setSaving(false);
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
  const isEditing = modalMode === 'edit';

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
          onClick={openAddModal}
        >
          <span>+</span> Add Item
        </button>
      </div>

      <div className="edit-menu-toolbar">
        <CurrencyControls
          currencies={currencies}
          selectedCode={selectedCode}
          onChange={handleCurrencyChange}
          disabled={currencySaving}
        />
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
        <div className="stat-pill">
          <span className="stat-icon">💱</span>
          <span className="stat-value">{selected.symbol} {selected.code}</span>
          <span className="stat-label">Active Currency</span>
        </div>
      </div>

      {/* Page-level Message (for delete, etc.) */}
      {message && !modalMode && (
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
                <th>Price ({selected.code})</th>
                <th>Category</th>
                <th style={{ width: 180 }}>Actions</th>
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
                      <span className="price-badge">
                        {formatPriceInCurrency(Number(item.price), selected.symbol, selected.code)}
                      </span>
                    </td>
                    <td>
                      <span className="category-badge">{item.category}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm edit-btn"
                          onClick={() => openEditModal(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm delete-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {modalMode && (
        <>
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="add-item-modal">
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <form onSubmit={submitItem}>
              <div className="modal-body">
                {/* In-modal message */}
                {message && (
                  <div className={`modal-alert modal-alert-${message.type}`}>
                    <span className="modal-alert-icon">
                      {message.type === 'success' ? '✓' : '✕'}
                    </span>
                    {message.text}
                  </div>
                )}
                <div className="input-group">
                  <label>Item Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Grilled Chicken"
                    required
                    disabled={saving}
                  />
                </div>
                <div className="input-group">
                  <label>Price ({selected.symbol} {selected.code})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 12.99"
                    required
                    disabled={saving}
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
                    disabled={saving}
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
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
