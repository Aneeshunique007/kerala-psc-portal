import React, { useState, useMemo, useEffect } from 'react';
import {
  QUESTION_BANK,
  ENGLISH_QUESTION_BANK,
  CURRENT_AFFAIRS_QUESTION_BANK,
  PYQ_QUESTION_BANK
} from '../data/questions';
import FormattedQuestion from './FormattedQuestion';
import { cleanExplanation } from '../utils/cleanExplanation';
import { soundFX } from '../utils/soundEffects';
import {
  RotateIcon,
  ChevronLeftIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  LanguagesIcon,
  BookOpenIcon,
  CalendarIcon,
  BarChartIcon
} from './Icons';

// Professional Subject configurations
const SUBJECT_CONFIGS = [
  {
    id: 'pyq',
    shortLabel: 'PYQ',
    title: 'Previous Year Questions',
    IconComponent: FileTextIcon,
    accentColor: '#3b82f6',
    desc: 'Kerala PSC examination question papers across previous years'
  },
  {
    id: 'malayalam',
    shortLabel: 'MAL',
    title: 'Malayalam Language',
    IconComponent: LanguagesIcon,
    accentColor: '#10b981',
    desc: 'Malayalam grammar, vocabulary, literature and authors'
  },
  {
    id: 'english',
    shortLabel: 'ENG',
    title: 'General English',
    IconComponent: BookOpenIcon,
    accentColor: '#8b5cf6',
    desc: 'English grammar, vocabulary, concord and sentence structure'
  },
  {
    id: 'current_affairs',
    shortLabel: 'CA',
    title: 'Current Affairs',
    IconComponent: CalendarIcon,
    accentColor: '#f59e0b',
    desc: 'Current events, developments and updates for 2026'
  }
];

// Normalise a label like "(i)", "i.", "A)", "3." to a bare lowercase token
const normLabel = (s) => String(s || '').replace(/[().\s]/g, '').toLowerCase();

