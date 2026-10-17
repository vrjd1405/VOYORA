import {
  Destination,
  ItineraryItem,
  DayGroup,
  ItineraryStats,
  FavoriteItem,
  WeatherData,
  SmartPlanResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchDestinations(params?: {
  q?: string;
  category?: string;
  city?: string;
  limit?: number;
  page?: number;
  sort?: string;
}): Promise<{ destinations: Destination[]; total: number; page: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.q) query.append('q', params.q);
  if (params?.category && params.category !== 'all') query.append('category', params.category);
  if (params?.city && params.city !== 'all') query.append('city', params.city);
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.page) query.append('page', params.page.toString());
  if (params?.sort) query.append('sort', params.sort);

  const res = await fetch(`${API_BASE}/destinations?${query.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch destinations (${res.status})`);
  }
  const json = await res.json();
  return {
    destinations: json.data || [],
    total: json.pagination?.total || 0,
    page: json.pagination?.page || 1,
    totalPages: json.pagination?.totalPages || 1,
  };
}

export async function fetchFeaturedDestinations(): Promise<Destination[]> {
  const res = await fetch(`${API_BASE}/destinations/featured`);
  if (!res.ok) throw new Error('Failed to fetch featured destinations');
  const json = await res.json();
  return json.data || [];
}

export async function fetchDestinationById(id: string): Promise<Destination> {
  const res = await fetch(`${API_BASE}/destinations/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Destination not found (${res.status})`);
  }
  const json = await res.json();
  return json.data;
}

export async function fetchItinerary(): Promise<{
  items: ItineraryItem[];
  grouped: DayGroup[];
  stats: ItineraryStats;
}> {
  const res = await fetch(`${API_BASE}/itinerary`);
  if (!res.ok) throw new Error('Failed to fetch itinerary');
  const json = await res.json();
  return {
    items: json.data || [],
    grouped: json.grouped || [],
    stats: json.stats || { totalPlaces: 0, totalDays: 0, mustVisitCount: 0, categoriesBreakdown: {} },
  };
}

export async function addToItinerary(data: {
  destinationId: string;
  name: string;
  category: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  imageUrl?: string | null;
  dayNumber?: number;
  notes?: string | null;
  isMustVisit?: boolean;
}): Promise<ItineraryItem> {
  const res = await fetch(`${API_BASE}/itinerary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to add destination to itinerary');
  }
  return json.data;
}

export async function updateItineraryItem(
  id: string,
  updates: {
    dayNumber?: number;
    sortOrder?: number;
    notes?: string | null;
    isMustVisit?: boolean;
  }
): Promise<ItineraryItem> {
  const res = await fetch(`${API_BASE}/itinerary/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to update itinerary item');
  }
  return json.data;
}

export async function removeFromItinerary(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/itinerary/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || 'Failed to remove from itinerary');
  }
}

export async function reorderItinerary(
  items: Array<{ id: string; dayNumber?: number; sortOrder?: number }>
): Promise<void> {
  const res = await fetch(`${API_BASE}/itinerary/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error('Failed to reorder itinerary');
}

export async function clearItinerary(): Promise<void> {
  const res = await fetch(`${API_BASE}/itinerary/clear`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to clear itinerary');
}

export async function fetchFavorites(): Promise<FavoriteItem[]> {
  const res = await fetch(`${API_BASE}/favorites`);
  if (!res.ok) throw new Error('Failed to fetch favorites');
  const json = await res.json();
  return json.data || [];
}

export async function addToFavorites(dest: Destination): Promise<FavoriteItem> {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      destinationId: dest.id,
      name: dest.name,
      category: dest.category,
      city: dest.city,
      country: dest.country,
      lat: dest.lat,
      lng: dest.lng,
      imageUrl: dest.imageUrl,
      rating: dest.rating,
      address: dest.address,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to save to favorites');
  return json.data;
}

export async function removeFromFavorites(idOrDestId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/favorites/${idOrDestId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove from favorites');
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const res = await fetch(`${API_BASE}/weather?lat=${lat}&lng=${lng}`);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || 'Weather forecast unavailable');
  }
  const json = await res.json();
  return json.data;
}

export async function generateSmartPlan(payload: {
  city: string;
  days: number;
  interests: string[];
  pace: string;
  geminiApiKey?: string;
}): Promise<SmartPlanResponse> {
  const res = await fetch(`${API_BASE}/planner/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to generate plan');
  return json.data;
}

export async function applySmartPlan(days: any[], clearExisting = false): Promise<number> {
  const res = await fetch(`${API_BASE}/planner/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days, clearExisting }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to save plan to itinerary');
  return json.addedCount || 0;
}

export async function shareItinerary(
  title?: string,
  description?: string
): Promise<{ shareId: string; shareUrl: string }> {
  const res = await fetch(`${API_BASE}/itinerary/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to generate share link');
  return {
    shareId: json.shareId,
    shareUrl: json.shareUrl,
  };
}

export async function getSharedItinerary(shareId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/itinerary/share/${shareId}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Shared trip not found');
  return json.data;
}

export async function fetchRouteTransit(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  mode: 'drive' | 'walk' | 'bicycle' = 'drive'
): Promise<{
  distanceMeters: number;
  distanceKm: number;
  timeSeconds: number;
  timeMinutes: number;
  mode: string;
  summary: string;
}> {
  const query = new URLSearchParams({
    fromLat: fromLat.toString(),
    fromLng: fromLng.toString(),
    toLat: toLat.toString(),
    toLng: toLng.toString(),
    mode,
  });
  const res = await fetch(`${API_BASE}/destinations/route?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to calculate route');
  const json = await res.json();
  return json.data;
}

