import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">J.T Restaurant</span>
          </Link>
          <nav className={`nav ${navOpen ? 'show' : ''}`}>
            <Link
              to="/food"
              className={isActive('/food') ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              🍽️ Food
            </Link>
            <Link
              to="/softdrinks"
              className={isActive('/softdrinks') ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              🥤 Drinks
            </Link>
            <Link
              to="/fast-foods"
              className={isActive('/fast-foods') ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              🍔 Fast Foods
            </Link>
            <Link
              to="/alcohol"
              className={isActive('/alcohol') ? 'active' : ''}
              onClick={() => setNavOpen(false)}
            >
              🍷 Alcohol
            </Link>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="theme-toggle-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span className="theme-toggle-text">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Menu"
            onClick={() => setNavOpen((o) => !o)}
          >
            <span className={navOpen ? 'open' : ''} />
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">🍽️ J.T Restaurant</span>
            <p>You Love it, You want it, We serve it.</p>
          </div>
          <div className="footer-links">
            <Link to="/food">Food</Link>
            <Link to="/softdrinks">Drinks</Link>
            <Link to="/fast-foods">Fast Foods</Link>
            <Link to="/alcohol">Alcohol</Link>
          </div>
          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} J.T Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
