import { Router, Request, Response } from 'express';
import { generateSmartPlan, PlanRequest } from '../services/plannerService.js';
import { db } from '../db/prisma.js';
import { z } from 'zod';

const router = Router();

const GeneratePlanSchema = z.object({
  city: z.string().min(1, 'Destination city is required'),
  days: z.number().int().min(1).max(7).default(3),
  interests: z.array(z.string()).default([]),
  pace: z.enum(['relaxed', 'balanced', 'fast-paced']).default('balanced'),
});

// POST /api/planner/generate - Generate rule-based smart itinerary
router.post('/generate', (req: Request, res: Response) => {
  try {
    const parsed = GeneratePlanSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        issues: parsed.error.issues,
      });
    }

    const plan = generateSmartPlan(parsed.data as PlanRequest);

    return res.json({
      success: true,
      message: `Generated custom ${plan.daysCount}-day itinerary for ${plan.city}.`,
      data: plan,
    });
  } catch (err: any) {
    console.error('Error generating plan:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate itinerary plan.',
      details: err.message,
    });
  }
});

// POST /api/planner/apply - Save the generated plan to the database as user's active itinerary
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { days, clearExisting } = req.body;
    if (!Array.isArray(days)) {
      return res.status(400).json({
        success: false,
        error: 'Expected days array in body',
      });
    }

    if (clearExisting) {
      await db.itineraryItem.deleteMany();
    }

    let addedCount = 0;
    for (const day of days) {
      const dayNum = Number(day.dayNumber) || 1;
      if (Array.isArray(day.items)) {
        for (let idx = 0; idx < day.items.length; idx++) {
          const item = day.items[idx];
          const dest = item.destination;
          if (!dest) continue;

          // Check if already in itinerary for this day
          const existing = await db.itineraryItem.findMany({
            where: { destinationId: dest.id, dayNumber: dayNum }
          });

          if (!existing || existing.length === 0) {
            await db.itineraryItem.create({
              data: {
                destinationId: dest.id,
                name: dest.name,
                category: dest.category,
                city: dest.city,
                country: dest.country,
                lat: dest.lat,
                lng: dest.lng,
                imageUrl: dest.imageUrl,
                dayNumber: dayNum,
                sortOrder: idx,
                notes: item.suggestionNote || `Scheduled for ${item.timeSlot || 'Day'} exploration.`,
                isMustVisit: idx === 0, // Mark first place of day as must-visit
              }
            });
            addedCount++;
          }
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: `Successfully saved ${addedCount} destinations to your itinerary.`,
      addedCount,
    });
  } catch (err: any) {
    console.error('Error applying plan:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to save generated plan to itinerary.',
      details: err.message,
    });
  }
});

export default router;
