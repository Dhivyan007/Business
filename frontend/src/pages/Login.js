import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target after login (default to dashboard)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate tech validation delay
    setTimeout(() => {
      const success = login(username.trim(), password.trim());
      setLoading(false);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('ACCESS DENIED: Invalid identification credentials.');
      }
    }, 800);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin');
    setError('');
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{
        backgroundColor: '#05060b',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0d1527 0%, #05060b 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2000,
        overflowY: 'auto'
      }}
    >
      <div className="w-100" style={{ maxWidth: '420px' }}>
        {/* Terminal Header Icon / Logo */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              boxShadow: '0 0 15px rgba(14, 165, 233, 0.2)'
            }}
          >
            <span className="fs-2">⚙️</span>
          </div>
          <h2 className="fw-bold text-white mb-1" style={{ letterSpacing: '1px', fontFamily: 'var(--font-family-mono)' }}>
            EXPORT CONTROL
          </h2>
          <p className="text-muted small" style={{ letterSpacing: '0.5px' }}>
            SYSTEM DESK v1.0 — SECURE COMMAND TERMINAL
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card border-0 shadow-lg text-white"
          style={{
            background: 'rgba(9, 12, 21, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="card-body p-4">
            <h5 className="card-title fw-bold text-white mb-4" style={{
              fontFamily: 'var(--font-family-mono)',
              color: 'rgb(0, 0, 0)',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              padding: '10px',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
            }}>
              🔒 Terminal Authentication
            </h5>

            {error && (
              <div
                className="alert alert-danger border-0 small mb-4 py-2 px-3 d-flex align-items-center"
                style={{
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  color: '#f43f5e',
                  borderLeft: '4px solid #f43f5e',
                  borderRadius: '6px'
                }}
                role="alert"
              >
                <span className="me-2">⚠️</span>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username field */}
              <div className="mb-3">
                <label className="form-label text-muted small" htmlFor="username">
                  OPERATOR IDENTIFICATION (USERNAME)
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control text-white border-secondary"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                  }}
                  placeholder="Enter operator username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              {/* Password field */}
              <div className="mb-4">
                <label className="form-label text-muted small" htmlFor="password">
                  SECURITY CLEARANCE KEY (PASSWORD)
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-control text-white border-secondary pe-5"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                    }}
                    placeholder="Enter security key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted px-3 py-1 shadow-none text-decoration-none"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    style={{ zIndex: 10 }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn w-100 fw-bold py-2.5 text-white d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
                  transition: 'all 0.2s ease',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    AUTHENTICATING SECURE DESK...
                  </>
                ) : (
                  'INITIALIZE SESSION'
                )}
              </button>
            </form>

            {/* Quick Access Terminal */}
            <div
              className="mt-4 pt-3 border-top border-secondary text-center"
              style={{ borderColor: 'rgba(255, 255, 255, 0.06) !important' }}
            >
              <div className="text-muted small mb-2" style={{ fontSize: '0.75rem' }}>
                DEVELOPMENT COMMAND CONSOLE QUICK-ACCESS
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-info w-100 border-0"
                style={{
                  backgroundColor: 'rgba(14, 165, 233, 0.06)',
                  color: '#0ea5e9',
                  fontSize: '0.8rem',
                  letterSpacing: '0.5px'
                }}
                onClick={handleQuickFill}
                disabled={loading}
              >
                ⚡ Auto-fill Operator (admin / admin)
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-muted mt-4" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
          SECURE PROTOCOL ENGAGED — SYSTEM DESK v1.0
        </div>
      </div>
    </div>
  );
}
