import React, { useState } from "react";
import axios from "axios";
import { FiClock, FiMapPin, FiSunset } from "react-icons/fi";
import WeatherWidget from "./components/WeatherWidget";
import TrafficStatus from "./components/TrafficStatus";
import IftarCountdown from "./components/IftarCountdown";
import ShareButton from "./components/ShareButton";
import AlternativeRoutes from "./components/AlternativeRoutes";
import NearbyIftarPlaces from "./components/NearbyIftarPlaces";
import PrayerTimes from "./components/PrayerTimes";
import SafetyTips from "./components/SafetyTips";
import MosqueFinder from "./components/MosqueFinder";
import CharityOrganizations from "./components/CharityOrganizations";
import RouteSafetyRating from "./components/RouteSafetyRating";

const TravelPlanner = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [prayerTime, setPrayerTime] = useState("");
  const [travelDuration, setTravelDuration] = useState("");
  const [travelDistance, setTravelDistance] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [journeyDetails, setJourneyDetails] = useState({
    origin: '',
    destination: '',
    iftarTime: '',
    recommendation: ''
  });

  const isValidCoordinates = (coords) => {
    const regex = /^-?\d{1,2}\.\d+,-?\d{1,3}\.\d+$/;
    return regex.test(coords);
  };

  const geocodePlace = async (place) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${place}&format=json`
      );
      if (response.data.length === 0) throw new Error("Place not found");
      const { lat, lon } = response.data[0];
      return `${lat},${lon}`;
    } catch (error) {
      throw new Error("Could not geocode place");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOriginCoords(null);
    setDestinationCoords(null);

    try {
      if (!origin || !destination) {
        throw new Error("Please enter both locations");
      }

      const originGeocoded = await geocodePlace(origin);
      const destinationGeocoded = await geocodePlace(destination);

      if (!isValidCoordinates(originGeocoded) || !isValidCoordinates(destinationGeocoded)) {
        throw new Error("Invalid coordinates");
      }

      const [originLat, originLon] = originGeocoded.split(',');
      const [destLat, destLon] = destinationGeocoded.split(',');
      setOriginCoords({ lat: parseFloat(originLat), lon: parseFloat(originLon) });
      setDestinationCoords({ lat: parseFloat(destLat), lon: parseFloat(destLon) });

      // Get prayer times
      const prayerResponse = await axios.get(
        `https://api.aladhan.com/v1/timingsByAddress?address=${originGeocoded}`
      );
      const maghribTime = prayerResponse.data.data.timings.Maghrib;
      setPrayerTime(maghribTime);

      // Get route data
      const routeResponse = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${originGeocoded};${destinationGeocoded}?overview=false`
      );

      if (!routeResponse.data.routes?.length) {
        throw new Error("Could not calculate route");
      }

      const routeData = routeResponse.data.routes[0];
      const durationMinutes = Math.round(routeData.duration / 60);
      const distanceKm = (routeData.distance / 1000).toFixed(1);
      const realisticDuration = Math.round((distanceKm / 40) * 60);

      setTravelDuration(realisticDuration);
      setTravelDistance(distanceKm);

      setJourneyDetails({
        origin,
        destination,
        iftarTime: maghribTime,
        recommendation: recommendation
      });

      // Calculate recommendation
      const now = new Date();
      const [hours, minutes] = maghribTime.split(':').map(Number);
      const iftarDate = new Date(now);
      iftarDate.setHours(hours, minutes, 0, 0);
      const arrivalTime = new Date(now.getTime() + realisticDuration * 60000);

      setRecommendation(
        arrivalTime < iftarDate
          ? "✅ You can reach before Iftar!"
          : "⚠️ You'll arrive after Iftar. Consider alternatives."
      );

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h1 className="card-title mb-4 text-center">
            <FiSunset className="text-warning me-2" />
            Ramadan Travel Assistant
          </h1>

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Current Location</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiMapPin />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your location"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiMapPin />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-3">
              <button
                type="submit"
                className="btn btn-primary flex-grow-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Calculating...
                  </>
                ) : (
                  "Check Journey"
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={async () => {
                  try {
                    const pos = await new Promise((resolve, reject) => {
                      navigator.geolocation.getCurrentPosition(resolve, reject);
                    });
                    setOrigin(`${pos.coords.latitude},${pos.coords.longitude}`);
                  } catch (error) {
                    setError("Could not get location");
                  }
                }}
              >
                Use Current Location
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <div className="mt-4">
            {originCoords && <PrayerTimes coordinates={originCoords} />}
            
            <SafetyTips />

            {prayerTime && <IftarCountdown iftarTime={prayerTime} />}

            {(travelDuration || prayerTime) && (
              <div className="row g-4 mt-3">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <FiClock className="me-2" />
                        Journey Details
                      </h5>
                      {prayerTime && (
                        <div className="alert alert-info">
                          <strong>Iftar Time:</strong> {prayerTime}
                        </div>
                      )}
                      {travelDuration && (
                        <div className="alert alert-info">
                          <strong>Travel Time:</strong> {travelDuration} minutes
                          <br />
                          <strong>Distance:</strong> {travelDistance} km
                        </div>
                      )}
                      {recommendation && (
                        <div className="alert alert-warning">
                          <strong>Recommendation:</strong> {recommendation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  {destinationCoords && (
                    <div className="card h-100">
                      <div className="card-body">
                        <WeatherWidget coordinates={destinationCoords} />
                        <TrafficStatus 
                          origin={originCoords} 
                          destination={destinationCoords} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {destinationCoords && (
              <>
                <RouteSafetyRating 
                  duration={travelDuration}
                  distance={travelDistance}
                />
                <MosqueFinder coordinates={destinationCoords} />
              </>
            )}

            {originCoords && destinationCoords && (
              <>
                <AlternativeRoutes
                  origin={originCoords}
                  destination={destinationCoords}
                />
                <NearbyIftarPlaces coordinates={destinationCoords} />
                <ShareButton journeyDetails={journeyDetails} />
              </>
            )}

            <CharityOrganizations />

            <div className="mt-4 text-muted small">
              <p>Uses free services from:</p>
              <ul className="list-unstyled">
                <li>Aladhan Prayer Times API</li>
                <li>OpenStreetMap & Nominatim</li>
                <li>OSRM Routing Engine</li>
                <li>OpenWeatherMap</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanner;