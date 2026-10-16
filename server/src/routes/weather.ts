import { Router, Request, Response } from 'express';
import { fetchWeatherForCoordinates } from '../services/weatherService.js';

const router = Router();

// GET /api/weather?lat=48.85&lng=2.35
router.get('/', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        error: 'Valid numeric latitude and longitude coordinates are required.',
      });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        error: 'Coordinates out of valid planetary bounds (-90..90, -180..180).',
      });
    }

    const weather = await fetchWeatherForCoordinates(lat, lng);

    return res.json({
      success: true,
      data: weather,
    });
  } catch (err: any) {
    console.error('Error fetching weather:', err);
    return res.status(502).json({
      success: false,
      error: 'Weather information could not be retrieved for this location.',
      details: err.message,
    });
  }
});

export default router;
