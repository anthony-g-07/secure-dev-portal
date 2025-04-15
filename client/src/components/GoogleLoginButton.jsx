// client/src/components/GoogleLoginButton.jsx
const GoogleLoginButton = () => {
  const handleRedirectLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button
      onClick={handleRedirectLogin}
      className="bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-lg shadow hover:shadow-md transition"
    >
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
