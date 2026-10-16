import React, { useState } from 'react';
import { Heart, Plus, Trash2, MapPin, Compass, Check } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useTrip } from '../context/TripContext';
import { EmptyState } from '../components/EmptyState';
import { AddToTripModal } from '../components/AddToTripModal';
import { Destination } from '../types';

interface FavoritesPageProps {
  onNavigate: (path: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate }) => {
  const { favorites, loading, toggleFavorite } = useFavorites();
  const { isInTrip, getItemByDestinationId } = useTrip();
  const [modalDest, setModalDest] = useState<Destination | null>(null);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card h-72 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page-root container">
      {/* Header */}
      <div className="favorites-header">
        <div>
          <span className="section-badge">Personal Collections</span>
          <h1 className="text-3xl font-extrabold text-white">Saved Favorites</h1>
          <p className="text-slate-400 text-sm mt-1">
            Destinations you've bookmarked for future exploration. Add them to your active travel itinerary at any time.
          </p>
        </div>
        <div className="fav-count-pill">
          {favorites.length} {favorites.length === 1 ? 'Saved Place' : 'Saved Places'}
        </div>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved yet"
          description="Explore our curated world wonders and tap the heart icon on any card to save it to your private collection."
          actionText="Explore Destinations"
          onAction={() => onNavigate('/explore')}
        />
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => {
            const inTrip = isInTrip(fav.destinationId);
            const tripItem = getItemByDestinationId(fav.destinationId);

            // Synthesize Destination object for modal / navigation
            const destObj: Destination = {
              id: fav.destinationId,
              name: fav.name,
              category: fav.category,
              city: fav.city,
              country: fav.country,
              lat: fav.lat,
              lng: fav.lng,
              imageUrl: fav.imageUrl || undefined,
              rating: fav.rating || undefined,
              address: fav.address || undefined,
            };

            return (
              <div key={fav.id} className="fav-card glass-card">
                <div 
                  className="fav-img-wrapper"
                  onClick={() => onNavigate(`/destinations/${fav.destinationId}`)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={fav.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
                    alt={fav.name}
                    className="fav-img"
                  />
                  <div className="fav-img-overlay" />
                  <span className="fav-category-badge">{fav.category}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(destObj);
                    }}
                    className="fav-remove-heart-btn"
                    title="Remove from favorites"
                    aria-label="Remove favorite"
                  >
                    <Heart size={16} fill="#f43f5e" color="#f43f5e" />
                  </button>
                </div>

                <div className="fav-card-body">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <MapPin size={12} className="text-sky-400" />
                    <span>{fav.city}, {fav.country}</span>
                  </div>

                  <h3 
                    className="fav-card-title truncate"
                    onClick={() => onNavigate(`/destinations/${fav.destinationId}`)}
                  >
                    {fav.name}
                  </h3>

                  <div className="fav-card-actions">
                    <button
                      onClick={() => setModalDest(destObj)}
                      className={`btn w-full text-xs py-2 ${inTrip ? 'btn-secondary text-emerald-300' : 'btn-primary'}`}
                    >
                      {inTrip ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span>Scheduled in Day {tripItem?.dayNumber}</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Add to My Trip</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for adding to itinerary */}
      {modalDest && (
        <AddToTripModal
          destination={modalDest}
          onClose={() => setModalDest(null)}
        />
      )}

      <style>{`
        .favorites-page-root {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .favorites-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .fav-count-pill {
          background: rgba(244, 63, 94, 0.12);
          border: 1px solid rgba(244, 63, 94, 0.25);
          color: #f43f5e;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 6px 14px;
          border-radius: 20px;
        }
        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .favorites-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .favorites-grid {
            grid-template-columns: 1fr;
          }
        }
        .fav-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .fav-img-wrapper {
          position: relative;
          height: 190px;
          overflow: hidden;
          cursor: pointer;
        }
        .fav-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .fav-card:hover .fav-img {
          transform: scale(1.06);
        }
        .fav-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10, 15, 29, 0.1) 0%, rgba(10, 15, 29, 0.7) 100%);
        }
        .fav-category-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.85);
          color: var(--accent-sky);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
        }
        .fav-remove-heart-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }
        .fav-remove-heart-btn:hover {
          transform: scale(1.15);
        }
        .fav-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .fav-card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          cursor: pointer;
        }
        .fav-card-title:hover {
          color: var(--accent-sky);
        }
        .fav-card-actions {
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};
