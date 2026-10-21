import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QUESTION_BANK,
  ENGLISH_QUESTION_BANK,
  PYQ_QUESTION_BANK,
  PYQ_YEARS,
} from '../data/questions';
import FormattedQuestion from './FormattedQuestion';
import {
  ClockIcon,
  FlameIcon,
  TrophyIcon,
  FlagIcon,
  ClipboardListIcon,
  BarChartIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  LightbulbIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  AlertTriangleIcon,
  RotateIcon,
  TargetIcon,
  InfoIcon,
  ChevronLeftIcon
} from './Icons';
import { cleanExplanation } from '../utils/cleanExplanation';

// Exact Mark distribution for Kerala PSC LDC 100-mark syllabus
const DISTRIBUTION = [
  // Part I: GK (50 Marks)
  { label: 'ചരിത്രം (History)',         topicId: 'pq_history',           marks: 5,  part: 'Part I: GK', code: '01' },
  { label: 'ഭൂമിശാസ്ത്രം (Geography)',   topicId: 'pq_geography',         marks: 5,  part: 'Part I: GK', code: '02' },
  { label: 'ധനതത്വം (Economics)',        topicId: 'pq_economics',         marks: 5,  part: 'Part I: GK', code: '03' },
  { label: 'ഭരണഘടന (Constitution)',     topicId: 'pq_constitution',      marks: 5,  part: 'Part I: GK', code: '04' },
  { label: 'കേരള ഭരണം (Governance)',    topicId: 'pq_kerala_governance', marks: 5,  part: 'Part I: GK', code: '05' },
  { label: 'ജനറൽ സയൻസ് (Science)',     topicId: 'pq_science',           marks: 12, part: 'Part I: GK', code: '06' },
  { label: 'കല, കായികം (Arts & Sports)', topicId: 'pq_arts_sports',      marks: 5,  part: 'Part I: GK', code: '07' },
  { label: 'കമ്പ്യൂട്ടർ (Computer)',     topicId: 'pq_computer',          marks: 3,  part: 'Part I: GK', code: '08' },
  { label: 'നിയമങ്ങൾ (Acts & Laws)',     topicId: 'pq_acts_laws',         marks: 5,  part: 'Part I: GK', code: '09' },
  // Part II: Current Affairs (20 Marks)
  { label: 'Current Affairs',            topicId: 'pq_current_affairs',   marks: 20, part: 'Part II: Current Affairs', code: '10' },
  // Part III: Arithmetic & Mental Ability (10 Marks)
  { label: 'Simple Arithmetic & Mental Ability', topicId: 'pq_maths',    marks: 10, part: 'Part III: Maths & Reasoning', code: '11' },
  // Part IV: General English (10 Marks)
  { label: 'General English',            topicId: 'english',              marks: 10, part: 'Part IV: English', code: '12' },
  // Part V: Malayalam Language (10 Marks)
  { label: 'Malayalam Language',         topicId: 'malayalam',            marks: 10, part: 'Part V: Malayalam', code: '13' },
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
      if (selectedYear && selectedYear !== 'all') {
        pool = PYQ_QUESTION_BANK.filter(
          (q) =>
            (q.topic === 'pq_english' || q.subject === 'english') &&
            (q.year === selectedYear || q.id?.includes(`_${selectedYear}_`))
        );
      }
      if (pool.length < seg.marks) {
        const extra = ENGLISH_QUESTION_BANK.filter((q) => !pool.some((p) => p.id === q.id));
        pool = [...pool, ...extra];
      }
    } else if (seg.topicId === 'malayalam') {
      if (selectedYear && selectedYear !== 'all') {
        pool = PYQ_QUESTION_BANK.filter(
          (q) =>
            (q.topic === 'pq_malayalam' || q.subject === 'malayalam') &&
            (q.year === selectedYear || q.id?.includes(`_${selectedYear}_`))
        );
      }
      if (pool.length < seg.marks) {
        const extra = QUESTION_BANK.filter((q) => !pool.some((p) => p.id === q.id));
        pool = [...pool, ...extra];
      }
    } else {
      if (selectedYear && selectedYear !== 'all') {
        pool = PYQ_QUESTION_BANK.filter(
          (q) =>
            q.topic === seg.topicId &&
            (q.year === selectedYear || q.id?.includes(`_${selectedYear}_`))
        );
      }
      if (pool.length < seg.marks) {
        const fallback = PYQ_QUESTION_BANK.filter(
          (q) => q.topic === seg.topicId && !pool.some((p) => p.id === q.id)
        );
        pool = [...pool, ...fallback];
      }
    }

    const picked = shuffle(pool).slice(0, seg.marks);

    picked.forEach((q) => {
      let opts = Array.isArray(q.options) ? [...q.options] : [];
      let ans = typeof q.answer === 'number' ? q.answer : 0;

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
        segCode: seg.code,
        part: seg.part,
      });
    });
  }

  return questions;
}

