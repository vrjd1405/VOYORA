import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck, CloudSun, Calendar, Navigation, RotateCcw } from 'lucide-react';
import { Destination } from '../types';
import * as api from '../services/api';
import { DestinationCard } from './DestinationCard';
import { AddToTripModal } from './AddToTripModal';

interface DestinationChooserSectionProps {
  onNavigate: (path: string) => void;
  onScrollToGlobe: () => void;
}

export const DestinationChooserSection: React.FC<DestinationChooserSectionProps> = ({
  onNavigate,
  onScrollToGlobe,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'tamil_nadu' | 'india' | 'global'>('tamil_nadu');
  const [activeCity, setActiveCity] = useState<string>('Madurai');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cityWeather, setCityWeather] = useState<{ temp?: number; condition?: string } | null>(null);
  const [modalDest, setModalDest] = useState<Destination | null>(null);

  const regionCities = {
    tamil_nadu: [
      { name: 'Madurai', count: 6, tag: 'Cultural Capital' },
      { name: 'Chennai', count: 9, tag: 'Gateway of South' },
      { name: 'Coimbatore', count: 6, tag: 'Manchester of South' },
      { name: 'Mahabalipuram', count: 5, tag: 'UNESCO Coastal Heritage' },
      { name: 'Thanjavur', count: 4, tag: 'Chola Dynasty Heart' },
      { name: 'Kanyakumari', count: 5, tag: 'Land’s End' },
      { name: 'Ooty', count: 5, tag: 'Queen of Hill Stations' },
      { name: 'Kodaikanal', count: 5, tag: 'Princess of Hill Stations' },
      { name: 'Rameswaram', count: 4, tag: 'Island Sacred Realm' },
      { name: 'Trichy', count: 4, tag: 'Historic Rockfort City' },
    ],
    india: [
      { name: 'Bengaluru', count: 6, tag: 'Garden & Tech Hub' },
      { name: 'Delhi', count: 8, tag: 'Historic Capital' },
      { name: 'Mumbai', count: 7, tag: 'City of Dreams' },
      { name: 'Jaipur', count: 5, tag: 'Pink City of Palaces' },
      { name: 'Kochi', count: 5, tag: 'Queen of Arabian Sea' },
    ],
    global: [
      { name: 'Paris', count: 7, tag: 'City of Lights' },
      { name: 'Tokyo', count: 6, tag: 'Metropolis of Tomorrow' },
      { name: 'Rome', count: 6, tag: 'The Eternal City' },
      { name: 'London', count: 6, tag: 'Royal Heritage' },
      { name: 'New York', count: 6, tag: 'Empire Capital' },
    ],
  };

  const categories = [
    { id: 'all', label: 'All Places' },
    { id: 'Historic', label: 'Historic & Heritage' },
    { id: 'Landmark', label: 'Iconic Monuments' },
    { id: 'Culture & Museum', label: 'Culture & Art' },
    { id: 'Nature & Park', label: 'Nature & Hills' },
    { id: 'Coastal & Beach', label: 'Coastal & Shores' },
  ];

  // Fetch destinations whenever city, category, or search changes
  useEffect(() => {
    setLoading(true);
    api.fetchDestinations({
      city: activeCity,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      q: searchQuery.trim() || undefined,
    })
      .then((res) => {
        setDestinations(res.destinations || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching destinations:', err);
        setLoading(false);
      });
  }, [activeCity, selectedCategory, searchQuery]);

  // Fetch live weather for the active city from Open-Meteo
  useEffect(() => {
    if (destinations.length > 0) {
      const first = destinations[0];
      api.fetchWeather(first.lat, first.lng)
        .then((w) => {
          if (w && w.current && w.current.temperature !== undefined) {
            setCityWeather({
              temp: Math.round(w.current.temperature),
              condition: w.current.conditionText || 'Pleasant',
            });
          }
        })
        .catch(() => setCityWeather(null));
    }
  }, [destinations]);

  const handleCitySelect = (cityName: string) => {
    setActiveCity(cityName);
    setSearchQuery('');
  };

  return (
    <section id="voyora-destinations" className="voyora-destination-chooser-section relative z-10 py-16 px-4">
      <div className="container max-w-7xl mx-auto">
        {/* Section Header with Back to Globe Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles size={13} />
              <span>VOYORA DESTINATION CHOOSER</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Select Your City. <span className="text-sky-400">Discover Real Sights.</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              100% strictly verified destinations across Tamil Nadu, India, and premier global capitals with zero cross-city data mixing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onScrollToGlobe}
              className="px-4 py-2 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1.5 shadow-md"
              title="Scroll back up to the 3D Earth Globe"
            >
              <RotateCcw size={13} className="text-sky-400" />
              <span>↑ Back to Globe Intro</span>
            </button>
            <button
              onClick={() => onNavigate('/planner')}
              className="px-5 py-2 rounded-full bg-sky-500 text-slate-950 hover:bg-sky-400 transition text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            >
              <Sparkles size={13} />
              <span>Smart Itinerary</span>
            </button>
          </div>
        </div>

        {/* Region Selector Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2 flex-shrink-0">
            Region:
          </span>
          <button
            onClick={() => {
              setSelectedRegion('tamil_nadu');
              setActiveCity('Madurai');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 flex-shrink-0 ${
              selectedRegion === 'tamil_nadu'
                ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Tamil Nadu (10 Cities)</span>
          </button>

          <button
            onClick={() => {
              setSelectedRegion('india');
              setActiveCity('Bengaluru');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 flex-shrink-0 ${
              selectedRegion === 'india'
                ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <MapPin size={14} />
            <span>All India Highlights</span>
          </button>

          <button
            onClick={() => {
              setSelectedRegion('global');
              setActiveCity('Paris');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 flex-shrink-0 ${
              selectedRegion === 'global'
                ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Navigation size={14} />
            <span>Global Metropolises</span>
          </button>
        </div>

        {/* City Horizontal Carousel / Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-8">
          {regionCities[selectedRegion].map((c) => {
            const isSelected = activeCity.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                onClick={() => handleCitySelect(c.name)}
                className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-400 text-white shadow-[0_0_25px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                    {c.name}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700">
                    {c.count} spots
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 line-clamp-1">
                  {c.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active City Information Banner & Live Telemetry */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 border border-sky-500/20 backdrop-blur-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">{activeCity}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck size={12} />
                  <span>Strict City Isolation Verified</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Displaying {destinations.length} authentic sights exclusive to {activeCity}. Guaranteed zero cross-city duplicates.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {cityWeather && (
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs flex items-center gap-2">
                <CloudSun size={15} className="text-amber-400" />
                <span className="text-white font-semibold">{cityWeather.temp}°C</span>
                <span className="text-slate-400">({cityWeather.condition})</span>
              </div>
            )}
            <button
              onClick={() => onNavigate(`/planner?city=${encodeURIComponent(activeCity)}`)}
              className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Calendar size={13} />
              <span>Generate {activeCity} Itinerary</span>
            </button>
            <button
              onClick={() => onNavigate(`/explore?city=${encodeURIComponent(activeCity)}`)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Map & Filter</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Filter Toolbar: Search + Category Chips */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-sky-400 text-slate-950 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search inside Active City */}
          <div className="relative min-w-[260px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search sights in ${activeCity}...`}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-sky-500 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Destination Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto">
            <MapPin size={32} className="mx-auto text-slate-600 mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">No destinations match filters</h4>
            <p className="text-xs text-slate-400 mb-4">
              Try resetting the theme category or searching with another term for {activeCity}.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onNavigate={onNavigate}
                onOpenAddModal={(d) => setModalDest(d)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add To Trip Modal */}
      {modalDest && (
        <AddToTripModal
          destination={modalDest}
          onClose={() => setModalDest(null)}
        />
      )}
    </section>
  );
};
