import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Plus, Check, MapPin, Clock, Globe, ExternalLink, Compass, Navigation } from 'lucide-react';
import { Destination } from '../types';
import * as api from '../services/api';
import { useTrip } from '../context/TripContext';
import { useFavorites } from '../context/FavoritesContext';
import { WeatherWidget } from '../components/WeatherWidget';
import { MapView } from '../components/MapView';
import { AddToTripModal } from '../components/AddToTripModal';
import { DestinationDetailSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';

interface DestinationDetailsPageProps {
  destinationId: string;
  onNavigate: (path: string) => void;
}

export const DestinationDetailsPage: React.FC<DestinationDetailsPageProps> = ({
  destinationId,
  onNavigate,
}) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [relatedDestinations, setRelatedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { isInTrip, getItemByDestinationId, removeItem } = useTrip();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    setLoading(true);
    setError(null);

    api.fetchDestinationById(destinationId)
      .then(async (dest) => {
        setDestination(dest);
        // Fetch related destinations in the same city or category
        try {
          const relatedRes = await api.fetchDestinations({
            city: dest.city,
            limit: 4,
          });
          setRelatedDestinations(relatedRes.destinations.filter(d => d.id !== dest.id));
        } catch {
          // ignore related err
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Destination not found.');
        setLoading(false);
      });
  }, [destinationId]);

  if (loading) {
    return (
      <div className="container py-12">
        <DestinationDetailSkeleton />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={Compass}
          title="Destination Not Found"
          description={error || "The requested destination could not be located in our discovery index."}
          actionText="Back to Explore"
          onAction={() => onNavigate('/explore')}
        />
      </div>
    );
  }

  const inTrip = isInTrip(destination.id);
  const tripItem = getItemByDestinationId(destination.id);
  const favorited = isFavorite(destination.id);

  const handleTripAction = () => {
    if (inTrip && tripItem) {
      removeItem(tripItem.id);
    } else {
      setIsAddModalOpen(true);
    }
  };

  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`;

  return (
    <div className="dest-detail-page container">
      {/* Top Navigation Bar */}
      <div className="dest-detail-nav">
        <button onClick={() => onNavigate('/explore')} className="btn btn-secondary back-btn">
          <ArrowLeft size={16} />
          <span>Back to Explore</span>
        </button>

        <div className="dest-detail-actions">
          {/* Favorite Toggle Button */}
          <button
            onClick={() => toggleFavorite(destination)}
            className={`btn btn-secondary fav-toggle-btn ${favorited ? 'active' : ''}`}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} fill={favorited ? '#f43f5e' : 'none'} color={favorited ? '#f43f5e' : '#ffffff'} />
            <span>{favorited ? 'Favorited' : 'Save Favorite'}</span>
          </button>

          {/* Add / In Trip Action */}
          <button
            onClick={handleTripAction}
            className={`btn ${inTrip ? 'btn-danger' : 'btn-primary'}`}
          >
            {inTrip ? (
              <>
                <Check size={16} />
                <span>In Trip (Day {tripItem?.dayNumber}) • Remove</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add to My Trip</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Showcase Card */}
      <div className="dest-hero-showcase glass-card">
        <img
          src={destination.imageUrl || ''}
          alt={destination.name}
          className="dest-hero-img"
        />
        <div className="dest-hero-gradient" />

        <div className="dest-hero-meta">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-blue">{destination.category}</span>
            {destination.rating && (
              <span className="badge badge-gold">★ {destination.rating.toFixed(1)} Rating</span>
            )}
          </div>
          <h1 className="dest-hero-title">{destination.name}</h1>
          <p className="dest-hero-location">
            <MapPin size={16} className="text-sky-400" />
            <span>{destination.city}, {destination.country}</span>
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dest-content-grid">
        {/* Left Column: Description & Verified Details */}
        <div className="dest-main-info space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">About the Destination</h3>
            <p className="text-slate-300 leading-relaxed text-base">
              {destination.description || 'Verified international landmark and curated point of interest.'}
            </p>

            {destination.tags && destination.tags.length > 0 && (
              <div className="dest-tags-list mt-6 pt-6 border-t border-slate-800">
                {destination.tags.map(t => (
                  <span key={t} className="dest-tag-chip">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Practical Logistics Card */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Verified Logistics & Telemetry</h3>
            <div className="space-y-4 text-sm">
              {destination.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">Official Address</span>
                    <span className="text-slate-200 font-medium">{destination.address}</span>
                  </div>
                </div>
              )}

              {destination.openingHours && (
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">Visiting Hours</span>
                    <span className="text-slate-200 font-medium">{destination.openingHours}</span>
                  </div>
                </div>
              )}

              {destination.website && (
                <div className="flex items-start gap-3">
                  <Globe size={18} className="text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">Official Portal</span>
                    <a
                      href={destination.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Visit Website</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Navigation size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 text-xs block">Exact Geographic Coordinates</span>
                  <span className="text-slate-200 font-mono text-xs">
                    {destination.lat.toFixed(5)}° N, {destination.lng.toFixed(5)}° E
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <a
                href={externalMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary w-full text-xs"
              >
                <ExternalLink size={14} />
                <span>Open in External Navigation App</span>
              </a>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Location Cartography</h3>
            <div className="h-72 rounded-xl overflow-hidden border border-slate-800">
              <MapView
                destinations={[destination]}
                selectedDestination={destination}
                onNavigate={onNavigate}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Real Live Weather & Related Places */}
        <div className="dest-sidebar space-y-6">
          {/* Real Open-Meteo Weather Widget */}
          <WeatherWidget
            lat={destination.lat}
            lng={destination.lng}
            cityName={destination.city}
          />

          {/* Related Destinations */}
          {relatedDestinations.length > 0 && (
            <div className="glass-card p-6">
              <h4 className="text-base font-bold text-white mb-4">More in {destination.city}</h4>
              <div className="space-y-3">
                {relatedDestinations.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => onNavigate(`/destinations/${rel.id}`)}
                    className="related-item-row"
                    role="button"
                    tabIndex={0}
                  >
                    <img src={rel.imageUrl || ''} alt={rel.name} className="related-img" />
                    <div className="flex-1 min-w-0">
                      <h5 className="related-title truncate">{rel.name}</h5>
                      <span className="text-xs text-slate-400">{rel.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add To Trip Modal */}
      {isAddModalOpen && (
        <AddToTripModal
          destination={destination}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      <style>{`
        .dest-detail-page {
          padding-top: 32px;
          padding-bottom: 80px;
        }
        .dest-detail-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .dest-detail-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fav-toggle-btn.active {
          color: #f43f5e;
          border-color: rgba(244, 63, 94, 0.4);
          background: rgba(244, 63, 94, 0.1);
        }
        .dest-hero-showcase {
          position: relative;
          height: 420px;
          overflow: hidden;
          margin-bottom: 32px;
        }
        .dest-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dest-hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10, 15, 29, 0.1) 0%, rgba(10, 15, 29, 0.85) 85%);
        }
        .dest-hero-meta {
          position: absolute;
          bottom: 32px;
          left: 32px;
          right: 32px;
        }
        .dest-hero-title {
          font-size: 2.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .dest-hero-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 1.1rem;
          color: #e2e8f0;
          font-weight: 500;
        }
        @media (max-width: 640px) {
          .dest-hero-showcase {
            height: 300px;
          }
          .dest-hero-title {
            font-size: 1.8rem;
          }
          .dest-hero-meta {
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
        }
        .dest-content-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr;
          gap: 28px;
        }
        @media (max-width: 980px) {
          .dest-content-grid {
            grid-template-columns: 1fr;
          }
        }
        .dest-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .dest-tag-chip {
          font-size: 0.75rem;
          color: var(--accent-sky);
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.2);
          padding: 3px 10px;
          border-radius: 12px;
        }
        .related-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 10px;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .related-item-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .related-img {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
        }
        .related-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};
