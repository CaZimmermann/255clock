import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [audioRef] = useState(React.createRef());
  
  const decrementBreakLength = () => {
    if (!isTimerActive) {
      setBreakLength((prev) => Math.max(prev - 1, 1));
    }
  };

  const incrementBreakLength = () => {
    if (!isTimerActive) {
      setBreakLength((prev) => Math.min(prev + 1, 60));
    }
  };

  const decrementSessionLength = () => {
    if (!isTimerActive) {
      setSessionLength((prev) => Math.max(prev - 1, 1));
    }
  };

  const incrementSessionLength = () => {
    if (!isTimerActive) {
      setSessionLength((prev) => Math.min(prev + 1, 60));
    }
  };

  const reset = () => {
    setIsRunning(false);
    setIsTimerActive(false);
    setTimerLabel('Session');
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const startStop = () => {
    setIsRunning((prev) => !prev);
    setIsTimerActive(true);
  };

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            audioRef.current.play();
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              setTimeLeft(breakLength * 60);
            } else {
              setTimerLabel('Session');
              setTimeLeft(sessionLength * 60);
            }
          }
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, timerLabel, sessionLength, breakLength]);

  return (
    <div>
      <div>
        <div id="break-label">Break Length</div>
        <div id="break-decrement" onClick={decrementBreakLength} className={isTimerActive ? 'disabled' : ''}>
          -
        </div>
        <div id="break-increment" onClick={incrementBreakLength} className={isTimerActive ? 'disabled' : ''}>
          +
        </div>
        <div id="break-length">{breakLength}</div>
      </div>

      <div>
        <div id="session-label">Session Length</div>
        <div id="session-decrement" onClick={decrementSessionLength} className={isTimerActive ? 'disabled' : ''}>
          -
        </div>
        <div id="session-increment" onClick={incrementSessionLength} className={isTimerActive ? 'disabled' : ''}>
          +
        </div>
        <div id="session-length">{sessionLength}</div>
      </div>

      <div>
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{`${Math.floor(timeLeft / 60)
          .toString()
          .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}</div>
        <div id="start_stop" onClick={startStop}>
          Start/Stop
        </div>
        <div id="reset" onClick={reset}>
          Reset
        </div>
        <audio id="beep" ref={audioRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
      </div>
    </div>
  );
};

export default App;
