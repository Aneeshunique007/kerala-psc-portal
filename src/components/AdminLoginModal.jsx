import React, { useState } from 'react';
import { adminLogin } from '../utils/adminAuth';
import { XIcon, AlertTriangleIcon } from './Icons';

export default function AdminLoginModal({ onSuccess, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = adminLogin(username.trim(), password);
      if (ok) {
        onSuccess();
      } else {
        setError('Incorrect credentials.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="modal-overlay admin-login-overlay" onClick={onClose}>
      <div
        className="admin-login-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-login-header">
          <span className="admin-login-icon">⚙</span>
          <div>
            <h2 className="admin-login-title">Admin Access</h2>
            <p className="admin-login-sub">Sign in with your admin credentials</p>
          </div>
          <button className="admin-close-btn" onClick={onClose}>
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="admin-username">Email</label>
            <input
              id="admin-username"
              className="auth-text-input"
              type="email"
              placeholder="Enter admin email"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              autoFocus
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              className="auth-text-input"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="auth-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangleIcon size={15} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
