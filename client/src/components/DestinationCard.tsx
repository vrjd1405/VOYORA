import React from 'react';
import { Heart, Plus, Check, Star, MapPin } from 'lucide-react';
import { Destination } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useTrip } from '../context/TripContext';

interface DestinationCardProps {
  destination: Destination;
  onNavigate: (path: string) => void;
  onOpenAddModal?: (dest: Destination) => void;
  isSelected?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onNavigate,
  onOpenAddModal,
  isSelected = false,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInTrip, getItemByDestinationId, addItem } = useTrip();

  const favorited = isFavorite(destination.id);
  const inTrip = isInTrip(destination.id);
  const tripItem = getItemByDestinationId(destination.id);

  const handleCardClick = () => {
    onNavigate(`/destinations/${destination.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(destination);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenAddModal) {
      onOpenAddModal(destination);
    } else {
      if (!inTrip) {
        addItem(destination, 1);
      }
    }
  };

  return (
    <div 
      className={`dest-card glass-card ${isSelected ? 'dest-card-selected' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* Thumbnail with Image Zoom on Hover */}
      <div className="dest-image-wrapper">
        <img
          src={destination.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={destination.name}
          className="dest-image"
          loading="lazy"
        />
        <div className="dest-image-overlay" />

        {/* Category Badge */}
        <span className="dest-category-pill">
          {destination.category}
        </span>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className={`dest-fav-btn ${favorited ? 'active' : ''}`}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={favorited ? '#f43f5e' : 'none'} color={favorited ? '#f43f5e' : '#ffffff'} />
        </button>

        {/* Rating Pill */}
        {destination.rating && (
          <div className="dest-rating-pill">
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span>{destination.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Card Info Content */}
      <div className="dest-content">
        <div className="dest-location-row">
          <MapPin size={13} className="text-sky-400" />
          <span className="dest-city-country">{destination.city}, {destination.country}</span>
        </div>

        <h3 className="dest-title">{destination.name}</h3>

        {destination.description && (
          <p className="dest-snippet">
            {destination.description.substring(0, 95)}...
          </p>
        )}

        {/* Card Footer Actions */}
        <div className="dest-footer">
          <button
            onClick={handleAddClick}
            className={`btn dest-action-btn ${inTrip ? 'btn-secondary in-trip' : 'btn-outline'}`}
            title={inTrip ? `Scheduled in Day ${tripItem?.dayNumber}` : 'Add to itinerary'}
          >
            {inTrip ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span>Day {tripItem?.dayNumber || 1}</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Add to Trip</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .dest-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
        }
        .dest-card-selected {
          border-color: var(--accent-sky) !important;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.35) !important;
        }
        .dest-image-wrapper {
          position: relative;
          width: 100%;
          height: 210px;
          overflow: hidden;
          background: #0f172a;
        }
        .dest-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dest-card:hover .dest-image {
          transform: scale(1.08);
        }
        .dest-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10, 15, 29, 0.1) 0%, rgba(10, 15, 29, 0.7) 100%);
        }
        .dest-category-pill {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--accent-sky);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.02em;
        }
        .dest-fav-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .dest-fav-btn:hover {
          transform: scale(1.1);
          background: rgba(15, 23, 42, 0.95);
        }
        .dest-rating-pill {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .dest-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .dest-location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .dest-city-country {
          font-weight: 500;
        }
        .dest-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dest-snippet {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dest-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }
        .dest-action-btn {
          width: 100%;
          font-size: 0.82rem;
          padding: 7px 12px;
        }
        .dest-action-btn.in-trip {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #a7f3d0;
        }
      `}</style>
    </div>
  );
};
