/* import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterScreen from "./pages/RegisterScreen";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomeScreen from "./pages/HomeScreen";
import NavBar from "./components/NavBar";
import WelcomeScreen from "./pages/WelcomeScreen";
import PlaylistScreen from "./pages/PlaylistScreen";
import LoginScreen from "./pages/LoginScreen";
import AdminScreen from "./pages/admin/AdminScreen";
const App = () => {
  const [welcome, setWelcome] = useState(true);

  useEffect(() => {
    const loading = setTimeout(() => setWelcome(false), 3000);
    return () => clearTimeout(loading);
  }, []);

  if (welcome) return <WelcomeScreen />;
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <NavBar />
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlist"
          element={
            <ProtectedRoute>
              <NavBar />
              <PlaylistScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
 */

/* import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterScreen from "./pages/RegisterScreen";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomeScreen from "./pages/HomeScreen";
import NavBar from "./components/NavBar";
import WelcomeScreen from "./pages/WelcomeScreen";
import PlaylistScreen from "./pages/PlaylistScreen";
import LoginScreen from "./pages/LoginScreen";
import AdminScreen from "./pages/admin/AdminScreen";

const App = () => {
  const [welcome, setWelcome] = useState(true);
const { isAuthenticated, loading } = useAuth();
  useEffect(() => {
    const loading = setTimeout(() => setWelcome(false), 3000);
    return () => clearTimeout(loading);
  }, []);

  if (welcome) return <WelcomeScreen />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <NavBar />
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlist"
          element={
            <ProtectedRoute>
              <NavBar />
              <PlaylistScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App; */

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterScreen from "./pages/RegisterScreen";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomeScreen from "./pages/HomeScreen";
import NavBar from "./components/NavBar";
import WelcomeScreen from "./pages/WelcomeScreen";
import PlaylistScreen from "./pages/PlaylistScreen";
import LoginScreen from "./pages/LoginScreen";
import AdminScreen from "./pages/admin/AdminScreen";
import SubscriptionScreen from "./pages/SubscriptionScreen";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const [welcome, setWelcome] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (welcome) return <WelcomeScreen />;
  if (loading) return <div className="bg-black vh-100"></div>;

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginScreen /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterScreen /> : <Navigate to="/" />}
        />

        {/* Rutas Protegidas usando OUTLET */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <>
                <NavBar />
                <HomeScreen />
              </>
            }
          />
          <Route
            path="/playlist"
            element={
              <>
                <NavBar />
                <PlaylistScreen />
              </>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <>
                <NavBar />
                <SubscriptionScreen />
              </>
            }
          />
        </Route>

        {/* Ruta Protegida de ADMIN usando OUTLET */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminScreen />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
