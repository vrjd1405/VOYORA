import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Compass, Thermometer, Droplets } from 'lucide-react';
import { WeatherData } from '../types';
import * as api from '../services/api';

interface WeatherWidgetProps {
  lat?: number;
  lng?: number;
  cityName?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lng, cityName }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFahrenheit, setIsFahrenheit] = useState<boolean>(false);

  useEffect(() => {
    if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
      setError('Geographic coordinates unavailable for weather calculation.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    api.fetchWeather(lat, lng)
      .then(data => {
        if (isMounted) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Unable to retrieve live forecast.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  const convertTemp = (celsius: number) => {
    if (!isFahrenheit) return `${Math.round(celsius)}°C`;
    return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  };

  const getWeatherIcon = (code: number, size = 24) => {
    if (code === 0 || code === 1) return <Sun size={size} className="text-amber-400" />;
    if (code === 2 || code === 3 || code === 45 || code === 48) return <Cloud size={size} className="text-slate-300" />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={size} className="text-sky-400" />;
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <CloudSnow size={size} className="text-indigo-200" />;
    if (code >= 95) return <CloudLightning size={size} className="text-purple-400" />;
    return <Sun size={size} className="text-amber-400" />;
  };

  if (loading) {
    return (
      <div className="weather-card glass-card p-6">
        <div className="skeleton h-6 w-36 mb-4" />
        <div className="flex items-center gap-4 mb-4">
          <div className="skeleton w-16 h-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-8 w-24" />
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="weather-card glass-card p-6">
        <div className="flex items-center gap-2 mb-2 text-slate-400">
          <Thermometer size={18} />
          <h4 className="font-semibold text-white">Meteorological Telemetry</h4>
        </div>
        <p className="text-sm text-slate-400">
          {error || 'Weather data is currently unavailable for this destination.'}
        </p>
      </div>
    );
  }

  return (
    <div className="weather-card glass-card">
      {/* Weather Header */}
      <div className="weather-header">
        <div className="flex items-center gap-2">
          <Thermometer size={18} className="text-sky-400" />
          <h4 className="weather-title">
            Live Weather {cityName ? `• ${cityName}` : ''}
          </h4>
        </div>
        <button
          onClick={() => setIsFahrenheit(!isFahrenheit)}
          className="temp-unit-toggle"
          title="Toggle Celsius / Fahrenheit"
        >
          {isFahrenheit ? 'Switch to °C' : 'Switch to °F'}
        </button>
      </div>

      {/* Current Conditions Block */}
      <div className="weather-current-row">
        <div className="weather-current-icon">
          {getWeatherIcon(weather.current.weathercode, 42)}
        </div>
        <div>
          <div className="weather-temp-display">
            {convertTemp(weather.current.temperature)}
          </div>
          <div className="weather-condition-text">
            {weather.current.conditionText}
          </div>
        </div>
        <div className="weather-metrics">
          {weather.current.apparentTemperature !== undefined && (
            <div className="metric-item">
              <Thermometer size={14} className="text-amber-400" />
              <span>Feels {convertTemp(weather.current.apparentTemperature)}</span>
            </div>
          )}
          {weather.current.relativeHumidity !== undefined && (
            <div className="metric-item">
              <Droplets size={14} className="text-blue-400" />
              <span>{weather.current.relativeHumidity}% Humidity</span>
            </div>
          )}
          <div className="metric-item">
            <Wind size={14} className="text-sky-400" />
            <span>{weather.current.windspeed} km/h Wind</span>
          </div>
          <div className="metric-item">
            <Compass size={14} className="text-violet-400" />
            <span>{weather.current.winddirection}° Direction</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      {weather.daily.time && weather.daily.time.length > 0 && (
        <div className="weather-forecast-section">
          <h5 className="forecast-title">5-Day Outlook</h5>
          <div className="forecast-grid">
            {weather.daily.time.slice(0, 5).map((dateStr, idx) => {
              const date = new Date(dateStr);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const code = weather.daily.weathercode[idx] || 0;
              const maxT = weather.daily.temperature_2m_max[idx] || 0;
              const minT = weather.daily.temperature_2m_min[idx] || 0;
              const precip = weather.daily.precipitation_probability_max?.[idx];

              return (
                <div key={dateStr} className="forecast-day-card">
                  <span className="forecast-day-name">{dayName}</span>
                  <div className="forecast-icon">
                    {getWeatherIcon(code, 20)}
                  </div>
                  <div className="forecast-temps">
                    <span className="forecast-max">{convertTemp(maxT)}</span>
                    <span className="forecast-min">{convertTemp(minT)}</span>
                  </div>
                  {precip !== undefined && precip > 0 && (
                    <span className="text-[10px] text-sky-400 mt-1 flex items-center justify-center gap-0.5">
                      <Droplets size={9} />
                      {precip}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="weather-footer-attribution">
        Powered by Open-Meteo Global Forecasting Model
      </div>

      <style>{`
        .weather-card {
          padding: 24px;
        }
        .weather-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .weather-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
        }
        .temp-unit-toggle {
          font-size: 0.75rem;
          color: var(--accent-sky);
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 3px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .temp-unit-toggle:hover {
          background: rgba(56, 189, 248, 0.2);
        }
        .weather-current-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .weather-current-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .weather-temp-display {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .weather-condition-text {
          font-size: 0.9rem;
          color: var(--accent-sky);
          font-weight: 600;
          margin-top: 4px;
        }
        .weather-metrics {
          margin-left: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .metric-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .weather-forecast-section {
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }
        .forecast-title {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }
        .forecast-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }
        .forecast-day-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 10px 6px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .forecast-day-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .forecast-temps {
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
        }
        .forecast-max {
          font-weight: 700;
          color: #ffffff;
        }
        .forecast-min {
          color: var(--text-muted);
          font-size: 0.7rem;
        }
        .weather-footer-attribution {
          margin-top: 16px;
          font-size: 0.72rem;
          color: var(--text-muted);
          text-align: right;
        }
      `}</style>
    </div>
  );
};
