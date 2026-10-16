import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Destination, FavoriteItem } from '../types';
import * as api from '../services/api';
import { useToast } from './ToastContext';

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  loading: boolean;
  isFavorite: (destinationId: string) => boolean;
  toggleFavorite: (destination: Destination) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  const refreshFavorites = useCallback(async () => {
    try {
      const data = await api.fetchFavorites();
      setFavorites(data);
    } catch (err: any) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isFavorite = useCallback(
    (destinationId: string) => {
      return favorites.some(f => f.destinationId === destinationId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (destination: Destination): Promise<boolean> => {
      const exists = favorites.some(f => f.destinationId === destination.id);

      if (exists) {
        // Optimistic removal
        setFavorites(prev => prev.filter(f => f.destinationId !== destination.id));
        try {
          await api.removeFromFavorites(destination.id);
          toast.info('Removed from Favorites', destination.name);
          return false;
        } catch (err: any) {
          // Rollback
          refreshFavorites();
          toast.error('Failed to remove favorite', err.message);
          return true;
        }
      } else {
        // Optimistic addition
        const tempFav: FavoriteItem = {
          id: 'temp_' + Date.now(),
          destinationId: destination.id,
          name: destination.name,
          category: destination.category,
          city: destination.city,
          country: destination.country,
          lat: destination.lat,
          lng: destination.lng,
          imageUrl: destination.imageUrl,
          rating: destination.rating,
          address: destination.address,
          createdAt: new Date().toISOString(),
        };
        setFavorites(prev => [tempFav, ...prev]);

        try {
          const created = await api.addToFavorites(destination);
          setFavorites(prev => prev.map(f => (f.destinationId === destination.id ? created : f)));
          toast.success('Saved to Favorites', destination.name);
          return true;
        } catch (err: any) {
          // Rollback
          setFavorites(prev => prev.filter(f => f.destinationId !== destination.id));
          toast.error('Failed to save favorite', err.message);
          return false;
        }
      }
    },
    [favorites, refreshFavorites, toast]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
