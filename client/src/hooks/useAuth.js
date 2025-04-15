import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

let globalAuthRefresh = () => {}; // 👈 expose a global refresh hook

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ add this
  const [version, setVersion] = useState(0); // ⬅️ force trigger

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser({ ...decoded, token });
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  }, [version]);

  // Set global refresh function
  globalAuthRefresh = () => setVersion((v) => v + 1);

  return { user, loading };
};

// Utility to trigger logout from anywhere
export const refreshAuth = () => {
    globalAuthRefresh();
  };