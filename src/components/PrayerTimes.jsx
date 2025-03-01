import { FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";

const PrayerTimes = ({ coordinates }) => {
  const [times, setTimes] = useState({});
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (coordinates) {
      axios.get(`https://api.aladhan.com/v1/timings?latitude=${coordinates.lat}&longitude=${coordinates.lon}`)
        .then(res => setTimes(res.data.data.timings));
    }
  }, [coordinates]);

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <FiClock className="me-2" />
        Prayer Times
        <button 
          className="btn btn-sm btn-outline-secondary float-end"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Basic' : 'Full Schedule'}
        </button>
      </div>
      <div className="card-body">
        <div className="row g-2">
          {Object.entries(times)
            .filter(([name]) => showAll || ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(name))
            .map(([name, time]) => (
              <div key={name} className="col-6 col-md-4">
                <div className={`p-2 ${name === 'Maghrib' ? 'bg-warning-subtle' : 'bg-light'}`}>
                  <small className="text-muted">{name}</small>
                  <div className="fw-bold">{time}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;