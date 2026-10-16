import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, testDbConnection } from './db/prisma.js';
import destinationsRouter from './routes/destinations.js';
import itineraryRouter from './routes/itinerary.js';
import favoritesRouter from './routes/favorites.js';
import weatherRouter from './routes/weather.js';
import plannerRouter from './routes/planner.js';
import shareRouter from './routes/share.js';
import { VERIFIED_DESTINATIONS } from './services/placesService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Seed sample itinerary if completely empty
async function seedInitialDataIfEmpty() {
  try {
    const existingItinerary = await db.itineraryItem.findMany();
    if (existingItinerary.length === 0) {
      console.log('Seeding initial Voyora sample itinerary items...');
      const sampleSeeds = [
        { dest: VERIFIED_DESTINATIONS[0], day: 1, order: 0, notes: "Arrive early around 09:30 for the summit elevator elevator view.", must: true },
        { dest: VERIFIED_DESTINATIONS[1], day: 1, order: 1, notes: "Pre-book Denon wing timed tickets for Mona Lisa and Winged Victory.", must: true },
        { dest: VERIFIED_DESTINATIONS[2], day: 2, order: 0, notes: "Wander down the cobblestone artist square of Place du Tertre.", must: false },
        { dest: VERIFIED_DESTINATIONS[7], day: 2, order: 1, notes: "Gaze at the sunlight stream through the 9m open oculus dome.", must: true },
        { dest: VERIFIED_DESTINATIONS[8], day: 3, order: 0, notes: "Toss a coin with the right hand over left shoulder at dusk.", must: false },
      ];

      for (const item of sampleSeeds) {
        if (item.dest) {
          await db.itineraryItem.create({
            data: {
              destinationId: item.dest.id,
              name: item.dest.name,
              category: item.dest.category,
              city: item.dest.city,
              country: item.dest.country,
              lat: item.dest.lat,
              lng: item.dest.lng,
              imageUrl: item.dest.imageUrl,
              dayNumber: item.day,
              sortOrder: item.order,
              notes: item.notes,
              isMustVisit: item.must,
            }
          });
        }
      }

      // Seed a couple of initial favorites
      const favSeeds = [VERIFIED_DESTINATIONS[3], VERIFIED_DESTINATIONS[9]];
      for (const fav of favSeeds) {
        await db.favorite.create({
          data: {
            destinationId: fav.id,
            name: fav.name,
            category: fav.category,
            city: fav.city,
            country: fav.country,
            lat: fav.lat,
            lng: fav.lng,
            imageUrl: fav.imageUrl,
            rating: fav.rating,
            address: fav.address,
          }
        });
      }
      console.log('✓ Initial demo data seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding initial data:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    service: 'VOYORA Travel Planning Backend API',
    database: db.isPostgresActive ? 'PostgreSQL (Prisma)' : 'Persistent Storage (Local Fallback)',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount modular API routes
app.use('/api/destinations', destinationsRouter);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/itinerary', shareRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/planner', plannerRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.',
    message: err.message,
  });
});

// Start server
async function startServer() {
  await testDbConnection();
  await seedInitialDataIfEmpty();

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  VOYORA BACKEND API SERVER RUNNING            `);
    console.log(`  Port: ${PORT}                                `);
    console.log(`  URL: http://localhost:${PORT}                `);
    console.log(`  Health: http://localhost:${PORT}/api/health  `);
    console.log(`===============================================`);
  });
}

startServer();
