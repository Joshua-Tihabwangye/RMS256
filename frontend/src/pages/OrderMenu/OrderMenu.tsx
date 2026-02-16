import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { MenuItem } from '../../types';
import { menuApi, ordersApi, settingsApi } from '../../api';
import { formatPriceInCurrency } from '../../utils/currency';
import { CATEGORY_DISPLAY_ORDER, getCategoryLabel, type MenuType } from './menuConfig';
import './OrderMenu.css';

const ROUTE_TO_TYPE: Record<string, MenuType> = {
  food: 'food',
  softdrinks: 'softdrinks',
  alcohol: 'alcohol',
  'fast-foods': 'fast-foods',
};

const MENU_CONFIG: Record<MenuType, {
  title: string;
  subtitle: string;
  api: () => Promise<MenuItem[]>;
  place: (d: { table_number: number; category: string; item_name: string; number_of_people: number }) => Promise<unknown>;
}> = {
  food: { 
    title: 'Food & Meals', 
    subtitle: 'Delicious breakfast, lunch & dinner options',
    api: menuApi.food, 
    place: ordersApi.food 
  },
  softdrinks: { 
    title: 'Drinks & Beverages', 
    subtitle: 'Refreshing sodas, juices & more',
    api: menuApi.drinks, 
    place: ordersApi.drinks 
  },
  alcohol: { 
    title: 'Alcoholic Drinks', 
    subtitle: 'Premium beers, wines & whiskeys',
    api: menuApi.alcohol, 
    place: ordersApi.alcohol 
  },
  'fast-foods': { 
    title: 'Fast Foods', 
    subtitle: 'Burgers, pizza, tacos & sandwiches',
    api: menuApi.fastFood, 
    place: ordersApi.fastFood 
  },
};

// 10 tables displayed in pairs of 2
const TABLES = Array.from({ length: 10 }, (_, i) => i + 1);

interface Toast {
  id: number;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export default function OrderMenu() {
  const path = useLocation().pathname.replace(/^\//, '');
  const type = ROUTE_TO_TYPE[path] ?? null;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selected, setSelected] = useState<{ item: MenuItem; qty: number } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currency, setCurrency] = useState<{ symbol: string; code: string } | null>(null);
  const config = type ? MENU_CONFIG[type] : null;

