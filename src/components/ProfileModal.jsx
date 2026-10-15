import React, { useState } from 'react';
import { SYLLABUS_TOPICS, QUESTION_BANK } from '../data/questions';
import { ENGLISH_SYLLABUS_TOPICS, ENGLISH_QUESTION_BANK } from '../data/english_questions';

const TOPIC_ALIASES = {
  ottapadam: ['ottapadam', 'ഒറ്റപ്പദം'],
  viparitham: ['viparitham', 'വിപരീതപദം'],
  samanapadham: ['samanapadham', 'ശബ്ദാർത്ഥം', 'അർത്ഥവ്യത്യാസം', 'പര്യായം', 'പര്യായപദം', 'paryayam'],
  shaylikal: ['shaylikal', 'shailikal', 'ശൈലികൾ'],
  pirichezhuthal: ['pirichezhuthal', 'പിരിച്ചെഴുത്ത്', 'സന്ധി'],
  padashuddhi: ['padashuddhi', 'പദശുദ്ധി'],
  vakyashuddhi: ['vakyashuddhi'],
  lingam: ['lingam', 'ethirlingam', 'എതിർലിംഗം'],
  vachanam: ['vachanam'],
  krithikal: ['krithikal', 'varikal', 'sahithyam', 'കാവ്യവരികളും കവികളും', 'കൃതികളും കഥാപാത്രങ്ങളും'],
  paribhasha: ['paribhasha'],
  ghadakapadam: ['ghadakapadam'],
  cherkkayzhuthuka: ['cherkkayzhuthuka']
};

const matchesTopic = (qTopic, targetTopicId, subject) => {
  if (targetTopicId === 'all') return true;
  if (subject === 'english') {
    return qTopic === targetTopicId;
  }
  const aliases = TOPIC_ALIASES[targetTopicId] || [targetTopicId];
  return aliases.includes(qTopic);
};

