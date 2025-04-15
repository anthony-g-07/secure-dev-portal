// client/src/components/RequireAuth.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ use the context-based version

const RequireAuth = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Checking authorization...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <div>🚫 You do not have permission to view this page.</div>;
  }

  return children;
};

export default RequireAuth;
