import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  UserPlusIcon,
  RotateIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  CheckIcon,
  ShieldIcon
} from './Icons';
import { registerUser, loginUser, checkUserStatus } from '../utils/supabaseClient';
import { ADMIN_USERNAME, ADMIN_PASSWORD, adminLogin } from '../utils/adminAuth';

export default function AuthModal({
  users = [],
  onSelectUser,
  onUserAuthenticated,
  onAdminAuthenticated,
}) {
  const [mode, setMode] = useState(users.length > 0 ? 'profiles' : 'login'); // 'profiles' | 'login' | 'signup' | 'pending_notice'
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

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if Administrator is logging in
    if (
      cleanEmail === ADMIN_USERNAME.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      adminLogin(ADMIN_USERNAME, ADMIN_PASSWORD);
      if (onAdminAuthenticated) {
        onAdminAuthenticated();
      }
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email: cleanEmail, password });
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
        setStatusMessage('🎉 Great news! Your account has been approved by admin.');
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
      setStatusMessage('Connection error. Please check your internet connection.');
    }
  };

  return (
    <div className="modal-overlay auth-overlay">
      <div className="auth-portal-card" onClick={(e) => e.stopPropagation()}>
        {/* Glow backdrop effects */}
        <div className="auth-card-glow top-gold"></div>
        <div className="auth-card-glow bottom-cyan"></div>

        {/* Brand Header with Circular Kerala PSC Gold Logo */}
        <div className="auth-portal-header">
          <div className="auth-emblem-wrap">
            <img
              src="/kerala-psc-logo.jpg"
              alt="Kerala PSC Official Emblem"
              className="auth-emblem-img"
            />
            <div className="auth-emblem-ring"></div>
          </div>

          <h2 className="auth-portal-title">Kerala PSC Aspirant Portal</h2>
          <p className="auth-portal-subtitle">Official Syllabus Practice &amp; Real-time Analytics</p>

          <div className="auth-pill-badges">
            <span className="auth-badge-pill gold">മലയാളം (10 Marks)</span>
            <span className="auth-badge-pill cyan">General English (10 Marks)</span>
            <span className="auth-badge-pill green">PYQs 2020–2026</span>
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
                  <p>Your details were saved in the cloud registry.</p>
                </div>
              </div>
              <div className="verification-banner-step active">
                <span className="step-num">2</span>
                <div>
                  <strong>Admin Verification in Progress</strong>
                  <p>The admin will review and approve your account.</p>
                </div>
              </div>
              <div className="verification-banner-step">
                <span className="step-num">3</span>
                <div>
                  <strong>Instant Unlocking</strong>
                  <p>Once approved, you can practice 18,480+ questions.</p>
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
                <span>{statusChecking ? 'Checking Live Database...' : 'Check Approval Status'}</span>
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

        {/* ── MODE: TABS (PROFILES / LOGIN / SIGN UP) ── */}
        {mode !== 'pending_notice' && (
          <>
            {/* Navigation Tabs */}
            <div className="auth-portal-tabs">
              {users.length > 0 && (
                <button
                  type="button"
                  className={`auth-portal-tab-btn ${mode === 'profiles' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('profiles');
                    setError('');
                  }}
                >
                  <UserIcon size={15} />
                  <span>Profiles ({users.length})</span>
                </button>
              )}
              <button
                type="button"
                className={`auth-portal-tab-btn ${mode === 'login' ? 'active' : ''}`}
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
                className={`auth-portal-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
              >
                <UserPlusIcon size={15} />
                <span>Request Access</span>
              </button>
            </div>

            {error && (
              <div className="auth-error-msg" role="alert">
                <AlertTriangleIcon size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* TAB: SELECT SAVED PROFILE */}
            {mode === 'profiles' && users.length > 0 && (
              <div className="auth-profiles-view">
                <p className="auth-section-desc">Select an active profile on this device to continue practice:</p>
                <div className="auth-profiles-grid">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      className="auth-profile-tile"
                      onClick={() => onSelectUser(u.id)}
                    >
                      <div className="auth-profile-tile-avatar">
                        {(u.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="auth-profile-tile-details">
                        <span className="auth-profile-tile-name">{u.name}</span>
                        <span className="auth-profile-tile-stats">
                          {u.stats?.total || 0} solved · {u.stats?.streak || 0} streak
                        </span>
                      </div>
                      <ArrowRightIcon size={16} className="tile-arrow" />
                    </button>
                  ))}
                </div>

                <div className="auth-footer-prompt">
                  <span>Sign in to a different account?</span>
                  <button
                    type="button"
                    className="auth-link-text-btn"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                  >
                    Go to Sign In →
                  </button>
                </div>
              </div>
            )}

            {/* TAB: SIGN IN */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="auth-portal-form">
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="portal-login-email">
                    Email Address
                  </label>
                  <div className="auth-input-field-wrap">
                    <input
                      id="portal-login-email"
                      type="email"
                      className="auth-portal-input"
                      placeholder="e.g. yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="portal-login-pass">
                    Password
                  </label>
                  <div className="auth-input-field-wrap">
                    <input
                      id="portal-login-pass"
                      type="password"
                      className="auth-portal-input"
                      placeholder="Enter your account password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-portal-primary-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-flex-center">
                      <RotateIcon size={16} className="spinning" /> Signing In...
                    </span>
                  ) : (
                    <span className="btn-flex-center">
                      <span>Sign In &amp; Start Practice</span>
                      <ArrowRightIcon size={16} />
                    </span>
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
                    Request access from admin →
                  </button>
                </div>
              </form>
            )}

            {/* TAB: SIGN UP / REQUEST ACCESS */}
            {mode === 'signup' && (
              <form onSubmit={handleRegister} className="auth-portal-form">
                <div className="auth-verification-callout">
                  <span className="callout-icon">🛡️</span>
                  <div>
                    <strong>Admin Verification Required</strong>
                    <p>New profiles require administrator approval before questions are unlocked.</p>
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="portal-signup-name">
                    Full Name
                  </label>
                  <input
                    id="portal-signup-name"
                    type="text"
                    className="auth-portal-input"
                    placeholder="e.g. Anjali Nair"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="portal-signup-email">
                    Email Address
                  </label>
                  <input
                    id="portal-signup-email"
                    type="email"
                    className="auth-portal-input"
                    placeholder="e.g. anjali@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="portal-signup-pass">
                    Create Password
                  </label>
                  <input
                    id="portal-signup-pass"
                    type="password"
                    className="auth-portal-input"
                    placeholder="At least 4 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="auth-portal-primary-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-flex-center">
                      <RotateIcon size={16} className="spinning" /> Submitting Request...
                    </span>
                  ) : (
                    <span className="btn-flex-center">
                      <span>Submit for Verification</span>
                      <ArrowRightIcon size={16} />
                    </span>
                  )}
                </button>

                <div className="auth-footer-prompt">
                  <span>Already requested access?</span>
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

        {/* Subtle Admin shortcut at bottom of card */}
        <div className="auth-card-admin-row">
          <button
            type="button"
            className="auth-card-admin-btn"
            onClick={() => {
              if (onAdminAuthenticated) {
                onAdminAuthenticated();
              }
            }}
            title="Administrator Access & Approvals"
          >
            <ShieldIcon size={12} />
            <span>Administrator Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
