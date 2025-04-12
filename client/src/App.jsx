import { useState } from 'react';
import GoogleLoginButton from './components/GoogleLoginButton';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <h1>Secure Developer Portal</h1>

      {!user ? (
        <GoogleLoginButton onLogin={({ user, token }) => {
          setUser(user);
          localStorage.setItem('token', token);
        }} />
      ) : (
        <div>
          <p>✅ Logged in as {user.name} ({user.role})</p>
          <button onClick={() => {
            setUser(null);
            localStorage.removeItem('token');
          }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
