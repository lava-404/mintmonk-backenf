import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import Home from "../pages/Home";
import Sessions from "../pages/Sessions";
import StartSession from "../components/SessionsComponents/StartSession";
import Timer from "../components/SessionsComponents/Timer";
import { TimerProvider, TimerContext } from "./context/TimerContext";
import { useContext } from "react";
import Leaderboard from "../components/LeaderBoardComponents/Leaderboard";

function AppContent() {
  const { currentSession, timerVisible } = useContext(TimerContext);

  const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/auth", element: <AuthPage /> },
    { path: "/HomePage", element: <Home /> },
    { path: "/sessions", element: <Sessions /> },
    { path: "/startSession", element: <StartSession /> },
    { path: "/leaderboard", element: <Leaderboard /> },
  ]);

  return (
    <>
      {/* ✅ floating timer visible only if a session is active + toggle is on */}
      {timerVisible && currentSession && (
        <Timer
          plannedDuration={currentSession.plannedDuration}
          sessionId={currentSession._id}
        />
      )}
      <RouterProvider router={router} />
    </>
  );
}

function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}

export default App;
