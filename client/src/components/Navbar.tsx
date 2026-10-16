import React, { useState } from 'react';
import { Compass, MapPin, Sparkles, Calendar, Heart, Menu, X } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useFavorites } from '../context/FavoritesContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items: tripItems } = useTrip();
  const { favorites } = useFavorites();

  const navLinks = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/explore', label: 'Explore', icon: MapPin },
    { path: '/planner', label: 'Smart Planner', icon: Sparkles, badge: 'AI/Rule' },
    { path: '/trip', label: 'My Trip', icon: Calendar, count: tripItems.length },
    { path: '/favorites', label: 'Favorites', icon: Heart, count: favorites.length },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => handleLinkClick('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleLinkClick('/')}
        >
          <div className="brand-icon-wrapper">
            <Compass size={22} className="brand-compass-icon" />
          </div>
          <span className="brand-name">
            VOY<span className="brand-name-accent">ORA</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} className="nav-icon" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="nav-badge-pill">{link.badge}</span>
                )}
                {typeof link.count === 'number' && link.count > 0 && (
                  <span className="nav-count-pill">{link.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button: Quick Trip CTA */}
        <div className="navbar-actions">
          <button 
            onClick={() => handleLinkClick('/planner')} 
            className="btn btn-primary nav-cta-btn"
          >
            <Sparkles size={16} />
            <span>Plan Journey</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon mobile-menu-toggle"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="brand-name">VOY<span className="brand-name-accent">ORA</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>
            <nav className="mobile-nav-list">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{link.label}</span>
                    </div>
                    {typeof link.count === 'number' && link.count > 0 && (
                      <span className="nav-count-pill">{link.count}</span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="mobile-drawer-footer">
              <button
                onClick={() => handleLinkClick('/planner')}
                className="btn btn-primary w-full"
              >
                <Sparkles size={16} />
                <span>Plan Smart Journey</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(10, 15, 29, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .brand-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }
        .brand-name {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #ffffff;
        }
        .brand-name-accent {
          color: var(--accent-sky);
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .nav-link-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-link-btn.active {
          color: #ffffff;
          background: rgba(56, 189, 248, 0.12);
          font-weight: 600;
        }
        .nav-link-btn.active .nav-icon {
          color: var(--accent-sky);
        }
        .nav-badge-pill {
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 10px;
          background: rgba(139, 92, 246, 0.2);
          color: var(--accent-violet);
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .nav-count-pill {
          font-size: 0.7rem;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 9px;
          background: var(--accent-blue);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-menu-toggle {
          display: none;
          color: var(--text-primary);
        }
        @media (max-width: 860px) {
          .desktop-nav, .nav-cta-btn {
            display: none;
          }
          .mobile-menu-toggle {
            display: inline-flex;
          }
        }
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 2000;
        }
        .mobile-drawer-content {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 280px;
          background: #0f172a;
          border-left: 1px solid var(--border-glass);
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 20px;
          flex: 1;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-radius: 10px;
          color: var(--text-secondary);
          font-weight: 500;
          width: 100%;
          text-align: left;
        }
        .mobile-nav-item.active {
          background: rgba(56, 189, 248, 0.12);
          color: #ffffff;
          font-weight: 600;
        }
        .mobile-drawer-footer {
          padding-top: 20px;
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </header>
  );
};
