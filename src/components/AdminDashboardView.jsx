import React, { useState, useEffect } from 'react';
import {
  adminFetchAllUsers,
  adminApproveUser,
  adminRejectUser,
  adminDeleteUser,
} from '../utils/supabaseClient';
import {
  ShieldIcon,
  ShieldCheckIcon,
  UsersIcon,
  RotateIcon,
  CheckIcon,
  CheckCircleIcon,
  XIcon,
  XCircleIcon,
  SearchIcon,
  UserIcon,
  BookOpenIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  TargetIcon,
  ClockIcon,
  LogOutIcon,
  DatabaseIcon,
} from './Icons';
import {
  QUESTION_BANK,
  ENGLISH_QUESTION_BANK,
  PYQ_QUESTION_BANK
} from '../data/questions';

export default function AdminDashboardView({
  onStartPractice,
  onStartBlueprint,
  onRevokeUser,
  onDeleteUser,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'directory' | 'profile'
  const [dbUsers, setDbUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [directoryStatusFilter, setDirectoryStatusFilter] = useState('all'); // 'all' | 'approved' | 'rejected' | 'pending'

  const fetchUsers = async () => {
    setLoading(true);
    const { users } = await adminFetchAllUsers();
    setDbUsers(users || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Action handlers
  const handleApprove = async (userId) => {
    setActionId(userId);
    const res = await adminApproveUser(userId);
    setActionId(null);
    if (res.success) {
      fetchUsers();
    }
  };

  const handleReject = async (userId) => {
    setActionId(userId);
    const res = await adminRejectUser(userId);
    if (onRevokeUser) onRevokeUser(userId);
    setActionId(null);
    if (res.success) {
      fetchUsers();
    }
  };

  const handleDeleteClick = (userId) => {
    if (confirmDeleteId === userId) {
      setConfirmDeleteId(null);
      executeDelete(userId);
    } else {
      setConfirmDeleteId(userId);
      setTimeout(() => {
        setConfirmDeleteId((prev) => (prev === userId ? null : prev));
      }, 4000);
    }
  };

  const executeDelete = async (userId) => {
    setActionId(userId);
    try {
      const res = await adminDeleteUser(userId);
      if (res.success) {
        if (onDeleteUser) onDeleteUser(userId);
        else if (onRevokeUser) onRevokeUser(userId);
        await fetchUsers();
      } else {
        console.error('Delete error:', res.error);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setActionId(null);
    }
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

  const pendingUsers = dbUsers.filter((u) => u.status === 'pending' && u.email !== 'crazyaneeshus007@gmail.com');
  const approvedUsers = dbUsers.filter((u) => u.status === 'approved' && u.email !== 'crazyaneeshus007@gmail.com');
  const rejectedUsers = dbUsers.filter((u) => u.status === 'rejected' && u.email !== 'crazyaneeshus007@gmail.com');
  const candidateUsers = dbUsers.filter((u) => u.email !== 'crazyaneeshus007@gmail.com');

  const filteredDirectory = candidateUsers.filter((u) => {
    if (directoryStatusFilter !== 'all' && u.status !== directoryStatusFilter) {
      return false;
    }
    const q = searchQuery.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const totalBankCount =
    QUESTION_BANK.length + ENGLISH_QUESTION_BANK.length + PYQ_QUESTION_BANK.length;

  return (
    <div className="admin-dashboard-container">
      {/* ── HEADER BANNER ── */}
      <div className="admin-dash-header">
        <div className="admin-dash-header-left">
          <div className="admin-dash-emblem-wrap">
            <img
              src="/kerala-psc-logo.jpg"
              alt="Kerala PSC Logo"
              className="admin-dash-emblem-img"
            />
          </div>
          <div className="admin-dash-header-text">
            <div className="admin-dash-title-row">
              <h1 className="admin-dash-title">Administrator Command Center</h1>
              <span className="admin-role-badge">
                <ShieldCheckIcon size={14} />
                <span>Master Superadmin</span>
              </span>
            </div>
            <p className="admin-dash-sub">
              Manage candidate verification, live access permissions, and study materials
            </p>
          </div>
        </div>
      </div>

      {/* ── METRIC STAT CARDS ── */}
      <div className="admin-dash-metrics-grid">
        <div
          className={`admin-metric-card ${pendingUsers.length > 0 ? 'highlight-amber' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <div className="admin-metric-icon amber">
            <ClockIcon size={22} />
          </div>
          <div className="admin-metric-details">
            <span className="admin-metric-val">{pendingUsers.length}</span>
            <span className="admin-metric-lbl">Pending Approvals</span>
          </div>
          {pendingUsers.length > 0 && <span className="admin-metric-pill-alert">Action Required</span>}
        </div>

        <div
          className="admin-metric-card"
          onClick={() => {
            setDirectoryStatusFilter('approved');
            setActiveTab('directory');
          }}
          title="View Active Verified Candidates"
        >
          <div className="admin-metric-icon green">
            <UsersIcon size={22} />
          </div>
          <div className="admin-metric-details">
            <span className="admin-metric-val">{approvedUsers.length}</span>
            <span className="admin-metric-lbl">Active Verified Users</span>
          </div>
        </div>

        <div
          className={`admin-metric-card ${rejectedUsers.length > 0 ? 'highlight-rose' : ''}`}
          onClick={() => {
            setDirectoryStatusFilter('rejected');
            setActiveTab('directory');
          }}
          title="View Declined & Suspended Aspirants"
        >
          <div className="admin-metric-icon rose">
            <XCircleIcon size={22} />
          </div>
          <div className="admin-metric-details">
            <span className="admin-metric-val">{rejectedUsers.length}</span>
            <span className="admin-metric-lbl">Declined / Suspended</span>
          </div>
          {rejectedUsers.length > 0 && <span className="admin-metric-pill-subtle">Review</span>}
        </div>

        <div className="admin-metric-card" onClick={() => setActiveTab('profile')} title="View 100-Mark Question Bank Details">
          <div className="admin-metric-icon blue">
            <BookOpenIcon size={22} />
          </div>
          <div className="admin-metric-details">
            <span className="admin-metric-val">{totalBankCount.toLocaleString()}</span>
            <span className="admin-metric-lbl">Total Questions (100 Marks)</span>
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD TABS ── */}
      <div className="admin-dash-body-card">
        <div className="admin-dash-nav-tabs">
          <button
            type="button"
            className={`admin-dash-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <ClockIcon size={16} />
            <span>Pending Verification</span>
            {pendingUsers.length > 0 && (
              <span className="admin-tab-alert-pill">{pendingUsers.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`admin-dash-tab ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            <UsersIcon size={16} />
            <span>User Directory ({candidateUsers.length})</span>
          </button>

          <button
            type="button"
            className={`admin-dash-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <ShieldIcon size={16} />
            <span>Admin Profile &amp; Settings</span>
          </button>
        </div>

        {/* ── TAB 1: PENDING VERIFICATION ── */}
        {activeTab === 'pending' && (
          <div className="admin-pane-content">
            <div className="admin-pane-header">
              <div>
                <h3 className="admin-pane-title">Aspirant Verification Queue</h3>
                <p className="admin-pane-sub">
                  Candidates who registered with their email and password waiting for your approval
                </p>
              </div>
              <button
                type="button"
                className="admin-pane-action-btn"
                onClick={fetchUsers}
                disabled={loading}
              >
                <RotateIcon size={14} className={loading ? 'spinning' : ''} />
                <span>Check Live Queue</span>
              </button>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="admin-dash-empty-box">
                <div className="admin-dash-empty-icon">
                  <CheckCircleIcon size={34} />
                </div>
                <h3>No Pending Requests</h3>
                <p>All candidates have been reviewed. New requests will appear here automatically.</p>
              </div>
            ) : (
              <div className="admin-pending-grid">
                {pendingUsers.map((u) => (
                  <div key={u.id} className="admin-pending-card">
                    <div className="admin-pending-card-top">
                      <div className="admin-user-avatar-large">
                        {(u.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="admin-pending-details">
                        <div className="admin-pending-name">{u.name}</div>
                        <div className="admin-pending-email">{u.email}</div>
                        <div className="admin-pending-time">
                          <span>Requested: {fmt(u.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="admin-pending-card-actions">
                      <button
                        type="button"
                        className="admin-btn-approve"
                        disabled={actionId === u.id}
                        onClick={() => handleApprove(u.id)}
                      >
                        <CheckIcon size={16} />
                        <span>Approve Access</span>
                      </button>
                      <button
                        type="button"
                        className="admin-btn-reject"
                        disabled={actionId === u.id}
                        onClick={() => handleReject(u.id)}
                      >
                        <XIcon size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: USER DIRECTORY ── */}
        {activeTab === 'directory' && (
          <div className="admin-pane-content">
            <div className="admin-pane-header">
              <div>
                <h3 className="admin-pane-title">Aspirant Directory &amp; Permissions</h3>
                <p className="admin-pane-sub">All registered accounts stored in your database</p>
              </div>
              <div className="admin-search-and-filters">
                <div className="admin-dir-filters">
                  <button
                    type="button"
                    className={`admin-dir-pill-btn ${directoryStatusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setDirectoryStatusFilter('all')}
                  >
                    All ({candidateUsers.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-dir-pill-btn ${directoryStatusFilter === 'approved' ? 'active' : ''}`}
                    onClick={() => setDirectoryStatusFilter('approved')}
                  >
                    Verified ({approvedUsers.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-dir-pill-btn ${directoryStatusFilter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setDirectoryStatusFilter('rejected')}
                  >
                    Declined ({rejectedUsers.length})
                  </button>
                  {pendingUsers.length > 0 && (
                    <button
                      type="button"
                      className={`admin-dir-pill-btn ${directoryStatusFilter === 'pending' ? 'active' : ''}`}
                      onClick={() => setDirectoryStatusFilter('pending')}
                    >
                      Pending ({pendingUsers.length})
                    </button>
                  )}
                </div>
                <div className="admin-search-wrap">
                  <SearchIcon size={15} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                </div>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-directory-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Registered At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDirectory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="admin-table-empty">
                        No users match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDirectory.map((u) => (
                      <tr key={u.id} className={`table-row-${u.status}`}>
                        <td>
                          <div className="table-user-cell">
                            <span className="table-avatar">{(u.name?.[0] || 'U').toUpperCase()}</span>
                            <strong>{u.name}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="table-email">{u.email}</span>
                        </td>
                        <td>
                          <span className={`status-pill-badge ${u.status}`}>
                            {u.status === 'approved' ? (
                              <>
                                <CheckCircleIcon size={13} />
                                <span>Active</span>
                              </>
                            ) : u.status === 'pending' ? (
                              <>
                                <ClockIcon size={13} />
                                <span>Pending</span>
                              </>
                            ) : (
                              <>
                                <XCircleIcon size={13} />
                                <span>Revoked</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td>
                          <span className="table-date">{fmt(u.created_at)}</span>
                        </td>
                        <td>
                          <div className="table-action-btns">
                            {u.status === 'approved' ? (
                              <button
                                type="button"
                                className="table-btn-revoke"
                                disabled={actionId === u.id}
                                onClick={() => handleReject(u.id)}
                                title="Revoke access"
                              >
                                Revoke
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="table-btn-approve"
                                disabled={actionId === u.id}
                                onClick={() => handleApprove(u.id)}
                                title="Approve / Restore access"
                              >
                                Restore
                              </button>
                            )}
                            <button
                              type="button"
                              className={`table-btn-delete ${confirmDeleteId === u.id ? 'confirming' : ''}`}
                              disabled={actionId === u.id}
                              onClick={() => handleDeleteClick(u.id)}
                              title={confirmDeleteId === u.id ? 'Click again to permanently delete' : 'Delete candidate profile'}
                            >
                              {actionId === u.id ? 'Deleting...' : confirmDeleteId === u.id ? 'Confirm?' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: ADMIN PROFILE & SYSTEM STATUS ── */}
        {activeTab === 'profile' && (
          <div className="admin-pane-content">
            <div className="admin-profile-view-box">
              <div className="admin-profile-card">
                <div className="admin-profile-badge-row">
                  <div className="admin-profile-seal">
                    <ShieldCheckIcon size={26} />
                  </div>
                  <div>
                    <h3 className="admin-profile-name">Master Administrator</h3>
                    <p className="admin-profile-email">crazyaneeshus007@gmail.com</p>
                  </div>
                </div>

                <div className="admin-spec-list">
                  <div className="admin-spec-item">
                    <span className="spec-lbl">Access Level</span>
                    <span className="spec-val gold">Full Platform Superadmin</span>
                  </div>
                  <div className="admin-spec-item">
                    <span className="spec-lbl">Backend Database</span>
                    <span className="spec-val green">
                      <DatabaseIcon size={14} />
                      <span>Supabase PostgreSQL Online</span>
                    </span>
                  </div>
                  <div className="admin-spec-item">
                    <span className="spec-lbl">Malayalam Syllabus Bank</span>
                    <span className="spec-val">2,774 Questions (10 Marks)</span>
                  </div>
                  <div className="admin-spec-item">
                    <span className="spec-lbl">General English Bank</span>
                    <span className="spec-val">4,389 Questions (10 Marks)</span>
                  </div>
                  <div className="admin-spec-item">
                    <span className="spec-lbl">PYQ (2020–2026) Bank</span>
                    <span className="spec-val">11,318 Questions (All Subjects)</span>
                  </div>
                </div>
              </div>

              <div className="admin-profile-actions-box">
                <h4>Admin Quick Shortcuts</h4>
                <div className="admin-shortcuts-grid">
                  <button
                    type="button"
                    className="admin-shortcut-btn"
                    onClick={onStartPractice}
                  >
                    <TargetIcon size={18} />
                    <div>
                      <strong>Start Practice Quiz</strong>
                      <span>Solve questions and test study material</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="admin-shortcut-btn"
                    onClick={onStartBlueprint}
                  >
                    <BookOpenIcon size={18} />
                    <div>
                      <strong>View LDC 100-Mark Blueprint</strong>
                      <span>Inspect topic-wise mark distributions</span>
                    </div>
                  </button>
                  {onLogout && (
                    <button
                      type="button"
                      className="admin-shortcut-btn admin-logout-shortcut-btn"
                      onClick={onLogout}
                    >
                      <LogOutIcon size={18} />
                      <div>
                        <strong>Sign Out Administrator</strong>
                        <span>Exit command center and return to login screen</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
