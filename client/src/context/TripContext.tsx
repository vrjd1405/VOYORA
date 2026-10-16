import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Destination, ItineraryItem, DayGroup, ItineraryStats } from '../types';
import * as api from '../services/api';
import { useToast } from './ToastContext';

interface TripContextValue {
  items: ItineraryItem[];
  groupedDays: DayGroup[];
  stats: ItineraryStats;
  loading: boolean;
  isInTrip: (destinationId: string) => boolean;
  getItemByDestinationId: (destinationId: string) => ItineraryItem | undefined;
  addItem: (
    dest: Destination,
    dayNumber?: number,
    notes?: string | null,
    isMustVisit?: boolean
  ) => Promise<boolean>;
  updateItem: (
    id: string,
    updates: {
      dayNumber?: number;
      sortOrder?: number;
      notes?: string | null;
      isMustVisit?: boolean;
    }
  ) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  moveItemToDay: (id: string, newDayNumber: number) => Promise<void>;
  clearAllItems: () => Promise<void>;
  refreshTrip: () => Promise<void>;
}

const TripContext = createContext<TripContextValue | null>(null);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [groupedDays, setGroupedDays] = useState<DayGroup[]>([]);
  const [stats, setStats] = useState<ItineraryStats>({
    totalPlaces: 0,
    totalDays: 0,
    mustVisitCount: 0,
    categoriesBreakdown: {},
  });
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  const refreshTrip = useCallback(async () => {
    try {
      const res = await api.fetchItinerary();
      setItems(res.items);
      setGroupedDays(res.grouped);
      setStats(res.stats);
    } catch (err: any) {
      console.error('Failed to load itinerary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTrip();
  }, [refreshTrip]);

  const isInTrip = useCallback(
    (destinationId: string) => {
      return items.some(i => i.destinationId === destinationId);
    },
    [items]
  );

  const getItemByDestinationId = useCallback(
    (destinationId: string) => {
      return items.find(i => i.destinationId === destinationId);
    },
    [items]
  );

  const addItem = useCallback(
    async (
      dest: Destination,
      dayNumber: number = 1,
      notes?: string | null,
      isMustVisit: boolean = false
    ): Promise<boolean> => {
      try {
        const added = await api.addToItinerary({
          destinationId: dest.id,
          name: dest.name,
          category: dest.category,
          city: dest.city,
          country: dest.country,
          lat: dest.lat,
          lng: dest.lng,
          imageUrl: dest.imageUrl,
          dayNumber,
          notes,
          isMustVisit,
        });

        await refreshTrip();
        toast.success(`Added to Day ${added.dayNumber}`, added.name);
        return true;
      } catch (err: any) {
        toast.error('Could not add to trip', err.message);
        return false;
      }
    },
    [refreshTrip, toast]
  );

  const updateItem = useCallback(
    async (
      id: string,
      updates: {
        dayNumber?: number;
        sortOrder?: number;
        notes?: string | null;
        isMustVisit?: boolean;
      }
    ) => {
      try {
        await api.updateItineraryItem(id, updates);
        await refreshTrip();
        toast.success('Itinerary Updated');
      } catch (err: any) {
        toast.error('Update failed', err.message);
      }
    },
    [refreshTrip, toast]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const target = items.find(i => i.id === id);
      try {
        await api.removeFromItinerary(id);
        await refreshTrip();
        toast.info('Removed from trip', target?.name || '');
      } catch (err: any) {
        toast.error('Removal failed', err.message);
      }
    },
    [items, refreshTrip, toast]
  );

  const moveItemToDay = useCallback(
    async (id: string, newDayNumber: number) => {
      try {
        await api.updateItineraryItem(id, { dayNumber: newDayNumber });
        await refreshTrip();
        toast.success(`Moved to Day ${newDayNumber}`);
      } catch (err: any) {
        toast.error('Move failed', err.message);
      }
    },
    [refreshTrip, toast]
  );

  const clearAllItems = useCallback(async () => {
    try {
      await api.clearItinerary();
      await refreshTrip();
      toast.info('Itinerary Cleared', 'All destinations have been reset.');
    } catch (err: any) {
      toast.error('Clear failed', err.message);
    }
  }, [refreshTrip, toast]);

  return (
    <TripContext.Provider
      value={{
        items,
        groupedDays,
        stats,
        loading,
        isInTrip,
        getItemByDestinationId,
        addItem,
        updateItem,
        removeItem,
        moveItemToDay,
        clearAllItems,
        refreshTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export function useTrip(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return ctx;
}
