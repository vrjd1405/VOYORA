import React, { useState, useEffect } from 'react';
import { Search, Compass, Sparkles, MapPin, Calendar, ArrowRight, ShieldCheck, CloudSun, FileDown, Plane } from 'lucide-react';
import { Destination } from '../types';
import * as api from '../services/api';
import { DestinationCard } from '../components/DestinationCard';
import { AddToTripModal } from '../components/AddToTripModal';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenGlobe?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenGlobe }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalDest, setModalDest] = useState<Destination | null>(null);

  useEffect(() => {
    api.fetchFeaturedDestinations()
      .then(data => {
        setFeaturedDestinations(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) queryParams.set('q', searchQuery.trim());
    if (selectedCategory && selectedCategory !== 'all') queryParams.set('category', selectedCategory);
    onNavigate(`/explore?${queryParams.toString()}`);
  };

  const categories = [
    { id: 'all', label: 'All Experiences' },
    { id: 'Landmark', label: 'Iconic Landmarks', count: '10+' },
    { id: 'Culture & Museum', label: 'Culture & Art', count: '8+' },
    { id: 'Nature & Park', label: 'Nature & Parks', count: '6+' },
    { id: 'Coastal & Beach', label: 'Coastal & Beach', count: '5+' },
    { id: 'Historic', label: 'Historic Realms', count: '8+' },
  ];

  const quickCities = ['Chennai', 'Madurai', 'Ooty', 'Mahabalipuram', 'Paris', 'Tokyo', 'Rome'];

  return (
    <div className="home-page-root">
      {/* Cinematic Hero Section */}
      <section className="hero-section">
        <div className="hero-background-wrapper">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85"
            alt="Cinematic Global Travel"
            className="hero-bg-image"
          />
          <div className="hero-gradient-overlay" />
        </div>

        <div className="container hero-content-container">
          <div className="hero-badge animate-fade-in">
            <Sparkles size={14} className="text-sky-400" />
            <span>THE NEXT GENERATION TRAVEL ARCHITECT</span>
          </div>

          <h1 className="hero-title animate-slide-up">
            Discover More. <br />
            <span className="hero-title-gradient">Travel Better.</span>
          </h1>

          <p className="hero-subtitle animate-slide-up delay-100">
            Unleash bespoke global journeys with synchronized interactive cartography, real-time meteorological intelligence, and seamless day-by-day itinerary orchestration.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="hero-search-glass-card animate-slide-up delay-200">
            <div className="search-field-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, landmark, or vibe (e.g. Paris, Eiffel Tower, Zen)..."
                className="hero-search-input"
              />
            </div>

            <div className="search-divider" />

            <div className="search-category-dropdown-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="hero-category-select"
                aria-label="Filter by category"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary hero-submit-btn">
              <span>Explore</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Destination Pills */}
          <div className="hero-quick-cities animate-fade-in delay-300">
            <span className="quick-label">Trending Now:</span>
            <div className="quick-cities-list">
              {quickCities.map(city => (
                <button
                  key={city}
                  onClick={() => onNavigate(`/explore?city=${encodeURIComponent(city)}`)}
                  className="quick-city-chip"
                >
                  <MapPin size={12} className="text-sky-400" />
                  <span>{city}</span>
                </button>
              ))}

              {onOpenGlobe && (
                <button
                  type="button"
                  onClick={onOpenGlobe}
                  className="quick-city-chip bg-sky-500/20 border-sky-400/40 text-sky-300 font-semibold hover:bg-sky-500/30 transition shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                  title="Launch Interactive 3D World Globe & Orbiting Airplane"
                >
                  <Plane size={13} className="text-sky-400 rotate-45" />
                  <span>3D World Orbit ✈</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Global Destinations Section */}
      <section className="section-featured container">
        <div className="section-header-row">
          <div>
            <span className="section-badge">Curated Expedition Highlights</span>
            <h2 className="section-title">Iconic Global Destinations</h2>
          </div>
          <button 
            onClick={() => onNavigate('/explore')}
            className="btn btn-outline"
          >
            <span>View All Destinations</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card h-80 skeleton" />
            ))}
          </div>
        ) : (
          <div className="destinations-grid">
            {featuredDestinations.map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onNavigate={onNavigate}
                onOpenAddModal={(d) => setModalDest(d)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Explore by Category Section */}
      <section className="section-categories">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="section-badge">Curated Perspectives</span>
            <h2 className="section-title text-center">Explore by Travel Theme</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Filter world wonders by the specific travel atmosphere you crave.
            </p>
          </div>

          <div className="categories-card-grid">
            {[
              { id: 'Landmark', name: 'Iconic Monuments', desc: 'World wonders, architectural marvels, and historic spires.', count: '12 Spots' },
              { id: 'Culture & Museum', name: 'Museums & Fine Art', desc: 'Renowned art galleries, classical antiquities, and relics.', count: '8 Spots' },
              { id: 'Nature & Park', name: 'Botanical & Wilderness', desc: 'Serene city sanctuaries, geothermal lagoons, and gardens.', count: '6 Spots' },
              { id: 'Coastal & Beach', name: 'Coastal & Seaside', desc: 'Pastel cliffside harbors, azure waters, and sea vistas.', count: '5 Spots' },
              { id: 'Historic', name: 'Ancient & Heritage', desc: 'Sacred temples, Roman forums, and timeless quarters.', count: '9 Spots' },
              { id: 'all', name: 'Bespoke Journeys', desc: 'Comprehensive global index spanning diverse cultures.', count: 'All Places' },
            ].map(cat => (
              <div
                key={cat.id}
                className="category-box glass-card"
                onClick={() => onNavigate(cat.id === 'all' ? '/explore' : `/explore?category=${encodeURIComponent(cat.id)}`)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="category-count-badge">{cat.count}</span>
                  <ArrowRight size={16} className="category-arrow" />
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="section-features container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-badge">Architectural Excellence</span>
          <h2 className="section-title text-center">Engineered for Seamless Exploration</h2>
          <p className="text-slate-400 mt-3 text-base">
            Every feature in VOYORA is crafted with authentic telemetry, eliminating fabricated data to deliver reliable travel precision.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper bg-blue-500/10 border-blue-500/20 text-sky-400">
              <Calendar size={24} />
            </div>
            <h3 className="feature-title">Smart Day-Wise Builder</h3>
            <p className="feature-desc">
              Organize destinations into structured travel days. Reorder stops, add private notes, and flag must-visit landmarks persisted in PostgreSQL.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper bg-violet-500/10 border-violet-500/20 text-violet-400">
              <Compass size={24} />
            </div>
            <h3 className="feature-title">Interactive Dark Cartography</h3>
            <p className="feature-desc">
              Dynamic Leaflet map with CartoDB Dark Matter tiles. Verified geographic coordinates synchronize seamlessly with active filters and searches.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper bg-sky-500/10 border-sky-500/20 text-sky-400">
              <CloudSun size={24} />
            </div>
            <h3 className="feature-title">Real Open-Meteo Weather</h3>
            <p className="feature-desc">
              Live temperature and 5-day forecasts direct from verified meteorological satellites. Never travel blind to incoming weather fronts.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              <FileDown size={24} />
            </div>
            <h3 className="feature-title">High-Fidelity PDF Export</h3>
            <p className="feature-desc">
              Transform your curated itinerary into a luxury, printable PDF with one click. Retains day schedules, notes, and coordinates for offline travel.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="section-cta container">
        <div className="cta-banner-glass">
          <div className="cta-content">
            <span className="badge badge-blue mb-3">Instant Itinerary Planner</span>
            <h2 className="cta-title">Ready to architect your next extraordinary voyage?</h2>
            <p className="cta-desc">
              Try our rule-based Smart Planner to instantly construct a customized 1 to 7 day schedule aligned with your personal pacing and interests.
            </p>
            <div className="cta-btn-group">
              <button onClick={() => onNavigate('/planner')} className="btn btn-primary cta-main-btn">
                <Sparkles size={18} />
                <span>Launch Smart Planner</span>
              </button>
              <button onClick={() => onNavigate('/explore')} className="btn btn-secondary">
                <span>Browse All Places</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for adding to trip */}
      {modalDest && (
        <AddToTripModal
          destination={modalDest}
          onClose={() => setModalDest(null)}
        />
      )}

      <style>{`
        .home-page-root {
          display: flex;
          flex-direction: column;
          gap: 80px;
          padding-bottom: 80px;
        }
        .hero-section {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          padding: 80px 0;
        }
        .hero-background-wrapper {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }
        .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.4) saturate(1.2);
        }
        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10, 15, 29, 0.4) 0%, rgba(10, 15, 29, 0.85) 70%, #0a0f1d 100%);
        }
        .hero-content-container {
          position: relative;
          z-index: 10;
          max-width: 900px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 30px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: var(--accent-sky);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.08;
          color: #ffffff;
          margin-bottom: 20px;
          letter-spacing: -0.03em;
        }
        .hero-title-gradient {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.2rem;
          color: #cbd5e1;
          max-width: 680px;
          line-height: 1.6;
          margin-bottom: 36px;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.6rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
        }
        .hero-search-glass-card {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-glass);
          border-radius: 18px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .hero-search-glass-card {
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
          }
          .search-divider {
            display: none;
          }
        }
        .search-field-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 2;
          padding: 0 10px;
        }
        .search-icon {
          color: var(--accent-sky);
        }
        .hero-search-input {
          width: 100%;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 1rem;
          outline: none;
        }
        .hero-search-input::placeholder {
          color: var(--text-muted);
        }
        .search-divider {
          width: 1px;
          height: 32px;
          background: var(--border-glass);
        }
        .search-category-dropdown-wrap {
          flex: 1;
        }
        .hero-category-select {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
        }
        .hero-category-select option {
          background: #0f172a;
          color: #ffffff;
        }
        .hero-submit-btn {
          padding: 12px 28px;
          border-radius: 12px;
        }
        .hero-quick-cities {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .quick-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .quick-cities-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .quick-city-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }
        .quick-city-chip:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--accent-sky);
          transform: translateY(-1px);
        }
        .section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
        }
        .section-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-sky);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .section-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
        }
        @media (max-width: 640px) {
          .section-title {
            font-size: 1.7rem;
          }
          .section-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .destinations-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .destinations-grid {
            grid-template-columns: 1fr;
          }
        }
        .section-categories {
          background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.5) 50%, transparent 100%);
          padding: 60px 0;
        }
        .categories-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .categories-card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .categories-card-grid {
            grid-template-columns: 1fr;
          }
        }
        .category-box {
          padding: 24px;
          cursor: pointer;
        }
        .category-count-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--accent-sky);
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
        }
        .category-arrow {
          color: var(--text-muted);
          transition: transform var(--transition-fast);
        }
        .category-box:hover .category-arrow {
          color: #ffffff;
          transform: translateX(4px);
        }
        .category-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .category-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
        .feature-card {
          padding: 28px 24px;
        }
        .feature-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          margin-bottom: 20px;
        }
        .feature-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
        }
        .feature-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .cta-banner-glass {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(124, 58, 237, 0.18) 100%);
          border: 1px solid var(--border-glass);
          border-radius: 24px;
          padding: 60px 48px;
          text-align: center;
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
        }
        @media (max-width: 640px) {
          .cta-banner-glass {
            padding: 40px 24px;
          }
        }
        .cta-content {
          max-width: 640px;
          margin: 0 auto;
        }
        .cta-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 16px;
        }
        .cta-desc {
          font-size: 1.05rem;
          color: #cbd5e1;
          margin-bottom: 32px;
          line-height: 1.6;
        }
        .cta-btn-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cta-main-btn {
          padding: 12px 28px;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};
