import React, { useState } from 'react';
import { Star, Trash2, Calendar, FileText, ChevronUp, ChevronDown, Check, MapPin } from 'lucide-react';
import { ItineraryItem } from '../types';
import { useTrip } from '../context/TripContext';

interface DayItineraryCardProps {
  item: ItineraryItem;
  totalDays: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onNavigate: (path: string) => void;
}

export const DayItineraryCard: React.FC<DayItineraryCardProps> = ({
  item,
  totalDays,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onNavigate,
}) => {
  const { updateItem, removeItem, moveItemToDay } = useTrip();
  const [editingNotes, setEditingNotes] = useState(false);
  const [noteContent, setNoteContent] = useState(item.notes || '');

  const handleToggleMustVisit = () => {
    updateItem(item.id, { isMustVisit: !item.isMustVisit });
  };

  const handleSaveNotes = () => {
    updateItem(item.id, { notes: noteContent.trim() || null });
    setEditingNotes(false);
  };

  const handleDaySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = parseInt(e.target.value, 10);
    if (newDay && newDay !== item.dayNumber) {
      moveItemToDay(item.id, newDay);
    }
  };

  return (
    <div className={`itin-item-card glass-card ${item.isMustVisit ? 'must-visit-border' : ''}`}>
      <div className="itin-item-main">
        {/* Thumbnail */}
        <div 
          className="itin-thumb-wrap" 
          onClick={() => onNavigate(`/destinations/${item.destinationId}`)}
          role="button"
          tabIndex={0}
        >
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}
            alt={item.name}
            className="itin-thumb-img"
          />
          {item.isMustVisit && (
            <div className="itin-must-badge" title="Must-Visit Destination">
              <Star size={11} fill="#f59e0b" color="#f59e0b" />
            </div>
          )}
        </div>

        {/* Details Content */}
        <div className="itin-details">
          <div className="itin-header-row">
            <span className="itin-category">{item.category}</span>
            <div className="itin-reorder-btns">
              {onMoveUp && (
                <button
                  onClick={onMoveUp}
                  disabled={isFirst}
                  className="itin-icon-btn"
                  title="Move place earlier"
                  aria-label="Move earlier"
                >
                  <ChevronUp size={15} />
                </button>
              )}
              {onMoveDown && (
                <button
                  onClick={onMoveDown}
                  disabled={isLast}
                  className="itin-icon-btn"
                  title="Move place later"
                  aria-label="Move later"
                >
                  <ChevronDown size={15} />
                </button>
              )}
            </div>
          </div>

          <h4 
            className="itin-title" 
            onClick={() => onNavigate(`/destinations/${item.destinationId}`)}
          >
            {item.name}
          </h4>

          <div className="itin-location">
            <MapPin size={12} className="text-sky-400" />
            <span>{item.city}, {item.country}</span>
          </div>

          {/* Quick Controls Row */}
          <div className="itin-controls-row">
            {/* Must-Visit Toggle */}
            <button
              onClick={handleToggleMustVisit}
              className={`itin-toggle-btn ${item.isMustVisit ? 'active' : ''}`}
            >
              <Star size={13} fill={item.isMustVisit ? '#f59e0b' : 'none'} color={item.isMustVisit ? '#f59e0b' : '#94a3b8'} />
              <span>{item.isMustVisit ? 'Must-Visit' : 'Mark Must-Visit'}</span>
            </button>

            {/* Notes Button */}
            <button
              onClick={() => setEditingNotes(!editingNotes)}
              className={`itin-toggle-btn ${item.notes ? 'has-notes' : ''}`}
            >
              <FileText size={13} />
              <span>{item.notes ? 'Edit Note' : 'Add Note'}</span>
            </button>

            {/* Move Day Selector */}
            <div className="itin-day-select-wrapper">
              <Calendar size={13} className="itin-select-icon" />
              <select
                value={item.dayNumber}
                onChange={handleDaySelect}
                className="itin-day-select"
                aria-label="Move to Day"
              >
                {Array.from({ length: Math.max(totalDays + 1, 7) }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Day {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => removeItem(item.id)}
              className="itin-delete-btn"
              title="Remove from itinerary"
              aria-label="Remove destination"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Display / Edit Drawer */}
      {(editingNotes || item.notes) && (
        <div className="itin-notes-drawer">
          {editingNotes ? (
            <div className="itin-notes-form">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Personal notes (e.g. ticket booking time, reservation code, tips)..."
                rows={2}
                className="itin-notes-textarea"
              />
              <div className="itin-notes-actions">
                <button onClick={() => setEditingNotes(false)} className="btn btn-secondary text-xs py-1 px-3">
                  Cancel
                </button>
                <button onClick={handleSaveNotes} className="btn btn-primary text-xs py-1 px-3">
                  <Check size={13} />
                  <span>Save Note</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="itin-notes-preview">
              <span className="itin-notes-label">Personal Note:</span>
              <p className="itin-notes-text">{item.notes}</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .itin-item-card {
          margin-bottom: 12px;
          padding: 14px;
          transition: all var(--transition-normal);
        }
        .must-visit-border {
          border-left: 4px solid var(--accent-amber) !important;
        }
        .itin-item-main {
          display: flex;
          gap: 16px;
        }
        .itin-thumb-wrap {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          cursor: pointer;
        }
        .itin-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .itin-must-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(15, 23, 42, 0.9);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .itin-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .itin-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .itin-category {
          font-size: 0.72rem;
          color: var(--accent-sky);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .itin-reorder-btns {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .itin-icon-btn {
          color: var(--text-muted);
          padding: 3px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .itin-icon-btn:hover:not(:disabled) {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }
        .itin-icon-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .itin-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          margin-bottom: 4px;
        }
        .itin-title:hover {
          color: var(--accent-sky);
        }
        .itin-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }
        .itin-controls-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: auto;
        }
        .itin-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .itin-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .itin-toggle-btn.active {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
          color: #fbbf24;
        }
        .itin-toggle-btn.has-notes {
          color: var(--accent-sky);
          border-color: rgba(56, 189, 248, 0.3);
        }
        .itin-day-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .itin-select-icon {
          position: absolute;
          left: 8px;
          pointer-events: none;
          color: var(--text-muted);
        }
        .itin-day-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px 4px 26px;
          cursor: pointer;
        }
        .itin-day-select:focus {
          outline: none;
          border-color: var(--accent-sky);
        }
        .itin-delete-btn {
          margin-left: auto;
          color: var(--text-muted);
          padding: 6px;
          border-radius: 6px;
        }
        .itin-delete-btn:hover {
          color: var(--accent-rose);
          background: rgba(244, 63, 94, 0.15);
        }
        .itin-notes-drawer {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
        }
        .itin-notes-preview {
          background: rgba(245, 158, 11, 0.06);
          border: 1px dashed rgba(245, 158, 11, 0.25);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.82rem;
        }
        .itin-notes-label {
          font-weight: 700;
          color: #fbbf24;
          font-size: 0.75rem;
          display: block;
          margin-bottom: 2px;
        }
        .itin-notes-text {
          color: var(--text-primary);
          line-height: 1.4;
        }
        .itin-notes-textarea {
          width: 100%;
          background: rgba(10, 15, 29, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          padding: 8px 12px;
          color: #ffffff;
          font-size: 0.85rem;
          resize: vertical;
          margin-bottom: 8px;
        }
        .itin-notes-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};
