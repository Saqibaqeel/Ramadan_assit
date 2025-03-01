import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAlertOctagon } from 'react-icons/fi';

const TrafficStatus = ({ origin, destination }) => {
  const [trafficDelay, setTrafficDelay] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkTraffic = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://router.hereapi.com/v8/routes`,
          {
            params: {
              transportMode: 'car',
              origin: origin,
              destination: destination,
              departureTime: 'now',
              return: 'summary',
              apiKey: process.env.REACT_APP_HERE_API_KEY
            }
          }
        );
        
        const summary = res.data?.routes?.[0]?.sections?.[0]?.summary;
        if (summary) {
          const delay = summary.duration - summary.baseDuration;
          setTrafficDelay(Math.max(delay, 0));
        }
      } catch (err) {
        console.error("Traffic data unavailable");
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination) checkTraffic();
  }, [origin, destination]);

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">
          <FiAlertOctagon className="me-2" />
          Traffic Status
        </h5>
        
        {loading && <div className="spinner-border spinner-border-sm"></div>}
        
        {trafficDelay !== null && trafficDelay > 0 && (
          <div className="alert alert-warning mb-0">
            ⚠️ Expect {Math.round(trafficDelay/60)} minute traffic delay
          </div>
        )}
        
        {trafficDelay === 0 && (
          <div className="alert alert-success mb-0">
            ✅ No significant traffic delays
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficStatus;