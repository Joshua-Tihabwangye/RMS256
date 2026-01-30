import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <section className="hero">
      <div className="container">
        <p className="hero-welcome">WELCOME</p>
        <h1 className="hero-title">J.T Restaurant</h1>
        <p className="hero-subtitle">You Love it, You want it, We serve it.</p>
        <p className="hero-hint">Use the menu above or the links below to view the menu and place orders.</p>
        <div className="hero-actions">
          <Link to="/food" className="btn btn-primary btn-lg">Food & Breakfast</Link>
          <Link to="/softdrinks" className="btn btn-secondary btn-lg">Soft Drinks</Link>
          <Link to="/alcohol" className="btn btn-secondary btn-lg">Alcoholic Drinks</Link>
          <Link to="/fast-foods" className="btn btn-ghost btn-lg">Fast Foods</Link>
        </div>
      </div>
    </section>
  );
}
