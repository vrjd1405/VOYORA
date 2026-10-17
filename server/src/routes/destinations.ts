import { Router, Request, Response } from 'express';
import { searchPlaces, getDestinationById, VERIFIED_DESTINATIONS } from '../services/placesService.js';

const router = Router();

// GET /api/destinations - Search & discover destinations
router.get('/', async (req: Request, res: Response) => {
  try {
    const { q, category, city, country, limit, page, sort } = req.query;

    const result = await searchPlaces({
      q: q as string,
      category: category as string,
      city: city as string,
      country: country as string,
      limit: limit ? Number(limit) : 12,
      page: page ? Number(page) : 1,
      sort: sort as string,
    });

    return res.json({
      success: true,
      data: result.destinations,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit: limit ? Number(limit) : 12
      }
    });
  } catch (err: any) {
    console.error('Error in GET /api/destinations:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve destinations. Please try again.',
      details: err.message
    });
  }
});

// GET /api/destinations/featured - Quick curated list for home page
router.get('/featured', (_req: Request, res: Response) => {
  const highlightIds = [
    'dest_madurai_meenakshi',
    'dest_chennai_marina',
    'dest_mahabalipuram_shore_temple',
    'dest_thanjavur_brihadisvara',
    'dest_paris_eiffel',
    'dest_tokyo_sensoji',
    'dest_agra_taj_mahal',
    'dest_rome_colosseum'
  ];
  const featured = highlightIds
    .map(id => VERIFIED_DESTINATIONS.find(d => d.id === id))
    .filter(Boolean);
  return res.json({
    success: true,
    data: featured.length > 0 ? featured : VERIFIED_DESTINATIONS.slice(0, 8)
  });
});

// GET /api/destinations/route - Geoapify Transit & Distance Router
router.get('/route', async (req: Request, res: Response) => {
  try {
    const { fromLat, fromLng, toLat, toLng, mode = 'drive' } = req.query;
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({
        success: false,
        error: 'fromLat, fromLng, toLat, and toLng query parameters are required.'
      });
    }

    const fLat = parseFloat(fromLat as string);
    const fLng = parseFloat(fromLng as string);
    const tLat = parseFloat(toLat as string);
    const tLng = parseFloat(toLng as string);

    const geoapifyKey = process.env.GEOAPIFY_API_KEY || '';
    if (geoapifyKey) {
      try {
        const routeUrl = `https://api.geoapify.com/v1/routing?waypoints=${fLat},${fLng}|${tLat},${tLng}&mode=${mode}&apiKey=${geoapifyKey}`;
        const routeRes = await fetch(routeUrl);
        if (routeRes.ok) {
          const routeData = (await routeRes.json()) as any;
          const props = routeData.features?.[0]?.properties;
          if (props) {
            const distanceKm = Number((props.distance / 1000).toFixed(1));
            const timeMins = Math.round(props.time / 60);
            return res.json({
              success: true,
              data: {
                distanceMeters: props.distance,
                distanceKm,
                timeSeconds: props.time,
                timeMinutes: timeMins,
                mode,
                summary: `${distanceKm} km (~${timeMins} mins ${mode === 'drive' ? 'drive' : mode})`,
                legs: props.legs || []
              }
            });
          }
        }
      } catch (err) {
        console.warn('Geoapify routing failed, using mathematical fallback:', err);
      }
    }

    // Great-Circle Haversine Fallback
    const R = 6371; // Earth's radius in km
    const dLat = ((tLat - fLat) * Math.PI) / 180;
    const dLon = ((tLng - fLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((fLat * Math.PI) / 180) * Math.cos((tLat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Number((R * c * 1.3).toFixed(1)); // 1.3 road curvature factor
    const speedKmH = mode === 'walk' ? 4.5 : mode === 'bicycle' ? 15 : 45;
    const timeMins = Math.max(1, Math.round((distanceKm / speedKmH) * 60));

    return res.json({
      success: true,
      data: {
        distanceMeters: Math.round(distanceKm * 1000),
        distanceKm,
        timeSeconds: timeMins * 60,
        timeMinutes: timeMins,
        mode,
        summary: `${distanceKm} km (~${timeMins} mins ${mode === 'drive' ? 'drive' : mode})`,
        fallback: true
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate transit route',
      details: err.message
    });
  }
});

// GET /api/destinations/:id - Single destination details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dest = await getDestinationById(id);

    if (!dest) {
      return res.status(404).json({
        success: false,
        error: `Destination with ID '${id}' not found.`
      });
    }

    return res.json({
      success: true,
      data: dest
    });
  } catch (err: any) {
    console.error('Error in GET /api/destinations/:id:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve destination details.',
      details: err.message
    });
  }
});

export default router;
