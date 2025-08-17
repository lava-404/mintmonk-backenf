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

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(initialMinutes * 60);
    handleSessionMissed();
  };

  const handleSessionComplete = async () => {
    try {
      await axios.put(`/api/sessions/${sessionId}`, {
        status: "completed",
        actualDuration: initialMinutes * 60 - timeLeft,
        rewards: Math.floor((initialMinutes * 60 - timeLeft) / 60) * 5,
      });
    } catch (err) {
      console.error("Error completing session:", err);
    }
  };

  const handleSessionMissed = async () => {
    try {
      await axios.put(`/api/sessions/${sessionId}`, {
        status: "missed",
        actualDuration: initialMinutes * 60 - timeLeft,
        rewards: 0,
      });
    } catch (err) {
      console.error("Error marking missed session:", err);
    }
  };

  return (
    <div className={styles.timerBox}>
      <h2 className={styles.timeDisplay}>{formatTime(timeLeft)}</h2>
      <div className={styles.timerControls}>
        <button
          className={`${styles.btn} ${isRunning ? styles.pauseBtn : styles.startBtn}`}
          onClick={handleStartPause}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className={`${styles.btn} ${styles.resetBtn}`} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
