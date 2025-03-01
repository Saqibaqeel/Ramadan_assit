import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMap } from 'react-icons/fi';

const AlternativeRoutes = ({ origin, destination }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${origin};${destination}`,
          {
            params: {
              alternatives: true
            }
          }
        );
        setRoutes(res.data.routes.slice(1, 4));
      } catch (err) {
        console.error("Failed to fetch alternatives");
      } finally {
        setLoading(false);
      }
    };

    if(origin && destination) fetchRoutes();
  }, [origin, destination]);

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">
          <FiMap className="me-2" />
          Alternative Routes
        </h5>
        
        {loading && <div className="spinner-border spinner-border-sm"></div>}
        
        <div className="list-group">
          {routes.map((route, i) => (
            <div key={i} className="list-group-item">
              <div className="d-flex justify-content-between">
                <span>Route {i + 1}</span>
                <span>
                  {Math.round(route.duration / 60)} mins
                  <span className="text-muted ms-2">
                    ({Math.round(route.distance / 1000)} km)
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlternativeRoutes;