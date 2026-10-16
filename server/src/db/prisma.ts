import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const dataDir = path.resolve(__dirname, '../../data');
const dataFilePath = path.join(dataDir, 'voyora_db.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface DBStorage {
  itinerary: any[];
  favorites: any[];
  sharedItineraries: any[];
}

function readLocalDb(): DBStorage {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading local db fallback:', err);
  }
  return { itinerary: [], favorites: [], sharedItineraries: [] };
}

function writeLocalDb(data: DBStorage) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local db fallback:', err);
  }
}

// Initialize real Prisma Client
let prismaInstance: PrismaClient | null = null;
let usePrisma = false;

if (process.env.DATABASE_URL) {
  try {
    prismaInstance = new PrismaClient({
      log: ['error', 'warn'],
    });
  } catch (err) {
    console.warn('PrismaClient init error, falling back to local persistent store:', err);
  }
}

export async function testDbConnection(): Promise<boolean> {
  if (prismaInstance && process.env.DATABASE_URL) {
    try {
      await prismaInstance.$connect();
      usePrisma = true;
      console.log('✓ Successfully connected to PostgreSQL via Prisma');
      return true;
    } catch (err) {
      console.warn('! PostgreSQL connection unavailable. Using persistent local fallback storage.');
      usePrisma = false;
      return false;
    }
  }
  console.log('ℹ No PostgreSQL DATABASE_URL provided. Using persistent local fallback storage (data/voyora_db.json).');
  usePrisma = false;
  return false;
}

