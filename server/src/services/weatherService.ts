import { WeatherData } from '../types/index.js';

interface CacheEntry {
  data: WeatherData;
  expiresAt: number;
}

const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function getWeatherConditionText(code: number): string {
  switch (code) {
    case 0:
      return "Clear sky";
    case 1:
      return "Mainly clear";
    case 2:
      return "Partly cloudy";
    case 3:
      return "Overcast";
    case 45:
    case 48:
      return "Foggy";
    case 51:
    case 53:
    case 55:
      return "Light drizzle";
    case 61:
    case 63:
      return "Rain showers";
    case 65:
      return "Heavy rain";
    case 71:
    case 73:
    case 75:
      return "Snowfall";
    case 77:
      return "Snow grains";
    case 80:
    case 81:
    case 82:
      return "Passing rain showers";
    case 85:
    case 86:
      return "Snow showers";
    case 95:
      return "Thunderstorm";
    case 96:
    case 99:
      return "Thunderstorm with hail";
    default:
      return "Pleasant conditions";
  }
}

export async function fetchWeatherForCoordinates(lat: number, lng: number): Promise<WeatherData> {
  if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid geographic coordinates provided.");
  }

  // Cache key rounded to 2 decimal places (~1.1km)
  const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }

    const data = await res.json();
    const condition = getWeatherConditionText(data.current_weather.weathercode);

    const result: WeatherData = {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone || "UTC",
      current: {
        temperature: Math.round(data.current_weather.temperature * 10) / 10,
        weathercode: data.current_weather.weathercode,
        windspeed: data.current_weather.windspeed,
        winddirection: data.current_weather.winddirection,
        isDay: data.current_weather.is_day,
        time: data.current_weather.time,
        conditionText: condition,
      },
      daily: {
        time: data.daily?.time || [],
        weathercode: data.daily?.weathercode || [],
        temperature_2m_max: data.daily?.temperature_2m_max || [],
        temperature_2m_min: data.daily?.temperature_2m_min || [],
      },
    };

    weatherCache.set(cacheKey, {
      data: result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return result;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error("Open-Meteo weather fetch error:", err.message);
    throw new Error(err.message || "Failed to retrieve real-time weather data.");
  }
}
