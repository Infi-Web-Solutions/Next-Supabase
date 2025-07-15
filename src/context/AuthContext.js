"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState([]);
  const [isReady, setIsReady] = useState(false); 

  useEffect(() => {
  const stored = localStorage.getItem("permissions");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      setUserPermissions(parsed);
    } catch (err) {
      console.error("Failed to parse permissions from localStorage", err);
    }
  }
  setIsReady(true);
}, []);



  return (
    <AuthContext.Provider value={{ userPermissions, setUserPermissions, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
