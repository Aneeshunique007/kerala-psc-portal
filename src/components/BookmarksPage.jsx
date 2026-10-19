import React, { useState, useMemo, useEffect, useRef } from 'react';
import FormattedQuestion from './FormattedQuestion';
import {
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  EyeIcon,
  EyeOffIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  AlertTriangleIcon,
  InfoIcon,
  ArrowRightIcon,
  ChevronDownIcon
} from './Icons';

const ITEMS_PER_PAGE = 8;

// Official syllabus & PYQ topic tabs in requested order:
// 1. Malayalam
// 2. General English
// 3. All PYQ GK/Maths topics one by one
const BOOKMARK_TOPIC_TABS = [
  { id: 'malayalam', label: 'Malayalam' },
  { id: 'english', label: 'General English' },
  { id: 'pq_history', label: 'History (ചരിത്രം)' },
  { id: 'pq_geography', label: 'Geography (ഭൂമിശാസ്ത്രം)' },
  { id: 'pq_economics', label: 'Economics (ധനതത്വം)' },
  { id: 'pq_constitution', label: 'Constitution (ഭരണഘടന)' },
  { id: 'pq_kerala_governance', label: 'Kerala Governance (ഭരണം)' },
  { id: 'pq_science', label: 'General Science (സയൻസ്)' },
  { id: 'pq_arts_sports', label: 'Arts & Sports (കല, കായികം)' },
  { id: 'pq_computer', label: 'Computer (കമ്പ്യൂട്ടർ)' },
  { id: 'pq_acts_laws', label: 'Acts & Laws (നിയമങ്ങൾ)' },
  { id: 'pq_current_affairs', label: 'Current Affairs (ആനുകാലികം)' },
  { id: 'pq_maths', label: 'Maths & Mental Ability (കണക്ക്)' }
];

function matchesBookmarkTopic(q, tabId) {
  if (tabId === 'malayalam') {
    return q.subject === 'malayalam' || q.topic === 'pq_malayalam' || q.topic === 'malayalam';
  }
  if (tabId === 'english') {
    return q.subject === 'english' || q.topic === 'pq_english' || q.topic === 'english';
  }
  if (tabId === 'other') {
    return !BOOKMARK_TOPIC_TABS.some(t => matchesBookmarkTopic(q, t.id));
  }
  return q.topic === tabId;
}

