import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Star, ArrowLeft, Compass, Shield } from 'lucide-react';
import * as api from '../services/api';
import { MapView } from '../components/MapView';
import { EmptyState } from '../components/EmptyState';

interface SharedTripPageProps {
  shareId: string;
  onNavigate: (path: string) => void;
}

export const SharedTripPage: React.FC<SharedTripPageProps> = ({ shareId, onNavigate }) => {
  const [sharedData, setSharedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api.getSharedItinerary(shareId)
      .then((data) => {
        setSharedData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Shared itinerary is either invalid or has been revoked.');
        setLoading(false);
      });
  }, [shareId]);

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="skeleton h-12 w-64 mx-auto mb-4" />
        <div className="skeleton h-6 w-96 mx-auto mb-8" />
        <div className="skeleton h-80 w-full max-w-4xl mx-auto rounded-2xl" />
      </div>
    );
  }

  if (error || !sharedData) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={Compass}
          title="Shared Itinerary Unavailable"
          description={error || "This shared travel link has expired, was revoked by its creator, or is invalid."}
          actionText="Create Your Own Trip with Voyora"
          onAction={() => onNavigate('/')}
        />
      </div>
    );
  }

  const { title, description, trip } = sharedData;
  const items = trip?.items || [];

  // Group items by day
  const dayMap = new Map<number, any[]>();
  items.forEach((item: any) => {
    const d = item.dayNumber || 1;
    if (!dayMap.has(d)) dayMap.set(d, []);
    dayMap.get(d)!.push(item);
  });

  const groupedDays = Array.from(dayMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([dayNumber, dayItems]) => ({
      dayNumber,
      items: dayItems.sort((a, b) => a.sortOrder - b.sortOrder),
    }));

  return (
    <div className="shared-trip-root container">
      {/* Banner */}
      <div className="shared-banner glass-panel">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-emerald">
            <Shield size={12} />
            <span>Public Read-Only Travel Itinerary</span>
          </span>
          <span className="text-xs text-slate-400">Created with Voyora</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2">{title}</h1>
        {description && <p className="text-slate-300 text-sm max-w-2xl">{description}</p>}

        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <span>{items.length} Curated Destinations</span>
          <span>•</span>
          <span>{groupedDays.length} Travel Days</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="shared-layout">
        <div className="shared-schedule-col space-y-8">
          {groupedDays.map(group => (
            <div key={group.dayNumber} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                <span className="day-number-pill">Day {group.dayNumber}</span>
                <h3 className="font-bold text-white text-lg">{group.items.length} Stops</h3>
              </div>

              <div className="space-y-4">
                {group.items.map((item: any, idx: number) => (
                  <div key={item.destinationId || idx} className="shared-item-card">
                    <img src={item.imageUrl || ''} alt={item.name} className="shared-item-img" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-400 uppercase">{item.category}</span>
                        {item.isMustVisit && (
                          <span className="badge badge-gold text-xs py-0.5 px-2">★ Must-Visit</span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-base truncate mt-1">{item.name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-sky-400" />
                        <span>{item.city}, {item.country}</span>
                      </p>
                      {item.notes && (
                        <p className="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/20 p-2 rounded-md mt-2">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Map Column */}
        <div className="shared-map-col">
          <div className="sticky top-24 glass-card overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm">Itinerary Cartography</h4>
            </div>
            <div className="h-96">
              <MapView
                destinations={items}
                onNavigate={onNavigate}
                className="rounded-none border-none"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shared-trip-root {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .shared-banner {
          padding: 32px;
          margin-bottom: 32px;
        }
        .shared-layout {
          display: grid;
          grid-template-columns: 1.6fr 1.2fr;
          gap: 28px;
        }
        @media (max-width: 980px) {
          .shared-layout {
            grid-template-columns: 1fr;
          }
        }
        .day-number-pill {
          padding: 4px 12px;
          background: var(--accent-blue);
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: 8px;
        }
        .shared-item-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
        }
        .shared-item-img {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};
