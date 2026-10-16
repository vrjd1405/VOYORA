import React, { useState } from 'react';
import { Compass, Send, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="footer-root">
      <div className="container footer-content">
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-col-brand">
            <div className="footer-brand" onClick={() => onNavigate('/')}>
              <div className="footer-brand-icon">
                <Compass size={20} />
              </div>
              <span className="footer-brand-title">VOY<span className="brand-name-accent">ORA</span></span>
            </div>
            <p className="footer-tagline">
              Discover More. Travel Better.
            </p>
            <p className="footer-desc">
              An intelligent, luxury travel planning companion architected for global explorers. Experience curated destinations, synchronized interactive cartography, and real-time meteorology.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-col-links">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => onNavigate('/')} className="footer-link-btn">Home Experience</button></li>
              <li><button onClick={() => onNavigate('/explore')} className="footer-link-btn">Explore Destinations</button></li>
              <li><button onClick={() => onNavigate('/planner')} className="footer-link-btn">Smart Planner</button></li>
              <li><button onClick={() => onNavigate('/trip')} className="footer-link-btn">My Itinerary</button></li>
              <li><button onClick={() => onNavigate('/favorites')} className="footer-link-btn">Saved Favorites</button></li>
            </ul>
          </div>

          {/* Destinations Category Shortcuts */}
          <div className="footer-col-links">
            <h4 className="footer-heading">Iconic Realms</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => onNavigate('/explore?city=Paris')} className="footer-link-btn">Paris, France</button></li>
              <li><button onClick={() => onNavigate('/explore?city=Tokyo')} className="footer-link-btn">Tokyo, Japan</button></li>
              <li><button onClick={() => onNavigate('/explore?city=Rome')} className="footer-link-btn">Rome, Italy</button></li>
              <li><button onClick={() => onNavigate('/explore?city=Barcelona')} className="footer-link-btn">Barcelona, Spain</button></li>
              <li><button onClick={() => onNavigate('/explore?city=Amalfi')} className="footer-link-btn">Amalfi Coast, Italy</button></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-col-newsletter">
            <h4 className="footer-heading">The Voyora Gazette</h4>
            <p className="footer-newsletter-text">
              Receive private dispatches on emerging global destinations, curated itineraries, and exclusive travel guides.
            </p>
            {subscribed ? (
              <div className="newsletter-success">
                <Check size={16} className="text-emerald-400" />
                <span>You're subscribed to the Gazette!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="newsletter-input"
                />
                <button type="submit" className="btn btn-primary newsletter-btn" aria-label="Subscribe">
                  <Send size={15} />
                </button>
              </form>
            )}
            <span className="footer-privacy-note">Zero spam. Unsubscribe at any time.</span>
          </div>
        </div>

        {/* Bottom Attribution & Copyright Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copy">
            © {new Date().getFullYear()} VOYORA Technologies Inc. All rights reserved.
          </p>
          <div className="footer-attributions">
            <span>Data powered by OpenStreetMap, CartoDB & Open-Meteo API</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-root {
          background-color: #050811;
          border-top: 1px solid var(--border-subtle);
          padding-top: 64px;
          padding-bottom: 32px;
          margin-top: auto;
        }
        .footer-top-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.8fr;
          gap: 40px;
          margin-bottom: 48px;
        }
        @media (max-width: 980px) {
          .footer-top-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 600px) {
          .footer-top-grid {
            grid-template-columns: 1fr;
          }
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-bottom: 12px;
        }
        .footer-brand-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        .footer-brand-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
        }
        .footer-tagline {
          color: var(--accent-sky);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }
        .footer-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 340px;
        }
        .footer-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          letter-spacing: 0.02em;
        }
        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-link-btn {
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-align: left;
          transition: all var(--transition-fast);
        }
        .footer-link-btn:hover {
          color: var(--accent-sky);
          transform: translateX(3px);
        }
        .footer-newsletter-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 14px;
        }
        .newsletter-form {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .newsletter-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          padding: 10px 14px;
          color: #ffffff;
          font-size: 0.85rem;
        }
        .newsletter-input:focus {
          outline: none;
          border-color: var(--accent-sky);
        }
        .newsletter-btn {
          padding: 10px 16px;
          border-radius: 8px;
        }
        .newsletter-success {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 8px;
          color: #a7f3d0;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .footer-privacy-note {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        @media (max-width: 600px) {
          .footer-bottom-bar {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};
