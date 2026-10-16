import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Destination } from '../types';

interface MapViewProps {
  destinations: Destination[];
  selectedDestination?: Destination | null;
  onSelectDestination?: (dest: Destination) => void;
  onNavigate: (path: string) => void;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination,
  onNavigate,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Europe / Paris
      const map = L.map(mapContainerRef.current, {
        center: [48.8566, 2.3522],
        zoom: 4,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // CartoDB Dark Matter Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when destinations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    const validDestinations = destinations.filter(
      d => typeof d.lat === 'number' && typeof d.lng === 'number' && !isNaN(d.lat) && !isNaN(d.lng)
    );

    if (validDestinations.length === 0) return;

    const bounds = L.latLngBounds([]);

    validDestinations.forEach(dest => {
      const isSelected = selectedDestination?.id === dest.id;

      // Custom SVG icon for Voyora
      const iconHtml = `
        <div class="custom-voyora-marker ${isSelected ? 'selected' : ''}">
          <div class="marker-dot"></div>
          <div class="marker-pulse"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'voyora-marker-wrapper',
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([dest.lat, dest.lng], { icon: customIcon });

      const popupHtml = `
        <div class="map-popup-card">
          <div class="map-popup-img-wrap">
            <img src="${dest.imageUrl || ''}" alt="${dest.name}" class="map-popup-img" />
            <span class="map-popup-badge">${dest.category}</span>
          </div>
          <div class="map-popup-info">
            <h4 class="map-popup-title">${dest.name}</h4>
            <p class="map-popup-location">${dest.city}, ${dest.country}</p>
            <div class="map-popup-actions">
              <button class="map-popup-btn" id="popup-btn-${dest.id}">View Details</button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${dest.id}`);
        if (btn) {
          btn.onclick = () => {
            onNavigate(`/destinations/${dest.id}`);
          };
        }
        if (onSelectDestination) {
          onSelectDestination(dest);
        }
      });

      marker.addTo(map);
      markersRef.current.set(dest.id, marker);
      bounds.extend([dest.lat, dest.lng]);
    });

    if (validDestinations.length > 1 && !selectedDestination) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (validDestinations.length === 1) {
      map.setView([validDestinations[0].lat, validDestinations[0].lng], 13);
    }
  }, [destinations, onNavigate, onSelectDestination]);

  // Pan to selected destination
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedDestination) return;

    if (
      typeof selectedDestination.lat === 'number' &&
      typeof selectedDestination.lng === 'number'
    ) {
      map.flyTo([selectedDestination.lat, selectedDestination.lng], 14, {
        duration: 1.2,
      });

      const marker = markersRef.current.get(selectedDestination.id);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedDestination]);

  return (
    <div className={`map-view-container ${className}`}>
      <div ref={mapContainerRef} className="map-canvas" />

      <style>{`
        .map-view-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border-glass);
        }
        .map-canvas {
          width: 100%;
          height: 100%;
        }
        .custom-voyora-marker {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #38bdf8;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);
          z-index: 2;
        }
        .marker-pulse {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.35);
          animation: mapPulse 2s infinite;
          z-index: 1;
        }
        .custom-voyora-marker.selected .marker-dot {
          background: #8b5cf6;
          box-shadow: 0 0 14px #8b5cf6;
          transform: scale(1.2);
        }
        .custom-voyora-marker.selected .marker-pulse {
          background: rgba(139, 92, 246, 0.5);
        }
        @keyframes mapPulse {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .map-popup-card {
          width: 200px;
          font-family: var(--font-body);
        }
        .map-popup-img-wrap {
          position: relative;
          width: 100%;
          height: 100px;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .map-popup-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .map-popup-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(15, 23, 42, 0.85);
          color: #38bdf8;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }
        .map-popup-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 2px;
        }
        .map-popup-location {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        .map-popup-btn {
          width: 100%;
          padding: 6px 10px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
