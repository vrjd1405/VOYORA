import { Destination } from '../types/index.js';

// Curated verified global destinations with authentic coordinates, addresses, and high-res imagery
export const VERIFIED_DESTINATIONS: Destination[] = [
  {
    id: "dest_paris_eiffel",
    name: "Eiffel Tower",
    category: "Landmark",
    city: "Paris",
    country: "France",
    lat: 48.8584,
    lng: 2.2945,
    imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
    description: "The world-renowned 330m iron lattice tower on the Champ de Mars, designed by Gustave Eiffel. Completed in 1889 for the Exposition Universelle, it remains an eternal emblem of architectural wonder and romance.",
    openingHours: "09:30 - 22:45 daily",
    website: "https://www.toureiffel.paris",
    tags: ["iconic", "views", "architecture", "monument", "historic"]
  },
  {
    id: "dest_paris_louvre",
    name: "Louvre Museum",
    category: "Culture & Museum",
    city: "Paris",
    country: "France",
    lat: 48.8606,
    lng: 2.3376,
    imageUrl: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Rue de Rivoli, 75001 Paris, France",
    description: "The world's most visited art museum, housed in the monumental Louvre Palace. Home to Leonardo da Vinci's Mona Lisa, the Venus de Milo, and over 35,000 priceless historic masterworks across 8 curator departments.",
    openingHours: "09:00 - 18:00 (closed Tuesdays, late Wed/Fri)",
    website: "https://www.louvre.fr",
    tags: ["art", "museum", "history", "masterpieces", "culture"]
  },
  {
    id: "dest_paris_montmartre",
    name: "Sacré-Cœur & Montmartre",
    category: "Historic",
    city: "Paris",
    country: "France",
    lat: 48.8867,
    lng: 2.3431,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "35 Rue du Chevalier de la Barre, 75018 Paris, France",
    description: "Perched atop the highest natural summit in Paris, this Romano-Byzantine basilica offers panoramic views stretching across the entire capital, amidst the cobblestone bohemian artist alleys of Montmartre.",
    openingHours: "06:30 - 22:30 daily",
    website: "https://www.sacre-coeur-montmartre.com",
    tags: ["panorama", "bohemian", "church", "historic", "scenic"]
  },
  {
    id: "dest_tokyo_sensoji",
    name: "Sensō-ji Temple",
    category: "Historic",
    city: "Tokyo",
    country: "Japan",
    lat: 35.7148,
    lng: 139.7967,
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "2-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
    description: "Tokyo's oldest and most significant Buddhist temple, dedicated to Bodhisattva Kannon. Founded in 645 AD, approached via the vibrant Nakamise shopping street adorned with ancient lanterns and street delicacies.",
    openingHours: "06:00 - 17:00 daily (grounds open 24/7)",
    website: "https://www.senso-ji.jp",
    tags: ["temple", "tradition", "asakusa", "buddhism", "historic"]
  },
  {
    id: "dest_tokyo_shibuya",
    name: "Shibuya Crossing & Sky",
    category: "Landmark",
    city: "Tokyo",
    country: "Japan",
    lat: 35.6595,
    lng: 139.7005,
    imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "2-24-12 Shibuya, Shibuya City, Tokyo 150-0002, Japan",
    description: "The world's busiest pedestrian scramble crossing where up to 3,000 people cross simultaneously with every signal change, crowned by the open-air 360-degree observation deck Shibuya Sky.",
    openingHours: "10:00 - 22:30 daily",
    website: "https://www.shibuya-scramble-square.com/sky",
    tags: ["urban", "neon", "crossing", "nightlife", "observation"]
  },
  {
    id: "dest_tokyo_shinjuku_gyoen",
    name: "Shinjuku Gyoen National Garden",
    category: "Nature & Park",
    city: "Tokyo",
    country: "Japan",
    lat: 35.6852,
    lng: 139.7101,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "11 Naitomachi, Shinjuku City, Tokyo 160-0014, Japan",
    description: "A tranquil 144-acre sanctuary blending traditional Japanese landscape, English formal, and French classical gardens. Famed for its spring cherry blossoms and serene reflection ponds in the heart of metropolitan Tokyo.",
    openingHours: "09:00 - 17:30 (closed Mondays)",
    website: "https://www.env.go.jp/garden/shinjukugyoen",
    tags: ["garden", "nature", "peaceful", "cherry blossoms", "botanical"]
  },
  {
    id: "dest_rome_colosseum",
    name: "The Colosseum & Roman Forum",
    category: "Historic",
    city: "Rome",
    country: "Italy",
    lat: 41.8902,
    lng: 12.4922,
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
    description: "The largest ancient amphitheatre ever constructed, inaugurated in 80 AD under Emperor Titus. Step back into antiquity where gladiators battled and explore the adjacent ruins of the political heart of the Roman Empire.",
    openingHours: "09:00 - 19:15 daily",
    website: "https://colosseo.it",
    tags: ["ancient", "empire", "ruins", "unesco", "monument"]
  },
  {
    id: "dest_rome_pantheon",
    name: "Pantheon",
    category: "Historic",
    city: "Rome",
    country: "Italy",
    lat: 41.8986,
    lng: 12.4769,
    imageUrl: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Piazza della Rotonda, 00186 Roma RM, Italy",
    description: "Completed around 126 AD by Emperor Hadrian, this former Roman temple boasts the world's largest unreinforced concrete dome, illuminated by a central open oculus that connects mortals to the heavens.",
    openingHours: "09:00 - 19:00 daily",
    website: "https://www.pantheonroma.com",
    tags: ["architecture", "dome", "ancient", "marvel", "historic"]
  },
  {
    id: "dest_rome_trevi",
    name: "Trevi Fountain",
    category: "Landmark",
    city: "Rome",
    country: "Italy",
    lat: 41.9009,
    lng: 12.4833,
    imageUrl: "https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Piazza di Trevi, 00187 Roma RM, Italy",
    description: "Rome's most majestic Baroque fountain, designed by Nicola Salvi and finished by Giuseppe Pannini. Legend dictates that tossing a coin over your left shoulder with your right hand guarantees a return to the Eternal City.",
    openingHours: "Open 24 hours daily",
    website: "https://www.turismoroma.it",
    tags: ["baroque", "fountain", "tradition", "sculpture", "romantic"]
  },
  {
    id: "dest_barcelona_sagrada",
    name: "Basílica de la Sagrada Família",
    category: "Landmark",
    city: "Barcelona",
    country: "Spain",
    lat: 41.4036,
    lng: 2.1744,
    imageUrl: "https://images.unsplash.com/photo-1583779457094-0cecf86169a1?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "C/ de Mallorca, 401, 08013 Barcelona, Spain",
    description: "Antoni Gaudí's unfinished masterpiece and UNESCO World Heritage sanctuary. Its soaring organic spires, stained glass forest interior, and intricate Nativity and Passion facades stand as an unrivaled apex of Modernisme.",
    openingHours: "09:00 - 18:00 daily",
    website: "https://sagradafamilia.org",
    tags: ["gaudi", "architecture", "stained glass", "unesco", "masterpiece"]
  },
  {
    id: "dest_barcelona_park_guell",
    name: "Park Güell",
    category: "Nature & Park",
    city: "Barcelona",
    country: "Spain",
    lat: 41.4145,
    lng: 2.1527,
    imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=85",
    rating: 4.6,
    address: "Gràcia, 08024 Barcelona, Spain",
    description: "A whimsical public park system composed of gardens and architectonic elements atop Carmel Hill. Highlights include the vibrant mosaic dragon stairway and undulating seraphic benches overlooking the Mediterranean Sea.",
    openingHours: "09:30 - 19:30 daily",
    website: "https://parkguell.barcelona",
    tags: ["mosaic", "views", "gaudi", "park", "colorful"]
  },
  {
    id: "dest_amalfi_positano",
    name: "Positano Cliffside & Marina",
    category: "Coastal & Beach",
    city: "Amalfi Coast",
    country: "Italy",
    lat: 40.6281,
    lng: 14.4850,
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Via Cristoforo Colombo, 84017 Positano SA, Italy",
    description: "A cascade of pastel-hued villas perched dramatically on vertical seaside cliffs tumbling down to the crystalline Tyrrhenian waters. Renowned for its winding pebble paths, lemon groves, and chic coastal boutiques.",
    openingHours: "Open year-round",
    website: "https://www.amalficoast.com",
    tags: ["coastal", "luxury", "scenic", "beach", "mediterranean"]
  },
  {
    id: "dest_kyoto_fushimi",
    name: "Fushimi Inari Taisha",
    category: "Historic",
    city: "Kyoto",
    country: "Japan",
    lat: 34.9671,
    lng: 135.7727,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto 612-0882, Japan",
    description: "The premier Shinto shrine dedicated to Inari, the deity of rice, agriculture, and prosperity. Thousands of vibrant vermilion torii gates snake through the sacred woodlands of Mount Inari.",
    openingHours: "Open 24 hours daily",
    website: "https://inari.jp",
    tags: ["torii gates", "shrine", "shinto", "hiking", "spiritual"]
  },
  {
    id: "dest_kyoto_kinkakuji",
    name: "Kinkaku-ji (The Golden Pavilion)",
    category: "Culture & Museum",
    city: "Kyoto",
    country: "Japan",
    lat: 35.0394,
    lng: 135.7292,
    imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "1 Kinkakujicho, Kita Ward, Kyoto 603-8361, Japan",
    description: "A Zen Buddhist temple whose top two floors are completely covered in dazzling pure gold leaf, reflecting serenely across the mirror pond Kyōko-chi. A masterpiece of Muromachi period garden landscape architecture.",
    openingHours: "09:00 - 17:00 daily",
    website: "https://www.shokoku-ji.jp/kinkakuji",
    tags: ["gold", "zen", "reflection", "unesco", "buddhism"]
  },
  {
    id: "dest_nyc_central_park",
    name: "Central Park",
    category: "Nature & Park",
    city: "New York",
    country: "United States",
    lat: 40.785091,
    lng: -73.968285,
    imageUrl: "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "59th to 110th St, Manhattan, New York, NY, USA",
    description: "An 843-acre urban masterpiece designed by Frederick Law Olmsted and Calvert Vaux. Boasting Bethesda Terrace, Bow Bridge, rolling meadows, walking paths, and lakes framed by Manhattan's legendary skyline.",
    openingHours: "06:00 - 01:00 daily",
    website: "https://www.centralparknyc.org",
    tags: ["park", "manhattan", "nature", "skyline", "iconic"]
  },
  {
    id: "dest_nyc_met",
    name: "The Metropolitan Museum of Art",
    category: "Culture & Museum",
    city: "New York",
    country: "United States",
    lat: 40.7794,
    lng: -73.9632,
    imageUrl: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "1000 5th Ave, New York, NY 10028, USA",
    description: "The Met houses over two million works spanning 5,000 years of global human history, from the Egyptian Temple of Dendur to American masters and European Impressionists on Museum Mile.",
    openingHours: "10:00 - 17:00 (Fri/Sat until 21:00, closed Wed)",
    website: "https://www.metmuseum.org",
    tags: ["art", "museum", "history", "antiquities", "5th avenue"]
  },
  {
    id: "dest_santorini_oia",
    name: "Oia Sunset & Blue Dome Churches",
    category: "Coastal & Beach",
    city: "Santorini",
    country: "Greece",
    lat: 36.4618,
    lng: 25.3753,
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Oia Village, Santorini 847 02, Greece",
    description: "Iconic whitewashed Cycladic settlements clinging to volcanic caldera cliffs, crowned with cobalt blue domes. Celebrated internationally for its golden Aegean sunsets, cliffside tavernas, and maritime vistas.",
    openingHours: "Open year-round",
    website: "https://www.santorini.gr",
    tags: ["sunset", "caldera", "greece", "whitewashed", "scenic"]
  },
  {
    id: "dest_london_big_ben",
    name: "Big Ben & Palace of Westminster",
    category: "Landmark",
    city: "London",
    country: "United Kingdom",
    lat: 51.5007,
    lng: -0.1246,
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "Westminster, London SW1A 0AA, United Kingdom",
    description: "The iconic Elizabeth Tower and Great Bell standing proudly at the north end of the Houses of Parliament on the banks of the River Thames. A Gothic Revival jewel and the historical seat of British democracy.",
    openingHours: "Tours by reservation; exterior viewable 24/7",
    website: "https://www.parliament.uk",
    tags: ["gothic", "thames", "clock tower", "london", "heritage"]
  },
  {
    id: "dest_london_british_museum",
    name: "The British Museum",
    category: "Culture & Museum",
    city: "London",
    country: "United Kingdom",
    lat: 51.5194,
    lng: -0.1270,
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Great Russell St, London WC1B 3DG, United Kingdom",
    description: "A monumental temple of human history, art, and culture. Housing the Rosetta Stone, Parthenon Sculptures, and Egyptian mummies beneath the magnificent Queen Elizabeth II Great Court glass canopy.",
    openingHours: "10:00 - 17:00 daily (Fridays until 20:30)",
    website: "https://www.britishmuseum.org",
    tags: ["history", "antiquities", "rosetta stone", "museum", "free"]
  },
  {
    id: "dest_sydney_opera",
    name: "Sydney Opera House",
    category: "Landmark",
    city: "Sydney",
    country: "Australia",
    lat: -33.8568,
    lng: 151.2153,
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Bennelong Point, Sydney NSW 2000, Australia",
    description: "Jørn Utzon's expressionist masterpiece on Bennelong Point in Sydney Harbour. Its billowing concrete shell sails create one of the most recognizable and acclaimed performing arts centers in human history.",
    openingHours: "09:00 - 17:00 daily tours",
    website: "https://www.sydneyoperahouse.com",
    tags: ["harbour", "architecture", "unesco", "performance", "sails"]
  },
  {
    id: "dest_reykjavik_blue_lagoon",
    name: "Blue Lagoon Geothermal Spa",
    category: "Nature & Park",
    city: "Reykjavik",
    country: "Iceland",
    lat: 63.8804,
    lng: -22.4495,
    imageUrl: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "Norðurljósavegur 9, 240 Grindavík, Iceland",
    description: "A geothermal mineral-rich milky-blue oasis nestled in an 800-year-old black lava field on the Reykjanes Peninsula. Naturally warmed to 37-40°C, renowned for restorative silica mud and pure serenity.",
    openingHours: "08:00 - 22:00 daily",
    website: "https://www.bluelagoon.com",
    tags: ["geothermal", "hot springs", "iceland", "spa", "relaxation"]
  },
  {
    id: "dest_dubai_burj_khalifa",
    name: "Burj Khalifa & Dubai Fountain",
    category: "Landmark",
    city: "Dubai",
    country: "United Arab Emirates",
    lat: 25.1972,
    lng: 55.2744,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE",
    description: "The world's tallest building, piercing the sky at 828 meters with 163 floors. Experience breathtaking views from observation levels At the Top and witness the world's largest choreographed dancing fountain system.",
    openingHours: "08:30 - 23:00 daily",
    website: "https://www.burjkhalifa.ae",
    tags: ["skyscraper", "skyline", "record-breaking", "luxury", "fountain"]
  }
];

