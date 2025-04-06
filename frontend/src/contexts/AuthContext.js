// /src/contexts/AuthContext.js
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Email-based login
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      setUser(data); // data should include user.id, user.name, etc.
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // epunjabid-based login
  const loginWithEPunjab = async (epunjabid, password) => {
    try {
      const response = await fetch("http://localhost:8081/api/users/login/epunjab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epunjabid, password }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      setUser(data); // data should include user.id, user.name, etc.
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error (epunjab):", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setUser, login, loginWithEPunjab, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
