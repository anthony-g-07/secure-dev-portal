// client/src/content/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshAuth = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user", {
        credentials: "include", // ⭐ send the HttpOnly cookie
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      setUser(data.user); // 👈 expects { user: {...} }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth(); // 👈 Check auth on load
  }, []);

  return (
    <AuthContext.Provider value={{ user, refreshAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
