import React, { useState } from 'react';
import {
  BookOpenIcon,
  UserIcon,
  UserPlusIcon,
  RotateIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  KeyIcon
} from './Icons';

export default function AuthModal({
  users,
  onSelectUser,
  onCreateUser,
  onNeedInviteCode,
  pendingInviteCode
}) {
  const [activeTab, setActiveTab] = useState(users && users.length > 0 ? 'select' : 'create');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    // If no invite code pending and no existing users → redirect to invite gate
    if (onNeedInviteCode && !pendingInviteCode) {
      onNeedInviteCode();
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      avatar: 'U',
      createdAt: Date.now(),
      stats: {
        correct: 0,
        total: 0,
        streak: 0,
        maxStreak: 0,
        topicStats: {}
      },
      repeatQueue: [],
      upcomingRepeats: [],
      questionHistory: []
    };

    onCreateUser(newUser);
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
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

        {/* Tab switchers if users exist */}
        {users && users.length > 0 && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'select' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('select');
                setError('');
              }}
            >
              <UserIcon size={15} />
              <span>Select Profile ({users.length})</span>
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('create');
                setError('');
              }}
            >
              <UserPlusIcon size={15} />
              <span>Create New Profile</span>
            </button>
          </div>
        )}

        <div className="auth-body">
          {activeTab === 'select' && users && users.length > 0 ? (
            <div className="user-select-container">
              <p className="auth-intro-text">
                Select your profile to continue practice:
              </p>
              <div className="users-card-grid">
                {users.map((u) => {
                  const total = u.stats?.total || 0;
                  const correct = u.stats?.correct || 0;
                  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
                  const repeatCount = u.repeatQueue?.length || 0;

                  return (
                    <div
                      key={u.id}
                      className="user-profile-card"
                      onClick={() => onSelectUser(u.id)}
                    >
                      <div className="user-card-avatar user-nav-avatar-initials" style={{ width: 40, height: 40, fontSize: '0.85rem' }}>
                        {getInitials(u.name)}
                      </div>
                      <div className="user-card-info">
                        <div className="user-card-name">{u.name}</div>
                        <div className="user-card-stats">
                          <span>{total} Solved</span>
                          <span>•</span>
                          <span>{accuracy}% Accuracy</span>
                          {repeatCount > 0 && (
                            <span className="user-card-mistakes" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <RotateIcon size={12} /> {repeatCount} Review
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="user-enter-btn" title="Continue practice" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>Start</span>
                        <ArrowRightIcon size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="auth-footer-action">
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => setActiveTab('create')}
                >
                  + Create Another Account
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateSubmit} className="auth-form">
              {/* Show invite code indicator if one is pending */}
              {pendingInviteCode ? (
                <div className="auth-invite-banner">
                  <KeyIcon size={15} />
                  <span>Invite code <strong>{pendingInviteCode.code}</strong> verified ✓ — enter your name to continue</span>
                </div>
              ) : (
                <p className="auth-intro-text">
                  This is a private portal. You need an invite code to create a new profile.
                  Existing members can select their profile above.
                </p>
              )}

              {error && (
                <div className="auth-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangleIcon size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Name only */}
              {pendingInviteCode && (
                <div className="form-group">
                  <label className="form-label" htmlFor="user-name-input">
                    Your Name:
                  </label>
                  <input
                    id="user-name-input"
                    type="text"
                    className="auth-text-input"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              )}

              <div className="auth-form-actions" style={{ marginTop: '0.75rem' }}>
                {pendingInviteCode ? (
                  <button type="submit" className="auth-submit-btn">
                    Start Practicing
                  </button>
                ) : (
                  <button
                    type="button"
                    className="auth-submit-btn"
                    onClick={onNeedInviteCode}
                  >
                    Enter Invite Code
                  </button>
                )}

                {users && users.length > 0 && (
                  <button
                    type="button"
                    className="auth-cancel-btn"
                    onClick={() => setActiveTab('select')}
                  >
                    View Existing Profiles
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
