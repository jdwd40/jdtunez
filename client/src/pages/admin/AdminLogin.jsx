import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useTheme(); // ensure theme is applied on this standalone page

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login — replace with real API call
    if (email && password) {
      localStorage.setItem('jdtunez_admin', 'true');
      navigate('/admin');
    } else {
      setError('Please enter email and password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-header">
          <div className="brand-logo" style={{ width: 40, height: 40, fontSize: 14, margin: '0 auto 12px', borderRadius: 999, background: 'var(--fill)', border: '1.5px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)' }}>JD</div>
          <h1 className="hand" style={{ fontSize: '2rem', textAlign: 'center' }}>JDTunez Admin</h1>
          <p className="mute" style={{ textAlign: 'center', fontSize: '0.8125rem' }}>Sign in to manage your music</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@jdtunez.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Sign In
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background:
            radial-gradient(circle at 20% 10%, #fff 0, transparent 40%),
            radial-gradient(circle at 80% 90%, #fff 0, transparent 40%),
            var(--paper);
        }
        .login-card {
          width: 100%;
          max-width: 380px;
          padding: 2rem;
        }
        .login-header {
          margin-bottom: 1.5rem;
        }
        .login-error {
          background: var(--fill);
          border: 1px solid var(--danger);
          color: var(--danger);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8125rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