// For matching-table questions: rebuild the table so column B rows are
// arranged beside their correct column A rows. Returns null if not applicable
// or anything cannot be resolved (caller falls back to the normal layout).
const buildMatchedQuestion = (item) => {
  try {
    const text = item?.question;
    if (!text || !Array.isArray(item.options) || typeof item.answer !== 'number') return null;
    const ansStr = item.options[item.answer];
    if (!ansStr) return null;

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const tableLines = lines.filter(l => l.startsWith('|') && l.endsWith('|'));
    if (tableLines.length < 3) return null;
    const introLines = lines.filter(l => !(l.startsWith('|') && l.endsWith('|')));
    const splitRow = (r) => r.split('|').map(c => c.trim()).filter(Boolean);
    const labelOf = (cell) => {
      const m = cell.match(/^\(?([A-Za-z0-9]{1,6})[.)]\s*/);
      return m ? normLabel(m[1]) : null;
    };

    const allRows = tableLines.filter(l => !l.includes('---')).map(splitRow);
    const nCols = allRows[0].length;
    if (allRows.some(r => r.length !== nCols)) return null;

    // 3+ column tables: answers like "1-4-4, 2-3-3" (column A label - column B label - column C label ...)
    if (nCols >= 3) {
      const header = allRows[0];
      const rows = allRows.slice(1);
      const labelsByCol = Array.from({ length: nCols }, (_, c) => {
        const m = new Map();
        rows.forEach(r => { const l = labelOf(r[c]); if (l) m.set(l, r[c]); });
        return m;
      });
      if (labelsByCol.some(m => m.size !== rows.length)) return null;
      const chainRe = new RegExp(`[A-Za-z0-9]{1,6}(?:\\s*[-–—,:]\\s*[A-Za-z0-9]{1,6}){${nCols - 1}}`, 'g');
      const chains = [...String(ansStr).matchAll(chainRe)]
        .map(m => m[0].split(/\s*[-–—,:]\s*/).map(normLabel))
        .filter(c => c.length === nCols);
      if (chains.length !== rows.length) return null;
      const out = [];
      for (const r of rows) {
        const chain = chains.find(c => c[0] === labelOf(r[0]));
        if (!chain) return null;
        const cells = chain.map((l, c) => labelsByCol[c].get(l));
        if (cells.some(x => !x)) return null;
        out.push(`| ${cells.join(' | ')} |`);
      }
      return [
        ...introLines,
        '',
        `| ${header.join(' | ')} |`,
        `|${header.map(() => '---').join('|')}|`,
        ...out
      ].join('\n');
    }
    if (nCols !== 2) return null;

    // First row is a header unless it already looks like a labelled data row
    let header = allRows[0];
    let rows = allRows.slice(1);
    if (labelOf(header[0]) && labelOf(header[1])) {
      header = ['ലിസ്റ്റ് I', 'ലിസ്റ്റ് II'];
      rows = allRows;
    }
    // Rows whose left cell has no label but whose right cell does are extra
    // (distractor) items of column B; rows with neither label are sub-headers.
    const extraRights = rows.filter(r => !labelOf(r[0]) && labelOf(r[1])).map(r => r[1]);
    rows = rows.filter(r => labelOf(r[0]));
    if (rows.length < 2) return null;

    const leftLabels = rows.map(r => labelOf(r[0]));

    const rightByLabel = new Map();
    [...rows.map(r => r[1]), ...extraRights].forEach(c => {
      const l = labelOf(c);
      if (l) rightByLabel.set(l, c);
      const stripped = normLabel(c.replace(/^\(?[A-Za-z0-9]{1,6}[.)]\s*/, ''));
      if (stripped && !rightByLabel.has(stripped)) rightByLabel.set(stripped, c);
    });
    if (rightByLabel.size < rows.length) return null;

    let pairs = [...String(ansStr).matchAll(/\(?([A-Za-z0-9]{1,6})\)?\s*[-–—→=:]\s*\(?([A-Za-z0-9]{1,6})\)?/g)]
      .map(m => [normLabel(m[1]), normLabel(m[2])]);

    // Compact answers like "1D 2C 3A 4B"
    if (pairs.length !== rows.length) {
      pairs = [...String(ansStr).matchAll(/\b(\d)([A-Za-z])\b/g)]
        .map(m => [normLabel(m[1]), normLabel(m[2])]);
    }

    // Positional answers like "ii, iv, i, iii": k-th token matches k-th left row
    if (pairs.length !== rows.length) {
      let tokens = (String(ansStr).match(/[A-Za-z0-9]+/g) || []).map(normLabel);
      // Digits run together, e.g. "4513"
      if (tokens.length === 1 && /^\d+$/.test(tokens[0]) && tokens[0].length === rows.length) {
        tokens = tokens[0].split('');
      }
      if (tokens.length !== rows.length) return null;
      pairs = leftLabels.map((l, i) => [l, tokens[i]]);
    }

    const newRows = [];
    for (let i = 0; i < rows.length; i++) {
      const lbl = leftLabels[i];
      let right = null;
      for (const [x, y] of pairs) {
        if (x === lbl && rightByLabel.has(y)) { right = rightByLabel.get(y); break; }
        if (y === lbl && rightByLabel.has(x)) { right = rightByLabel.get(x); break; }
      }
      if (!right) return null;
      newRows.push(`| ${rows[i][0]} | ${right} |`);
    }

    return [
      ...introLines,
      '',
      `| ${header[0]} | ${header[1]} |`,
      '|---|---|',
      ...newRows
    ].join('\n');
  } catch {
    return null;
  }
};

