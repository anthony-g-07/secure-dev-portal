// client/src/utils/fetchWithAuth.js
import { toast } from "react-toastify";
import { getCsrfToken } from "./csrf";

export async function fetchWithAuth(url, options = {}, refreshAuth) {
  try {
    const isMutating = ["POST", "PUT", "DELETE"].includes(options.method);

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // 🛡 Add CSRF token for mutating requests
    if (isMutating) {
      const csrfToken = await getCsrfToken();
      headers["X-CSRF-Token"] = csrfToken;
    }

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

    // If not authenticated, optionally refresh or force logout
    if (
      (res.status === 401 || res.status === 403) &&
      typeof refreshAuth === "function"
    ) {
      const data = await res.json().catch(() => ({}));

      if (data.message === "Token expired") {
        await refreshAuth();
        localStorage.setItem("sessionExpired", "1");

        setTimeout(() => {
          window.location.href = "/";
        }, 100);
        return; // Don't return data here
      } else {
        await refreshAuth();
      }

      // Optionally return null to prevent downstream usage
      return null;
    }

    // ✅ Always return parsed JSON
    return await res.json();
  } catch (err) {
    console.error("❌ Network error:", err);
    toast.error("❌ Network error. Please try again.");
    throw err;
  }
}
