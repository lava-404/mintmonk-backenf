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

function AppContent() {
  const { currentSession } = useContext(TimerContext);

  const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/auth", element: <AuthPage /> },
    { path: "/HomePage", element: <Home /> },
    { path: "/sessions", element: <Sessions /> },
    { path: "/startSession", element: <StartSession /> },
    { path: "/timer", element: <Timer /> },
  ]);

  return (
    <>
      {currentSession && (
        <Timer
          initialMinutes={currentSession.duration / 60}
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
