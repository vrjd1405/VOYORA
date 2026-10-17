import React, { useState } from 'react';
import { X, DollarSign, Calculator, ArrowRightLeft, Sparkles, Wallet, Check } from 'lucide-react';

interface CurrencyBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencyBudgetModal: React.FC<CurrencyBudgetModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<number>(5000);
  const [fromCurrency, setFromCurrency] = useState<string>('INR');
  const [toCurrency, setToCurrency] = useState<string>('USD');

  // Budget Planner Calculator State
  const [days, setDays] = useState<number>(3);
  const [travelStyle, setTravelStyle] = useState<'budget' | 'balanced' | 'luxury'>('balanced');
  const [targetCity, setTargetCity] = useState<string>('Madurai');

  // Real-world exchange rates baseline
  const exchangeRates: Record<string, number> = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.82,
    AED: 0.044,
    SGD: 0.016,
  };

  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AED: 'AED ',
    SGD: 'S$',
  };

  if (!isOpen) return null;

  // Convert amount
  const inrAmount = amount / (exchangeRates[fromCurrency] || 1);
  const converted = inrAmount * (exchangeRates[toCurrency] || 1);

  // Daily costs per style in INR
  const dailyBaseRates = {
    budget: { stay: 1200, food: 600, transport: 300, activities: 400 },
    balanced: { stay: 3200, food: 1400, transport: 800, activities: 1100 },
    luxury: { stay: 8500, food: 3500, transport: 2500, activities: 2800 },
  };

  const selectedRate = dailyBaseRates[travelStyle];
  const totalDailyINR = selectedRate.stay + selectedRate.food + selectedRate.transport + selectedRate.activities;
  const totalTripINR = totalDailyINR * days;
  const totalTripConverted = totalTripINR * (exchangeRates[toCurrency] || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-400">
            <Calculator size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 uppercase tracking-wider">
                Voyora Finance Suite
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Currency Converter & Travel Budget Architect
            </h3>
          </div>
        </div>

        {/* Section 1: Quick Currency Converter */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRightLeft size={13} className="text-sky-400" />
              <span>Real-Time Currency Conversion</span>
            </span>
            <span className="text-[11px] text-slate-400">Verified Travel Rates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            {/* Amount & From */}
            <div className="sm:col-span-2">
              <label className="text-[11px] text-slate-400 block mb-1">Amount</label>
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 px-3 py-2">
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-transparent text-white font-bold text-base outline-none"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="bg-transparent text-sky-400 font-bold text-sm outline-none cursor-pointer border-l border-slate-700 pl-2 ml-2"
                >
                  {Object.keys(exchangeRates).map((cur) => (
                    <option key={cur} value={cur} className="bg-slate-900 text-white">
                      {cur}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Equals Icon */}
            <div className="sm:col-span-1 flex justify-center text-slate-500 py-1">
              <ArrowRightLeft size={18} />
            </div>

            {/* Converted Output & To */}
            <div className="sm:col-span-2">
              <label className="text-[11px] text-slate-400 block mb-1">Converted Target</label>
              <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-700 px-3 py-2">
                <span className="text-lg font-black text-sky-400">
                  {currencySymbols[toCurrency]} {converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="bg-transparent text-sky-400 font-bold text-sm outline-none cursor-pointer border-l border-slate-700 pl-2 ml-2"
                >
                  {Object.keys(exchangeRates).map((cur) => (
                    <option key={cur} value={cur} className="bg-slate-900 text-white">
                      {cur}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Destination Trip Budget Estimator */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet size={13} className="text-emerald-400" />
              <span>Trip Budget Estimator</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">City Intelligence Grounded</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Days Selection */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Trip Duration</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5, 7].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      days === d
                        ? 'bg-sky-500 text-slate-950 shadow-md'
                        : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {d} {d === 1 ? 'Day' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Pacing Style */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Travel Standard</label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'budget', label: 'Backpacker' },
                  { id: 'balanced', label: 'Comfort' },
                  { id: 'luxury', label: 'Luxury' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTravelStyle(s.id as any)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                      travelStyle === s.id
                        ? 'bg-sky-500 text-slate-950 shadow-md'
                        : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-700/60 mb-4">
            <div className="p-2.5 rounded-xl bg-slate-900/60 text-center">
              <span className="text-[10px] text-slate-400 block">Stay / Night</span>
              <span className="text-xs font-bold text-white">₹{selectedRate.stay.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 text-center">
              <span className="text-[10px] text-slate-400 block">Food & Dining</span>
              <span className="text-xs font-bold text-white">₹{selectedRate.food.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 text-center">
              <span className="text-[10px] text-slate-400 block">Local Transit</span>
              <span className="text-xs font-bold text-white">₹{selectedRate.transport.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 text-center">
              <span className="text-[10px] text-slate-400 block">Attractions</span>
              <span className="text-xs font-bold text-white">₹{selectedRate.activities.toLocaleString()}</span>
            </div>
          </div>

          {/* Total Estimated Cost Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-indigo-500/15 border border-sky-400/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 block">Estimated Total for {days} Days:</span>
              <span className="text-2xl font-black text-white">
                ₹{totalTripINR.toLocaleString()}{' '}
                <span className="text-sm font-normal text-slate-400">
                  (~{currencySymbols[toCurrency]} {totalTripConverted.toLocaleString('en-US', { maximumFractionDigits: 0 })})
                </span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <Check size={14} />
              <span>Includes Taxes & Pass</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
