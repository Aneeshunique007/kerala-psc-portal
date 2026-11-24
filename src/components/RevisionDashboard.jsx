import React, { useState, useMemo } from 'react';
import { ArrowRightIcon, SearchIcon, XIcon } from './Icons';

export default function RevisionDashboard({
  topics = [],
  questionBank = [],
  userSolvedSet = new Set(),
  onStartTopic
}) {
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' or 'scert'
  const [searchQuery, setSearchQuery] = useState('');

  const totalQuestions = questionBank.length;
  const masteredCount = questionBank.filter(q => userSolvedSet.has(q.id)).length;
  const overallPercent = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

  const scertClasses = [
    { std: 'Std 5', title: 'സാമൂഹ്യശാസ്ത്രം (Social Science)', engTitle: 'Social Science Standard 5', desc: 'ചരിത്രവും ഭൂമിശാസ്ത്രവും അടിസ്ഥാന വിവരങ്ങൾ • Early History & Earth' },
    { std: 'Std 6', title: 'സാമൂഹ്യശാസ്ത്രം (Social Science)', engTitle: 'Social Science Standard 6', desc: 'പ്രാചീന ലോകം, നദീതട സംസ്കാരങ്ങൾ & ഭൗമശാസ്ത്രം • Ancient Civilizations & Geography' },
    { std: 'Std 7', title: 'സാമൂഹ്യശാസ്ത്രം (Social Science)', engTitle: 'Social Science Standard 7', desc: 'മധ്യകാല ഇന്ത്യ, യൂറോപ്യൻ നവോത്ഥാനം • Medieval India & European Renaissance' },
    { std: 'Std 8', title: 'സാമൂഹ്യശാസ്ത്രം I & II', engTitle: 'Social Science I & II Standard 8', desc: 'ഇന്ത്യൻ സ്വാതന്ത്ര്യസമരം, ഭൂമിശാസ്ത്രം, പൗരനീതി • Indian Freedom Movement & Civics' },
    { std: 'Std 9', title: 'സാമൂഹ്യശാസ്ത്രം I & II', engTitle: 'Social Science I & II Standard 9', desc: 'ലോകചരിത്രം, ഇന്ത്യൻ ഭരണഘടന, സമ്പദ്‌വ്യവസ്ഥ • World History & Constitution' },
    { std: 'Std 10', title: 'സാമൂഹ്യശാസ്ത്രം I & II', engTitle: 'Social Science I & II Standard 10', desc: 'വിപ്ലവങ്ങൾ, കേരള ചരിത്രം, ദേശീയ പ്രസ്ഥാനം • Revolutions & Kerala History' },
  ];

  // Filter topics by English or Malayalam search keyword
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.trim().toLowerCase();
    return topics.filter(topic => {
      const matchName = String(topic.name || '').toLowerCase().includes(q);
      const matchEng = String(topic.englishName || '').toLowerCase().includes(q);
      const matchDesc = String(topic.desc || '').toLowerCase().includes(q);
      return matchName || matchEng || matchDesc;
    });
  }, [topics, searchQuery]);

  // Filter SCERT classes by search query
  const filteredScert = useMemo(() => {
    if (!searchQuery.trim()) return scertClasses;
    const q = searchQuery.trim().toLowerCase();
    return scertClasses.filter(item => {
      const matchStd = String(item.std || '').toLowerCase().includes(q);
      const matchTitle = String(item.title || '').toLowerCase().includes(q);
      const matchEng = String(item.engTitle || '').toLowerCase().includes(q);
      const matchDesc = String(item.desc || '').toLowerCase().includes(q);
      return matchStd || matchTitle || matchEng || matchDesc;
    });
  }, [scertClasses, searchQuery]);

  return (
    <div className="blueprint-dashboard-page revision-dashboard-page">
      {/* Hero Banner (Identical to Blueprint Dashboard) */}
      <div className="blueprint-hero">
        <div className="blueprint-hero-content">
          <div className="blueprint-hero-badge">
            <span className="badge-dot" />
            <span>Classroom Notes & Syllabus Revision • Kerala PSC</span>
          </div>

          <h1 className="blueprint-hero-title">
            Revision & Study Notes
          </h1>

          <p className="blueprint-hero-subtitle">
            Comprehensive topic-wise revision question bank from verified classroom notes and syllabus topics.
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
              <span className="hero-stat-label">Total Topics</span>
              <strong className="hero-stat-value">{topics.length} Topics</strong>
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
          className={`bp-tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          Revision Topics ({topics.length} Topics • {totalQuestions} Qs)
        </button>
        <button
          type="button"
          className={`bp-tab-btn ${activeTab === 'scert' ? 'active' : ''}`}
          onClick={() => setActiveTab('scert')}
        >
          SCERT Textbooks (Std 5–10) • Coming Soon
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
                : "Search SCERT textbooks (e.g. Std 10, ചരിത്രം, Social Science)..."
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
              ? `${filteredTopics.length} of ${topics.length} topics`
              : `${filteredScert.length} of ${scertClasses.length} standards`}
          </div>
        )}
      </div>

      {/* TAB 1: REVISION TOPICS */}
      {activeTab === 'topics' && (
        <div className="bp-section-card">
          <div className="bp-section-header">
            <div className="bp-section-title-wrap">
              <h2 className="bp-section-title">Verified Classroom Notes</h2>
              <p className="bp-section-desc">
                Select a topic below to start practicing questions. Search in English or Malayalam.
              </p>
            </div>
            <span className="bp-section-badge badge-gk">
              {filteredTopics.length} {filteredTopics.length === 1 ? 'Topic' : 'Topics'}
            </span>
          </div>

          {filteredTopics.length === 0 ? (
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
              {filteredTopics.map((topic, idx) => {
                const topicQuestions = questionBank.filter(q => q.topic === topic.id);
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
                          {/* Malayalam Heading */}
                          <h3 className="bp-topic-title">{topic.name}</h3>
                          {/* English Heading */}
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
        <div className="bp-section-card">
          <div className="bp-section-header">
            <div className="bp-section-title-wrap">
              <h2 className="bp-section-title">SCERT Textbooks (Std 5–10)</h2>
              <p className="bp-section-desc">
                Kerala State SCERT Social Science & General Studies questions and notes under preparation. Content will be added here soon.
              </p>
            </div>
            <span className="bp-section-badge badge-ca">Will be added later</span>
          </div>

          {filteredScert.length === 0 ? (
            <div className="revision-empty-search">
              <p>No SCERT textbooks matching <strong>"{searchQuery}"</strong></p>
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
              {filteredScert.map((item) => (
                <div key={item.std} className="bp-topic-card scert-preview-card">
                  <div className="bp-topic-top">
                    <div className="bp-topic-identity">
                      <span className="bp-topic-num-badge">{item.std}</span>
                      <div className="bp-topic-title-group">
                        <div className="bp-topic-subtag">SCERT Standard {item.std.replace(/\D/g, '')}</div>
                        <h3 className="bp-topic-title">{item.title}</h3>
                        {item.engTitle && (
                          <div className="bp-topic-eng-title">{item.engTitle}</div>
                        )}
                      </div>
                    </div>
                    <span className="bp-topic-marks-pill">Under Prep</span>
                  </div>

                  <p className="bp-topic-details">{item.desc}</p>

                  <div className="bp-topic-footer">
                    <span className="bp-topic-count">Questions under preparation</span>
                    <span className="scert-pending-label">Coming Soon</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
