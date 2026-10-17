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

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }

    const data = (await res.json()) as any;
    const current = data.current || data.current_weather || {};
    const weathercode = current.weather_code !== undefined ? current.weather_code : (current.weathercode || 0);
    const condition = getWeatherConditionText(weathercode);

    const rawTemp = current.temperature_2m !== undefined ? current.temperature_2m : (current.temperature || 0);
    const rawApparent = current.apparent_temperature !== undefined ? current.apparent_temperature : undefined;
    const rawHumidity = current.relative_humidity_2m !== undefined ? current.relative_humidity_2m : undefined;

    const result: WeatherData = {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone || "UTC",
      current: {
        temperature: Math.round(rawTemp * 10) / 10,
        apparentTemperature: rawApparent !== undefined ? Math.round(rawApparent * 10) / 10 : undefined,
        relativeHumidity: rawHumidity !== undefined ? Math.round(rawHumidity) : undefined,
        weathercode,
        windspeed: current.wind_speed_10m !== undefined ? current.wind_speed_10m : (current.windspeed || 0),
        winddirection: current.wind_direction_10m !== undefined ? current.wind_direction_10m : (current.winddirection || 0),
        isDay: current.is_day !== undefined ? current.is_day : 1,
        time: current.time || new Date().toISOString(),
        conditionText: condition,
      },
      daily: {
        time: data.daily?.time || [],
        weathercode: data.daily?.weather_code || data.daily?.weathercode || [],
        temperature_2m_max: data.daily?.temperature_2m_max || [],
        temperature_2m_min: data.daily?.temperature_2m_min || [],
        precipitation_probability_max: data.daily?.precipitation_probability_max || [],
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
