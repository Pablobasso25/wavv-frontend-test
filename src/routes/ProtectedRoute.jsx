import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="bg-black vh-100 text-white d-flex align-items-center justify-content-center"><h1>Cargando...</h1></div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
