import { Router, Request, Response } from 'express';
import { db } from '../db/prisma.js';
import { z } from 'zod';

const router = Router();

const AddFavoriteSchema = z.object({
  destinationId: z.string().min(1, 'Destination ID is required'),
  name: z.string().min(1, 'Destination name is required'),
  category: z.string().default('Sight'),
  city: z.string().default('Unknown'),
  country: z.string().default('Unknown'),
  lat: z.number(),
  lng: z.number(),
  imageUrl: z.string().nullable().optional(),
  rating: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
});

// GET /api/favorites - List all saved favorites
router.get('/', async (_req: Request, res: Response) => {
  try {
    const favorites = await db.favorite.findMany();
    return res.json({
      success: true,
      data: favorites,
      count: favorites.length,
    });
  } catch (err: any) {
    console.error('Error fetching favorites:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve favorites.',
      details: err.message,
    });
  }
});

// POST /api/favorites - Add to favorites
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = AddFavoriteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        issues: parsed.error.issues,
      });
    }

    const { destinationId } = parsed.data;

    // Check if already in favorites
    const existing = await db.favorite.findUnique({
      where: { destinationId },
    });

    if (existing) {
      return res.json({
        success: true,
        message: `'${existing.name}' is already in your favorites.`,
        data: existing,
      });
    }

    const created = await db.favorite.create({
      data: parsed.data,
    });

    return res.status(201).json({
      success: true,
      message: `Added '${created.name}' to your favorites.`,
      data: created,
    });
  } catch (err: any) {
    console.error('Error adding favorite:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to add favorite.',
      details: err.message,
    });
  }
});

// DELETE /api/favorites/:id - Remove from favorites by ID or destinationId
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check by id or destinationId
    let fav = await db.favorite.findUnique({ where: { id } });
    if (!fav) {
      fav = await db.favorite.findUnique({ where: { destinationId: id } });
    }

    if (!fav) {
      return res.status(404).json({
        success: false,
        error: `Favorite '${id}' not found.`,
      });
    }

    const deleted = await db.favorite.delete({ where: { id: fav.id } });

    return res.json({
      success: true,
      message: `Removed '${deleted.name}' from your favorites.`,
      data: deleted,
    });
  } catch (err: any) {
    console.error('Error removing favorite:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to remove favorite.',
      details: err.message,
    });
  }
});

export default router;
