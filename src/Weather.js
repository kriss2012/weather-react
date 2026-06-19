import React from 'react';
import { Icon } from 'semantic-ui-react';
import './weather.css';

const Weather = ({
  city,
  country,
  description,
  temperature,
  feelsLike,
  tempMin,
  tempMax,
  humidity,
  windSpeed,
  pressure,
  visibility,
  icon,
  error,
  isCelsius,
  forecast
}) => {
  if (error) {
    return (
      <div className="error-message animate-fade-in">
        <Icon name="info circle" /> {error}
      </div>
    );
  }

  if (!city) {
    return null;
  }

  // Format visibility in km or miles
  const formattedVisibility = (visibility / 1000).toFixed(1) + ' km';
  
  // Format Wind Speed
  const formattedWind = windSpeed + ' m/s';

  // Get current date string
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="weather-dashboard animate-fade-in">
      <div className="weather-card">
        {/* Hero Section: Main Temp, Description, and Icon */}
        <div className="weather-hero">
          <div className="hero-text">
            <h1 className="city-name">{city}{country ? `, ${country}` : ''}</h1>
            <div className="weather-date">{currentDate}</div>
            <div className="weather-desc">
              {icon && (
                <img
                  className="weather-icon-lg animate-float"
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt={description}
                />
              )}
              <span>{description}</span>
            </div>
          </div>
          <div className="temp-large">
            {temperature}°{isCelsius ? 'C' : 'F'}
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="weather-details-grid">
          <div className="detail-item">
            <span className="detail-label">
              <Icon name="thermometer half" /> Feels Like
            </span>
            <span className="detail-value">{feelsLike}°{isCelsius ? 'C' : 'F'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Icon name="arrows alternate vertical" /> Min / Max
            </span>
            <span className="detail-value">
              {tempMin}° / {tempMax}°
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Icon name="tint" /> Humidity
            </span>
            <span className="detail-value">{humidity}%</span>
            <div className="humidity-bar-container">
              <div 
                className="humidity-bar-fill" 
                style={{ width: `${humidity}%` }}
              ></div>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Icon name="wind" /> Wind Speed
            </span>
            <span className="detail-value">{formattedWind}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Icon name="eye" /> Visibility
            </span>
            <span className="detail-value">{formattedVisibility}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Icon name="compress" /> Pressure
            </span>
            <span className="detail-value">{pressure} hPa</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      {forecast && forecast.length > 0 && (
        <div className="forecast-section mt-5 animate-fade-in">
          <h2 className="forecast-title">5-Day Forecast</h2>
          <div className="forecast-cards-container">
            {forecast.map((day, idx) => (
              <div className="forecast-card" key={idx}>
                <span className="forecast-day">{day.weekday}</span>
                <span className="forecast-date">{day.formattedDate}</span>
                {day.icon && (
                  <img
                    className="forecast-icon"
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description}
                  />
                )}
                <span className="forecast-temp">
                  <span className="forecast-temp-max">
                    {isCelsius ? day.maxTemp : Math.round(day.maxTemp * 1.8 + 32)}°
                  </span>
                  <span className="forecast-temp-min">
                    {isCelsius ? day.minTemp : Math.round(day.minTemp * 1.8 + 32)}°
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;