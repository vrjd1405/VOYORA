import { Destination } from '../types/index.js';

export const EXPANDED_GLOBAL_DESTINATIONS: Destination[] = [
  // ==========================================
  // 1. SWITZERLAND
  // ==========================================
  {
    id: "dest_swiss_matterhorn",
    name: "The Matterhorn & Gornergrat",
    category: "Nature & Park",
    city: "Zermatt",
    country: "Switzerland",
    lat: 45.9763,
    lng: 7.7491,
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Gornergrat Bahn, Bahnhofsplatz 1, 3920 Zermatt, Switzerland",
    description: "The jewel of the Swiss Alps, towering at 4,478m with its iconic pyramidal peak. Reach the 3,089m Gornergrat observatory by Europe's highest open-air cogwheel railway for breathtaking vistas across 29 four-thousand-meter summits.",
    openingHours: "Open year-round (trains run every 24 mins)",
    website: "https://www.gornergrat.ch",
    tags: ["switzerland", "alps", "matterhorn", "mountain", "panorama", "hiking"]
  },
  {
    id: "dest_swiss_jungfraujoch",
    name: "Jungfraujoch - Top of Europe",
    category: "Landmark",
    city: "Interlaken",
    country: "Switzerland",
    lat: 46.5475,
    lng: 7.9822,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Jungfraujoch, 3801 Fieschertal, Switzerland",
    description: "Europe's highest railway station at 3,454 meters above sea level, nestled between the Mönch and Jungfrau peaks. Explore the carved Ice Palace, Sphinx Observatory, and gaze over the UNESCO Aletsch Glacier—the longest ice stream in the Alps.",
    openingHours: "08:00 - 17:00 daily",
    website: "https://www.jungfrau.ch",
    tags: ["switzerland", "glacier", "top-of-europe", "unesco", "snow", "alps"]
  },
  {
    id: "dest_swiss_chapel_bridge",
    name: "Kapellbrücke (Chapel Bridge) & Water Tower",
    category: "Historic",
    city: "Lucerne",
    country: "Switzerland",
    lat: 47.0516,
    lng: 8.3073,
    imageUrl: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Kapellbrücke, 6002 Luzern, Switzerland",
    description: "The world's oldest covered wooden footbridge, spanning diagonally across the Reuss River since 1333. Adorned with 17th-century triangular gable paintings depicting Swiss history, alongside the octagonal fortified Water Tower.",
    openingHours: "Open 24 hours daily",
    website: "https://www.luzern.com",
    tags: ["switzerland", "lucerne", "wooden-bridge", "medieval", "lake", "historic"]
  },
  {
    id: "dest_swiss_zurich_oldtown",
    name: "Zurich Altstadt & Lake Promenade",
    category: "Culture & Museum",
    city: "Zurich",
    country: "Switzerland",
    lat: 47.3717,
    lng: 8.5422,
    imageUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Niederdorfstrasse, 8001 Zürich, Switzerland",
    description: "Zurich's historic old town hugging the Limmat River, framed by the twin Romanesque towers of Grossmünster and Fraumünster's world-famous Marc Chagall stained glass windows. Stroll to Lake Zurich for sunset boat cruises.",
    openingHours: "Open daily",
    website: "https://www.zuerich.com",
    tags: ["switzerland", "zurich", "old-town", "lake", "chagall", "culture"]
  },

  // ==========================================
  // 2. SINGAPORE
  // ==========================================
  {
    id: "dest_sg_gardensbythebay",
    name: "Gardens by the Bay & Supertree Grove",
    category: "Nature & Park",
    city: "Singapore",
    country: "Singapore",
    lat: 1.2816,
    lng: 103.8636,
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "18 Marina Gardens Dr, Singapore 018953",
    description: "A 101-hectare futuristic botanical wonderland. Marvel at the 16-story vertical gardens (Supertrees), the world's largest glass greenhouse (Flower Dome), and a mist-shrouded 35-meter indoor waterfall inside the Cloud Forest.",
    openingHours: "05:00 - 02:00 daily (Conservatories 09:00 - 21:00)",
    website: "https://www.gardensbythebay.com.sg",
    tags: ["singapore", "futuristic", "botanical", "supertree", "cloud-forest", "iconic"]
  },
  {
    id: "dest_sg_marinabaysands",
    name: "Marina Bay Sands SkyPark & Observation Deck",
    category: "Landmark",
    city: "Singapore",
    country: "Singapore",
    lat: 1.2838,
    lng: 103.8591,
    imageUrl: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "10 Bayfront Ave, Singapore 018956",
    description: "The world-famous architectural triumph featuring three soaring 55-story hotel towers connected by the cantilevered SkyPark. Perched 200m in the sky, it delivers panoramic views of Singapore Strait and the dazzling skyline.",
    openingHours: "11:00 - 21:00 daily",
    website: "https://www.marinabaysands.com",
    tags: ["singapore", "skypark", "skyline", "modern", "luxury", "observation"]
  },
  {
    id: "dest_sg_jewel_changi",
    name: "Jewel Changi & Rain Vortex",
    category: "Landmark",
    city: "Singapore",
    country: "Singapore",
    lat: 1.3602,
    lng: 103.9898,
    imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "78 Airport Blvd., Singapore 819666",
    description: "The world's tallest indoor waterfall, cascading 40 meters through the center of a lush multi-tiered indoor forest dome. At night, the waterfall transforms into a hypnotic light and sound spectacle.",
    openingHours: "Open 24 hours (Vortex light show hourly)",
    website: "https://www.jewelchangiairport.com",
    tags: ["singapore", "waterfall", "architecture", "indoor-forest", "jewel"]
  },

  // ==========================================
  // 3. GREECE
  // ==========================================
  {
    id: "dest_greece_acropolis",
    name: "The Acropolis & The Parthenon",
    category: "Historic",
    city: "Athens",
    country: "Greece",
    lat: 37.9715,
    lng: 23.7257,
    imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Athens 105 58, Greece",
    description: "The crowning glory of Classical Greece, dedicated to Athena Parthenos. Built in the 5th century BC under Pericles, this ancient citadel stands on a rocky outcrop overlooking Athens, symbolizing democracy and Western civilization.",
    openingHours: "08:00 - 20:00 (summer), 08:00 - 17:00 (winter)",
    website: "https://hhticket.gr",
    tags: ["greece", "athens", "parthenon", "acropolis", "ancient", "unesco"]
  },
  {
    id: "dest_greece_oia_santorini",
    name: "Oia Village & Caldera Sunset",
    category: "Coastal & Beach",
    city: "Santorini",
    country: "Greece",
    lat: 36.4618,
    lng: 25.3753,
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Oia 847 02, Santorini, Greece",
    description: "Perched high on the northern tip of Santorini's volcanic caldera rim, famed for whitewashed cave houses, cobalt blue church domes, and the most celebrated sunset on Earth melting into the Aegean Sea.",
    openingHours: "Open year-round",
    website: "https://www.visitgreece.gr",
    tags: ["greece", "santorini", "caldera", "sunset", "aegean", "romantic", "island"]
  },

  // ==========================================
  // 4. EGYPT
  // ==========================================
  {
    id: "dest_egypt_pyramids_giza",
    name: "Great Pyramids of Giza & The Sphinx",
    category: "Historic",
    city: "Cairo",
    country: "Egypt",
    lat: 29.9792,
    lng: 31.1342,
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Al Haram, Giza Governorate, Egypt",
    description: "The oldest and only surviving monument of the original Seven Wonders of the Ancient World. Constructed over 4,500 years ago during Egypt's Fourth Dynasty for Pharaoh Khufu, guarded by the enigmatic recumbent Great Sphinx.",
    openingHours: "08:00 - 17:00 daily",
    website: "https://egymonuments.gov.eg",
    tags: ["egypt", "pyramids", "sphinx", "giza", "ancient-wonder", "pharaohs"]
  },
  {
    id: "dest_egypt_karnak",
    name: "Karnak Temple Complex",
    category: "Historic",
    city: "Luxor",
    country: "Egypt",
    lat: 25.7188,
    lng: 32.6573,
    imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Karnak, Luxor, Luxor Governorate, Egypt",
    description: "The largest religious complex ever built by human hands, developed over 1,500 years. Walk through the monumental Great Hypostyle Hall, flanked by 134 towering sandstone columns carved with deep hieroglyphs.",
    openingHours: "06:00 - 17:30 daily",
    website: "https://egymonuments.gov.eg",
    tags: ["egypt", "luxor", "karnak", "temple", "hieroglyphs", "nile"]
  },

  // ==========================================
  // 5. THAILAND
  // ==========================================
  {
    id: "dest_thai_grandpalace",
    name: "The Grand Palace & Wat Phra Kaew",
    category: "Culture & Museum",
    city: "Bangkok",
    country: "Thailand",
    lat: 13.7500,
    lng: 100.4913,
    imageUrl: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Na Phra Lan Rd, Phra Borom Maha Ratchawang, Phra Nakhon, Bangkok 10200, Thailand",
    description: "The ceremonial heart of the Kingdom of Siam since 1782, featuring glistening golden stupas, mosaic-encrusted spires, and the revered Temple of the Emerald Buddha (Phra Kaew Morakot), carved from a single jade block.",
    openingHours: "08:30 - 15:30 daily",
    website: "https://www.royalgrandpalace.th",
    tags: ["thailand", "bangkok", "palace", "emerald-buddha", "gold", "buddhism"]
  },
  {
    id: "dest_thai_watarun",
    name: "Wat Arun (The Temple of Dawn)",
    category: "Historic",
    city: "Bangkok",
    country: "Thailand",
    lat: 13.7437,
    lng: 100.4888,
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "158 Thanon Wang Doem, Wat Arun, Bangkok Yai, Bangkok 10600, Thailand",
    description: "Standing gracefully on the west bank of the Chao Phraya River, this 82-meter Khmer-style prang is decorated with thousands of pieces of colorful Chinese porcelain that shimmer at sunrise and sunset.",
    openingHours: "08:00 - 18:00 daily",
    website: "https://www.watarun.net",
    tags: ["thailand", "bangkok", "wat-arun", "river", "temple", "porcelain"]
  },
  {
    id: "dest_thai_phiphi",
    name: "Maya Bay & Phi Phi Islands",
    category: "Coastal & Beach",
    city: "Phuket",
    country: "Thailand",
    lat: 7.6899,
    lng: 98.7663,
    imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Koh Phi Phi Leh, Ao Nang, Krabi, Thailand",
    description: "A paradise lagoon shielded by 100-meter vertical limestone karsts, renowned for silky white sands and translucent turquoise waters teeming with coral reefs and blacktip reef sharks.",
    openingHours: "07:00 - 18:00 daily",
    website: "https://www.thailandtravel.or.th",
    tags: ["thailand", "phuket", "maya-bay", "phi-phi", "karsts", "lagoon", "beach"]
  },

  // ==========================================
  // 6. UNITED ARAB EMIRATES
  // ==========================================
  {
    id: "dest_uae_burjkhalifa",
    name: "Burj Khalifa & The Dubai Fountain",
    category: "Landmark",
    city: "Dubai",
    country: "United Arab Emirates",
    lat: 25.1972,
    lng: 55.2744,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE",
    description: "The tallest freestanding structure on Earth at 828 meters. Soar to the At The Top observatory on Level 148 for views across the Persian Gulf, and watch the world's largest choreographed dancing fountain below.",
    openingHours: "08:30 - 23:00 daily",
    website: "https://www.burjkhalifa.ae",
    tags: ["dubai", "burj-khalifa", "skyscraper", "luxury", "record-breaking", "fountain"]
  },
  {
    id: "dest_uae_sheikhzayed",
    name: "Sheikh Zayed Grand Mosque",
    category: "Historic",
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    lat: 24.4128,
    lng: 54.4750,
    imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Al Rawdah, Abu Dhabi, United Arab Emirates",
    description: "An architectural wonder of pure white Macedonian marble, featuring 82 domes, 24-carat gold chandeliers, and the world's largest hand-knotted Iranian carpet. Reflective pools mirror the mosque's glowing columns at dusk.",
    openingHours: "09:00 - 22:00 (Sat-Thu), 15:00 - 22:00 (Fri)",
    website: "https://www.szgmc.gov.ae",
    tags: ["uae", "abu-dhabi", "grand-mosque", "marble", "gold", "architecture"]
  },

  // ==========================================
  // 7. UNITED KINGDOM
  // ==========================================
  {
    id: "dest_uk_bigben",
    name: "Big Ben & The Houses of Parliament",
    category: "Landmark",
    city: "London",
    country: "United Kingdom",
    lat: 51.5007,
    lng: -0.1246,
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Westminster, London SW1A 0AA, United Kingdom",
    description: "The world's most famous four-faced chiming clock tower, officially named the Elizabeth Tower. Perched on the north bank of the River Thames adjacent to the Gothic Revival Palace of Westminster.",
    openingHours: "Viewable 24 hours (tours booked in advance)",
    website: "https://www.parliament.uk",
    tags: ["london", "big-ben", "westminster", "thames", "clock-tower", "gothic"]
  },
  {
    id: "dest_uk_edinburghcastle",
    name: "Edinburgh Castle & The Royal Mile",
    category: "Historic",
    city: "Edinburgh",
    country: "United Kingdom",
    lat: 55.9486,
    lng: -3.1999,
    imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Castlehill, Edinburgh EH1 2NG, United Kingdom",
    description: "Perched high atop Castle Rock, an extinct volcanic crag dominating Scotland's capital. Home to the Honours of Scotland (the oldest Crown Jewels in Britain) and the ancient Stone of Destiny.",
    openingHours: "09:30 - 18:00 daily",
    website: "https://www.edinburghcastle.scot",
    tags: ["scotland", "edinburgh", "castle", "royal-mile", "fortress", "history"]
  },

  // ==========================================
  // 8. GERMANY
  // ==========================================
  {
    id: "dest_germany_neuschwanstein",
    name: "Neuschwanstein Castle",
    category: "Historic",
    city: "Schwangau",
    country: "Germany",
    lat: 47.5576,
    lng: 10.7498,
    imageUrl: "https://images.unsplash.com/photo-1534313314376-a72289b6181e?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Neuschwansteinstraße 20, 87645 Schwangau, Germany",
    description: "King Ludwig II's 19th-century Romanesque Revival fairy-tale palace perched atop rugged alpine cliffs. The direct inspiration for Disney's Cinderella and Sleeping Beauty castles, overlooking the tranquil Alpsee.",
    openingHours: "09:00 - 18:00 daily (guided tours only)",
    website: "https://www.neuschwanstein.de",
    tags: ["germany", "bavaria", "fairytale", "castle", "alps", "ludwig"]
  },
  {
    id: "dest_germany_brandenburg",
    name: "Brandenburg Gate & Museum Island",
    category: "Landmark",
    city: "Berlin",
    country: "Germany",
    lat: 52.5163,
    lng: 13.3777,
    imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "Pariser Platz, 10117 Berlin, Germany",
    description: "Berlin's defining neoclassical monument, commissioned by King Frederick William II in 1791. Once a symbol of division during the Cold War, it now stands as an enduring beacon of European peace and unity.",
    openingHours: "Open 24 hours daily",
    website: "https://www.berlin.de",
    tags: ["germany", "berlin", "brandenburg-gate", "history", "quadriga", "unity"]
  },

  // ==========================================
  // 9. TURKEY
  // ==========================================
  {
    id: "dest_turkey_hagiasophia",
    name: "Hagia Sophia Grand Mosque",
    category: "Historic",
    city: "Istanbul",
    country: "Turkey",
    lat: 41.0086,
    lng: 28.9802,
    imageUrl: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul, Turkey",
    description: "A monumental masterwork of Byzantine engineering built in 537 AD by Emperor Justinian. Renowned for its massive hovering dome, golden Christian mosaics, and towering Islamic calligraphic roundels spanning 1,500 years of empires.",
    openingHours: "09:00 - 19:30 daily",
    website: "https://ayasofyacamii.gov.tr",
    tags: ["turkey", "istanbul", "hagia-sophia", "byzantine", "ottoman", "dome"]
  },
  {
    id: "dest_turkey_cappadocia",
    name: "Cappadocia Hot Air Balloon Valley",
    category: "Nature & Park",
    city: "Göreme",
    country: "Turkey",
    lat: 38.6431,
    lng: 34.8289,
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Göreme Tarihi Milli Parkı, 50180 Nevşehir, Turkey",
    description: "A surreal otherworldly landscape sculpted by ancient volcanic eruptions and wind erosion into 'fairy chimneys'. Rise before dawn to take flight alongside hundreds of colorful hot air balloons as sunrise illuminates the valleys.",
    openingHours: "Balloon flights daily at sunrise (weather permitting)",
    website: "https://www.goturkiye.com",
    tags: ["turkey", "cappadocia", "hot-air-balloon", "fairy-chimneys", "sunrise", "nature"]
  },

  // ==========================================
  // 10. INDONESIA
  // ==========================================
  {
    id: "dest_bali_ubud_monkeyforest",
    name: "Sacred Monkey Forest Sanctuary",
    category: "Nature & Park",
    city: "Bali",
    country: "Indonesia",
    lat: -8.5188,
    lng: 115.2585,
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Jl. Monkey Forest, Ubud, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571",
    description: "A mystical 12.5-hectare sacred rainforest sanctuary in the cultural heart of Ubud. Home to over 1,000 Balinese long-tailed macaques, moss-draped banyan trees, and the 14th-century Pura Dalem Agung Padangtegal temple.",
    openingHours: "09:00 - 18:00 daily",
    website: "https://monkeyforestubud.com",
    tags: ["indonesia", "bali", "ubud", "monkeys", "jungle", "sacred-forest", "temple"]
  },
  {
    id: "dest_bali_uluwatu",
    name: "Uluwatu Sea Cliff Temple & Sunset Kecak",
    category: "Historic",
    city: "Bali",
    country: "Indonesia",
    lat: -8.8291,
    lng: 115.0849,
    imageUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Pecatu, South Kuta, Badung Regency, Bali, Indonesia",
    description: "Perched dramatically atop a 70-meter sheer limestone cliff plunging straight into the Indian Ocean. At twilight, witness the hypnotic rhythmic chanting of the fire-lit traditional Balinese Kecak Ramayana dance.",
    openingHours: "07:00 - 19:00 daily (Kecak dance at 18:00)",
    website: "https://indonesia.travel",
    tags: ["indonesia", "bali", "uluwatu", "cliff", "ocean", "sunset", "kecak-dance"]
  },

  // ==========================================
  // 11. AUSTRALIA
  // ==========================================
  {
    id: "dest_aus_operahouse",
    name: "Sydney Opera House & Harbour Bridge",
    category: "Landmark",
    city: "Sydney",
    country: "Australia",
    lat: -33.8568,
    lng: 151.2153,
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Bennelong Point, Sydney NSW 2000, Australia",
    description: "Jørn Utzon's 20th-century architectural masterpiece with its signature interlocking vaulted sail shells. Positioned on Bennelong Point alongside the monumental Sydney Harbour Bridge, crowning one of the world's most glorious natural harbours.",
    openingHours: "09:00 - 17:00 daily",
    website: "https://www.sydneyoperahouse.com",
    tags: ["australia", "sydney", "opera-house", "harbour", "unesco", "iconic"]
  },
  {
    id: "dest_aus_bondibeach",
    name: "Bondi Beach & Coogee Coastal Walk",
    category: "Coastal & Beach",
    city: "Sydney",
    country: "Australia",
    lat: -33.8915,
    lng: 151.2767,
    imageUrl: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Campbell Parade, Bondi Beach NSW 2026, Australia",
    description: "The world's most famous crescent of golden sand and rolling Pacific surf breaks. Take the celebrated 6km cliffside walk winding past sandstone headlands, rock pools, and the iconic Bondi Icebergs ocean pool.",
    openingHours: "Open 24 hours daily",
    website: "https://www.sydney.com",
    tags: ["australia", "sydney", "bondi", "beach", "surf", "coastal-walk", "ocean"]
  },

  // ==========================================
  // 12. CANADA
  // ==========================================
  {
    id: "dest_canada_banff",
    name: "Lake Louise & Moraine Lake",
    category: "Nature & Park",
    city: "Banff",
    country: "Canada",
    lat: 51.4254,
    lng: -116.1773,
    imageUrl: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Banff National Park, Improvement District No. 9, AB, Canada",
    description: "The crown jewels of the Canadian Rocky Mountains. Electric turquoise glacial waters fed by melting Victoria Glacier, encircled by soaring rugged peaks, fragrant pine forests, and the grand Fairmont Chateau.",
    openingHours: "Park open year-round",
    website: "https://www.pc.gc.ca/banff",
    tags: ["canada", "banff", "lake-louise", "rockies", "moraine-lake", "turquoise-water"]
  },

  // ==========================================
  // 13. NETHERLANDS
  // ==========================================
  {
    id: "dest_nl_rijksmuseum",
    name: "Rijksmuseum & Canal Ring",
    category: "Culture & Museum",
    city: "Amsterdam",
    country: "Netherlands",
    lat: 52.3599,
    lng: 4.8852,
    imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Museumstraat 1, 1071 XX Amsterdam, Netherlands",
    description: "The Netherlands' national museum dedicated to Dutch arts and history, housing Rembrandt's masterpiece The Night Watch and Vermeer's The Milkmaid, set alongside the UNESCO 17th-century Grachtengordel canals.",
    openingHours: "09:00 - 17:00 daily",
    website: "https://www.rijksmuseum.nl",
    tags: ["netherlands", "amsterdam", "rijksmuseum", "canals", "rembrandt", "art"]
  },
  {
    id: "dest_nl_keukenhof",
    name: "Keukenhof Tulip Gardens & Zaanse Schans",
    category: "Nature & Park",
    city: "Lisse",
    country: "Netherlands",
    lat: 52.2697,
    lng: 4.5469,
    imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "Stationsweg 166A, 2161 AM Lisse, Netherlands",
    description: "The Garden of Europe, showcasing over 7 million vibrant blooming tulips, daffodils, and hyacinths across 32 hectares of landscaped grounds alongside historic functioning Dutch windmills.",
    openingHours: "08:00 - 19:30 (Mid March - Mid May)",
    website: "https://keukenhof.nl",
    tags: ["netherlands", "tulips", "flowers", "windmills", "keukenhof", "spring"]
  },

  // ==========================================
  // 14. BRAZIL
  // ==========================================
  {
    id: "dest_br_christ",
    name: "Christ the Redeemer & Corcovado Mountain",
    category: "Landmark",
    city: "Rio de Janeiro",
    country: "Brazil",
    lat: -22.9519,
    lng: -43.2105,
    imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Parque Nacional da Tijuca, Rio de Janeiro - RJ, Brazil",
    description: "One of the New Seven Wonders of the World, this 30-meter Art Deco statue of Jesus Christ atop the 704m granite peak of Corcovado embraces Guanabara Bay and Sugarloaf Mountain in a transcendent 360-degree panoramic vista.",
    openingHours: "08:00 - 19:00 daily",
    website: "https://tremdocorcovado.rio",
    tags: ["brazil", "rio-de-janeiro", "christ-the-redeemer", "wonder", "panorama", "tijuca"]
  },
  {
    id: "dest_br_copacabana",
    name: "Copacabana & Ipanema Beach",
    category: "Coastal & Beach",
    city: "Rio de Janeiro",
    country: "Brazil",
    lat: -22.9711,
    lng: -43.1825,
    imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    address: "Avenida Atlântica, Copacabana, Rio de Janeiro - RJ, Brazil",
    description: "The pulsing cultural heart of Rio, featuring iconic black-and-white wave-patterned mosaic promenades designed by Roberto Burle Marx, golden Atlantic sands, samba music, and dramatic views of the Dois Irmãos peaks.",
    openingHours: "Open 24 hours daily",
    website: "https://visit.rio",
    tags: ["brazil", "copacabana", "ipanema", "beach", "samba", "coastal", "rio"]
  },

  // ==========================================
  // 15. SOUTH KOREA
  // ==========================================
  {
    id: "dest_kr_gyeongbokgung",
    name: "Gyeongbokgung Palace & Bukchon Hanok Village",
    category: "Historic",
    city: "Seoul",
    country: "South Korea",
    lat: 37.5796,
    lng: 126.9770,
    imageUrl: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "161 Sajik-ro, Jongno-gu, Seoul, South Korea",
    description: "The primary royal palace of the Joseon dynasty built in 1395, featuring majestic pavilions floating over tranquil lotus ponds, Royal Guard changing ceremonies, and adjacent winding alleys of preserved 600-year-old Hanok residences.",
    openingHours: "09:00 - 18:00 (Closed Tuesdays)",
    website: "https://royal.cha.go.kr",
    tags: ["south-korea", "seoul", "palace", "hanok", "joseon", "culture", "heritage"]
  },
  {
    id: "dest_kr_nseoul",
    name: "N Seoul Tower & Namsan Mountain",
    category: "Landmark",
    city: "Seoul",
    country: "South Korea",
    lat: 37.5512,
    lng: 126.9882,
    imageUrl: "https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    address: "105 Namsangongwon-gil, Yongsan-gu, Seoul, South Korea",
    description: "Seoul's iconic communications tower rising 236m atop Mount Namsan, offering a 360-degree glass observatory over the sprawling metropolis, famous love lock terraces, and seasonal illuminated night light shows.",
    openingHours: "10:00 - 23:00 daily",
    website: "https://www.nseoultower.co.kr",
    tags: ["south-korea", "seoul", "n-seoul-tower", "observatory", "namsan", "night-view"]
  },

  // ==========================================
  // 16. NEW ZEALAND
  // ==========================================
  {
    id: "dest_nz_milfordsound",
    name: "Milford Sound & Fiordland National Park",
    category: "Nature & Park",
    city: "Fiordland",
    country: "New Zealand",
    lat: -44.6715,
    lng: 167.9256,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Mitre_Peak%2C_Milford_Sound%2C_New_Zealand.jpg",
    rating: 4.9,
    address: "Milford Sound Highway, Fiordland National Park 9679, New Zealand",
    description: "Described by Rudyard Kipling as the Eighth Wonder of the World, this carved glacial fiord features sheer rock faces rising 1,200 meters from deep dark waters, roaring thunderous waterfalls like Stirling Falls, and resident fur seals.",
    openingHours: "Cruises run daily 09:00 - 16:30",
    website: "https://www.fiordland.org.nz",
    tags: ["new-zealand", "milford-sound", "fiordland", "waterfalls", "glacier", "unesco"]
  },

  // ==========================================
  // 17. ICELAND
  // ==========================================
  {
    id: "dest_is_bluelagoon",
    name: "Blue Lagoon & Golden Circle Gullfoss",
    category: "Nature & Park",
    city: "Reykjavik",
    country: "Iceland",
    lat: 63.8804,
    lng: -22.4495,
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Norðurljósavegur 9, 240 Grindavík, Iceland",
    description: "World-renowned geothermal mineral spa set in a stark volcanic lava field on the Reykjanes Peninsula, featuring milky-blue, silica-rich mineral waters naturally heated to 37-39°C beneath the Nordic sky.",
    openingHours: "08:00 - 21:00 daily",
    website: "https://www.bluelagoon.com",
    tags: ["iceland", "blue-lagoon", "geothermal", "spa", "reykjavik", "volcano", "nordic"]
  },

  // ==========================================
  // 18. PORTUGAL
  // ==========================================
  {
    id: "dest_pt_penapalace",
    name: "Pena Palace & Sintra Mountain Sanctuary",
    category: "Landmark",
    city: "Sintra",
    country: "Portugal",
    lat: 38.7876,
    lng: -9.3906,
    imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    address: "Estrada da Pena, 2710-609 Sintra, Portugal",
    description: "A fairy-tale Romanticist castle standing perched atop the Sintra peaks, displaying a kaleidoscope of vivid lemon-yellow, coral-red, and azulejo tiled towers surrounded by a mystical 200-hectare enchanted forest.",
    openingHours: "09:30 - 18:30 daily",
    website: "https://www.parquesdesintra.pt",
    tags: ["portugal", "sintra", "pena-palace", "fairy-tale", "castle", "lisbon", "romanticism"]
  }
];

