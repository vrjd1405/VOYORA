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

export interface DiningHighlight {
  dish: string;
  description: string;
  bestTime: string;
}

export interface SmartPlanItem {
  destination: Destination;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  suggestionNote: string;
  estimatedHours?: number;
  transitFromPrevKm?: number;
  transitTimeMin?: number;
}

export interface SmartDayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  insiderTip?: string;
  totalTransitKm?: number;
  items: SmartPlanItem[];
}

export interface WeatherDaySummary {
  date: string;
  maxTemp: number;
  minTemp: number;
  conditionText: string;
}

export interface SmartPlanResponse {
  city: string;
  daysCount: number;
  pace: string;
  interests: string[];
  days: SmartDayPlan[];
  totalPlaces: number;
  aiEngine: string;
  summary?: string;
  culturalEtiquette?: string[];
  diningHighlights?: DiningHighlight[];
  weatherForecast?: {
    currentTemp: number;
    conditionText: string;
    apparentTemp?: number;
    windspeed?: number;
    forecastDays: WeatherDaySummary[];
  };
}
