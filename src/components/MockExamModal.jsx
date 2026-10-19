import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QUESTION_BANK,
  ENGLISH_QUESTION_BANK,
  PYQ_QUESTION_BANK,
  PYQ_YEARS,
} from '../data/questions';
import FormattedQuestion from './FormattedQuestion';

// Exact Mark distribution for Kerala PSC LDC 100-mark syllabus
const DISTRIBUTION = [
  // Part I: GK (50 Marks)
  { label: 'ചരിത്രം (History)',        topicId: 'pq_history',          marks: 5,  part: 'Part I: GK', icon: '🏛️' },
  { label: 'ഭൂമിശാസ്ത്രം (Geography)',  topicId: 'pq_geography',        marks: 5,  part: 'Part I: GK', icon: '🌍' },
  { label: 'ധനതത്വം (Economics)',       topicId: 'pq_economics',        marks: 5,  part: 'Part I: GK', icon: '📈' },
  { label: 'ഭരണഘടന (Constitution)',    topicId: 'pq_constitution',     marks: 5,  part: 'Part I: GK', icon: '⚖️' },
  { label: 'കേരള ഭരണം (Governance)',   topicId: 'pq_kerala_governance',marks: 5,  part: 'Part I: GK', icon: '🏢' },
  { label: 'ജനറൽ സയൻസ് (Science)',    topicId: 'pq_science',          marks: 12, part: 'Part I: GK', icon: '🔬' },
  { label: 'കല, കായികം (Arts & Sports)',topicId: 'pq_arts_sports',     marks: 5,  part: 'Part I: GK', icon: '🎨' },
  { label: 'കമ്പ്യൂട്ടർ (Computer)',    topicId: 'pq_computer',         marks: 3,  part: 'Part I: GK', icon: '💻' },
  { label: 'നിയമങ്ങൾ (Acts & Laws)',    topicId: 'pq_acts_laws',        marks: 5,  part: 'Part I: GK', icon: '📜' },
  // Part II: Current Affairs (20 Marks)
  { label: 'Current Affairs',           topicId: 'pq_current_affairs',  marks: 20, part: 'Part II: Current Affairs', icon: '📰' },
  // Part III: Arithmetic & Mental Ability (10 Marks)
  { label: 'Simple Arithmetic & Mental Ability', topicId: 'pq_maths',   marks: 10, part: 'Part III: Maths & Reasoning', icon: '🔢' },
  // Part IV: General English (10 Marks)
  { label: 'General English',           topicId: 'english',             marks: 10, part: 'Part IV: English', icon: '🇬🇧' },
  // Part V: Malayalam Language (10 Marks)
  { label: 'Malayalam Language',        topicId: 'malayalam',           marks: 10, part: 'Part V: Malayalam', icon: '📚' },
];

const TOTAL_TIME = 75 * 60; // 1 hour 15 minutes = 4500 seconds

