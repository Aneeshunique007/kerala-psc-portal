import React, { useState, useMemo, useRef, useEffect } from 'react';
import FormattedQuestion from './FormattedQuestion';
import {
  RotateIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  SearchIcon,
  XIcon,
  CheckCircleIcon,
  BookmarkIcon,
  BookmarkFilledIcon
} from './Icons';
import {
  QUESTION_BANK,
  ENGLISH_QUESTION_BANK,
  CURRENT_AFFAIRS_QUESTION_BANK,
  PYQ_QUESTION_BANK
} from '../data/questions';

const SUBJECT_OPTIONS = [
  { id: 'all', label: 'All Subjects' },
  { id: 'current_affairs', label: 'Current Affairs (ആനുകാലികം)' },
  { id: 'pyq', label: 'Previous Year Questions (PYQ)' },
  { id: 'malayalam', label: 'Malayalam (മലയാളം)' },
  { id: 'english', label: 'General English' }
];

export default function ReviewQueuePage({
  repeatQueue = [],
  initialSubject = 'all',
  onBack,
  onToggleBookmark,
  isBookmarked
}) {
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Fast ID sets for each question bank
  const { caSet, engSet, malSet, pyqSet } = useMemo(() => {
    const ca = new Set((CURRENT_AFFAIRS_QUESTION_BANK || []).map(q => q.id));
    const eng = new Set((ENGLISH_QUESTION_BANK || []).map(q => q.id));
    const mal = new Set((QUESTION_BANK || []).map(q => q.id));
    const pyq = new Set((PYQ_QUESTION_BANK || []).map(q => q.id));
    return { caSet: ca, engSet: eng, malSet: mal, pyqSet: pyq };
  }, []);

  // Precise subject detection function
  const getSubject = (q) => {
    if (!q) return 'malayalam';
    if (q.subject === 'current_affairs') return 'current_affairs';
    if (q.subject === 'english') return 'english';
    if (q.subject === 'pyq') return 'pyq';
    if (q.subject === 'malayalam') return 'malayalam';

    const id = String(q.id || '');
    const topic = String(q.topic || '');

    // PYQ checks (includes past paper current affairs questions)
    if (id.startsWith('pyq_') || pyqSet.has(id) || q.qp_code || id.includes('_202') || (topic.startsWith('pq_') && !id.startsWith('ca_'))) {
      return 'pyq';
    }

    // Standalone Current Affairs checks
    if (id.startsWith('ca_') || caSet.has(id) || topic.startsWith('ca_')) {
      return 'current_affairs';
    }

    // English checks
    if (id.startsWith('eng_') || topic.startsWith('eng_') || topic === 'english' || engSet.has(id)) {
      return 'english';
    }

    // Malayalam checks
    if (malSet.has(id) || id.startsWith('mal_') || topic.startsWith('vyakaranam') || topic.startsWith('sahithyam')) {
      return 'malayalam';
    }

    return 'malayalam';
  };

  // Compute counts per subject
  const subjectCounts = useMemo(() => {
    const counts = { all: repeatQueue.length, current_affairs: 0, pyq: 0, malayalam: 0, english: 0 };
    repeatQueue.forEach(q => {
      const subj = getSubject(q);
      if (counts[subj] !== undefined) {
        counts[subj]++;
      }
    });
    return counts;
  }, [repeatQueue, caSet, engSet, malSet, pyqSet]);

  // Filter questions by subject and search
  const filteredQuestions = useMemo(() => {
    return repeatQueue.filter(item => {
      const itemSubj = getSubject(item);
      if (selectedSubject !== 'all' && itemSubj !== selectedSubject) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const qText = (item.question || '').toLowerCase();
        const aText = (item.options?.[item.answer] || item.answer || '').toLowerCase();
        return qText.includes(query) || aText.includes(query);
      }
      return true;
    });
  }, [repeatQueue, selectedSubject, searchQuery, caSet, engSet, malSet, pyqSet]);

  const currentSubjectOption = SUBJECT_OPTIONS.find(s => s.id === selectedSubject) || SUBJECT_OPTIONS[0];

  return (
    <div className="retrain-hub-page">
      {/* Page Header */}
      <header className="retrain-page-header">
        <div className="retrain-header-main">
          <div className="retrain-title-group">
            <h1 className="retrain-page-title">
              Review Page
            </h1>
            <p className="retrain-subtitle">
              Spaced review and repetition for missed questions to achieve complete mastery.
            </p>
          </div>

          <button
            type="button"
            className="retrain-back-button"
            onClick={onBack}
            title="Return to previous screen"
          >
            <ChevronLeftIcon size={16} />
            <span>Back</span>
          </button>
        </div>

        {/* Filter Toolbar (Unified Themed Dropdown + Search) */}
        <div className="bmark-filter-toolbar" style={{ marginTop: '1.25rem' }}>
          <div className="bmark-topic-dropdown-container" ref={dropdownRef}>
            <button
              type="button"
              className={`custom-topic-trigger bmark-topic-trigger ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              title="Filter review questions by subject"
            >
              <div className="trigger-left">
                <span className="trigger-icon">
                  <RotateIcon size={15} />
                </span>
                <span className="trigger-name">
                  {currentSubjectOption.label}
                </span>
                <span className="bmark-trigger-count-pill">
                  {filteredQuestions.length}
                </span>
              </div>
              <ChevronDownIcon size={15} className={`trigger-chevron ${isDropdownOpen ? 'open' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="custom-dropdown-backdrop"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="custom-topic-dropdown-menu bmark-dropdown-menu" role="listbox">
                  <div className="dropdown-menu-header">
                    <span>Select Subject</span>
                    <button
                      type="button"
                      className="dropdown-close-btn"
                      onClick={() => setIsDropdownOpen(false)}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="dropdown-options-list">
                    {SUBJECT_OPTIONS.map(opt => {
                      const count = subjectCounts[opt.id] || 0;
                      const isSelected = selectedSubject === opt.id;
                      return (
                        <div
                          key={opt.id}
                          role="option"
                          aria-selected={isSelected}
                          className={`custom-dropdown-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedSubject(opt.id);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span className="opt-icon">
                            <span className="topic-accent-dot" />
                          </span>
                          <div className="opt-details">
                            <div className="opt-title">{opt.label}</div>
                            <div className="opt-count">
                              <span>{count} {count === 1 ? 'question' : 'questions'}</span>
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
              placeholder="Search missed questions..."
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
      </header>

      {/* Questions Stack */}
      <main className="bmark-sheet-body" style={{ padding: '1.25rem 0' }}>
        {filteredQuestions.length === 0 ? (
          <div
            className="retrain-no-results"
            style={{
              padding: '3.5rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '14px',
              border: '1px dashed rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ marginBottom: '1rem', color: '#38bdf8', display: 'flex', justifyContent: 'center' }}>
              <CheckCircleIcon size={44} />
            </div>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.15rem' }}>
              No Missed Questions in Queue
            </h3>
            <p style={{ color: '#94a3b8', maxWidth: '420px', margin: '0 auto', fontSize: '0.9rem' }}>
              {searchQuery
                ? `No missed questions match "${searchQuery}".`
                : 'You have mastered all attempted questions in this subject! Missed questions will automatically appear here for spaced repetition.'}
            </p>
          </div>
        ) : (
          <div className="retrain-qa-stack">
            {filteredQuestions.map((item, idx) => {
              const rawAnswer = item.options && typeof item.answer === 'number'
                ? item.options[item.answer]
                : (item.answer || '');
              const cleanAns = (rawAnswer || '').replace(/^(\([A-Da-d]\)|[A-Da-d][.)]\s*)/, '').trim();
              const isQBookmarked = isBookmarked ? isBookmarked(item.id) : false;

              return (
                <article key={item.id || idx} className="retrain-qa-card">
                  <div className="retrain-qa-header">
                    <div className="retrain-qa-badges">
                      <span className="retrain-qa-number">#{idx + 1}</span>
                      {item.year && <span className="retrain-qa-badge">{item.year}</span>}
                    </div>

                    {onToggleBookmark && (
                      <button
                        type="button"
                        className={`retrain-bookmark-btn ${isQBookmarked ? 'bookmarked' : ''}`}
                        onClick={() => onToggleBookmark(item.id)}
                        title={isQBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
                      >
                        {isQBookmarked ? (
                          <BookmarkFilledIcon size={16} />
                        ) : (
                          <BookmarkIcon size={16} />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="retrain-qa-question">
                    <FormattedQuestion text={item.question} />
                  </div>

                  <div className="retrain-qa-answer-row">
                    <span className="retrain-qa-answer-label">Answer:</span>
                    <span className="retrain-qa-answer-text">{cleanAns}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
