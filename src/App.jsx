import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [time, setTime] = useState(25 * 60); // Store time in seconds
  const [breakTime, setBreakTime] = useState(5 * 60); // Store break time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [displayTime, setDisplayTime] = useState(25); // Display time in minutes
  const [displayBreak, setDisplayBreak] = useState(5); // Display break time in minutes
  const [displayLabel, setDisplayLabel] = useState("Session");
  const [intervalId, setIntervalId] = useState(null);
  const audioRef = useRef(null);

  const formatTime = (s) => {
    const minutes = Math.floor(s / 60);
    const secs = s % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const buttonStartStop = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      const newIntervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            
            return 0;
          }
        });
      }, 1000);
      setIntervalId(newIntervalId);
    }
  };

  // useEffect to handle time reaching zero and switching between session and break
  useEffect(() => {
    if (time === 0) {
      audioRef.current.play();
      if (isBreak) {
        // Switch to session
        setIsBreak(false);
        setDisplayLabel("Session");
        setTime(displayTime * 60);
      } else {
        // Switch to break
        setIsBreak(true);
        setDisplayLabel("Break");
        setTime(displayBreak * 60);
      }
    }
  }, [time, isBreak, displayTime, breakTime]);

  const buttonReset = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setIsBreak(false);
    setTime(25 * 60);
    setBreakTime(5 * 60);
    setDisplayBreak(5);
    setDisplayTime(25);
    setDisplayLabel("Session");
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const buttonSubstractBreak = () => {
    if (breakTime > 60) {
      setBreakTime(breakTime - 60);
      setDisplayBreak((breakTime - 60) / 60);
    }
  };

  const buttonAddBreak = () => {
    if (breakTime < 60 * 60) {
      setBreakTime(breakTime + 60);
      setDisplayBreak((breakTime + 60) / 60);
    }
  };

  const buttonSubstractTime = () => {
    if (time > 60) {
      setTime(time - 60);
      setDisplayTime((time - 60) / 60);
    }
  };

  const buttonAddTime = () => {
    if (time < 60 * 60) {
      setTime(time + 60);
      setDisplayTime((time + 60) / 60);
    }
  };

  return (
    <>
      <div className="container">
        <div className="title"><h1>Time Focus</h1></div>
        <div className="break-section">
          <div id="break-label"><h2>Break Length</h2></div>
          <button onClick={buttonSubstractBreak} id="break-decrement">-</button>
          <p id="break-length">{displayBreak}</p>
          <button onClick={buttonAddBreak} id="break-increment">+</button>
        </div>
        <div className="session-section">
          <div id="session-label"><h2>Session Length</h2></div>
          <button onClick={buttonSubstractTime} id="session-decrement">-</button>
          <p id="session-length">{displayTime}</p>
          <button onClick={buttonAddTime} id="session-increment">+</button>
        </div>

        <div className="time-container">
          <div id="timer-label"><h2>{displayLabel}</h2></div>
          <div id="time-left">{formatTime(time)}</div>
          <button onClick={buttonStartStop} id="start_stop">{isRunning ? 'PAUSE' : 'START'}</button>
          <button onClick={buttonReset} id="reset">RESET</button>
        </div>
        <audio ref={audioRef}>
          <source src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav' type='audio/wav' />
        </audio>
      </div>
    </>
  )
}

export default App;