export default function LearnedRetrainPage({
  currentUser,
  onBack,
  onToggleBookmark,
  isBookmarked,
  onSendToReviewQueue
}) {
  const [activeSubject, setActiveSubject] = useState('pyq');
  const [activeSetIndex, setActiveSetIndex] = useState(0); // 0 = Set 1, 1 = Set 2, etc.
  const [searchQuery, setSearchQuery] = useState('');

  // Active Retrain Session States
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainCurrentIndex, setRetrainCurrentIndex] = useState(0);
  const [retrainSelectedOption, setRetrainSelectedOption] = useState(null);
  const [optionScratchMarks, setOptionScratchMarks] = useState({});

  const [retrainIsAnswered, setRetrainIsAnswered] = useState(false);
  const [retrainScore, setRetrainScore] = useState({ correct: 0, wrong: 0 });
  const [retrainMissedList, setRetrainMissedList] = useState([]);
  const [retrainCompleted, setRetrainCompleted] = useState(false);
  const [queuedNotification, setQueuedNotification] = useState(null);

  // Fast mapping of all questions
  const { questionMap } = useMemo(() => {
    const map = new Map();

    (Array.isArray(QUESTION_BANK) ? QUESTION_BANK : []).forEach(q => {
      map.set(q.id, { ...q, subject: 'malayalam' });
    });

    (Array.isArray(ENGLISH_QUESTION_BANK) ? ENGLISH_QUESTION_BANK : []).forEach(q => {
      map.set(q.id, { ...q, subject: 'english' });
    });

    (Array.isArray(CURRENT_AFFAIRS_QUESTION_BANK) ? CURRENT_AFFAIRS_QUESTION_BANK : []).forEach(q => {
      map.set(q.id, { ...q, subject: 'current_affairs' });
    });

    (Array.isArray(PYQ_QUESTION_BANK) ? PYQ_QUESTION_BANK : []).forEach(q => {
      map.set(q.id, { ...q, subject: 'pyq' });
    });

    return { questionMap: map };
  }, []);

  // Separate learned questions by subject
  const learnedBySubject = useMemo(() => {
    const learnedIds = currentUser?.learnedQuestions || [];
    const grouped = {
      pyq: [],
      malayalam: [],
      english: [],
      current_affairs: []
    };

    learnedIds.forEach(id => {
      const q = questionMap.get(id);
      if (q) {
        const subj = q.subject || 'pyq';
        if (grouped[subj]) {
          grouped[subj].push(q);
        } else {
          grouped.pyq.push(q);
        }
      }
    });

    return grouped;
  }, [currentUser?.learnedQuestions, questionMap]);

  // Current Subject's learned list
  const currentSubjectList = useMemo(() => {
    return learnedBySubject[activeSubject] || [];
  }, [learnedBySubject, activeSubject]);

  // Calculate 100-question sets for the active subject
  // 100 questions -> 1 tab
  // 200 questions -> 2 tabs
  // 300 questions -> 3 tabs
  const sets = useMemo(() => {
    const total = currentSubjectList.length;
    if (total === 0) return [];

    const fullSetCount = Math.floor(total / 100);
    const remainder = total % 100;
    const result = [];

    for (let i = 0; i < fullSetCount; i++) {
      const start = i * 100;
      const end = (i + 1) * 100;
      result.push({
        setNumber: i + 1,
        label: `Set ${i + 1} (${start + 1} – ${end})`,
        shortLabel: `Set ${i + 1}`,
        rangeText: `${start + 1} – ${end}`,
        questions: currentSubjectList.slice(start, end),
        isComplete: true,
        count: 100
      });
    }

    if (remainder > 0) {
      const start = fullSetCount * 100;
      const end = total;
      result.push({
        setNumber: fullSetCount + 1,
        label: `Set ${fullSetCount + 1} (${start + 1} – ${end})`,
        shortLabel: `Set ${fullSetCount + 1}`,
        rangeText: `${start + 1} – ${end}`,
        questions: currentSubjectList.slice(start, end),
        isComplete: false,
        count: remainder
      });
    }

    return result;
  }, [currentSubjectList]);

  // Ensure active set index is within bounds
  useEffect(() => {
    if (activeSetIndex >= sets.length) {
      setActiveSetIndex(Math.max(0, sets.length - 1));
    }
    setSearchQuery('');
  }, [activeSubject, sets.length]);

  // Current set object
  const currentSet = sets[activeSetIndex] || null;

  // Filter questions within the set by search query
  const filteredSetQuestions = useMemo(() => {
    if (!currentSet) return [];
    if (!searchQuery.trim()) return currentSet.questions;

    const q = searchQuery.toLowerCase().trim();
    return currentSet.questions.filter(item => {
      const questionText = (item.question || '').toLowerCase();
      const optionsText = (item.options || []).join(' ').toLowerCase();
      const topicText = (item.topic || '').toLowerCase();
      const qpCodeText = (item.qp_code || '').toLowerCase();
      return (
        questionText.includes(q) ||
        optionsText.includes(q) ||
        topicText.includes(q) ||
        qpCodeText.includes(q)
      );
    });
  }, [currentSet, searchQuery]);

  // -------------------------------------------------------------
  // RETRAIN SESSION LOGIC (NO CHANGE AS REQUESTED)
  // -------------------------------------------------------------
  const startRetrainSession = () => {
    if (!currentSet?.questions?.length) return;

    setIsRetraining(true);
    setRetrainCurrentIndex(0);
    setRetrainSelectedOption(null);
    setRetrainIsAnswered(false);
    setRetrainScore({ correct: 0, wrong: 0 });
    setRetrainMissedList([]);
    setRetrainCompleted(false);
    setQueuedNotification(null);
  };

  const currentRetrainQuestion = currentSet?.questions?.[retrainCurrentIndex] || null;

  useEffect(() => {
    setOptionScratchMarks({});
  }, [currentRetrainQuestion?.id]);

  const handleRetrainOptionSelect = (index) => {
    if (retrainIsAnswered || !currentRetrainQuestion) return;

    setRetrainSelectedOption(index);
    setRetrainIsAnswered(true);

    const isCorrect = index === currentRetrainQuestion.answer;
    if (isCorrect) {
      soundFX.playCorrect();
      setRetrainScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      soundFX.playWrong();
      setRetrainScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      setRetrainMissedList(prev => [...prev, currentRetrainQuestion]);
    }
  };

  const handleRetrainNext = () => {
    if (!currentSet) return;
    const nextIdx = retrainCurrentIndex + 1;
    if (nextIdx < currentSet.questions.length) {
      setRetrainCurrentIndex(nextIdx);
      setRetrainSelectedOption(null);
      setRetrainIsAnswered(false);
    } else {
      setRetrainCompleted(true);
    }
  };

  const handleSendSingleToReview = (q) => {
    if (onSendToReviewQueue && q) {
      onSendToReviewQueue(q);
      setQueuedNotification(`Question added to Spaced Review Queue`);
      setTimeout(() => setQueuedNotification(null), 3000);
    }
  };

  const handleSendAllMissedToReview = () => {
    if (!onSendToReviewQueue || !retrainMissedList.length) return;
    retrainMissedList.forEach(q => onSendToReviewQueue(q));
    setQueuedNotification(`Added ${retrainMissedList.length} questions to Spaced Review Queue`);
    setTimeout(() => setQueuedNotification(null), 3500);
  };

  const activeSubjectConfig = SUBJECT_CONFIGS.find(s => s.id === activeSubject) || SUBJECT_CONFIGS[0];
  const ActiveSubjectIcon = activeSubjectConfig.IconComponent;

  // Helper to format clean answer text (without option letter prefix like C.)
  const getAnswerText = (item) => {
    if (!item) return '';
    let text = '';
    if (Array.isArray(item.options) && typeof item.answer === 'number') {
      text = item.options[item.answer] || '';
    } else if (typeof item.answer === 'string') {
      text = item.answer;
    }
    // Clean any leading letter prefixes like "A. ", "A) ", "(A) " if present
    return text.replace(/^(\([A-Da-d]\)|[A-Da-d][.)]\s*)/, '').trim();
  };

  return (
    <div className="retrain-hub-page">
      {/* -----------------------------------------------------------
          PAGE HEADER
          ----------------------------------------------------------- */}
      <header className="retrain-page-header">
        <div className="retrain-header-main">
          <div className="retrain-title-group">
            <h1 className="retrain-page-title">
              Retrain Hub
            </h1>
            <p className="retrain-subtitle">
              Mastered questions organized into modular 100-question retention sets.
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

        {/* -----------------------------------------------------------
            SUBJECT CATEGORY SELECTOR (PYQ | MAL | ENG | CA)
            ----------------------------------------------------------- */}
        <nav className="retrain-subject-tabs" aria-label="Subject Selection">
          {SUBJECT_CONFIGS.map(subj => {
            const count = (learnedBySubject[subj.id] || []).length;
            const fullSets = Math.floor(count / 100);
            const isActive = activeSubject === subj.id;
            const Icon = subj.IconComponent;

            return (
              <button
                key={subj.id}
                type="button"
                className={`retrain-subject-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveSubject(subj.id);
                  setActiveSetIndex(0);
                  setIsRetraining(false);
                }}
              >
                <div className="retrain-subject-icon-box">
                  <Icon size={18} />
                </div>
                <div className="retrain-subject-info">
                  <div className="retrain-subject-top">
                    <strong className="retrain-subject-short">{subj.shortLabel}</strong>
                    <span className="retrain-subject-badge">{count} Learned</span>
                  </div>
                  <span className="retrain-subject-tabs-count">
                    {count >= 100
                      ? `${fullSets} Tab${fullSets > 1 ? 's' : ''} (100 Qs)`
                      : `${count} of 100 to Set 1`}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </header>

      {/* -----------------------------------------------------------
          INTERACTIVE RETRAIN QUIZ SESSION (UNMODIFIED AS REQUESTED)
          ----------------------------------------------------------- */}
      {isRetraining && currentRetrainQuestion && !retrainCompleted && (
        <div className="retrain-session-container">
          <div className="retrain-session-card">
            {/* Top Bar */}
            <div className="retrain-session-top-bar">
              <div className="retrain-session-meta">
                <span className="retrain-tag">
                  {activeSubjectConfig.shortLabel} • {currentSet?.label}
                </span>
                <span className="retrain-counter">
                  Question <strong>{retrainCurrentIndex + 1}</strong> of <strong>{currentSet?.questions?.length}</strong>
                </span>
              </div>

              <div className="retrain-session-score-pill">
                <span className="score-correct">
                  <CheckIcon size={14} /> {retrainScore.correct}
                </span>
                <span className="score-wrong">
                  <XIcon size={14} /> {retrainScore.wrong}
                </span>
              </div>

              <button
                type="button"
                className="retrain-exit-btn"
                onClick={() => setIsRetraining(false)}
                title="Exit Retrain Session"
              >
                Exit Session
              </button>
            </div>

            {/* Progress Bar */}
            <div className="retrain-progress-track">
              <div
                className="retrain-progress-fill"
                style={{
                  width: `${((retrainCurrentIndex + 1) / (currentSet?.questions?.length || 1)) * 100}%`
                }}
              />
            </div>

            {/* Question Card Content */}
            <div className="retrain-question-body">
              <div className="retrain-q-num">
                Question {retrainCurrentIndex + 1} of {currentSet?.questions?.length}
              </div>
              <div className="retrain-q-content">
                <FormattedQuestion text={currentRetrainQuestion.question} />
              </div>

              {/* Options */}
              <div className="retrain-options-list">
                {currentRetrainQuestion.options?.map((opt, oIdx) => {
                  let optClass = 'retrain-opt-btn';
                  const scratchStatus = optionScratchMarks[oIdx] || 'none';
                  if (!retrainIsAnswered) {
                    if (scratchStatus === 'correct') optClass += ' scratch-candidate';
                    if (scratchStatus === 'wrong') optClass += ' scratch-eliminated';
                  }
                  if (retrainIsAnswered) {
                    if (oIdx === currentRetrainQuestion.answer) {
                      optClass += ' correct';
                    } else if (oIdx === retrainSelectedOption) {
                      optClass += ' wrong';
                    } else {
                      optClass += ' disabled';
                    }
                  }

                  return (
                    <div
                      key={oIdx}
                      className={optClass}
                    >
                      <button
                        type="button"
                        className="retrain-opt-main-btn"
                        onClick={() => handleRetrainOptionSelect(oIdx)}
                        disabled={retrainIsAnswered}
                      >
                        <span className="retrain-opt-letter">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="retrain-opt-text">{opt}</span>
                        {retrainIsAnswered && oIdx === currentRetrainQuestion.answer && (
                          <CheckIcon size={16} className="retrain-opt-icon correct-icon" />
                        )}
                        {retrainIsAnswered && oIdx === retrainSelectedOption && oIdx !== currentRetrainQuestion.answer && (
                          <XIcon size={16} className="retrain-opt-icon wrong-icon" />
                        )}
                      </button>
                      {!retrainIsAnswered && (
                        <button
                          type="button"
                          className={`retrain-opt-scratch-zone ${scratchStatus}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOptionScratchMarks(prev => {
                              const cur = prev[oIdx] || 'none';
                              const next = cur === 'none' ? 'correct' : cur === 'correct' ? 'wrong' : 'none';
                              return { ...prev, [oIdx]: next };
                            });
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOptionScratchMarks(prev => ({
                              ...prev,
                              [oIdx]: prev[oIdx] === 'wrong' ? 'none' : 'wrong'
                            }));
                          }}
                          aria-label={`Mark option ${String.fromCharCode(65 + oIdx)}`}
                          title="Mark candidate or scratch"
                        >
                          <span className={`scratch-checkbox option-scratch ${scratchStatus}`}>
                            {scratchStatus === 'correct' && <CheckIcon size={18} />}
                            {scratchStatus === 'wrong' && <XIcon size={18} />}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Answer Feedback & Explanation */}
              {retrainIsAnswered && (
                <div className={`retrain-feedback-card ${retrainSelectedOption === currentRetrainQuestion.answer ? 'is-correct' : 'is-wrong'}`}>
                  <div className="retrain-feedback-header">
                    {retrainSelectedOption === currentRetrainQuestion.answer ? (
                      <div className="retrain-feedback-title correct">
                        <CheckCircleIcon size={18} />
                        <strong>Correct Answer</strong>
                      </div>
                    ) : (
                      <div className="retrain-feedback-title wrong">
                        <XCircleIcon size={18} />
                        <strong>Incorrect Answer</strong>
                      </div>
                    )}

                    {retrainSelectedOption !== currentRetrainQuestion.answer && onSendToReviewQueue && (
                      <button
                        type="button"
                        className="retrain-send-review-btn"
                        onClick={() => handleSendSingleToReview(currentRetrainQuestion)}
                      >
                        <RotateIcon size={14} />
                        <span>Send to Spaced Review Queue</span>
                      </button>
                    )}
                  </div>

                  {currentRetrainQuestion.explanation && (
                    <div className="retrain-explanation-text">
                      <strong>Detailed Explanation:</strong>
                      <p>{cleanExplanation(currentRetrainQuestion.explanation)}</p>
                    </div>
                  )}

                  <div className="retrain-next-wrapper">
                    <button
                      type="button"
                      className="retrain-next-btn"
                      onClick={handleRetrainNext}
                    >
                      <span>
                        {retrainCurrentIndex + 1 < (currentSet?.questions?.length || 0)
                          ? 'Next Question'
                          : 'View Retrain Results'}
                      </span>
                      <ArrowRightIcon size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------
          RETRAIN PERFORMANCE SUMMARY SCREEN
          ----------------------------------------------------------- */}
      {isRetraining && retrainCompleted && (
        <div className="retrain-completion-container">
          <div className="retrain-completion-card">
            <div className="retrain-completion-icon">
              <BarChartIcon size={44} />
            </div>

            <h2 className="retrain-completion-title">
              Retrain Session Complete
            </h2>
            <p className="retrain-completion-desc">
              Summary for <strong>{currentSet?.label}</strong> ({activeSubjectConfig.title}):
            </p>

            <div className="retrain-score-grid">
              <div className="retrain-score-box score-total">
                <span className="box-val">{currentSet?.questions?.length || 0}</span>
                <span className="box-lbl">Total Questions</span>
              </div>
              <div className="retrain-score-box score-green">
                <span className="box-val">{retrainScore.correct}</span>
                <span className="box-lbl">Retained (Correct)</span>
              </div>
              <div className="retrain-score-box score-red">
                <span className="box-val">{retrainScore.wrong}</span>
                <span className="box-lbl">Requires Review</span>
              </div>
              <div className="retrain-score-box score-percent">
                <span className="box-val">
                  {Math.round((retrainScore.correct / (currentSet?.questions?.length || 1)) * 100)}%
                </span>
                <span className="box-lbl">Accuracy</span>
              </div>
            </div>

            {queuedNotification && (
              <div className="retrain-toast-notice">
                {queuedNotification}
              </div>
            )}

            <div className="retrain-completion-actions">
              <button
                type="button"
                className="retrain-btn-primary"
                onClick={() => startRetrainSession()}
              >
                <RotateIcon size={16} />
                <span>Retrain This Set Again</span>
              </button>

              <button
                type="button"
                className="retrain-btn-secondary"
                onClick={() => {
                  setIsRetraining(false);
                  setRetrainCompleted(false);
                }}
              >
                <span>Back to Question Sets</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------
          STREAMLINED BROWSER VIEW (TABS + ACTION + QUESTIONS & ANSWERS ONLY)
          ----------------------------------------------------------- */}
      {!isRetraining && (
        <div className="retrain-main-content">
          {/* Empty state if 0 questions learned */}
          {currentSubjectList.length === 0 ? (
            <div className="retrain-empty-card">
              <div className="retrain-empty-icon-box">
                <ActiveSubjectIcon size={32} />
              </div>
              <h3>No Questions Learned in {activeSubjectConfig.shortLabel}</h3>
              <p>
                Mark practice questions as learned to automatically archive them into 100-question retrain sets.
              </p>
              <div className="retrain-empty-milestone">
                <span className="milestone-text">
                  Progress: <strong>0 / 100 Questions</strong>
                </span>
                <div className="milestone-bar">
                  <div className="milestone-fill" style={{ width: '0%' }} />
                </div>
                <span className="milestone-hint">
                  100 learned questions will unlock Set 1.
                </span>
              </div>
              <button
                type="button"
                className="retrain-empty-action-btn"
                onClick={onBack}
              >
                <span>Practice {activeSubjectConfig.shortLabel}</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>
          ) : (
            <>
              {/* -----------------------------------------------------
                  UNIFIED ACTION & 100-QUESTION TABS BAR (NO OVERLAPPING BOXES)
                  ----------------------------------------------------- */}
              <div className="retrain-compact-control-card">
                <div className="retrain-control-top-row">
                  <div className="retrain-set-tabs-row">
                    {sets.map((setObj, sIdx) => {
                      const isTabActive = activeSetIndex === sIdx;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          className={`retrain-compact-set-tab ${isTabActive ? 'active' : ''}`}
                          onClick={() => {
                            setActiveSetIndex(sIdx);
                          }}
                        >
                          <span className="compact-set-title">
                            {setObj.isComplete
                              ? `Set ${setObj.setNumber}`
                              : `Set ${setObj.setNumber} (${setObj.count}/100)`}
                          </span>
                          <span className="compact-set-range">
                            {setObj.rangeText}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {currentSet && (
                    <button
                      type="button"
                      className="retrain-action-btn-primary"
                      onClick={() => startRetrainSession()}
                      title={`Start retrain test with ${currentSet.count} questions`}
                    >
                      <RotateIcon size={15} />
                      <span>Start Retrain ({currentSet.count} Qs)</span>
                    </button>
                  )}
                </div>

                {/* Search Bar Row */}
                <div className="retrain-control-search-row">
                  <div className="retrain-search-box">
                    <SearchIcon size={15} className="search-icon" />
                    <input
                      type="text"
                      className="retrain-search-input"
                      placeholder={`Search questions in ${currentSet?.shortLabel || 'this set'}...`}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="retrain-search-clear"
                        onClick={() => setSearchQuery('')}
                        title="Clear search"
                      >
                        <XIcon size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* -----------------------------------------------------
                  CLEAN QUESTIONS & ANSWERS LIST (ONLY QUESTION & ANSWER)
                  ----------------------------------------------------- */}
              <div className="retrain-qa-stack">
                {filteredSetQuestions.length === 0 ? (
                  <div className="retrain-no-results">
                    <p>No questions matched your search criteria in this set.</p>
                  </div>
                ) : (
                  filteredSetQuestions.map((item, localIdx) => {
                    const globalIdx = localIdx + 1;
                    const setBaseIdx = (activeSetIndex * 100) + globalIdx;
                    const isQBookmarked = isBookmarked ? isBookmarked(item.id) : false;
                    const answerText = getAnswerText(item);
                    const matchedText = buildMatchedQuestion(item);

                    return (
                      <article key={item.id || localIdx} className="retrain-qa-card">
                        {/* Top Meta Line */}
                        <div className="retrain-qa-header">
                          <div className="retrain-qa-badges">
                            <span className="retrain-qa-number">
                              #{setBaseIdx}
                            </span>
                            {item.year && (
                              <span className="retrain-qa-badge">
                                {item.year}
                              </span>
                            )}
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

                        {/* Question Text */}
                        <div className="retrain-qa-question">
                          <FormattedQuestion
                            text={matchedText || item.question}
                            answerText={matchedText ? null : answerText}
                            verdictOverride={matchedText ? null : item.statementVerdicts}
                            options={matchedText ? null : item.options}
                            answerIndex={matchedText ? null : item.answer}
                          />
                        </div>

                        {matchedText ? null : (
                          /* Direct Answer Only (No options grid, no explanation) */
                          <div className="retrain-qa-answer-row">
                            <span className="retrain-qa-answer-label">Answer:</span>
                            <span className="retrain-qa-answer-text">
                              {answerText}
                            </span>
                          </div>
                        )}
                      </article>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