const AVAILABLE_YEARS = [
  { id: '2024', label: '2024 Papers', tag: 'Latest LDC' },
  { id: '2023', label: '2023 Papers', tag: 'High Yield' },
  { id: '2025', label: '2025 Papers', tag: 'Recent' },
  { id: '2026', label: '2026 Papers', tag: 'New Pattern' },
  { id: '2022', label: '2022 Papers', tag: 'Standard' },
  { id: '2021', label: '2021 Papers', tag: 'Classic' },
  { id: 'all',  label: 'All Years Mixed', tag: 'Full Pool' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPaper(selectedYear) {
  const questions = [];
  let qNum = 1;

  for (const seg of DISTRIBUTION) {
    let pool = [];

    if (seg.topicId === 'english') {
      // Try PYQ english for this year first, then fallback to ENGLISH_QUESTION_BANK
      if (selectedYear && selectedYear !== 'all') {
        pool = PYQ_QUESTION_BANK.filter(q =>
          (q.topic === 'pq_english' || q.subject === 'english') &&
          (q.year === selectedYear || q.id?.includes(`_${selectedYear}_`))
        );
      }
      if (pool.length < seg.marks) {
        const extra = ENGLISH_QUESTION_BANK.filter(q => !pool.some(p => p.id === q.id));
        pool = [...pool, ...extra];
      }
    } else if (seg.topicId === 'malayalam') {
      // Try PYQ malayalam for this year first, then fallback to QUESTION_BANK
      if (selectedYear && selectedYear !== 'all') {
        pool = PYQ_QUESTION_BANK.filter(q =>
          (q.topic === 'pq_malayalam' || q.subject === 'malayalam') &&
          (q.year === selectedYear || q.id?.includes(`_${selectedYear}_`))
        );
      }
      if (pool.length < seg.marks) {
        const extra = QUESTION_BANK.filter(q => !pool.some(p => p.id === q.id));
        pool = [...pool, ...extra];
      }
    } else {
      // PYQ sections
      if (selectedYear && selectedYear !== 'all') {
        pool = PYQ_QUESTION_BANK.filter(q =>
          q.topic === seg.topicId &&
          (q.year === selectedYear || q.id?.includes(`_${selectedYear}_`))
        );
      }
      // Fallback: draw from other years for this topic if needed
      if (pool.length < seg.marks) {
        const fallback = PYQ_QUESTION_BANK.filter(q =>
          q.topic === seg.topicId && !pool.some(p => p.id === q.id)
        );
        pool = [...pool, ...fallback];
      }
    }

    // Pick exactly seg.marks questions at random
    const picked = shuffle(pool).slice(0, seg.marks);

    picked.forEach(q => {
      // Create a clean question copy
      let opts = Array.isArray(q.options) ? [...q.options] : [];
      let ans = typeof q.answer === 'number' ? q.answer : 0;

      // Shuffle options for non-PYQ questions for extra variety
      if (!q.id?.startsWith('pyq_') && opts.length === 4) {
        const correctText = opts[ans];
        opts = shuffle(opts);
        ans = opts.indexOf(correctText);
      }

      questions.push({
        ...q,
        options: opts,
        answer: ans,
        qNum: qNum++,
        segLabel: seg.label,
        segIcon: seg.icon,
        part: seg.part,
      });
    });
  }

  return questions;
}

export default function MockExamModal({ year = '2024', onClose }) {
  const [activeYear, setActiveYear] = useState(year || '2024');
  const [phase, setPhase] = useState('ready'); // 'ready' | 'exam' | 'result'
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIndex]: optionIdx }
  const [flagged, setFlagged] = useState({}); // { [qIndex]: boolean }
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'wrong' | 'unanswered' | 'correct'
  const timerRef = useRef(null);

  const finishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowSubmitConfirm(false);
    setShowExitConfirm(false);
    setPhase('result');
  }, []);

  // Timer effect
  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, finishExam]);

  const handleStartExam = () => {
    const paper = buildPaper(activeYear);
    setQuestions(paper);
    setAnswers({});
    setFlagged({});
    setCurrentIdx(0);
    setTimeLeft(TOTAL_TIME);
    setShowExitConfirm(false);
    setShowSubmitConfirm(false);
    setPhase('exam');
  };

  const handleSelectOption = (optIdx) => {
    setAnswers(prev => {
      // Clicking same option clears it (allows leaving unanswered)
      if (prev[currentIdx] === optIdx) {
        const next = { ...prev };
        delete next[currentIdx];
        return next;
      }
      return { ...prev, [currentIdx]: optIdx };
    });
  };

  const handleClearAnswer = () => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  const toggleFlag = (idx) => {
    setFlagged(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setShowSubmitConfirm(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerUrgent = timeLeft <= 300; // last 5 min

  // Calculate Scores with Official Kerala PSC 1/3 negative marking
  const totalQuestions = questions.length || 100;
  const correctCount = questions.filter((q, i) => answers[i] === q.answer).length;
  const wrongCount = questions.filter((q, i) => answers[i] !== undefined && answers[i] !== q.answer).length;
  const unansweredCount = totalQuestions - Object.keys(answers).length;
  const rawScore = correctCount - wrongCount * 0.3333;
  const finalScore = Math.max(0, Number(rawScore.toFixed(2)));
  const percentage = Math.round((finalScore / totalQuestions) * 100);

  const q = questions[currentIdx];
  const optLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="mock-modal-overlay" onClick={e => { if (e.target === e.currentTarget && phase === 'ready') onClose(); }}>
      <div className={`mock-modal-box ${phase === 'exam' ? 'exam-mode' : ''}`}>

        {/* ═══════════════════════════════════════════════════════
            1. READY SCREEN (Year Selection & Exam Confirmation)
           ═══════════════════════════════════════════════════════ */}
        {phase === 'ready' && (
          <div className="mock-ready-screen">
            <button className="mock-close-btn" onClick={onClose} aria-label="Close">✕</button>

            <div className="mock-ready-header">
              <div className="mock-ready-logo-wrap">
                <img src="/kerala-psc-logo.jpg" alt="Kerala PSC" className="mock-ready-logo-img" />
              </div>
              <div className="mock-ready-badge">
                <span className="mock-badge-dot" />
                Kerala PSC Official Pattern Mock Examination
              </div>
              <h1 className="mock-ready-title">Full 100-Mark OMR Question Paper</h1>
              <p className="mock-ready-sub">
                Strictly generated according to Kerala PSC LDC syllabus marks distribution with 75 minutes timed session and 1/3 negative marking.
              </p>
            </div>

            {/* Year Selector */}
            <div className="mock-year-selector-card">
              <div className="mock-selector-title">
                <span>📅 <strong>Step 1:</strong> Select Question Paper Year</span>
                <span className="mock-selector-hint">Questions will be randomized from this year's PYQs</span>
              </div>
              <div className="mock-year-btn-grid">
                {AVAILABLE_YEARS.map(y => (
                  <button
                    key={y.id}
                    type="button"
                    className={`mock-year-chip ${activeYear === y.id ? 'active' : ''}`}
                    onClick={() => setActiveYear(y.id)}
                  >
                    <span className="my-year-num">{y.id === 'all' ? 'All' : y.id}</span>
                    <span className="my-year-label">{y.label}</span>
                    <span className="my-year-tag">{y.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Key Exam Rules & Stats */}
            <div className="mock-ready-stats-row">
              <div className="mock-stat-card">
                <span className="mstat-icon">📋</span>
                <strong className="mstat-val">100 Qs</strong>
                <span className="mstat-lbl">Total Questions</span>
              </div>
              <div className="mock-stat-card">
                <span className="mstat-icon">⏱️</span>
                <strong className="mstat-val">75 Mins</strong>
                <span className="mstat-lbl">1 Hr 15 Mins</span>
              </div>
              <div className="mock-stat-card">
                <span className="mstat-icon">✅</span>
                <strong className="mstat-val">+1.00</strong>
                <span className="mstat-lbl">Per Correct</span>
              </div>
              <div className="mock-stat-card">
                <span className="mstat-icon">❌</span>
                <strong className="mstat-val">−0.33</strong>
                <span className="mstat-lbl">Negative Penalty</span>
              </div>
            </div>

            {/* Mark Distribution Accordion / Grid */}
            <div className="mock-distribution-section">
              <div className="mock-dist-header">
                <h3>📊 Official 100-Mark Syllabus Weightage</h3>
                <span className="mock-dist-sum">Total: 100 Marks</span>
              </div>
              <div className="mock-dist-chips">
                <span className="dist-chip gk">Part I: GK (50M)</span>
                <span className="dist-chip ca">Part II: Current Affairs (20M)</span>
                <span className="dist-chip maths">Part III: Maths & Reasoning (10M)</span>
                <span className="dist-chip eng">Part IV: General English (10M)</span>
                <span className="dist-chip mal">Part V: Malayalam (10M)</span>
              </div>
              <div className="mock-distribution-grid">
                {DISTRIBUTION.map((seg, i) => (
                  <div key={i} className="mock-dist-item">
                    <span className="mock-dist-icon">{seg.icon}</span>
                    <div className="mock-dist-info">
                      <span className="mock-dist-name">{seg.label}</span>
                      <span className="mock-dist-sub">{seg.part}</span>
                    </div>
                    <span className="mock-dist-weight">{seg.marks} Marks</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ready to Start Confirmation Box */}
            <div className="mock-confirm-box">
              <div className="mock-confirm-icon">🚀</div>
              <div className="mock-confirm-text">
                <h4>Ready to Start?</h4>
                <p>
                  Timer of <strong>1 hour 15 minutes</strong> will begin as soon as you press Start. You can mark, review, and jump across questions. Negative marking (-0.33) applies for incorrect answers.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary mock-launch-btn"
                onClick={handleStartExam}
              >
                <span>Yes, Ready to Start ({activeYear})</span>
                <span className="launch-arrow">➔</span>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            2. EXAM SCREEN (Active 75-Minute Timed Session)
           ═══════════════════════════════════════════════════════ */}
        {phase === 'exam' && q && (
          <div className="mock-exam-screen">
            {/* Top Fixed Header */}
            <header className="mock-exam-topbar">
              <div className="mock-topbar-left">
                <span className="mock-exam-badge">
                  <span className="pulse-dot" />
                  {activeYear} Mock Paper
                </span>
                <div className="mock-qnum-indicator">
                  Question <strong>{currentIdx + 1}</strong> <span className="mock-slash">/</span> 100
                </div>
              </div>

              {/* Countdown Timer */}
              <div className={`mock-countdown-timer ${timerUrgent ? 'urgent' : ''}`}>
                <span className="timer-icon">{timerUrgent ? '🔥' : '⏱️'}</span>
                <span className="timer-digits">{formatTime(timeLeft)}</span>
              </div>

              <div className="mock-topbar-actions">
                <button
                  type="button"
                  className="mock-submit-trigger-btn"
                  onClick={() => setShowSubmitConfirm(true)}
                >
                  Submit Paper
                </button>
                <button
                  type="button"
                  className="mock-exit-trigger-btn"
                  onClick={() => setShowExitConfirm(true)}
                  title="Exit exam"
                >
                  ✕ Exit Exam
                </button>
              </div>
            </header>

            {/* Linear Progress Bar */}
            <div className="mock-top-progress-track">
              <div
                className="mock-top-progress-fill"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Exam Main Area */}
            <div className="mock-exam-body">
              {/* Question Card */}
              <div className="mock-q-card">
                {/* Meta row */}
                <div className="mock-q-meta-row">
                  <div className="mock-q-meta-left">
                    <span className="mock-q-tag">{q.segIcon} {q.segLabel}</span>
                    <span className="mock-part-pill">{q.part}</span>
                  </div>
                  <div className="mock-q-meta-right">
                    <button
                      type="button"
                      className={`mock-flag-btn ${flagged[currentIdx] ? 'flagged' : ''}`}
                      onClick={() => toggleFlag(currentIdx)}
                      title="Flag question for review"
                    >
                      <span>{flagged[currentIdx] ? '🚩 Flagged' : '🏳️ Flag for review'}</span>
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="mock-q-statement">
                  <span className="mock-q-num-label">Q{currentIdx + 1}.</span>
                  <div className="mock-q-statement-body">
                    <FormattedQuestion text={q.question} />
                  </div>
                </div>

                {/* 4 Options */}
                <div className="mock-options-container">
                  {q.options.map((opt, idx) => {
                    const isSelected = answers[currentIdx] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`mock-option-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(idx)}
                      >
                        <span className="mock-opt-bubble">{optLetters[idx]}</span>
                        <span className="mock-opt-label">{opt}</span>
                        {isSelected && <span className="mock-opt-check">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Option Actions: Clear answer */}
                <div className="mock-q-actions-row">
                  {answers[currentIdx] !== undefined && (
                    <button
                      type="button"
                      className="mock-clear-btn"
                      onClick={handleClearAnswer}
                    >
                      Clear Selection (Skip)
                    </button>
                  )}
                  <div className="mock-mark-hint">
                    Marks: <span className="green">+1.00</span> | Penalty: <span className="red">−0.33</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Bar */}
            <footer className="mock-exam-footer">
              <button
                type="button"
                className="mock-footer-nav-btn"
                onClick={handlePrev}
                disabled={currentIdx === 0}
              >
                ← Previous
              </button>

              <div className="mock-footer-stats">
                <span className="stat-ans">Answered: <strong>{Object.keys(answers).length}</strong></span>
                <span className="stat-unans">Skipped: <strong>{totalQuestions - Object.keys(answers).length}</strong></span>
                {Object.keys(flagged).filter(k => flagged[k]).length > 0 && (
                  <span className="stat-flag">Flagged: <strong>{Object.keys(flagged).filter(k => flagged[k]).length}</strong></span>
                )}
              </div>

              <button
                type="button"
                className="mock-footer-nav-btn next-primary"
                onClick={handleNext}
              >
                {currentIdx === totalQuestions - 1 ? 'Review & Submit ➔' : 'Next Question →'}
              </button>
            </footer>

            {/* Submit Confirmation Dialog */}
            {showSubmitConfirm && (
              <div className="mock-confirm-overlay" onClick={() => setShowSubmitConfirm(false)}>
                <div className="mock-confirm-modal" onClick={e => e.stopPropagation()}>
                  <div className="mcm-icon">⚠️</div>
                  <h3>Submit Examination?</h3>
                  <p>
                    You have answered <strong>{Object.keys(answers).length}</strong> out of <strong>{totalQuestions}</strong> questions.
                  </p>
                  <p className="mcm-sub">
                    {totalQuestions - Object.keys(answers).length} questions are left unanswered (no negative penalty). Time remaining: <strong>{formatTime(timeLeft)}</strong>.
                  </p>
                  <div className="mcm-buttons">
                    <button
                      type="button"
                      className="btn btn-secondary mcm-cancel-btn"
                      onClick={() => setShowSubmitConfirm(false)}
                    >
                      Continue Exam
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary mcm-submit-btn"
                      onClick={finishExam}
                    >
                      Yes, Submit Exam Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Exit Exam Confirmation Dialog */}
            {showExitConfirm && (
              <div className="mock-confirm-overlay" onClick={() => setShowExitConfirm(false)}>
                <div className="mock-confirm-modal" onClick={e => e.stopPropagation()}>
                  <div className="mcm-icon">⚠️</div>
                  <h3>Exit Examination?</h3>
                  <p>
                    Are you sure you want to exit? <strong>You will lose all your exam progress and answered questions.</strong>
                  </p>
                  <p className="mcm-sub">
                    You have answered {Object.keys(answers).length} of {totalQuestions} questions. This exam session cannot be resumed once exited.
                  </p>
                  <div className="mcm-buttons">
                    <button
                      type="button"
                      className="btn btn-secondary mcm-cancel-btn"
                      onClick={() => setShowExitConfirm(false)}
                    >
                      Keep Going
                    </button>
                    <button
                      type="button"
                      className="btn mcm-exit-btn"
                      onClick={() => {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setShowExitConfirm(false);
                        onClose();
                      }}
                    >
                      Yes, Exit Exam
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            3. RESULT & COMPREHENSIVE ANALYSIS SCREEN
           ═══════════════════════════════════════════════════════ */}
        {phase === 'result' && (
          <div className="mock-result-screen">
            <button className="mock-close-btn" onClick={onClose} aria-label="Close">✕</button>

            {/* Hero Result Banner */}
            <div className="mock-result-hero">
              <div className="mrh-badge">
                📅 {activeYear === 'all' ? 'All Years Mixed' : `${activeYear} Exam Pattern`}
              </div>
              <div className="mrh-trophy">
                {percentage >= 65 ? '🏆' : percentage >= 45 ? '🎯' : '📚'}
              </div>
              <h2 className="mrh-title">
                {percentage >= 65 ? 'Outstanding Performance!' : percentage >= 45 ? 'Good Effort!' : 'Keep Practicing!'}
              </h2>
              <div className="mrh-score-board">
                <div className="mrh-score-main">
                  <span className="mrh-score-num">{finalScore}</span>
                  <span className="mrh-score-max">/ {totalQuestions}</span>
                </div>
                <div className="mrh-score-pct">{percentage}% Net Score</div>
              </div>
              <p className="mrh-desc">
                {percentage >= 65
                  ? 'Strong prospect for top rank in LDC. Your GK and Subject foundations are solid!'
                  : percentage >= 45
                  ? 'Above average! Review the negative marks and revise your weak areas to cross 70+.'
                  : 'Focus on eliminating guesses to avoid negative marks (-0.33) and practice high-yield topics.'}
              </p>
            </div>

            {/* Core Stats Grid */}
            <div className="mock-result-stats-row">
              <div className="mres-stat-card green">
                <span className="mres-val">{correctCount}</span>
                <span className="mres-lbl">✅ Correct (+{correctCount})</span>
              </div>
              <div className="mres-stat-card red">
                <span className="mres-val">{wrongCount}</span>
                <span className="mres-lbl">❌ Wrong (−{(wrongCount * 0.3333).toFixed(2)})</span>
              </div>
              <div className="mres-stat-card gray">
                <span className="mres-val">{unansweredCount}</span>
                <span className="mres-lbl">⊘ Unanswered (0)</span>
              </div>
              <div className="mres-stat-card blue">
                <span className="mres-val">
                  {Object.keys(answers).length > 0 ? `${Math.round((correctCount / Object.keys(answers).length) * 100)}%` : '0%'}
                </span>
                <span className="mres-lbl">🎯 Accuracy Rate</span>
              </div>
            </div>

            {/* Section-Wise Syllabus Performance Breakdown */}
            <div className="mock-section-breakdown-card">
              <div className="msbc-title">
                <h3>📊 Section-Wise Syllabus Breakdown</h3>
                <span className="msbc-subtitle">Target 70%+ across all sections</span>
              </div>
              <div className="msbc-list">
                {DISTRIBUTION.map((seg, idx) => {
                  const segQuestions = questions.filter(item => item.segLabel === seg.label);
                  const segCorrect = segQuestions.filter(item => {
                    const originalIdx = questions.indexOf(item);
                    return answers[originalIdx] === item.answer;
                  }).length;
                  const segWrong = segQuestions.filter(item => {
                    const originalIdx = questions.indexOf(item);
                    return answers[originalIdx] !== undefined && answers[originalIdx] !== item.answer;
                  }).length;
                  const segNet = Math.max(0, Number((segCorrect - segWrong * 0.3333).toFixed(2)));
                  const segPct = segQuestions.length > 0 ? Math.round((segCorrect / segQuestions.length) * 100) : 0;

                  return (
                    <div key={idx} className="msbc-row">
                      <div className="msbc-row-header">
                        <span className="msbc-icon">{seg.icon}</span>
                        <div className="msbc-name-wrap">
                          <span className="msbc-name">{seg.label}</span>
                          <span className="msbc-part-tag">{seg.part}</span>
                        </div>
                        <div className="msbc-score-tag">
                          <strong>{segNet}</strong> / {seg.marks} Marks
                        </div>
                      </div>
                      <div className="msbc-bar-track">
                        <div
                          className="msbc-bar-fill"
                          style={{
                            width: `${segPct}%`,
                            background: segPct >= 65 ? '#10b981' : segPct >= 40 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Question Review List */}
            <div className="mock-review-section">
              <div className="mrs-header">
                <h3>📝 Review Questions & Solutions</h3>
                <div className="mrs-filter-chips">
                  <button
                    type="button"
                    className={`mrs-chip ${reviewFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('all')}
                  >
                    All ({totalQuestions})
                  </button>
                  <button
                    type="button"
                    className={`mrs-chip ${reviewFilter === 'wrong' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('wrong')}
                  >
                    Wrong ({wrongCount})
                  </button>
                  <button
                    type="button"
                    className={`mrs-chip ${reviewFilter === 'unanswered' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('unanswered')}
                  >
                    Unanswered ({unansweredCount})
                  </button>
                  <button
                    type="button"
                    className={`mrs-chip ${reviewFilter === 'correct' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('correct')}
                  >
                    Correct ({correctCount})
                  </button>
                </div>
              </div>

              <div className="mrs-questions-list">
                {questions.map((item, i) => {
                  const userAnswer = answers[i];
                  const isCorrect = userAnswer === item.answer;
                  const isWrong = userAnswer !== undefined && !isCorrect;
                  const isUnans = userAnswer === undefined;

                  if (reviewFilter === 'wrong' && !isWrong) return null;
                  if (reviewFilter === 'correct' && !isCorrect) return null;
                  if (reviewFilter === 'unanswered' && !isUnans) return null;

                  return (
                    <div
                      key={i}
                      className={`mrs-item-card ${isCorrect ? 'correct' : isWrong ? 'wrong' : 'unanswered'}`}
                    >
                      <div className="mrs-item-top">
                        <span className="mrs-item-num">Q{i + 1}</span>
                        <span className="mrs-item-topic">{item.segIcon} {item.segLabel}</span>
                        <span className={`mrs-item-badge ${isCorrect ? 'correct' : isWrong ? 'wrong' : 'unanswered'}`}>
                          {isCorrect ? '✓ Correct (+1.00)' : isWrong ? '✗ Wrong (−0.33)' : '⊘ Unanswered (0)'}
                        </span>
                      </div>
                      <div className="mrs-item-text">
                        <FormattedQuestion text={item.question} />
                      </div>
                      <div className="mrs-options-grid">
                        {item.options.map((opt, oIdx) => {
                          const isKey = oIdx === item.answer;
                          const isChosen = oIdx === userAnswer;
                          let optCls = 'mrs-opt';
                          if (isKey) optCls += ' is-key';
                          if (isChosen && !isKey) optCls += ' is-chosen-wrong';
                          return (
                            <div key={oIdx} className={optCls}>
                              <span className="mrs-opt-letter">{optLetters[oIdx]}</span>
                              <span className="mrs-opt-content">{opt}</span>
                              {isKey && <span className="mrs-opt-tag">✓ Correct Answer</span>}
                              {isChosen && !isKey && <span className="mrs-opt-tag wrong">Your Answer</span>}
                            </div>
                          );
                        })}
                      </div>
                      {item.explanation && (
                        <div className="mrs-explanation-box">
                          <strong>💡 Explanation:</strong> {item.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mock-result-footer">
              <button
                type="button"
                className="btn btn-primary mrf-btn"
                onClick={() => setPhase('ready')}
              >
                🔄 Create Another Mock Exam (Pick Year)
              </button>
              <button
                type="button"
                className="btn btn-secondary mrf-close"
                onClick={onClose}
              >
                ✕ Close Exam Portal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
