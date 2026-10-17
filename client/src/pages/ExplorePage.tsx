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
  }, [debouncedQuery, category, city, sort, page]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setCategory('all');
    setCity('all');
    setSort('featured');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedQuery || (category && category !== 'all') || (city && city !== 'all') || (sort && sort !== 'featured')
  );

  const categories = [
    { id: 'all', label: 'All' },
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
    // Premier Global Capitals
    { id: 'Paris', label: 'Paris, France' },
    { id: 'Tokyo', label: 'Tokyo, Japan' },
    { id: 'Rome', label: 'Rome, Italy' },
    { id: 'Barcelona', label: 'Barcelona, Spain' },
    { id: 'London', label: 'London, UK' },
    { id: 'New York', label: 'New York, USA' },
    { id: 'Berlin', label: 'Berlin, Germany' },
    { id: 'Singapore', label: 'Singapore' },
    { id: 'Dubai', label: 'Dubai, UAE' },
    { id: 'Sydney', label: 'Sydney, Australia' },
    { id: 'Cairo', label: 'Cairo, Egypt' },
    { id: 'Amsterdam', label: 'Amsterdam, Netherlands' },
    { id: 'Prague', label: 'Prague, Czechia' },
    { id: 'Seoul', label: 'Seoul, South Korea' },
    { id: 'San Francisco', label: 'San Francisco, USA' },
    { id: 'Rio de Janeiro', label: 'Rio de Janeiro, Brazil' },
    { id: 'Kyoto', label: 'Kyoto, Japan' },
    { id: 'Amalfi', label: 'Amalfi Coast, Italy' },
    { id: 'Santorini', label: 'Santorini, Greece' },
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
        }
        .view-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }
        .view-toggle-btn:hover {
          color: #ffffff;
        }
        .view-toggle-btn.active {
          background: rgba(56, 189, 248, 0.15);
          color: var(--accent-sky);
        }
        .explore-filters-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .filter-search-box {
          flex: 2;
          min-width: 200px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(10, 15, 29, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          padding: 8px 12px;
        }
        .filter-search-input {
          width: 100%;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.9rem;
          outline: none;
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
          left: 10px;
          pointer-events: none;
        }
        .filter-select {
          width: 100%;
          background: rgba(10, 15, 29, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          padding: 8px 12px 8px 30px;
          color: #ffffff;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .filter-select:focus {
          outline: none;
          border-color: var(--accent-sky);
        }
        .filter-select option {
          background: #0f172a;
          color: #ffffff;
        }
        .clear-filters-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.25);
          color: var(--accent-rose);
          font-size: 0.82rem;
          font-weight: 600;
        }
        .clear-filters-btn:hover {
          background: rgba(244, 63, 94, 0.2);
        }
        .category-pills-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }
        .cat-pill-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          white-space: nowrap;
          transition: all var(--transition-fast);
        }
        .cat-pill-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }
        .cat-pill-btn.active {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--accent-sky);
          color: var(--accent-sky);
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
        }
        .results-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 0.85rem;
          color: var(--text-muted);
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
