import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Search, Filter, MapPin, SlidersHorizontal, Map as MapIcon, Grid, X, RotateCcw } from 'lucide-react';
import { Destination } from '../types';
import * as api from '../services/api';
import { DestinationCard } from '../components/DestinationCard';
import { MapView } from '../components/MapView';
import { AddToTripModal } from '../components/AddToTripModal';
import { DestinationGridSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';

interface ExplorePageProps {
  onNavigate: (path: string) => void;
  initialQuery?: string;
  initialCategory?: string;
  initialCity?: string;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onNavigate,
  initialQuery = '',
  initialCategory = 'all',
  initialCity = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState('all');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [modalDest, setModalDest] = useState<Destination | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [, startTransition] = useTransition();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch destinations
  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.fetchDestinations({
        q: debouncedQuery,
        category: category !== 'all' ? category : undefined,
        city: city !== 'all' ? city : undefined,
        country: country !== 'all' ? country : undefined,
        sort: sort !== 'featured' ? sort : undefined,
        page,
        limit: 12,
      });
      setDestinations(res.destinations);
      setTotalResults(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      console.error('Failed to load explore destinations:', err);
      setError(err.message || 'Error communicating with places service. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, category, city, country, sort, page]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setCategory('all');
    setCity('all');
    setCountry('all');
    setSort('featured');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedQuery ||
      (category && category !== 'all') ||
      (city && city !== 'all') ||
      (country && country !== 'all') ||
      (sort && sort !== 'featured')
  );

  const countries = [
    { id: 'all', label: 'All Realms', flag: '🌍' },
    { id: 'Switzerland', label: 'Switzerland', flag: '🇨🇭' },
    { id: 'India', label: 'India', flag: '🇮🇳' },
    { id: 'Japan', label: 'Japan', flag: '🇯🇵' },
    { id: 'France', label: 'France', flag: '🇫🇷' },
    { id: 'Italy', label: 'Italy', flag: '🇮🇹' },
    { id: 'Spain', label: 'Spain', flag: '🇪🇸' },
    { id: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
    { id: 'Greece', label: 'Greece', flag: '🇬🇷' },
    { id: 'Egypt', label: 'Egypt', flag: '🇪🇬' },
    { id: 'Thailand', label: 'Thailand', flag: '🇹🇭' },
    { id: 'United Arab Emirates', label: 'UAE', flag: '🇦🇪' },
    { id: 'United Kingdom', label: 'UK', flag: '🇬🇧' },
    { id: 'Germany', label: 'Germany', flag: '🇩🇪' },
    { id: 'Turkey', label: 'Turkey', flag: '🇹🇷' },
    { id: 'Indonesia', label: 'Indonesia', flag: '🇮🇩' },
    { id: 'Australia', label: 'Australia', flag: '🇦🇺' },
    { id: 'Canada', label: 'Canada', flag: '🇨🇦' },
    { id: 'United States', label: 'USA', flag: '🇺🇸' },
    { id: 'South Korea', label: 'South Korea', flag: '🇰🇷' },
    { id: 'Brazil', label: 'Brazil', flag: '🇧🇷' },
    { id: 'Netherlands', label: 'Netherlands', flag: '🇳🇱' },
    { id: 'New Zealand', label: 'New Zealand', flag: '🇳🇿' },
    { id: 'Iceland', label: 'Iceland', flag: '🇮🇸' },
    { id: 'Portugal', label: 'Portugal', flag: '🇵🇹' },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Landmark', label: 'Landmarks' },
    { id: 'Culture & Museum', label: 'Museums' },
    { id: 'Nature & Park', label: 'Nature' },
    { id: 'Coastal & Beach', label: 'Coastal' },
    { id: 'Historic', label: 'Historic' },
  ];

  const cities = [
    { id: 'all', label: 'All Destinations (Global & India)' },
    // Tamil Nadu & South India
    { id: 'Chennai', label: 'Chennai, Tamil Nadu' },
    { id: 'Madurai', label: 'Madurai, Tamil Nadu' },
    { id: 'Coimbatore', label: 'Coimbatore, Tamil Nadu' },
    { id: 'Mahabalipuram', label: 'Mahabalipuram, Tamil Nadu' },
    { id: 'Thanjavur', label: 'Thanjavur, Tamil Nadu' },
    { id: 'Kanyakumari', label: 'Kanyakumari, Tamil Nadu' },
    { id: 'Ooty', label: 'Ooty (Nilgiris), Tamil Nadu' },
    { id: 'Kodaikanal', label: 'Kodaikanal, Tamil Nadu' },
    { id: 'Rameswaram', label: 'Rameswaram, Tamil Nadu' },
    { id: 'Tiruchirappalli', label: 'Tiruchirappalli (Trichy), Tamil Nadu' },
    { id: 'Kanchipuram', label: 'Kanchipuram, Tamil Nadu' },
    // Major Indian Hubs
    { id: 'Bengaluru', label: 'Bengaluru, Karnataka' },
    { id: 'Mumbai', label: 'Mumbai, Maharashtra' },
    { id: 'Delhi', label: 'Delhi NCR, India' },
    { id: 'Jaipur', label: 'Jaipur, Rajasthan' },
    { id: 'Kochi', label: 'Kochi, Kerala' },
    { id: 'Agra', label: 'Agra, Uttar Pradesh' },
    { id: 'Varanasi', label: 'Varanasi, Uttar Pradesh' },
    { id: 'Goa', label: 'Goa, India' },
    { id: 'Hyderabad', label: 'Hyderabad, Telangana' },
    // Switzerland
    { id: 'Zermatt', label: 'Zermatt (Matterhorn), Switzerland' },
    { id: 'Interlaken', label: 'Interlaken (Jungfrau), Switzerland' },
    { id: 'Lucerne', label: 'Lucerne, Switzerland' },
    { id: 'Zurich', label: 'Zurich, Switzerland' },
    // Premier Global Capitals
    { id: 'Paris', label: 'Paris, France' },
    { id: 'Tokyo', label: 'Tokyo, Japan' },
    { id: 'Kyoto', label: 'Kyoto, Japan' },
    { id: 'Rome', label: 'Rome, Italy' },
    { id: 'Amalfi', label: 'Amalfi Coast, Italy' },
    { id: 'Barcelona', label: 'Barcelona, Spain' },
    { id: 'London', label: 'London, UK' },
    { id: 'Edinburgh', label: 'Edinburgh, UK' },
    { id: 'New York', label: 'New York, USA' },
    { id: 'San Francisco', label: 'San Francisco, USA' },
    { id: 'Berlin', label: 'Berlin, Germany' },
    { id: 'Schwangau', label: 'Schwangau (Neuschwanstein), Germany' },
    { id: 'Singapore', label: 'Singapore' },
    { id: 'Dubai', label: 'Dubai, UAE' },
    { id: 'Abu Dhabi', label: 'Abu Dhabi, UAE' },
    { id: 'Athens', label: 'Athens, Greece' },
    { id: 'Santorini', label: 'Santorini, Greece' },
    { id: 'Cairo', label: 'Cairo (Pyramids), Egypt' },
    { id: 'Luxor', label: 'Luxor, Egypt' },
    { id: 'Bangkok', label: 'Bangkok, Thailand' },
    { id: 'Phuket', label: 'Phuket, Thailand' },
    { id: 'Istanbul', label: 'Istanbul, Turkey' },
    { id: 'Göreme', label: 'Cappadocia, Turkey' },
    { id: 'Bali', label: 'Bali (Ubud & Uluwatu), Indonesia' },
    { id: 'Sydney', label: 'Sydney, Australia' },
    { id: 'Banff', label: 'Banff (Lake Louise), Canada' },
    { id: 'Seoul', label: 'Seoul, South Korea' },
    { id: 'Amsterdam', label: 'Amsterdam, Netherlands' },
    { id: 'Prague', label: 'Prague, Czechia' },
    { id: 'Rio de Janeiro', label: 'Rio de Janeiro, Brazil' },
  ];

  return (
    <div className="explore-page-root container">
      {/* Page Header */}
      <div className="explore-header">
        <div>
          <span className="section-badge">Live Discovery Engine</span>
          <h1 className="text-3xl font-extrabold text-white">Explore Global Destinations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover verified architectural wonders, nature sanctuaries, and cultural relics across any city worldwide.
          </p>
        </div>

        {/* View Mode Switcher (Grid / Map / Split) */}
        <div className="view-mode-toggle glass-card">
          <button
            onClick={() => setViewMode('split')}
            className={`view-toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
            title="Split List & Map"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Split</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            title="List Only"
          >
            <Grid size={15} />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            title="Map Only"
          >
            <MapIcon size={15} />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Panel */}
      <div className="explore-filters-bar glass-card">
        {/* Search input */}
        <div className="filter-search-box">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any global city or landmark (e.g., Berlin, Mumbai, Cairo, Vancouver)..."
            className="filter-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
              <X size={15} />
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="filter-select-wrap">
          <MapPin size={15} className="text-sky-400 select-icon" />
          <select
            value={city}
            onChange={(e) => { setCity(e.target.value); setPage(1); }}
            className="filter-select"
            aria-label="Filter by destination city"
          >
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="filter-select-wrap">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="filter-select"
            aria-label="Sort destinations"
          >
            <option value="featured">Sort: Featured</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="category">Category</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button onClick={handleClearFilters} className="clear-filters-btn" title="Reset all filters">
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Country Realm Selector Strip */}
      <div className="country-realms-strip flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {countries.map(c => (
          <button
            key={c.id}
            onClick={() => { setCountry(c.id); setPage(1); }}
            className={`country-realm-btn ${country === c.id ? 'active' : ''}`}
          >
            <span className="text-sm select-none">{c.flag}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Category Pills Strip */}
      <div className="category-pills-strip">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setCategory(cat.id); setPage(1); }}
            className={`cat-pill-btn ${category === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Status Bar */}
      <div className="results-status-bar">
        <span className="results-count">
          Showing <strong>{destinations.length}</strong> of <strong>{totalResults}</strong> discovered places
        </span>
        {error && (
          <span className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            {error}
          </span>
        )}
      </div>

      {/* Main View Layout (Split, Grid, or Map) */}
      <div className={`explore-layout explore-layout-${viewMode}`}>
        {/* Destination Cards Column */}
        {viewMode !== 'map' && (
          <div className="destinations-column">
            {loading ? (
              <DestinationGridSkeleton count={viewMode === 'split' ? 6 : 9} />
            ) : destinations.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No destinations match your filters"
                description="Try loosening your search terms, changing the selected city, or resetting your category filters."
                actionText="Reset All Filters"
                onAction={handleClearFilters}
              />
            ) : (
              <div className={`dest-cards-grid ${viewMode === 'split' ? 'grid-split' : 'grid-full'}`}>
                {destinations.map(dest => (
                  <div 
                    key={dest.id}
                    onMouseEnter={() => setSelectedDest(dest)}
                  >
                    <DestinationCard
                      destination={dest}
                      onNavigate={onNavigate}
                      onOpenAddModal={(d) => setModalDest(d)}
                      isSelected={selectedDest?.id === dest.id}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && !loading && (
              <div className="pagination-bar">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary text-sm"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Map View Column */}
        {viewMode !== 'grid' && (
          <div className="map-column">
            <div className="sticky-map-wrapper">
              <MapView
                destinations={destinations}
                selectedDestination={selectedDest}
                onSelectDestination={(d) => setSelectedDest(d)}
                onNavigate={onNavigate}
                className="explore-map-instance"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal for adding to itinerary */}
      {modalDest && (
        <AddToTripModal
          destination={modalDest}
          onClose={() => setModalDest(null)}
        />
      )}

      <style>{`
        .explore-page-root {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .explore-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .view-mode-toggle {
          display: flex;
          padding: 4px;
          gap: 4px;
          background: #050e1f;
          border-radius: 10px;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .view-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #cbd5e1;
          transition: all var(--transition-fast);
        }
        .view-toggle-btn:hover {
          color: #ffffff;
          background: rgba(56, 189, 248, 0.15);
        }
        .view-toggle-btn.active {
          background: #0284c7;
          color: #ffffff;
          font-weight: 800;
        }
        .explore-filters-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          background: #07152e !important;
          border: 1.5px solid rgba(56, 189, 248, 0.4) !important;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
        }
        .filter-search-box {
          flex: 2;
          min-width: 200px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #030a17;
          border: 1.5px solid rgba(56, 189, 248, 0.4);
          border-radius: 10px;
          padding: 10px 14px;
        }
        .filter-search-input {
          width: 100%;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 700;
          outline: none;
        }
        .filter-search-input::placeholder {
          color: #93c5fd;
        }
        .filter-select-wrap {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 150px;
        }
        .select-icon {
          position: absolute;
          left: 12px;
          color: #38bdf8;
          pointer-events: none;
        }
        .filter-select {
          width: 100%;
          background: #030a17;
          border: 1.5px solid rgba(56, 189, 248, 0.4);
          border-radius: 10px;
          padding: 10px 12px 10px 34px;
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
        }
        .filter-select:focus {
          outline: none;
          border-color: #38bdf8;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
        }
        .filter-select option {
          background: #07152e;
          color: #ffffff;
          font-weight: 700;
        }
        .clear-filters-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 10px;
          background: rgba(244, 63, 94, 0.18);
          border: 1.5px solid #fb7185;
          color: #fda4af;
          font-size: 0.84rem;
          font-weight: 800;
        }
        .clear-filters-btn:hover {
          background: rgba(244, 63, 94, 0.3);
          color: #ffffff;
        }
        .category-pills-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }
        .country-realms-strip {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          padding-bottom: 6px;
          margin-bottom: 14px;
        }
        .country-realm-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 800;
          color: #ffffff;
          background: #091a38;
          border: 1.5px solid rgba(56, 189, 248, 0.35);
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .country-realm-btn:hover {
          color: #ffffff;
          background: #0284c7;
          border-color: #38bdf8;
        }
        .country-realm-btn.active {
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          border-color: #fde047;
          color: #ffffff;
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.6);
        }
        .cat-pill-btn {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.84rem;
          font-weight: 800;
          color: #ffffff;
          background: #091a38;
          border: 1.5px solid rgba(56, 189, 248, 0.35);
          white-space: nowrap;
          transition: all var(--transition-fast);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .cat-pill-btn:hover {
          color: #ffffff;
          background: #0284c7;
          border-color: #38bdf8;
        }
        .cat-pill-btn.active {
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          border-color: #fde047;
          color: #ffffff;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.6);
        }
        .results-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 0.92rem;
          color: #cbd5e1;
          font-weight: 600;
        }
        .results-count strong {
          color: #ffffff;
        }
        .explore-layout-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 980px) {
          .explore-layout-split {
            grid-template-columns: 1fr;
          }
        }
        .explore-layout-grid .destinations-column {
          width: 100%;
        }
        .explore-layout-map .map-column {
          width: 100%;
        }
        .grid-split {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .grid-split {
            grid-template-columns: 1fr;
          }
        }
        .grid-full {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .grid-full {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .grid-full {
            grid-template-columns: 1fr;
          }
        }
        .sticky-map-wrapper {
          position: sticky;
          top: 96px;
          height: calc(100vh - 120px);
          min-height: 500px;
        }
        .explore-map-instance {
          height: 100%;
        }
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 36px;
        }
        .pagination-info {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
