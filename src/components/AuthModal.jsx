import React, { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  UserIcon,
  UserPlusIcon,
  RotateIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  CheckIcon,
  LockIcon
} from './Icons';
import { registerUser, loginUser, checkUserStatus } from '../utils/supabaseClient';

export default function AuthModal({
  users,
  onSelectUser,
  onUserAuthenticated,
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'pending_notice'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingInfo, setPendingInfo] = useState(null);
  const [statusChecking, setStatusChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Check saved pending email from localStorage on mount
  useEffect(() => {
    const savedPendingEmail = localStorage.getItem('psc_pending_verification_email');
    const savedPendingName = localStorage.getItem('psc_pending_verification_name');
    if (savedPendingEmail) {
      setPendingInfo({ email: savedPendingEmail, name: savedPendingName || 'Aspirant' });
      setMode('pending_notice');
    }
  }, []);

  // Handle User Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({ name, email, password });
      setLoading(false);

      if (!res.success) {
        if (res.alreadyExists && res.status === 'pending') {
          setPendingInfo({ email: email.trim().toLowerCase(), name: name.trim() });
          localStorage.setItem('psc_pending_verification_email', email.trim().toLowerCase());
          localStorage.setItem('psc_pending_verification_name', name.trim());
          setMode('pending_notice');
          return;
        }
        setError(res.message || res.error || 'Failed to submit registration request');
        return;
      }

      // Success! Request submitted for admin verification
      setPendingInfo({ email: email.trim().toLowerCase(), name: name.trim() });
      localStorage.setItem('psc_pending_verification_email', email.trim().toLowerCase());
      localStorage.setItem('psc_pending_verification_name', name.trim());
      setMode('pending_notice');
    } catch (err) {
      setLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  // Handle User Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter your registered email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      setLoading(false);

      if (!res.success) {
        if (res.isPending) {
          setPendingInfo({ email: email.trim().toLowerCase(), name: res.user?.name || 'Aspirant' });
          localStorage.setItem('psc_pending_verification_email', email.trim().toLowerCase());
          setMode('pending_notice');
          return;
        }
        setError(res.error || 'Login failed. Please check your credentials.');
        return;
      }

      // Approved & Logged In!
      localStorage.removeItem('psc_pending_verification_email');
      localStorage.removeItem('psc_pending_verification_name');
      onUserAuthenticated(res.user);
    } catch (err) {
      setLoading(false);
      setError('Could not verify credentials. Please try again.');
    }
  };

  // Check if admin has approved the pending account
  const handleCheckStatus = async () => {
    if (!pendingInfo?.email) return;
    setStatusChecking(true);
    setStatusMessage('');

    try {
      const user = await checkUserStatus(pendingInfo.email);
      setStatusChecking(false);

      if (!user) {
        setStatusMessage('No account found for this email.');
        return;
      }

      if (user.status === 'approved') {
        setStatusMessage('🎉 Great news! Your account has been approved.');
        setTimeout(() => {
          localStorage.removeItem('psc_pending_verification_email');
          localStorage.removeItem('psc_pending_verification_name');
          onUserAuthenticated(user);
        }, 1200);
      } else if (user.status === 'rejected') {
        setStatusMessage('❌ Your account request was declined by the administrator.');
      } else {
        setStatusMessage('⏳ Still under verification. The admin will review it soon.');
      }
    } catch (err) {
      setStatusChecking(false);
      setStatusMessage('Could not connect to verify status. Please check your internet connection.');
    }
  };

  return (
    <div className="modal-overlay auth-overlay">
      <div className="modal-content auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <span className="auth-logo-icon"><BookOpenIcon size={24} /></span>
            <div>
              <h2 className="auth-title">Kerala PSC Aspirant Portal</h2>
              <p className="auth-subtitle">Official Syllabus Practice &amp; Analytics</p>
            </div>
          </div>
        </div>

        {/* ── MODE: PENDING VERIFICATION NOTICE ── */}
        {mode === 'pending_notice' && (
          <div className="verification-notice-card">
            <div className="verification-icon-pulse">
              <span className="verification-emoji">⏳</span>
            </div>

            <h3 className="verification-heading">Account Under Verification</h3>
            <p className="verification-subtext">
              Hi <strong>{pendingInfo?.name || 'Aspirant'}</strong>, your request for{' '}
              <span className="verification-email-badge">{pendingInfo?.email}</span> has been submitted to the administrator.
            </p>

            <div className="verification-info-banner">
              <div className="verification-banner-step">
                <span className="step-num">1</span>
                <div>
                  <strong>Request Submitted</strong>
                  <p>Your details were sent to the admin portal.</p>
                </div>
              </div>
              <div className="verification-banner-step active">
                <span className="step-num">2</span>
                <div>
                  <strong>Admin Review in Progress</strong>
                  <p>The admin will review and approve your profile.</p>
                </div>
              </div>
              <div className="verification-banner-step">
                <span className="step-num">3</span>
                <div>
                  <strong>Instant Access</strong>
                  <p>Once approved, you can access all PSC exam tests.</p>
                </div>
              </div>
            </div>

            {statusMessage && (
              <div className={`verification-status-result ${statusMessage.includes('approved') ? 'approved' : statusMessage.includes('declined') ? 'rejected' : 'waiting'}`}>
                {statusMessage}
              </div>
            )}

            <div className="verification-action-buttons">
              <button
                type="button"
                className="btn-check-verification"
                onClick={handleCheckStatus}
                disabled={statusChecking}
              >
                <RotateIcon size={16} className={statusChecking ? 'spinning' : ''} />
                <span>{statusChecking ? 'Checking...' : 'Check Approval Status'}</span>
              </button>

              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setError('');
                  setStatusMessage('');
                  setMode('login');
                }}
              >
                Already approved? Sign in with password →
              </button>
            </div>
          </div>
        )}

        {/* ── MODE: LOGIN OR SIGN UP ── */}
        {mode !== 'pending_notice' && (
          <>
            {/* Tabs */}
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                <UserIcon size={15} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
              >
                <UserPlusIcon size={15} />
                <span>Request Access (Sign Up)</span>
              </button>
            </div>

            {error && (
              <div className="auth-error-msg" role="alert">
                <AlertTriangleIcon size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="user-login-email">
                    Email Address
                  </label>
                  <input
                    id="user-login-email"
                    type="email"
                    className="auth-text-input"
                    placeholder="e.g. rahul@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="user-login-pass">
                    Password
                  </label>
                  <input
                    id="user-login-pass"
                    type="password"
                    className="auth-text-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In &amp; Practice</span>
                      <ArrowRightIcon size={16} />
                    </>
                  )}
                </button>

                <div className="auth-footer-prompt">
                  <span>New aspirant?</span>
                  <button
                    type="button"
                    className="auth-link-text-btn"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                    }}
                  >
                    Send registration for verification →
                  </button>
                </div>
              </form>
            )}

            {/* SIGN UP / REQUEST ACCESS FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleRegister} className="auth-form">
                <div className="auth-verification-callout">
                  <span className="callout-icon">🛡️</span>
                  <div>
                    <strong>Admin Verification Required</strong>
                    <p>New profiles require admin approval before portal access is unlocked.</p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-name">
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    className="auth-text-input"
                    placeholder="e.g. Anjali Nair"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-email">
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    className="auth-text-input"
                    placeholder="e.g. anjali@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">
                    Create Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    className="auth-text-input"
                    placeholder="Minimum 4 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Submit for Verification</span>
                      <ArrowRightIcon size={16} />
                    </>
                  )}
                </button>

                <div className="auth-footer-prompt">
                  <span>Already sent a request?</span>
                  <button
                    type="button"
                    className="auth-link-text-btn"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                  >
                    Log In / Check Status →
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
