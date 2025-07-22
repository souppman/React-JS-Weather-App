import { useState, useEffect } from 'react';
import { getForecast } from '../service/weatherApi.js';
import sunriseIcon from '../assets/sunrise.png';
import sunsetIcon from '../assets/sunset.png';
import humidIcon from '../assets/humid.png';
import windIcon from '../assets/wind.png';
import pressureIcon from '../assets/pressure.png';

// all weather cards components  forecasts and details 
export default function WeatherCards({ data, city, unit }) {
  const [forecastData, setForecastData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  useEffect(() => {
    if (!city) return;
    
    setForecastLoading(true);
    getForecast(city, unit)
      .then(response => {
        const dailyData = groupForecastByDay(response.list);
        setForecastData(dailyData);
      })
      .catch(error => {
        console.error('Forecast error:', error);
      })
      .finally(() => {
        setForecastLoading(false);
      });
  }, [city, unit]);

  // Group 3-hour forecasts into daily forecasts
  const groupForecastByDay = (list) => {
    const grouped = {};
    
    list.slice(0, 40).forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          date: date,
          temps: [],
          weather: item.weather[0],
          pop: item.pop || 0
        };
      }
      
      grouped[dayKey].temps.push(item.main.temp);
      if (item.pop > grouped[dayKey].pop) {
        grouped[dayKey].pop = item.pop;
      }
    });

    return Object.values(grouped).slice(0, 5).map(day => ({
      date: day.date,
      dayName: getDayName(day.date),
      shortDate: getShortDate(day.date),
      tempHigh: Math.round(Math.max(...day.temps)),
      tempLow: Math.round(Math.min(...day.temps)),
      weather: day.weather,
      description: day.weather.description,
      precipitation: Math.round(day.pop * 100)
    }));
  };

  const getDayName = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en', { weekday: 'short' });
  };

  const getShortDate = (date) => {
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // convert timestamps to readable times
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // convert wind direction from degrees to compass direction
  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  if (!data) return null;

  return (
    <div className="weather-container">
      {/* this is header section - city curr weathers */}
      <div className="weather-header">
        <h1 className="city-name">{data.name}</h1>
        <div className="temperature">{Math.round(data.main.temp)}°</div>
        <div className="description">{data.weather[0].description}</div>
        <div className="feels-like">Feels like {Math.round(data.main.feels_like)}°</div>
        <div className="daily-temps">H:{Math.round(data.main.temp_max)}° L:{Math.round(data.main.temp_min)}°</div>
      </div>

      {/* 5-day forecast */}
      <div className="forecast-container">
        <div className="forecast-header">
          <h3>5-Day Forecast</h3>
        </div>
        {forecastLoading ? (
          <div className="forecast-loading">Loading forecast...</div>
        ) : forecastData ? (
          <div className="forecast-scroll">
            {forecastData.map((day, index) => (
              <div key={index} className="forecast-card">
                <div className="forecast-day">{day.dayName}</div>
                <div className="forecast-date">{day.shortDate}</div>
                <div className="forecast-icon">
                  <img 
                    src={getWeatherIconUrl(day.weather.icon)} 
                    alt={day.weather.description}
                    className="weather-icon"
                  />
                </div>
                <div className="forecast-description">{day.description}</div>
                <div className="forecast-temp-high">H: {day.tempHigh}°</div>
                <div className="forecast-temp-low">L: {day.tempLow}°</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* weather details card grid */}
      <div className="weather-cards-grid">
        {/* humidity */}
        <div className="weather-card">
          <div className="card-header">
            <img src={humidIcon} alt="Humidity" className="card-icon-img" />
            <span className="card-title">HUMIDITY</span>
          </div>
          <div className="card-main">
            <div className="card-value">{data.main.humidity}%</div>
          </div>
        </div>

        {/* wind */}
        <div className="weather-card">
          <div className="card-header">
            <img src={windIcon} alt="Wind" className="card-icon-img" />
            <span className="card-title">WIND</span>
          </div>
          <div className="card-main">
            <div className="card-value">{Math.round(data.wind.speed)}</div>
            <div className="card-units">km/h</div>
          </div>
          <div className="card-subtitle">{getWindDirection(data.wind.deg)}</div>
        </div>

        {/* sunrise & sunset */}
        <div className="weather-card">
          <div className="sun-times-container">
            <div className="sun-time-item">
              <img src={sunriseIcon} alt="Sunrise" className="sun-icon" />
              <div className="sun-time-content">
                <div className="sun-time-label">Sunrise</div>
                <div className="sun-time-value">{formatTime(data.sys.sunrise)}</div>
              </div>
            </div>
            <div className="sun-time-item">
              <img src={sunsetIcon} alt="Sunset" className="sun-icon" />
              <div className="sun-time-content">
                <div className="sun-time-label">Sunset</div>
                <div className="sun-time-value">{formatTime(data.sys.sunset)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ppressure */}
        <div className="weather-card">
          <div className="card-header">
            <img src={pressureIcon} alt="Pressure" className="card-icon-img" />
            <span className="card-title">PRESSURE</span>
          </div>
          <div className="card-main">
            <div className="card-value">{data.main.pressure}</div>
            <div className="card-units">hPa</div>
          </div>
        </div>
      </div>
    </div>
  );
}

