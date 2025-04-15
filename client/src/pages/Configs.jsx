// client/src/pages/Configs.jsx
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ConfigsPage = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const { refreshAuth } = useAuth();

  const startEditing = (config) => {
    setEditingId(config.id);
    const content =
      typeof config.content === "string"
        ? JSON.parse(config.content)
        : config.content;
    setEditContent(JSON.stringify(content, null, 2));
  };

  const saveChanges = async (id) => {
    try {
      const result = await fetchWithAuth(
        `http://localhost:5000/api/configs/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: JSON.parse(editContent) }),
        },
        refreshAuth
      );

      if (!result || result.message !== "Config updated successfully") {
        throw new Error("Save failed");
      }

      setEditingId(null);
      toast.success("✅ Config saved!");
      setConfigs((prev) =>
        prev.map((cfg) =>
          cfg.id === id
            ? {
                ...cfg,
                content: editContent,
                updated_at: new Date().toISOString(),
              }
            : cfg
        )
      );
    } catch (err) {
      console.error("Failed to save:", err);
      toast.error("❌ Failed to save config. Please try again.");
    }
  };

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const data = await fetchWithAuth(
          "http://localhost:5000/api/configs",
          {},
          refreshAuth
        );
        if (data) {
          setConfigs(data);
        }
      } catch (err) {
        console.error("Failed to load configs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [refreshAuth]);

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading configs...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        🛠 Configurations
      </h2>

      {configs.length === 0 ? (
        <p className="text-gray-500">No configs found.</p>
      ) : (
        <ul className="space-y-8">
          {configs.map((config) => (
            <li key={config.id} className="bg-white shadow p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {config.title}
              </h3>

              {editingId === config.id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={10}
                    className="w-full p-3 border rounded font-mono bg-gray-50"
                  />
                  <div className="mt-3">
                    <button
                      onClick={() => saveChanges(config.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="ml-3 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                    {typeof config.content === "string"
                      ? JSON.stringify(JSON.parse(config.content), null, 2)
                      : JSON.stringify(config.content, null, 2)}
                  </pre>
                  <button
                    onClick={() => startEditing(config)}
                    className="mt-2 text-indigo-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                </>
              )}

              <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(config.updated_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConfigsPage;
