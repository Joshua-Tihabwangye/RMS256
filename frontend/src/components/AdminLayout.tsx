import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/signin', { replace: true });
  }, [token, navigate]);

  if (!token) return null;

  async function handleLogout() {
    await logout();
    navigate('/signin');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/dashboard" className="admin-logo">J.T Restaurant</Link>
        <nav className="admin-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/admin/edit-foods">Edit Foods</Link>
          <Link to="/admin/edit-drinks">Edit Drinks</Link>
          <Link to="/admin/edit-alcohol">Edit Alcohol</Link>
          <Link to="/admin/edit-fast-foods">Edit Fast Foods</Link>
          <Link to="/admin/orders/breakfast">Orders: Breakfast</Link>
          <Link to="/admin/orders/lunch">Orders: Lunch</Link>
          <Link to="/admin/orders/supper">Orders: Supper</Link>
          <Link to="/admin/orders/water">Orders: Water</Link>
          <Link to="/admin/orders/soda">Orders: Soda</Link>
          <Link to="/admin/orders/juices">Orders: Juices</Link>
          <Link to="/admin/orders/energydrink">Orders: Energy</Link>
          <Link to="/admin/orders/beers">Orders: Beers</Link>
          <Link to="/admin/orders/wines">Orders: Wines</Link>
          <Link to="/admin/orders/whiskeys">Orders: Whiskeys</Link>
          <Link to="/admin/orders/burgers">Orders: Burgers</Link>
          <Link to="/admin/orders/pizza">Orders: Pizza</Link>
          <Link to="/admin/orders/taccos">Orders: Taccos</Link>
          <Link to="/admin/orders/sand-wich">Orders: Sandwiches</Link>
          <Link to="/admin/orders/chips">Orders: Chips</Link>
        </nav>
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>Sign Out</button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