  useEffect(() => {
    let cancelled = false;
    const fetchSettings = (attempt = 0) => {
      settingsApi
        .get()
        .then((s) => {
          if (!cancelled && s) {
            setCurrency({
              symbol: s.currency_symbol?.trim() || '$',
              code: (s.currency_code?.trim() || 'USD').toUpperCase(),
            });
          }
        })
        .catch(() => {
          if (!cancelled && attempt < 2) setTimeout(() => fetchSettings(attempt + 1), 600);
          else if (!cancelled) setCurrency({ symbol: '$', code: 'USD' });
        });
    };
    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!config) return;
    setLoading(true);
    config.api().then(setItems).finally(() => setLoading(false));
  }, [config]);

  const formatPrice = useCallback((value: number) => {
    if (currency) return formatPriceInCurrency(value, currency.symbol, currency.code);
    return `$${Number(value).toFixed(2)}`;
  }, [currency]);

  const orderedSections = useMemo(() => {
    if (!type) return [];
    const byCategory = items.reduce<Record<string, MenuItem[]>>((acc, i) => {
      (acc[i.category] = acc[i.category] || []).push(i);
      return acc;
    }, {});
    const order = CATEGORY_DISPLAY_ORDER[type];
    const seen = new Set<string>();
    const result: { category: string; items: MenuItem[] }[] = [];
    for (const cat of order) {
      if (byCategory[cat]?.length) {
        result.push({ category: cat, items: byCategory[cat] });
        seen.add(cat);
      }
    }
    for (const [cat, list] of Object.entries(byCategory)) {
      if (!seen.has(cat) && list.length) result.push({ category: cat, items: list });
    }
    return result;
  }, [type, items]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  async function placeOrder() {
    if (!selected || !config || !selectedTable) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please select a table first'
      });
      return;
    }
    setSubmitting(true);
    try {
      await config.place({
        table_number: selectedTable,
        category: selected.item.category,
        item_name: selected.item.name,
        number_of_people: selected.qty,
      });
      showToast({
        type: 'success',
        title: 'Order Placed!',
        message: `${selected.qty}x ${selected.item.name} for Table ${selectedTable}`
      });
      setSelected(null);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Order Failed',
        message: err instanceof Error ? err.message : 'Something went wrong'
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!config) return <div className="container"><p>Invalid menu.</p></div>;
  
  if (loading) {
    return (
      <div className="order-menu-page">
        <div className="order-menu-hero">
          <div className="container">
            <h1>{config.title}</h1>
            <p className="order-menu-subtitle">{config.subtitle}</p>
          </div>
        </div>
        <div className="container order-menu-sections">
          <div className="menu-loading">
            <div className="loading-spinner" />
            <p>Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`order-menu-page order-menu--${type}`}>
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' ? '✓' : '✕'}
            </div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
          </div>
        ))}
      </div>


      {/* Hero Section */}
      <div className="order-menu-hero">
        <div className="order-menu-hero-bg" />
        <div className="order-menu-hero-overlay" />
        <div className="container order-menu-hero-content">
          <span className="order-menu-badge">{type?.replace('-', ' ')}</span>
          <h1>{config.title}</h1>
          <p className="order-menu-subtitle">{config.subtitle}</p>
        </div>
      </div>

  {/* Table Selection - Below Orders */}
      <div className="container">
        <div className="table-selection-section">
          <h3 className="table-selection-title">
            <span className="table-icon">🪑</span>
            Select Your Table
          </h3>
          <p className="table-selection-subtitle">Choose a table number before placing your order</p>
          <div className="table-selector">
            {TABLES.map((tableNum) => (
              <button
                key={tableNum}
                type="button"
                className={`table-selector-item ${selectedTable === tableNum ? 'selected' : ''}`}
                onClick={() => setSelectedTable(tableNum)}
              >
                Table {tableNum}
              </button>
            ))}
          </div>
          {selectedTable && (
            <div className="selected-table-badge">
              <span>✓</span> Table {selectedTable} Selected
            </div>
          )}
        </div>
      </div>


      {/* Menu Sections */}
      <div className="container order-menu-sections">
        {orderedSections.map(({ category, items: list }) => (
          <section
            key={category}
            className={`menu-section menu-section--${type}`}
            data-category={category.toLowerCase().replace(/\s+/g, '-')}
          >
            <div className="menu-section-bg" aria-hidden />
            <div className="menu-section-inner">
              <h2 className="menu-section-title">{getCategoryLabel(category)}</h2>
              <ul className="menu-list classic-menu-list">
                {list.map((item) => (
                  <li key={item.id} className="menu-list-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                    </div>
                    <span className="item-price">{formatPrice(Number(item.price))}</span>
                    <button
                      type="button"
                      className="btn btn-primary btn-order"
                      onClick={() => setSelected({ item, qty: 1 })}
                    >
                      <span>+</span> Order
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>



      {/* Order Modal */}
      {selected && (
        <>
          <div className="order-modal-backdrop" onClick={() => setSelected(null)} />
          <div className="order-modal">
            <div className="order-modal-header">
              <h3>Place Order</h3>
              <button type="button" className="order-modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="order-modal-body">
              <div className="order-modal-item">
                <span className="order-modal-item-name">{selected.item.name}</span>
                <span className="order-modal-item-price">{formatPrice(Number(selected.item.price))} each</span>
              </div>
              <div className="input-group">
                <label>Quantity (servings)</label>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => setSelected(s => s ? { ...s, qty: Math.max(1, s.qty - 1) } : null)}
                  >−</button>
                  <input
                    type="number"
                    min={1}
                    value={selected.qty}
                    onChange={(e) =>
                      setSelected((s) =>
                        s ? { ...s, qty: Math.max(1, parseInt(e.target.value, 10) || 1) } : null
                      )}
                  />
                  <button
                    type="button"
                    onClick={() => setSelected(s => s ? { ...s, qty: s.qty + 1 } : null)}
                  >+</button>
                </div>
              </div>
              <div className="order-modal-table">
                <span className="label">Table:</span>
                <span className="value">
                  {selectedTable ? `Table ${selectedTable}` : 'Not selected'}
                </span>
              </div>
              <div className="order-modal-total">
                <span className="label">Total:</span>
                <span className="value">{formatPrice(Number(selected.item.price) * selected.qty)}</span>
              </div>
            </div>
            <div className="order-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={placeOrder}
                disabled={!selectedTable || submitting}
              >
                {submitting ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
