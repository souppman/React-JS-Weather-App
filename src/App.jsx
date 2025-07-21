import { useState, useEffect } from 'react'
import { getCurrentWeather } from './service/weatherApi.js'
import Loading from './components/loading.jsx'
import SearchBar from './components/searchBar.jsx'
import WeatherCards from './components/cards.jsx'
import UnitToggle from './components/unitToggle.jsx'
import ThemeToggle from './components/themeToggle.jsx'
import Error from './components/error.jsx'
import useLocalStorage from './hook/useLocalStorage.js'
import './index.css'

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useLocalStorage('lastCity', 'London');
  const [unit, setUnit] = useLocalStorage('temperatureUnit', 'metric');
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  const handleSearch = (newCity) => {
    setCity(newCity);
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setData(null);
    
    getCurrentWeather(city, unit)
      .then(response => {
        setData(response);
        setError(false);
      })
      .catch(error => {
        console.error(error);
        setError(true);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [city, unit]);

  return (
    <div>
      <div className="app-header">
        <h1>Weather Watch</h1>
        <div className="toggles-container">
          <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
          <UnitToggle unit={unit} onUnitChange={handleUnitChange} />
        </div>
      </div>
      <SearchBar onSearch={handleSearch} />
      
      {loading && <Loading />}
      {error && <Error />}
      {data && !loading && !error && (
        <WeatherCards data={data} city={city} unit={unit} />
      )}
    </div>
  );
}


