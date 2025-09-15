import React, { createContext, useState, useContext } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [timerVisible, setTimerVisible] = useState(false);
  const [sessionsVersion, setSessionsVersion] = useState(0);

  const bumpSessionsVersion = () => setSessionsVersion((v) => v + 1);

  return (
    <TimerContext.Provider
      value={{
        currentSession,
        setCurrentSession,
        timerVisible,
        setTimerVisible,
        sessionsVersion,
        bumpSessionsVersion,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

// ✅ Add this
export const useTimer = () => useContext(TimerContext);
