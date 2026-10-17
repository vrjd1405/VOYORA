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
    { path: '/planner', label: 'Smart Planner', icon: Sparkles, badge: 'AI Journey' },
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
          background: rgba(5, 16, 38, 0.95);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1.5px solid rgba(56, 189, 248, 0.45);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.65);
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
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          border: 1.5px solid #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.5);
        }
        .brand-name {
          font-family: var(--font-display);
          font-size: 1.55rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #ffffff;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        }
        .brand-name-accent {
          color: #38bdf8;
          text-shadow: 0 0 12px rgba(56, 189, 248, 0.7);
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
          padding: 8px 15px;
          border-radius: 9px;
          font-size: 0.92rem;
          font-weight: 700;
          color: #ffffff;
          transition: all var(--transition-fast);
        }
        .nav-link-btn:hover {
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.16);
        }
        .nav-link-btn.active {
          color: #38bdf8;
          background: rgba(14, 165, 233, 0.22);
          font-weight: 800;
          border: 1px solid rgba(56, 189, 248, 0.45);
        }
        .nav-link-btn.active .nav-icon {
          color: #38bdf8;
        }
        .nav-badge-pill {
          font-size: 0.68rem;
          padding: 2px 7px;
          border-radius: 10px;
          background: rgba(245, 158, 11, 0.25);
          border: 1px solid #fbbf24;
          color: #fde047;
          font-weight: 800;
          letter-spacing: 0.02em;
        }  letter-spacing: 0.04em;
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
