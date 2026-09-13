import { NextResponse } from 'next/server';

// WMO Weather interpretation codes (WW)
const WMO_CODES = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy / Mountain Mist', icon: '🌫️' },
  48: { label: 'Depositing Rime Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Moderate Drizzle', icon: '🌦️' },
  55: { label: 'Dense Drizzle', icon: '🌧️' },
  61: { label: 'Slight Rain', icon: '🌧️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Slight Snow', icon: '🌨️' },
  73: { label: 'Moderate Snow', icon: '❄️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  80: { label: 'Light Showers', icon: '🌦️' },
  81: { label: 'Moderate Showers', icon: '🌧️' },
  82: { label: 'Violent Rain Showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with Hail', icon: '⛈️' },
};

export async function GET() {
  try {
    // Loma Prieta School / Los Gatos Mountains coordinates
    // Latitude 37.1147, Longitude -121.9056 (~1600ft elevation)
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=37.1147&longitude=-121.9056&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FLos_Angeles';

    const res = await fetch(url, {
      next: { revalidate: 900 } // Cache for 15 minutes
    });

    if (!res.ok) {
      throw new Error(`Weather API error: ${res.statusText}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const currentWeatherCode = current?.weather_code ?? 0;
    const currentCondition = WMO_CODES[currentWeatherCode] || { label: 'Clear', icon: '☀️' };

    // Format 5-day forecast
    const forecast = (daily?.time || []).slice(0, 5).map((dateStr, idx) => {
      const code = daily.weather_code?.[idx] ?? 0;
      const cond = WMO_CODES[code] || { label: 'Fair', icon: '🌤️' };
      const dateObj = new Date(dateStr + 'T12:00:00');
      
      return {
        date: dateStr,
        dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        dayMonth: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? 0),
        tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? 0),
        precipProb: daily.precipitation_probability_max?.[idx] ?? 0,
        condition: cond.label,
        icon: cond.icon
      };
    });

    return NextResponse.json({
      location: 'Loma Prieta School Garden (Elev. 1,600 ft)',
      current: {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        precipitation: current.precipitation,
        condition: currentCondition.label,
        icon: currentCondition.icon,
        code: currentWeatherCode,
      },
      forecast,
      updatedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800'
      }
    });
  } catch (err) {
    console.error('Failed to fetch weather forecast:', err);
    return NextResponse.json({
      location: 'Loma Prieta School Garden',
      current: {
        temp: 68,
        feelsLike: 68,
        humidity: 45,
        windSpeed: 5,
        precipitation: 0,
        condition: 'Sunny / Mild',
        icon: '☀️',
        code: 0,
      },
      forecast: [],
      error: 'Using fallback mountain weather data',
      updatedAt: new Date().toISOString()
    });
  }
}
