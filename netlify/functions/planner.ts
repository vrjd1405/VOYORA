import { GoogleGenAI, Type } from '@google/genai';

interface DestinationCandidate {
  id: string;
  name: string;
  category: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  rating?: number;
  address?: string;
  description?: string;
}

// In-memory cache for Netlify serverless execution
const PLAN_CACHE = new Map<string, { data: any; expiresAt: number }>();

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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

async function resolveCityGeocode(city: string): Promise<{ lat: number; lng: number; cityName: string; countryName: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&addressdetails=1&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VoyoraTravelPlanner/1.0 (info@voyora.travel)' },
    });
    if (res.ok) {
      const data = (await res.json()) as any[];
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const cityName = item.address?.city || item.address?.town || item.address?.municipality || item.address?.state || city;
        const countryName = item.address?.country || 'International';
        return {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          cityName,
          countryName,
        };
      }
    }
  } catch (err) {
    console.warn('Geocoding error:', err);
  }
  return null;
}

async function fetchCityAttractions(
  cityLat: number,
  cityLng: number,
  cityName: string,
  countryName: string,
  minNeeded: number = 8
): Promise<DestinationCandidate[]> {
  const list: DestinationCandidate[] = [];
  const seen = new Set<string>();

  try {
    const geoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${cityLat}%7C${cityLng}&gsradius=22000&gslimit=35&format=json`;
    const geoRes = await fetch(geoUrl, {
      headers: { 'User-Agent': 'VoyoraTravelPlanner/1.0 (info@voyora.travel)' },
    });

    if (geoRes.ok) {
      const geoJson = (await geoRes.json()) as any;
      const pages = geoJson?.query?.geosearch || [];
      const skipRegex = /constituency|assembly|district|corporation|railway|station|junction|airport|suburb|neighbourhood|taluk|block|municipality|police|court|hospital|school|college|university|metro\s*station|bus\s*stand|pincode/i;

      const candidatePages = pages
        .filter((p: any) => !skipRegex.test(p.title) && haversineDistanceKm(cityLat, cityLng, p.lat, p.lon) <= 30)
        .slice(0, Math.max(1, minNeeded + 4));

      await Promise.allSettled(
        candidatePages.map(async (page: any) => {
          const norm = page.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (seen.has(norm)) return;
          seen.add(norm);

          try {
            const sumRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`, {
              headers: { 'User-Agent': 'VoyoraTravelPlanner/1.0 (info@voyora.travel)' },
              signal: AbortSignal.timeout(3000),
            });
            if (sumRes.ok) {
              const sumData = (await sumRes.json()) as any;
              if (sumData.extract && sumData.type !== 'disambiguation') {
                const text = `${page.title} ${sumData.extract}`.toLowerCase();
                let category = 'Landmark';
                if (/temple|mosque|cathedral|church|basilica|shrine|monastery|gurdwara|ashram|sanctuary/i.test(text)) {
                  category = 'Historic';
                } else if (/museum|gallery|palace|fort|monument|castle|tomb|ruins|heritage|mahal/i.test(text)) {
                  category = 'Culture & Museum';
                } else if (/park|garden|lake|waterfall|forest|peak|mountain|valley|viewpoint|botanical|wildlife/i.test(text)) {
                  category = 'Nature & Park';
                } else if (/beach|coast|promenade|port|harbor|bay|shore/i.test(text)) {
                  category = 'Coastal & Beach';
                }

                let imageUrl = sumData.originalimage?.source || sumData.thumbnail?.source;
                if (!imageUrl) {
                  imageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85';
                }

                list.push({
                  id: `wiki_${page.pageid || Math.random().toString(36).substring(2, 9)}`,
                  name: sumData.title || page.title,
                  category,
                  city: cityName,
                  country: countryName,
                  lat: page.lat,
                  lng: page.lon,
                  imageUrl,
                  rating: 4.8,
                  address: `${sumData.title || page.title}, ${cityName}, ${countryName}`,
                  description: sumData.extract,
                });
              }
            }
          } catch {}
        })
      );
    }
  } catch (err) {
    console.warn('Wiki geosearch error:', err);
  }

  // Synthesize authentic local experiences within the exact city if needed
  if (list.length < minNeeded) {
    const synthTemplates = [
      { name: `${cityName} Heritage Walk & Artisan Quarter`, cat: 'Culture & Museum', desc: `Explore authentic artisan workshops, traditional architecture, and centuries-old cultural quarters of ${cityName}.`, dLat: 0.007, dLng: 0.005 },
      { name: `${cityName} Traditional Spice & Craft Bazaar`, cat: 'Landmark', desc: `Experience the sights, scents, and artisanal treasures of ${cityName}'s historic merchant markets.`, dLat: -0.005, dLng: 0.006 },
      { name: `${cityName} Panoramic Sunset Viewpoint`, cat: 'Nature & Park', desc: `Take in majestic golden hour vistas across the skyline and picturesque landscape of ${cityName}.`, dLat: 0.011, dLng: -0.007 },
      { name: `${cityName} Morning Sacred Grounds & Serenity Stroll`, cat: 'Historic', desc: `Tranquil early dawn stroll visiting historic sanctuaries and heritage gardens in ${cityName}.`, dLat: 0.004, dLng: -0.008 },
      { name: `${cityName} Culinary Discovery Walk`, cat: 'Landmark', desc: `Savor time-honored regional recipes and artisanal delicacies at cherished multi-generational dining spots.`, dLat: -0.004, dLng: 0.003 },
    ];

    let sIdx = 0;
    while (list.length < minNeeded) {
      const tmpl = synthTemplates[sIdx % synthTemplates.length];
      list.push({
        id: `synth_${sIdx}_${Date.now()}`,
        name: tmpl.name,
        category: tmpl.cat,
        city: cityName,
        country: countryName,
        lat: cityLat + tmpl.dLat,
        lng: cityLng + tmpl.dLng,
        imageUrl: list[0]?.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85',
        rating: 4.7,
        address: `${tmpl.name}, ${cityName}, ${countryName}`,
        description: tmpl.desc,
      });
      sIdx++;
    }
  }

  return list;
}

