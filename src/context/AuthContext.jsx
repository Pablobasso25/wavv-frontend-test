import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loginRequest,
  registerRequest,
  verifyTokenRequest,
  logoutRequest,
} from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const checkPermission = (action, currentCount) => {
    if (!user) return false;
    if (user.subscription === "premium") return true;

    if (action === "add_to_playlist" && currentCount >= 5) {
      // Aquí va el Toast o Modal de "Pasate a Premium"
      return false;
    }
    if (action === "skip_song" && currentCount >= 3) {
      return false;
    }
    return true;
  };

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      setErrors(error.response.data);
      throw error;
    }
  };

  const login = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error) {
      const errorData = error.response?.data;

      if (Array.isArray(errorData)) {
        setErrors(errorData);
      } else if (errorData?.message) {
        setErrors([errorData.message]);
      } else {
        setErrors(["Error de conexión con el servidor"]);
      }
    }
  };

  const logout = async () => {
    await logoutRequest();
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }
      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        logout,
        user,
        isAuthenticated,
        errors,
        loading,
        checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// CODIGO VIEJO ///

/* import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultAdmin, defaultUsers, defaultSongs } from "../data/dataDefault";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    const storedSongs = JSON.parse(localStorage.getItem("songs"));

    if (!storedUsers)
      localStorage.setItem(
        "users",
        JSON.stringify([defaultAdmin, ...defaultUsers])
      );

    if (!storedSongs)
      localStorage.setItem("songs", JSON.stringify(defaultSongs));

    if (storedUser) setUser(storedUser);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
 */
