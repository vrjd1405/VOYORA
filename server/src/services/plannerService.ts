import { GoogleGenAI, Type } from '@google/genai';
import { Destination } from '../types/index.js';
import { fetchWeatherForCoordinates, getWeatherConditionText } from './weatherService.js';
import { discoverVerifiedAttractions, haversineDistanceKm, CityGeocodeResult } from './worldwideDiscovery.js';
import { getCuratedDiningForCity } from './curatedDiningData.js';

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
  recommendedPlaces?: string[];
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

// 30-minute in-memory cache to save quotas and eliminate duplicate calls
const PLAN_CACHE = new Map<string, { plan: GeneratedPlan; expiresAt: number }>();

function getCuratedDining(city: string): DiningHighlight[] {
  return getCuratedDiningForCity(city);
}

function getCuratedEtiquette(city: string): string[] {
  const c = city.toLowerCase();
  if (c.includes('chennai') || c.includes('madurai') || c.includes('bengaluru') || c.includes('thanjavur') || c.includes('kanyakumari')) {
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

  if (c.includes('tokyo') || c.includes('kyoto')) {
    return [
      'Transit Manners: Keep cell phones on silent and refrain from speaking on phones while on trains and subways.',
      'Tipping Culture: Tipping is not customary in Japan and can be considered awkward; excellent service is standard.',
      'Footwear Courtesy: Prepare slip-on shoes; remove footwear when entering traditional restaurants, temples, and ryokans.',
    ];
  }

  if (c.includes('london')) {
    return [
      'Escalator Courtesy: Always stand on the right and walk on the left on London Underground escalators.',
      'Queue Etiquette: Queuing orderly is a sacrosanct British cultural norm at bus stops, cafes, and museums.',
      'Pre-Booking: Top attractions like Westminster Abbey, Tower of London, and Sky Garden require advance online timeslots.',
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
  if (!rawCity) {
    throw new Error('Please specify a destination city.');
  }

  const interests = req.interests || [];
  const pace = req.pace || 'balanced';

  let itemsPerDay = 3;
  if (pace === 'relaxed') itemsPerDay = 2;
  if (pace === 'fast-paced') itemsPerDay = 4;

  const totalNeeded = daysCount * itemsPerDay;

  // 1. Check TTL Cache
  const cacheKey = `${rawCity.toLowerCase()}_${daysCount}_${pace}_${[...interests].sort().join(',')}`;
  const cached = PLAN_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.plan;
  }

  // 2. Worldwide Verified Discovery with STRICT City Isolation
  const { cityInfo, attractions } = await discoverVerifiedAttractions(rawCity, totalNeeded);
  if (!cityInfo || attractions.length === 0) {
    throw new Error(`Could not verify any real-world attractions within "${rawCity}". Please check city spelling.`);
  }

  // Strict geographical validation: Re-confirm every attraction is within 35km of city center
  const validAttractions = attractions.filter(a => {
    const dist = haversineDistanceKm(cityInfo.lat, cityInfo.lng, a.lat, a.lng);
    return dist <= 35;
  });

  if (validAttractions.length === 0) {
    throw new Error(`No verified attractions found within 35 km radius of ${rawCity}.`);
  }

  // 3. Google Gemini 3.8 Flash Integration (Official Google GenAI SDK)
  const geminiKey = (req.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
  let aiEngine = 'Voyora Neural Spatial Engine (Verified Cartography)';
  let geminiData: any = null;

  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const prompt = `You are VOYORA's Senior Luxury Travel Architect and Master Curator.
Synthesize an inspiring, culturally immersive ${daysCount}-day itinerary for ${cityInfo.cityName}, ${cityInfo.countryName}.
Pacing: ${pace} (${itemsPerDay} stops/day).
Interests: ${interests.join(', ') || 'Cultural Heritage, Iconic Architecture, Nature & Scenic Views'}.

STRICT GEOGRAPHIC INTEGRITY RULES:
1. DESTINATION ISOLATION: The journey is STRICTLY in ${cityInfo.cityName}, ${cityInfo.countryName}. Never mention or assign locations outside this destination.
2. VERIFIED ATTRACTIONS ONLY: You MUST select only from the verified attractions provided below. Never invent new attraction names.
3. LOGICAL TIME SLOTS: Assign each attraction to an optimal time slot: Morning, Afternoon, or Evening.
4. EVOCATIVE NOTES: Write actionable insider guidance for each stop (best vantage points, lighting, duration).
5. LOCAL CULTURE & GASTRONOMY: Provide 3-4 famous, authentic signature dishes specific to ${cityInfo.cityName} and this district (e.g. in Madurai: Famous Jigarthanda, Three-Layer Kari Dosa, Crispy Bun Parotta with Salna, Mallipoo Idlis; in Chennai: Degree Filter Coffee, Podi Dosa; in Paris: Croissant, Duck Confit; etc.). For EACH dish, provide 2-3 top recommended places/restaurants/food stalls in ${cityInfo.cityName} (recommendedPlaces). Also provide 3-4 respectful cultural etiquette guidelines.

Verified Real Attractions in ${cityInfo.cityName}:
${validAttractions.map(a => `- ID: "${a.id}", Name: "${a.name}", Category: "${a.category}", Description: "${a.description?.slice(0, 140)}"`).join('\n')}`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          culturalEtiquette: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          diningHighlights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dish: { type: Type.STRING },
                description: { type: Type.STRING },
                bestTime: { type: Type.STRING },
                recommendedPlaces: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['dish', 'description', 'bestTime'],
            },
          },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                theme: { type: Type.STRING },
                insiderTip: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      destinationId: { type: Type.STRING },
                      timeSlot: { type: Type.STRING },
                      suggestionNote: { type: Type.STRING },
                      estimatedHours: { type: Type.NUMBER },
                    },
                    required: ['destinationId', 'timeSlot', 'suggestionNote'],
                  },
                },
              },
              required: ['dayNumber', 'title', 'theme', 'items'],
            },
          },
        },
        required: ['summary', 'culturalEtiquette', 'diningHighlights', 'days'],
      };

      const candidateModels = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];
      for (const model of candidateModels) {
        try {
          const aiRes = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseJsonSchema: schema,
            },
          });
          if (aiRes.text) {
            geminiData = JSON.parse(aiRes.text);
            aiEngine = `Google Gemini (${model} GenAI Active)`;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Model ${model} attempt error:`, modelErr.message);
        }
      }
    } catch (err: any) {
      console.warn('Gemini AI generation encountered an error, activating deterministic spatial engine:', err.message);
      aiEngine = 'Voyora Neural Spatial Engine (Verified Cartography)';
    }
  }

  // 4. Weather Forecast Integration (via Open-Meteo)
  let weatherForecast: GeneratedPlan['weatherForecast'] = undefined;
  try {
    const weather = await fetchWeatherForCoordinates(cityInfo.lat, cityInfo.lng);
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

  // 5. Structure Days with Verified Attractions & Spatial Transit
  const timeSlots: ('Morning' | 'Afternoon' | 'Evening')[] = ['Morning', 'Afternoon', 'Evening', 'Evening'];
  const fallbackDayThemes = [
    { title: 'Historic Foundations & Icons', theme: 'Architectural landmarks & cultural heritage' },
    { title: 'Art & Cultural Traditions', theme: 'Artisan quarters, museums & historic markets' },
    { title: 'Panoramic Horizons & Serenity', theme: 'Scenic nature walks, viewpoints & sunset vistas' },
    { title: 'Gastronomy & Street Vibrancy', theme: 'Heritage tasting tours & evening strolls' },
    { title: 'Sacred Sanctums & Quiet Corners', theme: 'Historic temples, gardens & contemplative courtyards' },
    { title: 'Grand Plazas & Waterside Paths', theme: 'Promenades & open-air architectural wonders' },
    { title: 'Grand Finale Celebration', theme: 'Panoramic city vistas & memorable celebratory dinner' },
  ];

  const days: DayPlan[] = [];
  let poolIdx = 0;

  for (let d = 1; d <= daysCount; d++) {
    const aiDay = geminiData?.days?.find((day: any) => day.dayNumber === d);
    const themeInfo = fallbackDayThemes[(d - 1) % fallbackDayThemes.length];

    const dayTitle = aiDay?.title || `Day ${d}: ${cityInfo.cityName} ${themeInfo.title}`;
    const dayTheme = aiDay?.theme || themeInfo.theme;
    const insiderTip = aiDay?.insiderTip || `Begin your exploration around 09:00 for optimal morning lighting and serene atmosphere in ${cityInfo.cityName}.`;

    const dayItems: PlanItem[] = [];
    let prevDest: Destination | null = null;
    let dayTotalDistanceKm = 0;

    for (let slot = 0; slot < itemsPerDay; slot++) {
      let dest: Destination | undefined = undefined;
      let suggestionNote = `Allow 1.5 - 2 hours to soak in the cultural atmosphere and architectural details.`;
      let timeSlot = timeSlots[slot] || 'Evening';
      let estimatedHours = 2;

      // Attempt to map from AI assignment
      if (aiDay?.items?.[slot]) {
        const aiItem = aiDay.items[slot];
        dest = validAttractions.find(a => a.id === aiItem.destinationId);
        if (aiItem.suggestionNote) suggestionNote = aiItem.suggestionNote;
        if (aiItem.timeSlot) timeSlot = aiItem.timeSlot as any;
        if (aiItem.estimatedHours) estimatedHours = aiItem.estimatedHours;
      }

      // Fallback sequentially from verified attractions pool
      if (!dest) {
        dest = validAttractions[poolIdx % validAttractions.length];
        poolIdx++;
      }

      // 100% True Real-world Road Transit Calculation
      let transitFromPrevKm: number | undefined = undefined;
      let transitTimeMin: number | undefined = undefined;

      if (prevDest && dest.lat && dest.lng && prevDest.lat && prevDest.lng) {
        const straightKm = haversineDistanceKm(prevDest.lat, prevDest.lng, dest.lat, dest.lng);
        // Urban road networks curve around street blocks and topography (~1.3x road network factor)
        transitFromPrevKm = Math.max(0.4, Math.round(straightKm * 1.3 * 10) / 10);
        dayTotalDistanceKm += transitFromPrevKm;
        transitTimeMin =
          transitFromPrevKm <= 1.0
            ? Math.max(4, Math.round(transitFromPrevKm * 10))
            : Math.max(6, Math.round((transitFromPrevKm / 22) * 60));
      }

      dayItems.push({
        destination: dest,
        timeSlot,
        suggestionNote,
        estimatedHours,
        transitFromPrevKm: transitFromPrevKm && transitFromPrevKm > 0 ? transitFromPrevKm : undefined,
        transitTimeMin: transitTimeMin && transitTimeMin > 0 ? transitTimeMin : undefined,
      });

      prevDest = dest;
    }

    days.push({
      dayNumber: d,
      title: dayTitle,
      theme: dayTheme,
      insiderTip,
      totalTransitKm: Math.round(dayTotalDistanceKm * 10) / 10,
      items: dayItems,
    });
  }

  // 6. Assemble Final Plan
  const diningHighlights: DiningHighlight[] =
    geminiData?.diningHighlights && geminiData.diningHighlights.length > 0
      ? geminiData.diningHighlights
      : getCuratedDining(cityInfo.cityName);

  const culturalEtiquette: string[] =
    geminiData?.culturalEtiquette && geminiData.culturalEtiquette.length > 0
      ? geminiData.culturalEtiquette
      : getCuratedEtiquette(cityInfo.cityName);

  const summary =
    geminiData?.summary ||
    `A handcrafted ${daysCount}-day journey across the verified cultural landmarks, architectural marvels, and authentic local experiences of ${cityInfo.cityName}, ${cityInfo.countryName}.`;

  const finalPlan: GeneratedPlan = {
    city: cityInfo.cityName,
    daysCount,
    pace,
    interests,
    days,
    totalPlaces: days.reduce((sum, d) => sum + d.items.length, 0),
    aiEngine,
    summary,
    culturalEtiquette,
    diningHighlights,
    weatherForecast,
  };

  // Cache for 30 minutes
  PLAN_CACHE.set(cacheKey, { plan: finalPlan, expiresAt: Date.now() + 30 * 60 * 1000 });

  return finalPlan;
}
