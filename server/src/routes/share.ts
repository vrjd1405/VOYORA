import { Router, Request, Response } from 'express';
import { db } from '../db/prisma.js';
import { nanoid } from 'nanoid';

const router = Router();

// POST /api/itinerary/share - Create a unique shareable itinerary snapshot
router.post('/share', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    // Fetch current itinerary
    const items = await db.itineraryItem.findMany();
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot share an empty itinerary. Please add destinations first.',
      });
    }

    // Sanitize items - remove private internal DB properties
    const publicItems = items.map((i: any) => ({
      destinationId: i.destinationId,
      name: i.name,
      category: i.category,
      city: i.city,
      country: i.country,
      lat: i.lat,
      lng: i.lng,
      imageUrl: i.imageUrl,
      dayNumber: i.dayNumber,
      sortOrder: i.sortOrder,
      notes: i.notes,
      isMustVisit: i.isMustVisit,
    }));

    const shareId = nanoid(10);
    const tripPayload = JSON.stringify({
      title: title || 'Voyora Journey Itinerary',
      description: description || 'Curated travel plan created with Voyora.',
      items: publicItems,
      createdAt: new Date().toISOString(),
    });

    const shared = await db.sharedItinerary.create({
      data: {
        shareId,
        title: title || 'Voyora Journey Itinerary',
        description: description || null,
        tripData: tripPayload,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Share link generated successfully.',
      shareId: shared.shareId,
      shareUrl: `/trip/share/${shared.shareId}`,
    });
  } catch (err: any) {
    console.error('Error generating share link:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create share link.',
      details: err.message,
    });
  }
});

// GET /api/itinerary/share/:shareId - Retrieve public read-only itinerary
router.get('/share/:shareId', async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;
    const record = await db.sharedItinerary.findUnique({
      where: { shareId },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'This shared itinerary was not found or has been revoked.',
      });
    }

    const parsedTrip = JSON.parse(record.tripData);

    return res.json({
      success: true,
      data: {
        shareId: record.shareId,
        title: record.title,
        description: record.description,
        createdAt: record.createdAt,
        trip: parsedTrip,
      },
    });
  } catch (err: any) {
    console.error('Error retrieving shared itinerary:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve shared itinerary.',
      details: err.message,
    });
  }
});

// DELETE /api/itinerary/share/:shareId - Revoke share link
router.delete('/share/:shareId', async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;
    const record = await db.sharedItinerary.findUnique({ where: { shareId } });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Shared itinerary link not found.',
      });
    }

    await db.sharedItinerary.delete({ where: { shareId } });

    return res.json({
      success: true,
      message: 'Shared link revoked successfully.',
    });
  } catch (err: any) {
    console.error('Error revoking share link:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to revoke shared link.',
      details: err.message,
    });
  }
});

export default router;
