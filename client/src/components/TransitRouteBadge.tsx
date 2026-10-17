import React, { useState, useEffect } from 'react';
import { Navigation, Car, Footprints } from 'lucide-react';
import { fetchRouteTransit } from '../services/api';

interface TransitRouteBadgeProps {
  from: { name: string; lat: number; lng: number };
  to: { name: string; lat: number; lng: number };
}

export const TransitRouteBadge: React.FC<TransitRouteBadgeProps> = ({ from, to }) => {
  const [mode, setMode] = useState<'drive' | 'walk'>('drive');
  const [routeInfo, setRouteInfo] = useState<{ summary: string; distanceKm: number; timeMinutes: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetchRouteTransit(from.lat, from.lng, to.lat, to.lng, mode)
      .then(res => {
        if (!isCancelled) {
          setRouteInfo(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [from.lat, from.lng, to.lat, to.lng, mode]);

  return (
    <div className="flex items-center justify-center my-3">
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-md text-xs text-slate-300">
        <Navigation size={12} className="text-sky-400 rotate-45" />
        <span className="text-slate-400">Transit:</span>
        {loading ? (
          <span className="text-slate-500 animate-pulse">Calculating route...</span>
        ) : (
          <span className="font-semibold text-slate-200">
            {routeInfo ? `${routeInfo.distanceKm} km · ~${routeInfo.timeMinutes} mins` : 'Route connected'}
          </span>
        )}

        <div className="flex items-center ml-1 border-l border-slate-700/80 pl-1.5 gap-1">
          <button
            type="button"
            onClick={() => setMode('drive')}
            className={`p-1 rounded transition ${mode === 'drive' ? 'text-sky-400 bg-sky-950/80 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            title="Drive route via Geoapify"
          >
            <Car size={13} />
          </button>
          <button
            type="button"
            onClick={() => setMode('walk')}
            className={`p-1 rounded transition ${mode === 'walk' ? 'text-emerald-400 bg-emerald-950/80 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            title="Walk route via Geoapify"
          >
            <Footprints size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
