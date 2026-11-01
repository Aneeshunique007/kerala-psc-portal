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
  onRestoreFromCloud,
  cloudSyncStatus,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [restoring, setRestoring] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState('');

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

  const handleRestoreFromCloud = async () => {
    if (!onRestoreFromCloud) return;
    setRestoring(true);
    setRestoreMsg('');
    try {
      await onRestoreFromCloud();
      setRestoreMsg('✅ Progress restored from cloud!');
    } catch {
      setRestoreMsg('❌ Restore failed. Check your connection.');
    }
    setRestoring(false);
    setTimeout(() => setRestoreMsg(''), 4000);
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
              <span className="profile-exam-tag">{user.isAdmin ? 'System Administrator' : 'Authorized Candidate'}</span>
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
              <div className="metric-val">{user.learnedQuestions?.length || 0}</div>
              <div className="metric-lbl">Questions Learned</div>
            </div>
          </div>

          {/* Cloud Sync Status + Restore */}
          <div style={{ margin: '1rem 0 0.5rem', padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                {cloudSyncStatus === 'syncing' && <span>☁️ Syncing with cloud…</span>}
                {cloudSyncStatus === 'synced' && <span style={{ color: '#4ade80' }}>☁️ All progress synced ✓</span>}
                {cloudSyncStatus === 'idle' && <span>☁️ Progress saved to cloud</span>}
              </div>
              <button
                type="button"
                onClick={handleRestoreFromCloud}
                disabled={restoring}
                style={{
                  background: restoring ? '#334155' : 'rgba(99,102,241,0.2)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  color: '#a5b4fc',
                  borderRadius: '6px',
                  padding: '0.3rem 0.7rem',
                  fontSize: '0.78rem',
                  cursor: restoring ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
                title="Fetch latest progress from cloud (use if data seems missing)"
              >
                {restoring ? '⏳ Restoring…' : '🔄 Restore from Cloud'}
              </button>
            </div>
            {restoreMsg && (
              <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: restoreMsg.startsWith('✅') ? '#4ade80' : '#f87171' }}>
                {restoreMsg}
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="profile-section-title" style={{ marginTop: '1.25rem' }}>
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
