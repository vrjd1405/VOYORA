import React, { useState } from 'react';
import { X, Calendar, Star, Plus, Check } from 'lucide-react';
import { Destination } from '../types';
import { useTrip } from '../context/TripContext';

interface AddToTripModalProps {
  destination: Destination | null;
  onClose: () => void;
}

export const AddToTripModal: React.FC<AddToTripModalProps> = ({ destination, onClose }) => {
  const { addItem, groupedDays } = useTrip();
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isMustVisit, setIsMustVisit] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!destination) return null;

  const totalDays = Math.max(groupedDays.length || 1, 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await addItem(destination, dayNumber, notes.trim() || null, isMustVisit);
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Itinerary Scheduling</span>
            <h3 className="text-xl font-bold text-white mt-1">Add to My Trip</h3>
          </div>
          <button onClick={onClose} className="btn-icon text-slate-400 hover:text-white" aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {/* Selected Destination Preview */}
        <div className="modal-dest-preview">
          <img
            src={destination.imageUrl || ''}
            alt={destination.name}
            className="modal-dest-img"
          />
          <div>
            <h4 className="font-bold text-white text-base">{destination.name}</h4>
            <p className="text-xs text-slate-400">{destination.city}, {destination.country} • {destination.category}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} className="text-sky-400" />
              <span>Select Travel Day</span>
            </label>
            <div className="day-options-row">
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDayNumber(d)}
                  className={`day-pill-btn ${dayNumber === d ? 'active' : ''}`}
                >
                  Day {d}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDayNumber(totalDays + 1)}
                className={`day-pill-btn ${dayNumber === totalDays + 1 ? 'active' : ''}`}
              >
                + Day {totalDays + 1}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Personal Notes (Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Book tickets in advance, dress code required, morning visit recommended..."
              rows={3}
              className="modal-textarea"
            />
          </div>

          <div className="form-group-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isMustVisit}
                onChange={(e) => setIsMustVisit(e.target.checked)}
                className="modal-checkbox"
              />
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-200">
                <Star size={14} fill={isMustVisit ? '#f59e0b' : 'none'} color={isMustVisit ? '#f59e0b' : '#94a3b8'} />
                <span>Mark as Must-Visit Destination</span>
              </div>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
              {submitting ? 'Adding...' : (
                <>
                  <Plus size={16} />
                  <span>Confirm Addition</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .modal-dest-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
        }
        .modal-dest-img {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          object-fit: cover;
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .day-options-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .day-pill-btn {
          padding: 8px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }
        .day-pill-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }
        .day-pill-btn.active {
          background: var(--accent-blue);
          border-color: var(--accent-sky);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(37, 99, 235, 0.4);
        }
        .modal-textarea {
          width: 100%;
          background: rgba(10, 15, 29, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: 10px;
          padding: 10px 14px;
          color: #ffffff;
          font-size: 0.9rem;
          resize: vertical;
        }
        .modal-textarea:focus {
          outline: none;
          border-color: var(--accent-sky);
        }
        .form-group-checkbox {
          margin-bottom: 24px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .modal-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--accent-blue);
          cursor: pointer;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
        }
      `}</style>
    </div>
  );
};
