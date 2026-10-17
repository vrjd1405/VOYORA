import { GoogleGenAI } from '@google/genai';
import { Destination } from '../types/index.js';
import { VERIFIED_DESTINATIONS, DYNAMIC_DESTINATIONS_CACHE, matchesCity, searchPlaces } from './placesService.js';
import { fetchWeatherForCoordinates, getWeatherConditionText } from './weatherService.js';

export interface PlanRequest {
  city: string;
  days: number;
  interests: string[];
  pace: 'relaxed' | 'balanced' | 'fast-paced';
  geminiApiKey?: string;
}

export interface PlanItem {
  destination: Destination;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  suggestionNote: string;
  estimatedHours?: number;
  transitFromPrevKm?: number;
  transitTimeMin?: number;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  insiderTip?: string;
  totalTransitKm?: number;
  items: PlanItem[];
}

export interface DiningHighlight {
  dish: string;
  description: string;
  bestTime: string;
}

export interface WeatherDaySummary {
  date: string;
  maxTemp: number;
  minTemp: number;
  conditionText: string;
}

export interface GeneratedPlan {
  city: string;
  daysCount: number;
  pace: string;
  interests: string[];
  days: DayPlan[];
  totalPlaces: number;
  aiEngine: string;
  summary: string;
  culturalEtiquette: string[];
  diningHighlights: DiningHighlight[];
  weatherForecast?: {
    currentTemp: number;
    conditionText: string;
    apparentTemp?: number;
    windspeed?: number;
    forecastDays: WeatherDaySummary[];
  };
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function getCuratedDining(city: string): DiningHighlight[] {
  const c = city.toLowerCase();
  if (c.includes('madurai')) {
    return [
      {
        dish: 'Famous Madurai Jigarthanda',
        description: 'Iconic chilled dessert with almond gum (badam pisin), nannari syrup, and velvety ice cream. Best at East Marret Street.',
        bestTime: 'Afternoon Refreshment',
      },
      {
        dish: 'Crispy Bun Parotta & Salna',
        description: 'Multi-layered fluffy golden parotta crafted with pure ghee and served with fiery, spiced vegetable or mutton salna.',
        bestTime: 'Dinner',
      },
      {
        dish: 'Three-Layer Kari Dosa',
        description: 'Thick dosa base crowned with a spiced egg omelette and succulent minced mutton or chicken pepper sukka.',
        bestTime: 'Evening Dinner',
      },
      {
        dish: 'Melt-in-Mouth Steamed Idlis',
        description: 'Feather-light steamed idlis paired with four distinct freshly ground coconut, tomato, coriander, and mint chutneys.',
        bestTime: 'Traditional Breakfast',
      },
    ];
  }

  if (c.includes('chennai')) {
    return [
      {
        dish: 'Traditional Degree Filter Coffee',
        description: 'Frothy chicory-infused brew poured in a gleaming brass dabarah and tumbler, perfected in Mylapore.',
        bestTime: 'Morning Kickstart',
      },
      {
        dish: 'Ghee Podi Roast Dosa',
        description: 'Crisp golden dosa slathered with molten ghee and roasted aromatic gunpowder spice blend.',
        bestTime: 'Breakfast or Dinner',
      },
      {
        dish: 'Marina Beach Sundal',
        description: 'Tempered warm white peas tossed with grated raw mango, fresh coconut slivers, and mustard seeds.',
        bestTime: 'Sunset Promenade',
      },
      {
        dish: 'Chettinad Pepper Gravy with Flaky Parotta',
        description: 'Aromatic black pepper and whole spice curry bursting with authentic heritage Tamil flavors.',
        bestTime: 'Lunch',
      },
    ];
  }

  if (c.includes('coimbatore')) {
    return [
      {
        dish: 'Annapoorna Ghee Sambar Vadai',
        description: 'Crisp golden lentil fritter soaked to perfection in legendary cumin and coriander infused sambar.',
        bestTime: 'Morning Breakfast',
      },
      {
        dish: 'Kongunadu Pallipalayam Specialty',
        description: 'Signature dry roast prepared with shallots, garlic, and whole dried red chilies in cold-pressed coconut oil.',
        bestTime: 'Lunch',
      },
      {
        dish: 'Chilled Elaneer Payasam',
        description: 'Refreshing dessert crafted from sweet tender coconut water, jelly pulp, and condensed milk.',
        bestTime: 'Dessert',
      },
    ];
  }

  if (c.includes('thanjavur') || c.includes('tanjore')) {
    return [
      {
        dish: 'Royal Thanjavur Banana Leaf Thali',
        description: 'A bountiful royal feast featuring Thanjavur sambar, rasam, kootu, poriyal, appalam, and sweet payasam.',
        bestTime: 'Midday Lunch',
      },
      {
        dish: 'Kasi Halwa (Ash Gourd Sweet)',
        description: 'Glistening sweet made from winter melon, simmered with pure ghee, saffron, and roasted cashews.',
        bestTime: 'Traditional Sweet',
      },
      {
        dish: 'Kumbakonam Degree Coffee',
        description: 'Thick, creamy undiluted cow milk coffee with an unmistakable fragrance and rich velvety crema.',
        bestTime: 'Morning / Evening',
      },
    ];
  }

  if (c.includes('kanyakumari')) {
    return [
      {
        dish: 'Nanjil Coastal Fish Curry',
        description: 'Fresh catch simmered in a tangy raw mango and coconut gravy, paired with Kerala red rice.',
        bestTime: 'Lunch',
      },
      {
        dish: 'Nendran Banana Crisps',
        description: 'Crispy golden plantain chips thinly sliced and fried in pure coconut oil with a pinch of rock salt.',
        bestTime: 'Evening Snack',
      },
      {
        dish: 'Appam with Coconut Vegetable Stew',
        description: 'Lacy fermented rice pancakes with a soft pillowy center, dunked in fragrant spiced coconut milk.',
        bestTime: 'Breakfast',
      },
    ];
  }

  if (c.includes('ooty') || c.includes('kodaikanal') || c.includes('nilgiris')) {
    return [
      {
        dish: 'Nilgiri Single-Estate High Grown Tea',
        description: 'Crisp, floral high-altitude black tea freshly brewed with aromatic cardamom.',
        bestTime: 'Morning Warmup',
      },
      {
        dish: 'Ooty Baked Crispy Varkey',
        description: 'Flaky layered pastry biscuit made in century-old wood-fired heritage ovens.',
        bestTime: 'Tea Time',
      },
      {
        dish: 'Artisanal Dark Chocolate & Fudge',
        description: 'Handcrafted truffles and roasted almond fudge produced by local hill-station chocolatiers.',
        bestTime: 'Sweet Treat',
      },
    ];
  }

  if (c.includes('paris')) {
    return [
      {
        dish: 'Warm Croissant au Beurre',
        description: 'Buttery, golden, multi-layered flaky pastry freshly pulled from a local artisan boulangerie oven.',
        bestTime: 'Breakfast',
      },
      {
        dish: 'Duck Confit (Confit de Canard)',
        description: 'Tender slow-cooked duck leg with crisp golden skin and garlic-thyme roasted sarladaise potatoes.',
        bestTime: 'Bistro Dinner',
      },
      {
        dish: 'Artisanal Parisian Macarons',
        description: 'Delicate almond meringue shells filled with rich chocolate ganache, salted butter caramel, or raspberry.',
        bestTime: 'Afternoon Tea',
      },
    ];
  }

  if (c.includes('tokyo')) {
    return [
      {
        dish: 'Tsukiji Outer Market Nigiri Sushi',
        description: 'Pristine seasonal bluefin tuna, sea urchin, and salmon nigiri brushed with aged shoyu.',
        bestTime: 'Morning / Lunch',
      },
      {
        dish: 'Rich Tonkotsu Ramen',
        description: 'Simmered 18-hour collagen-rich pork broth with firm springy noodles, soft-boiled ajitsuke egg, and chashu.',
        bestTime: 'Dinner',
      },
      {
        dish: 'Asakusa Fresh Baked Melonpan',
        description: 'Warm fluffy sweet bread encased in a crisp cookie-crust exterior, best enjoyed fresh on Nakamise street.',
        bestTime: 'Street Snack',
      },
    ];
  }

  // Universal fallback for any other city
  return [
    {
      dish: `Signature ${city} Regional Breakfast`,
      description: `Locally celebrated breakfast prepared with farm-fresh regional ingredients and time-honored techniques.`,
      bestTime: 'Morning Breakfast',
    },
    {
      dish: `Heritage ${city} Specialty Course`,
      description: `The hallmark culinary tradition of ${city}, revered by locals and visitors alike for centuries.`,
      bestTime: 'Lunch',
    },
    {
      dish: `Local Evening Street Delicacy`,
      description: `Vibrant street-side specialty found in bustling night markets and heritage food alleys.`,
      bestTime: 'Sunset Treat',
    },
  ];
}

function getCuratedEtiquette(city: string): string[] {
  const c = city.toLowerCase();
  if (c.includes('chennai') || c.includes('madurai') || c.includes('thanjavur') || c.includes('kanyakumari')) {
    return [
      'Temple Protocol: Remove footwear before entering sanctums; modest attire covering shoulders and knees is traditional.',
      'Timing Wisdom: Visit majestic stone temples in early morning (06:30 - 09:30) or late afternoon to avoid hot courtyard granite.',
      'Cultural Etiquette: Greet elders and temple priests with a respectful "Vanakkam" hands-pressed gesture.',
      'Local Transit: Auto-rickshaws and metro lines are accessible; agree on meter or ride-hailing apps for smooth transit.',
    ];
  }

  if (c.includes('paris')) {
    return [
      'Politeness Standard: Always say "Bonjour, Madame / Monsieur" upon entering any boutique or cafe before speaking.',
      'Museum Timing: Book Louvre, Musée d’Orsay, and Eiffel Tower summit tickets online well in advance to skip hours in queue.',
      'Dining Cadence: French lunches typically run from 12:30 to 14:30; dinner usually begins after 19:30.',
    ];
  }

  if (c.includes('tokyo')) {
    return [
      'Transit Manners: Keep cell phones on silent and refrain from speaking on phones while on trains and subways.',
      'Tipping Culture: Tipping is not customary in Japan and can be considered awkward; excellent service is standard.',
      'Footwear Courtesy: Prepare slip-on shoes; remove footwear when entering traditional restaurants, temples, and ryokans.',
    ];
  }

  return [
    `Respect local cultural customs, heritage monuments, and community norms while exploring ${city}.`,
    `Keep small currency denominations handy for local street markets and artisanal bazaars.`,
    `Optimal visiting hours for major monuments are typically early morning to enjoy gentle sunlight and calm crowds.`,
  ];
}

export async function generateSmartPlan(req: PlanRequest): Promise<GeneratedPlan> {
  const daysCount = Math.max(1, Math.min(7, req.days || 3));
  const rawCity = (req.city || '').trim();
  const city = rawCity.toLowerCase();
  const interests = req.interests || [];
  const pace = req.pace || 'balanced';

  let itemsPerDay = 3;
  if (pace === 'relaxed') itemsPerDay = 2;
  if (pace === 'fast-paced') itemsPerDay = 4;

  const totalNeeded = daysCount * itemsPerDay;

  // 1. Dynamic Live Discovery: Query verified database AND live Geoapify cartography
  let candidates: Destination[] = [];

  if (city === 'all' || city === '' || city === 'global highlights') {
    const allKnown = [...VERIFIED_DESTINATIONS, ...Array.from(DYNAMIC_DESTINATIONS_CACHE.values())];
    candidates = allKnown;
  } else {
    // Search destinations dynamically using Geoapify + verified pools
    const searchRes = await searchPlaces({ city: rawCity, limit: 35 });
    candidates = searchRes.destinations.filter(d => matchesCity(d.city, city, d.tags));

    // If still empty or very few, supplement from cache strictly matching city
    if (candidates.length < totalNeeded) {
      const allKnown = [...VERIFIED_DESTINATIONS, ...Array.from(DYNAMIC_DESTINATIONS_CACHE.values())];
      for (const d of allKnown) {
        if (!candidates.some(c => c.id === d.id) && matchesCity(d.city, city, d.tags)) {
          candidates.push(d);
        }
      }
    }
  }

  // 2. Strict City Isolation: Never inject random foreign cities (like Paris/Tokyo in Madurai)!
  let selected: Destination[] = [];

  if (candidates.length >= totalNeeded) {
    // Score candidate destinations based on user interests
    const scored = candidates.map(d => {
      let score = d.rating || 4.5;
      const textToMatch = `${d.category} ${d.tags?.join(' ') || ''} ${d.name} ${d.description || ''}`.toLowerCase();

      interests.forEach(interest => {
        const kw = interest.toLowerCase();
        if (textToMatch.includes(kw) || kw.includes(d.category.toLowerCase())) {
          score += 2.5;
        }
      });

      return { destination: d, score };
    });

    scored.sort((a, b) => b.score - a.score);
    selected = scored.slice(0, totalNeeded).map(s => s.destination);
  } else if (candidates.length > 0) {
    // Distribute the real candidates as main anchor visits
    selected = [...candidates];

    // If more slots are needed to fulfill the user's requested days,
    // synthesize authentic local exploration experiences located in this EXACT city
    // with its exact coordinates, instead of polluting with other cities!
    const baseDest = candidates[0];
    const cityCoordLat = baseDest.lat;
    const cityCoordLng = baseDest.lng;
    const countryName = baseDest.country;
    const cityName = baseDest.city;

    const synthesizedExp = [
      {
        name: `${cityName} Heritage Old Town & Artisan Quarter`,
        cat: 'Culture & Museum',
        desc: `Explore the vibrant traditional streets, ancient architecture, and heritage artisan workshops of ${cityName}.`,
        dLat: 0.008,
        dLng: 0.006,
      },
      {
        name: `${cityName} Evening Promenade & Street Markets`,
        cat: 'Landmark',
        desc: `Experience the evening atmosphere, local aromatic delicacies, and bustling community spirit in ${cityName}.`,
        dLat: -0.006,
        dLng: 0.007,
      },
      {
        name: `${cityName} Panoramic Sunset Viewpoint`,
        cat: 'Nature & Park',
        desc: `Capture golden hour views across the skyline and picturesque landscape of ${cityName}.`,
        dLat: 0.012,
        dLng: -0.008,
      },
      {
        name: `${cityName} Traditional Silk & Spice Bazaar`,
        cat: 'Culture & Museum',
        desc: `Immerse in the sensory aromas of freshly ground spices, handloom fabrics, and local handcrafted souvenirs.`,
        dLat: -0.009,
        dLng: -0.005,
      },
      {
        name: `${cityName} Morning Sacred Grounds & Serenity Stroll`,
        cat: 'Historic',
        desc: `Peaceful early morning stroll through heritage shrines and tranquil spiritual gardens in ${cityName}.`,
        dLat: 0.005,
        dLng: -0.009,
      },
      {
        name: `${cityName} Culinary Discovery Walk`,
        cat: 'Landmark',
        desc: `Taste renowned local delicacies and traditional refreshments at authentic multi-generational food spots.`,
        dLat: 0.003,
        dLng: 0.004,
      },
    ];

    let synthIdx = 0;
    while (selected.length < totalNeeded) {
      const template = synthesizedExp[synthIdx % synthesizedExp.length];
      const newDest: Destination = {
        id: `synth_${city}_${synthIdx}_${Date.now()}`,
        name: template.name,
        category: template.cat,
        city: cityName,
        country: countryName,
        lat: cityCoordLat + template.dLat,
        lng: cityCoordLng + template.dLng,
        imageUrl: baseDest.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85',
        rating: 4.8,
        address: `${template.name}, ${cityName}, ${countryName}`,
        description: template.desc,
        openingHours: '08:00 - 21:00 daily',
        tags: [city, 'authentic-experience', template.cat.toLowerCase()],
      };
      selected.push(newDest);
      synthIdx++;
    }
  } else {
    // If city is completely unrecognized or 'all'
    const allKnown = [...VERIFIED_DESTINATIONS, ...Array.from(DYNAMIC_DESTINATIONS_CACHE.values())];
    selected = allKnown.slice(0, totalNeeded);
  }

  // 3. Optional Google Gemini 2.5 Flash GenAI Integration
  const geminiKey = (req.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
  let aiEngine = 'Voyora Neural Spatial Engine (Verified Cartography)';
  let geminiData: any = null;

  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const prompt = `You are a world-renowned cultural travel architect for VOYORA.
Create an inspiring, highly realistic ${daysCount}-day itinerary for ${rawCity || 'Global Highlights'}.
Cadence: ${pace} (${itemsPerDay} stops/day).
Traveler Interests: ${interests.join(', ') || 'Culture, Architecture, Scenic Views'}.

Here are the verified real landmarks selected for this journey:
${selected.map((d, i) => `${i + 1}. "${d.name}" (${d.category}, Address: ${d.address || d.city})`).join('\n')}

Format your response strictly as valid pure JSON with NO markdown backticks:
{
  "summary": "2-3 sentences inspiring executive summary capturing the cultural soul of ${rawCity}",
  "culturalEtiquette": ["3 practical local travel tips/etiquette specifically for ${rawCity}"],
  "diningHighlights": [
    { "dish": "Dish name", "description": "Why it is iconic and where to taste it", "bestTime": "Morning / Lunch / Sunset / Dinner" }
  ],
  "days": [
    {
      "dayNumber": 1,
      "title": "Inspiring Day Title",
      "theme": "Evocative theme description",
      "insiderTip": "Specific insider secret for this day",
      "items": [
        {
          "destinationName": "Must closely match one of the verified landmarks above",
          "timeSlot": "Morning" | "Afternoon" | "Evening",
          "suggestionNote": "Detailed actionable advice (best photo angles, quiet hours, what to observe, duration)",
          "estimatedHours": 2
        }
      ]
    }
  ]
}`;

      let aiResponse: any = null;
      const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
      for (const mod of candidateModels) {
        try {
          aiResponse = await ai.models.generateContent({
            model: mod,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          });
          aiEngine = `Google Gemini (${mod} GenAI Active)`;
          break;
        } catch (err: any) {
          console.warn(`Model ${mod} attempt:`, err.message);
        }
      }

      if (aiResponse) {
        const rawText = aiResponse.text || '{}';
        geminiData = JSON.parse(rawText);
      } else {
        aiEngine = 'Voyora Neural Spatial Engine (Verified Cartography)';
      }
    } catch (err: any) {
      console.warn('Gemini AI generation encountered an issue, falling back to Voyora Neural Engine:', err.message);
      aiEngine = 'Voyora Neural Spatial Engine (Deterministic Intelligence)';
    }
  }

