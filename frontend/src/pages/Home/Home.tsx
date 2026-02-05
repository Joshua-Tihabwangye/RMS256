import { Link } from 'react-router-dom';
import './Home.css';

const CATEGORIES = [
  {
    id: 'food',
    title: 'Food & Meals',
    description: 'Delicious breakfast, lunch & dinner options',
    path: '/food',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
  },
  {
    id: 'softdrinks',
    title: 'Drinks & Beverages',
    description: 'Refreshing sodas, juices & more',
    path: '/softdrinks',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
    gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  },
  {
    id: 'fast-foods',
    title: 'Fast Foods',
    description: 'Burgers, pizza, tacos & sandwiches',
    path: '/fast-foods',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    gradient: 'linear-gradient(135deg, #eab308, #f97316)',
  },
  {
    id: 'alcohol',
    title: 'Alcoholic Drinks',
    description: 'Premium beers, wines & whiskeys',
    path: '/alcohol',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  },
];

const FEATURES = [
  {
    icon: '🍽️',
    title: 'Fresh Ingredients',
    description: 'Quality meals made with the freshest ingredients daily',
  },
  {
    icon: '⚡',
    title: 'Fast Service',
    description: 'Quick ordering and prompt delivery to your table',
  },
  {
    icon: '👨‍🍳',
    title: 'Expert Chefs',
    description: 'Prepared by experienced culinary professionals',
  },
  {
    icon: '💯',
    title: 'Best Quality',
    description: 'Committed to excellence in every dish we serve',
  },
];

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-particles" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="container hero-content">
          <div className="hero-badge">Welcome to</div>
          <h1 className="hero-title">
            J.T <span className="hero-highlight">Restaurant</span>
          </h1>
          <p className="hero-subtitle">
            You Love it, You want it, We serve it.
          </p>
          <p className="hero-description">
            Experience culinary excellence with our delicious meals, refreshing drinks, 
            and exceptional service. Order now and taste the difference.
          </p>
          <div className="hero-actions">
            <Link to="/food" className="btn btn-primary btn-xl">
              <span>🍽️</span> View Menu
            </Link>

          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">100+</span>
              <span className="hero-stat-label">Menu Items</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">1000+</span>
              <span className="hero-stat-label">Happy Customers</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">4.9</span>
              <span className="hero-stat-label">Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator" aria-hidden="true">
          <span></span>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Our Menu</span>
            <h2 className="section-title">Explore Categories</h2>
            <p className="section-subtitle">
              Discover our wide variety of food and beverages
            </p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((category, index) => (
              <Link
                key={category.id}
                to={category.path}
                className="category-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="category-card-bg" style={{ backgroundImage: `url(${category.image})` }} />
                <div className="category-card-overlay" style={{ background: category.gradient }} />
                <div className="category-card-content">
                  <h3 className="category-card-title">{category.title}</h3>
                  <p className="category-card-description">{category.description}</p>
                  <span className="category-card-action">
                    View Menu <span className="arrow">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">The J.T Experience</h2>
            <p className="section-subtitle">
              What makes us special
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="container cta-content">
          <h2 className="cta-title">Ready to Order?</h2>
          <p className="cta-subtitle">
            Browse our menu and place your order in just a few clicks
          </p>
          <div className="cta-actions">
            <Link to="/food" className="btn btn-primary btn-xl">
              <span>🍽️</span> Order Now
            </Link>
            <Link to="/softdrinks" className="btn btn-secondary btn-xl">
              <span>🥤</span> View Drinks
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