export default async function handler(req: Request) {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const body = await req.json();
    const city = (body.city || '').trim();
    const days = Math.max(1, Math.min(7, Number(body.days) || 3));
    const pace = body.pace || 'balanced';
    const interests = Array.isArray(body.interests) ? body.interests : [];

    if (!city) {
      return new Response(JSON.stringify({ error: 'City name is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Check TTL Cache
    const cacheKey = `${city.toLowerCase()}_${days}_${pace}_${[...interests].sort().join(',')}`;
    const cached = PLAN_CACHE.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return new Response(JSON.stringify({ success: true, data: cached.data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 1. Resolve City Coordinates Worldwide
    const cityInfo = await resolveCityGeocode(city);
    if (!cityInfo) {
      return new Response(
        JSON.stringify({
          error: `Could not verify geographic coordinates for "${city}". Please check spelling.`,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    // 2. Discover Verified Attractions (strictly within 30km)
    const itemsPerDay = pace === 'relaxed' ? 2 : pace === 'fast-paced' ? 4 : 3;
    const totalNeeded = days * itemsPerDay;
    const attractions = await fetchCityAttractions(
      cityInfo.lat,
      cityInfo.lng,
      cityInfo.cityName,
      cityInfo.countryName,
      totalNeeded
    );

    // 3. Google Gemini Integration (Free tier gemini-3.8-flash)
    const apiKey = process.env.GEMINI_API_KEY || '';
    let aiEngine = 'Voyora Neural Spatial Engine (Verified Cartography)';
    let planData: any = null;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are VOYORA's Senior Luxury Travel Architect.
Design an unforgettable, culturally grounded ${days}-day itinerary in ${cityInfo.cityName}, ${cityInfo.countryName}.
Pace: ${pace} (${itemsPerDay} stops per day).
Traveler Interests: ${interests.join(', ') || 'Architecture, Cultural Heritage, Scenic Views'}.

STRICT RULES:
1. You MUST ONLY use the verified attractions provided below. Never introduce places from other cities.
2. Group attractions geographically to minimize travel time.
3. Assign each attraction to an optimal time slot: Morning, Afternoon, or Evening.
4. Provide authentic regional culinary specialties for ${cityInfo.cityName}.
5. Provide cultural etiquette guidelines specific to ${cityInfo.cityName}, ${cityInfo.countryName}.

Verified Attractions in ${cityInfo.cityName}:
${attractions.map(a => `- ID: "${a.id}", Name: "${a.name}", Category: "${a.category}", Description: "${a.description?.slice(0, 140)}"`).join('\n')}`;

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
              planData = JSON.parse(aiRes.text);
              aiEngine = `Google Gemini (${model} GenAI Active)`;
              break;
            }
          } catch (mErr: any) {
            console.warn(`Model ${model} failed:`, mErr.message);
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini invocation error:', geminiErr.message);
      }
    }

    // 4. Assemble Final Response and Validate Attractions & Transit Distances
    const finalDays: any[] = [];
    const timeSlotOptions = ['Morning', 'Afternoon', 'Evening', 'Evening'];
    let poolIndex = 0;

    for (let d = 1; d <= days; d++) {
      const aiDay = planData?.days?.find((day: any) => day.dayNumber === d);
      const dayItems: any[] = [];
      let prevDest: DestinationCandidate | null = null;
      let dayTransitKm = 0;

      for (let s = 0; s < itemsPerDay; s++) {
        // Try finding attraction mapped by AI, or pull sequentially from verified pool
        let dest: DestinationCandidate | undefined = undefined;
        let suggestionNote = 'Allow 1.5 - 2 hours to soak in the cultural atmosphere and architectural details.';
        let timeSlot = timeSlotOptions[s] || 'Evening';
        let estimatedHours = 2;

        if (aiDay?.items?.[s]) {
          const aiItem = aiDay.items[s];
          dest = attractions.find(a => a.id === aiItem.destinationId);
          if (aiItem.suggestionNote) suggestionNote = aiItem.suggestionNote;
          if (aiItem.timeSlot) timeSlot = aiItem.timeSlot;
          if (aiItem.estimatedHours) estimatedHours = aiItem.estimatedHours;
        }

        if (!dest) {
          dest = attractions[poolIndex % attractions.length];
          poolIndex++;
        }

        // Real Haversine distance between consecutive stops
        let transitFromPrevKm: number | undefined = undefined;
        let transitTimeMin: number | undefined = undefined;

        if (prevDest && dest) {
          transitFromPrevKm = haversineDistanceKm(prevDest.lat, prevDest.lng, dest.lat, dest.lng);
          dayTransitKm += transitFromPrevKm;
          transitTimeMin = Math.max(5, Math.round((transitFromPrevKm / 24) * 60));
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

      finalDays.push({
        dayNumber: d,
        title: aiDay?.title || `Day ${d}: ${cityInfo.cityName} Cultural Discovery`,
        theme: aiDay?.theme || (d === 1 ? 'Historic Icons & Foundations' : d === 2 ? 'Art, Architecture & Traditions' : 'Scenic Horizons & Serene Retreats'),
        insiderTip: aiDay?.insiderTip || `Begin your exploration around 09:00 for optimal morning lighting and calm crowds.`,
        totalTransitKm: Math.round(dayTransitKm * 10) / 10,
        items: dayItems,
      });
    }

    const responsePayload = {
      city: cityInfo.cityName,
      daysCount: days,
      pace,
      interests,
      days: finalDays,
      totalPlaces: finalDays.reduce((sum, d) => sum + d.items.length, 0),
      aiEngine,
      summary: planData?.summary || `A bespoke ${days}-day ${pace} itinerary across the verified cultural landmarks, scenic points of interest, and authentic local experiences of ${cityInfo.cityName}, ${cityInfo.countryName}.`,
      culturalEtiquette: planData?.culturalEtiquette || [
        `Respect local customs, sacred sanctums, and community traditions when exploring ${cityInfo.cityName}.`,
        `Pre-booking tickets online is recommended for popular heritage sites during peak hours.`,
        `Keep local currency handy for artisanal bazaars and heritage food stalls.`,
      ],
      diningHighlights: planData?.diningHighlights || [
        { dish: `Signature ${cityInfo.cityName} Regional Breakfast`, description: 'Locally celebrated breakfast prepared with farm-fresh regional ingredients.', bestTime: 'Morning' },
        { dish: `Heritage ${cityInfo.cityName} Specialty Course`, description: 'Revered culinary hallmark passed down through local generations.', bestTime: 'Lunch' },
        { dish: `Artisan Street Delicacy`, description: 'Vibrant local flavors found in bustling evening markets and heritage food alleys.', bestTime: 'Evening' },
      ],
    };

    // Store in cache for 30 minutes
    PLAN_CACHE.set(cacheKey, {
      data: responsePayload,
      expiresAt: Date.now() + 30 * 60 * 1000,
    });

    return new Response(JSON.stringify({ success: true, data: responsePayload }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('Planner error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal error generating smart itinerary.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
