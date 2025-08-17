import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import Home from "../pages/Home";
import Sessions from "../pages/Sessions";
import StartSession from "../components/SessionsComponents/StartSession";
import Timer from "../components/SessionsComponents/Timer";

function App() {
  // Define routes for your app
  const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/auth", element: <AuthPage /> },
    { path: "/HomePage", element: <Home /> },
    { path: "/sessions", element: <Sessions /> },
    { path: "/startSession", element: <StartSession /> },
    {path: "/timer", element: <Timer />}
  ]);

  return <RouterProvider router={router} />;
}

export default App;
