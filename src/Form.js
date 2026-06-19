import React from 'react';
import './form.css';
import { Icon } from 'semantic-ui-react';

const Form = ({ getWeather, getMyLocation }) => {
  return (
    <div className="search-container animate-fade-in">
      <form onSubmit={getWeather} className="search-form">
        <div className="search-input-wrapper">
          <Icon name="search" className="search-icon-inside" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city (e.g. London, Tokyo)..."
            name="city"
            required
            autoComplete="off"
          />
        </div>
        <div className="search-actions">
          <button type="submit" className="search-btn">
            <Icon name="search" /> Search
          </button>
          <button 
            type="button" 
            onClick={getMyLocation} 
            className="location-btn"
            title="Use current location"
          >
            <Icon name="map marker alternate" /> Near Me
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;