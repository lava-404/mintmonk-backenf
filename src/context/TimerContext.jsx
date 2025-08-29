// src/context/TimerContext.jsx
import { createContext, useState } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null); // stores active session data

  return (
    <TimerContext.Provider value={{ currentSession, setCurrentSession }}>
      {children}
    </TimerContext.Provider>
  );
};
