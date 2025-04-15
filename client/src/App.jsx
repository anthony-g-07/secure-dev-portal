// client/src/App.jsx
import { Routes, Route } from "react-router-dom"; // ⬅️ Just Routes & Route
import Dashboard from "./pages/Dashboard";
import Configs from "./pages/Configs";
import Logs from "./pages/Logs";
import UsersPage from "./pages/UsersPage";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/configs"
          element={
            <RequireAuth roles={["developer", "admin"]}>
              <Configs />
            </RequireAuth>
          }
        />

        <Route
          path="/logs"
          element={
            <RequireAuth roles={["admin"]}>
              <Logs />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RequireAuth roles={["admin"]}>
              <UsersPage />
            </RequireAuth>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}

export default App;
