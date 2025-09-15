// src/components/SessionsComponents/Timer.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import styles from "../../styles/SessionsStyles/Timer.module.css";
import { TimerContext } from "../../src/context/TimerContext";

const Timer = ({ plannedDuration, sessionId }) => {
  // plannedDuration comes in SECONDS
  const [timeLeft, setTimeLeft] = useState(Number(plannedDuration || 0));
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const { currentSession, bumpSessionsVersion } = useContext(TimerContext);

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

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    handleSessionCompleted();
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    handleSessionAborted();
    setTimeLeft(Number(plannedDuration)); // reset to raw seconds
  };

  const getElapsedTime = () => Number(plannedDuration) - timeLeft;

  const handleSessionComplete = async () => {
    try {
      const elapsed = getElapsedTime();
      const stake = Number(currentSession?.stake || 0);
      const rewards = stake * 2; // for now, double stake
      await axios.put(`http://localhost:5667/sessions/${sessionId}`, {
        status: "completed",
        focusedTime: elapsed,
        rewards,
      });
      bumpSessionsVersion();
      if (rewards > 0) alert(`Session completed! You earned ${rewards} coins.`);
    } catch (err) {
      console.error("Error completing session:", err);
    }
  };

  const handleSessionAborted = async () => {
    try {
      const elapsed = getElapsedTime();
      await axios.put(`http://localhost:5667/sessions/${sessionId}`, {
        status: "aborted",
        focusedTime: elapsed,
        rewards: 0,
      });
      bumpSessionsVersion();
    } catch (err) {
      console.error("Error marking aborted session:", err);
    }
  };

  const handleSessionCompleted = async () => {
    try {
      const elapsed = getElapsedTime();
      const stake = Number(currentSession?.stake || 0);
      const rewards = stake * 2;
      await axios.put(`http://localhost:5667/sessions/${sessionId}`, {
        status: "completed",
        focusedTime: elapsed,
        rewards,
      });
      bumpSessionsVersion();
      if (rewards > 0) alert(`Session completed! You earned ${rewards} coins.`);
    } catch (err) {
      console.error("Error completing session:", err);
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
