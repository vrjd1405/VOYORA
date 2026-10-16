import { Router, Request, Response } from 'express';
import { db } from '../db/prisma.js';
import { z } from 'zod';

const router = Router();

const AddItinerarySchema = z.object({
  destinationId: z.string().min(1, 'Destination ID is required'),
  name: z.string().min(1, 'Destination name is required'),
  category: z.string().default('Sight'),
  city: z.string().default('Unknown'),
  country: z.string().default('Unknown'),
  lat: z.number(),
  lng: z.number(),
  imageUrl: z.string().nullable().optional(),
  dayNumber: z.number().int().min(1).default(1),
  sortOrder: z.number().int().optional(),
  notes: z.string().nullable().optional(),
  isMustVisit: z.boolean().default(false),
});

const UpdateItinerarySchema = z.object({
  dayNumber: z.number().int().min(1).optional(),
  sortOrder: z.number().int().optional(),
  notes: z.string().nullable().optional(),
  isMustVisit: z.boolean().optional(),
});

// GET /api/itinerary - Retrieve all saved itinerary destinations
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await db.itineraryItem.findMany();

    // Group items by day
    const dayMap = new Map<number, any[]>();
    items.forEach((item: any) => {
      const day = item.dayNumber || 1;
      if (!dayMap.has(day)) {
        dayMap.set(day, []);
      }
      dayMap.get(day)!.push(item);
    });

    const days = Array.from(dayMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([dayNumber, dayItems]) => ({
        dayNumber,
        items: dayItems.sort((a, b) => a.sortOrder - b.sortOrder),
      }));

    // Calculate helpful itinerary statistics
    const categoriesCount: Record<string, number> = {};
    items.forEach((item: any) => {
      categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1;
    });

    const stats = {
      totalPlaces: items.length,
      totalDays: dayMap.size || (items.length > 0 ? 1 : 0),
      mustVisitCount: items.filter((i: any) => i.isMustVisit).length,
      categoriesBreakdown: categoriesCount,
    };

    return res.json({
      success: true,
      data: items,
      grouped: days,
      stats,
    });
  } catch (err: any) {
    console.error('Error fetching itinerary:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve itinerary.',
      details: err.message,
    });
  }
});

// POST /api/itinerary - Add destination to itinerary
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = AddItinerarySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        issues: parsed.error.issues,
      });
    }

    const { destinationId, dayNumber } = parsed.data;

    // Check if destination is already in the itinerary for this day
    const existing = await db.itineraryItem.findMany({
      where: { destinationId, dayNumber },
    });

    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: `Destination '${parsed.data.name}' is already scheduled for Day ${dayNumber}.`,
      });
    }

    // Determine next sort order for this day
    const dayItems = await db.itineraryItem.findMany({
      where: { dayNumber },
    });
    const nextSortOrder = parsed.data.sortOrder !== undefined ? parsed.data.sortOrder : dayItems.length;

    const created = await db.itineraryItem.create({
      data: {
        ...parsed.data,
        sortOrder: nextSortOrder,
      },
    });

    return res.status(201).json({
      success: true,
      message: `Added '${created.name}' to Day ${created.dayNumber}.`,
      data: created,
    });
  } catch (err: any) {
    console.error('Error adding itinerary item:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to add destination to itinerary.',
      details: err.message,
    });
  }
});

// PATCH /api/itinerary/:id - Update item (notes, must-visit, dayNumber, sortOrder)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateItinerarySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        issues: parsed.error.issues,
      });
    }

    const item = await db.itineraryItem.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: `Itinerary item with ID '${id}' not found.`,
      });
    }

    const updated = await db.itineraryItem.update({
      where: { id },
      data: parsed.data,
    });

    return res.json({
      success: true,
      message: 'Itinerary item updated successfully.',
      data: updated,
    });
  } catch (err: any) {
    console.error('Error updating itinerary item:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update itinerary item.',
      details: err.message,
    });
  }
});

// DELETE /api/itinerary/:id - Remove destination from itinerary
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await db.itineraryItem.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: `Itinerary item with ID '${id}' not found.`,
      });
    }

    const deleted = await db.itineraryItem.delete({ where: { id } });

    return res.json({
      success: true,
      message: `Removed '${deleted.name}' from itinerary.`,
      data: deleted,
    });
  } catch (err: any) {
    console.error('Error deleting itinerary item:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete itinerary item.',
      details: err.message,
    });
  }
});

// POST /api/itinerary/reorder - Reorder items within or between days
router.post('/reorder', async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Expected array of { id, dayNumber, sortOrder }',
      });
    }

    const updatedList = [];
    for (const update of items) {
      if (update.id) {
        const up = await db.itineraryItem.update({
          where: { id: update.id },
          data: {
            dayNumber: update.dayNumber !== undefined ? update.dayNumber : undefined,
            sortOrder: update.sortOrder !== undefined ? update.sortOrder : undefined,
          },
        });
        updatedList.push(up);
      }
    }

    return res.json({
      success: true,
      message: 'Itinerary reordered successfully.',
      count: updatedList.length,
    });
  } catch (err: any) {
    console.error('Error reordering itinerary:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to reorder itinerary.',
      details: err.message,
    });
  }
});

// POST /api/itinerary/clear - Reset itinerary
router.post('/clear', async (_req: Request, res: Response) => {
  try {
    const result = await db.itineraryItem.deleteMany();
    return res.json({
      success: true,
      message: 'Itinerary cleared successfully.',
      count: result.count,
    });
  } catch (err: any) {
    console.error('Error clearing itinerary:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to clear itinerary.',
      details: err.message,
    });
  }
});

export default router;
