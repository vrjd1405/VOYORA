import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Compass,
  Clock,
  Check,
  Trash2,
  MapPin,
  Utensils,
  CloudSun,
  Lightbulb,
  Printer,
  Copy,
  ExternalLink,
  Key,
  ShieldCheck,
  Navigation,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Wind,
  CheckCircle2,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmartPlanResponse } from '../types';
import * as api from '../services/api';
import { useTrip } from '../context/TripContext';
import { useToast } from '../context/ToastContext';

interface SmartPlannerPageProps {
  onNavigate: (path: string) => void;
}

export const SmartPlannerPage: React.FC<SmartPlannerPageProps> = ({ onNavigate }) => {
  const [city, setCity] = useState('Madurai');
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'fast-paced'>('balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Spiritual Temples & Shrines',
    'Architecture & Icons',
    'Scenic Gardens & Nature',
    'Culinary Street Discovery',
  ]);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('voyora_gemini_api_key') || '';
  });
  const [tempApiKey, setTempApiKey] = useState<string>(geminiApiKey);
  const [showAiSettings, setShowAiSettings] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<SmartPlanResponse | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const { refreshTrip } = useTrip();
  const toast = useToast();

  useEffect(() => {
    if (geminiApiKey) {
      localStorage.setItem('voyora_gemini_api_key', geminiApiKey);
    } else {
      localStorage.removeItem('voyora_gemini_api_key');
    }
  }, [geminiApiKey]);

  const presetGroups = [
    {
      group: 'Tamil Nadu & South India',
      cities: [
        'Madurai',
        'Chennai',
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
        'Kochi',
      ],
    },
    {
      group: 'Pan-India Highlights',
      cities: ['Jaipur', 'Delhi', 'Mumbai', 'Varanasi', 'Agra', 'Goa'],
    },
    {
      group: 'International Metropolises',
      cities: ['Paris', 'Tokyo', 'Rome', 'Barcelona', 'London', 'Dubai', 'Global Highlights'],
    },
  ];

  const interestOptions = [
    'Spiritual Temples & Shrines',
    'Architecture & Icons',
    'Fine Arts & Museums',
    'Scenic Gardens & Nature',
    'Panoramic Sunsets',
    'Culinary Street Discovery',
    'Historic Antiquities',
    'Coastal Vistas',
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(tempApiKey.trim());
    toast.success(
      tempApiKey.trim() ? 'Gemini Key Configured' : 'Key Cleared',
      tempApiKey.trim()
        ? 'Google Gemini 2.5 Flash GenAI will now power rich custom narratives and culinary tips.'
        : 'Reverted to Voyora Built-in Neural Spatial Engine.'
    );
    setShowAiSettings(false);
  };

  const handleClearApiKey = () => {
    setTempApiKey('');
    setGeminiApiKey('');
    toast.info('API Key Removed', 'Using Voyora Built-in Neural Spatial Engine (Zero-Key Mode).');
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
        geminiApiKey: geminiApiKey.trim() || undefined,
      });
      setGeneratedPlan(plan);
      toast.success(
        'Itinerary Synthesized',
        `Crafted ${plan.daysCount}-day schedule with ${plan.totalPlaces} curated destinations via ${plan.aiEngine}.`
      );
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
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });

      toast.success('Itinerary Saved', `Saved ${added} destinations to your active trip.`);
      onNavigate('/trip');
    } catch (err: any) {
      toast.error('Save Failed', err.message);
    } finally {
      setSavingPlan(false);
    }
  };

  const handleCopySummary = () => {
    if (!generatedPlan) return;
    const lines = [
      `VOYORA SMART ITINERARY: ${generatedPlan.city.toUpperCase()}`,
      `Duration: ${generatedPlan.daysCount} Days (${generatedPlan.totalPlaces} Curated Stops)`,
      `Synthesized By: ${generatedPlan.aiEngine}`,
      '',
      `EXECUTIVE SUMMARY:`,
      generatedPlan.summary || '',
      '',
      ...generatedPlan.days.flatMap(d => [
        `========================================`,
        `${d.title.toUpperCase()}`,
        `Theme: ${d.theme}`,
        ...(d.insiderTip ? [`Insider Tip: ${d.insiderTip}`] : []),
        ...(d.totalTransitKm ? [`Estimated Route: ~${d.totalTransitKm} km total transit`] : []),
        `Stops:`,
        ...d.items.map(
          it =>
            `  • [${it.timeSlot}] ${it.destination.name} (${it.destination.category}) - ${it.suggestionNote}` +
            (it.transitFromPrevKm ? ` [~${it.transitFromPrevKm} km from prev stop]` : '')
        ),
        '',
      ]),
      ...(generatedPlan.diningHighlights && generatedPlan.diningHighlights.length > 0
        ? [
            `========================================`,
            `AUTHENTIC REGIONAL CULINARY HIGHLIGHTS:`,
            ...generatedPlan.diningHighlights.map(
              f => `  • ${f.dish} (${f.bestTime}): ${f.description}`
            ),
            '',
          ]
        : []),
      ...(generatedPlan.culturalEtiquette && generatedPlan.culturalEtiquette.length > 0
        ? [
            `========================================`,
            `CULTURAL ETIQUETTE & TRAVEL WISDOM:`,
            ...generatedPlan.culturalEtiquette.map(tip => `  • ${tip}`),
            '',
          ]
        : []),
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSummary(true);
    toast.success('Summary Copied', 'Full formatted journey summary copied to clipboard.');
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handlePrint = () => {
    window.print();
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
      {/* Top Banner & AI Engine Status */}
      <div className="planner-header">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-violet">
              <Sparkles size={13} className="text-violet-400" />
              <span>Dual-Engine AI Trip Planner</span>
            </span>
            <span
              className={`badge ${
                geminiApiKey ? 'badge-emerald' : 'badge-blue'
              } flex items-center gap-1.5`}
            >
              <ShieldCheck size={12} />
              <span>
                {geminiApiKey
                  ? 'Google Gemini 2.5 Flash (GenAI Active)'
                  : 'Voyora Neural Spatial Engine (Zero-Key Active)'}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAiSettings(prev => !prev)}
            className="ai-settings-toggle-btn"
          >
            <Key size={14} className="text-amber-400" />
            <span>AI Model & Key Settings</span>
            {showAiSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Smart Journey Architect
        </h1>
        <p className="text-slate-400 text-sm max-w-3xl mt-1.5 leading-relaxed">
          Specify your destination, pace, and interests. Voyora orchestrates authentic landmarks,
          live Open-Meteo climate forecasts, route distances, and regional dining highlights with{' '}
          <strong className="text-white">100% strict city isolation</strong>.
        </p>
      </div>

      {/* Expandable AI Model & Key Configuration Drawer */}
      {showAiSettings && (
        <div className="ai-settings-card mb-8 animate-fadeIn">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span>AI Planner Engine Configuration</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Voyora seamlessly supports two engines: our built-in{' '}
                <strong className="text-sky-300">Voyora Neural Spatial Engine</strong> (requires NO
                keys, powered by live Geoapify cartography & verified landmarks), and optional{' '}
                <strong className="text-amber-300">Google Gemini 2.5 Flash</strong> for generative
                cultural narratives and custom dining suggestions.
              </p>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary text-xs flex items-center gap-1 py-1.5 px-3 shrink-0"
            >
              <span>Get Free Gemini Key</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <form onSubmit={handleSaveApiKey} className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="password"
                value={tempApiKey}
                onChange={e => setTempApiKey(e.target.value)}
                placeholder="Paste your Google Gemini API Key (e.g. AIzaSy...)"
                className="config-input pr-10 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button type="submit" className="btn btn-primary text-xs py-2.5 px-4 w-full sm:w-auto">
                <Check size={14} />
                <span>Apply Key</span>
              </button>
              {geminiApiKey && (
                <button
                  type="button"
                  onClick={handleClearApiKey}
                  className="btn btn-secondary text-xs py-2.5 px-3"
                  title="Remove Key & Revert to Zero-Key Neural Engine"
                >
                  <Trash2 size={14} className="text-rose-400" />
                </button>
              )}
            </div>
          </form>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Info size={13} className="text-sky-400 shrink-0" />
            <span>
              Your key is saved locally in your browser and used strictly to synthesize your
              itineraries. If no key is set, the planner works 100% out-of-the-box using the built-in
              spatial neural engine!
            </span>
          </div>
        </div>
      )}

      <div className="planner-grid">
        {/* Left Column: Configuration Form */}
        <div className="planner-config-panel glass-card p-6 h-fit">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Destination Selection */}
            <div>
              <label className="config-label">
                <MapPin size={15} className="text-sky-400" />
                <span>Destination City or Realm</span>
              </label>

              {/* Grouped City Presets */}
              <div className="space-y-2.5 mb-3.5">
                {presetGroups.map(pg => (
                  <div key={pg.group}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      {pg.group}
                    </span>
                    <div className="city-presets-row">
                      {pg.cities.map(c => (
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
                  </div>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Or type custom city (e.g. Salem, Vellore, Kyoto)..."
                  required
                  className="config-input pl-3.5"
                />
              </div>
            </div>

            {/* Travel Days (1 to 7) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="config-label mb-0">
                  <Calendar size={15} className="text-violet-400" />
                  <span>
                    Duration: {days} {days === 1 ? 'Travel Day' : 'Travel Days'}
                  </span>
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
                <span>Travel Cadence</span>
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
              className="btn btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
            >
              <Sparkles size={18} className={loading ? 'animate-spin' : ''} />
              <span>
                {loading
                  ? 'Synthesizing Authentic Itinerary...'
                  : `Generate ${city} Itinerary`}
              </span>
            </button>
          </form>
        </div>

        {/* Right Column: Generated Plan Preview */}
        <div className="planner-results-panel">
          {generatedPlan ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Plan Action Bar */}
              <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4 border border-sky-500/20 shadow-xl">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="badge badge-emerald flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Itinerary Ready</span>
                    </span>
                    <span className="badge badge-violet text-[11px]">
                      {generatedPlan.aiEngine}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    {generatedPlan.city} • {generatedPlan.daysCount} Days ({generatedPlan.totalPlaces}{' '}
                    Curated Stops)
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopySummary}
                    className="btn btn-secondary text-xs flex items-center gap-1.5 py-2 px-3"
                    title="Copy full itinerary summary to clipboard"
                  >
                    {copiedSummary ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                    <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="btn btn-secondary text-xs flex items-center gap-1.5 py-2 px-3"
                    title="Print or export as PDF"
                  >
                    <Printer size={14} />
                    <span>Print PDF</span>
                  </button>

                  <button
                    onClick={() => handleSaveToItinerary(false)}
                    disabled={savingPlan}
                    className="btn btn-primary text-xs flex items-center gap-1.5 py-2 px-4 shadow-lg shadow-sky-500/25"
                  >
                    <Check size={15} />
                    <span>{savingPlan ? 'Saving to Database...' : 'Add to My Trip'}</span>
                  </button>
                </div>
              </div>

              {/* Trip Narrative Summary */}
              {generatedPlan.summary && (
                <div className="glass-card p-5 border-l-4 border-l-sky-400">
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{generatedPlan.summary}"
                  </p>
                </div>
              )}

              {/* Live Weather Forecast Ribbon */}
              {generatedPlan.weatherForecast && (
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <CloudSun size={18} className="text-amber-400" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Destination Climate & Travel Forecast
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Thermometer size={13} className="text-sky-400" />
                        <span>
                          Current: {Math.round(generatedPlan.weatherForecast.currentTemp)}°C (
                          {generatedPlan.weatherForecast.conditionText})
                        </span>
                      </span>
                      {generatedPlan.weatherForecast.windspeed !== undefined && (
                        <span className="flex items-center gap-1">
                          <Wind size={13} className="text-teal-400" />
                          <span>{generatedPlan.weatherForecast.windspeed} km/h wind</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {generatedPlan.weatherForecast.forecastDays && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {generatedPlan.weatherForecast.forecastDays.map((fd, idx) => (
                        <div key={idx} className="weather-day-chip">
                          <span className="text-[11px] text-slate-400 block font-medium">
                            Day {idx + 1} ({fd.date.slice(5)})
                          </span>
                          <span className="text-sm font-bold text-white block mt-0.5">
                            {Math.round(fd.maxTemp)}° / {Math.round(fd.minTemp)}°C
                          </span>
                          <span className="text-[11px] text-sky-400 truncate block mt-0.5">
                            {fd.conditionText}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Regional Culinary & Dining Guide */}
              {generatedPlan.diningHighlights && generatedPlan.diningHighlights.length > 0 && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils size={18} className="text-amber-400" />
                    <div>
                      <h4 className="text-base font-bold text-white">
                        Authentic Regional Culinary Guide
                      </h4>
                      <p className="text-xs text-slate-400">
                        Iconic local specialties not to be missed during your stay in{' '}
                        {generatedPlan.city}.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {generatedPlan.diningHighlights.map((dish, i) => (
                      <div key={i} className="culinary-dish-card">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="font-bold text-white text-sm">{dish.dish}</h5>
                          <span className="badge badge-amber text-[10px] py-0.5 px-2 shrink-0">
                            {dish.bestTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">
                          {dish.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultural Etiquette & Local Wisdom */}
              {generatedPlan.culturalEtiquette && generatedPlan.culturalEtiquette.length > 0 && (
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={17} className="text-amber-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Cultural Etiquette & Practical Travel Tips
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {generatedPlan.culturalEtiquette.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day Breakdown Cards */}
              <div className="space-y-6">
                {generatedPlan.days.map(day => (
                  <div key={day.dayNumber} className="glass-card p-6 border border-slate-800">
                    <div className="border-b border-slate-800/80 pb-3.5 mb-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-extrabold text-sky-400 uppercase tracking-wider">
                            Day {day.dayNumber}
                          </span>
                          {day.totalTransitKm !== undefined && day.totalTransitKm > 0 && (
                            <span className="badge badge-blue text-[10px] py-0.5 px-2 flex items-center gap-1">
                              <Navigation size={10} />
                              <span>~{day.totalTransitKm} km total daily route</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-white">{day.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{day.theme}</p>
                      </div>
                    </div>

                    {/* Day Insider Tip */}
                    {day.insiderTip && (
                      <div className="insider-tip-pill mb-4 flex items-center gap-2 text-xs">
                        <Lightbulb size={14} className="text-amber-400 shrink-0" />
                        <span className="text-slate-300">
                          <strong className="text-amber-300 font-semibold">Insider Tip: </strong>
                          {day.insiderTip}
                        </span>
                      </div>
                    )}

                    {/* Day Stops with Transit Connector */}
                    <div className="space-y-3">
                      {day.items.map((item, idx) => (
                        <React.Fragment key={item.destination.id}>
                          {/* Transit Connector between items */}
                          {idx > 0 && item.transitFromPrevKm !== undefined && (
                            <div className="transit-connector-bar">
                              <div className="transit-connector-line" />
                              <div className="transit-connector-badge">
                                <Navigation size={10} className="text-sky-400" />
                                <span>
                                  {item.transitFromPrevKm} km • ~{item.transitTimeMin || 10} min
                                  transit
                                </span>
                              </div>
                              <div className="transit-connector-line" />
                            </div>
                          )}

                          <div className="plan-item-row group">
                            <img
                              src={
                                item.destination.imageUrl ||
                                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85'
                              }
                              alt={item.destination.name}
                              className="plan-item-img"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`badge text-xs py-0.5 px-2 ${
                                    item.timeSlot === 'Morning'
                                      ? 'badge-amber'
                                      : item.timeSlot === 'Afternoon'
                                      ? 'badge-blue'
                                      : 'badge-violet'
                                  }`}
                                >
                                  {item.timeSlot}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {item.destination.category}
                                </span>
                                {item.destination.rating && (
                                  <span className="text-xs text-amber-300 font-bold">
                                    ★ {item.destination.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>

                              <h5 className="font-bold text-white text-base truncate mt-1">
                                {item.destination.name}
                              </h5>
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {item.destination.address || item.destination.city}
                              </p>
                              <p className="text-xs text-sky-200/80 mt-1.5 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                                {item.suggestionNote}
                              </p>
                            </div>

                            <button
                              onClick={() => removeItemFromPlan(day.dayNumber, item.destination.id)}
                              className="text-slate-500 hover:text-rose-400 p-2 transition-colors self-start"
                              title="Remove this suggestion"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[480px]">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4 shadow-lg shadow-violet-500/10">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to Plan</h3>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                Choose any city on Earth, select your travel duration (1–7 days), and click{' '}
                <strong className="text-white">"Generate Itinerary"</strong>. Voyora will assemble
                curated destinations, live weather, and culinary secrets.
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
          margin-bottom: 28px;
        }
        .planner-grid {
          display: grid;
          grid-template-columns: 1fr 1.45fr;
          gap: 28px;
        }
        @media (max-width: 980px) {
          .planner-grid {
            grid-template-columns: 1fr;
          }
        }
        .ai-settings-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 9999px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #fbbf24;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ai-settings-toggle-btn:hover {
          background: rgba(245, 158, 11, 0.18);
          border-color: rgba(245, 158, 11, 0.5);
        }
        .ai-settings-card {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.05);
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
          gap: 5px;
          flex-wrap: wrap;
        }
        .city-preset-btn {
          font-size: 0.72rem;
          padding: 3px 9px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .city-preset-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }
        .city-preset-btn.active {
          background: rgba(14, 165, 233, 0.2);
          border-color: var(--primary);
          color: #38bdf8;
          font-weight: 600;
        }
        .days-selector-strip {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }
        .day-count-btn {
          padding: 10px 4px;
          text-align: center;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .day-count-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }
        .day-count-btn.active {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.3), rgba(99, 102, 241, 0.3));
          border-color: var(--primary);
          color: #ffffff;
        }
        .pace-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .pace-card {
          padding: 10px 8px;
          text-align: center;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .pace-card:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .pace-card.active {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.5);
        }
        .interest-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .interest-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }
        .interest-chip.active {
          background: rgba(14, 165, 233, 0.15);
          border-color: rgba(14, 165, 233, 0.4);
          color: #38bdf8;
          font-weight: 600;
        }
        .plan-item-row {
          display: flex;
          gap: 14px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          align-items: flex-start;
          transition: all 0.2s ease;
        }
        .plan-item-row:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .plan-item-img {
          width: 72px;
          height: 72px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
          background: #1e293b;
        }
        .weather-day-chip {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          padding: 8px 10px;
          text-align: center;
        }
        .culinary-dish-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(245, 158, 11, 0.15);
          border-radius: 12px;
          padding: 12px 14px;
        }
        .insider-tip-pill {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 10px;
          padding: 8px 12px;
        }
        .transit-connector-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
        }
        .transit-connector-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }
        .transit-connector-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.68rem;
          color: #94a3b8;
          background: rgba(14, 165, 233, 0.08);
          border: 1px dashed rgba(14, 165, 233, 0.25);
          padding: 2px 8px;
          border-radius: 9999px;
        }

        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .planner-header,
          .planner-config-panel,
          .ai-settings-toggle-btn,
          .ai-settings-card,
          nav,
          footer,
          .btn {
            display: none !important;
          }
          .planner-grid {
            display: block !important;
          }
          .planner-results-panel {
            width: 100% !important;
          }
          .glass-card, .glass-panel {
            background: transparent !important;
            border: 1px solid #ddd !important;
            color: #000 !important;
            box-shadow: none !important;
          }
          .text-white {
            color: #000 !important;
          }
          .text-slate-400, .text-slate-300 {
            color: #444 !important;
          }
        }
      `}</style>
    </div>
  );
};
