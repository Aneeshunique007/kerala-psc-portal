import React, { useState } from 'react';
import {
  TargetIcon,
  CheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  RotateIcon,
  BookOpenIcon,
  TrashIcon,
  XIcon,
  EditIcon,
  LogOutIcon,
  CameraIcon,
  CloudIcon
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
  const [restoreFeedback, setRestoreFeedback] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  const hasCustomPhoto = Boolean(user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http')));

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (JPG, PNG, or WebP).');
      return;
    }

    setPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 160;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

        onUpdateUser({
          ...user,
          avatar: dataUrl
        });
        setPhotoLoading(false);
      };
      img.onerror = () => {
        setPhotoLoading(false);
        alert('Could not process this image.');
      };
      img.src = loadEvent.target.result;
    };
    reader.onerror = () => setPhotoLoading(false);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onUpdateUser({
      ...user,
      avatar: (user.name?.[0] || 'U').toUpperCase()
    });
  };

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
    setRestoreFeedback(null);
    try {
      await onRestoreFromCloud();
      setRestoreFeedback({ type: 'success', text: 'Study progress synchronized with cloud.' });
    } catch {
      setRestoreFeedback({ type: 'error', text: 'Synchronization failed. Please check your network connection.' });
    }
    setRestoring(false);
    setTimeout(() => setRestoreFeedback(null), 4000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="profile-header-title">
            <div className="profile-avatar-wrapper">
              {hasCustomPhoto ? (
                <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
              ) : (
                <span className="profile-avatar-large">
                  {(user.name || 'U')[0].toUpperCase()}
                </span>
              )}
              <button
                type="button"
                className="profile-avatar-camera-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload or change profile photo"
                aria-label="Upload photo"
                disabled={photoLoading}
              >
                <CameraIcon size={13} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoSelect}
              />
            </div>
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
                  <button type="submit" className="profile-name-save-btn" title="Save name" aria-label="Save name">
                    <CheckIcon size={12} />
                  </button>
                  <button type="button" className="profile-name-cancel-btn" onClick={() => setIsEditing(false)} title="Cancel" aria-label="Cancel">
                    <XIcon size={12} />
                  </button>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="profile-exam-tag">{user.isAdmin ? 'System Administrator' : 'Authorized Candidate'}</span>
                {hasCustomPhoto && (
                  <button
                    type="button"
                    className="profile-remove-photo-btn"
                    onClick={handleRemovePhoto}
                    title="Remove custom photo and use letter initial"
                  >
                    Remove photo
                  </button>
                )}
              </div>
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
          <div className="profile-sync-panel">
            <div className="profile-sync-row">
              <div className="profile-sync-indicator">
                <CloudIcon size={16} className={`profile-cloud-icon ${cloudSyncStatus === 'syncing' ? 'pulse' : ''}`} />
                <span>
                  {cloudSyncStatus === 'syncing' && 'Synchronizing with cloud...'}
                  {cloudSyncStatus === 'synced' && 'All progress backed up'}
                  {cloudSyncStatus === 'idle' && 'Cloud sync active'}
                </span>
                {cloudSyncStatus === 'synced' && (
                  <CheckCircleIcon size={14} className="profile-sync-check-icon" />
                )}
              </div>
              <button
                type="button"
                onClick={handleRestoreFromCloud}
                disabled={restoring}
                className="profile-restore-btn"
                title="Fetch latest progress from cloud"
              >
                <RotateIcon size={13} className={restoring ? 'spin' : ''} />
                <span>{restoring ? 'Restoring...' : 'Restore from Cloud'}</span>
              </button>
            </div>
            {restoreFeedback && (
              <div className={`profile-sync-feedback ${restoreFeedback.type}`}>
                {restoreFeedback.type === 'success' ? (
                  <CheckCircleIcon size={14} />
                ) : (
                  <XCircleIcon size={14} />
                )}
                <span>{restoreFeedback.text}</span>
              </div>
            )}
          </div>

          {/* Review & Spaced Repetition Settings */}
          <div className="profile-section-title" style={{ marginTop: '1.25rem' }}>
            Review Queue Mastery Target
          </div>

          <div className="profile-setting-card">
            <div className="profile-setting-desc">
              Choose how many times a missed question must be answered correctly to graduate to Learned:
            </div>
            <div className="repeat-target-selector">
              {[
                { val: 1, label: '1 Repeat', badge: 'Express', desc: '1 correct answer marks as learned' },
                { val: 2, label: '2 Repeats', badge: 'Balanced', desc: 'Requires 2 spaced correct reviews' },
                { val: 3, label: '3 Repeats', badge: 'Thorough', desc: 'Standard 3 spaced reviews to master' }
              ].map((opt) => {
                const isSelected = (user.repeatTarget || 3) === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    className={`repeat-target-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      onUpdateUser({
                        ...user,
                        repeatTarget: opt.val
                      });
                    }}
                  >
                    <div className="repeat-target-left">
                      <span className="repeat-target-radio">
                        {isSelected && <span className="repeat-target-radio-dot" />}
                      </span>
                      <span className="repeat-target-val">{opt.label}</span>
                      <span className="repeat-target-badge">{opt.badge}</span>
                    </div>
                    <span className="repeat-target-desc">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
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
