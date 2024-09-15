import React, { useEffect, useState } from 'react';

interface TimeUntilProps {
  targetTime: Date;
}

const TimeUntil: React.FC<TimeUntilProps> = ({ targetTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const difference = targetTime.getTime() - currentTime;

      setTimeRemaining(difference);

      if (difference <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetTime]);

  const formatTime = (milliseconds: number) => {
    milliseconds = Math.abs(milliseconds);
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    let msg = `${minutes}m ${seconds}s`;
    if (hours > 0) {
      msg = `${hours}h ${msg}`;
    }
    if (days > 0) {
      msg = `${days}d ${msg}`;
    }
    return msg;
  };

  return (
    <span className="timeuntil">
      {formatTime(timeRemaining)}
    </span>
  );
};

export default TimeUntil;