export default function ProfileModal({
  user,
  activeSubject = 'malayalam',
  onClose,
  onSwitchAccount,
  onResetProgress,
  onDeleteAccount,
  onUpdateUser
}) {
  const [modalSubject, setModalSubject] = useState(activeSubject);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const stats = user.stats || { correct: 0, total: 0, streak: 0, maxStreak: 0, topicStats: {} };
  const topicStats = stats.topicStats || {};
  const total = stats.total || 0;
  const correct = stats.correct || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const repeatCount = user.repeatQueue?.length || 0;

  // Active Subject Data in Modal
  const isEnglish = modalSubject === 'english';
  const currentTopics = isEnglish ? ENGLISH_SYLLABUS_TOPICS : SYLLABUS_TOPICS;
  const currentBank = isEnglish ? ENGLISH_QUESTION_BANK : QUESTION_BANK;
  const totalInBank = currentBank.length;

  // Calculate subject-specific solved count
  const subjectCorrect = currentTopics
    .filter(t => t.id !== 'all')
    .reduce((acc, t) => acc + (topicStats[t.id]?.correct || 0), 0);

  const subjectAttempted = currentTopics
    .filter(t => t.id !== 'all')
    .reduce((acc, t) => acc + (topicStats[t.id]?.total || 0), 0);

  const subjectCompletion = totalInBank > 0 ? ((subjectCorrect / totalInBank) * 100).toFixed(1) : '0.0';

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
    if (window.confirm('Are you sure you want to reset your score and mistake queue for this profile?')) {
      onResetProgress(user.id);
    }
  };

  const handleDeleteConfirm = () => {
    if (window.confirm(`Are you sure you want to permanently delete profile "${user.name}"?`)) {
      onDeleteAccount(user.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="profile-header-title">
            <span className="profile-avatar-large">{user.avatar || '🎓'}</span>
            <div>
              <h2 className="modal-title" style={{ margin: 0 }}>
                {user.name}
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Overall Progress: {correct} Solved Across All Subjects
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body profile-modal-body">
          {/* Quick Metrics */}
          <div className="profile-metrics-grid">
            <div className="profile-metric-card">
              <span className="metric-icon">🎯</span>
              <div className="metric-val">{total}</div>
              <div className="metric-lbl">Total Attempted</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon">✅</span>
              <div className="metric-val">{correct}</div>
              <div className="metric-lbl">Correct Solved</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon">📈</span>
              <div className="metric-val">{accuracy}%</div>
              <div className="metric-lbl">Accuracy</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon">🔥</span>
              <div className="metric-val">{stats.maxStreak || 0}</div>
              <div className="metric-lbl">Best Streak</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon">🔁</span>
              <div className="metric-val">{repeatCount}</div>
              <div className="metric-lbl">Mistake Queue</div>
            </div>
            <div className="profile-metric-card">
              <span className="metric-icon">📚</span>
              <div className="metric-val">{QUESTION_BANK.length + ENGLISH_QUESTION_BANK.length}</div>
              <div className="metric-lbl">Total Question Bank</div>
            </div>
          </div>

          {/* Edit Name Form */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="profile-edit-box">
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
                Edit Your Name
              </label>
              <input
                type="text"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button
              className="profile-edit-toggle-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Name
            </button>
          )}

          {/* Subject Tab Selector in Profile Modal */}
          <div className="modal-subject-tabs">
            <button
              type="button"
              className={`modal-subject-tab ${modalSubject === 'malayalam' ? 'active' : ''}`}
              onClick={() => setModalSubject('malayalam')}
            >
              <span>📚 Malayalam (10 Marks)</span>
              <span className="tab-badge">{QUESTION_BANK.length} Qns</span>
            </button>
            <button
              type="button"
              className={`modal-subject-tab ${modalSubject === 'english' ? 'active' : ''}`}
              onClick={() => setModalSubject('english')}
            >
              <span>🇬🇧 General English (10 Marks)</span>
              <span className="tab-badge">{ENGLISH_QUESTION_BANK.length} Qns</span>
            </button>
          </div>

          {/* Topic-wise Breakdown Header */}
          <div className="profile-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📊 {isEnglish ? 'General English' : 'Malayalam'} Topic Mastery</span>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
              {subjectCorrect} / {totalInBank} ({subjectCompletion}%)
            </span>
          </div>

          <div className="topic-mastery-list">
            {currentTopics.filter(t => t.id !== 'all').map((topic) => {
              const totalInTopic = currentBank.filter(q => matchesTopic(q.topic, topic.id, modalSubject)).length;
              const tData = topicStats[topic.id] || { correct: 0, total: 0 };
              const tAttempted = tData.total || 0;
              const tCorrect = tData.correct || 0;
              const tAccuracy = tAttempted > 0 ? Math.round((tCorrect / tAttempted) * 100) : 0;
              const completionPercent = totalInTopic > 0 ? ((tCorrect / totalInTopic) * 100).toFixed(1) : '0.0';
              const fillWidth = totalInTopic > 0 ? Math.min(100, Math.max(tCorrect > 0 ? 3 : 0, (tCorrect / totalInTopic) * 100)) : 0;

              return (
                <div key={topic.id} className="topic-mastery-item">
                  <div className="topic-mastery-header">
                    <span className="topic-mastery-name">
                      {topic.icon} {topic.name}
                    </span>
                    <span className="topic-mastery-count">
                      {tAttempted > 0 ? (
                        <>
                          <strong style={{ color: '#38bdf8' }}>{tCorrect} / {totalInTopic}</strong>
                          <span style={{ color: '#94a3b8', marginLeft: '0.35rem', fontSize: '0.78rem' }}>
                            ({completionPercent}% completed • {tAccuracy}% acc)
                          </span>
                        </>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.78rem' }}>
                          0 / {totalInTopic} (Not Started)
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="topic-mastery-bar">
                    <div
                      className="topic-mastery-fill"
                      style={{
                        width: `${fillWidth}%`,
                        background: topic.color || '#38bdf8'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Account Actions */}
          <div className="profile-section-title" style={{ marginTop: '1.5rem' }}>
            ⚙️ Account Management
          </div>

          <div className="profile-actions-grid">
            <button
              className="action-btn switch-btn"
              onClick={onSwitchAccount}
            >
              👥 Switch Aspirant Profile
            </button>
            <button
              className="action-btn reset-btn"
              onClick={handleResetConfirm}
            >
              🔄 Reset Practice Progress
            </button>
            <button
              className="action-btn delete-btn"
              onClick={handleDeleteConfirm}
            >
              🗑️ Delete Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
