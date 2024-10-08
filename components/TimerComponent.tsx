import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCcw } from 'lucide-react';

const TimerComponent = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Update the type here

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000) as unknown as NodeJS.Timeout; // Ensure correct type in Node.js
    } else if (!isRunning && seconds !== 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const getTwoDigits = (num: number) => String(num).padStart(2, '0');
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${getTwoDigits(hours)}:${getTwoDigits(minutes)}:${getTwoDigits(secs)}`;
  };

  return (
    <div className="flex items-center space-x-4">
        <div className="flex items-center dark:bg-black p-2 rounded-lg">
          <button
            className="text-black dark:text-white dark:bg-black rounded-full px-3 py-2"
            onClick={toggleTimer}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span className="ml-4 text-black dark:text-white text-lg font-mono">{formatTime(seconds)}</span>

          <button
            className="text-black dark:text-white dark:bg-black rounded-full px-3 py-2 ml-4"
            onClick={resetTimer}
          >
            <RefreshCcw size={16} />
          </button>
        </div>
    </div>
  );
};

export default TimerComponent;
