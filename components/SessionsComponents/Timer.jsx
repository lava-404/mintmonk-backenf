// src/components/Sessions/Timer.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../../styles/SessionsStyles/Timer.module.css";

const Timer = ({ initialMinutes = 25, sessionId }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    handleSessionStopped();
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    handleSessionMissed();
    setTimeLeft(initialMinutes * 60);
  };

  const getElapsedTime = () => {
    return initialMinutes * 60 - timeLeft;
  };

  const handleSessionComplete = async () => {
    try {
      const elapsed = getElapsedTime();
      await axios.put(`/api/sessions/${sessionId}`, {
        status: "completed",
        actualDuration: elapsed,
        rewards: Math.floor(elapsed / 60) * 5,
      });
    } catch (err) {
      console.error("Error completing session:", err);
    }
  };

  const handleSessionMissed = async () => {
    try {
      const elapsed = getElapsedTime();
      await axios.put(`/api/sessions/${sessionId}`, {
        status: "missed",
        actualDuration: elapsed,
        rewards: 0,
      });
    } catch (err) {
      console.error("Error marking missed session:", err);
    }
  };

  const handleSessionStopped = async () => {
    try {
      const elapsed = getElapsedTime();
      await axios.put(`/api/sessions/${sessionId}`, {
        status: "stopped",
        actualDuration: elapsed,
        rewards: Math.floor(elapsed / 60) * 5,
      });
    } catch (err) {
      console.error("Error stopping session:", err);
    }
  };

  return (
    <div className={styles.floatingTimer}>
      <h2 className={styles.timeDisplay}>{formatTime(timeLeft)}</h2>
      <div className={styles.timerControls}>
        <button
          className={`${styles.btn} ${isRunning ? styles.pauseBtn : styles.startBtn}`}
          onClick={handleStartPause}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className={`${styles.btn} ${styles.stopBtn}`}
          onClick={handleStop}
          disabled={!isRunning}
        >
          Stop
        </button>
        <button className={`${styles.btn} ${styles.resetBtn}`} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