export default function BookmarksPage({
  bookmarkedQuestions = [],
  onRemoveBookmark,
  onClearAll,
  onBack,
  onPracticeTopic,
  syllabusTopics = [],
  englishTopics = [],
  pyqTopics = []
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selfTestMode, setSelfTestMode] = useState(false); // hides answers until revealed
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if any bookmarked question has an unclassified topic
  const unclassifiedCount = useMemo(() => {
    return bookmarkedQuestions.filter(q => !BOOKMARK_TOPIC_TABS.some(t => matchesBookmarkTopic(q, t.id))).length;
  }, [bookmarkedQuestions]);

  const activeTabsList = useMemo(() => {
    if (unclassifiedCount > 0) {
      return [...BOOKMARK_TOPIC_TABS, { id: 'other', label: 'Other Papers' }];
    }
    return BOOKMARK_TOPIC_TABS;
  }, [unclassifiedCount]);

  // Topic counts across all tabs
  const counts = useMemo(() => {
    const res = {};
    activeTabsList.forEach(t => {
      res[t.id] = bookmarkedQuestions.filter(q => matchesBookmarkTopic(q, t.id)).length;
    });
    return res;
  }, [bookmarkedQuestions, activeTabsList]);

  // Only topics that actually have saved bookmarks (hides all empty 0 bookmarks topics)
  const availableTopics = useMemo(() => {
    const list = activeTabsList.filter(t => (counts[t.id] || 0) > 0);
    if (list.length === 0) {
      return activeTabsList.slice(0, 1);
    }
    return list;
  }, [activeTabsList, counts]);

  // Default active tab to first tab with bookmarks, otherwise 'malayalam'
  const [activeTopic, setActiveTopic] = useState(() => {
    const found = BOOKMARK_TOPIC_TABS.find(t =>
      bookmarkedQuestions.some(q => matchesBookmarkTopic(q, t.id))
    );
    return found ? found.id : 'malayalam';
  });

  // Automatically update active topic if current topic no longer has bookmarks
  useEffect(() => {
    if (bookmarkedQuestions.length > 0 && availableTopics.length > 0) {
      const exists = availableTopics.some(t => t.id === activeTopic);
      if (!exists) {
        setActiveTopic(availableTopics[0].id);
      }
    }
  }, [availableTopics, activeTopic, bookmarkedQuestions.length]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.quiz-content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter questions based on activeTopic & search query
  const filteredQuestions = useMemo(() => {
    let list = bookmarkedQuestions.filter(q => matchesBookmarkTopic(q, activeTopic));

    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase().trim();
      list = list.filter(q => {
        const questionText = (q.question || '').toLowerCase();
        const explanationText = (q.explanation || '').toLowerCase();
        const optionsText = (Array.isArray(q.options)
          ? q.options.join(' ')
          : Object.values(q.options || {}).join(' ')
        ).toLowerCase();
        const topicText = (q.topic || '').toLowerCase();
        const qpText = (q.qp_code || '').toLowerCase();
        return (
          questionText.includes(qLower) ||
          explanationText.includes(qLower) ||
          optionsText.includes(qLower) ||
          topicText.includes(qLower) ||
          qpText.includes(qLower)
        );
      });
    }

    return list;
  }, [bookmarkedQuestions, activeTopic, searchQuery]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE));

  // Reset or adjust current page if list shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTopic, searchQuery]);

  // Slice for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleReveal = (id) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('.quiz-content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to get human-readable topic name
  const getTopicName = (q) => {
    if (q.subject === 'malayalam') {
      const found = syllabusTopics.find(t => t.id === q.topic);
      return found ? found.name : (q.topic || 'Malayalam');
    }
    if (q.subject === 'english') {
      const found = englishTopics.find(t => t.id === q.topic);
      return found ? found.name : (q.topic || 'General English');
    }
    if (q.subject === 'pyq') {
      const found = pyqTopics.find(t => t.id === q.topic);
      if (found) return found.name;
      return q.year ? `${q.year} Exam Paper` : (q.qp_code ? `QP: ${q.qp_code}` : 'Previous Year Paper');
    }
    return q.topic || 'Practice Question';
  };

  // Normalize options into [{ letter: 'A', text: '...', isCorrect: boolean }]
  const getNormalizedOptions = (q) => {
    const optionLetters = ['A', 'B', 'C', 'D'];
    if (Array.isArray(q.options)) {
      return q.options.map((optText, idx) => {
        const letter = optionLetters[idx] || String.fromCharCode(65 + idx);
        const isCorrect =
          (typeof q.answer === 'number' && q.answer === idx) ||
          (typeof q.answer === 'string' &&
            (q.answer === letter ||
              q.answer.toUpperCase() === letter ||
              q.answer === String(idx)));
        return { letter, text: optText, isCorrect };
      });
    } else if (q.options && typeof q.options === 'object') {
      return optionLetters.map((letter, idx) => {
        const optText = q.options[letter] || q.options[letter.toLowerCase()] || q.options[idx] || q.options[String(idx)];
        if (!optText) return null;
        const isCorrect =
          (typeof q.answer === 'number' && q.answer === idx) ||
          (typeof q.answer === 'string' &&
            (q.answer === letter ||
              q.answer.toUpperCase() === letter ||
              q.answer === String(idx)));
        return { letter, text: optText, isCorrect };
      }).filter(Boolean);
    }
    return [];
  };

  return (
    <div className="bmark-sheet-container">
      {/* Top Header Banner - Clean, integrated, non-card header */}
      <header className="bmark-sheet-header">
        <div className="bmark-header-top-row">
          <div className="bmark-header-left">
            <button
              type="button"
              className="bmark-back-btn"
              onClick={onBack}
              title="Return to previous screen"
            >
              <ChevronLeftIcon size={16} />
              <span>Back</span>
            </button>
            <div className="bmark-title-block">
              <div className="bmark-title-row">
                <div className="bmark-badge-pill">
                  <BookmarkIcon size={13} />
                  <span>Revision Sheet</span>
                </div>
                <h1 className="bmark-title-text">Bookmarks</h1>
                <span className="bmark-count-tag">
                  {bookmarkedQuestions.length} {bookmarkedQuestions.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="bmark-subtitle">
                Continuous revision sheet with verified answers and explanations.
              </p>
            </div>
          </div>

          <div className="bmark-header-actions">
            {bookmarkedQuestions.length > 0 && (
              <>
                <button
                  type="button"
                  className={`bmark-mode-btn ${selfTestMode ? 'active' : ''}`}
                  onClick={() => setSelfTestMode(!selfTestMode)}
                  title="Hide answers by default so you can test yourself before revealing"
                >
                  {selfTestMode ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
                  <span>{selfTestMode ? 'Answers Visible' : 'Self-Test Mode'}</span>
                </button>
                <button
                  type="button"
                  className="bmark-clear-btn"
                  onClick={() => setShowClearConfirm(true)}
                  title="Remove all bookmarks"
                >
                  <TrashIcon size={14} />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter bar and Search bar */}
        {bookmarkedQuestions.length > 0 && (
          <div className="bmark-filter-toolbar">
            {/* Unified Themed Topic Dropdown (Same design as master portal dropdown) */}
            <div className="bmark-topic-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className={`custom-topic-trigger bmark-topic-trigger ${isDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                title="Filter bookmarks by topic"
              >
                <div className="trigger-left">
                  <span className="trigger-icon">
                    <BookmarkIcon size={15} />
                  </span>
                  <span className="trigger-name">
                    {activeTabsList.find(t => t.id === activeTopic)?.label || 'All Topics'}
                  </span>
                  <span className="bmark-trigger-count-pill">
                    {counts[activeTopic] || 0}
                  </span>
                </div>
                <ChevronDownIcon size={15} className={`trigger-chevron ${isDropdownOpen ? 'open' : ''}`} />
              </button>

              {/* Custom Themed Dropdown Menu & Smooth Backdrop */}
              {isDropdownOpen && (
                <>
                  <div
                    className="custom-dropdown-backdrop"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="custom-topic-dropdown-menu bmark-dropdown-menu" role="listbox">
                    <div className="dropdown-menu-header">
                      <span>Saved Topics ({availableTopics.length})</span>
                      <button
                        type="button"
                        className="dropdown-close-btn"
                        onClick={() => setIsDropdownOpen(false)}
                        aria-label="Close topic selector"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="dropdown-options-list">
                      {availableTopics.map((tab) => {
                        const count = counts[tab.id] || 0;
                        const isSelected = activeTopic === tab.id;
                        return (
                          <div
                            key={tab.id}
                            role="option"
                            aria-selected={isSelected}
                            className={`custom-dropdown-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setActiveTopic(tab.id);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="opt-icon">
                              <span
                                className="topic-accent-dot"
                                style={{ background: isSelected ? '#f43f5e' : '#38bdf8' }}
                              />
                            </span>
                            <div className="opt-details">
                              <div className="opt-title">{tab.label}</div>
                              <div className="opt-count">
                                <span>{count} {count === 1 ? 'bookmark' : 'bookmarks'}</span>
                              </div>
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

            {/* Search Input */}
            <div className="bmark-search-wrap">
              <SearchIcon size={14} className="bmark-search-icon" />
              <input
                type="text"
                className="bmark-sheet-search"
                placeholder="Search questions, topics, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="bmark-search-clear"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <XIcon size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Confirmation Modal for Clearing All */}
      {showClearConfirm && (
        <div className="bmark-modal-overlay">
          <div className="bmark-modal-card">
            <div className="bmark-modal-icon">
              <AlertTriangleIcon size={32} />
            </div>
            <h3>Clear All Bookmarks?</h3>
            <p>
              Are you sure you want to remove all <strong>{bookmarkedQuestions.length}</strong> bookmarks? This action cannot be undone.
            </p>
            <div className="bmark-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="bmark-sheet-body">
        {bookmarkedQuestions.length === 0 ? (
          /* Empty state: No bookmarks at all */
          <div className="bmark-empty-state">
            <div className="bmark-empty-icon-circle">
              <BookmarkIcon size={36} />
            </div>
            <h2 className="bmark-empty-title">Your Bookmarks Library is Empty</h2>
            <p className="bmark-empty-desc">
              Whenever you encounter a challenging question while practicing, click the Bookmark button to save it here for fast revision.
            </p>
            <button
              type="button"
              className="btn btn-primary bmark-empty-cta"
              onClick={onBack}
            >
              <span>Continue Practicing</span>
              <ArrowRightIcon size={15} />
            </button>
          </div>
        ) : filteredQuestions.length === 0 ? (
          /* Filtered empty state */
          <div className="bmark-empty-state">
            <div className="bmark-empty-icon-circle">
              <SearchIcon size={34} />
            </div>
            <h2 className="bmark-empty-title">
              {searchQuery ? 'No Matching Bookmarks Found' : `No Bookmarks in ${activeTabsList.find(t => t.id === activeTopic)?.label || 'This Topic'}`}
            </h2>
            <p className="bmark-empty-desc">
              {searchQuery
                ? `No bookmarked questions match your search "${searchQuery}" in this topic.`
                : `You haven't bookmarked any questions under this topic yet. Select another topic above or bookmark questions during practice.`}
            </p>
            {searchQuery ? (
              <button
                type="button"
                className="btn btn-secondary bmark-empty-cta"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary bmark-empty-cta"
                onClick={onBack}
              >
                <span>Continue Practicing</span>
                <ArrowRightIcon size={15} />
              </button>
            )}
          </div>
        ) : (
          <div className="bmark-paper-sheet">
            {/* Sheet Metadata / Status Bar */}
            <div className="bmark-sheet-meta-bar">
              <div className="bmark-meta-summary">
                Showing questions <strong>{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredQuestions.length)}</strong> of <strong>{filteredQuestions.length}</strong>
                {totalPages > 1 && (
                  <span className="bmark-meta-page-tag"> (Page {currentPage} of {totalPages})</span>
                )}
              </div>

              {selfTestMode && (
                <div className="bmark-self-test-notice">
                  <InfoIcon size={13} />
                  <span>Self-test mode: click "Reveal Answer" on any question to check</span>
                </div>
              )}
            </div>

            {/* Continuous Numbered Question Paper Sheet */}
            <div className="bmark-questions-sheet-list">
              {paginatedQuestions.map((q, idx) => {
                const globalIndex = startIndex + idx + 1;
                const isRevealed = !selfTestMode || revealedIds.has(q.id);

                return (
                  <article key={q.id || globalIndex} className="bmark-sheet-item">
                    {/* Item Meta & Header */}
                    <div className="bmark-item-header">
                      <div className="bmark-item-meta-row">
                        <span className="bmark-item-num">Q{globalIndex}.</span>

                        {q.subject && (
                          <span className={`bmark-pill bmark-pill-${q.subject}`}>
                            {q.subject === 'malayalam' && 'Malayalam'}
                            {q.subject === 'english' && 'English'}
                            {q.subject === 'pyq' && (q.year ? `${q.year} PYQ` : 'PYQ Exam')}
                          </span>
                        )}

                        <span className="bmark-pill bmark-pill-topic" title={getTopicName(q)}>
                          {getTopicName(q)}
                        </span>

                        {q.qp_code && (
                          <span className="bmark-pill bmark-pill-qp" title="Original Kerala PSC Question Paper Code">
                            QP: {q.qp_code}
                          </span>
                        )}
                      </div>

                      <div className="bmark-item-actions">
                        {onPracticeTopic && (
                          <button
                            type="button"
                            className="bmark-action-practice"
                            onClick={() => onPracticeTopic(q.subject || 'malayalam', q.topic || 'all', q)}
                            title="Practice this topic in quiz mode"
                          >
                            <span>Practice Topic</span>
                            <ArrowRightIcon size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="bmark-action-remove"
                          onClick={() => onRemoveBookmark(q.id)}
                          title="Remove bookmark"
                        >
                          <TrashIcon size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="bmark-sheet-question">
                      <FormattedQuestion text={q.question} />
                    </div>

                    {/* Compact Options List (Clean, non-card typography) */}
                    <div className="bmark-sheet-options">
                      {getNormalizedOptions(q).map((opt) => {
                        const isCorrectAnswer = isRevealed && opt.isCorrect;
                        return (
                          <div
                            key={opt.letter}
                            className={`bmark-sheet-opt ${isCorrectAnswer ? 'correct' : ''}`}
                          >
                            <span className="bmark-opt-prefix">({opt.letter})</span>
                            <span className="bmark-opt-body">{opt.text}</span>
                            {isCorrectAnswer && (
                              <span className="bmark-opt-correct-tag">
                                <CheckIcon size={12} />
                                <span>Correct Answer</span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Self Test Reveal Toggle */}
                    {selfTestMode && !isRevealed && (
                      <div className="bmark-reveal-wrapper">
                        <button
                          type="button"
                          className="bmark-reveal-button"
                          onClick={() => toggleReveal(q.id)}
                        >
                          <EyeIcon size={14} />
                          <span>Reveal Answer &amp; Explanation</span>
                        </button>
                      </div>
                    )}

                    {/* Explanation Section */}
                    {isRevealed && q.explanation && (
                      <div className="bmark-sheet-explanation">
                        <div className="bmark-exp-label">
                          <InfoIcon size={14} />
                          <strong>Explanation / വിശദീകരണം:</strong>
                        </div>
                        <div className="bmark-exp-text">
                          {q.explanation}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Pagination Navigation Bar - Always visible when totalPages > 1 */}
            {totalPages > 1 && (
              <nav className="bmark-sheet-pagination" aria-label="Bookmarks page navigation">
                <button
                  type="button"
                  className="bmark-page-btn bmark-page-arrow"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  title="Previous Page"
                >
                  <ChevronLeftIcon size={15} />
                  <span>Previous</span>
                </button>

                <div className="bmark-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isFirst = pageNum === 1;
                    const isLast = pageNum === totalPages;
                    const isNearCurrent = Math.abs(pageNum - currentPage) <= 1;

                    if (isFirst || isLast || isNearCurrent) {
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          className={`bmark-page-num ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return (
                        <span key={pageNum} className="bmark-page-dots">
                          …
                        </span>
                      );
                    }

                    return null;
                  })}
                </div>

                <button
                  type="button"
                  className="bmark-page-btn bmark-page-arrow"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title="Next Page"
                >
                  <span>Next</span>
                  <ChevronRightIcon size={15} />
                </button>
              </nav>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

