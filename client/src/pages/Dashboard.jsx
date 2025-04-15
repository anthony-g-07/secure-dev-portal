// client/src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center text-gray-600 mt-8">Loading your dashboard...</p>;

  if (!user) return <p className="text-center text-red-500 mt-8">🚫 You are not logged in.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-indigo-700 mb-4">
        Welcome back, {user.name} 👋
      </h2>
      <p className="text-lg text-gray-700 mb-2">
        You are logged in as: <span className="font-semibold">{user.role}</span>
      </p>
      <p className="text-gray-600 mb-6">
        This is your personalized dashboard. Use the navbar to navigate.
      </p>

      {user.role === "admin" && (
        <p className="bg-red-100 text-red-800 px-4 py-2 rounded">
          🛡 As an <strong>admin</strong>, you can manage users and view audit logs.
        </p>
      )}

      {user.role === "developer" && (
        <p className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
          🛠 As a <strong>developer</strong>, you can manage configuration settings.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
