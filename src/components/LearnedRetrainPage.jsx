import React, { useState, useMemo, useEffect } from 'react';
import {
  QUESTION_BANK,
  ENGLISH_QUESTION_BANK,
  CURRENT_AFFAIRS_QUESTION_BANK,
  CURRENT_AFFAIRS_MONTH_TOPICS,
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
  BarChartIcon,
  ClipboardListIcon
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
  },
  {
    id: 'question_papers',
    shortLabel: 'PAPERS',
    title: 'Question Papers (ചോദ്യപേപ്പറുകൾ)',
    IconComponent: ClipboardListIcon,
    accentColor: '#38bdf8',
    desc: 'Completed Kerala PSC Exam Question Papers (excl. Maths) with study and retrain modes'
  },
  {
    id: 'ca_capsules',
    shortLabel: 'CAPSULES',
    title: 'Current Affairs (Monthly Capsules)',
    IconComponent: CalendarIcon,
    accentColor: '#06b6d4',
    desc: 'Month-wise 2026 Current Affairs capsules with study and retrain modes'
  }
];

// Maths / Simple Arithmetic / Mental Ability detection (excluded from paper completion)
const isMathsQuestion = (q) => {
  if (!q) return false;
  const t = String(q.topic || '').trim().toLowerCase();
  if (['pq_maths', 'pq_arithmetic', 'pq_mental_ability', 'pq_simple_arithmetic', 'pq_quantitative_aptitude', 'mensuration'].includes(t)) {
    return true;
  }
  if (t.includes('math') || t.includes('arithmetic') || t.includes('mental ability') || t.includes('quantitative') || t.includes('mensuration')) {
    return true;
  }
  return false;
};

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

  // Study Material Tab States (Question Papers vs CA Monthly Capsules)
  const [studySubTab, setStudySubTab] = useState('papers'); // 'papers' | 'ca_monthly'
  const [selectedPaperForReading, setSelectedPaperForReading] = useState(null);
  const [selectedMonthForReading, setSelectedMonthForReading] = useState(null);
  const [activeCaSetIndex, setActiveCaSetIndex] = useState(0); // 0 = Part 1, 1 = Part 2... 'all'
  const [caPartSize, setCaPartSize] = useState(() => {
    try {
      const saved = Number(localStorage.getItem('psc_ca_part_size'));
      if ([25, 50, 100].includes(saved)) return saved;
    } catch (e) {}
    return 50;
  });
  const [qpFilter, setQpFilter] = useState('all'); // 'all' | 'completed' | '2026' | '2025' | '2024' | '2023' | '2022' | '2021'
  const [qpSearchQuery, setQpSearchQuery] = useState('');
  const [readingIncludeMaths, setReadingIncludeMaths] = useState(false);
  const [readingSearchQuery, setReadingSearchQuery] = useState('');
  const [caSearchQuery, setCaSearchQuery] = useState('');
  const [caReadingSearchQuery, setCaReadingSearchQuery] = useState('');
  const [customRetrainSet, setCustomRetrainSet] = useState(null);

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

  // All solved/learned question IDs by the user
  const completedQuestionIds = useMemo(() => {
    return new Set([
      ...(currentUser?.learnedQuestions || []),
      ...(currentUser?.solvedQuestions || [])
    ]);
  }, [currentUser?.learnedQuestions, currentUser?.solvedQuestions]);

  // Aggregate all official exam question papers
  const allQuestionPapers = useMemo(() => {
    if (!Array.isArray(PYQ_QUESTION_BANK)) return [];
    const map = new Map();
    for (const q of PYQ_QUESTION_BANK) {
      if (!q || !q.qp_code) continue;
      const key = q.qp_code;
      if (!map.has(key)) {
        map.set(key, {
          qpCode: key,
          year: q.year || '2026',
          questions: [],
          nonMathQuestions: []
        });
      }
      const entry = map.get(key);
      entry.questions.push(q);
      if (!isMathsQuestion(q)) {
        entry.nonMathQuestions.push(q);
      }
    }

    const list = Array.from(map.values()).map(p => {
      const totalCount = p.questions.length;
      const nonMathCount = p.nonMathQuestions.length;
      const mathCount = totalCount - nonMathCount;
      const completedCount = p.nonMathQuestions.filter(q => completedQuestionIds.has(q.id)).length;
      const isCompleted = nonMathCount > 0 && completedCount >= nonMathCount;
      const progressPct = nonMathCount > 0 ? Math.round((completedCount / nonMathCount) * 100) : 0;

      return {
        ...p,
        totalCount,
        nonMathCount,
        mathCount,
        completedCount,
        isCompleted,
        progressPct
      };
    });

    list.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? -1 : 1;
      }
      if (a.year !== b.year) {
        return b.year.localeCompare(a.year);
      }
      const numA = parseInt(String(a.qpCode).match(/\d+/)?.[0] || '9999', 10);
      const numB = parseInt(String(b.qpCode).match(/\d+/)?.[0] || '9999', 10);
      return numA - numB || a.qpCode.localeCompare(b.qpCode);
    });

    return list;
  }, [completedQuestionIds]);

  const completedPapersCount = useMemo(() => {
    return allQuestionPapers.filter(p => p.isCompleted).length;
  }, [allQuestionPapers]);

  // Filtered Question Papers list
  const filteredPapers = useMemo(() => {
    return allQuestionPapers.filter(p => {
      if (qpFilter === 'completed' && !p.isCompleted) return false;
      if (['2026', '2025', '2024', '2023', '2022', '2021'].includes(qpFilter) && p.year !== qpFilter) return false;

      if (qpSearchQuery.trim()) {
        const q = qpSearchQuery.toLowerCase().trim();
        const codeMatch = p.qpCode.toLowerCase().includes(q);
        const yearMatch = p.year.includes(q);
        return codeMatch || yearMatch;
      }
      return true;
    });
  }, [allQuestionPapers, qpFilter, qpSearchQuery]);

  // Questions for reading mode in selected paper
  const readingQuestions = useMemo(() => {
    if (!selectedPaperForReading) return [];
    const base = readingIncludeMaths
      ? selectedPaperForReading.questions
      : selectedPaperForReading.nonMathQuestions;
    if (!readingSearchQuery.trim()) return base;
    const q = readingSearchQuery.toLowerCase().trim();
    return base.filter(item => {
      const questionText = (item.question || '').toLowerCase();
      const optionsText = (item.options || []).join(' ').toLowerCase();
      const topicText = (item.topic || '').toLowerCase();
      return questionText.includes(q) || optionsText.includes(q) || topicText.includes(q);
    });
  }, [selectedPaperForReading, readingIncludeMaths, readingSearchQuery]);

  // Aggregate 2026 Monthly Current Affairs capsules
  const allCaMonths = useMemo(() => {
    if (!Array.isArray(CURRENT_AFFAIRS_MONTH_TOPICS) || !Array.isArray(CURRENT_AFFAIRS_QUESTION_BANK)) return [];
    return CURRENT_AFFAIRS_MONTH_TOPICS.map(m => {
      const questions = CURRENT_AFFAIRS_QUESTION_BANK.filter(q => {
        if (!q) return false;
        if (m.qp_code && q.qp_code === m.qp_code) return true;
        if (m.id && (q.category === m.id || q.topic === m.id)) return true;
        return false;
      });
      const completedCount = questions.filter(q => completedQuestionIds.has(q.id)).length;
      const totalCount = questions.length;
      const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      const isCompleted = totalCount > 0 && completedCount >= totalCount;
      return {
        ...m,
        questions,
        totalCount,
        completedCount,
        progressPct,
        isCompleted
      };
    });
  }, [completedQuestionIds]);

  // Modular Question Parts for each month capsule (customizable: 25 / 50 / 100 Qs per tab)
  const caMonthSets = useMemo(() => {
    if (!selectedMonthForReading || !Array.isArray(selectedMonthForReading.questions)) return [];
    const allQs = selectedMonthForReading.questions;
    const total = allQs.length;
    const batchSize = caPartSize || 50;
    const partCount = Math.ceil(total / batchSize);
    const result = [];
    for (let i = 0; i < partCount; i++) {
      const start = i * batchSize;
      const end = Math.min((i + 1) * batchSize, total);
      const setQuestions = allQs.slice(start, end);
      const completedInSet = setQuestions.filter(q => completedQuestionIds.has(q.id)).length;
      result.push({
        partIndex: i,
        partNumber: i + 1,
        label: `Part ${i + 1}`,
        rangeText: `${start + 1}–${end}`,
        count: setQuestions.length,
        startIndex: start,
        endIndex: end,
        completedCount: completedInSet,
        isCompleted: setQuestions.length > 0 && completedInSet >= setQuestions.length,
        progressPct: setQuestions.length > 0 ? Math.round((completedInSet / setQuestions.length) * 100) : 0,
        questions: setQuestions
      });
    }
    return result;
  }, [selectedMonthForReading, caPartSize, completedQuestionIds]);

  const activeCaSet = useMemo(() => {
    if (activeCaSetIndex === 'all') return null;
    return caMonthSets[activeCaSetIndex] || caMonthSets[0] || null;
  }, [caMonthSets, activeCaSetIndex]);

  const filteredCaMonths = useMemo(() => {
    if (!caSearchQuery.trim()) return allCaMonths;
    const q = caSearchQuery.trim().toLowerCase();
    return allCaMonths.filter(m => {
      return (
        String(m.name || '').toLowerCase().includes(q) ||
        String(m.qp_code || '').toLowerCase().includes(q) ||
        String(m.desc || '').toLowerCase().includes(q)
      );
    });
  }, [allCaMonths, caSearchQuery]);

  const readingCaQuestions = useMemo(() => {
    if (!selectedMonthForReading) return [];
    const base = activeCaSet ? activeCaSet.questions : (selectedMonthForReading.questions || []);
    if (!caReadingSearchQuery.trim()) return base;
    const q = caReadingSearchQuery.trim().toLowerCase();
    return base.filter(item => {
      const questionText = (item.question || '').toLowerCase();
      const optionsText = (item.options || []).join(' ').toLowerCase();
      const topicText = (item.topic || '').toLowerCase();
      return questionText.includes(q) || optionsText.includes(q) || topicText.includes(q);
    });
  }, [selectedMonthForReading, activeCaSet, caReadingSearchQuery]);

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
  // RETRAIN SESSION LOGIC
  // -------------------------------------------------------------
  const startRetrainSession = (overrideSet) => {
    const setToUse = overrideSet || customRetrainSet || currentSet;
    if (!setToUse?.questions?.length) return;

    if (overrideSet) {
      setCustomRetrainSet(overrideSet);
    }
    setIsRetraining(true);
    setRetrainCurrentIndex(0);
    setRetrainSelectedOption(null);
    setRetrainIsAnswered(false);
    setRetrainScore({ correct: 0, wrong: 0 });
    setRetrainMissedList([]);
    setRetrainCompleted(false);
    setQueuedNotification(null);
  };

  const handleStartPaperRetrain = (paper, includeMaths = false) => {
    if (!paper) return;
    const qList = includeMaths ? paper.questions : paper.nonMathQuestions;
    if (!qList || !qList.length) return;
    startRetrainSession({
      label: `QP ${paper.qpCode} (${paper.year})`,
      shortLabel: paper.qpCode,
      questions: qList,
      count: qList.length
    });
  };

  const handleStartCaMonthRetrain = (month, specificSet = undefined) => {
    if (!month) return;
    const targetSet = specificSet !== undefined
      ? specificSet
      : (selectedMonthForReading?.id === month.id ? activeCaSet : null);

    const qList = targetSet ? targetSet.questions : month.questions;
    if (!qList || !qList.length) return;

    const label = targetSet
      ? `${month.name} · ${targetSet.label} (${targetSet.rangeText})`
      : month.name;
    const shortLabel = targetSet
      ? `${month.qp_code || 'CA 2026'} P${targetSet.partNumber}`
      : (month.qp_code || 'CA 2026');

    startRetrainSession({
      label,
      shortLabel,
      questions: qList,
      count: qList.length
    });
  };

  const activeRetrainSet = customRetrainSet || currentSet;
  const activeRetrainQuestions = activeRetrainSet?.questions || [];
  const currentRetrainQuestion = activeRetrainQuestions[retrainCurrentIndex] || null;

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
    if (!activeRetrainQuestions.length) return;
    const nextIdx = retrainCurrentIndex + 1;
    if (nextIdx < activeRetrainQuestions.length) {
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
            SUBJECT CATEGORY SELECTOR (PYQ | MAL | ENG | CA | PAPERS)
            ----------------------------------------------------------- */}
        <nav className="retrain-subject-tabs" aria-label="Subject Selection">
          {SUBJECT_CONFIGS.map(subj => {
            const isQpTab = subj.id === 'question_papers';
            const isCaCapsulesTab = subj.id === 'ca_capsules';
            const count = isQpTab
              ? completedPapersCount
              : isCaCapsulesTab
                ? allCaMonths.filter(m => m.isCompleted).length
                : (learnedBySubject[subj.id] || []).length;
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
                  setSelectedPaperForReading(null);
                  setSelectedMonthForReading(null);
                  setActiveCaSetIndex(0);
                }}
              >
                <div className="retrain-subject-icon-box">
                  <Icon size={18} />
                </div>
                <div className="retrain-subject-info">
                  <div className="retrain-subject-top">
                    <strong className="retrain-subject-short">{subj.shortLabel}</strong>
                    <span className="retrain-subject-badge">
                      {isQpTab || isCaCapsulesTab ? `${count} Finished` : `${count} Learned`}
                    </span>
                  </div>
                  <span className="retrain-subject-tabs-count">
                    {isQpTab
                      ? `${count} of ${allQuestionPapers.length} Papers (Excl. Maths)`
                      : isCaCapsulesTab
                        ? `${count} of ${allCaMonths.length} Months (2026)`
                        : count >= 100
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
                  {customRetrainSet ? customRetrainSet.label : `${activeSubjectConfig.shortLabel} • ${currentSet?.label}`}
                </span>
                <span className="retrain-counter">
                  Question <strong>{retrainCurrentIndex + 1}</strong> of <strong>{activeRetrainQuestions.length}</strong>
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
                onClick={() => {
                  setIsRetraining(false);
                  setCustomRetrainSet(null);
                }}
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
                  width: `${((retrainCurrentIndex + 1) / (activeRetrainQuestions.length || 1)) * 100}%`
                }}
              />
            </div>

            {/* Question Card Content */}
            <div className="retrain-question-body">
              <div className="retrain-q-num">
                Question {retrainCurrentIndex + 1} of {activeRetrainQuestions.length}
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
                        {retrainCurrentIndex + 1 < activeRetrainQuestions.length
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
              Summary for <strong>{customRetrainSet ? customRetrainSet.label : currentSet?.label}</strong> ({activeSubjectConfig.title}):
            </p>

            <div className="retrain-score-grid">
              <div className="retrain-score-box score-total">
                <span className="box-val">{activeRetrainQuestions.length}</span>
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
                  {Math.round((retrainScore.correct / (activeRetrainQuestions.length || 1)) * 100)}%
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
                onClick={() => startRetrainSession(customRetrainSet)}
              >
                <RotateIcon size={16} />
                <span>Retrain This {activeSubject === 'ca_capsules' ? 'Capsule Part' : customRetrainSet ? 'Paper' : 'Set'} Again</span>
              </button>

              <button
                type="button"
                className="retrain-btn-secondary"
                onClick={() => {
                  setIsRetraining(false);
                  setRetrainCompleted(false);
                  setCustomRetrainSet(null);
                }}
              >
                <span>Back to {activeSubject === 'ca_capsules' ? 'Monthly Capsules' : customRetrainSet ? 'Question Papers' : 'Question Sets'}</span>
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
          {activeSubject === 'question_papers' ? (
            /* ============================================================
               QUESTION PAPERS (PAPERS) TAB CONTENT
               ============================================================ */
            selectedPaperForReading ? (
              /* Reading Mode (വായിച്ചു പഠിക്കാൻ) - Clean Q&A format identical to PYQ tab */
              <div className="retrain-paper-read-view">
                {/* Unified Compact Control Card */}
                <div className="retrain-paper-header-card">
                  {/* Top Bar: Back to All Papers on left, Completion Status on right */}
                  <div className="retrain-paper-nav-bar">
                    <button
                      type="button"
                      className="retrain-paper-back-btn"
                      onClick={() => setSelectedPaperForReading(null)}
                      title="Back to all question papers"
                    >
                      <ChevronLeftIcon size={16} />
                      <span>All Papers</span>
                    </button>

                    <div className="retrain-paper-nav-status">
                      {selectedPaperForReading.isCompleted ? (
                        <span className="retrain-paper-status-badge completed">
                          <CheckIcon size={12} /> 100% Completed
                        </span>
                      ) : (
                        <span className="retrain-paper-status-badge in-progress">
                          {selectedPaperForReading.completedCount}/{selectedPaperForReading.nonMathCount} Done ({selectedPaperForReading.progressPct}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Paper Identity: Title & Badges */}
                  <div className="retrain-paper-identity">
                    <h2 className="retrain-paper-code-title">
                      QP {selectedPaperForReading.qpCode}
                    </h2>
                    <div className="retrain-paper-badges-row">
                      <span className="retrain-paper-year-pill">
                        Year {selectedPaperForReading.year}
                      </span>
                      <span className="retrain-paper-count-pill">
                        {readingIncludeMaths
                          ? `${selectedPaperForReading.totalCount} Questions (Incl. Maths)`
                          : `${selectedPaperForReading.nonMathCount} Questions (Excl. Maths)`}
                      </span>
                    </div>
                  </div>

                  {/* Action: Prominent Retrain Button */}
                  <button
                    type="button"
                    className="retrain-action-btn-primary retrain-paper-start-btn"
                    onClick={() => handleStartPaperRetrain(selectedPaperForReading, readingIncludeMaths)}
                    title="Start interactive retrain quiz on this paper"
                  >
                    <RotateIcon size={16} />
                    <span>
                      Start Retrain Quiz ({readingIncludeMaths ? selectedPaperForReading.totalCount : selectedPaperForReading.nonMathCount} Qs)
                    </span>
                  </button>

                  {/* Search Bar & Maths Toggle */}
                  <div className="retrain-paper-filter-section">
                    <div className="retrain-search-box">
                      <SearchIcon size={15} className="search-icon" />
                      <input
                        type="text"
                        className="retrain-search-input"
                        placeholder={`Search questions in QP ${selectedPaperForReading.qpCode}...`}
                        value={readingSearchQuery}
                        onChange={(e) => setReadingSearchQuery(e.target.value)}
                      />
                      {readingSearchQuery && (
                        <button
                          type="button"
                          className="retrain-search-clear"
                          onClick={() => setReadingSearchQuery('')}
                          title="Clear search"
                        >
                          <XIcon size={13} />
                        </button>
                      )}
                    </div>

                    {selectedPaperForReading.mathCount > 0 && (
                      <label className="retrain-paper-maths-toggle">
                        <input
                          type="checkbox"
                          checked={readingIncludeMaths}
                          onChange={(e) => setReadingIncludeMaths(e.target.checked)}
                        />
                        <span className="maths-toggle-text">
                          Include Maths ({selectedPaperForReading.mathCount} Qs)
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Clean Questions & Answers List (Identical to PYQ tab) */}
                <div className="retrain-qa-stack">
                  {readingQuestions.length === 0 ? (
                    <div className="retrain-no-results">
                      <p>No questions matched your search in this paper.</p>
                    </div>
                  ) : (
                    readingQuestions.map((item, localIdx) => {
                      const isQBookmarked = isBookmarked ? isBookmarked(item.id) : false;
                      const answerText = getAnswerText(item);
                      const matchedText = buildMatchedQuestion(item);

                      return (
                        <article key={item.id || localIdx} className="retrain-qa-card">
                          {/* Top Meta Line */}
                          <div className="retrain-qa-header">
                            <div className="retrain-qa-badges">
                              <span className="retrain-qa-number">#{localIdx + 1}</span>
                              {item.year && <span className="retrain-qa-badge">{item.year}</span>}
                              {isMathsQuestion(item) && (
                                <span className="retrain-qa-badge maths-badge">Maths</span>
                              )}
                            </div>

                            {onToggleBookmark && (
                              <button
                                type="button"
                                className={`retrain-bookmark-btn ${isQBookmarked ? 'bookmarked' : ''}`}
                                onClick={() => onToggleBookmark(item.id)}
                                title={isQBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
                              >
                                {isQBookmarked ? <BookmarkFilledIcon size={16} /> : <BookmarkIcon size={16} />}
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
                              <span className="retrain-qa-answer-text">{answerText}</span>
                            </div>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* Question Papers List View */
              <div className="retrain-qp-list-view">
                {/* Controls Header */}
                <div className="retrain-qp-controls-card">
                  <div className="retrain-qp-top-summary">
                    <div className="retrain-qp-title-block">
                      <h2 className="retrain-qp-view-title">Official Kerala PSC Question Papers</h2>
                      <p className="retrain-qp-view-desc">
                        Complete all non-maths questions in a paper to mark it <strong>100% Completed</strong>. Re-study answers or retrain anytime!
                      </p>
                    </div>
                    <div className="retrain-qp-counter-pill">
                      <span className="counter-num">{completedPapersCount}</span>
                      <span className="counter-label">of {allQuestionPapers.length} Finished</span>
                    </div>
                  </div>

                  {/* Filter Chips Bar */}
                  <div className="retrain-qp-filters-row">
                    <button
                      type="button"
                      className={`retrain-qp-filter-chip ${qpFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setQpFilter('all')}
                    >
                      All Papers ({allQuestionPapers.length})
                    </button>

                    <button
                      type="button"
                      className={`retrain-qp-filter-chip completed-chip ${qpFilter === 'completed' ? 'active' : ''}`}
                      onClick={() => setQpFilter('completed')}
                    >
                      <CheckIcon size={13} />
                      Completed Only ({completedPapersCount})
                    </button>

                    {['2026', '2025', '2024', '2023', '2022', '2021'].map(yr => {
                      const yrCount = allQuestionPapers.filter(p => p.year === yr).length;
                      return (
                        <button
                          key={yr}
                          type="button"
                          className={`retrain-qp-filter-chip ${qpFilter === yr ? 'active' : ''}`}
                          onClick={() => setQpFilter(yr)}
                        >
                          {yr} ({yrCount})
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar */}
                  <div className="retrain-search-box">
                    <SearchIcon size={15} className="search-icon" />
                    <input
                      type="text"
                      className="retrain-search-input"
                      placeholder="Search question papers by QP Code (e.g. 117/2026, 51/2026)..."
                      value={qpSearchQuery}
                      onChange={(e) => setQpSearchQuery(e.target.value)}
                    />
                    {qpSearchQuery && (
                      <button
                        type="button"
                        className="retrain-search-clear"
                        onClick={() => setQpSearchQuery('')}
                      >
                        <XIcon size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Papers Grid */}
                <div className="retrain-qp-cards-grid">
                  {filteredPapers.length === 0 ? (
                    <div className="retrain-no-results">
                      {qpFilter === 'completed' ? (
                        <div className="retrain-empty-completed">
                          <CheckCircleIcon size={36} className="empty-icon-green" />
                          <h3>No Question Papers 100% Completed Yet</h3>
                          <p>Complete all non-maths questions (~80 questions) in any question paper to unlock it here.</p>
                          <button
                            type="button"
                            className="retrain-filter-reset-btn"
                            onClick={() => setQpFilter('all')}
                          >
                            View All Question Papers
                          </button>
                        </div>
                      ) : (
                        <p>No question papers found matching "{qpSearchQuery}".</p>
                      )}
                    </div>
                  ) : (
                    filteredPapers.map(paper => {
                      return (
                        <div
                          key={paper.qpCode}
                          className={`retrain-qp-card ${paper.isCompleted ? 'is-completed' : ''}`}
                        >
                          <div className="retrain-qp-card-header">
                            <div className="retrain-qp-card-meta">
                              <span className="retrain-qp-year-badge">{paper.year}</span>
                              <h3 className="retrain-qp-code-title">QP {paper.qpCode}</h3>
                            </div>

                            {paper.isCompleted ? (
                              <span className="retrain-qp-status-tag completed">
                                <CheckIcon size={12} /> Finished (100%)
                              </span>
                            ) : paper.completedCount > 0 ? (
                              <span className="retrain-qp-status-tag in-progress">
                                {paper.completedCount}/{paper.nonMathCount} Done
                              </span>
                            ) : (
                              <span className="retrain-qp-status-tag not-started">
                                0/{paper.nonMathCount}
                              </span>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="retrain-qp-progress-wrap">
                            <div className="retrain-qp-progress-bar">
                              <div
                                className={`retrain-qp-progress-fill ${paper.isCompleted ? 'completed' : ''}`}
                                style={{ width: `${paper.progressPct}%` }}
                              />
                            </div>
                            <div className="retrain-qp-progress-text">
                              <span>{paper.completedCount} of {paper.nonMathCount} non-maths answered</span>
                              <strong>{paper.progressPct}%</strong>
                            </div>
                          </div>

                          {/* Two Action Buttons: Read Mode & Retrain Mode */}
                          <div className="retrain-qp-card-actions">
                            <button
                              type="button"
                              className="retrain-qp-btn-read"
                              onClick={() => {
                                setSelectedPaperForReading(paper);
                                setReadingSearchQuery('');
                                setReadingIncludeMaths(false);
                              }}
                              title="Open Question Paper to read questions & answers"
                            >
                              <BookOpenIcon size={14} />
                              <span>Read Q&A</span>
                            </button>

                            <button
                              type="button"
                              className="retrain-qp-btn-retrain"
                              onClick={() => handleStartPaperRetrain(paper)}
                              title="Retrain and test your memory on this paper"
                            >
                              <RotateIcon size={14} />
                              <span>Retrain ({paper.nonMathCount} Qs)</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )
          ) : activeSubject === 'ca_capsules' ? (
            /* ============================================================
               CURRENT AFFAIRS (MONTHLY CAPSULES) TAB CONTENT
               ============================================================ */
            selectedMonthForReading ? (
              /* Reading Mode: Specific CA Month (Split into modular 50-Q parts) */
              <div className="retrain-paper-read-view">
                <div className="retrain-paper-header-card">
                  <div className="retrain-paper-nav-bar">
                    <button
                      type="button"
                      className="retrain-paper-back-btn"
                      onClick={() => {
                        setSelectedMonthForReading(null);
                        setActiveCaSetIndex(0);
                        setCaReadingSearchQuery('');
                      }}
                      title="Back to all CA months"
                    >
                      <ChevronLeftIcon size={16} />
                      <span>All Months</span>
                    </button>

                    <div className="retrain-paper-nav-status">
                      {selectedMonthForReading.isCompleted ? (
                        <span className="retrain-paper-status-badge completed">
                          <CheckIcon size={12} /> 100% Completed
                        </span>
                      ) : (
                        <span className="retrain-paper-status-badge in-progress">
                          {selectedMonthForReading.completedCount}/{selectedMonthForReading.totalCount} Done ({selectedMonthForReading.progressPct}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="retrain-paper-identity">
                    <h2 className="retrain-paper-code-title">
                      {selectedMonthForReading.name}
                    </h2>
                    <div className="retrain-paper-badges-row">
                      <span className="retrain-paper-year-pill">
                        {selectedMonthForReading.qp_code || '2026 Capsule'}
                      </span>
                      <span className="retrain-paper-count-pill">
                        {selectedMonthForReading.totalCount} Questions ({caMonthSets.length} Parts of {caPartSize} Qs)
                      </span>
                      {activeCaSet && (
                        <span
                          className="retrain-paper-count-pill"
                          style={{
                            borderColor: 'rgba(56, 189, 248, 0.4)',
                            background: 'rgba(56, 189, 248, 0.12)',
                            color: '#38bdf8',
                            fontWeight: 700
                          }}
                        >
                          Viewing {activeCaSet.label} (Qns {activeCaSet.rangeText})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toolbar: Questions Per Tab Segmented Selector */}
                  <div className="retrain-capsule-toolbar">
                    <div className="retrain-split-selector">
                      <span className="retrain-split-label">Per Tab:</span>
                      <div className="retrain-split-segmented">
                        {[25, 50, 100].map(sz => (
                          <button
                            key={sz}
                            type="button"
                            className={`retrain-seg-btn ${caPartSize === sz ? 'active' : ''}`}
                            onClick={() => {
                              setCaPartSize(sz);
                              setActiveCaSetIndex(0);
                              try {
                                localStorage.setItem('psc_ca_part_size', String(sz));
                              } catch (e) {}
                            }}
                          >
                            {sz} Qs
                          </button>
                        ))}
                      </div>
                    </div>

                    <span className="retrain-parts-count-hint">
                      {caMonthSets.length} Parts ({caPartSize} Qs each)
                    </span>
                  </div>

                  {/* Horizontal Scrollable Modular Parts Pill Bar */}
                  <div className="retrain-capsule-parts-bar">
                    {caMonthSets.map(part => {
                      const isPartActive = activeCaSetIndex === part.partIndex;
                      return (
                        <button
                          key={part.partIndex}
                          type="button"
                          className={`retrain-capsule-part-pill ${isPartActive ? 'active' : ''}`}
                          onClick={() => {
                            setActiveCaSetIndex(part.partIndex);
                            setCaReadingSearchQuery('');
                          }}
                        >
                          <span className="part-pill-title">{part.label}</span>
                          <span className="part-pill-range">{part.rangeText}</span>
                          {part.isCompleted ? (
                            <span className="part-pill-status completed" title="100% Completed">
                              <CheckIcon size={12} />
                            </span>
                          ) : part.completedCount > 0 ? (
                            <span className="part-pill-status in-progress">
                              {part.completedCount}/{part.count}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      className={`retrain-capsule-part-pill all-pill ${activeCaSetIndex === 'all' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveCaSetIndex('all');
                        setCaReadingSearchQuery('');
                      }}
                    >
                      <span className="part-pill-title">All Qs</span>
                      <span className="part-pill-range">{selectedMonthForReading.totalCount}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="retrain-action-btn-primary retrain-paper-start-btn"
                    onClick={() => handleStartCaMonthRetrain(selectedMonthForReading, activeCaSet)}
                    title={`Start interactive retrain quiz on ${activeCaSet ? `${activeCaSet.label} (${activeCaSet.count} Qs)` : selectedMonthForReading.name}`}
                  >
                    <RotateIcon size={16} />
                    <span>
                      Start Retrain Quiz ({activeCaSet ? `${activeCaSet.label} · ${activeCaSet.count} Qs` : `All ${selectedMonthForReading.totalCount} Qs`})
                    </span>
                  </button>

                  <div className="retrain-paper-filter-section">
                    <div className="retrain-search-box">
                      <SearchIcon size={15} className="search-icon" />
                      <input
                        type="text"
                        className="retrain-search-input"
                        placeholder={
                          activeCaSet
                            ? `Search in ${selectedMonthForReading.name} · ${activeCaSet.label} (${activeCaSet.rangeText})...`
                            : `Search all questions in ${selectedMonthForReading.name}...`
                        }
                        value={caReadingSearchQuery}
                        onChange={(e) => setCaReadingSearchQuery(e.target.value)}
                      />
                      {caReadingSearchQuery && (
                        <button
                          type="button"
                          className="retrain-search-clear"
                          onClick={() => setCaReadingSearchQuery('')}
                          title="Clear search"
                        >
                          <XIcon size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Clean Questions & Answers List */}
                <div className="retrain-qa-stack">
                  {readingCaQuestions.length === 0 ? (
                    <div className="retrain-no-results">
                      <p>
                        {caReadingSearchQuery
                          ? `No questions matched "${caReadingSearchQuery}" in this ${activeCaSet ? activeCaSet.label : 'capsule'}.`
                          : 'No questions available in this set.'}
                      </p>
                    </div>
                  ) : (
                    readingCaQuestions.map((item, localIdx) => {
                      const isQBookmarked = isBookmarked ? isBookmarked(item.id) : false;
                      const answerText = getAnswerText(item);
                      const matchedText = buildMatchedQuestion(item);

                      // Accurate 1-based question number in the month capsule
                      const itemIndexInMonth = (selectedMonthForReading?.questions || []).findIndex(q => q.id === item.id);
                      const displayNumber = itemIndexInMonth >= 0
                        ? itemIndexInMonth + 1
                        : ((activeCaSet ? activeCaSet.startIndex : 0) + localIdx + 1);

                      return (
                        <article key={item.id || displayNumber} className="retrain-qa-card">
                          <div className="retrain-qa-header">
                            <div className="retrain-qa-badges">
                              <span className="retrain-qa-number">#{displayNumber}</span>
                              {activeCaSet && (
                                <span
                                  className="retrain-qa-badge"
                                  style={{
                                    borderColor: 'rgba(56, 189, 248, 0.3)',
                                    color: '#38bdf8'
                                  }}
                                >
                                  {activeCaSet.label}
                                </span>
                              )}
                              {item.category && (
                                <span className="retrain-qa-badge">
                                  {item.category}
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
                                {isQBookmarked ? <BookmarkFilledIcon size={16} /> : <BookmarkIcon size={16} />}
                              </button>
                            )}
                          </div>

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
                            <div className="retrain-qa-answer-row">
                              <span className="retrain-qa-answer-label">Answer:</span>
                              <span className="retrain-qa-answer-text">{answerText}</span>
                            </div>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* Month Capsules Grid View */
              <div className="retrain-qp-list-view">
                <div className="retrain-qp-controls-card">
                  <div className="retrain-qp-top-summary">
                    <div className="retrain-qp-title-block">
                      <h2 className="retrain-qp-view-title">2026 Current Affairs Monthly Capsules</h2>
                      <p className="retrain-qp-view-desc">
                        Study monthly capsules in Question & Direct Answer format or test your memory with retrain quizzes.
                      </p>
                    </div>
                    <div className="retrain-qp-counter-pill">
                      <span className="counter-num">{allCaMonths.length}</span>
                      <span className="counter-label">Monthly Capsules</span>
                    </div>
                  </div>

                  <div className="retrain-search-box">
                    <SearchIcon size={15} className="search-icon" />
                    <input
                      type="text"
                      className="retrain-search-input"
                      placeholder="Search months (e.g. September, ഓഗസ്റ്റ്)..."
                      value={caSearchQuery}
                      onChange={(e) => setCaSearchQuery(e.target.value)}
                    />
                    {caSearchQuery && (
                      <button
                        type="button"
                        className="retrain-search-clear"
                        onClick={() => setCaSearchQuery('')}
                        title="Clear search"
                      >
                        <XIcon size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="retrain-qp-cards-grid">
                  {filteredCaMonths.length === 0 ? (
                    <div className="retrain-no-results">
                      <p>No monthly capsules match your search.</p>
                    </div>
                  ) : (
                    filteredCaMonths.map(month => (
                      <div
                        key={month.id}
                        className={`retrain-qp-card ${month.isCompleted ? 'is-completed' : ''}`}
                      >
                        <div className="retrain-qp-card-header">
                          <div className="retrain-qp-card-meta">
                            <span className="retrain-qp-year-badge">
                              {month.qp_code || '2026 CA'}
                            </span>
                            <h3 className="retrain-qp-code-title">{month.name}</h3>
                          </div>
                          {month.isCompleted ? (
                            <span className="retrain-qp-status-tag completed">
                              <CheckIcon size={12} /> 100%
                            </span>
                          ) : month.completedCount > 0 ? (
                            <span className="retrain-qp-status-tag in-progress">
                              {month.progressPct}%
                            </span>
                          ) : null}
                        </div>

                        <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                          {month.desc}
                        </p>

                        <div className="retrain-qp-progress-wrap">
                          <div className="retrain-qp-progress-bar">
                            <div
                              className={`retrain-qp-progress-fill ${month.isCompleted ? 'completed' : ''}`}
                              style={{ width: `${month.progressPct}%` }}
                            />
                          </div>
                          <div className="retrain-qp-progress-text">
                            <span>{month.totalCount} Questions ({Math.ceil(month.totalCount / caPartSize)} Parts of {caPartSize} Qs)</span>
                            <span><strong>{month.completedCount}</strong> learned</span>
                          </div>
                        </div>

                        <div className="retrain-qp-card-actions">
                          <button
                            type="button"
                            className="retrain-qp-btn-read"
                            onClick={() => {
                              setSelectedMonthForReading(month);
                              setActiveCaSetIndex(0);
                              setCaReadingSearchQuery('');
                            }}
                            title={`Read questions and answers for ${month.name}`}
                          >
                            <BookOpenIcon size={14} />
                            <span>Read Q&A</span>
                          </button>
                          <button
                            type="button"
                            className="retrain-qp-btn-retrain"
                            onClick={() => handleStartCaMonthRetrain(month, null)}
                            title={`Retrain and quiz yourself on ${month.name}`}
                          >
                            <RotateIcon size={14} />
                            <span>Retrain ({month.totalCount} Qs)</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          ) : (
            /* ============================================================
               STANDARD 100-QUESTION RETENTION SETS VIEW
               ============================================================ */
            currentSubjectList.length === 0 ? (
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
            )
          )}
        </div>
      )}
    </div>
  );
}