export async function searchPlaces(params: {
  q?: string;
  category?: string;
  city?: string;
  limit?: number;
  page?: number;
  sort?: string;
}): Promise<{ destinations: Destination[]; total: number; page: number; totalPages: number }> {
  const limit = Math.max(1, Math.min(50, Number(params.limit) || 12));
  const page = Math.max(1, Number(params.page) || 1);
  const query = (params.q || '').trim().toLowerCase();
  const categoryFilter = (params.category || '').trim();
  const cityFilter = (params.city || '').trim().toLowerCase();

  // Try live Geoapify API if API key is provided
  const geoapifyKey = process.env.GEOAPIFY_API_KEY;
  if (geoapifyKey && query) {
    try {
      const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${geoapifyKey}&limit=10`;
      const geoRes = await fetch(geoUrl);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.features && geoData.features.length > 0) {
          const liveResults: Destination[] = geoData.features.map((f: any, idx: number) => ({
            id: `geo_${f.properties.place_id || idx}`,
            name: f.properties.name || f.properties.formatted || query,
            category: f.properties.category || 'Sight',
            city: f.properties.city || f.properties.county || f.properties.state || 'Global',
            country: f.properties.country || 'Destination',
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85",
            address: f.properties.formatted,
            rating: 4.6,
            description: `A notable location discovered in ${f.properties.city || f.properties.country || 'the region'}.`,
            tags: ["discovered", "live-api"]
          }));

          return {
            destinations: liveResults,
            total: liveResults.length,
            page: 1,
            totalPages: 1
          };
        }
      }
    } catch (err) {
      console.warn('Geoapify search failed, falling back to verified dataset:', err);
    }
  }

  // Filter verified curated dataset
  let filtered = [...VERIFIED_DESTINATIONS];

  if (query) {
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(query) ||
      d.city.toLowerCase().includes(query) ||
      d.country.toLowerCase().includes(query) ||
      d.category.toLowerCase().includes(query) ||
      d.description?.toLowerCase().includes(query) ||
      d.tags?.some(t => t.toLowerCase().includes(query))
    );
  }

  if (cityFilter && cityFilter !== 'all') {
    filtered = filtered.filter(d => d.city.toLowerCase().includes(cityFilter));
  }

  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter(d => d.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  // Sorting
  if (params.sort === 'name_asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (params.sort === 'name_desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (params.sort === 'rating_desc') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (params.sort === 'category') {
    filtered.sort((a, b) => a.category.localeCompare(b.category));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const destinations = filtered.slice(startIndex, startIndex + limit);

  return {
    destinations,
    total,
    page,
    totalPages
  };
}

export function getDestinationById(id: string): Destination | null {
  const dest = VERIFIED_DESTINATIONS.find(d => d.id === id);
  return dest || null;
}
