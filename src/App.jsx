import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SYLLABUS_TOPICS, QUESTION_BANK } from './data/questions';
import { ENGLISH_SYLLABUS_TOPICS, ENGLISH_QUESTION_BANK } from './data/english_questions';
import { soundFX } from './utils/soundEffects';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import './App.css';

export default function App() {
  // Users and Auth State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('psc_malayalam_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeUserId, setActiveUserId] = useState(() => {
    return localStorage.getItem('psc_active_user_id') || null;
  });

  const [activeSubject, setActiveSubject] = useState(() => {
    return localStorage.getItem('psc_active_subject') || 'malayalam';
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const currentUser = users.find(u => u.id === activeUserId) || null;

  // Selected Topic & Practice State
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [isRepeatOnlyMode, setIsRepeatOnlyMode] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Subject-specific lists
  const currentSyllabusTopics = activeSubject === 'english' ? ENGLISH_SYLLABUS_TOPICS : SYLLABUS_TOPICS;
  const currentQuestionBank = activeSubject === 'english' ? ENGLISH_QUESTION_BANK : QUESTION_BANK;

  // If no current user, trigger Auth Modal
  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [currentUser]);

  // Sync users to localStorage
  const persistUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('psc_malayalam_users', JSON.stringify(updatedUsers));
  };

  const handleSelectUser = (userId) => {
    setActiveUserId(userId);
    localStorage.setItem('psc_active_user_id', userId);
    setShowAuthModal(false);
  };

  const handleCreateUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);
    setActiveUserId(newUser.id);
    localStorage.setItem('psc_active_user_id', newUser.id);
    setShowAuthModal(false);
  };

  const handleUpdateUser = (updatedUser) => {
    const updated = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    persistUsers(updated);
  };

  const handleResetProgress = (userId) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          stats: { correct: 0, total: 0, streak: 0, maxStreak: 0, topicStats: {} },
          repeatQueue: [],
          upcomingRepeats: [],
          questionHistory: []
        };
      }
      return u;
    });
    persistUsers(updated);
  };

  const handleDeleteAccount = (userId) => {
    const updated = users.filter(u => u.id !== userId);
    persistUsers(updated);
    if (activeUserId === userId) {
      const nextUser = updated[0] || null;
      const nextId = nextUser ? nextUser.id : null;
      setActiveUserId(nextId);
      if (nextId) {
        localStorage.setItem('psc_active_user_id', nextId);
      } else {
        localStorage.removeItem('psc_active_user_id');
      }
    }
    setShowProfileModal(false);
  };

  const handleSwitchAccount = () => {
    setShowProfileModal(false);
    setShowAuthModal(true);
  };

  const handleSwitchSubject = (subject) => {
    if (subject === activeSubject) return;
    setActiveSubject(subject);
    localStorage.setItem('psc_active_subject', subject);
    setSelectedTopic('all');
    setIsRepeatOnlyMode(false);
    setTopicDropdownOpen(false);
    setMobileSidebarOpen(false);
  };

  // Stats & repeat queues for current active user
  const userStats = currentUser?.stats || { correct: 0, total: 0, streak: 0, maxStreak: 0, topicStats: {} };
  const userRepeatQueue = currentUser?.repeatQueue || [];
  const userUpcomingRepeats = currentUser?.upcomingRepeats || [];
  const userHistory = currentUser?.questionHistory || [];

  // Filter mistake queue by current subject
  const currentSubjectRepeatQueue = userRepeatQueue.filter(q => {
    if (activeSubject === 'english') {
      return ENGLISH_QUESTION_BANK.some(eq => eq.id === q.id);
    } else {
      return QUESTION_BANK.some(mq => mq.id === q.id);
    }
  });

  const MALAYALAM_TOPIC_ALIASES = {
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

  const matchesTopic = (qTopic, targetTopicId) => {
    if (targetTopicId === 'all') return true;
    if (activeSubject === 'english') {
      return qTopic === targetTopicId;
    }
    const aliases = MALAYALAM_TOPIC_ALIASES[targetTopicId] || [targetTopicId];
    return aliases.includes(qTopic);
  };

  const getFilteredPool = () => {
    if (isRepeatOnlyMode) {
      return [...currentSubjectRepeatQueue];
    }
    if (selectedTopic === 'all') {
      return [...currentQuestionBank];
    }
    return currentQuestionBank.filter(q => matchesTopic(q.topic, selectedTopic));
  };

  const loadNextQuestion = (resetHistory = false) => {
    setIsAnswered(false);
    setSelectedOption(null);

    const pool = getFilteredPool();

    if (pool.length === 0) {
      setCurrentQuestion(null);
      return;
    }

    let nextQ = null;
    let isRepeat = false;

    if (isRepeatOnlyMode) {
      // In Mistake Queue mode: pick from currentSubjectRepeatQueue without immediate repeats
      const candidates = currentSubjectRepeatQueue.length > 1
        ? currentSubjectRepeatQueue.filter(q => q.id !== currentQuestion?.id)
        : currentSubjectRepeatQueue;
      const randIndex = Math.floor(Math.random() * candidates.length);
      nextQ = candidates[randIndex];
      isRepeat = true;
    } else {
      // Regular mode: check if an upcoming repeat question for this subject is due
      // Must NOT be the question just answered or in the last 3 questions (spaced repetition)
      const eligibleUpcoming = userUpcomingRepeats.filter(q => {
        const isCurrentSubject = activeSubject === 'english'
          ? ENGLISH_QUESTION_BANK.some(eq => eq.id === q.id)
          : QUESTION_BANK.some(mq => mq.id === q.id);
        const wasRecentlyAsked = userHistory.slice(-3).includes(q.id);
        return isCurrentSubject && !wasRecentlyAsked;
      });

      if (eligibleUpcoming.length > 0 && Math.random() > 0.4) {
        nextQ = eligibleUpcoming[0];
        const updatedUpcoming = userUpcomingRepeats.filter(q => q.id !== nextQ.id);
        const updated = users.map(u => u.id === activeUserId ? { ...u, upcomingRepeats: updatedUpcoming } : u);
        persistUsers(updated);
        isRepeat = true;
        soundFX.playRepeatAlert();
      } else {
        // Pick question from topic pool, avoiding recent history and the current question
        const unasked = pool.filter(q => (resetHistory ? true : !userHistory.includes(q.id)) && q.id !== currentQuestion?.id);
        const fallback = pool.filter(q => q.id !== currentQuestion?.id);
        const selectionPool = unasked.length > 0 ? unasked : (fallback.length > 0 ? fallback : pool);
        const randIndex = Math.floor(Math.random() * selectionPool.length);
        nextQ = selectionPool[randIndex];
      }
    }

    if (nextQ) {
      // Randomize option order dynamically so correct answer position is always unpredictable
      const originalOptions = [...nextQ.options];
      const correctText = originalOptions[nextQ.answer];

      const shuffledOptions = [...originalOptions];
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
      }
      const newAnswerIndex = shuffledOptions.indexOf(correctText);

      setCurrentQuestion({
        ...nextQ,
        options: shuffledOptions,
        answer: newAnswerIndex,
        isRepeat
      });

      if (currentUser) {
        const updatedHistory = [...userHistory.slice(-20), nextQ.id];
        const updated = users.map(u => u.id === activeUserId ? { ...u, questionHistory: updatedHistory } : u);
        persistUsers(updated);
      }
    } else {
      setCurrentQuestion(null);
    }
  };

  // Load question when topic, mode, subject, or active user changes
  useEffect(() => {
    if (currentUser) {
      loadNextQuestion(true);
    }
  }, [selectedTopic, isRepeatOnlyMode, activeSubject, activeUserId]);

  const handleOptionSelect = (optionIndex) => {
    if (isAnswered || !currentQuestion || !currentUser) return;

    setIsAnswered(true);
    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === currentQuestion.answer;

    // Find topic ID for stats
    const matchedSyllabus = currentSyllabusTopics.find(t => t.id !== 'all' && matchesTopic(currentQuestion.topic, t.id));
    const topicIdKey = matchedSyllabus ? matchedSyllabus.id : currentQuestion.topic || 'other';

    const prevTopicStat = userStats.topicStats?.[topicIdKey] || { correct: 0, total: 0 };
    const newTopicStats = {
      ...(userStats.topicStats || {}),
      [topicIdKey]: {
        correct: isCorrect ? prevTopicStat.correct + 1 : prevTopicStat.correct,
        total: prevTopicStat.total + 1
      }
    };

    if (isCorrect) {
      soundFX.playCorrect();
      const newStreak = userStats.streak + 1;
      if (newStreak % 5 === 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      const updatedRepeatQueue = userRepeatQueue.filter(q => q.id !== currentQuestion.id);
      const updatedUpcoming = userUpcomingRepeats.filter(q => q.id !== currentQuestion.id);

      const updated = users.map(u => {
        if (u.id === activeUserId) {
          return {
            ...u,
            stats: {
              correct: u.stats.correct + 1,
              total: u.stats.total + 1,
              streak: newStreak,
              maxStreak: Math.max(u.stats.maxStreak || 0, newStreak),
              topicStats: newTopicStats
            },
            repeatQueue: updatedRepeatQueue,
            upcomingRepeats: updatedUpcoming
          };
        }
        return u;
      });
      persistUsers(updated);
    } else {
      soundFX.playWrong();

      const existsInRepeat = userRepeatQueue.some(q => q.id === currentQuestion.id);
      const updatedRepeatQueue = existsInRepeat ? userRepeatQueue : [...userRepeatQueue, currentQuestion];
      const existsInUpcoming = userUpcomingRepeats.some(q => q.id === currentQuestion.id);
      const updatedUpcoming = existsInUpcoming ? userUpcomingRepeats : [...userUpcomingRepeats, currentQuestion];

      const updated = users.map(u => {
        if (u.id === activeUserId) {
          return {
            ...u,
            stats: {
              ...u.stats,
              total: u.stats.total + 1,
              streak: 0,
              topicStats: newTopicStats
            },
            repeatQueue: updatedRepeatQueue,
            upcomingRepeats: updatedUpcoming
          };
        }
        return u;
      });
      persistUsers(updated);
    }
  };

  const currentTopicData = currentSyllabusTopics.find(t => t.id === selectedTopic) || currentSyllabusTopics[0];

  return (
    <div className="app-container">
      {/* Auth Modal when not logged in or switching */}
      {showAuthModal && (
        <AuthModal
          users={users}
          onSelectUser={handleSelectUser}
          onCreateUser={handleCreateUser}
        />
      )}

      {/* User Profile & Topic Mastery Modal */}
      {showProfileModal && currentUser && (
        <ProfileModal
          user={currentUser}
          activeSubject={activeSubject}
          onClose={() => setShowProfileModal(false)}
          onSwitchAccount={handleSwitchAccount}
          onResetProgress={handleResetProgress}
          onDeleteAccount={handleDeleteAccount}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Sidebar: Syllabus Topics */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-badge">
            <div className="brand-icon">{activeSubject === 'english' ? '🇬🇧' : '📚'}</div>
            <div>
              <h1 className="brand-title">
                {activeSubject === 'english' ? 'General English' : 'PSC Malayalam'}
              </h1>
              <div className="brand-subtitle">Official 10-Mark Syllabus Prep</div>
            </div>
          </div>
        </div>

        {/* Subject Switcher Tabs */}
        <div className="sidebar-subject-switcher">
          <button
            type="button"
            className={`subject-switch-btn ${activeSubject === 'malayalam' ? 'active' : ''}`}
            onClick={() => handleSwitchSubject('malayalam')}
          >
            <span>📚 Malayalam</span>
            <span className="subject-qcount">{QUESTION_BANK.length.toLocaleString()} Qs</span>
          </button>
          <button
            type="button"
            className={`subject-switch-btn ${activeSubject === 'english' ? 'active' : ''}`}
            onClick={() => handleSwitchSubject('english')}
          >
            <span>🇬🇧 English</span>
            <span className="subject-qcount">{ENGLISH_QUESTION_BANK.length.toLocaleString()} Qs</span>
          </button>
        </div>

        {/* User Card in Sidebar */}
        {currentUser && (
          <div className="sidebar-user-card" onClick={() => setShowProfileModal(true)} title="View profile & statistics">
            <div className="sidebar-user-avatar">{currentUser.avatar || '🎓'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser.name}</div>
              <div className="sidebar-user-exam">Aspirant Profile</div>
            </div>
            <span className="sidebar-user-action">⚙️</span>
          </div>
        )}

        {/* Repeat Queue Button */}
        <button
          className="repeat-queue-sidebar-btn"
          onClick={() => setShowRepeatModal(true)}
          title="Review and practice missed questions"
        >
          <span>🔁 Mistake Queue ({activeSubject === 'english' ? 'English' : 'Malayalam'})</span>
          <span className="repeat-badge-count">{currentSubjectRepeatQueue.length}</span>
        </button>

        {/* Topics List */}
        <div className="topics-list">
          {currentSyllabusTopics.map(topic => {
            const count = topic.id === 'all'
              ? currentQuestionBank.length
              : currentQuestionBank.filter(q => matchesTopic(q.topic, topic.id)).length;
            const isActive = selectedTopic === topic.id && !isRepeatOnlyMode;

            return (
              <button
                key={topic.id}
                className={`topic-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setIsRepeatOnlyMode(false);
                  setSelectedTopic(topic.id);
                  setMobileSidebarOpen(false);
                }}
              >
                <span className="topic-icon">{topic.icon}</span>
                <div className="topic-details">
                  <div className="topic-name">{topic.name}</div>
                  <div className="topic-count">{count} Questions</div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Main Practice Area */}
      <main className="quiz-main">
        {/* Top Navbar */}
        <header className="top-nav">
          <div className="top-nav-row-main">
            <div className="nav-left">
              {/* User Profile Badge */}
              {currentUser && (
                <button
                  className="user-nav-badge"
                  onClick={() => setShowProfileModal(true)}
                  title="View Profile and Topic Mastery Analytics"
                >
                  <span className="user-nav-avatar">{currentUser.avatar || '🎓'}</span>
                  <span className="user-nav-name">{currentUser.name}</span>
                </button>
              )}

              {/* Mobile Subject Toggle */}
              <div className="mobile-subject-nav-toggle mobile-only">
                <button
                  type="button"
                  className={`mob-subj-btn ${activeSubject === 'malayalam' ? 'active' : ''}`}
                  onClick={() => handleSwitchSubject('malayalam')}
                >
                  📚 Mal
                </button>
                <button
                  type="button"
                  className={`mob-subj-btn ${activeSubject === 'english' ? 'active' : ''}`}
                  onClick={() => handleSwitchSubject('english')}
                >
                  🇬🇧 Eng
                </button>
              </div>

              {/* Desktop View: Static Active Topic Pill */}
              <div className="current-topic-pill desktop-only">
                <span>{currentTopicData.icon}</span>
                <strong>{isRepeatOnlyMode ? '🔁 Mistake Queue Practice' : currentTopicData.name}</strong>
              </div>
            </div>

            <div className="nav-stats">
              <div className="stat-pill">
                <span>Score:</span>
                <span className="stat-value">{userStats.correct} / {userStats.total}</span>
              </div>

              {userStats.streak > 0 && (
                <div className="streak-badge" title="Consecutive Correct Streak">
                  🔥 {userStats.streak}
                </div>
              )}
            </div>
          </div>

          {/* Mobile View: Dedicated Themed Topic Dropdown */}
          <div className="mobile-topic-bar mobile-only">
            <button
              type="button"
              className={`custom-topic-trigger ${topicDropdownOpen ? 'active' : ''}`}
              onClick={() => setTopicDropdownOpen(!topicDropdownOpen)}
              aria-expanded={topicDropdownOpen}
            >
              <div className="trigger-left">
                <span className="trigger-icon">{isRepeatOnlyMode ? '🔁' : currentTopicData.icon}</span>
                <span className="trigger-name">{isRepeatOnlyMode ? 'Mistake Queue Practice' : currentTopicData.name}</span>
              </div>
              <span className={`trigger-chevron ${topicDropdownOpen ? 'open' : ''}`}>▾</span>
            </button>

            {/* Custom Themed Dropdown Menu */}
            {topicDropdownOpen && (
              <>
                <div
                  className="custom-dropdown-backdrop"
                  onClick={() => setTopicDropdownOpen(false)}
                />
                <div className="custom-topic-dropdown-menu">
                  <div className="dropdown-menu-header">
                    <span>Select Topic ({activeSubject === 'english' ? 'English' : 'Malayalam'})</span>
                    <button
                      className="dropdown-close-btn"
                      onClick={() => setTopicDropdownOpen(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="dropdown-options-list">
                    {/* All Topics */}
                    <div
                      className={`custom-dropdown-option ${selectedTopic === 'all' && !isRepeatOnlyMode ? 'selected' : ''}`}
                      onClick={() => {
                        setIsRepeatOnlyMode(false);
                        setSelectedTopic('all');
                        setTopicDropdownOpen(false);
                      }}
                    >
                      <span className="opt-icon">🎯</span>
                      <div className="opt-details">
                        <div className="opt-title">All Topics (Full Mock)</div>
                        <div className="opt-count">{currentQuestionBank.length} Questions</div>
                      </div>
                      {selectedTopic === 'all' && !isRepeatOnlyMode && <span className="opt-check">✓</span>}
                    </div>

                    {/* Mistake Queue Option */}
                    {currentSubjectRepeatQueue.length > 0 && (
                      <div
                        className={`custom-dropdown-option repeat-option ${isRepeatOnlyMode ? 'selected' : ''}`}
                        onClick={() => {
                          setIsRepeatOnlyMode(true);
                          setTopicDropdownOpen(false);
                        }}
                      >
                        <span className="opt-icon">🔁</span>
                        <div className="opt-details">
                          <div className="opt-title">Mistake Queue</div>
                          <div className="opt-count">{currentSubjectRepeatQueue.length} Questions</div>
                        </div>
                        {isRepeatOnlyMode && <span className="opt-check">✓</span>}
                      </div>
                    )}

                    <div className="dropdown-section-label">
                      {activeSubject === 'english' ? 'General English Topics (27)' : 'Malayalam Topics (13)'}
                    </div>

                    {/* All Subject Topics */}
                    {currentSyllabusTopics.filter(t => t.id !== 'all').map(topic => {
                      const count = currentQuestionBank.filter(q => matchesTopic(q.topic, topic.id)).length;
                      const isSelected = selectedTopic === topic.id && !isRepeatOnlyMode;

                      return (
                        <div
                          key={topic.id}
                          className={`custom-dropdown-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setIsRepeatOnlyMode(false);
                            setSelectedTopic(topic.id);
                            setTopicDropdownOpen(false);
                          }}
                        >
                          <span className="opt-icon">{topic.icon}</span>
                          <div className="opt-details">
                            <div className="opt-title">{topic.name}</div>
                            <div className="opt-count">{count} Questions</div>
                          </div>
                          {isSelected && <span className="opt-check">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Question Viewport */}
        <div className="quiz-content-area">
          {currentQuestion ? (
            <div className="question-card">
              {/* Question Header & Badges */}
              <div className="card-top-bar">
                <span className="topic-badge">
                  {currentSyllabusTopics.find(t => matchesTopic(currentQuestion.topic, t.id))?.name || currentQuestion.topic || 'Practice Question'}
                </span>

                {currentQuestion.isRepeat && (
                  <div className="repeat-alert-banner">
                    🔁 Previously Missed Question — Practice until mastered!
                  </div>
                )}
              </div>

              {/* Question Text */}
              <div className="question-text">
                {currentQuestion.question}
              </div>

              {/* Options Grid */}
              <div className="options-grid">
                {currentQuestion.options.map((option, idx) => {
                  let optClass = 'option-btn';
                  if (isAnswered) {
                    if (idx === currentQuestion.answer) {
                      optClass += ' correct';
                    } else if (idx === selectedOption) {
                      optClass += ' wrong';
                    } else {
                      optClass += ' disabled';
                    }
                  }

                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={idx}
                      className={optClass}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswered}
                    >
                      <span className="option-letter">{optionLetters[idx]}</span>
                      <span className="option-text">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Feedback Card with Explanation */}
              {isAnswered && (
                <div className={`feedback-card ${selectedOption === currentQuestion.answer ? 'correct' : 'wrong'}`}>
                  {selectedOption === currentQuestion.answer ? (
                    <div className="feedback-title">
                      <span>🎉 Correct Answer!</span>
                    </div>
                  ) : (
                    <div className="feedback-title">
                      <span>❌ Incorrect</span>
                    </div>
                  )}

                  {selectedOption !== currentQuestion.answer && (
                    <div className="feedback-correct-answer">
                      Correct Answer: <strong>{currentQuestion.options[currentQuestion.answer]}</strong>
                    </div>
                  )}

                  <div className="explanation-box">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </div>

                  {selectedOption !== currentQuestion.answer && (
                    <div className="repeat-queue-notice">
                      ⚠️ Added to Mistake Queue — will reappear for spaced repetition.
                    </div>
                  )}

                  {selectedOption === currentQuestion.answer && currentQuestion.isRepeat && (
                    <div className="repeat-success-notice">
                      🌟 Mastered! Removed from Mistake Queue.
                    </div>
                  )}

                  <div className="action-buttons-row">
                    <button
                      className="next-btn"
                      onClick={() => loadNextQuestion()}
                    >
                      Next Question ➔
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3>Topic Completely Mastered!</h3>
              <p>No questions remaining in this filter. Switch topics or practice another syllabus section.</p>
              <button
                className="next-btn"
                onClick={() => {
                  setIsRepeatOnlyMode(false);
                  setSelectedTopic('all');
                }}
              >
                Switch to All Topics
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Repeat Queue Modal */}
      {showRepeatModal && (
        <div className="modal-overlay" onClick={() => setShowRepeatModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <span>🔁 Mistake & Repeat Queue ({activeSubject === 'english' ? 'English' : 'Malayalam'})</span>
                <span className="repeat-badge-count">{currentSubjectRepeatQueue.length}</span>
              </h2>
              <button className="close-btn" onClick={() => setShowRepeatModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              {currentSubjectRepeatQueue.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                  <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No Missed Questions in Queue!</h3>
                  <p>You have mastered all attempted questions in this subject. Any missed questions will automatically appear here for spaced repetition.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
                      Missed questions repeat during practice until mastered:
                    </p>
                    <button
                      className="next-btn"
                      style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => {
                        setShowRepeatModal(false);
                        setIsRepeatOnlyMode(true);
                      }}
                    >
                      Practice Missed Questions Only ➔
                    </button>
                  </div>

                  {currentSubjectRepeatQueue.map((item, idx) => (
                    <div key={item.id} className="mistake-card">
                      <div className="mistake-card-q">
                        {idx + 1}. {item.question}
                      </div>
                      <div className="mistake-card-ans">
                        Correct Answer: {item.options[item.answer]}
                      </div>
                      <div className="mistake-card-exp">
                        {item.explanation}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