  // 4. Weather Forecast Integration (via Open-Meteo)
  let weatherForecast: GeneratedPlan['weatherForecast'] = undefined;
  if (selected.length > 0 && selected[0].lat && selected[0].lng) {
    try {
      const weather = await fetchWeatherForCoordinates(selected[0].lat, selected[0].lng);
      if (weather && weather.current) {
        const forecastDays: WeatherDaySummary[] = [];
        if (weather.daily?.time) {
          for (let d = 0; d < Math.min(daysCount, weather.daily.time.length); d++) {
            forecastDays.push({
              date: weather.daily.time[d],
              maxTemp: weather.daily.temperature_2m_max[d] ?? weather.current.temperature,
              minTemp: weather.daily.temperature_2m_min[d] ?? weather.current.temperature - 5,
              conditionText: getWeatherConditionText(weather.daily.weathercode[d] ?? weather.current.weathercode),
            });
          }
        }

        weatherForecast = {
          currentTemp: weather.current.temperature,
          conditionText: weather.current.conditionText,
          apparentTemp: weather.current.apparentTemperature,
          windspeed: weather.current.windspeed,
          forecastDays,
        };
      }
    } catch (err) {
      console.warn('Weather fetch skipped during plan generation:', err);
    }
  }

  // 5. Structure the Days with Spatial Routing & Pacing
  const timeSlots: ('Morning' | 'Afternoon' | 'Evening')[] = ['Morning', 'Afternoon', 'Evening', 'Evening'];
  const fallbackDayThemes = [
    { title: 'Iconic Foundations', theme: 'Signature architectural marvels & city heritage' },
    { title: 'Art & Culture Odyssey', theme: 'World-class museums & timeless neighborhood alleys' },
    { title: 'Nature & Panoramic Horizons', theme: 'Serene garden walks & majestic sunset viewpoints' },
    { title: 'Culinary & Vibrant Streets', theme: 'Historic markets & sensory street discoveries' },
    { title: 'Hidden Gems & Retreat', theme: 'Quaint shrines, artisan quarter & relaxed pacing' },
    { title: 'Coastal Breeze & Grand Plazas', theme: 'Waterside strolls & open-air monuments' },
    { title: 'Grand Finale Celebration', theme: 'Memorable skyline vistas & celebration dinner' },
  ];

