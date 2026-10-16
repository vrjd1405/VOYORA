import { Destination } from '../types/index.js';
import { VERIFIED_DESTINATIONS } from './placesService.js';

export interface PlanRequest {
  city: string;
  days: number;
  interests: string[];
  pace: 'relaxed' | 'balanced' | 'fast-paced';
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  items: Array<{
    destination: Destination;
    timeSlot: 'Morning' | 'Afternoon' | 'Evening';
    suggestionNote: string;
  }>;
}

export interface GeneratedPlan {
  city: string;
  daysCount: number;
  pace: string;
  interests: string[];
  days: DayPlan[];
  totalPlaces: number;
}

export function generateSmartPlan(req: PlanRequest): GeneratedPlan {
  const daysCount = Math.max(1, Math.min(7, req.days || 3));
  const city = (req.city || '').trim().toLowerCase();
  const interests = req.interests || [];
  const pace = req.pace || 'balanced';

  let itemsPerDay = 3;
  if (pace === 'relaxed') itemsPerDay = 2;
  if (pace === 'fast-paced') itemsPerDay = 4;

  // Filter candidates by city
  let candidates = VERIFIED_DESTINATIONS.filter(d => 
    city === 'all' || city === '' || d.city.toLowerCase().includes(city) || d.country.toLowerCase().includes(city)
  );

  // If specific city has fewer items than needed, supplement with top global icons
  if (candidates.length < daysCount * itemsPerDay) {
    const others = VERIFIED_DESTINATIONS.filter(d => !candidates.some(c => c.id === d.id));
    candidates = [...candidates, ...others];
  }

  // Score candidate destinations based on interests
  const scored = candidates.map(d => {
    let score = (d.rating || 4.5);
    const textToMatch = `${d.category} ${d.tags?.join(' ') || ''} ${d.name} ${d.description || ''}`.toLowerCase();
    
    interests.forEach(interest => {
      const kw = interest.toLowerCase();
      if (textToMatch.includes(kw) || kw.includes(d.category.toLowerCase())) {
        score += 2;
      }
    });

    return { destination: d, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Distribute across days without duplicates
  const totalNeeded = daysCount * itemsPerDay;
  const selected = scored.slice(0, totalNeeded).map(s => s.destination);

  const timeSlots: ('Morning' | 'Afternoon' | 'Evening')[] = ['Morning', 'Afternoon', 'Evening', 'Evening'];
  const dayThemes = [
    { title: "Iconic Foundations", theme: "Signature architectural marvels & city heritage" },
    { title: "Art & Culture Odyssey", theme: "World-class museums & timeless neighborhood alleys" },
    { title: "Nature & Panoramic Horizons", theme: "Serene garden walks & majestic sunset viewpoints" },
    { title: "Culinary & Vibrant Streets", theme: "Historic markets & sensory street discoveries" },
    { title: "Hidden Gems & Retreat", theme: "Quaint shrines, artisan quarter & relaxed pacing" },
    { title: "Coastal Breeze & Grand Plazas", theme: "Waterside strolls & open-air monuments" },
    { title: "Grand Finale", theme: "Memorable skyline vistas & celebration dinner" }
  ];

  const days: DayPlan[] = [];
  let itemIdx = 0;

  for (let i = 1; i <= daysCount; i++) {
    const themeInfo = dayThemes[(i - 1) % dayThemes.length];
    const dayItems: DayPlan['items'] = [];

    for (let slot = 0; slot < itemsPerDay; slot++) {
      if (itemIdx < selected.length) {
        const dest = selected[itemIdx];
        const timeSlot = timeSlots[slot] || 'Evening';
        dayItems.push({
          destination: dest,
          timeSlot,
          suggestionNote: `Recommended ${timeSlot.toLowerCase()} visit. Allow approximately 1.5 - 2 hours.`
        });
        itemIdx++;
      }
    }

    days.push({
      dayNumber: i,
      title: `Day ${i}: ${themeInfo.title}`,
      theme: themeInfo.theme,
      items: dayItems
    });
  }

  return {
    city: req.city || 'Global Selected Tour',
    daysCount,
    pace,
    interests,
    days,
    totalPlaces: selected.length
  };
}
