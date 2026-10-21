import React, { useState } from 'react';
import { validateInviteCode } from '../utils/adminAuth';
import { LockIcon, KeyIcon, AlertTriangleIcon } from './Icons';

export default function InviteGate({ onValidCode }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter an invite code');
      triggerShake();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = validateInviteCode(code);
      if (found) {
        setError('');
        onValidCode(found);
      } else {
        setError('Invalid or expired invite code. Contact the admin for access.');
        triggerShake();
      }
      setLoading(false);
    }, 500);
  };

  const formatInput = (val) => {
    // Auto-insert dash after 4 chars
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    if (clean.length > 4) return clean.slice(0, 4) + '-' + clean.slice(4);
    return clean;
  };

  return (
    <div className="invite-gate-overlay">
      <div className={`invite-gate-card ${shake ? 'shake' : ''}`}>
        {/* Logo + Branding */}
        <div className="invite-gate-header">
          <div className="invite-gate-lock-ring">
            <LockIcon size={28} />
          </div>
          <h1 className="invite-gate-title">Kerala PSC Practice Portal</h1>
          <p className="invite-gate-subtitle">
            This is a private study platform. Enter your invite code to get access.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="invite-gate-form">
          <div className="invite-gate-input-wrap">
            <KeyIcon size={18} className="invite-gate-input-icon" />
            <input
              id="invite-code-input"
              type="text"
              className="invite-gate-input"
              placeholder="XXXX-XXXX"
              value={code}
              onChange={(e) => {
                setCode(formatInput(e.target.value));
                setError('');
              }}
              maxLength={9}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {error && (
            <div className="invite-gate-error">
              <AlertTriangleIcon size={15} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="invite-gate-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="invite-gate-spinner" />
            ) : (
              'Unlock Access'
            )}
          </button>
        </form>

        <p className="invite-gate-footer">
          Don't have a code? Contact your study group admin.
        </p>
      </div>
    </div>
  );
}
