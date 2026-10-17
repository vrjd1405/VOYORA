import React, { useState } from 'react';
import { Sparkles, Calendar, Compass, Clock, Check, ArrowRight, Trash2, MapPin, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmartPlanResponse } from '../types';
import * as api from '../services/api';
import { useTrip } from '../context/TripContext';
import { useToast } from '../context/ToastContext';

interface SmartPlannerPageProps {
  onNavigate: (path: string) => void;
}

export const SmartPlannerPage: React.FC<SmartPlannerPageProps> = ({ onNavigate }) => {
  const [city, setCity] = useState('Paris');
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'fast-paced'>('balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Architecture & Icons',
    'Fine Arts & Museums',
    'Panoramic Sunsets',
  ]);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<SmartPlanResponse | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);

  const { refreshTrip } = useTrip();
  const toast = useToast();

  const presetCities = [
    'Chennai',
    'Madurai',
    'Coimbatore',
    'Mahabalipuram',
    'Thanjavur',
    'Kanyakumari',
    'Ooty',
    'Kodaikanal',
    'Rameswaram',
    'Tiruchirappalli',
    'Kanchipuram',
    'Bengaluru',
    'Mumbai',
    'Delhi',
    'Jaipur',
    'Kochi',
    'Agra',
    'Varanasi',
    'Goa',
    'Paris',
    'Tokyo',
    'Rome',
    'Barcelona',
    'London',
    'New York',
    'Dubai',
    'Global Highlights',
  ];

  const interestOptions = [
    'Architecture & Icons',
    'Fine Arts & Museums',
    'Historic Antiquities',
    'Scenic Gardens & Nature',
    'Panoramic Sunsets',
    'Coastal Vistas',
    'Spiritual Temples & Shrines',
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const plan = await api.generateSmartPlan({
        city: city === 'Global Highlights' ? 'all' : city,
        days,
        interests: selectedInterests,
        pace,
      });
      setGeneratedPlan(plan);
      toast.success('Itinerary Synthesized', `Crafted ${plan.daysCount}-day schedule with ${plan.totalPlaces} curated destinations.`);
    } catch (err: any) {
      toast.error('Planning Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToItinerary = async (replaceExisting = false) => {
    if (!generatedPlan) return;
    setSavingPlan(true);
    try {
      const added = await api.applySmartPlan(generatedPlan.days, replaceExisting);
      await refreshTrip();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      toast.success('Itinerary Saved to Database', `Added ${added} destinations to your active trip.`);
      onNavigate('/trip');
    } catch (err: any) {
      toast.error('Save Failed', err.message);
    } finally {
      setSavingPlan(false);
    }
  };

  const removeItemFromPlan = (dayNumber: number, destId: string) => {
    if (!generatedPlan) return;
    const updatedDays = generatedPlan.days.map(d => {
      if (d.dayNumber === dayNumber) {
        return {
          ...d,
          items: d.items.filter(item => item.destination.id !== destId),
        };
      }
      return d;
    });

    setGeneratedPlan({
      ...generatedPlan,
      days: updatedDays,
      totalPlaces: updatedDays.reduce((acc, d) => acc + d.items.length, 0),
    });
  };

  return (
    <div className="planner-page-root container">
      {/* Header */}
      <div className="planner-header">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-violet">
            <Sparkles size={12} />
            <span>Deterministic Rule-Based Intelligence</span>
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Smart Journey Architect</h1>
        <p className="text-slate-400 text-sm max-w-2xl mt-1">
          Specify your destination city, desired travel cadence, and cultural preferences. Voyora distributes verified real-world points of interest across travel days without duplicates.
        </p>
      </div>

      <div className="planner-grid">
        {/* Left Column: Configuration Form */}
        <div className="planner-config-panel glass-card p-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Destination Selection */}
            <div>
              <label className="config-label">
                <MapPin size={15} className="text-sky-400" />
                <span>Destination City or Realm</span>
              </label>
              <div className="city-presets-row mb-3">
                {presetCities.map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCity(c)}
                    className={`city-preset-btn ${city === c ? 'active' : ''}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Or type custom city (e.g. Rome)..."
                required
                className="config-input"
              />
            </div>

            {/* Travel Days (1 to 7) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="config-label mb-0">
                  <Calendar size={15} className="text-violet-400" />
                  <span>Duration: {days} {days === 1 ? 'Travel Day' : 'Travel Days'}</span>
                </label>
              </div>
              <div className="days-selector-strip">
                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDays(d)}
                    className={`day-count-btn ${days === d ? 'active' : ''}`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Pace */}
            <div>
              <label className="config-label">
                <Clock size={15} className="text-amber-400" />
                <span>Travel Pace</span>
              </label>
              <div className="pace-grid">
                {[
                  { id: 'relaxed', label: 'Relaxed', desc: '2 stops / day' },
                  { id: 'balanced', label: 'Balanced', desc: '3 stops / day' },
                  { id: 'fast-paced', label: 'Fast-Paced', desc: '4 stops / day' },
                ].map(p => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPace(p.id as any)}
                    className={`pace-card ${pace === p.id ? 'active' : ''}`}
                  >
                    <span className="font-bold text-white text-sm block">{p.label}</span>
                    <span className="text-xs text-slate-400 block mt-1">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cultural & Travel Interests */}
            <div>
              <label className="config-label">
                <Compass size={15} className="text-emerald-400" />
                <span>Selected Interests & Atmosphere</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`interest-chip ${active ? 'active' : ''}`}
                    >
                      {active && <Check size={12} className="text-sky-400" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 text-base"
            >
              <Sparkles size={18} />
              <span>{loading ? 'Synthesizing Itinerary...' : 'Generate Smart Itinerary'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Generated Plan Preview */}
        <div className="planner-results-panel">
          {generatedPlan ? (
            <div className="space-y-6">
              {/* Plan Summary Bar */}
              <div className="glass-panel p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-emerald">Suggested Itinerary Ready</span>
                    <span className="text-xs text-slate-400">Rule-based optimization</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {generatedPlan.city} • {generatedPlan.daysCount} Days ({generatedPlan.totalPlaces} Stops)
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveToItinerary(false)}
                    disabled={savingPlan}
                    className="btn btn-primary text-sm"
                  >
                    <Check size={16} />
                    <span>{savingPlan ? 'Saving...' : 'Add to My Trip'}</span>
                  </button>
                </div>
              </div>

              {/* Day Breakdown Cards */}
              <div className="space-y-6">
                {generatedPlan.days.map((day) => (
                  <div key={day.dayNumber} className="glass-card p-6">
                    <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                          Day {day.dayNumber} Theme
                        </span>
                        <h4 className="text-lg font-bold text-white">{day.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{day.theme}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {day.items.map((item) => (
                        <div key={item.destination.id} className="plan-item-row">
                          <img
                            src={item.destination.imageUrl || ''}
                            alt={item.destination.name}
                            className="plan-item-img"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="badge badge-blue text-xs py-0.5 px-2">
                                {item.timeSlot}
                              </span>
                              <span className="text-xs text-slate-400">
                                {item.destination.category}
                              </span>
                            </div>
                            <h5 className="font-bold text-white text-base truncate mt-1">
                              {item.destination.name}
                            </h5>
                            <p className="text-xs text-slate-400 mt-0.5">{item.suggestionNote}</p>
                          </div>
                          <button
                            onClick={() => removeItemFromPlan(day.dayNumber, item.destination.id)}
                            className="text-slate-500 hover:text-rose-400 p-2"
                            title="Remove this suggestion"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[480px]">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to Plan</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Choose your destination parameters on the left and click "Generate Smart Itinerary" to assemble a personalized travel plan.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .planner-page-root {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .planner-header {
          margin-bottom: 32px;
        }
        .planner-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 28px;
        }
        @media (max-width: 980px) {
          .planner-grid {
            grid-template-columns: 1fr;
          }
        }
        .config-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
        }
        .city-presets-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .city-preset-btn {
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }
        .city-preset-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }
        .city-preset-btn.active {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--accent-sky);
          color: var(--accent-sky);
        }
        .config-input {
          width: 100%;
          background: rgba(10, 15, 29, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          padding: 10px 14px;
          color: #ffffff;
          font-size: 0.9rem;
        }
        .config-input:focus {
          outline: none;
          border-color: var(--accent-sky);
        }
        .days-selector-strip {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }
        .day-count-btn {
          padding: 8px 0;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .day-count-btn:hover {
          color: #ffffff;
        }
        .day-count-btn.active {
          background: var(--accent-blue);
          border-color: var(--accent-sky);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(37, 99, 235, 0.4);
        }
        .pace-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .pace-card {
          padding: 12px 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          text-align: center;
          cursor: pointer;
        }
        .pace-card:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .pace-card.active {
          background: rgba(139, 92, 246, 0.15);
          border-color: var(--accent-violet);
        }
        .interest-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .interest-chip:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }
        .interest-chip.active {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--accent-sky);
          color: #ffffff;
          font-weight: 600;
        }
        .plan-item-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
        }
        .plan-item-img {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};