// Unified Database Access Layer
export const db = {
  get isPostgresActive() {
    return usePrisma;
  },

  itineraryItem: {
    async findMany(args?: { where?: any; orderBy?: any }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.itineraryItem.findMany(args);
      }
      const data = readLocalDb();
      let items = [...data.itinerary];

      if (args?.where) {
        if (args.where.dayNumber !== undefined) {
          items = items.filter(i => i.dayNumber === args.where.dayNumber);
        }
        if (args.where.destinationId !== undefined) {
          items = items.filter(i => i.destinationId === args.where.destinationId);
        }
      }

      // Default sort by dayNumber asc, sortOrder asc
      items.sort((a, b) => {
        if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
        return a.sortOrder - b.sortOrder;
      });

      return items;
    },

    async findUnique(args: { where: { id?: string; destinationId_dayNumber?: { destinationId: string; dayNumber: number } } }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.itineraryItem.findUnique(args);
      }
      const data = readLocalDb();
      if (args.where.id) {
        return data.itinerary.find(i => i.id === args.where.id) || null;
      }
      if (args.where.destinationId_dayNumber) {
        return data.itinerary.find(i => 
          i.destinationId === args.where.destinationId_dayNumber?.destinationId &&
          i.dayNumber === args.where.destinationId_dayNumber?.dayNumber
        ) || null;
      }
      return null;
    },

    async create(args: { data: any }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.itineraryItem.create(args);
      }
      const data = readLocalDb();
      const existing = data.itinerary.find(i => 
        i.destinationId === args.data.destinationId && i.dayNumber === (args.data.dayNumber || 1)
      );
      if (existing) {
        throw new Error(`Destination already exists in Day ${args.data.dayNumber || 1}`);
      }

      const newItem = {
        id: args.data.id || 'itin_' + Math.random().toString(36).substring(2, 11),
        destinationId: args.data.destinationId,
        name: args.data.name,
        category: args.data.category || 'Sight',
        city: args.data.city || 'Unknown',
        country: args.data.country || 'Unknown',
        lat: Number(args.data.lat) || 0,
        lng: Number(args.data.lng) || 0,
        imageUrl: args.data.imageUrl || null,
        dayNumber: Number(args.data.dayNumber) || 1,
        sortOrder: Number(args.data.sortOrder) || data.itinerary.filter(i => i.dayNumber === (args.data.dayNumber || 1)).length,
        notes: args.data.notes || null,
        isMustVisit: Boolean(args.data.isMustVisit),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data.itinerary.push(newItem);
      writeLocalDb(data);
      return newItem;
    },

    async update(args: { where: { id: string }; data: any }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.itineraryItem.update(args);
      }
      const data = readLocalDb();
      const index = data.itinerary.findIndex(i => i.id === args.where.id);
      if (index === -1) {
        throw new Error('Itinerary item not found');
      }

      const updated = {
        ...data.itinerary[index],
        ...args.data,
        updatedAt: new Date().toISOString()
      };
      data.itinerary[index] = updated;
      writeLocalDb(data);
      return updated;
    },

    async delete(args: { where: { id: string } }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.itineraryItem.delete(args);
      }
      const data = readLocalDb();
      const index = data.itinerary.findIndex(i => i.id === args.where.id);
      if (index === -1) {
        throw new Error('Itinerary item not found');
      }
      const removed = data.itinerary.splice(index, 1)[0];
      writeLocalDb(data);
      return removed;
    },

    async deleteMany(args?: { where?: any }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.itineraryItem.deleteMany(args);
      }
      const data = readLocalDb();
      const count = data.itinerary.length;
      data.itinerary = [];
      writeLocalDb(data);
      return { count };
    }
  },

  favorite: {
    async findMany() {
      if (usePrisma && prismaInstance) {
        return prismaInstance.favorite.findMany({ orderBy: { createdAt: 'desc' } });
      }
      const data = readLocalDb();
      return [...data.favorites].reverse();
    },

    async findUnique(args: { where: { destinationId?: string; id?: string } }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.favorite.findUnique(args as any);
      }
      const data = readLocalDb();
      if (args.where.destinationId) {
        return data.favorites.find(f => f.destinationId === args.where.destinationId) || null;
      }
      if (args.where.id) {
        return data.favorites.find(f => f.id === args.where.id) || null;
      }
      return null;
    },

    async create(args: { data: any }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.favorite.create(args);
      }
      const data = readLocalDb();
      const existing = data.favorites.find(f => f.destinationId === args.data.destinationId);
      if (existing) {
        return existing; // idempotent
      }

      const newFav = {
        id: args.data.id || 'fav_' + Math.random().toString(36).substring(2, 11),
        destinationId: args.data.destinationId,
        name: args.data.name,
        category: args.data.category || 'Sight',
        city: args.data.city || 'Unknown',
        country: args.data.country || 'Unknown',
        lat: Number(args.data.lat) || 0,
        lng: Number(args.data.lng) || 0,
        imageUrl: args.data.imageUrl || null,
        rating: args.data.rating !== undefined ? Number(args.data.rating) : null,
        address: args.data.address || null,
        createdAt: new Date().toISOString()
      };

      data.favorites.push(newFav);
      writeLocalDb(data);
      return newFav;
    },

    async delete(args: { where: { id?: string; destinationId?: string } }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.favorite.delete(args as any);
      }
      const data = readLocalDb();
      const index = data.favorites.findIndex(f => 
        (args.where.id && f.id === args.where.id) ||
        (args.where.destinationId && f.destinationId === args.where.destinationId)
      );
      if (index === -1) {
        throw new Error('Favorite not found');
      }
      const removed = data.favorites.splice(index, 1)[0];
      writeLocalDb(data);
      return removed;
    }
  },

  sharedItinerary: {
    async findUnique(args: { where: { shareId: string } }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.sharedItinerary.findUnique(args);
      }
      const data = readLocalDb();
      return data.sharedItineraries.find(s => s.shareId === args.where.shareId) || null;
    },

    async create(args: { data: any }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.sharedItinerary.create(args);
      }
      const data = readLocalDb();
      const newShare = {
        id: 'share_' + Math.random().toString(36).substring(2, 11),
        shareId: args.data.shareId,
        title: args.data.title,
        description: args.data.description || null,
        tripData: args.data.tripData,
        createdAt: new Date().toISOString(),
        expiresAt: args.data.expiresAt || null
      };
      data.sharedItineraries.push(newShare);
      writeLocalDb(data);
      return newShare;
    },

    async delete(args: { where: { shareId: string } }) {
      if (usePrisma && prismaInstance) {
        return prismaInstance.sharedItinerary.delete(args);
      }
      const data = readLocalDb();
      const index = data.sharedItineraries.findIndex(s => s.shareId === args.where.shareId);
      if (index === -1) {
        throw new Error('Shared itinerary not found');
      }
      const removed = data.sharedItineraries.splice(index, 1)[0];
      writeLocalDb(data);
      return removed;
    }
  }
};
