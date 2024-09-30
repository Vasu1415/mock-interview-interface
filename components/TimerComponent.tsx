import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Clock, RefreshCcw } from 'lucide-react';

const TimerComponent = () => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleIconClick = () => {
    setIsTimerActive(true);
    setIsRunning(true);
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
      {!isTimerActive ? (
        <button onClick={handleIconClick} className="p-2 rounded-full bg-slate-800 dark:bg-black">
          <Clock className="text-gray-300 h-6 w-6" />
        </button>
      ) : (
        <div className="flex items-center bg-black p-2 rounded-lg">
          <button
            className="text-white bg-black rounded-full px-3 py-2 hover:bg-slate-600"
            onClick={toggleTimer}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span className="ml-4 text-white text-lg font-mono">{formatTime(seconds)}</span>

          <button
            className="text-white bg-black rounded-full px-3 py-2 ml-4"
            onClick={resetTimer}
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TimerComponent;
