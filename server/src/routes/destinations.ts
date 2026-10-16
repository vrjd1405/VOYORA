import { Router, Request, Response } from 'express';
import { searchPlaces, getDestinationById, VERIFIED_DESTINATIONS } from '../services/placesService.js';

const router = Router();

// GET /api/destinations - Search & discover destinations
router.get('/', async (req: Request, res: Response) => {
  try {
    const { q, category, city, limit, page, sort } = req.query;

    const result = await searchPlaces({
      q: q as string,
      category: category as string,
      city: city as string,
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
  const featured = VERIFIED_DESTINATIONS.slice(0, 6);
  return res.json({
    success: true,
    data: featured
  });
});

// GET /api/destinations/:id - Single destination details
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dest = getDestinationById(id);

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
