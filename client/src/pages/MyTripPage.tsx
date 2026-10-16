import React, { useState } from 'react';
import { Calendar, Download, Share2, Plus, Sparkles, Star, MapPin, Trash2, Check, Copy, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTrip } from '../context/TripContext';
import { useToast } from '../context/ToastContext';
import { DayItineraryCard } from '../components/DayItineraryCard';
import { MapView } from '../components/MapView';
import { EmptyState } from '../components/EmptyState';
import { ItinerarySkeleton } from '../components/LoadingSkeleton';
import { generateItineraryPdf } from '../services/pdfExport';
import * as api from '../services/api';

interface MyTripPageProps {
  onNavigate: (path: string) => void;
}

export const MyTripPage: React.FC<MyTripPageProps> = ({ onNavigate }) => {
  const { items, groupedDays, stats, loading, clearAllItems, reorderDayItems, updateItem } = useTrip() as any;
  const toast = useToast();

  const [tripTitle, setTripTitle] = useState('Grand European & Global Expedition');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharingLoading, setSharingLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map'>('itinerary');

  const handleDownloadPdf = () => {
    if (items.length === 0) {
      toast.error('Cannot Export', 'Please add destinations to your itinerary first.');
      return;
    }

    setExportingPdf(true);
    try {
      generateItineraryPdf(tripTitle, groupedDays, stats);
      // Trigger festive celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#8b5cf6', '#f59e0b', '#10b981'],
      });
      toast.success('PDF Export Complete', 'Your luxury itinerary is ready for download.');
    } catch (err: any) {
      toast.error('PDF Export Failed', err.message);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleShareTrip = async () => {
    if (items.length === 0) {
      toast.error('Cannot Share', 'Add destinations to your trip before sharing.');
      return;
    }

    setSharingLoading(true);
    try {
      const res = await api.shareItinerary(tripTitle, 'Curated journey created with Voyora.');
      const fullUrl = `${window.location.origin}/trip/share/${res.shareId}`;
      setShareUrl(fullUrl);
      setShowShareModal(true);
      toast.success('Share Link Created');
    } catch (err: any) {
      toast.error('Share Failed', err.message);
    } finally {
      setSharingLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.info('Copied to Clipboard', shareUrl);
    }
  };

  // Move item within a day
  const handleMoveOrder = async (dayItems: any[], index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= dayItems.length) return;

    const itemA = dayItems[index];
    const itemB = dayItems[targetIdx];

    try {
      await api.reorderItinerary([
        { id: itemA.id, sortOrder: targetIdx },
        { id: itemB.id, sortOrder: index },
      ]);
      const { refreshTrip } = (useTrip as any)();
      if (refreshTrip) refreshTrip();
    } catch {
      // handled
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <ItinerarySkeleton />
      </div>
    );
  }

  return (
    <div className="trip-page-root container">
      {/* Top Banner / Trip Meta */}
      <div className="trip-hero-panel glass-panel">
        <div className="trip-title-section">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-blue">Voyora Itinerary</span>
            <span className="text-xs text-slate-400">Database Persisted</span>
          </div>

          {isEditingTitle ? (
            <div className="flex items-center gap-2 max-w-lg">
              <input
                type="text"
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
                className="trip-title-input"
                autoFocus
              />
              <button onClick={() => setIsEditingTitle(false)} className="btn btn-primary text-xs py-1.5 px-3">
                <Check size={14} />
              </button>
            </div>
          ) : (
            <h1 className="trip-main-title" onClick={() => setIsEditingTitle(true)} title="Click to rename trip">
              {tripTitle}
            </h1>
          )}

          <p className="trip-subtitle">
            {stats.totalPlaces} Curated stops across {stats.totalDays} travel days. All changes automatically saved.
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="trip-actions-toolbar">
          <button
            onClick={handleDownloadPdf}
            disabled={exportingPdf || items.length === 0}
            className="btn btn-primary trip-action-btn"
            title="Export itinerary as a professionally formatted PDF"
          >
            <Download size={16} />
            <span>{exportingPdf ? 'Exporting...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handleShareTrip}
            disabled={sharingLoading || items.length === 0}
            className="btn btn-secondary trip-action-btn"
            title="Create shareable read-only link"
          >
            <Share2 size={16} />
            <span>Share Trip</span>
          </button>

          <button
            onClick={() => onNavigate('/explore')}
            className="btn btn-outline trip-action-btn"
          >
            <Plus size={16} />
            <span>Add Places</span>
          </button>

          {items.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire itinerary?')) {
                  clearAllItems();
                }
              }}
              className="btn btn-danger trip-action-btn"
              title="Reset itinerary"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Statistics Strip */}
      <div className="trip-stats-grid">
        <div className="stat-card glass-card">
          <span className="stat-label">Total Destinations</span>
          <span className="stat-value">{stats.totalPlaces}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Days Planned</span>
          <span className="stat-value">{stats.totalDays}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Must-Visit Spots</span>
          <span className="stat-value text-amber-400">{stats.mustVisitCount}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Top Category</span>
          <span className="stat-value text-sky-400">
            {Object.keys(stats.categoriesBreakdown || {})[0] || 'Curated'}
          </span>
        </div>
      </div>

      {/* Main Body: Itinerary Days or Empty State */}
      {items.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Your travel itinerary is empty"
          description="Begin architecting your journey by discovering iconic destinations or using our intelligent Smart Planner."
          actionText="Discover Destinations"
          onAction={() => onNavigate('/explore')}
        />
      ) : (
        <div className="trip-main-layout">
          {/* Day Sections Column */}
          <div className="trip-days-column space-y-8">
            {groupedDays.map((group: any) => (
              <div key={group.dayNumber} className="day-group-section">
                <div className="day-group-header">
                  <div className="flex items-center gap-3">
                    <span className="day-number-pill">Day {group.dayNumber}</span>
                    <h3 className="day-group-title">
                      {group.items.length} {group.items.length === 1 ? 'Destination' : 'Destinations'}
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate('/explore')}
                    className="day-add-shortcut"
                  >
                    <Plus size={13} />
                    <span>Add to Day {group.dayNumber}</span>
                  </button>
                </div>

                <div className="day-items-list">
                  {group.items.map((item: any, idx: number) => (
                    <DayItineraryCard
                      key={item.id}
                      item={item}
                      totalDays={stats.totalDays}
                      isFirst={idx === 0}
                      isLast={idx === group.items.length - 1}
                      onMoveUp={() => handleMoveOrder(group.items, idx, 'up')}
                      onMoveDown={() => handleMoveOrder(group.items, idx, 'down')}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Interactive Map Column */}
          <div className="trip-map-column">
            <div className="trip-sticky-map glass-card">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-sky-400" />
                  <h4 className="font-bold text-white text-sm">Synchronized Itinerary Map</h4>
                </div>
                <span className="text-xs text-slate-400 font-medium">{items.length} Pins Active</span>
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
      )}

      {/* Share Modal Dialog */}
      {showShareModal && shareUrl && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">Shareable Itinerary Link</h3>
            <p className="text-sm text-slate-400 mb-6">
              Anyone with this secret link can view your curated journey in read-only mode without modifying your database records.
            </p>

            <div className="share-link-box">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="share-link-input"
              />
              <button onClick={handleCopyShareLink} className="btn btn-primary text-xs py-2 px-3">
                <Copy size={14} />
                <span>Copy</span>
              </button>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Open public preview</span>
                <ExternalLink size={12} />
              </a>
              <button onClick={() => setShowShareModal(false)} className="btn btn-secondary text-xs">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .trip-page-root {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .trip-hero-panel {
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 24px;
        }
        .trip-main-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          cursor: pointer;
          margin-bottom: 6px;
        }
        .trip-main-title:hover {
          color: var(--accent-sky);
        }
        .trip-title-input {
          font-size: 1.5rem;
          font-weight: 800;
          background: rgba(10, 15, 29, 0.8);
          border: 1px solid var(--accent-sky);
          border-radius: 8px;
          color: #ffffff;
          padding: 6px 12px;
          width: 100%;
        }
        .trip-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .trip-actions-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .trip-action-btn {
          font-size: 0.85rem;
          padding: 9px 16px;
        }
        .trip-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        @media (max-width: 768px) {
          .trip-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .stat-card {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .stat-value {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .trip-main-layout {
          display: grid;
          grid-template-columns: 1.8fr 1.2fr;
          gap: 28px;
        }
        @media (max-width: 980px) {
          .trip-main-layout {
            grid-template-columns: 1fr;
          }
        }
        .day-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .day-number-pill {
          padding: 4px 12px;
          background: var(--accent-blue);
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: 8px;
          letter-spacing: 0.02em;
        }
        .day-group-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
        }
        .day-add-shortcut {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-sky);
        }
        .day-add-shortcut:hover {
          text-decoration: underline;
        }
        .trip-sticky-map {
          position: sticky;
          top: 96px;
          overflow: hidden;
        }
        .share-link-box {
          display: flex;
          gap: 8px;
          background: rgba(10, 15, 29, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          padding: 6px;
        }
        .share-link-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.85rem;
          padding: 6px 8px;
          outline: none;
        }
      `}</style>
    </div>
  );
};
