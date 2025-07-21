const API_KEY = import.meta.env.VITE_weatherKey;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// checking if the key is missing
if (!API_KEY) {
  console.error('OpenWeatherMap API key is missing. Add VITE_weatherKey to your .env file');
}

// get current weather for a city
export const getCurrentWeather = async (city, units = 'metric') => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`
  );
  
  if (!response.ok) {
    throw new Error(`Weather data not found for ${city}`);
  }
  
  return await response.json();
};

// get 5-day forecast for a city
export const getForecast = async (city, units = 'metric') => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}`
  );
  
  if (!response.ok) {
    throw new Error(`Forecast data not found for ${city}`);
  }
  
  return await response.json();
};

// get weather by coordinates
export const getWeatherByCoords = async (lat, lon, units = 'metric') => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
  );
  
  if (!response.ok) {
    throw new Error('Weather data not found for location');
  }
  
  return await response.json();
};
