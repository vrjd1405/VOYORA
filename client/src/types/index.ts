export interface Destination {
  id: string;
  name: string;
  category: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  rating?: number;
  address?: string;
  description?: string;
  openingHours?: string;
  website?: string;
  tags?: string[];
}

export interface ItineraryItem {
  id: string;
  destinationId: string;
  name: string;
  category: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  imageUrl?: string | null;
  dayNumber: number;
  sortOrder: number;
  notes?: string | null;
  isMustVisit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DayGroup {
  dayNumber: number;
  items: ItineraryItem[];
}

export interface ItineraryStats {
  totalPlaces: number;
  totalDays: number;
  mustVisitCount: number;
  categoriesBreakdown: Record<string, number>;
}

export interface FavoriteItem {
  id: string;
  destinationId: string;
  name: string;
  category: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  imageUrl?: string | null;
  rating?: number | null;
  address?: string | null;
  createdAt: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    temperature: number;
    weathercode: number;
    windspeed: number;
    winddirection: number;
    isDay: number;
    time: string;
    conditionText: string;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface SmartPlanResponse {
  city: string;
  daysCount: number;
  pace: string;
  interests: string[];
  days: Array<{
    dayNumber: number;
    title: string;
    theme: string;
    items: Array<{
      destination: Destination;
      timeSlot: 'Morning' | 'Afternoon' | 'Evening';
      suggestionNote: string;
    }>;
  }>;
  totalPlaces: number;
}
