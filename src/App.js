import React, { useState, useEffect } from 'react';
import { Icon, Loader } from 'semantic-ui-react';
import './App.css';
import Form from './Form';
import Weather from './Weather';
import "semantic-ui-css/semantic.min.css";

const APIKEY = 'c2514daffcbd261b8f9940d30fc01d0a';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Custom configurable GitHub link
  const githubLink = 'https://github.com/djangobaby2015/weather-react';

  // Get dynamic background gradient theme based on OWM weather icon code
  const getThemeClass = (iconCode) => {
    if (!iconCode) return 'theme-default';
    const isNight = iconCode.endsWith('n');
    const code = iconCode.substring(0, 2);
    
    if (isNight) {
      return 'theme-night';
    }
    
    switch (code) {
      case '01': // Clear
        return 'theme-clear';
      case '02': // Few clouds
      case '03': // Scattered clouds
      case '04': // Broken clouds
        return 'theme-clouds';
      case '09': // Shower rain
      case '10': // Rain
        return 'theme-rain';
      case '11': // Thunderstorm
        return 'theme-thunderstorm';
      case '13': // Snow
        return 'theme-snow';
      case '50': // Mist / Fog
        return 'theme-mist';
      default:
        return 'theme-default';
    }
  };

  // Helper to parse 5-day forecast list into daily forecast summaries
  const parseForecast = (list) => {
    const daily = {};
    list.forEach(item => {
      const dateStr = item.dt_txt.split(' ')[0];
      if (!daily[dateStr]) {
        daily[dateStr] = {
          temps: [],
          icons: [],
          descriptions: [],
          dt: item.dt
        };
      }
      daily[dateStr].temps.push(item.main.temp);
      daily[dateStr].icons.push(item.weather[0].icon);
      daily[dateStr].descriptions.push(item.weather[0].description);
    });

    const keys = Object.keys(daily);
    // Slice 5 days (skipping today if possible)
    const targetKeys = keys.length > 5 ? keys.slice(1, 6) : keys.slice(0, 5);

    return targetKeys.map(dateStr => {
      const dayData = daily[dateStr];
      const tempsCelsius = dayData.temps.map(t => t - 273.15);
      const minTemp = Math.round(Math.min(...tempsCelsius));
      const maxTemp = Math.round(Math.max(...tempsCelsius));
      
      // Get most frequent icon code
      const iconCounts = {};
      let mostFrequentIcon = dayData.icons[0];
      let maxCount = 0;
      dayData.icons.forEach(icon => {
        iconCounts[icon] = (iconCounts[icon] || 0) + 1;
        if (iconCounts[icon] > maxCount) {
          maxCount = iconCounts[icon];
          mostFrequentIcon = icon;
        }
      });

      const dateObj = new Date(dayData.dt * 1000);
      const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        weekday,
        formattedDate,
        minTemp,
        maxTemp,
        icon: mostFrequentIcon,
        description: dayData.descriptions[0]
      };
    });
  };

  // Fetch data by coordinates (latitude, longitude)
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APIKEY}`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${APIKEY}`
      );

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error('Failed to retrieve weather data.');
      }

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather({
        city: weatherData.name,
        country: weatherData.sys.country,
        icon: weatherData.weather[0].icon,
        description: weatherData.weather[0].description,
        temperature: Math.round(weatherData.main.temp - 273.15),
        feelsLike: Math.round(weatherData.main.feels_like - 273.15),
        tempMin: Math.round(weatherData.main.temp_min - 273.15),
        tempMax: Math.round(weatherData.main.temp_max - 273.15),
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility,
      });

      setForecast(parseForecast(forecastData.list));
    } catch (err) {
      setError(err.message || 'Error fetching weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data by city name
  const fetchWeatherForCity = async (city) => {
    if (!city.trim()) {
      setError('Please enter a valid city name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKEY}`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${APIKEY}`
      );

      if (weatherRes.status === 404) {
        throw new Error('City not found. Please check spelling.');
      }

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error('Could not fetch weather. Please try again.');
      }

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather({
        city: weatherData.name,
        country: weatherData.sys.country,
        icon: weatherData.weather[0].icon,
        description: weatherData.weather[0].description,
        temperature: Math.round(weatherData.main.temp - 273.15),
        feelsLike: Math.round(weatherData.main.feels_like - 273.15),
        tempMin: Math.round(weatherData.main.temp_min - 273.15),
        tempMax: Math.round(weatherData.main.temp_max - 273.15),
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility,
      });

      setForecast(parseForecast(forecastData.list));
    } catch (err) {
      setError(err.message || 'Error fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const city = e.target.elements.city.value;
    fetchWeatherForCity(city);
  };

  // Browser Geolocation handler
  const getMyLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          // If Geolocation is blocked or fails, notify and load default city
          setError('Location access denied. Loading default city weather.');
          fetchWeatherForCity('New York');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Loading default city.');
      fetchWeatherForCity('New York');
    }
  };

  // Load user's location or default city on startup
  useEffect(() => {
    getMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format helper to convert Celsius value to Fahrenheit if requested
  const formatTemp = (val) => {
    if (isCelsius) return val;
    return Math.round(val * 1.8 + 32);
  };

  // Theme styling based on active weather state
  const themeClass = weather ? getThemeClass(weather.icon) : 'theme-default';

  return (
    <div className={`App ${themeClass}`}>
      <div className="app-container">
        {/* Header / Navbar */}
        <header className="header-nav animate-fade-in">
          <div className="brand">
            <span className="brand-orange">24</span>
            <Icon name="close" style={{ fontSize: '1.2rem', margin: '0 2px' }} />
            <span>7</span>
            <span>CLOUDY</span>
            <span className="brand-orange">LIVE</span>
            <Icon name="cloud" className="brand-icon" />
          </div>
          
          <div className="temp-toggle-container">
            <button
              onClick={() => setIsCelsius(true)}
              className={`temp-toggle-btn ${isCelsius ? 'active' : ''}`}
            >
              °C
            </button>
            <button
              onClick={() => setIsCelsius(false)}
              className={`temp-toggle-btn ${!isCelsius ? 'active' : ''}`}
            >
              °F
            </button>
          </div>
        </header>

        {/* Search Form component */}
        <Form 
          getWeather={handleFormSubmit} 
          getMyLocation={getMyLocation} 
        />

        {/* Quick select buttons */}
        <div className="quick-cities animate-fade-in">
          {['New York', 'London', 'Tokyo', 'Paris', 'Sydney'].map((city) => (
            <button
              key={city}
              onClick={() => fetchWeatherForCity(city)}
              className="quick-city-btn"
            >
              {city}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="loader-container animate-fade-in">
            <Loader active inline="centered" inverted size="large">
              Loading local weather forecast...
            </Loader>
          </div>
        )}

        {/* Weather details display */}
        {!loading && (
          <Weather
            city={weather?.city}
            country={weather?.country}
            description={weather?.description}
            temperature={weather ? formatTemp(weather.temperature) : ''}
            feelsLike={weather ? formatTemp(weather.feelsLike) : ''}
            tempMin={weather ? formatTemp(weather.tempMin) : ''}
            tempMax={weather ? formatTemp(weather.tempMax) : ''}
            humidity={weather?.humidity}
            windSpeed={weather?.windSpeed}
            pressure={weather?.pressure}
            visibility={weather?.visibility}
            icon={weather?.icon}
            error={error}
            isCelsius={isCelsius}
            forecast={forecast}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-text">
          <span>Get Code At:</span>
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <Icon name="github" size="large" /> GitHub Repository
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
