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

export interface SharedItinerary {
  id: string;
  shareId: string;
  title: string;
  description?: string | null;
  tripData: string;
  createdAt: string;
  expiresAt?: string | null;
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
    apparentTemperature?: number;
    relativeHumidity?: number;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: number[];
  };
}
