import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMapPin, FiCoffee } from 'react-icons/fi';

const NearbyIftarPlaces = ({ coordinates }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        if (!coordinates?.lat || !coordinates?.lon) return;
        
        setLoading(true);
        setError('');
        
        // Modified Overpass query with proper encoding
        const overpassQuery = `
          [out:json];
          (
            node["amenity"~"restaurant|cafe|place_of_worship"]
              (around:1000,${coordinates.lat},${coordinates.lon});
            way["amenity"~"restaurant|cafe|place_of_worship"]
              (around:1000,${coordinates.lat},${coordinates.lon});
          );
          out body;
          >;
          out skel qt;
        `.replace(/\n/g, '');

        const response = await axios.get(
          'https://overpass-api.de/api/interpreter',
          {
            params: {
              data: overpassQuery
            }
          }
        );

        // Better error handling for empty responses
        if (!response.data?.elements) {
          throw new Error('No data found');
        }

        const filteredPlaces = response.data.elements
          .filter(place => place.tags?.name)
          .slice(0, 5)
          .map(place => ({
            id: place.id || place.tags.name,
            name: place.tags.name,
            type: place.tags.amenity === 'place_of_worship' ? 'Mosque' : 
                 place.tags.amenity === 'cafe' ? 'Cafe' : 'Restaurant',
            lat: place.lat || place.center?.lat,
            lon: place.lon || place.center?.lon
          }));

        setPlaces(filteredPlaces);
      } catch (err) {
        setError('Failed to load nearby places: ' + err.message);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [coordinates?.lat, coordinates?.lon]); // Better dependency array

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">
          <FiCoffee className="me-2" />
          Nearby Iftar Places
        </h5>
        
        {loading && (
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2"></div>
            <small>Searching nearby...</small>
          </div>
        )}
        
        {error && <div className="alert alert-warning">{error}</div>}
        
        {!loading && !error && (
          <div className="list-group">
            {places.length > 0 ? (
              places.map((place) => (
                <a
                  key={place.id}
                  href={`https://www.openstreetmap.org/${place.id >= 0 ? 'node' : 'way'}/${Math.abs(place.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-group-item list-group-item-action"
                >
                  <FiMapPin className="me-2" />
                  <div>
                    <strong>{place.name}</strong>
                    <div className="text-muted small">
                      {place.type} • OpenStreetMap
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-muted small">
                No nearby places found within 1km radius
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyIftarPlaces;