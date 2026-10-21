import React, { useState, useEffect } from 'react';
import {
  getInviteCodes,
  generateInviteCode,
  deleteInviteCode,
  toggleInviteCode,
  adminLogout,
} from '../utils/adminAuth';
import {
  adminFetchAllUsers,
  adminApproveUser,
  adminRejectUser,
  adminDeleteUser,
} from '../utils/supabaseClient';
import { XIcon, AlertTriangleIcon, RotateIcon, CheckIcon } from './Icons';

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

export default function AdminPanel({ onClose, onRevokeUser }) {
  const [tab, setTab] = useState('pending'); // 'pending' | 'approved' | 'codes'
  const [dbUsers, setDbUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Invite code state
  const [codes, setCodes] = useState([]);
  const [label, setLabel] = useState('');
  const [maxUses, setMaxUses] = useState(1);

  // Load cloud users from Supabase
  const loadSupabaseUsers = async () => {
    setLoadingUsers(true);
    const { users } = await adminFetchAllUsers();
    setDbUsers(users || []);
    setLoadingUsers(false);
  };

  const refreshCodes = () => {
    setCodes(getInviteCodes());
  };

  useEffect(() => {
    loadSupabaseUsers();
    refreshCodes();
  }, []);

  // Admin Actions on Cloud Users
  const handleApprove = async (userId) => {
    setActionLoadingId(userId);
    const res = await adminApproveUser(userId);
    setActionLoadingId(null);
    if (res.success) {
      loadSupabaseUsers();
    }
  };

  const handleReject = async (userId) => {
    setActionLoadingId(userId);
    const res = await adminRejectUser(userId);
    if (onRevokeUser) onRevokeUser(userId);
    setActionLoadingId(null);
    if (res.success) {
      loadSupabaseUsers();
    }
  };

  const handleDeleteDbUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user record?')) return;
    setActionLoadingId(userId);
    const res = await adminDeleteUser(userId);
    setActionLoadingId(null);
    if (res.success) {
      loadSupabaseUsers();
    }
  };

  // Invite Codes logic
  const handleGenerateCode = () => {
    generateInviteCode(label || 'Student', Number(maxUses));
    setLabel('');
    setMaxUses(1);
    refreshCodes();
  };

  const handleDeleteCode = (id) => {
    deleteInviteCode(id);
    refreshCodes();
  };

  const handleToggleCode = (id) => {
    toggleInviteCode(id);
    refreshCodes();
  };

  const handleLogout = () => {
    adminLogout();
    onClose();
  };

  const fmt = (ts) => {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const pendingUsers = dbUsers.filter((u) => u.status === 'pending');
  const approvedUsers = dbUsers.filter((u) => u.status === 'approved');
  const rejectedUsers = dbUsers.filter((u) => u.status === 'rejected');

  return (
    <div className="modal-overlay admin-overlay" onClick={onClose}>
      <div className="admin-panel-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-panel-header">
          <div className="admin-panel-title-row">
            <span className="admin-panel-badge">🛡️ Admin Control Center</span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className="admin-refresh-btn"
                onClick={loadSupabaseUsers}
                disabled={loadingUsers}
                title="Refresh user list"
              >
                <RotateIcon size={14} className={loadingUsers ? 'spinning' : ''} />
                <span>Refresh</span>
              </button>
              <button className="admin-logout-btn" onClick={handleLogout}>
                Log Out
              </button>
              <button className="admin-close-btn" onClick={onClose} title="Close">
                <XIcon size={18} />
              </button>
            </div>
          </div>
          <p className="admin-panel-sub">
            Review registration requests, approve/reject aspirants, and manage access
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'pending' ? 'active' : ''}`}
            onClick={() => setTab('pending')}
          >
            ⏳ Pending Verification
            {pendingUsers.length > 0 && (
              <span className="admin-tab-counter alert">{pendingUsers.length}</span>
            )}
          </button>
          <button
            className={`admin-tab ${tab === 'approved' ? 'active' : ''}`}
            onClick={() => setTab('approved')}
          >
            👥 Approved Users ({approvedUsers.length})
          </button>
          <button
            className={`admin-tab ${tab === 'codes' ? 'active' : ''}`}
            onClick={() => setTab('codes')}
          >
            🔑 Invite Codes ({codes.length})
          </button>
        </div>

        {/* ── 1. PENDING VERIFICATION TAB ── */}
        {tab === 'pending' && (
          <div className="admin-tab-body">
            <div className="admin-tab-intro">
              <p>
                The following users signed up on your portal and are waiting for your approval
                before they can practice:
              </p>
            </div>

            <div className="admin-list">
              {pendingUsers.length === 0 && (
                <div className="admin-empty-state">
                  <span className="admin-empty-icon">✓</span>
                  <h4>No Pending Requests</h4>
                  <p>All sign-up requests have been reviewed!</p>
                </div>
              )}

              {pendingUsers.map((u) => (
                <div key={u.id} className="admin-user-row pending-card">
                  <div className="admin-user-avatar">
                    {(u.name?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="admin-user-info">
                    <div className="admin-user-name-row">
                      <span className="admin-user-name">{u.name}</span>
                      <span className="admin-status-pill pending">Pending Approval</span>
                    </div>
                    <div className="admin-user-email-text">{u.email}</div>
                    <div className="admin-user-meta">Requested: {fmt(u.created_at)}</div>
                  </div>
                  <div className="admin-user-actions">
                    <button
                      className="admin-action-btn ok"
                      disabled={actionLoadingId === u.id}
                      onClick={() => handleApprove(u.id)}
                      title="Approve access"
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="admin-action-btn danger"
                      disabled={actionLoadingId === u.id}
                      onClick={() => handleReject(u.id)}
                      title="Reject request"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 2. APPROVED USERS TAB ── */}
        {tab === 'approved' && (
          <div className="admin-tab-body">
            <div className="admin-list">
              {approvedUsers.length === 0 && rejectedUsers.length === 0 && (
                <div className="admin-empty-state">
                  <p>No approved users yet. Approve requests from the Pending tab.</p>
                </div>
              )}

              {approvedUsers.map((u) => (
                <div key={u.id} className="admin-user-row approved-card">
                  <div className="admin-user-avatar approved">
                    {(u.name?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="admin-user-info">
                    <div className="admin-user-name-row">
                      <span className="admin-user-name">{u.name}</span>
                      <span className="admin-status-pill approved">Active</span>
                    </div>
                    <div className="admin-user-email-text">{u.email}</div>
                    <div className="admin-user-meta">Approved: {fmt(u.approved_at || u.created_at)}</div>
                  </div>
                  <div className="admin-user-actions">
                    <button
                      className="admin-action-btn danger"
                      disabled={actionLoadingId === u.id}
                      onClick={() => handleReject(u.id)}
                      title="Revoke access"
                    >
                      Revoke Access
                    </button>
                    <button
                      className="admin-action-btn text-danger"
                      disabled={actionLoadingId === u.id}
                      onClick={() => handleDeleteDbUser(u.id)}
                      title="Delete profile"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Show Rejected Users if any */}
              {rejectedUsers.length > 0 && (
                <>
                  <div className="admin-subheading-row">
                    <span>Rejected / Revoked Users ({rejectedUsers.length})</span>
                  </div>
                  {rejectedUsers.map((u) => (
                    <div key={u.id} className="admin-user-row revoked">
                      <div className="admin-user-avatar">
                        {(u.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="admin-user-info">
                        <div className="admin-user-name-row">
                          <span className="admin-user-name">{u.name}</span>
                          <span className="admin-status-pill revoked">Revoked</span>
                        </div>
                        <div className="admin-user-email-text">{u.email}</div>
                      </div>
                      <div className="admin-user-actions">
                        <button
                          className="admin-action-btn ok"
                          disabled={actionLoadingId === u.id}
                          onClick={() => handleApprove(u.id)}
                          title="Restore access"
                        >
                          Restore Access
                        </button>
                        <button
                          className="admin-action-btn text-danger"
                          disabled={actionLoadingId === u.id}
                          onClick={() => handleDeleteDbUser(u.id)}
                          title="Delete profile"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* ── 3. INVITE CODES TAB ── */}
        {tab === 'codes' && (
          <div className="admin-tab-body">
            {/* Generate new code */}
            <div className="admin-generate-box">
              <h3 className="admin-section-title">Generate VIP / Direct Access Code</h3>
              <p className="admin-generate-desc">
                Invite codes can be given to students who need to skip the verification queue.
              </p>
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
                <button className="admin-generate-btn" onClick={handleGenerateCode}>
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
                    <span className="admin-code-date">{fmt(c.createdAt)}</span>
                  </div>
                  <div className="admin-code-actions">
                    <button
                      className={`admin-action-btn ${c.active ? 'warn' : 'ok'}`}
                      onClick={() => handleToggleCode(c.id)}
                      title={c.active ? 'Deactivate' : 'Activate'}
                    >
                      {c.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="admin-action-btn danger"
                      onClick={() => handleDeleteCode(c.id)}
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
      </div>
    </div>
  );
}
