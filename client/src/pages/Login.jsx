// client/src/pages/Login.jsx
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toastShownRef = useRef(false); // 👈 add this

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    const sessionExpired = localStorage.getItem("sessionExpired");

    if (sessionExpired && !toastShownRef.current) {
      toastShownRef.current = true; // ✅ ensure it only runs once
      // ✅ Delay toast to allow ToastContainer to mount
      setTimeout(() => {
        toast.error("🔐 Session expired. Please log in again.");
      }, 100);
      localStorage.removeItem("sessionExpired");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🔐 Secure Developer Portal
        </h1>
        <p className="text-gray-600 mb-6">
          Please sign in to access your dashboard.
        </p>
        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default Login;
