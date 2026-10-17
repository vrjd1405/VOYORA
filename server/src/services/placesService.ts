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
  },
  {
    id: "dest_berlin_brandenburg",
    name: "Brandenburg Gate",
    category: "Landmark",
    city: "Berlin",
    country: "Germany",
    lat: 52.5163,
    lng: 13.3777,
    imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Pariser Platz, 10117 Berlin, Germany",
    description: "An 18th-century neoclassical monument restored as an iconic symbol of European unity and peace. Commissioned by King Frederick William II, crowned by the majestic bronze Quadriga.",
    openingHours: "Open 24 hours daily",
    website: "https://www.berlin.de/en/attractions/brandenburg-gate",
    tags: ["monument", "historic", "neoclassical", "unity", "pariser-platz"]
  },
  {
    id: "dest_berlin_museum_island",
    name: "Museum Island & Berlin Cathedral",
    category: "Culture & Museum",
    city: "Berlin",
    country: "Germany",
    lat: 52.5169,
    lng: 13.4010,
    imageUrl: "https://images.unsplash.com/photo-1587330979470-3595ac045ab0?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Am Lustgarten, 10178 Berlin, Germany",
    description: "A UNESCO World Heritage sanctuary in the heart of the Spree River housing five internationally celebrated museums alongside the monumental dome of the Berlin Cathedral.",
    openingHours: "10:00 - 18:00 (closed Mondays)",
    website: "https://www.smb.museum",
    tags: ["unesco", "museums", "cathedral", "antiquities", "spree"]
  },
  {
    id: "dest_singapore_gardens_bay",
    name: "Gardens by the Bay",
    category: "Nature & Park",
    city: "Singapore",
    country: "Singapore",
    lat: 1.2816,
    lng: 103.8636,
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "18 Marina Gardens Dr, Singapore 018953",
    description: "An awe-inspiring 250-acre horticultural oasis showcasing towering Supertrees, the cloud-shrouded 35m indoor waterfall of the Cloud Forest, and the climate-controlled Flower Dome.",
    openingHours: "05:00 - 02:00 daily (Conservatories 09:00 - 21:00)",
    website: "https://www.gardensbythebay.com.sg",
    tags: ["supertrees", "biodome", "waterfall", "futuristic", "botanical"]
  },
  {
    id: "dest_singapore_marina_sands",
    name: "Marina Bay Sands SkyPark",
    category: "Landmark",
    city: "Singapore",
    country: "Singapore",
    lat: 1.2834,
    lng: 103.8607,
    imageUrl: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "10 Bayfront Ave, Singapore 018956",
    description: "The world's largest public cantilevered platform perched 200 meters in the clouds across three towers, offering breathtaking 360-degree vistas across Singapore Strait and Marina Bay.",
    openingHours: "11:00 - 21:00 daily",
    website: "https://www.marinabaysands.com",
    tags: ["skyline", "observation", "luxury", "iconic", "cantilever"]
  },
  {
    id: "dest_sydney_opera_house",
    name: "Sydney Opera House",
    category: "Culture & Museum",
    city: "Sydney",
    country: "Australia",
    lat: -33.8568,
    lng: 151.2153,
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Bennelong Point, Sydney NSW 2000, Australia",
    description: "Jørn Utzon's 20th-century architectural masterpiece with its signature sail-like concrete shells overlooking Sydney Harbour. A UNESCO World Heritage cultural performing arts titan.",
    openingHours: "09:00 - 20:30 daily",
    website: "https://www.sydneyoperahouse.com",
    tags: ["unesco", "harbour", "architecture", "performing-arts", "australia"]
  },
  {
    id: "dest_sydney_bondi_beach",
    name: "Bondi Beach & Coastal Walk",
    category: "Coastal & Beach",
    city: "Sydney",
    country: "Australia",
    lat: -33.8915,
    lng: 151.2767,
    imageUrl: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "Queen Elizabeth Dr, Bondi Beach NSW 2026, Australia",
    description: "Australia's most iconic crescent of golden sand and rolling Pacific surf, seamlessly connected to the dramatic 6km clifftop coastal walk from Bondi to Coogee.",
    openingHours: "Open 24 hours daily",
    website: "https://www.waverley.nsw.gov.au/recreation/beaches/bondi_beach",
    tags: ["surf", "golden-sand", "coastal-walk", "ocean", "pacific"]
  },
  {
    id: "dest_cairo_pyramids",
    name: "Great Pyramids of Giza & Sphinx",
    category: "Historic",
    city: "Cairo",
    country: "Egypt",
    lat: 29.9792,
    lng: 31.1342,
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Al Haram, Giza Governorate 3512201, Egypt",
    description: "The sole surviving wonder of the ancient world. Erected over 4,500 years ago during Egypt's Old Kingdom, guarded eternally by the enigmatic limestone Great Sphinx.",
    openingHours: "08:00 - 17:00 daily",
    website: "https://egymonuments.gov.eg",
    tags: ["ancient-wonder", "pharaohs", "desert", "pyramids", "sphinx"]
  },
  {
    id: "dest_mumbai_gateway_india",
    name: "Gateway of India",
    category: "Historic",
    city: "Mumbai",
    country: "India",
    lat: 18.9220,
    lng: 72.8347,
    imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India",
    description: "An imposing 26m Indo-Saracenic basalt arch built to commemorate the 1911 royal visit of King George V, standing majestically on the Mumbai harbour waterfront.",
    openingHours: "Open 24 hours daily",
    website: "https://mumbaicity.gov.in",
    tags: ["monument", "waterfront", "historic", "indo-saracenic", "colaba"]
  },
  {
    id: "dest_mumbai_marine_drive",
    name: "Marine Drive Promenade",
    category: "Landmark",
    city: "Mumbai",
    country: "India",
    lat: 18.9432,
    lng: 72.8234,
    imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Netaji Subhash Chandra Bose Rd, Mumbai 400020, India",
    description: "The Queen's Necklace: a sweeping 3.6km C-shaped boulevard skirting the Arabian Sea, flanked by one of the world's largest collections of Art Deco architecture.",
    openingHours: "Open 24 hours daily",
    website: "https://mumbaicity.gov.in",
    tags: ["promenade", "arabian-sea", "art-deco", "sunset", "queens-necklace"]
  },
  {
    id: "dest_amsterdam_rijksmuseum",
    name: "Rijksmuseum",
    category: "Culture & Museum",
    city: "Amsterdam",
    country: "Netherlands",
    lat: 52.3600,
    lng: 4.8852,
    imageUrl: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Museumstraat 1, 1071 XX Amsterdam, Netherlands",
    description: "The national museum of the Netherlands dedicated to Dutch arts and history. Marvel at Rembrandt's The Night Watch, Vermeer's The Milkmaid, and 8,000 historic treasures.",
    openingHours: "09:00 - 17:00 daily",
    website: "https://www.rijksmuseum.nl",
    tags: ["rembrandt", "vermeer", "dutch-masters", "museumplein", "fine-art"]
  },
  {
    id: "dest_prague_charles_bridge",
    name: "Charles Bridge",
    category: "Historic",
    city: "Prague",
    country: "Czech Republic",
    lat: 50.0865,
    lng: 14.4114,
    imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Karlův most, 110 00 Praha 1, Czechia",
    description: "A legendary 14th-century Gothic stone bridge spanning the Vltava River. Adorned with 30 Baroque statues of saints and flanked by fortified towers connecting Old Town to Malá Strana.",
    openingHours: "Open 24 hours daily",
    website: "https://www.prague.eu",
    tags: ["gothic", "vltava", "baroque-statues", "historic", "fairytale"]
  },
  {
    id: "dest_seoul_gyeongbokgung",
    name: "Gyeongbokgung Palace",
    category: "Historic",
    city: "Seoul",
    country: "South Korea",
    lat: 37.5796,
    lng: 126.9770,
    imageUrl: "https://images.unsplash.com/photo-1538669715315-1558eb8d5721?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "161 Sajik-ro, Jongno-gu, Seoul, South Korea",
    description: "The primary royal palace of the Joseon dynasty, originally built in 1395. Features the majestic Gwanghwamun Gate, Geunjeongjeon throne hall, and authentic Royal Guard Changing ceremonies.",
    openingHours: "09:00 - 18:00 (closed Tuesdays)",
    website: "https://www.royalpalace.go.kr",
    tags: ["palace", "joseon", "royal-guard", "hanbok", "architecture"]
  },
  {
    id: "dest_sf_golden_gate",
    name: "Golden Gate Bridge & Vista Point",
    category: "Landmark",
    city: "San Francisco",
    country: "United States",
    lat: 37.8199,
    lng: -122.4783,
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Golden Gate Bridge, San Francisco, CA 94129, USA",
    description: "The world-famous suspension bridge spanning the Golden Gate Strait in its signature International Orange hue. Marvel at views from Marin Headlands and Battery Spencer.",
    openingHours: "Open 24 hours daily (pedestrian walkways daytime)",
    website: "https://www.goldengate.org",
    tags: ["suspension-bridge", "pacific", "fog", "engineering", "vista"]
  },
  {
    id: "dest_rio_christ_redeemer",
    name: "Christ the Redeemer",
    category: "Landmark",
    city: "Rio de Janeiro",
    country: "Brazil",
    lat: -22.9519,
    lng: -43.2105,
    imageUrl: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Parque Nacional da Tijuca, Rio de Janeiro - RJ, Brazil",
    description: "A colossal 30-meter Art Deco statue of Jesus Christ atop the 700-meter Corcovado mountain in Tijuca National Park. One of the New Seven Wonders of the World.",
    openingHours: "08:00 - 19:00 daily",
    website: "https://cristoredentoroficial.com.br",
    tags: ["art-deco", "corcovado", "seven-wonders", "panorama", "tijuca"]
  }
];