export default function MockExamPage({ year = '2024', onExit }) {
  const [activeYear, setActiveYear] = useState(year);
  const [phase, setPhase] = useState('ready'); // 'ready' | 'exam' | 'result'
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');

  const timerRef = useRef(null);

  // Generate paper & start exam
  const startExam = (chosenYear) => {
    const yr = chosenYear || activeYear;
    const paper = buildPaper(yr);
    setQuestions(paper);
    setAnswers({});
    setFlagged({});
    setCurrentIdx(0);
    setTimeLeft(TOTAL_TIME);
    setTimerRunning(true);
    setPhase('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Timer countdown
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            finishExam();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeLeft]);

  // Submit & finish exam
  const finishExam = useCallback(() => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setShowSubmitConfirm(false);
    setPhase('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectOption = (optIdx) => {
    setAnswers((prev) => {
      if (prev[currentIdx] === optIdx) {
        const next = { ...prev };
        delete next[currentIdx];
        return next;
      }
      return { ...prev, [currentIdx]: optIdx };
    });
  };

  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  const toggleFlag = (idx) => {
    setFlagged((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setShowSubmitConfirm(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerUrgent = timeLeft <= 300;

  // Official Kerala PSC 1/3 negative marking
  const totalQuestions = questions.length || 100;
  const correctCount = questions.filter((q, i) => answers[i] === q.answer).length;
  const wrongCount = questions.filter(
    (q, i) => answers[i] !== undefined && answers[i] !== q.answer
  ).length;
  const unansweredCount = totalQuestions - Object.keys(answers).length;
  const rawScore = correctCount - wrongCount * 0.3333;
  const finalScore = Math.max(0, Number(rawScore.toFixed(2)));
  const percentage = Math.round((finalScore / totalQuestions) * 100);

  const q = questions[currentIdx];
  const optLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className={`mock-page-container ${phase === 'exam' ? 'in-exam-mode' : ''}`}>
      {/* ═══════════════════════════════════════════════════════
          PHASE 1: READY SCREEN (Year Selection & Overview)
         ═══════════════════════════════════════════════════════ */}
      {phase === 'ready' && (
        <div className="mock-page-ready">
          {/* Top navigation header with safe area buffer */}
          <div className="mock-page-nav-header">
            <button
              type="button"
              className="mock-page-back-btn"
              onClick={onExit}
              title="Return to Homescreen"
            >
              <ChevronLeftIcon size={16} />
              <span>Back to Homescreen</span>
            </button>
            <div className="mock-page-mode-pill">
              <span className="mock-badge-dot" />
              <span>Official 100-Mark OMR Simulation</span>
            </div>
          </div>

          <div className="mock-ready-screen">
            <div className="mock-ready-header">
              <div className="mock-ready-logo-wrap">
                <img
                  src="/kerala-psc-logo.jpg"
                  alt="Kerala PSC Official Logo"
                  className="mock-ready-logo-img"
                />
              </div>
              <div className="mock-ready-badge">
                <span className="mock-badge-dot" />
                Kerala PSC Official Pattern Mock Examination
              </div>
              <h1 className="mock-ready-title">Full 100-Mark OMR Question Paper</h1>
              <p className="mock-ready-sub">
                Strictly generated according to Kerala PSC LDC syllabus marks distribution with 75
                minutes timed session and 1/3 negative marking.
              </p>
            </div>

            {/* Year Selector */}
            <div className="mock-year-selector-card">
              <div className="mock-selector-title">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarIcon size={16} />
                  <strong>Step 1:</strong> Select Question Paper Year
                </span>
                <span className="mock-selector-hint">Questions will be randomized from this year's PYQs</span>
              </div>
              <div className="mock-year-btn-grid">
                {AVAILABLE_YEARS.map((y) => (
                  <button
                    key={y.id}
                    type="button"
                    className={`mock-year-chip ${activeYear === y.id ? 'active' : ''}`}
                    onClick={() => setActiveYear(y.id)}
                  >
                    <span className="chip-year">{y.id === 'all' ? 'All' : y.id}</span>
                    <span className="chip-label">{y.label}</span>
                    <span className="chip-tag">{y.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Rules & Metadata Grid */}
            <div className="mock-rules-grid">
              <div className="mock-stat-card">
                <span className="mstat-icon"><ClipboardListIcon size={20} /></span>
                <span className="mstat-val">100 Qs</span>
                <span className="mstat-lbl">Total Questions</span>
              </div>
              <div className="mock-stat-card">
                <span className="mstat-icon"><ClockIcon size={20} /></span>
                <span className="mstat-val">75 Mins</span>
                <span className="mstat-lbl">1 Hr 15 Mins</span>
              </div>
              <div className="mock-stat-card">
                <span className="mstat-icon"><CheckCircleIcon size={20} /></span>
                <span className="mstat-val">+1.00</span>
                <span className="mstat-lbl">Per Correct</span>
              </div>
              <div className="mock-stat-card">
                <span className="mstat-icon"><XCircleIcon size={20} /></span>
                <span className="mstat-val">−0.33</span>
                <span className="mstat-lbl">Negative Penalty</span>
              </div>
            </div>

            {/* 100-Mark Syllabus Weightage Distribution */}
            <div className="mock-distribution-section">
              <div className="mock-dist-header">
                <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <BarChartIcon size={16} />
                  <span>Official 100-Mark Syllabus Weightage</span>
                </h3>
                <span className="mock-dist-sum">Total: 100 Marks</span>
              </div>
              <div className="mock-dist-badges">
                <span className="dist-pill p1">Part I: GK (50M)</span>
                <span className="dist-pill p2">Part II: Current Affairs (20M)</span>
                <span className="dist-pill p3">Part III: Maths & Reasoning (10M)</span>
                <span className="dist-pill p4">Part IV: General English (10M)</span>
                <span className="dist-pill p5">Part V: Malayalam (10M)</span>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="mock-ready-actions">
              <button
                type="button"
                className="btn btn-primary mock-start-btn"
                onClick={() => startExam(activeYear)}
              >
                <FlameIcon size={18} />
                <span>Start 100-Mark Mock Examination</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          PHASE 2: LIVE EXAM TESTING CONSOLE
         ═══════════════════════════════════════════════════════ */}
      {phase === 'exam' && q && (
        <div className="mock-page-exam">
          {/* Top Sticky Bar with Safe Area Top Buffer */}
          <header className="mock-page-exam-topbar">
            <div className="mock-exam-topbar-row-top">
              <div className="mock-topbar-left">
                <div className="mock-exam-badge">
                  <span className="pulse-dot" />
                  <span>{activeYear === 'all' ? 'All Years' : `${activeYear} Paper`}</span>
                </div>
                <div className="mock-qnum-indicator">
                  Question <strong>{currentIdx + 1}</strong> / {totalQuestions}
                </div>
              </div>

              {/* Timer Display */}
              <div className={`mock-timer-box ${timerUrgent ? 'urgent' : ''}`}>
                <ClockIcon size={15} />
                <span className="timer-val">{formatTime(timeLeft)}</span>
                {timerUrgent && <span className="timer-hurry">Hurry!</span>}
              </div>

              <div className="mock-topbar-right">
                <button
                  type="button"
                  className="mock-submit-btn-top"
                  onClick={() => setShowSubmitConfirm(true)}
                  title="Submit examination and view score"
                >
                  <CheckIcon size={14} />
                  <span>Submit Paper</span>
                </button>
                <button
                  type="button"
                  className="mock-exit-btn-top"
                  onClick={() => setShowExitConfirm(true)}
                  title="Exit exam"
                >
                  <XIcon size={14} />
                  <span>Exit Exam</span>
                </button>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="mock-top-progress-track">
              <div
                className="mock-top-progress-fill"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </header>

          {/* Exam Main Area */}
          <div className="mock-page-exam-content">
            <div className="mock-q-card">
              {/* Meta row */}
              <div className="mock-q-meta-row">
                <div className="mock-q-meta-left">
                  <span className="mock-q-tag">{q.segLabel}</span>
                  <span className="mock-part-pill">{q.part}</span>
                </div>
                <div className="mock-q-meta-right">
                  <button
                    type="button"
                    className={`mock-flag-btn ${flagged[currentIdx] ? 'flagged' : ''}`}
                    onClick={() => toggleFlag(currentIdx)}
                    title="Flag question for review"
                  >
                    <FlagIcon size={14} filled={!!flagged[currentIdx]} />
                    <span>{flagged[currentIdx] ? 'Flagged' : 'Flag for review'}</span>
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
                      {isSelected && (
                        <span className="mock-opt-check">
                          <CheckIcon size={14} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Option Actions: Clear answer & penalty hint */}
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
                  Marks: <span className="green">+1.00</span> | Penalty:{' '}
                  <span className="red">−0.33</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sticky Navigation Bar */}
          <footer className="mock-page-exam-footer">
            <button
              type="button"
              className="mock-footer-nav-btn"
              onClick={handlePrev}
              disabled={currentIdx === 0}
            >
              ← Previous
            </button>

            <div className="mock-footer-stats">
              <span className="stat-ans">
                Answered: <strong>{Object.keys(answers).length}</strong>
              </span>
              <span className="stat-unans">
                Skipped: <strong>{totalQuestions - Object.keys(answers).length}</strong>
              </span>
              {Object.keys(flagged).filter((k) => flagged[k]).length > 0 && (
                <span className="stat-flag">
                  Flagged: <strong>{Object.keys(flagged).filter((k) => flagged[k]).length}</strong>
                </span>
              )}
            </div>

            <button
              type="button"
              className="mock-footer-nav-btn next-primary"
              onClick={handleNext}
            >
              <span>{currentIdx === totalQuestions - 1 ? 'Review & Submit' : 'Next Question'}</span>
              <ArrowRightIcon size={15} />
            </button>
          </footer>

          {/* Submit Confirmation Dialog */}
          {showSubmitConfirm && (
            <div className="mock-confirm-overlay" onClick={() => setShowSubmitConfirm(false)}>
              <div className="mock-confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="mcm-icon"><AlertTriangleIcon size={26} /></div>
                <h3>Submit Examination?</h3>
                <p>
                  You have answered <strong>{Object.keys(answers).length}</strong> out of{' '}
                  <strong>{totalQuestions}</strong> questions.
                </p>
                <p className="mcm-sub">
                  {totalQuestions - Object.keys(answers).length} questions are left unanswered (no
                  negative penalty). Time remaining: <strong>{formatTime(timeLeft)}</strong>.
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
              <div className="mock-confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="mcm-icon"><AlertTriangleIcon size={26} /></div>
                <h3>Exit Examination?</h3>
                <p>Are you sure you want to exit? Your exam progress will be lost.</p>
                <div className="mcm-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary mcm-cancel-btn"
                    onClick={() => setShowExitConfirm(false)}
                  >
                    Resume Exam
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mcm-exit-btn"
                    onClick={onExit}
                  >
                    Exit to Homescreen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          PHASE 3: RESULT & COMPREHENSIVE SCORECARD
         ═══════════════════════════════════════════════════════ */}
      {phase === 'result' && (
        <div className="mock-page-result">
          {/* Top navigation header */}
          <div className="mock-page-nav-header">
            <button
              type="button"
              className="mock-page-back-btn"
              onClick={onExit}
              title="Return to Homescreen"
            >
              <ChevronLeftIcon size={16} />
              <span>Back to Homescreen</span>
            </button>
            <div className="mock-page-mode-pill">
              <CheckCircleIcon size={14} />
              <span>Exam Complete • Scorecard</span>
            </div>
          </div>

          <div className="mock-result-screen">
            {/* Hero Result Banner */}
            <div className="mock-result-hero">
              <div className="mrh-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <CalendarIcon size={14} />
                <span>{activeYear === 'all' ? 'All Years Mixed' : `${activeYear} Exam Pattern`}</span>
              </div>
              <div className="mrh-trophy">
                <TrophyIcon size={42} />
              </div>
              <h2 className="mrh-title">
                {percentage >= 65
                  ? 'Outstanding Performance!'
                  : percentage >= 45
                  ? 'Good Effort!'
                  : 'Keep Practicing!'}
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
                <span className="mres-lbl">Correct (+{correctCount})</span>
              </div>
              <div className="mres-stat-card red">
                <span className="mres-val">{wrongCount}</span>
                <span className="mres-lbl">Wrong (−{(wrongCount * 0.3333).toFixed(2)})</span>
              </div>
              <div className="mres-stat-card gray">
                <span className="mres-val">{unansweredCount}</span>
                <span className="mres-lbl">Unanswered (0)</span>
              </div>
              <div className="mres-stat-card blue">
                <span className="mres-val">
                  {Object.keys(answers).length > 0
                    ? `${Math.round((correctCount / Object.keys(answers).length) * 100)}%`
                    : '0%'}
                </span>
                <span className="mres-lbl">Accuracy Rate</span>
              </div>
            </div>

            {/* Section-Wise Breakdown Table */}
            <div className="mock-breakdown-card">
              <div className="mbc-header">
                <h3>Section-Wise Syllabus Breakdown</h3>
                <span className="mbc-target">Target 70%+ across all sections</span>
              </div>
              <div className="mbc-table-wrap">
                <table className="mbc-table">
                  <thead>
                    <tr>
                      <th>Part / Subject</th>
                      <th>Topic</th>
                      <th>Total Qs</th>
                      <th>Correct</th>
                      <th>Wrong</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DISTRIBUTION.map((seg) => {
                      const segQs = questions.filter((item) => item.segCode === seg.code);
                      const sTotal = segQs.length;
                      let sCorrect = 0;
                      let sWrong = 0;
                      segQs.forEach((item) => {
                        const idx = item.qNum - 1;
                        if (answers[idx] === item.answer) sCorrect++;
                        else if (answers[idx] !== undefined) sWrong++;
                      });
                      const sScore = Math.max(0, Number((sCorrect - sWrong * 0.3333).toFixed(2)));
                      return (
                        <tr key={seg.code}>
                          <td><span className="seg-part-badge">{seg.part}</span></td>
                          <td><strong>{seg.label}</strong></td>
                          <td>{sTotal}</td>
                          <td className="green-text">+{sCorrect}</td>
                          <td className="red-text">{sWrong > 0 ? `−${sWrong}` : '0'}</td>
                          <td>
                            <strong className="seg-score">{sScore}</strong> / {seg.marks}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Question Review Section with Filter Pills */}
            <div className="mock-review-section">
              <div className="mrs-header">
                <h3>Detailed Question Paper Review</h3>
                <div className="mrs-filter-pills">
                  <button
                    type="button"
                    className={`mrs-pill ${reviewFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('all')}
                  >
                    All ({totalQuestions})
                  </button>
                  <button
                    type="button"
                    className={`mrs-pill wrong ${reviewFilter === 'wrong' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('wrong')}
                  >
                    Incorrect ({wrongCount})
                  </button>
                  <button
                    type="button"
                    className={`mrs-pill correct ${reviewFilter === 'correct' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('correct')}
                  >
                    Correct ({correctCount})
                  </button>
                  <button
                    type="button"
                    className={`mrs-pill unans ${reviewFilter === 'unanswered' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('unanswered')}
                  >
                    Unanswered ({unansweredCount})
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
                        <span className="mrs-item-topic">{item.segLabel}</span>
                        <span
                          className={`mrs-item-badge ${
                            isCorrect ? 'correct' : isWrong ? 'wrong' : 'unanswered'
                          }`}
                        >
                          {isCorrect
                            ? 'Correct (+1.00)'
                            : isWrong
                            ? 'Wrong (−0.33)'
                            : 'Unanswered (0)'}
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
                              {isKey && (
                                <span className="mrs-opt-tag">
                                  <CheckIcon size={12} /> Correct Answer
                                </span>
                              )}
                              {isChosen && !isKey && (
                                <span className="mrs-opt-tag wrong">Your Answer</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {item.explanation && (
                        <div className="mrs-explanation-box">
                          <div className="explanation-header-title">
                            <InfoIcon size={14} />
                            <span className="explanation-heading">Explanation / വിശദീകരണം:</span>
                          </div>
                          <div className="mrs-explanation-text">
                            {cleanExplanation(item.explanation)}
                          </div>
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
                <RotateIcon size={15} />
                <span>Create Another Mock Exam</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary mrf-close"
                onClick={onExit}
              >
                <ChevronLeftIcon size={16} />
                <span>Return to Homescreen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
