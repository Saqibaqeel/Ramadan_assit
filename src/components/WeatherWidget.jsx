import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCloudRain, FiSun, FiAlertTriangle } from 'react-icons/fi';

const WeatherWidget = ({ coordinates }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat: coordinates?.lat,
              lon: coordinates?.lon,
              appid: process.env.REACT_APP_OWM_KEY,
              units: 'metric'
            }
          }
        );
        setWeather({
          temp: res.data.main.temp,
          conditions: res.data.weather[0].main,
          icon: res.data.weather[0].icon
        });
      } catch (err) {
        setError('Weather data unavailable');
      } finally {
        setLoading(false);
      }
    };

    if(coordinates) fetchWeather();
  }, [coordinates]);

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">
          <FiSun className="me-2" />
          Weather at Destination
        </h5>
        
        {loading && <div className="spinner-border spinner-border-sm"></div>}
        
        {error && (
          <div className="alert alert-warning">
            <FiAlertTriangle className="me-2" />
            {error}
          </div>
        )}

        {weather && (
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="display-6">{weather.temp}°C</span>
              <div className="text-muted">{weather.conditions}</div>
            </div>
            {weather.conditions.includes('Rain') ? 
              <FiCloudRain size={40} /> : <FiSun size={40} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;