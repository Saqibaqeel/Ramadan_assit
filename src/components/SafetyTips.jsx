import { FiAlertTriangle } from "react-icons/fi";

const SafetyTips = () => {
  const tips = [
    "Keep hydrated before starting your journey",
    "Avoid sudden braking near prayer times",
    "Check vehicle fluids and tire pressure",
    "Plan routes with well-lit areas",
    "Keep emergency dates/water in your car"
  ];

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <FiAlertTriangle className="me-2" />
        Road Safety Tips
      </div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          {tips.map((tip, index) => (
            <li key={index} className="list-group-item">
              <small>{tip}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SafetyTips;