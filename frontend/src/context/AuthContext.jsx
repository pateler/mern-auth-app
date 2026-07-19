/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define verifyToken BEFORE using it in useEffect
  const verifyToken = useCallback(async () => {
    try {
      const response = await authService.getMe();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (err) {
      // Token invalid
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        // Initialize state from localStorage
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Verify token is still valid - this will update user if token is invalid
        verifyToken();
      } catch (err) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [verifyToken]); // Add verifyToken to dependencies

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.login({ email, password });

      if (response.success) {
        const { token, data } = response;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setLoading(false);
        return { success: true, data };
      } else {
        setError(response.message || "Login failed");
        setLoading(false);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "An error occurred during login";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.register({ name, email, password });

      if (response.success) {
        const { token, data } = response;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setLoading(false);
        return { success: true, data };
      } else {
        setError(response.message || "Registration failed");
        setLoading(false);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "An error occurred during registration";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
