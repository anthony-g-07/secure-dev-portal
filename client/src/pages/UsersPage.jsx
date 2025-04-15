// client/src/pages/UsersPage.jsx
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ROLES = ["viewer", "developer", "admin"];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const { user, refreshAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const currentUserId = user?.id;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth(
        "http://localhost:5000/api/users",
        {},
        refreshAuth
      );
      if (data) {
        setUsers(data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      const result = await fetchWithAuth(
        `http://localhost:5000/api/users/${id}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newRole }),
        },
        refreshAuth
      );

      if (result?.message === "Role updated") {
        toast.success("✅ Role updated successfully!");
        fetchUsers();
      } else {
        toast.error(result?.message || "❌ Failed to update role.");
      }
    } catch (err) {
      console.error("❌ Role update error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshAuth]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Loading users...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        👥 User Management
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">
                Email
              </th>
              <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">
                Role
              </th>
              <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">
                Change Role
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => (
              <tr key={userItem.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{userItem.name}</td>
                <td className="py-3 px-4">{userItem.email}</td>
                <td className="py-3 px-4 capitalize">{userItem.role}</td>
                <td className="py-3 px-4">
                  <select
                    value={userItem.role}
                    disabled={userItem.id === currentUserId}
                    onChange={(e) => updateRole(userItem.id, e.target.value)}
                    className={`px-3 py-1 border rounded ${
                      userItem.id === currentUserId
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-white hover:border-indigo-500"
                    }`}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
