import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false);
  const { token } = useAuth();
  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            J.T Restaurant
          </Link>
          <nav className={`nav ${navOpen ? 'show' : ''}`}>
            <Link to="/food" onClick={() => setNavOpen(false)}>Food</Link>
            <Link to="/softdrinks" onClick={() => setNavOpen(false)}>Soft Drinks</Link>
            <Link to="/alcohol" onClick={() => setNavOpen(false)}>Alcohol</Link>
            <Link to="/fast-foods" onClick={() => setNavOpen(false)}>Fast Foods</Link>
            {token ? (
              <Link to="/dashboard" className="btn btn-primary" onClick={() => setNavOpen(false)}>Dashboard</Link>
            ) : (
              <>
                <Link to="/signin" className="btn btn-primary" onClick={() => setNavOpen(false)}>Sign In</Link>
                <Link to="/signup" className="btn btn-secondary" onClick={() => setNavOpen(false)}>Sign Up</Link>
              </>
            )}
          </nav>
          <button type="button" className="menu-toggle" aria-label="Menu" onClick={() => setNavOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>© J.T Restaurant. Order & enjoy.</p>
        </div>
      </footer>
    </div>
  );
}
