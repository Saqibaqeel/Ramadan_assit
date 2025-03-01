import { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';

const IftarCountdown = ({ iftarTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const [hours, minutes] = iftarTime.split(':').map(Number);
      const iftarDate = new Date(now);
      iftarDate.setHours(hours, minutes, 0, 0);

      if(now > iftarDate) {
        setTimeLeft("Iftar time has passed");
        return;
      }

      const diff = iftarDate - now;
      const hoursLeft = Math.floor(diff / 3600000);
      const minutesLeft = Math.floor((diff % 3600000) / 60000);
      
      setTimeLeft(
        `${hoursLeft.toString().padStart(2, '0')}h 
        ${minutesLeft.toString().padStart(2, '0')}m`
      );
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(timer);
  }, [iftarTime]);

  return (
    <div className="card text-white bg-primary mb-3">
      <div className="card-body">
        <h5 className="card-title">
          <FiClock className="me-2" />
          Iftar Countdown
        </h5>
        <div className="display-4">{timeLeft}</div>
      </div>
    </div>
  );
};

export default IftarCountdown;