import React, { useState } from 'react';

export default function AuthModal({ users, onSelectUser, onCreateUser }) {
  const [activeTab, setActiveTab] = useState(users && users.length > 0 ? 'select' : 'create');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      avatar: '🎓',
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

  return (
    <div className="modal-overlay auth-overlay">
      <div className="modal-content auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <span className="auth-logo-icon">📚</span>
            <div>
              <h2 className="auth-title">Kerala PSC Malayalam Master</h2>
              <p className="auth-subtitle">Personal Aspirant Account & Practice Portal</p>
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
              👤 Select Profile ({users.length})
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('create');
                setError('');
              }}
            >
              ➕ Create New Profile
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
                      <div className="user-card-avatar">{u.avatar || '🎓'}</div>
                      <div className="user-card-info">
                        <div className="user-card-name">{u.name}</div>
                        <div className="user-card-stats">
                          <span>🎯 {total} Solved</span>
                          <span>⚡ {accuracy}% Accuracy</span>
                          {repeatCount > 0 && (
                            <span className="user-card-mistakes">🔁 {repeatCount} In Mistake Queue</span>
                          )}
                        </div>
                      </div>
                      <button className="user-enter-btn" title="Continue practice">
                        Start ➔
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
              <p className="auth-intro-text">
                Enter your name to start practicing. Your scores, mistake repeats, and topic mastery will be saved under your name.
              </p>

              {error && <div className="auth-error-banner">⚠️ {error}</div>}

              {/* Name only */}
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

              <div className="auth-form-actions" style={{ marginTop: '0.75rem' }}>
                <button type="submit" className="auth-submit-btn">
                  🚀 Start Practicing
                </button>

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