  const days: DayPlan[] = [];
  let itemIdx = 0;

  for (let i = 1; i <= daysCount; i++) {
    const aiDay = geminiData?.days?.find((d: any) => d.dayNumber === i);
    const themeInfo = fallbackDayThemes[(i - 1) % fallbackDayThemes.length];

    const dayTitle = aiDay?.title || `Day ${i}: ${themeInfo.title}`;
    const dayTheme = aiDay?.theme || themeInfo.theme;
    const insiderTip = aiDay?.insiderTip || `Start your ${rawCity || 'destination'} day unhurriedly with local morning coffee for optimal enjoyment.`;

    const dayItems: PlanItem[] = [];
    let prevDest: Destination | null = null;
    let dayTotalDistanceKm = 0;

    for (let slot = 0; slot < itemsPerDay; slot++) {
      if (itemIdx < selected.length) {
        const dest = selected[itemIdx];
        const timeSlot = timeSlots[slot] || 'Evening';

        // Calculate distance from previous stop if applicable
        let transitFromPrevKm = 0;
        let transitTimeMin = 0;

        if (prevDest && dest.lat && dest.lng && prevDest.lat && prevDest.lng) {
          transitFromPrevKm = haversineDistanceKm(prevDest.lat, prevDest.lng, dest.lat, dest.lng);
          dayTotalDistanceKm += transitFromPrevKm;
          transitTimeMin = Math.max(5, Math.round((transitFromPrevKm / 22) * 60)); // ~22km/h city average
        }

        // Check if Gemini provided specific suggestion note
        const aiNote = aiDay?.items?.[slot]?.suggestionNote;
        const suggestionNote =
          aiNote ||
          `Recommended ${timeSlot.toLowerCase()} visit. Allow 1.5 - 2 hours to soak in the atmosphere.`;

        dayItems.push({
          destination: dest,
          timeSlot,
          suggestionNote,
          estimatedHours: 2,
          transitFromPrevKm: transitFromPrevKm > 0 ? transitFromPrevKm : undefined,
          transitTimeMin: transitTimeMin > 0 ? transitTimeMin : undefined,
        });

        prevDest = dest;
        itemIdx++;
      }
    }

    days.push({
      dayNumber: i,
      title: dayTitle,
      theme: dayTheme,
      insiderTip,
      totalTransitKm: Math.round(dayTotalDistanceKm * 10) / 10,
      items: dayItems,
    });
  }

  // 6. Assemble Culinary & Etiquette
  const diningHighlights: DiningHighlight[] =
    geminiData?.diningHighlights && geminiData.diningHighlights.length > 0
      ? geminiData.diningHighlights
      : getCuratedDining(rawCity);

  const culturalEtiquette: string[] =
    geminiData?.culturalEtiquette && geminiData.culturalEtiquette.length > 0
      ? geminiData.culturalEtiquette
      : getCuratedEtiquette(rawCity);

  const summary =
    geminiData?.summary ||
    `A handcrafted ${daysCount}-day journey through ${rawCity || 'the world'}, harmonizing verified cultural landmarks, scenic points of interest, and authentic local rhythm.`;

  return {
    city: rawCity || 'Global Selected Tour',
    daysCount,
    pace,
    interests,
    days,
    totalPlaces: selected.length,
    aiEngine,
    summary,
    culturalEtiquette,
    diningHighlights,
    weatherForecast,
  };
}