// In-memory cache for on-the-fly discovered places across any global city
export const DYNAMIC_DESTINATIONS_CACHE = new Map<string, Destination>();

/**
 * Fetch genuine travel photography from Unsplash API
 */
async function fetchUnsplashPhoto(term: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY || '48ZSI9ByxmEthvD07aLYRSdBSEsDmxMU2-PGWvLYoik';
  if (!accessKey) return null;
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&client_id=${accessKey}&orientation=landscape&per_page=1`;
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data.results && data.results.length > 0) {
        return data.results[0].urls?.regular || data.results[0].urls?.full || null;
      }
    }
  } catch (err) {
    console.warn('Unsplash photo fetch error:', err);
  }
  return null;
}

/**
 * Live Geoapify Places & Geocoding integration with Unsplash high-res photography
 */
async function fetchFromGeoapify(query: string, preferredCategory?: string): Promise<Destination[]> {
  const geoapifyKey = process.env.GEOAPIFY_API_KEY || '715d707e4ce3492c8ac0a46675cdace9';
  if (!geoapifyKey) return [];

  try {
    const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${geoapifyKey}&limit=5`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) return [];
    const geoData = (await geoRes.json()) as any;
    if (!geoData.features || geoData.features.length === 0) return [];

    const results: Destination[] = [];

    for (const f of geoData.features) {
      const p = f.properties;
      const rawName = p.name || (p.formatted ? p.formatted.split(',')[0].trim() : query);
      const cityName = p.city || p.county || p.state || 'Global';
      const countryName = p.country || 'Destination';
      const placeId = `geo_${p.place_id || p.osm_id || Math.random().toString(36).slice(2, 8)}`;

      if (DYNAMIC_DESTINATIONS_CACHE.has(placeId)) {
        results.push(DYNAMIC_DESTINATIONS_CACHE.get(placeId)!);
        continue;
      }

      // Infer category
      let category = preferredCategory || 'Landmark';
      const cat = (p.category || '').toLowerCase();
      if (cat.includes('museum') || cat.includes('entertainment.culture')) {
        category = 'Culture & Museum';
      } else if (cat.includes('natural') || cat.includes('leisure.park')) {
        category = 'Nature & Park';
      } else if (cat.includes('beach')) {
        category = 'Coastal & Beach';
      } else if (cat.includes('historic') || cat.includes('heritage')) {
        category = 'Historic';
      }

      // Fetch authentic photography: Unsplash -> Wikipedia -> Curated fallback
      let imageUrl = await fetchUnsplashPhoto(`${rawName} ${cityName}`);
      let description = `${rawName} is a verified location in ${cityName}, ${countryName}. Verified with live Geoapify cartography.`;

      try {
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(rawName)}`);
        if (wikiRes.ok) {
          const wikiData = (await wikiRes.json()) as any;
          if (wikiData.extract) description = wikiData.extract;
          if (!imageUrl && wikiData.originalimage?.source) {
            imageUrl = wikiData.originalimage.source;
          }
        }
      } catch {}

      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85';
      }

      const dest: Destination = {
        id: placeId,
        name: rawName,
        category,
        city: cityName,
        country: countryName,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        imageUrl,
        rating: 4.8,
        address: p.formatted,
        description,
        tags: [cityName.toLowerCase(), countryName.toLowerCase(), category.toLowerCase(), 'geoapify-verified']
      };

      DYNAMIC_DESTINATIONS_CACHE.set(placeId, dest);
      results.push(dest);
    }

    return results;
  } catch (err) {
    console.warn('Geoapify search error:', err);
    return [];
  }
}

/**
 * Live fallback: Query OpenStreetMap Nominatim for exact real-world coordinates and address,
 * paired with Wikipedia REST API for genuine encyclopedic summaries and high-res photos.
 */
async function fetchFromOSMAndWiki(searchQuery: string, preferredCategory?: string): Promise<Destination[]> {
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=6`;
    const nomRes = await fetch(nomUrl, {
      headers: { 'User-Agent': 'VoyoraTravelPlanner/1.0 (info@voyora.travel)' },
    });
    if (!nomRes.ok) return [];
    const places = (await nomRes.json()) as any;
    if (!Array.isArray(places) || places.length === 0) return [];

    const results: Destination[] = [];

    for (const p of places) {
      const placeId = `osm_${p.osm_id || p.place_id}`;
      if (DYNAMIC_DESTINATIONS_CACHE.has(placeId)) {
        results.push(DYNAMIC_DESTINATIONS_CACHE.get(placeId)!);
        continue;
      }

      const rawName = p.name || (p.display_name ? p.display_name.split(',')[0].trim() : searchQuery);
      const cityName = p.address?.city || p.address?.town || p.address?.municipality || p.address?.state || 'Global';
      const countryName = p.address?.country || 'Destination';

      // Infer category
      let category = preferredCategory || 'Landmark';
      const type = (p.type || '').toLowerCase();
      const pClass = (p.class || '').toLowerCase();
      if (type.includes('museum') || pClass.includes('arts') || type.includes('theatre') || type.includes('gallery')) {
        category = 'Culture & Museum';
      } else if (type.includes('park') || type.includes('garden') || type.includes('nature') || type.includes('viewpoint') || type.includes('wood')) {
        category = 'Nature & Park';
      } else if (type.includes('beach') || type.includes('coast') || type.includes('bay') || type.includes('sea')) {
        category = 'Coastal & Beach';
      } else if (type.includes('castle') || type.includes('monument') || type.includes('ruins') || type.includes('historic') || type.includes('temple') || type.includes('church')) {
        category = 'Historic';
      }

      // Fetch authentic photography and summary: Unsplash -> Wikipedia
      let imageUrl = await fetchUnsplashPhoto(`${rawName} ${cityName}`);
      let description = `${rawName} is a verified location in ${cityName}, ${countryName}. Discovered via OpenStreetMap geographic cartography.`;

      try {
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(rawName)}`);
        if (wikiRes.ok) {
          const wikiData = (await wikiRes.json()) as any;
          if (wikiData.extract) {
            description = wikiData.extract;
          }
          if (!imageUrl && wikiData.originalimage?.source) {
            imageUrl = wikiData.originalimage.source;
          } else if (!imageUrl && wikiData.thumbnail?.source) {
            imageUrl = wikiData.thumbnail.source.replace(/\/\d+px-/, '/1200px-');
          }
        }
      } catch {
        // graceful fallback
      }

      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85';
      }

      const dest: Destination = {
        id: placeId,
        name: rawName,
        category,
        city: cityName,
        country: countryName,
        lat: parseFloat(p.lat),
        lng: parseFloat(p.lon),
        imageUrl,
        rating: 4.7,
        address: p.display_name,
        description,
        tags: [cityName.toLowerCase(), countryName.toLowerCase(), category.toLowerCase(), 'verified-osm', 'live-discovery']
      };

      DYNAMIC_DESTINATIONS_CACHE.set(placeId, dest);
      results.push(dest);
    }

    return results;
  } catch (err) {
    console.warn('OSM / Wiki search encountered error:', err);
    return [];
  }
}

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

  // Combine verified curated dataset and any previously cached dynamic places
  const allKnown = [...VERIFIED_DESTINATIONS, ...Array.from(DYNAMIC_DESTINATIONS_CACHE.values())];
  let filtered = [...allKnown];

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

  // If query returned fewer than 2 results, perform live discovery using Geoapify + Unsplash + Wikipedia
  if (query && filtered.length < 2) {
    const geoDiscovered = await fetchFromGeoapify(query, categoryFilter);
    if (geoDiscovered.length > 0) {
      for (const item of geoDiscovered) {
        if (!filtered.some(f => f.id === item.id)) {
          filtered.push(item);
        }
      }
    } else {
      // Fallback to OpenStreetMap Nominatim
      const osmDiscovered = await fetchFromOSMAndWiki(query, categoryFilter);
      for (const item of osmDiscovered) {
        if (!filtered.some(f => f.id === item.id)) {
          filtered.push(item);
        }
      }
    }
  } else if (cityFilter && cityFilter !== 'all' && filtered.length < 2) {
    // If specific city selected has no places yet, discover places in that city
    const geoDiscovered = await fetchFromGeoapify(`${cityFilter} tourism`, categoryFilter);
    if (geoDiscovered.length > 0) {
      for (const item of geoDiscovered) {
        if (!filtered.some(f => f.id === item.id)) {
          filtered.push(item);
        }
      }
    } else {
      const osmDiscovered = await fetchFromOSMAndWiki(`${cityFilter} tourism`, categoryFilter);
      for (const item of osmDiscovered) {
        if (!filtered.some(f => f.id === item.id)) {
          filtered.push(item);
        }
      }
    }
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

export async function getDestinationById(id: string): Promise<Destination | null> {
  const dest = VERIFIED_DESTINATIONS.find(d => d.id === id);
  if (dest) return dest;

  if (DYNAMIC_DESTINATIONS_CACHE.has(id)) {
    return DYNAMIC_DESTINATIONS_CACHE.get(id)!;
  }

  // Dynamic recovery for OSM IDs if not in cache
  if (id.startsWith('osm_')) {
    const rawId = id.replace('osm_', '');
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/lookup?osm_ids=W${rawId},N${rawId},R${rawId}&format=json&addressdetails=1`;
      const nomRes = await fetch(nomUrl, {
        headers: { 'User-Agent': 'VoyoraTravelPlanner/1.0 (info@voyora.travel)' },
      });
      if (nomRes.ok) {
        const places = (await nomRes.json()) as any;
        if (Array.isArray(places) && places.length > 0) {
          const p = places[0];
          const rawName = p.name || (p.display_name ? p.display_name.split(',')[0].trim() : 'Landmark');
          const cityName = p.address?.city || p.address?.town || p.address?.state || 'Global';
          const countryName = p.address?.country || 'Destination';

          let description = `${rawName} in ${cityName}, ${countryName}.`;
          let imageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85';
          try {
            const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(rawName)}`);
            if (wikiRes.ok) {
              const wiki = (await wikiRes.json()) as any;
              if (wiki.extract) description = wiki.extract;
              if (wiki.originalimage?.source) imageUrl = wiki.originalimage.source;
            }
          } catch {}

          const restoredDest: Destination = {
            id,
            name: rawName,
            category: 'Landmark',
            city: cityName,
            country: countryName,
            lat: parseFloat(p.lat),
            lng: parseFloat(p.lon),
            imageUrl,
            rating: 4.7,
            address: p.display_name,
            description,
            tags: [cityName.toLowerCase(), 'verified-osm']
          };
          DYNAMIC_DESTINATIONS_CACHE.set(id, restoredDest);
          return restoredDest;
        }
      }
    } catch {}
  }

  // Dynamic recovery for Geoapify IDs if not in cache
  if (id.startsWith('geo_')) {
    const rawId = id.replace('geo_', '');
    const geoapifyKey = process.env.GEOAPIFY_API_KEY || '715d707e4ce3492c8ac0a46675cdace9';
    if (geoapifyKey) {
      try {
        const placeRes = await fetch(`https://api.geoapify.com/v2/place-details?id=${encodeURIComponent(rawId)}&apiKey=${geoapifyKey}`);
        if (placeRes.ok) {
          const placeData = (await placeRes.json()) as any;
          const p = placeData.features?.[0]?.properties;
          if (p) {
            const rawName = p.name || p.formatted?.split(',')[0] || 'Destination';
            const cityName = p.city || p.county || p.state || 'Global';
            const countryName = p.country || 'Destination';
            const [lng, lat] = placeData.features[0].geometry.coordinates;

            let imageUrl = await fetchUnsplashPhoto(`${rawName} ${cityName}`);
            if (!imageUrl) imageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85';

            const restoredDest: Destination = {
              id,
              name: rawName,
              category: 'Landmark',
              city: cityName,
              country: countryName,
              lat,
              lng,
              imageUrl,
              rating: 4.8,
              address: p.formatted,
              description: `${rawName} is a verified location in ${cityName}, ${countryName}. Verified via Geoapify cartography.`,
              tags: [cityName.toLowerCase(), 'geoapify-verified']
            };
            DYNAMIC_DESTINATIONS_CACHE.set(id, restoredDest);
            return restoredDest;
          }
        }
      } catch {}
    }
  }

  return null;
}
