import React, { useState, useEffect } from 'react';
import {
  getInviteCodes,
  generateInviteCode,
  deleteInviteCode,
  toggleInviteCode,
  adminLogout,
  revokeUser,
  approveUser,
  getApprovedUserIds,
} from '../utils/adminAuth';
import { XIcon, AlertTriangleIcon } from './Icons';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button className="admin-copy-btn" onClick={copy} title="Copy code">
      {copied ? '✓ Copied' : '⎘ Copy'}
    </button>
  );
}

export default function AdminPanel({ onClose, users, onRevokeUser }) {
  const [tab, setTab] = useState('codes'); // 'codes' | 'users'
  const [codes, setCodes] = useState([]);
  const [label, setLabel] = useState('');
  const [maxUses, setMaxUses] = useState(1);
  const [approvedIds, setApprovedIds] = useState([]);

  const refresh = () => {
    setCodes(getInviteCodes());
    setApprovedIds(getApprovedUserIds());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleGenerate = () => {
    generateInviteCode(label || 'Student', Number(maxUses));
    setLabel('');
    setMaxUses(1);
    refresh();
  };

  const handleDelete = (id) => {
    deleteInviteCode(id);
    refresh();
  };

  const handleToggle = (id) => {
    toggleInviteCode(id);
    refresh();
  };

  const handleRevokeUser = (userId) => {
    revokeUser(userId);
    onRevokeUser(userId);
    refresh();
  };

  const handleApproveUser = (userId) => {
    approveUser(userId);
    refresh();
  };

  const handleLogout = () => {
    adminLogout();
    onClose();
  };

  const fmt = (ts) => new Date(ts).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="modal-overlay admin-overlay" onClick={onClose}>
      <div
        className="admin-panel-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-panel-header">
          <div className="admin-panel-title-row">
            <span className="admin-panel-badge">⚙ Admin Panel</span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="admin-logout-btn" onClick={handleLogout}>
                Log Out
              </button>
              <button className="admin-close-btn" onClick={onClose} title="Close">
                <XIcon size={18} />
              </button>
            </div>
          </div>
          <p className="admin-panel-sub">Manage invite codes and user access</p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'codes' ? 'active' : ''}`}
            onClick={() => setTab('codes')}
          >
            🔑 Invite Codes ({codes.length})
          </button>
          <button
            className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            👥 Users ({users.length})
          </button>
        </div>

        {/* ── CODES TAB ── */}
        {tab === 'codes' && (
          <div className="admin-tab-body">
            {/* Generate new code */}
            <div className="admin-generate-box">
              <h3 className="admin-section-title">Generate New Invite Code</h3>
              <div className="admin-generate-row">
                <input
                  className="admin-input"
                  type="text"
                  placeholder="Label (e.g. John, Batch A)"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  maxLength={30}
                />
                <select
                  className="admin-select"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                >
                  <option value={1}>1 use</option>
                  <option value={3}>3 uses</option>
                  <option value={5}>5 uses</option>
                  <option value={10}>10 uses</option>
                  <option value={999}>Unlimited</option>
                </select>
                <button className="admin-generate-btn" onClick={handleGenerate}>
                  + Generate
                </button>
              </div>
            </div>

            {/* Codes list */}
            <div className="admin-list">
              {codes.length === 0 && (
                <p className="admin-empty-msg">No invite codes yet. Generate one above.</p>
              )}
              {codes.map((c) => (
                <div
                  key={c.id}
                  className={`admin-code-row ${!c.active ? 'disabled' : ''}`}
                >
                  <div className="admin-code-main">
                    <span className="admin-code-value">{c.code}</span>
                    <CopyBtn text={c.code} />
                    <span
                      className={`admin-code-status-dot ${c.active ? 'active' : 'inactive'}`}
                      title={c.active ? 'Active' : 'Inactive / Expired'}
                    />
                  </div>
                  <div className="admin-code-meta">
                    <span className="admin-code-label">{c.label}</span>
                    <span className="admin-code-uses">
                      {c.usedCount}/{c.maxUses === 999 ? '∞' : c.maxUses} used
                    </span>
                    {c.usedBy.length > 0 && (
                      <span className="admin-code-usedby">
                        → {c.usedBy.map((u) => u.name).join(', ')}
                      </span>
                    )}
                    <span className="admin-code-date">{fmt(c.createdAt)}</span>
                  </div>
                  <div className="admin-code-actions">
                    <button
                      className={`admin-action-btn ${c.active ? 'warn' : 'ok'}`}
                      onClick={() => handleToggle(c.id)}
                      title={c.active ? 'Deactivate' : 'Activate'}
                    >
                      {c.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="admin-action-btn danger"
                      onClick={() => handleDelete(c.id)}
                      title="Delete code"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <div className="admin-tab-body">
            <div className="admin-list">
              {users.length === 0 && (
                <p className="admin-empty-msg">No registered users yet.</p>
              )}
              {users.map((u) => {
                const total = u.stats?.total || 0;
                const correct = u.stats?.correct || 0;
                const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
                const isApproved = approvedIds.includes(u.id);

                return (
                  <div key={u.id} className={`admin-user-row ${!isApproved ? 'revoked' : ''}`}>
                    <div className="admin-user-avatar">
                      {(u.name?.[0] || 'U').toUpperCase()}
                    </div>
                    <div className="admin-user-info">
                      <div className="admin-user-name">{u.name}</div>
                      <div className="admin-user-meta">
                        {total} solved · {accuracy}% accuracy ·{' '}
                        Joined {fmt(u.createdAt)}
                      </div>
                    </div>
                    <div className="admin-user-actions">
                      {isApproved ? (
                        <button
                          className="admin-action-btn danger"
                          onClick={() => handleRevokeUser(u.id)}
                          title="Revoke access — user will be blocked on next visit"
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          className="admin-action-btn ok"
                          onClick={() => handleApproveUser(u.id)}
                          title="Restore access"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="admin-info-box">
              <AlertTriangleIcon size={14} />
              <span>
                Revoking a user blocks their next login. Their progress data stays saved locally.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
