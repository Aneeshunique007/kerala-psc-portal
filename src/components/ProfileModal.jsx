import React, { useState } from 'react';
import {
  QUESTION_BANK,
  ENGLISH_QUESTION_BANK,
  PYQ_QUESTION_BANK
} from '../data/questions';
import {
  TargetIcon,
  CheckIcon,
  RotateIcon,
  BookOpenIcon,
  TrashIcon,
  XIcon,
  EditIcon,
  LogOutIcon
} from './Icons';

export default function ProfileModal({
  user,
  onClose,
  onLogout,
  onResetProgress,
  onDeleteAccount,
  onUpdateUser,
  onSyncNow,
  cloudSyncStatus = 'idle'
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const stats = user.stats || { correct: 0, total: 0, streak: 0, maxStreak: 0, topicStats: {} };
  const total = stats.total || 0;
  const correct = stats.correct || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const repeatCount = user.repeatQueue?.length || 0;

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateUser({
      ...user,
      name: name.trim()
    });
    setIsEditing(false);
  };

  const handleResetConfirm = () => {
    onResetProgress(user.id);
  };

  const handleDeleteConfirm = () => {
    onDeleteAccount(user.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="profile-header-title">
            <span className="profile-avatar-large profile-avatar-initials">
              {(user.name || 'U')[0].toUpperCase()}
            </span>
            <div>
              {isEditing ? (
                <form onSubmit={handleSaveEdit} className="profile-name-edit-form">
                  <input
                    type="text"
                    className="profile-name-edit-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="profile-name-save-btn" title="Save name">✓</button>
                  <button type="button" className="profile-name-cancel-btn" onClick={() => setIsEditing(false)} title="Cancel">✕</button>
                </form>
              ) : (
                <div className="profile-name-row">
                  <h2 className="profile-name-text">{user.name}</h2>
                  <button
                    type="button"
                    className="profile-name-edit-icon-btn"
                    onClick={() => {
                      setName(user.name);
                      setIsEditing(true);
                    }}
                    title="Edit Name"
                    aria-label="Edit Name"
                  >
                    <EditIcon size={12} />
                    <span>Edit</span>
                  </button>
                </div>
              )}
              <span className="profile-exam-tag">Kerala PSC Aspirant</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginTop: '0.2rem' }}>
                Overall Progress: {correct} Solved Across All Subjects
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <XIcon size={18} />
          </button>
        </div>

        <div className="modal-body profile-modal-body">
          {/* Quick Metrics */}
          <div className="profile-metrics-grid">
            <div className="profile-metric-card">
              <span className="metric-icon"><TargetIcon size={18} /></span>
              <div className="metric-val">{total}</div>
              <div className="metric-lbl">Total Attempted</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon"><CheckIcon size={18} /></span>
              <div className="metric-val">{correct}</div>
              <div className="metric-lbl">Correct Solved</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon"><TargetIcon size={18} /></span>
              <div className="metric-val">{accuracy}%</div>
              <div className="metric-lbl">Accuracy</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon"><CheckIcon size={18} /></span>
              <div className="metric-val">{stats.maxStreak || 0}</div>
              <div className="metric-lbl">Best Streak</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon"><RotateIcon size={18} /></span>
              <div className="metric-val">{repeatCount}</div>
              <div className="metric-lbl">Review Queue</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon"><BookOpenIcon size={18} /></span>
              <div className="metric-val">{QUESTION_BANK.length + ENGLISH_QUESTION_BANK.length + PYQ_QUESTION_BANK.length}</div>
              <div className="metric-lbl">Total Question Bank</div>
            </div>
          </div>

          {/* Cloud Sync Status Card */}
          <div className="profile-cloud-sync-card">
            <div className="profile-cloud-sync-info">
              <div className="profile-cloud-sync-title">
                <span className={`profile-cloud-sync-dot ${cloudSyncStatus === 'syncing' ? 'syncing' : ''}`}></span>
                <strong>Cloud Progress Sync</strong>
                {cloudSyncStatus === 'synced' && <span className="profile-cloud-sync-badge">Synced ✓</span>}
              </div>
              <div className="profile-cloud-sync-subtitle">
                {user.email ? (
                  <>Connected to <strong>{user.email}</strong> • Cross-device sync enabled</>
                ) : (
                  'Sync bookmarks, streaks & quiz history across devices'
                )}
              </div>
            </div>
            {onSyncNow && (
              <button
                type="button"
                className="profile-cloud-sync-btn"
                onClick={onSyncNow}
                disabled={cloudSyncStatus === 'syncing'}
                title="Synchronize study progress now"
              >
                {cloudSyncStatus === 'syncing' ? (
                  <>
                    <RotateIcon size={13} className="spin-icon" />
                    <span>Syncing...</span>
                  </>
                ) : cloudSyncStatus === 'synced' ? (
                  <>
                    <CheckIcon size={13} />
                    <span>Updated ✓</span>
                  </>
                ) : (
                  <>
                    <RotateIcon size={13} />
                    <span>Sync Now</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Account Actions */}
          <div className="profile-section-title" style={{ marginTop: '1.5rem' }}>
            Account Management
          </div>

          <div className="profile-actions-grid">
            <button
              type="button"
              className="action-btn logout-btn"
              onClick={onLogout}
              title="Log out of this session"
            >
              <LogOutIcon size={15} />
              <span>Log Out</span>
            </button>
            <button
              type="button"
              className="action-btn reset-btn"
              onClick={handleResetConfirm}
              title="Reset all scores, topics, and mistake queues across all subjects"
            >
              <RotateIcon size={15} />
              <span>Reset All Progress</span>
            </button>
            <button
              type="button"
              className="action-btn delete-btn"
              onClick={handleDeleteConfirm}
              title="Permanently remove this aspirant profile and its data"
            >
              <TrashIcon size={15} />
              <span>Delete Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
