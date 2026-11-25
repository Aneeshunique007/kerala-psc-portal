import React, { useState, useMemo } from 'react';
import { ArrowRightIcon, SearchIcon, XIcon } from './Icons';

export default function RevisionDashboard({
  topics = [],
  questionBank = [],
  userSolvedSet = new Set(),
  scertIncludeMaths = true,
  onToggleScertMaths,
  onStartTopic
}) {
  const [activeTab, setActiveTab] = useState('scert'); // Default to 'scert' or 'topics'
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to identify maths/numerical questions
  const isQuestionMaths = (q) => {
    return Boolean(q.is_maths || q.is_arithmetic || String(q.sub_topic || '').includes('arithmetic') || String(q.id || '').includes('_num_'));
  };

  // Active question bank respecting the scertIncludeMaths preference
  const activeQuestionBank = useMemo(() => {
    if (scertIncludeMaths) return questionBank;
    return questionBank.filter(q => {
      const isScert = String(q.topic || '').startsWith('scert_');
      if (isScert && isQuestionMaths(q)) return false;
      return true;
    });
  }, [questionBank, scertIncludeMaths]);

  // Split topics into Classroom Notes and SCERT Chapters
  const classroomTopics = useMemo(() => {
    return topics.filter(t => t.category !== 'scert');
  }, [topics]);

  const scertChapters = useMemo(() => {
    return topics.filter(t => t.category === 'scert');
  }, [topics]);

  // Overall Stats
  const totalQuestions = activeQuestionBank.length;
  const masteredCount = activeQuestionBank.filter(q => userSolvedSet.has(q.id)).length;
  const overallPercent = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

  const classroomTotalQs = useMemo(() => {
    const ids = new Set(classroomTopics.map(t => t.id));
    return activeQuestionBank.filter(q => ids.has(q.topic)).length;
  }, [classroomTopics, activeQuestionBank]);

  const scertTotalQs = useMemo(() => {
    const ids = new Set(scertChapters.map(t => t.id));
    return activeQuestionBank.filter(q => ids.has(q.topic)).length;
  }, [scertChapters, activeQuestionBank]);

  const totalScertMathsCount = useMemo(() => {
    const ids = new Set(scertChapters.map(t => t.id));
    return questionBank.filter(q => ids.has(q.topic) && isQuestionMaths(q)).length;
  }, [scertChapters, questionBank]);

  // Filter Classroom Topics
  const filteredClassroomTopics = useMemo(() => {
    if (!searchQuery.trim()) return classroomTopics;
    const q = searchQuery.trim().toLowerCase();
    return classroomTopics.filter(topic => {
      const matchName = String(topic.name || '').toLowerCase().includes(q);
      const matchEng = String(topic.englishName || '').toLowerCase().includes(q);
      const matchDesc = String(topic.desc || '').toLowerCase().includes(q);
      return matchName || matchEng || matchDesc;
    });
  }, [classroomTopics, searchQuery]);

  // Filter SCERT Chapters
  const filteredScertChapters = useMemo(() => {
    if (!searchQuery.trim()) return scertChapters;
    const q = searchQuery.trim().toLowerCase();
    return scertChapters.filter(topic => {
      const matchStd = String(topic.std || '').toLowerCase().includes(q);
      const matchName = String(topic.name || '').toLowerCase().includes(q);
      const matchEng = String(topic.englishName || '').toLowerCase().includes(q);
      const matchDesc = String(topic.desc || '').toLowerCase().includes(q);
      return matchStd || matchName || matchEng || matchDesc;
    });
  }, [scertChapters, searchQuery]);

  return (
    <div className="blueprint-dashboard-page revision-dashboard-page">
      {/* Hero Banner */}
      <div className="blueprint-hero">
        <div className="blueprint-hero-content">
          <div className="blueprint-hero-badge">
            <span className="badge-dot" />
            <span>Classroom Notes & SCERT Syllabus Revision • Kerala PSC</span>
          </div>

          <h1 className="blueprint-hero-title">
            Revision & Study Notes
          </h1>

          <p className="blueprint-hero-subtitle">
            Topic-wise revision question bank from verified classroom notes and official SCERT textbook chapters with full PSC pattern arithmetic problems.
          </p>

          <div className="blueprint-hero-stats">
            <div className="hero-stat-card">
              <span className="hero-stat-label">Total Questions</span>
              <strong className="hero-stat-value">{totalQuestions.toLocaleString()} Qs</strong>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-label">Questions Learned</span>
              <strong className="hero-stat-value">{masteredCount} / {totalQuestions}</strong>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-label">Active Chapters</span>
              <strong className="hero-stat-value">{topics.length} Chapters</strong>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-label">Overall Mastery</span>
              <strong className="hero-stat-value">{overallPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Options Switcher: Topics and SCERT */}
      <div className="blueprint-filter-tabs">
        <button
          type="button"
          className={`bp-tab-btn ${activeTab === 'scert' ? 'active' : ''}`}
          onClick={() => setActiveTab('scert')}
        >
          SCERT Textbooks ({scertChapters.length} Chapters • {scertTotalQs} Qs)
        </button>
        <button
          type="button"
          className={`bp-tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          Revision Topics ({classroomTopics.length} Topics • {classroomTotalQs} Qs)
        </button>
      </div>

      {/* Integrated Live Search Bar */}
      <div className="revision-search-toolbar">
        <div className="retrain-search-box">
          <SearchIcon size={15} className="search-icon" />
          <input
            type="text"
            className="retrain-search-input"
            placeholder={
              activeTab === 'topics'
                ? "Search topics in English or Malayalam (e.g. French, Napoleon, അമേരിക്ക, Simon Bolivar, 1688)..."
                : "Search SCERT textbooks (e.g. Std 9, Std 10, പ്രവൃത്തി, ഊർജ്ജം, യാന്ത്രികലാഭം, Physics)..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="retrain-search-clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <XIcon size={14} />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="retrain-results-counter">
            {activeTab === 'topics'
              ? `${filteredClassroomTopics.length} of ${classroomTopics.length} topics`
              : `${filteredScertChapters.length} of ${scertChapters.length} chapters`}
          </div>
        )}
      </div>

      {/* TAB 1: REVISION TOPICS (CLASSROOM NOTES) */}
      {activeTab === 'topics' && (
        <div className="bp-section-card">
          <div className="bp-section-header">
            <div className="bp-section-title-wrap">
              <h2 className="bp-section-title">Verified Classroom Notes</h2>
              <p className="bp-section-desc">
                World History & Revolutions classroom notes. Select a topic below to start practicing.
              </p>
            </div>
            <span className="bp-section-badge badge-gk">
              {filteredClassroomTopics.length} {filteredClassroomTopics.length === 1 ? 'Topic' : 'Topics'}
            </span>
          </div>

          {filteredClassroomTopics.length === 0 ? (
            <div className="revision-empty-search">
              <p>No topics matching <strong>"{searchQuery}"</strong></p>
              <button
                type="button"
                className="btn btn-secondary bp-tab-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="bp-topics-grid">
              {filteredClassroomTopics.map((topic, idx) => {
                const topicQuestions = activeQuestionBank.filter(q => q.topic === topic.id);
                const total = topicQuestions.length;
                const solved = topicQuestions.filter(q => userSolvedSet.has(q.id)).length;
                const topicPercent = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;
                const numStr = String(idx + 1).padStart(2, '0');

                return (
                  <div key={topic.id} className="bp-topic-card revision-bp-card">
                    <div className="bp-topic-top">
                      <div className="bp-topic-identity">
                        <span className="bp-topic-num-badge">{numStr}</span>
                        <div className="bp-topic-title-group">
                          <div className="bp-topic-subtag">Topic {idx + 1}</div>
                          <h3 className="bp-topic-title">{topic.name}</h3>
                          {topic.englishName && (
                            <div className="bp-topic-eng-title">{topic.englishName}</div>
                          )}
                        </div>
                      </div>
                      <span className="bp-topic-marks-pill">{total} Qs</span>
                    </div>

                    <p className="bp-topic-details">{topic.desc}</p>

                    <div className="revision-card-progress-section">
                      <div className="revision-card-progress-labels">
                        <span className="revision-card-learned-text">
                          <strong className="learned-highlight">{solved}</strong> / {total} Learned
                        </span>
                        <span className="revision-card-percent-text">{topicPercent}%</span>
                      </div>
                      <div className="revision-card-progress-bar">
                        <div
                          className="revision-card-progress-fill"
                          style={{ width: `${topicPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="bp-topic-footer">
                      <span className="bp-topic-count">{total} Qs available</span>
                      <button
                        type="button"
                        className="bp-practice-action-btn"
                        onClick={() => onStartTopic(topic.id)}
                        title={`Start practicing ${topic.name}`}
                      >
                        <span>Practice</span>
                        <ArrowRightIcon size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCERT TEXTBOOKS */}
      {activeTab === 'scert' && (
        <div className="scert-dashboard-view">
          <div className="bp-section-card">
            <div className="bp-section-header">
              <div className="bp-section-title-wrap">
                <h2 className="bp-section-title">SCERT Textbooks</h2>
                <p className="bp-section-desc">
                  Official SCERT syllabus textbook chapters with comprehensive theory, concepts & verified Kerala PSC arithmetic numerical problems.
                </p>
              </div>
              <span className="bp-section-badge badge-gk" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                {filteredScertChapters.length} Chapters Active
              </span>
            </div>

            {/* Maths & Numerical Problems Toggle Row */}
            <div className="pyq-maths-toggle-row revision-scert-maths-toggle">
              <label className="pyq-maths-checkbox-label">
                <input
                  type="checkbox"
                  className="pyq-maths-checkbox"
                  checked={scertIncludeMaths}
                  onChange={(e) => onToggleScertMaths && onToggleScertMaths(e.target.checked)}
                />
                <span className="pyq-maths-custom-checkbox">
                  {scertIncludeMaths && (
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="pyq-maths-checkbox-text">
                  Include Numerical & Arithmetic Problems (ഗണിത പ്രശ്നങ്ങൾ)
                </span>
              </label>
              <span className={`pyq-maths-status-badge ${scertIncludeMaths ? 'included' : 'excluded'}`}>
                {scertIncludeMaths ? `Maths Included (${totalScertMathsCount} Qs)` : 'Theory Only (No Maths)'}
              </span>
            </div>

            {filteredScertChapters.length === 0 ? (
              <div className="revision-empty-search">
                <p>No SCERT chapters matching <strong>"{searchQuery}"</strong></p>
                <button
                  type="button"
                  className="btn btn-secondary bp-tab-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="bp-topics-grid">
                {filteredScertChapters.map((chapter) => {
                  const chapterQuestions = activeQuestionBank.filter(q => q.topic === chapter.id);
                  const total = chapterQuestions.length;
                  const solved = chapterQuestions.filter(q => userSolvedSet.has(q.id)).length;
                  const chapterPercent = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;

                  const fullChapterQs = questionBank.filter(q => q.topic === chapter.id);
                  const mathsCount = fullChapterQs.filter(q => isQuestionMaths(q)).length;
                  const theoryCount = fullChapterQs.filter(q => !isQuestionMaths(q)).length;

                  return (
                    <div key={chapter.id} className="bp-topic-card revision-bp-card" style={{ borderLeft: '3px solid #10b981' }}>
                      <div className="bp-topic-top">
                        <div className="bp-topic-identity">
                          <span className="bp-topic-num-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                            {chapter.std || 'SCERT'}
                          </span>
                          <div className="bp-topic-title-group">
                            <div className="bp-topic-subtag">{chapter.section || chapter.std} • Kerala SCERT</div>
                            <h3 className="bp-topic-title">{chapter.name}</h3>
                            {chapter.englishName && (
                              <div className="bp-topic-eng-title">{chapter.englishName}</div>
                            )}
                          </div>
                        </div>
                        <span className="bp-topic-marks-pill" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                          {total} Qs
                        </span>
                      </div>

                      <p className="bp-topic-details">{chapter.desc}</p>

                      <div className="revision-card-progress-section">
                        <div className="revision-card-progress-labels">
                          <span className="revision-card-learned-text">
                            <strong className="learned-highlight">{solved}</strong> / {total} Learned
                          </span>
                          <span className="revision-card-percent-text">{chapterPercent}%</span>
                        </div>
                        <div className="revision-card-progress-bar">
                          <div
                            className="revision-card-progress-fill"
                            style={{ width: `${chapterPercent}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}
                          />
                        </div>
                      </div>

                      <div className="bp-topic-footer">
                        <span className="bp-topic-count">
                          {scertIncludeMaths
                            ? `${theoryCount} Theory + ${mathsCount} Numerical Qs`
                            : `Theory Only (${total} Qs)`}
                        </span>
                        <button
                          type="button"
                          className="bp-practice-action-btn"
                          style={{ background: 'linear-gradient(90deg, #059669, #10b981)' }}
                          onClick={() => onStartTopic(chapter.id)}
                          title={`Start practicing ${chapter.name}`}
                        >
                          <span>Practice</span>
                          <ArrowRightIcon size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
