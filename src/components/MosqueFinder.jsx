import { FiUsers } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";

const MosqueFinder = ({ coordinates }) => {
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Haversine formula for distance calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); // Distance in meters
  };

  const findMosques = async () => {
    if (!coordinates?.lat || !coordinates?.lon) {
      setError("Invalid coordinates");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: "mosque",
            format: "json",
            lat: coordinates.lat,
            lon: coordinates.lon,
            bounded: 1,
            viewbox: [
              coordinates.lon - 0.045, // ~5km radius
              coordinates.lat + 0.045,
              coordinates.lon + 0.045,
              coordinates.lat - 0.045,
            ].join(","),
            dedupe: 1,
            limit: 10,
          },
        }
      );

      const mosquesWithDistance = response.data
        .map((mosque) => ({
          ...mosque,
          distance: calculateDistance(
            coordinates.lat,
            coordinates.lon,
            parseFloat(mosque.lat),
            parseFloat(mosque.lon)
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      setMosques(mosquesWithDistance);
    } catch (err) {
      setError("Failed to fetch mosque data");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coordinates) findMosques();
  }, [coordinates?.lat, coordinates?.lon]);

  return (
    <div className="card mb-4">
      <div className="card-header bg-light d-flex align-items-center">
        <FiUsers className="me-2" />
        <span className="flex-grow-1">Nearby Mosques</span>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={findMosques}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Searching...
            </>
          ) : (
            "Refresh"
          )}
        </button>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-warning mb-3">
            {error}
          </div>
        )}

        {!loading && mosques.length === 0 && (
          <div className="text-muted text-center py-3">
            No mosques found within 5km radius
          </div>
        )}

        {mosques.length > 0 && (
          <div className="list-group">
            {mosques.map((mosque) => (
              <a
                key={mosque.place_id}
                href={`https://www.openstreetmap.org/${mosque.osm_type}/${mosque.osm_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="list-group-item list-group-item-action"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">
                      {mosque.display_name?.split(",")[0] || "Unnamed Mosque"}
                    </div>
                    <small className="text-muted">
                      {mosque.display_name?.split(",").slice(1, 3).join(", ")}
                    </small>
                  </div>
                  <div className="text-end">
                    <div className="text-primary">
                      {mosque.distance}m
                    </div>
                    <small className="text-muted text-uppercase">
                      {mosque.type}
                    </small>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MosqueFinder;