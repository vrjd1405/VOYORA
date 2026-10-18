import React, { useState } from 'react';
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
  ShieldCheck,
  Navigation,
  Thermometer,
  Wind,
  CheckCircle2,
  ArrowRight,
  Globe,
  Coffee,
  Zap,
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
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<SmartPlanResponse | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const { refreshTrip } = useTrip();
  const toast = useToast();

  const presetGroups = [
    {
      group: 'Tamil Nadu & South India',
      theme: 'emerald',
      cities: [
        'Madurai',
        'Chennai',
        'Pondicherry',
        'Tirunelveli',
        'Kumbakonam',
        'Ooty',
        'Coimbatore',
        'Mahabalipuram',
        'Thanjavur',
        'Kanyakumari',
        'Kodaikanal',
        'Rameswaram',
        'Bengaluru',
        'Kochi',
      ],
    },
    {
      group: 'Pan-India Highlights',
      theme: 'amber',
      cities: ['Jaipur', 'Delhi', 'Mumbai', 'Varanasi', 'Amritsar', 'Udaipur', 'Agra', 'Goa', 'Hyderabad'],
    },
    {
      group: 'Global Realms & Wonders',
      theme: 'sky',
      cities: [
        'Zermatt',
        'Paris',
        'Tokyo',
        'Rome',
        'Cairo',
        'Singapore',
        'Santorini',
        'Kyoto',
        'London',
        'Dubai',
        'Sydney',
        'Amsterdam',
      ],
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

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (generatedPlan && generatedPlan.city.toLowerCase() !== newCity.trim().toLowerCase()) {
      setGeneratedPlan(null);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      toast.error('City Required', 'Please enter or select a destination city.');
      return;
    }
    setLoading(true);
    try {
      const plan = await api.generateSmartPlan({
        city: city.trim(),
        days,
        interests: selectedInterests,
        pace,
      });
      setGeneratedPlan(plan);
      toast.success(
        'Itinerary Synthesized',
        `Crafted custom ${plan.daysCount}-day journey for ${plan.city} with ${plan.totalPlaces} curated destinations.`
      );
    } catch (err: any) {
      toast.error('Planning Error', err.message || 'Failed to synthesize itinerary.');
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
              f => `  • ${f.dish} (${f.bestTime}): ${f.description}` + (f.recommendedPlaces && f.recommendedPlaces.length > 0 ? ` [Best Places: ${f.recommendedPlaces.join(', ')}]` : '')
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
        const remainingItems = d.items.filter(item => item.destination.id !== destId);
        let dayTotalKm = 0;
        let prevItem: typeof remainingItems[0] | null = null;

        const recomputedItems = remainingItems.map((item, idx) => {
          if (idx === 0 || !prevItem) {
            prevItem = item;
            return { ...item, transitFromPrevKm: undefined, transitTimeMin: undefined };
          }

          let transitFromPrevKm: number | undefined = undefined;
          let transitTimeMin: number | undefined = undefined;

          if (
            prevItem.destination.lat &&
            prevItem.destination.lng &&
            item.destination.lat &&
            item.destination.lng
          ) {
            const transit = api.calculateRoadDistanceAndTransit(
              prevItem.destination.lat,
              prevItem.destination.lng,
              item.destination.lat,
              item.destination.lng
            );
            transitFromPrevKm = transit.distanceKm;
            transitTimeMin = transit.transitTimeMin;
            dayTotalKm += transitFromPrevKm;
          }

          prevItem = item;
          return {
            ...item,
            transitFromPrevKm,
            transitTimeMin,
          };
        });

        return {
          ...d,
          items: recomputedItems,
          totalTransitKm: Math.round(dayTotalKm * 10) / 10,
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
    <div className="planner-sky-theme-wrapper">
      <div className="planner-page-root container relative z-10">
        {/* Top Luxury Banner */}
        <div className="planner-header">
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
            <div className="planner-luxury-pill">
              <Sparkles size={13} className="text-amber-300" />
              <span className="pill-text-gold">VOYORA AI EXPEDITION ARCHITECT</span>
            </div>
            <span className="planner-status-pill">
              <ShieldCheck size={13} className="text-emerald-300" />
              <span className="pill-text-emerald">100% Strict City Isolation</span>
            </span>
            <span className="planner-sky-pill">
              <CloudSun size={13} className="text-sky-300" />
              <span className="pill-text-sky">Real-Time Atmosphere Engine</span>
            </span>
          </div>

          <h1 className="planner-main-title">
            Smart <span className="title-sky-gradient">Journey Architect</span>
          </h1>
          <p className="planner-main-subtitle">
            Curate bespoke voyages with <span className="highlight-sky">precise geographic boundaries</span>, tailored <span className="highlight-amber">travel cadence</span>, and rich <span className="highlight-violet">cultural atmosphere</span>. Voyora orchestrates authentic landmarks, real-time <span className="highlight-cyan">meteorological intelligence</span>, dynamic <span className="highlight-emerald">transit routing</span>, and authentic <span className="highlight-coral">regional gastronomy</span> with <span className="highlight-gold-pill">100% Strict City Isolation</span>.
          </p>
        </div>

      <div className="planner-grid">
        {/* Left Column: Premium Configuration Form */}
        <div className="planner-config-panel">
          <form onSubmit={handleGenerate} className="planner-form-body">
            {/* Destination Selection */}
            <div>
              <label className="config-label label-theme-sky">
                <span className="config-label-icon"><MapPin size={15} /></span>
                <span className="config-label-text">
                  Destination City <span className="config-label-sub">(& Geographic Realm)</span>
                </span>
              </label>

              {/* Grouped City Presets */}
              <div className="preset-groups-container">
                {presetGroups.map(pg => (
                  <div key={pg.group} className="preset-group-block">
                    <div className={`preset-group-header theme-${pg.theme}`}>
                      <span className="group-accent-dot" />
                      <span className="preset-group-title">{pg.group}</span>
                    </div>
                    <div className="city-presets-row">
                      {pg.cities.map(c => {
                        const isActive = city.toLowerCase() === c.toLowerCase();
                        return (
                          <button
                            type="button"
                            key={c}
                            onClick={() => handleCityChange(c)}
                            className={`city-preset-btn ${isActive ? 'active' : ''}`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Input */}
              <div className="custom-city-input-wrap">
                <Globe size={16} className="city-input-icon" />
                <input
                  type="text"
                  value={city}
                  onChange={e => handleCityChange(e.target.value)}
                  placeholder="Or type any global city (e.g. Zurich, Lucerne, Cairo, Kyoto, Salem)..."
                  required
                  className="config-input"
                />
              </div>
            </div>

            {/* Travel Days (1 to 7) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="config-label label-theme-amber mb-0">
                  <span className="config-label-icon"><Calendar size={15} /></span>
                  <span className="config-label-text">
                    Travel Duration: <strong className="highlight-amber-bold">{days} {days === 1 ? 'Travel Day' : 'Travel Days'}</strong>
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

            {/* Travel Pace / Cadence */}
            <div>
              <label className="config-label label-theme-emerald">
                <span className="config-label-icon"><Clock size={15} /></span>
                <span className="config-label-text">
                  Travel Cadence <span className="config-label-sub">(Pacing Intensity)</span>
                </span>
              </label>
              <div className="pace-grid">
                {[
                  { id: 'relaxed', label: 'Relaxed', desc: '2 stops / day', icon: Coffee, theme: 'amber' },
                  { id: 'balanced', label: 'Balanced', desc: '3 stops / day', icon: Compass, theme: 'sky' },
                  { id: 'fast-paced', label: 'Fast-Paced', desc: '4 stops / day', icon: Zap, theme: 'violet' },
                ].map(p => {
                  const IconComp = p.icon;
                  const active = pace === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPace(p.id as any)}
                      className={`pace-card pace-theme-${p.theme} ${active ? 'active' : ''}`}
                    >
                      <div className="pace-icon-wrap">
                        <IconComp size={16} />
                      </div>
                      <span className="pace-label">{p.label}</span>
                      <span className="pace-desc">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cultural & Travel Interests */}
            <div>
              <label className="config-label label-theme-violet">
                <span className="config-label-icon"><Compass size={15} /></span>
                <span className="config-label-text">
                  Selected Atmosphere <span className="config-label-sub">(& Personal Interests)</span>
                </span>
              </label>
              <div className="interests-flex-wrap">
                {interestOptions.map(interest => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`interest-chip ${active ? 'active' : ''}`}
                    >
                      {active && <Check size={12} className="interest-check-icon" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="planner-generate-btn"
            >
              <div className="btn-shimmer" />
              <Sparkles size={18} className={loading ? 'animate-spin text-amber-300' : 'text-amber-300'} />
              <span className="btn-label">
                {loading
                  ? `Synthesizing ${city} Itinerary...`
                  : `Generate ${city} Itinerary`}
              </span>
              <ArrowRight size={17} className="btn-arrow" />
            </button>
          </form>
        </div>

        {/* Right Column: Generated Plan or Luxury Studio Preview */}
        <div className="planner-results-panel">
          {generatedPlan ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Plan Action Bar */}
              <div className="plan-summary-action-bar">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="badge-ready">
                      <CheckCircle2 size={12} />
                      <span>Itinerary Synthesized</span>
                    </span>
                    <span className="badge-luxury flex items-center gap-1.5">
                      <Zap size={11} className="text-amber-400" />
                      <span>{generatedPlan.aiEngine || 'Voyora Intelligence'}</span>
                    </span>
                  </div>
                  <h3 className="plan-summary-title">
                    {generatedPlan.city} • {generatedPlan.daysCount} Days ({generatedPlan.totalPlaces} Curated Stops)
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopySummary}
                    className="plan-action-btn"
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
                    className="plan-action-btn"
                    title="Print or export as PDF"
                  >
                    <Printer size={14} />
                    <span>Print PDF</span>
                  </button>

                  <button
                    onClick={() => handleSaveToItinerary(false)}
                    disabled={savingPlan}
                    className="plan-save-btn"
                  >
                    <Check size={15} />
                    <span>{savingPlan ? 'Saving to Database...' : 'Add to My Trip'}</span>
                  </button>
                </div>
              </div>

              {/* Trip Narrative Summary */}
              {generatedPlan.summary && (
                <div className="plan-narrative-card">
                  <p className="plan-narrative-text">
                    "{generatedPlan.summary}"
                  </p>
                </div>
              )}

              {/* Live Weather Forecast Ribbon */}
              {generatedPlan.weatherForecast && (
                <div className="plan-weather-card">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <CloudSun size={18} className="text-amber-400" />
                      <h4 className="weather-card-title">
                        Destination Climate & Meteorological Forecast
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
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
                          <span className="weather-day-label">
                            Day {idx + 1} ({fd.date.slice(5)})
                          </span>
                          <span className="weather-temp-range">
                            {Math.round(fd.maxTemp)}° / {Math.round(fd.minTemp)}°C
                          </span>
                          <span className="weather-cond-text truncate">
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
                <div className="plan-culinary-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils size={18} className="text-amber-400" />
                    <div>
                      <h4 className="culinary-card-title">
                        Authentic Regional Culinary Guide
                      </h4>
                      <p className="culinary-card-desc">
                        Iconic local specialties not to be missed during your journey in {generatedPlan.city}.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {generatedPlan.diningHighlights.map((dish, i) => (
                      <div key={i} className="culinary-dish-card">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="dish-name">{dish.dish}</h5>
                          <span className="dish-time-badge">
                            {dish.bestTime}
                          </span>
                        </div>
                        <p className="dish-desc">
                          {dish.description}
                        </p>
                        {dish.recommendedPlaces && dish.recommendedPlaces.length > 0 && (
                          <div className="dish-places-box">
                            <div className="dish-places-label">
                              <MapPin size={11} className="text-amber-300 flex-shrink-0" />
                              <span>Best Places in {generatedPlan.city}:</span>
                            </div>
                            <div className="dish-places-list">
                              {dish.recommendedPlaces.map((place, pIdx) => (
                                <span key={pIdx} className="culinary-place-pill">
                                  {place}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultural Etiquette & Local Wisdom */}
              {generatedPlan.culturalEtiquette && generatedPlan.culturalEtiquette.length > 0 && (
                <div className="plan-etiquette-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={17} className="text-amber-400" />
                    <h4 className="etiquette-card-title">
                      Cultural Etiquette & Practical Travel Tips
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {generatedPlan.culturalEtiquette.map((tip, idx) => (
                      <div key={idx} className="etiquette-tip-row">
                        <div className="etiquette-bullet" />
                        <span className="leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day Breakdown Cards */}
              <div className="space-y-6">
                {generatedPlan.days.map(day => (
                  <div key={day.dayNumber} className="day-breakdown-card">
                    <div className="day-card-header">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="day-number-pill">
                            Day {day.dayNumber}
                          </span>
                          {day.totalTransitKm !== undefined && day.totalTransitKm > 0 && (
                            <span className="day-transit-pill">
                              <Navigation size={10} />
                              <span>~{day.totalTransitKm} km total daily route</span>
                            </span>
                          )}
                        </div>
                        <h4 className="day-title">{day.title}</h4>
                        <p className="day-theme">{day.theme}</p>
                      </div>
                    </div>

                    {/* Day Insider Tip */}
                    {day.insiderTip && (
                      <div className="day-insider-tip">
                        <Lightbulb size={14} className="text-amber-400 shrink-0" />
                        <span>
                          <strong className="text-amber-300">Insider Tip: </strong>
                          {day.insiderTip}
                        </span>
                      </div>
                    )}

                    {/* Day Stops with Transit Connector */}
                    <div className="space-y-3">
                      {day.items.map((item, idx) => (
                        <React.Fragment key={item.destination.id}>
                          {idx > 0 && item.transitFromPrevKm !== undefined && (
                            <div className="transit-connector-bar">
                              <div className="transit-connector-line" />
                              <div className="transit-connector-badge">
                                <Navigation size={10} className="text-sky-400" />
                                <span>
                                  {item.transitFromPrevKm} km • ~{item.transitTimeMin || 10} min transit
                                </span>
                              </div>
                              <div className="transit-connector-line" />
                            </div>
                          )}

                          <div className="plan-item-row">
                            <img
                              src={
                                item.destination.imageUrl ||
                                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
                              }
                              alt={item.destination.name}
                              className="plan-item-img"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className={`timeslot-badge timeslot-${item.timeSlot?.toLowerCase() || 'morning'}`}>
                                  {item.timeSlot}
                                </span>
                                <span className="item-category-tag">
                                  {item.destination.category}
                                </span>
                                {item.destination.rating && (
                                  <span className="item-rating-tag">
                                    ★ {item.destination.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>

                              <h5 className="item-name truncate">
                                {item.destination.name}
                              </h5>
                              <p className="item-address truncate">
                                {item.destination.address || item.destination.city}
                              </p>
                              <p className="item-note">
                                {item.suggestionNote}
                              </p>
                            </div>

                            <button
                              onClick={() => removeItemFromPlan(day.dayNumber, item.destination.id)}
                              className="item-remove-btn"
                              title="Remove this suggestion"
                            >
                              <Trash2 size={15} />
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
            /* Luxury Executive Studio Canvas (Empty State) */
            <div className="planner-empty-studio">
              <div className="studio-icon-orb">
                <Sparkles size={36} className="orb-sparkle" />
              </div>
              <h3 className="studio-title">AI Expedition Studio</h3>
              <p className="studio-subtitle">
                Select your desired <span className="highlight-sky">destination</span>, <span className="highlight-amber">cadence</span>, and <span className="highlight-emerald">atmosphere</span> on the left to synthesize a complete custom journey with verified landmarks, live climate metrics, and culinary secrets.
              </p>

              <div className="studio-grid-features">
                <div className="studio-feature-card feat-emerald">
                  <div className="feat-header">
                    <div className="feat-icon-badge"><ShieldCheck size={14} /></div>
                    <span className="feat-title">Strict City Isolation</span>
                  </div>
                  <p className="feat-desc">
                    Zero cross-city contamination. Every curated waypoint belongs strictly to your chosen city bounds.
                  </p>
                </div>

                <div className="studio-feature-card feat-amber">
                  <div className="feat-header">
                    <div className="feat-icon-badge"><CloudSun size={14} /></div>
                    <span className="feat-title">Live Satellite Climate</span>
                  </div>
                  <p className="feat-desc">
                    Real-time Open-Meteo forecasts with temperature range, condition metrics, and clothing suggestions.
                  </p>
                </div>

                <div className="studio-feature-card feat-sky">
                  <div className="feat-header">
                    <div className="feat-icon-badge"><Navigation size={14} /></div>
                    <span className="feat-title">Transit Intelligence</span>
                  </div>
                  <p className="feat-desc">
                    Geoapify synchronized waypoint sequencing with realistic route transit kilometers and travel times.
                  </p>
                </div>

                <div className="studio-feature-card feat-coral">
                  <div className="feat-header">
                    <div className="feat-icon-badge"><Utensils size={14} /></div>
                    <span className="feat-title">Regional Gastronomy</span>
                  </div>
                  <p className="feat-desc">
                    Authentic local cuisine suggestions matched to morning, lunch, and dinner with cultural dining tips.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      <style>{`
        /* Sky & Cloud Theme Wrapper */
        .planner-sky-theme-wrapper {
          position: relative;
          min-height: 100vh;
        }
        .planner-sky-backdrop,
        .planner-sky-sunbeam-glow,
        .planner-sky-cloud-mist {
          display: none !important;
        }

        .planner-page-root {
          padding-top: 36px;
          padding-bottom: 100px;
        }

        /* Ultra High-Contrast Luxury Header Plaque */
        .planner-header {
          margin-bottom: 34px;
          background: linear-gradient(165deg, #07152e 0%, #040c1c 100%) !important;
          border: 2px solid #38bdf8 !important;
          border-radius: 24px;
          padding: 34px 38px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.3) !important;
        }
        .planner-luxury-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 16px;
          border-radius: 9999px;
          background: #0d2249;
          border: 1.5px solid #fbbf24;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.45);
        }
        .pill-text-gold {
          color: #fde047;
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-shadow: 0 0 10px rgba(253, 224, 71, 0.6);
        }
        .planner-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 15px;
          border-radius: 9999px;
          background: #064e3b;
          border: 1.5px solid #34d399;
          box-shadow: 0 0 18px rgba(52, 211, 153, 0.45);
        }
        .pill-text-emerald {
          color: #4ade80;
          font-size: 0.82rem;
          font-weight: 900;
          text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
        }
        .planner-sky-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 15px;
          border-radius: 9999px;
          background: #0c4a6e;
          border: 1.5px solid #38bdf8;
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.45);
        }
        .pill-text-sky {
          color: #7dd3fc;
          font-size: 0.82rem;
          font-weight: 900;
          text-shadow: 0 0 10px rgba(125, 211, 252, 0.6);
        }

        .planner-main-title {
          font-size: 3.2rem;
          font-weight: 900;
          color: #ffffff !important;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
          line-height: 1.15;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.95);
        }
        .title-sky-gradient {
          background: linear-gradient(135deg, #ffffff 10%, #38bdf8 55%, #fde047 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 25px rgba(56, 189, 248, 0.75));
        }
        .planner-main-subtitle {
          color: #ffffff !important;
          font-size: 1.15rem;
          max-width: 880px;
          line-height: 1.8;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
          font-weight: 600;
        }
        .highlight-sky {
          color: #38bdf8 !important;
          font-weight: 900;
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.7);
        }
        .highlight-cyan {
          color: #00f0ff !important;
          font-weight: 900;
          text-shadow: 0 0 12px rgba(0, 240, 255, 0.8);
        }
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
        }
        .highlight-amber {
          color: #fbbf24;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
        }
        .highlight-emerald {
          color: #4ade80;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
        }
        .highlight-violet {
          color: #c084fc;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(192, 132, 252, 0.6);
        }
        .highlight-coral {
          color: #fb7185;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(251, 113, 133, 0.6);
        }
        .highlight-gold {
          color: #fde047;
          font-weight: 900;
          text-shadow: 0 0 14px rgba(253, 224, 71, 0.7);
        }
        .highlight-gold-pill {
          display: inline-block;
          color: #fde047;
          background: rgba(245, 158, 11, 0.28);
          border: 1.5px solid #fbbf24;
          padding: 2px 10px;
          border-radius: 9999px;
          font-weight: 900;
          font-size: 0.9rem;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.45);
          margin-left: 4px;
        }
        .highlight-amber-bold {
          color: #fde047;
          font-weight: 900;
        }

        @media (max-width: 640px) {
          .planner-main-title {
            font-size: 2.3rem;
          }
          .planner-header {
            padding: 24px 20px;
          }
        }
        .planner-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 32px;
        }
        @media (max-width: 1040px) {
          .planner-grid {
            grid-template-columns: 1fr;
          }
        }

        /* High-Contrast Left Configuration Panel */
        .planner-config-panel {
          background: linear-gradient(165deg, #091a38 0%, #061226 100%) !important;
          border: 2px solid rgba(56, 189, 248, 0.45) !important;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.25) !important;
          height: fit-content;
        }
        .planner-form-body {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .config-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }
        .config-label-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .label-theme-sky .config-label-icon {
          background: rgba(14, 165, 233, 0.35);
          color: #38bdf8;
          border: 1.5px solid #38bdf8;
        }
        .label-theme-amber .config-label-icon {
          background: rgba(245, 158, 11, 0.35);
          color: #fbbf24;
          border: 1.5px solid #fbbf24;
        }
        .label-theme-emerald .config-label-icon {
          background: rgba(16, 185, 129, 0.35);
          color: #34d399;
          border: 1.5px solid #34d399;
        }
        .label-theme-violet .config-label-icon {
          background: rgba(139, 92, 246, 0.35);
          color: #c084fc;
          border: 1.5px solid #c084fc;
        }
        .config-label-text {
          color: #ffffff;
          font-weight: 900;
        }
        .config-label-sub {
          font-weight: 700;
          font-size: 0.85rem;
          color: #7dd3fc;
          margin-left: 6px;
        }

        /* Preset Groups */
        .preset-groups-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 16px;
        }
        .preset-group-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .preset-group-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .group-accent-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .theme-emerald .group-accent-dot {
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80;
        }
        .theme-emerald .preset-group-title {
          color: #4ade80 !important;
          font-weight: 900 !important;
          font-size: 0.82rem !important;
          letter-spacing: 0.08em;
          text-shadow: 0 0 12px rgba(74, 222, 128, 0.5);
        }
        .theme-amber .group-accent-dot {
          background: #fbbf24;
          box-shadow: 0 0 10px #fbbf24;
        }
        .theme-amber .preset-group-title {
          color: #fbbf24 !important;
          font-weight: 900 !important;
          font-size: 0.82rem !important;
          letter-spacing: 0.08em;
          text-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
        }
        .theme-sky .group-accent-dot {
          background: #38bdf8;
          box-shadow: 0 0 10px #38bdf8;
        }
        .theme-sky .preset-group-title {
          color: #38bdf8 !important;
          font-weight: 900 !important;
          font-size: 0.82rem !important;
          letter-spacing: 0.08em;
          text-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
        }
        .preset-group-title {
          font-size: 0.78rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .city-presets-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .city-preset-btn {
          font-size: 0.88rem !important;
          padding: 8px 15px !important;
          border-radius: 10px !important;
          background: #0e2248 !important;
          border: 1.5px solid rgba(125, 211, 252, 0.45) !important;
          color: #ffffff !important;
          cursor: pointer;
          font-weight: 800 !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5) !important;
          letter-spacing: 0.01em;
        }
        .city-preset-btn:hover {
          color: #ffffff !important;
          background: #0284c7 !important;
          border-color: #38bdf8 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(56, 189, 248, 0.5) !important;
        }
        .city-preset-btn.active {
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%) !important;
          border: 2px solid #fde047 !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          box-shadow: 0 0 22px rgba(14, 165, 233, 0.9), 0 0 12px rgba(253, 224, 71, 0.8) !important;
          transform: translateY(-2px);
        }

        /* Custom Input */
        .custom-city-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .city-input-icon {
          position: absolute;
          left: 15px;
          color: #38bdf8;
          pointer-events: none;
        }
        .config-input {
          width: 100%;
          padding: 14px 14px 14px 46px;
          border-radius: 12px;
          background: #050e1f !important;
          border: 2px solid #38bdf8 !important;
          color: #ffffff !important;
          font-size: 1.05rem !important;
          font-weight: 800 !important;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6);
        }
        .config-input:focus {
          border-color: #fde047 !important;
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.8), inset 0 2px 6px rgba(0, 0, 0, 0.6) !important;
          background: #07142b !important;
        }
        .config-input::placeholder {
          color: #93c5fd !important;
          opacity: 0.85;
          font-weight: 600;
        }

        /* Day Selector */
        .days-selector-strip {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 7px;
        }
        .day-count-btn {
          padding: 13px 4px;
          text-align: center;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 900;
          background: #0e2248;
          border: 1.5px solid rgba(125, 211, 252, 0.4);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .day-count-btn:hover {
          background: #0284c7;
          color: #ffffff;
          border-color: #38bdf8;
          transform: translateY(-2px);
        }
        .day-count-btn.active {
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          border: 2px solid #fde047;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.8), 0 0 10px rgba(253, 224, 71, 0.6);
          transform: translateY(-2px);
        }

        /* Pace Grid */
        .pace-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .pace-card {
          padding: 16px 12px;
          text-align: center;
          border-radius: 14px;
          background: #0e2248;
          border: 1.5px solid rgba(125, 211, 252, 0.35);
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
        }
        .pace-card:hover {
          background: #112854;
          border-color: #38bdf8;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
        }
        .pace-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          color: #93c5fd;
          transition: all 0.2s ease;
        }
        .pace-label {
          font-weight: 800;
          color: #ffffff;
          font-size: 0.96rem;
        }
        .pace-desc {
          font-size: 0.8rem;
          color: #cbd5e1;
          font-weight: 600;
        }

        /* Pace Active Themes */
        .pace-theme-amber.active {
          background: rgba(245, 158, 11, 0.28) !important;
          border: 2px solid #fbbf24 !important;
          box-shadow: 0 0 22px rgba(245, 158, 11, 0.5) !important;
        }
        .pace-theme-amber.active .pace-label {
          color: #fde047 !important;
        }
        .pace-theme-amber.active .pace-desc {
          color: #fef08a !important;
        }
        .pace-theme-amber.active .pace-icon-wrap {
          background: rgba(245, 158, 11, 0.35);
          color: #fbbf24;
        }

        .pace-theme-sky.active {
          background: rgba(14, 165, 233, 0.28) !important;
          border: 2px solid #38bdf8 !important;
          box-shadow: 0 0 22px rgba(56, 189, 248, 0.5) !important;
        }
        .pace-theme-sky.active .pace-label {
          color: #7dd3fc !important;
        }
        .pace-theme-sky.active .pace-desc {
          color: #e0f2fe !important;
        }
        .pace-theme-sky.active .pace-icon-wrap {
          background: rgba(14, 165, 233, 0.35);
          color: #38bdf8;
        }

        .pace-theme-violet.active {
          background: rgba(168, 85, 247, 0.28) !important;
          border: 2px solid #c084fc !important;
          box-shadow: 0 0 22px rgba(168, 85, 247, 0.5) !important;
        }
        .pace-theme-violet.active .pace-label {
          color: #e9d5ff !important;
        }
        .pace-theme-violet.active .pace-desc {
          color: #f3e8ff !important;
        }
        .pace-theme-violet.active .pace-icon-wrap {
          background: rgba(139, 92, 246, 0.35);
          color: #c084fc;
        }

        /* Interest Chips */
        .interests-flex-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }
        .interest-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.86rem;
          padding: 9px 16px;
          border-radius: 9999px;
          background: #0e2248;
          border: 1.5px solid rgba(125, 211, 252, 0.4);
          color: #ffffff;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .interest-chip:hover {
          background: #0284c7;
          color: #ffffff;
          border-color: #38bdf8;
          transform: translateY(-1.5px);
        }
        .interest-chip.active {
          background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%) !important;
          border: 2px solid #38bdf8 !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.7) !important;
          transform: translateY(-1.5px);
        }
        .interest-check-icon {
          color: #38bdf8;
        }

        /* Generate CTA Button */
        .planner-generate-btn {
          width: 100%;
          padding: 18px 24px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%);
          border: 2px solid #fde047;
          color: #ffffff;
          font-size: 1.15rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 14px 40px rgba(2, 132, 199, 0.75), 0 0 25px rgba(253, 224, 71, 0.5);
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.02em;
        }
        .btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .planner-generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 18px 50px rgba(37, 99, 235, 0.85), 0 0 35px rgba(253, 224, 71, 0.7);
          filter: brightness(1.1);
        }
        .planner-generate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* High-Contrast Right Studio Canvas */
        .planner-empty-studio {
          background: linear-gradient(165deg, #091a38 0%, #061226 100%) !important;
          border: 2px solid rgba(56, 189, 248, 0.45) !important;
          border-radius: 24px;
          padding: 48px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-height: 540px;
          justify-content: center;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.25) !important;
          position: relative;
          overflow: hidden;
        }
        .studio-icon-orb {
          width: 86px;
          height: 86px;
          border-radius: 26px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.35) 0%, rgba(245, 158, 11, 0.35) 100%);
          border: 2px solid #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
          margin-bottom: 22px;
          box-shadow: 0 0 40px rgba(56, 189, 248, 0.6);
          animation: floatOrb 4s ease-in-out infinite;
          position: relative;
        }
        .orb-sparkle {
          color: #fde047;
          filter: drop-shadow(0 0 8px #fde047);
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        .studio-title {
          font-size: 1.9rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 10px;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.8);
        }
        .studio-subtitle {
          color: #f8fafc;
          font-size: 1.05rem;
          max-width: 560px;
          line-height: 1.7;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
          font-weight: 500;
        }
        .studio-grid-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 34px;
          width: 100%;
          max-width: 640px;
          text-align: left;
        }
        @media (max-width: 640px) {
          .studio-grid-features {
            grid-template-columns: 1fr;
          }
        }
        .studio-feature-card {
          background: #0e2248;
          border: 1.5px solid rgba(186, 230, 253, 0.28);
          border-radius: 14px;
          padding: 20px 22px;
          transition: all 0.22s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }
        .studio-feature-card:hover {
          background: #112854;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.55);
          border-color: #38bdf8;
        }
        .feat-header {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 8px;
        }
        .feat-icon-badge {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feat-title {
          font-size: 0.88rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .feat-emerald {
          border-left: 4px solid #4ade80;
        }
        .feat-emerald .feat-title {
          color: #4ade80;
          text-shadow: 0 0 12px rgba(74, 222, 128, 0.5);
        }
        .feat-emerald .feat-icon-badge {
          color: #4ade80;
          background: rgba(74, 222, 128, 0.25);
        }
        .feat-amber {
          border-left: 4px solid #fbbf24;
        }
        .feat-amber .feat-title {
          color: #fde047;
          text-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
        }
        .feat-amber .feat-icon-badge {
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.25);
        }
        .feat-sky {
          border-left: 4px solid #38bdf8;
        }
        .feat-sky .feat-title {
          color: #38bdf8;
          text-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
        }
        .feat-sky .feat-icon-badge {
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.25);
        }
        .feat-coral {
          border-left: 4px solid #fb7185;
        }
        .feat-coral .feat-title {
          color: #fb7185;
          text-shadow: 0 0 12px rgba(251, 113, 133, 0.5);
        }
        .feat-coral .feat-icon-badge {
          color: #fb7185;
          background: rgba(251, 113, 133, 0.25);
        }
        .feat-desc {
          font-size: 0.86rem;
          color: #f8fafc;
          line-height: 1.6;
          font-weight: 500;
        }

        /* Plan Action Bar */
        .plan-summary-action-bar {
          background: linear-gradient(165deg, rgba(12, 28, 58, 0.9) 0%, rgba(8, 20, 46, 0.95) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(186, 230, 253, 0.3);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
        }
        .city-name-highlight {
          color: #7dd3fc;
          font-weight: 900;
        }
        .badge-ready {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .badge-luxury {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #a5b4fc;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .plan-summary-title {
          font-size: 1.55rem;
          font-weight: 800;
          color: #ffffff;
        }
        .plan-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f1f5f9;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .plan-action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }
        .plan-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);
          border: 1px solid rgba(56, 189, 248, 0.35);
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
          transition: all 0.2s ease;
        }
        .plan-save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }

        /* Narrative & Cards */
        .plan-narrative-card {
          background: #07152e !important;
          border: 1.5px solid rgba(56, 189, 248, 0.45) !important;
          border-left: 5px solid #38bdf8 !important;
          border-radius: 14px;
          padding: 20px 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65) !important;
        }
        .plan-narrative-text {
          font-size: 1.05rem !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          font-style: normal !important;
          line-height: 1.7;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
        }
        .plan-weather-card, .plan-culinary-card, .plan-etiquette-card, .day-breakdown-card {
          background: #07152e !important;
          border: 2px solid rgba(56, 189, 248, 0.45) !important;
          border-radius: 20px;
          padding: 24px 26px;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.75) !important;
        }
        .weather-card-title, .culinary-card-title, .etiquette-card-title {
          font-size: 1.05rem !important;
          font-weight: 900 !important;
          color: #ffffff !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
        }
        .culinary-card-desc {
          font-size: 0.9rem !important;
          color: #f1f5f9 !important;
          font-weight: 600 !important;
          margin-top: 3px;
        }
        .weather-day-chip {
          background: #0d2249 !important;
          border: 1.5px solid rgba(125, 211, 252, 0.4) !important;
          border-radius: 12px;
          padding: 12px;
          text-align: center;
        }
        .weather-day-label {
          font-size: 0.78rem !important;
          color: #cbd5e1 !important;
          display: block;
          font-weight: 700 !important;
        }
        .weather-temp-range {
          font-size: 1.15rem !important;
          font-weight: 900 !important;
          color: #ffffff !important;
          display: block;
          margin-top: 4px;
        }
        .weather-cond-text {
          font-size: 0.8rem !important;
          color: #38bdf8 !important;
          display: block;
          font-weight: 800 !important;
          margin-top: 2px;
        }
        .culinary-dish-card {
          background: #0d2249 !important;
          border: 1.5px solid rgba(251, 191, 36, 0.5) !important;
          border-radius: 14px;
          padding: 16px 18px;
        }
        .dish-name {
          font-size: 1.1rem !important;
          font-weight: 900 !important;
          color: #fde047 !important;
          text-shadow: 0 0 10px rgba(253, 224, 71, 0.5);
        }
        .dish-time-badge {
          font-size: 0.72rem !important;
          font-weight: 800 !important;
          padding: 3px 10px;
          border-radius: 10px;
          background: rgba(245, 158, 11, 0.28) !important;
          color: #fde047 !important;
          border: 1.5px solid #fbbf24 !important;
        }
        .dish-desc {
          font-size: 0.88rem !important;
          color: #ffffff !important;
          line-height: 1.6;
          margin-top: 6px;
          font-weight: 500;
        }
        .dish-places-box {
          margin-top: 10px;
          padding: 8px 12px;
          background: rgba(15, 23, 42, 0.7);
          border: 1px dashed rgba(251, 191, 36, 0.4);
          border-radius: 10px;
        }
        .dish-places-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.76rem;
          font-weight: 800;
          color: #fbbf24;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .dish-places-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .culinary-place-pill {
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #f1f5f9;
          background: rgba(245, 158, 11, 0.18);
          border: 1px solid rgba(251, 191, 36, 0.45);
          padding: 3px 9px;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }
        .culinary-place-pill:hover {
          background: rgba(245, 158, 11, 0.35);
          border-color: #fde047;
          color: #ffffff;
        }
        .etiquette-tip-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem !important;
          color: #ffffff !important;
          font-weight: 600;
        }
        .etiquette-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fbbf24;
          box-shadow: 0 0 10px #fbbf24;
          margin-top: 7px;
          flex-shrink: 0;
        }
        .day-card-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 14px;
          margin-bottom: 16px;
        }
        .day-number-pill {
          font-size: 0.82rem !important;
          font-weight: 900 !important;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #38bdf8 !important;
          background: rgba(56, 189, 248, 0.18);
          border: 1px solid rgba(56, 189, 248, 0.4);
          padding: 3px 10px;
          border-radius: 8px;
        }
        .day-transit-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem !important;
          font-weight: 800 !important;
          padding: 3px 10px;
          border-radius: 10px;
          background: rgba(14, 165, 233, 0.2);
          border: 1px solid #38bdf8;
          color: #7dd3fc;
        }
        .day-title {
          font-size: 1.55rem !important;
          font-weight: 900 !important;
          color: #ffffff !important;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
          margin-top: 4px;
        }
        .day-theme {
          font-size: 1rem !important;
          color: #7dd3fc !important;
          font-weight: 800 !important;
          margin-top: 3px;
        }
        .day-insider-tip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          background: rgba(245, 158, 11, 0.25) !important;
          border: 2px solid #fde047 !important;
          font-size: 0.95rem !important;
          color: #ffffff !important;
          font-weight: 700;
          margin-bottom: 16px;
          box-shadow: 0 4px 18px rgba(245, 158, 11, 0.25);
        }
        .transit-connector-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
        }
        .transit-connector-line {
          flex: 1;
          height: 1px;
          background: rgba(186, 230, 253, 0.35);
        }
        .transit-connector-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          color: #ffffff;
          background: #0d2249;
          border: 1.5px solid #38bdf8;
          padding: 5px 14px;
          border-radius: 9999px;
          font-weight: 700;
        }
        .plan-item-row {
          display: flex;
          gap: 16px;
          padding: 18px;
          border-radius: 16px;
          background: #0d2249 !important;
          border: 1.5px solid rgba(125, 211, 252, 0.4) !important;
          align-items: flex-start;
          transition: all 0.2s ease;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
        }
        .plan-item-row:hover {
          background: #112a58 !important;
          border-color: #38bdf8 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(56, 189, 248, 0.35);
        }
        .plan-item-img {
          width: 90px;
          height: 90px;
          border-radius: 12px;
          object-fit: cover;
          flex-shrink: 0;
          background: #0f172a;
          border: 1.5px solid rgba(186, 230, 253, 0.35);
        }
        .timeslot-badge {
          font-size: 0.76rem;
          font-weight: 900;
          padding: 4px 11px;
          border-radius: 8px;
          letter-spacing: 0.03em;
        }
        .timeslot-morning {
          background: rgba(245, 158, 11, 0.3);
          color: #fde047;
          border: 1.5px solid #fbbf24;
        }
        .timeslot-afternoon {
          background: rgba(14, 165, 233, 0.3);
          color: #7dd3fc;
          border: 1.5px solid #38bdf8;
        }
        .timeslot-evening {
          background: rgba(139, 92, 246, 0.3);
          color: #d8b4fe;
          border: 1.5px solid #c084fc;
        }
        .item-category-tag {
          font-size: 0.82rem;
          color: #38bdf8;
          font-weight: 800;
        }
        .item-rating-tag {
          font-size: 0.82rem;
          color: #fbbf24;
          font-weight: 900;
        }
        .item-name {
          font-size: 1.25rem !important;
          font-weight: 900 !important;
          color: #ffffff !important;
          margin-top: 4px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }
        .item-address {
          font-size: 0.88rem !important;
          color: #93c5fd !important;
          font-weight: 700 !important;
          margin-top: 3px;
        }
        .item-note {
          font-size: 0.92rem !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          margin-top: 10px;
          line-height: 1.6;
          background: #040c1c !important;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1.5px solid rgba(56, 189, 248, 0.4) !important;
        }
        .item-remove-btn {
          color: #cbd5e1;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.15s ease;
        }
        .item-remove-btn:hover {
          color: #fb7185;
          background: rgba(244, 63, 94, 0.2);
        }

        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .planner-sky-theme-wrapper {
            background: none !important;
          }
          .planner-sky-backdrop,
          .planner-sky-sunbeam-glow,
          .planner-sky-cloud-mist,
          .planner-header,
          .planner-config-panel,
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
        }
      `}</style>
    </div>
  );
};

export default SmartPlannerPage;
