import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Mientras se verifica el token en el backend, mostramos un spinner o nada
  if (loading) return <h1>Cargando...</h1>;

  // Si no está autenticado y terminó de cargar
  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />;

  // Si es una ruta de admin y el usuario no tiene ese rol
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;

  // Si todo está bien, renderiza los hijos (NavBar, Home, etc.)
  return <Outlet />;
};

export default ProtectedRoute;
