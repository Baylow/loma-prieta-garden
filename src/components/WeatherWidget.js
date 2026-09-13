'use client';

import { useState, useEffect } from 'react';

export default function WeatherWidget({ weatherNotice }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch('/api/weather');
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch (e) {
        console.error('Failed to load weather:', e);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  // Parse coordinator weather status if available
  let noticeConfig = null;
  if (weatherNotice) {
    try {
      noticeConfig = typeof weatherNotice === 'string' ? JSON.parse(weatherNotice) : weatherNotice;
    } catch (e) {
      noticeConfig = { status: 'normal', custom_message: weatherNotice };
    }
  }

  const noticeStatus = noticeConfig?.status || 'normal';
  const customMessage = noticeConfig?.custom_message || '';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pavilion':
        return {
          title: '⛺ Covered Pavilion Plan in Effect',
          desc: customMessage || 'Ground is wet or light drizzle expected. Classes and volunteers meet under the covered Loma pavilion.',
          bg: '#fef3c7',
          border: '#f59e0b',
          color: '#92400e',
          icon: '⛺'
        };
      case 'postponed':
        return {
          title: '🌧️ Wet Weather Notice — Garden Postponed',
          desc: customMessage || 'Outdoor garden sessions are postponed today due to rain. Check with your class lead.',
          bg: '#fee2e2',
          border: '#ef4444',
          color: '#991b1b',
          icon: '🌧️'
        };
      case 'heat_wind':
        return {
          title: '💨 Weather Advisory Active',
          desc: customMessage || 'High mountain winds or heat advisory. Garden activities adjusted for student comfort.',
          bg: '#ffedd5',
          border: '#f97316',
          color: '#9a3412',
          icon: '💨'
        };
      default:
        return null;
    }
  };

  const statusAlert = getStatusBadge(noticeStatus);

  // Check if live rain chance is elevated
  const highRainChance = weather?.forecast?.find(f => f.precipProb >= 50);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* 1. Rain / Weather Notice Banner if active */}
      {statusAlert && (
        <div 
          style={{
            backgroundColor: statusAlert.bg,
            borderLeft: `5px solid ${statusAlert.border}`,
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}
        >
          <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>{statusAlert.icon}</div>
          <div>
            <div style={{ fontWeight: 'bold', color: statusAlert.color, fontSize: '0.95rem' }}>
              {statusAlert.title}
            </div>
            <div style={{ color: statusAlert.color, fontSize: '0.85rem', marginTop: '0.2rem', opacity: 0.9 }}>
              {statusAlert.desc}
            </div>
          </div>
        </div>
      )}

      {/* 2. Live Weather Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
          border: '1px solid rgba(59, 181, 181, 0.25)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>
              {loading ? '🌤️' : (weather?.current?.icon || '☀️')}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>
                  {loading ? '--°F' : `${weather?.current?.temp}°F`}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>
                  {loading ? 'Loading mountain weather...' : weather?.current?.condition}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                📍 Loma Prieta Garden • Elev. 1,600 ft • Wind {loading ? '--' : weather?.current?.windSpeed} mph • Humidity {loading ? '--' : weather?.current?.humidity}%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {highRainChance && !statusAlert && (
              <span style={{ fontSize: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '12px', fontWeight: '600' }}>
                🌧️ {highRainChance.precipProb}% rain chance {highRainChance.dayName}
              </span>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: 'var(--sapphire-blue)',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {expanded ? '▲ Hide 5-Day Forecast' : '▼ 5-Day School Forecast'}
            </button>
          </div>

        </div>

        {/* Expandable 5-Day Forecast */}
        {expanded && weather?.forecast && (
          <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed rgba(59, 181, 181, 0.3)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mountain Garden Forecast (5 Days)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.5rem' }}>
              {weather.forecast.map((day, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    padding: '0.6rem 0.4rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#1e293b' }}>{day.dayName}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{day.dayMonth}</div>
                  <div style={{ fontSize: '1.25rem', margin: '0.2rem 0' }}>{day.icon}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0f172a' }}>
                    {day.tempMax}° / <span style={{ color: '#64748b', fontWeight: 'normal' }}>{day.tempMin}°</span>
                  </div>
                  {day.precipProb > 0 ? (
                    <div style={{ fontSize: '0.7rem', color: day.precipProb >= 40 ? '#0284c7' : '#94a3b8', fontWeight: day.precipProb >= 40 ? 'bold' : 'normal' }}>
                      💧 {day.precipProb}%
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.7rem', color: '#10b981' }}>☀️ Dry</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
