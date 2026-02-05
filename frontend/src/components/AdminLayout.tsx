import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

interface NavGroup {
  title: string;
  icon: string;
  items: { label: string; path: string; icon?: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    icon: '📊',
    items: [
      { label: 'Dashboard', path: '/admin', icon: '📈' },
      { label: 'Tables', path: '/admin/tables', icon: '🪑' },
    ],
  },
  {
    title: 'Menu Management',
    icon: '📝',
    items: [
      { label: 'Edit Foods', path: '/admin/edit-foods', icon: '🍽️' },
      { label: 'Edit Drinks', path: '/admin/edit-drinks', icon: '🥤' },
      { label: 'Edit Alcohol', path: '/admin/edit-alcohol', icon: '🍷' },
      { label: 'Edit Fast Foods', path: '/admin/edit-fast-foods', icon: '🍔' },
    ],
  },
  {
    title: 'Food Orders',
    icon: '🍴',
    items: [
      { label: 'Breakfast', path: '/admin/orders/breakfast' },
      { label: 'Lunch', path: '/admin/orders/lunch' },
      { label: 'Supper', path: '/admin/orders/supper' },
    ],
  },
  {
    title: 'Drink Orders',
    icon: '🥤',
    items: [
      { label: 'Water', path: '/admin/orders/water' },
      { label: 'Soda', path: '/admin/orders/soda' },
      { label: 'Juices', path: '/admin/orders/juices' },
      { label: 'Energy Drinks', path: '/admin/orders/energydrink' },
    ],
  },
  {
    title: 'Alcohol Orders',
    icon: '🍺',
    items: [
      { label: 'Beers', path: '/admin/orders/beers' },
      { label: 'Wines', path: '/admin/orders/wines' },
      { label: 'Whiskeys', path: '/admin/orders/whiskeys' },
    ],
  },
  {
    title: 'Fast Food Orders',
    icon: '🍕',
    items: [
      { label: 'Burgers', path: '/admin/orders/burgers' },
      { label: 'Pizza', path: '/admin/orders/pizza' },
      { label: 'Tacos', path: '/admin/orders/taccos' },
      { label: 'Sandwiches', path: '/admin/orders/sand-wich' },
      { label: 'Chips', path: '/admin/orders/chips' },
    ],
  },
];

export default function AdminLayout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Overview', 'Menu Management']);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!token) navigate('/admin/login', { replace: true });
  }, [token, navigate]);

  if (!token) return null;

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  function toggleGroup(title: string) {
    setExpandedGroups(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  }

  function isActiveLink(path: string) {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="admin-mobile-header">
        <Link to="/admin" className="admin-mobile-logo">
          <span className="logo-icon">🍽️</span>
          J.T Admin
        </Link>
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle menu"
        >
          <span className={mobileNavOpen ? 'open' : ''} />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">J.T Restaurant</span>
          </Link>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="nav-group">
              <button
                type="button"
                className={`nav-group-header ${expandedGroups.includes(group.title) ? 'expanded' : ''}`}
                onClick={() => toggleGroup(group.title)}
              >
                <span className="nav-group-icon">{group.icon}</span>
                <span className="nav-group-title">{group.title}</span>
                <span className="nav-group-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M4 4.5L6 6.5L8 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </span>
              </button>
              <div className={`nav-group-items ${expandedGroups.includes(group.title) ? 'expanded' : ''}`}>
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActiveLink(item.path) ? 'active' : ''}`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {item.icon && <span className="nav-item-icon">{item.icon}</span>}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="nav-item view-site">
            <span className="nav-item-icon">🌐</span>
            View Site
          </Link>
          <button type="button" className="btn btn-ghost logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {mobileNavOpen && (
        <div className="admin-overlay" onClick={() => setMobileNavOpen(false)} />
      )}
    </div>
  );
}
