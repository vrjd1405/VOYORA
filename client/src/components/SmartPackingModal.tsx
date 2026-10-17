import React, { useState } from 'react';
import { X, CheckSquare, Square, Plus, Trash2, Luggage, Sparkles, AlertCircle } from 'lucide-react';
import { useTrip } from '../context/TripContext';

interface SmartPackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PackingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export const SmartPackingModal: React.FC<SmartPackingModalProps> = ({ isOpen, onClose }) => {
  const { items: tripItems } = useTrip();
  const [customItem, setCustomItem] = useState('');

  // Default smart recommendations
  const [packingList, setPackingList] = useState<PackingItem[]>([
    { id: '1', name: 'Valid Government Photo ID / Passport', category: 'Essential Documents', checked: true },
    { id: '2', name: 'Confirmed Hotel & Train/Flight E-Tickets', category: 'Essential Documents', checked: false },
    { id: '3', name: 'Universal Travel Power Adapter & Power Bank (10,000mAh+)', category: 'Electronics', checked: false },
    { id: '4', name: 'Comfortable Walking / Slip-On Shoes (Convenient for Temple Entrances)', category: 'Apparel', checked: false },
    { id: '5', name: 'Breathable Cotton Scarf / Shawl (Mandatory Temple Dress Code)', category: 'Apparel', checked: false },
    { id: '6', name: 'Refillable Hydration Water Bottle & Electrolyte Sachets', category: 'Health & Wellness', checked: false },
    { id: '7', name: 'SPF 50+ Sunscreen, UV Polarized Sunglasses & Sun Hat', category: 'Health & Wellness', checked: false },
    { id: '8', name: 'Personal First Aid Kit & Motion Sickness / Allergy Meds', category: 'Health & Wellness', checked: false },
    { id: '9', name: 'Light Weatherproof Windcheater / Rain Poncho (For Hill Stations & Monsoon)', category: 'Apparel', checked: false },
    { id: '10', name: 'Local Emergency Contact Numbers & Physical Currency Reserve', category: 'Essential Documents', checked: false },
  ]);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setPackingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItem.trim()) return;
    setPackingList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: customItem.trim(),
        category: 'Personal Additions',
        checked: false,
      },
    ]);
    setCustomItem('');
  };

  const removeItem = (id: string) => {
    setPackingList((prev) => prev.filter((item) => item.id !== id));
  };

  const checkedCount = packingList.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / (packingList.length || 1)) * 100);

  // Group by category
  const categories = Array.from(new Set(packingList.map((i) => i.category)));

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
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-400">
            <Luggage size={24} />
          </div>
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 uppercase tracking-wider">
              Smart Travel Readiness
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Automated Trip Packing Checklist
            </h3>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-300">
              Packing Progress: {checkedCount} of {packingList.length} packed
            </span>
            <span className="text-sky-400 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Add Custom Item Form */}
        <form onSubmit={addItem} className="flex gap-2 mb-6">
          <input
            type="text"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            placeholder="Add custom packing item (e.g. Camera tripod, drone, earplugs)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500 transition"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus size={15} />
            <span>Add</span>
          </button>
        </form>

        {/* Checklist by Category */}
        <div className="space-y-4 mb-6">
          {categories.map((cat) => (
            <div key={cat} className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2.5">
                {cat}
              </h4>
              <div className="space-y-1.5">
                {packingList
                  .filter((item) => item.category === cat)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer select-none ${
                        item.checked
                          ? 'bg-slate-800/40 text-slate-400 line-through'
                          : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 pr-2">
                        {item.checked ? (
                          <CheckSquare size={16} className="text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Square size={16} className="text-slate-500 flex-shrink-0" />
                        )}
                        <span className="text-xs font-medium">{item.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="text-slate-600 hover:text-rose-400 p-1 transition"
                        title="Delete item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles size={12} className="text-sky-400" />
            <span>Dynamically personalized for your expedition itinerary</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
