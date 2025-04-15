// client/src/pages/Logs.jsx
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshAuth } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await fetchWithAuth(
          "http://localhost:5000/api/logs",
          {},
          refreshAuth
        );
        if (data) {
          setLogs(data);
        }
      } catch (err) {
        console.error("Failed to load logs:", err);
        toast.error("❌ Failed to load audit logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [refreshAuth]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-6">Loading audit logs...</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">📜 Audit Logs</h2>

      {logs.length === 0 ? (
        <p className="text-gray-500">No logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                  User
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                  Action
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                  Resource
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                  Metadata
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    {log.user_name} ({log.user_email})
                  </td>
                  <td className="py-3 px-4">{log.action}</td>
                  <td className="py-3 px-4">{log.resource || "-"}</td>
                  <td className="py-3 px-4">
                    <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Logs;
