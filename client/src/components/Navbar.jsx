// client/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, refreshAuth, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // ⭐ include the cookie
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    // Clear user state and redirect
    refreshAuth(); // This will set user to null
    navigate("/", { replace: true });
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold text-indigo-700">
        🔐 Secure Portal
      </div>

      <div className="space-x-4">
        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
          Dashboard
        </Link>
        {["developer", "admin"].includes(user.role) && (
          <Link to="/configs" className="text-gray-700 hover:text-indigo-600">
            Configs
          </Link>
        )}
        {user.role === "admin" && (
          <>
            <Link to="/logs" className="text-gray-700 hover:text-indigo-600">
              Logs
            </Link>
            <Link
              to="/admin/users"
              className="text-gray-700 hover:text-indigo-600"
            >
              Users
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>
          {user.name} ({user.role})
        </span>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
