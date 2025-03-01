import { FiShield } from "react-icons/fi";

const RouteSafetyRating = ({ duration, distance }) => {
  const calculateSafety = () => {
    const speed = distance / (duration / 60);
    if (speed > 80) return { level: "High Risk", color: "danger" };
    if (speed > 60) return { level: "Moderate Risk", color: "warning" };
    return { level: "Safe Route", color: "success" };
  };

  const safety = calculateSafety();

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <FiShield className="me-2" />
        Route Safety Rating
      </div>
      <div className="card-body text-center">
        <div className={`alert alert-${safety.color} mb-0`}>
          <h4 className="mb-0">{safety.level}</h4>
          <small className="text-muted">
            Based on average speed of {Math.round(distance / (duration / 60))} km/h
          </small>
        </div>
      </div>
    </div>
  );
};

export default RouteSafetyRating;