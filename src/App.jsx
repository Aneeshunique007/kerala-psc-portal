import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  SYLLABUS_TOPICS,
  QUESTION_BANK,
  ENGLISH_SYLLABUS_TOPICS,
  ENGLISH_QUESTION_BANK,
  PYQ_TOPICS,
  PYQ_QUESTION_BANK,
  PYQ_YEARS
} from './data/questions';
import { soundFX } from './utils/soundEffects';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import ConfirmModal from './components/ConfirmModal';
import SyllabusModal from './components/SyllabusModal';
import BlueprintDashboard from './components/BlueprintDashboard';
import MockExamModal from './components/MockExamModal';
import FormattedQuestion from './components/FormattedQuestion';
import './App.css';

const MALAYALAM_TOPIC_ALIASES = {
  ottapadam: ['ottapadam', 'ഒറ്റപ്പദം'],
  viparitham: ['viparitham', 'വിപരീതപദം'],
  samanapadham: ['samanapadham'],
  paryayam: ['paryayam', 'പര്യായപദം', 'പര്യായം'],
  arthavyathyasam: ['ശബ്ദാർത്ഥം', 'അർത്ഥവ്യത്യാസം'],
  shaylikal: ['shaylikal', 'shailikal', 'ശൈലികൾ'],
  pirichezhuthal: ['pirichezhuthal', 'പിരിച്ചെഴുത്ത്'],
  sandhi: ['സന്ധി'],
  cherkkayzhuthuka: ['cherkkayzhuthuka'],
  padashuddhi: ['padashuddhi', 'പദശുദ്ധി'],
  vakyashuddhi: ['vakyashuddhi'],
  lingam: ['lingam', 'ethirlingam', 'എതിർലിംഗം'],
  vachanam: ['vachanam'],
  krithikal: ['krithikal', 'sahithyam', 'കൃതികളും കഥാപാത്രങ്ങളും'],
  varikal: ['varikal', 'കാവ്യവരികളും കവികളും'],
  paribhasha: ['paribhasha'],
  ghadakapadam: ['ghadakapadam']
};

function QuestionDisplay({ text }) {
  return <FormattedQuestion text={text} />;
}

const getFreshQuestion = (q) => {
  if (!q) return q;
  const freshPYQ = PYQ_QUESTION_BANK.find(pq => pq.id === q.id);
  if (freshPYQ) return freshPYQ;
  const freshEng = ENGLISH_QUESTION_BANK.find(eq => eq.id === q.id);
  if (freshEng) return freshEng;
  const freshMal = QUESTION_BANK.find(mq => mq.id === q.id);
  if (freshMal) return freshMal;
  return q;
};

export default function App() {
  // Users and Auth State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('psc_malayalam_users');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(u => ({
        ...u,
        repeatQueue: (u.repeatQueue || []).map(rep => ({ ...getFreshQuestion(rep), ...rep })),
        upcomingRepeats: (u.upcomingRepeats || []).map(rep => ({ ...getFreshQuestion(rep), ...rep }))
      }));
    } catch {
      return [];
    }
  });

  const [activeUserId, setActiveUserId] = useState(() => {
    return localStorage.getItem('psc_active_user_id') || null;
  });

  const [activeSubject, setActiveSubject] = useState(() => {
    return localStorage.getItem('psc_active_subject') || 'malayalam';
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  const currentUser = users.find(u => u.id === activeUserId) || null;

  // Selected Topic & Practice State
  const [viewMode, setViewMode] = useState('blueprint'); // 'blueprint' (homepage) or 'quiz'
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [isRepeatOnlyMode, setIsRepeatOnlyMode] = useState(false);
  const [showMockExam, setShowMockExam] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showBookmarkDropdown, setShowBookmarkDropdown] = useState(false);
  const bookmarkDropdownRef = React.useRef(null);
  const [sidebarYearDropdownOpen, setSidebarYearDropdownOpen] = useState(false);
  const sidebarYearDropdownRef = React.useRef(null);

  // Themed Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    highlight: '',
    message: '',
    details: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    icon: '⚠️',
    variant: 'warning',
    onConfirm: () => {}
  });

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Subject-specific lists
  const currentSyllabusTopics = activeSubject === 'english'
    ? ENGLISH_SYLLABUS_TOPICS
    : activeSubject === 'pyq'
    ? PYQ_TOPICS
    : SYLLABUS_TOPICS;

  const currentQuestionBank = activeSubject === 'english'
    ? ENGLISH_QUESTION_BANK
    : activeSubject === 'pyq'
    ? PYQ_QUESTION_BANK
    : QUESTION_BANK;

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

  const handleResetTopicProgress = (userId, topicId, subject) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const tStat = u.stats?.topicStats?.[topicId] || { correct: 0, total: 0 };
        const newCorrect = Math.max(0, (u.stats?.correct || 0) - (tStat.correct || 0));
        const newTotal = Math.max(0, (u.stats?.total || 0) - (tStat.total || 0));

        const newTopicStats = { ...(u.stats?.topicStats || {}) };
        delete newTopicStats[topicId];

        const isTopicMatch = (q) => {
          if (!q) return false;
          if (subject === 'english' || subject === 'pyq') {
            return q.topic === topicId;
          }
          const aliases = MALAYALAM_TOPIC_ALIASES[topicId] || [topicId];
          return aliases.includes(q.topic);
        };

        const newRepeatQueue = (u.repeatQueue || []).filter(q => !isTopicMatch(q));
        const newUpcoming = (u.upcomingRepeats || []).filter(item => !isTopicMatch(item?.question));
        const newHistory = (u.questionHistory || []).filter(item => !isTopicMatch(item));

        return {
          ...u,
          stats: {
            ...u.stats,
            correct: newCorrect,
            total: newTotal,
            topicStats: newTopicStats
          },
          repeatQueue: newRepeatQueue,
          upcomingRepeats: newUpcoming,
          questionHistory: newHistory
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

  // Request Confirmation Handlers using custom themed popup
  const handleRequestResetTopic = (topic) => {
    const { solved } = getTopicCounts(topic.id);
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Topic Progress',
      highlight: `${topic.icon} ${topic.name}`,
      message: 'Are you sure you want to reset your progress for this topic?',
      details: solved > 0 
        ? `This will clear your ${solved} solved questions for this topic and reset progress back to 0.`
        : 'This will reset this topic\'s progress and mistake history back to 0.',
      confirmText: 'Reset Topic',
      cancelText: 'Cancel',
      icon: '↺',
      variant: 'warning',
      onConfirm: () => {
        handleResetTopicProgress(activeUserId, topic.id, activeSubject);
      }
    });
  };

  const handleRequestResetAllProgress = (userId) => {
    const targetUser = users.find(u => u.id === userId) || currentUser;
    setConfirmDialog({
      isOpen: true,
      title: 'Reset All Practice Progress',
      highlight: `Aspirant: ${targetUser?.name || 'Aspirant'}`,
      message: 'Are you sure you want to reset ALL practice progress across all topics and subjects?',
      details: 'This will reset your overall score to 0, clear all topic progress bars, and empty your mistake repeat queues.',
      confirmText: 'Reset All Progress',
      cancelText: 'Cancel',
      icon: '🔄',
      variant: 'danger',
      onConfirm: () => {
        handleResetProgress(userId);
      }
    });
  };

  const handleRequestDeleteAccount = (userId) => {
    const targetUser = users.find(u => u.id === userId) || currentUser;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Aspirant Profile',
      highlight: `Profile: ${targetUser?.name || 'Aspirant'}`,
      message: `Are you sure you want to permanently delete profile "${targetUser?.name || 'Aspirant'}"?`,
      details: 'All practice statistics, accuracy history, and saved data will be permanently removed.',
      confirmText: 'Delete Profile',
      cancelText: 'Cancel',
      icon: '🗑️',
      variant: 'danger',
      onConfirm: () => {
        handleDeleteAccount(userId);
      }
    });
  };

  const handleSwitchAccount = () => {
    setShowProfileModal(false);
    setShowAuthModal(true);
  };

  const handleSwitchSubject = (subject) => {
    setActiveSubject(subject);
    localStorage.setItem('psc_active_subject', subject);
    setSelectedTopic('all');
    setIsRepeatOnlyMode(false);
    setTopicDropdownOpen(false);
    setMobileSidebarOpen(false);
    setViewMode('quiz');
  };

  const handleSelectSubjectTopic = (subject, topicId) => {
    setActiveSubject(subject);
    localStorage.setItem('psc_active_subject', subject);
    setSelectedTopic(topicId);
    setViewMode('quiz');
    setIsRepeatOnlyMode(false);
    setTopicDropdownOpen(false);
    setMobileSidebarOpen(false);
  };

  const handleStartPracticeFromBlueprint = (subject, topicId) => {
    setActiveSubject(subject);
    localStorage.setItem('psc_active_subject', subject);
    setSelectedTopic(topicId);
    setViewMode('quiz');
    setIsRepeatOnlyMode(false);
    setTopicDropdownOpen(false);
    setMobileSidebarOpen(false);
  };

  const handleStartMockFromBlueprint = () => {
    setShowMockExam(true);
  };

  const questionCountsMap = {
    malayalam: QUESTION_BANK.length,
    english: ENGLISH_QUESTION_BANK.length,
    pyq: PYQ_QUESTION_BANK.length,
    pq_history: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_history').length,
    pq_geography: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_geography').length,
    pq_economics: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_economics').length,
    pq_constitution: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_constitution').length,
    pq_kerala_governance: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_kerala_governance').length,
    pq_science: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_science').length,
    pq_arts_sports: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_arts_sports').length,
    pq_computer: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_computer').length,
    pq_acts_laws: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_acts_laws').length,
    pq_current_affairs: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_current_affairs').length,
    pq_maths: PYQ_QUESTION_BANK.filter(q => q.topic === 'pq_maths').length
  };

  // Stats & repeat queues for current active user
  const userStats = currentUser?.stats || { correct: 0, total: 0, streak: 0, maxStreak: 0, topicStats: {} };
  const userRepeatQueue = currentUser?.repeatQueue || [];
  const userUpcomingRepeats = currentUser?.upcomingRepeats || [];
  const userHistory = currentUser?.questionHistory || [];

  // Bookmarked questions tracking
  const userBookmarks = currentUser?.bookmarkedQuestions || [];
  const isCurrentBookmarked = currentQuestion ? userBookmarks.includes(currentQuestion.id) : false;

  const handleToggleBookmark = (qId = currentQuestion?.id) => {
    if (!qId || !currentUser) return;
    const isBookmarked = userBookmarks.includes(qId);
    const updatedBookmarks = isBookmarked
      ? userBookmarks.filter(id => id !== qId)
      : [...userBookmarks, qId];

    const updated = users.map(u => {
      if (u.id === activeUserId) {
        return {
          ...u,
          bookmarkedQuestions: updatedBookmarks
        };
      }
      return u;
    });

    persistUsers(updated);
  };

  const getBookmarkedQuestionsList = () => {
    return userBookmarks.map(id => {
      return (
        QUESTION_BANK.find(q => q.id === id) ||
        ENGLISH_QUESTION_BANK.find(q => q.id === id) ||
        PYQ_QUESTION_BANK.find(q => q.id === id) ||
        null
      );
    }).filter(Boolean);
  };

  const bookmarkedList = getBookmarkedQuestionsList();

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bookmarkDropdownRef.current && !bookmarkDropdownRef.current.contains(e.target)) {
        setShowBookmarkDropdown(false);
      }
      if (sidebarYearDropdownRef.current && !sidebarYearDropdownRef.current.contains(e.target)) {
        setSidebarYearDropdownOpen(false);
      }
    };
    if (showBookmarkDropdown || sidebarYearDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBookmarkDropdown, sidebarYearDropdownOpen]);

  // Filter mistake queue by current subject
  const currentSubjectRepeatQueue = userRepeatQueue.filter(q => {
    if (activeSubject === 'english') {
      return ENGLISH_QUESTION_BANK.some(eq => eq.id === q.id);
    } else if (activeSubject === 'pyq') {
      return PYQ_QUESTION_BANK.some(pq => pq.id === q.id);
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
    cherkkayzhuthuka: ['cherkkayzhuthuka'],
    pyq_malayalam: ['pyq_malayalam', 'pyq']
  };

  const matchesTopic = (qTopic, targetTopicId) => {
    if (targetTopicId === 'all') return true;
    if (activeSubject === 'english' || activeSubject === 'pyq') {
      return qTopic === targetTopicId;
    }
    const aliases = MALAYALAM_TOPIC_ALIASES[targetTopicId] || [targetTopicId];
    return aliases.includes(qTopic);
  };

  const getTopicCounts = (topicId) => {
    const bank = activeSubject === 'pyq'
      ? currentQuestionBank.filter(q => q.year === selectedYear || q.id.includes(`_${selectedYear}_`))
      : currentQuestionBank;
    const total = topicId === 'all'
      ? bank.length
      : bank.filter(q => matchesTopic(q.topic, topicId)).length;
    const rawSolved = topicId === 'all'
      ? currentSyllabusTopics.filter(t => t.id !== 'all').reduce((acc, t) => acc + (userStats?.topicStats?.[t.id]?.correct || 0), 0)
      : (userStats?.topicStats?.[topicId]?.correct || 0);
    const solved = Math.min(total, rawSolved);
    return { solved, total };
  };

  const getFilteredPool = () => {
    let pool;
    if (isRepeatOnlyMode) {
      pool = [...currentSubjectRepeatQueue];
    } else if (selectedTopic === 'all') {
      pool = [...currentQuestionBank];
    } else {
      pool = currentQuestionBank.filter(q => matchesTopic(q.topic, selectedTopic));
    }

    if (activeSubject === 'pyq') {
      pool = pool.filter(q => q.year === selectedYear || q.id.includes(`_${selectedYear}_`));
    }
    return pool;
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
      // Regular mode: check if an upcoming repeat question for this subject & topic is due
      // Must NOT be the question just answered or in the last 5 questions (min 5 gap)
      const currentTotal = userStats.total || 0;
      const eligibleUpcoming = userUpcomingRepeats.filter(rep => {
        const freshQ = getFreshQuestion(rep);
        const isCurrentSubject = activeSubject === 'english'
          ? ENGLISH_QUESTION_BANK.some(eq => eq.id === freshQ.id)
          : activeSubject === 'pyq'
          ? PYQ_QUESTION_BANK.some(pq => pq.id === freshQ.id)
          : QUESTION_BANK.some(mq => mq.id === freshQ.id);
        const matchesCurrentTopic = selectedTopic === 'all' || matchesTopic(freshQ.topic, selectedTopic);
        const matchesYear = activeSubject !== 'pyq' || freshQ.year === selectedYear || freshQ.id.includes(`_${selectedYear}_`);
        const passedMinGap = !rep.minAvailableAt || currentTotal >= rep.minAvailableAt;
        const notInRecentHistory = !userHistory.slice(-5).includes(freshQ.id);
        const notCurrent = freshQ.id !== currentQuestion?.id;
        const hasRemaining = (rep.remainingRepeats ?? 1) > 0;

        return isCurrentSubject && matchesCurrentTopic && matchesYear && passedMinGap && notInRecentHistory && notCurrent && hasRemaining;
      });

      if (eligibleUpcoming.length > 0 && Math.random() > 0.3) {
        const chosenRep = eligibleUpcoming[0];
        nextQ = getFreshQuestion(chosenRep);
        isRepeat = true;
        soundFX.playRepeatAlert();
      } else {
        // Pick question from topic pool, avoiding recent history and the current question
        const unasked = pool.filter(q => (resetHistory ? true : !userHistory.includes(q.id)) && q.id !== currentQuestion?.id);
        const fallback = pool.filter(q => q.id !== currentQuestion?.id);
        const selectionPool = unasked.length > 0 ? unasked : (fallback.length > 0 ? fallback : pool);
        const randIndex = Math.floor(Math.random() * selectionPool.length);
        nextQ = getFreshQuestion(selectionPool[randIndex]);
      }
    }

    if (nextQ) {
      const isPYQ = activeSubject === 'pyq';
      let finalOptions = [...nextQ.options];
      let finalAnswer = nextQ.answer;

      if (!isPYQ) {
        // Randomize option order dynamically ONLY for regular syllabus practice, NOT for PYQs
        const originalOptions = [...nextQ.options];
        const correctText = originalOptions[nextQ.answer];

        const shuffledOptions = [...originalOptions];
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        finalAnswer = shuffledOptions.indexOf(correctText);
        finalOptions = shuffledOptions;
      }

      const activeRep = userUpcomingRepeats.find(r => r.id === nextQ.id);

      setCurrentQuestion({
        ...nextQ,
        options: finalOptions,
        answer: finalAnswer,
        isRepeat,
        repeatDifficulty: activeRep?.difficulty || nextQ.difficulty || null,
        remainingRepeats: activeRep?.remainingRepeats || nextQ.remainingRepeats || null
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

  // Load question when topic, mode, subject, year, or active user changes
  useEffect(() => {
    if (currentUser) {
      loadNextQuestion(true);
    }
  }, [selectedTopic, isRepeatOnlyMode, activeSubject, selectedYear, activeUserId]);

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
            }
          };
        }
        return u;
      });
      persistUsers(updated);
    } else {
      soundFX.playWrong();

      const currentTotal = (userStats.total || 0) + 1;
      const qId = currentQuestion.id;
      const freshQ = getFreshQuestion(currentQuestion);

      const repeatItem = {
        ...freshQ,
        id: qId,
        difficulty: 'hard',
        remainingRepeats: 3,
        minAvailableAt: currentTotal + 5
      };

      const updatedUpcoming = [
        ...userUpcomingRepeats.filter(item => item.id !== qId),
        repeatItem
      ];
      let updatedRepeatQueue = [...userRepeatQueue];
      if (!updatedRepeatQueue.some(item => item.id === qId)) {
        updatedRepeatQueue.push(repeatItem);
      } else {
        updatedRepeatQueue = updatedRepeatQueue.map(item => item.id === qId ? repeatItem : item);
      }
      const updatedLearned = (currentUser?.learnedQuestions || []).filter(id => id !== qId);

      const updated = users.map(u => {
        if (u.id === activeUserId) {
          return {
            ...u,
            repeatQueue: updatedRepeatQueue,
            upcomingRepeats: updatedUpcoming,
            learnedQuestions: updatedLearned,
            stats: {
              ...u.stats,
              total: currentTotal,
              streak: 0,
              topicStats: newTopicStats
            }
          };
        }
        return u;
      });
      persistUsers(updated);
    }
  };

  // Difficulty Selection (Easy, Medium, Hard)
  const handleDifficultySelect = (difficulty) => {
    if (!currentQuestion || !currentUser) return;

    const currentTotal = userStats.total || 0;
    const qId = currentQuestion.id;
    const freshQ = getFreshQuestion(currentQuestion);

    const existingRepeat = userUpcomingRepeats.find(item => item.id === qId);

    let updatedUpcoming = [...userUpcomingRepeats];
    let updatedRepeatQueue = [...userRepeatQueue];
    let updatedLearned = [...(currentUser?.learnedQuestions || [])];

    if (difficulty === 'easy') {
      // Marked as learned! Removed from repeat queues
      updatedUpcoming = updatedUpcoming.filter(item => item.id !== qId);
      updatedRepeatQueue = updatedRepeatQueue.filter(item => item.id !== qId);
      if (!updatedLearned.includes(qId)) {
        updatedLearned.push(qId);
      }
    } else if (difficulty === 'medium') {
      // Repeats 2 more times with min 5 question gap
      const prevRemaining = existingRepeat?.remainingRepeats;
      const nextRemaining = (existingRepeat && prevRemaining > 1) ? prevRemaining - 1 : 2;

      const repeatItem = {
        ...freshQ,
        id: qId,
        difficulty: 'medium',
        remainingRepeats: nextRemaining,
        minAvailableAt: currentTotal + 5
      };

      updatedUpcoming = [
        ...updatedUpcoming.filter(item => item.id !== qId),
        repeatItem
      ];
      if (!updatedRepeatQueue.some(item => item.id === qId)) {
        updatedRepeatQueue.push(repeatItem);
      } else {
        updatedRepeatQueue = updatedRepeatQueue.map(item => item.id === qId ? repeatItem : item);
      }
      updatedLearned = updatedLearned.filter(id => id !== qId);
    } else if (difficulty === 'hard') {
      // Repeats 3 times with min 5 question gap
      const prevRemaining = existingRepeat?.remainingRepeats;

      if (existingRepeat && prevRemaining !== undefined && prevRemaining <= 1) {
        // Completed all 3 repeats! Remove from repeat queues and mark as learned
        updatedUpcoming = updatedUpcoming.filter(item => item.id !== qId);
        updatedRepeatQueue = updatedRepeatQueue.filter(item => item.id !== qId);
        if (!updatedLearned.includes(qId)) {
          updatedLearned.push(qId);
        }
      } else {
        const nextRemaining = (existingRepeat && prevRemaining && prevRemaining > 1)
          ? prevRemaining - 1
          : 3;

        const repeatItem = {
          ...freshQ,
          id: qId,
          difficulty: 'hard',
          remainingRepeats: nextRemaining,
          minAvailableAt: currentTotal + 5
        };

        updatedUpcoming = [
          ...updatedUpcoming.filter(item => item.id !== qId),
          repeatItem
        ];
        if (!updatedRepeatQueue.some(item => item.id === qId)) {
          updatedRepeatQueue.push(repeatItem);
        } else {
          updatedRepeatQueue = updatedRepeatQueue.map(item => item.id === qId ? repeatItem : item);
        }
        updatedLearned = updatedLearned.filter(id => id !== qId);
      }
    }

    const updated = users.map(u => {
      if (u.id === activeUserId) {
        return {
          ...u,
          repeatQueue: updatedRepeatQueue,
          upcomingRepeats: updatedUpcoming,
          learnedQuestions: updatedLearned
        };
      }
      return u;
    });

    persistUsers(updated);
    loadNextQuestion();
  };

  // Keyboard shortcut listener for Easy (1/e) & Hard (2/h) when correct, or Next (Enter/Space/1) when incorrect
  useEffect(() => {
    if (!isAnswered || !currentQuestion) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      const isCorrect = selectedOption === currentQuestion.answer;

      if (isCorrect) {
        if (e.key === '1' || e.key.toLowerCase() === 'h') {
          e.preventDefault();
          handleDifficultySelect('hard');
        } else if (e.key === '2' || e.key.toLowerCase() === 'e') {
          e.preventDefault();
          handleDifficultySelect('easy');
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === '1' || e.key === 'ArrowRight') {
          e.preventDefault();
          loadNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQuestion, selectedOption, userUpcomingRepeats, userRepeatQueue, userStats]);

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

      {/* User Profile Modal */}
      {showProfileModal && currentUser && (
        <ProfileModal
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
          onSwitchAccount={handleSwitchAccount}
          onResetProgress={handleRequestResetAllProgress}
          onDeleteAccount={handleRequestDeleteAccount}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Sidebar: Syllabus Topics */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <button
            type="button"
            className="sidebar-brand-seal-btn"
            onClick={() => {
              setViewMode('blueprint');
              setIsRepeatOnlyMode(false);
              setMobileSidebarOpen(false);
            }}
            title="Go to Blueprint Home Dashboard"
          >
            {/* Kerala PSC Logo Image */}
            <div className="sidebar-brand-seal">
              <img src="/kerala-psc-logo.jpg" alt="Kerala PSC Logo" className="sidebar-brand-img" />
            </div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">Kerala PSC</span>
              <span className="sidebar-brand-sub">LDC Practice Portal</span>
            </div>
          </button>
        </div>

        {/* Subject Switcher Tabs: Malayalam & English side-by-side, PYQ with Year Dropdown below */}
        <div className="sidebar-subject-switcher">
          <div className="subject-switch-top-row">
            <button
              type="button"
              className={`subject-switch-btn ${activeSubject === 'malayalam' ? 'active' : ''}`}
              onClick={() => handleSwitchSubject('malayalam')}
            >
              <span className="subject-btn-label">📚 Malayalam</span>
              <span className="subject-qcount">{QUESTION_BANK.length.toLocaleString()} Qs</span>
            </button>
            <button
              type="button"
              className={`subject-switch-btn ${activeSubject === 'english' ? 'active' : ''}`}
              onClick={() => handleSwitchSubject('english')}
            >
              <span className="subject-btn-label">🇬🇧 English</span>
              <span className="subject-qcount">{ENGLISH_QUESTION_BANK.length.toLocaleString()} Qs</span>
            </button>
          </div>

          <div className={`pyq-switch-bottom-row ${activeSubject === 'pyq' ? 'active' : ''}`}>
            <button
              type="button"
              className="pyq-switch-btn-left"
              onClick={() => handleSwitchSubject('pyq')}
            >
              <span className="pyq-btn-title">📜 PYQ Papers</span>
              <span className="subject-qcount">
                {`${(PYQ_YEARS.find(y => y.id === selectedYear) || PYQ_YEARS[0]).count.toLocaleString()} Qs`}
              </span>
            </button>

            <div className="pyq-year-custom-dropdown-container" ref={sidebarYearDropdownRef}>
              <button
                type="button"
                className={`sidebar-year-trigger-btn ${sidebarYearDropdownOpen ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarYearDropdownOpen(!sidebarYearDropdownOpen);
                }}
                title="Select Exam Year"
              >
                <span>📅 {selectedYear}</span>
                <span className={`sidebar-year-chevron ${sidebarYearDropdownOpen ? 'open' : ''}`}>▾</span>
              </button>

              {sidebarYearDropdownOpen && (
                <div className="sidebar-year-dropdown-menu">
                  <div className="sidebar-year-dropdown-header">
                    <span>📅 Select Exam Year</span>
                  </div>
                  <div className="sidebar-year-list">
                    {PYQ_YEARS.map(yr => {
                      const isSelected = selectedYear === yr.id;
                      return (
                        <button
                          key={yr.id}
                          type="button"
                          className={`sidebar-year-item ${isSelected ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedYear(yr.id);
                            if (activeSubject !== 'pyq') {
                              handleSwitchSubject('pyq');
                            }
                            setSidebarYearDropdownOpen(false);
                          }}
                        >
                          <div className="sidebar-year-item-left">
                            <span className="sidebar-year-item-num">{yr.id}</span>
                            <span className="sidebar-year-item-count">({yr.count.toLocaleString()} Qs)</span>
                          </div>
                          {isSelected && <span className="sidebar-year-check">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Topics List */}
        <div className="topics-list">
          {currentSyllabusTopics.map((topic, idx) => {
            const { solved, total } = getTopicCounts(topic.id);
            const isActive = selectedTopic === topic.id && !isRepeatOnlyMode && viewMode === 'quiz';
            const progressPercent = total > 0 ? Math.min(100, Math.max(solved > 0 ? 3 : 0, (solved / total) * 100)) : 0;
            const prevTopic = idx > 0 ? currentSyllabusTopics[idx - 1] : null;
            const isNewSection = topic.section && (!prevTopic || prevTopic.section !== topic.section);

            return (
              <React.Fragment key={topic.id}>
                {isNewSection && (
                  <div className="sidebar-section-divider">
                    <span className="sidebar-section-title">{topic.section}</span>
                    {topic.sectionMarks && (
                      <span className="sidebar-section-marks-badge">{topic.sectionMarks}</span>
                    )}
                  </div>
                )}
                <div
                  role="button"
                  tabIndex={0}
                  className={`topic-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setViewMode('quiz');
                    setIsRepeatOnlyMode(false);
                    setSelectedTopic(topic.id);
                    setMobileSidebarOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setViewMode('quiz');
                      setIsRepeatOnlyMode(false);
                      setSelectedTopic(topic.id);
                      setMobileSidebarOpen(false);
                    }
                  }}
                >
                  <span className="topic-icon">{topic.icon}</span>
                  <div className="topic-details">
                    <div className="topic-name-row">
                      <div className="topic-name">{topic.name}</div>
                      {topic.marks && <span className="topic-marks-pill">{topic.marks}</span>}
                    </div>
                    <div className="topic-count">
                      <span style={{ color: solved > 0 ? '#38bdf8' : '#94a3b8', fontWeight: 600 }}>
                        {solved} / {total}
                      </span>
                    </div>
                    <div className="topic-progress-mini-bar">
                      <div
                        className="topic-progress-mini-fill"
                        style={{
                          width: `${progressPercent}%`,
                          background: topic.color || '#38bdf8'
                        }}
                      />
                    </div>
                  </div>
                  {topic.id !== 'all' && (
                    <button
                      type="button"
                      className="topic-reset-btn"
                      title={`Reset progress for ${topic.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestResetTopic(topic);
                      }}
                    >
                      ↺
                    </button>
                  )}
                </div>
              </React.Fragment>
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
              {/* Navbar Kerala PSC Logo — Mobile Only (sidebar hidden on mobile) */}
              <button
                type="button"
                className="nav-brand-btn mobile-only"
                onClick={() => setViewMode('blueprint')}
                title="Go to Homescreen"
              >
                <div className="nav-brand-seal">
                  <img src="/kerala-psc-logo.jpg" alt="Kerala PSC Logo" className="nav-brand-img" />
                </div>
              </button>

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
                <button
                  type="button"
                  className={`mob-subj-btn ${activeSubject === 'pyq' ? 'active' : ''}`}
                  onClick={() => handleSwitchSubject('pyq')}
                >
                  📜 PYQ
                </button>
              </div>

              {/* Desktop View: Active Topic Pill */}
              {viewMode === 'blueprint' ? (
                <div className="current-topic-pill desktop-only blueprint-nav-pill">
                  <span>📋</span>
                  <strong>LDC 100-Mark Blueprint Dashboard</strong>
                </div>
              ) : (
                <div className="current-topic-pill desktop-only">
                  <span>{currentTopicData.icon}</span>
                  <strong>{isRepeatOnlyMode ? '🔁 Spaced Review Queue' : currentTopicData.name}</strong>
                </div>
              )}
            </div>

            <div className="nav-right">
              {/* Bookmarks Dropdown Button on Navbar */}
              <div className="nav-bookmark-wrapper" ref={bookmarkDropdownRef}>
                <button
                  type="button"
                  className={`nav-bookmark-btn ${showBookmarkDropdown ? 'active' : ''}`}
                  onClick={() => setShowBookmarkDropdown(!showBookmarkDropdown)}
                  title="View Saved Questions & Answers"
                  aria-expanded={showBookmarkDropdown}
                >
                  <span className="nav-bookmark-icon">{userBookmarks.length > 0 ? '❤️' : '🤍'}</span>
                  <span className="nav-bookmark-label desktop-only">Saved Qns</span>
                  {userBookmarks.length > 0 && (
                    <span className="nav-bookmark-badge">{userBookmarks.length}</span>
                  )}
                </button>

                {/* Bookmark Scrollable Dropdown Menu */}
                {showBookmarkDropdown && (
                  <div className="bookmark-dropdown-menu">
                    <div className="bookmark-dropdown-header">
                      <div className="bmark-header-title">
                        <span>❤️ Saved Questions</span>
                        <span className="bmark-count-tag">{userBookmarks.length} Saved</span>
                      </div>
                      <button
                        type="button"
                        className="bmark-close-btn"
                        onClick={() => setShowBookmarkDropdown(false)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="bookmark-scroll-list">
                      {bookmarkedList.length === 0 ? (
                        <div className="bookmark-empty-state">
                          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>❤️</div>
                          <h4>No Saved Questions Yet</h4>
                          <p>Click the <strong>❤️ Heart</strong> on any question while practicing to save it here for fast revision.</p>
                        </div>
                      ) : (
                        bookmarkedList.map((item, idx) => (
                          <div key={item.id || idx} className="bookmark-item-card">
                            <div className="bmark-item-meta">
                              <span className="bmark-item-num">Q{idx + 1}</span>
                              <span className="bmark-item-topic">
                                {item.qp_code ? `QP: ${item.qp_code}` : (item.year ? `${item.year} PYQ` : 'Saved Question')}
                              </span>
                              <button
                                type="button"
                                className="bmark-remove-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleBookmark(item.id);
                                }}
                                title="Remove Bookmark"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="bmark-item-question">
                              <QuestionDisplay text={item.question} />
                            </div>

                            <div className="bmark-item-answer">
                              <span className="bmark-ans-label">✓ Answer:</span>
                              <strong>{item.options[item.answer]}</strong>
                            </div>

                            {item.explanation && (
                              <div className="bmark-item-explanation">
                                <strong>Explanation:</strong> {item.explanation}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Spaced Review Queue Pill on Navbar - shown only when not empty */}
              {currentSubjectRepeatQueue.length > 0 && (
                <button
                  type="button"
                  className="nav-review-queue-pill"
                  onClick={() => setShowRepeatModal(true)}
                  title={`Open Spaced Review Queue (${currentSubjectRepeatQueue.length} questions waiting)`}
                >
                  <span className="queue-pill-icon">🔁</span>
                  <span className="queue-pill-label desktop-only">Review Queue</span>
                  <span className="queue-pill-badge">{currentSubjectRepeatQueue.length}</span>
                </button>
              )}

              {/* User Profile Badge (Top Right) */}
              {currentUser && (
                <button
                  className="user-nav-badge"
                  onClick={() => setShowProfileModal(true)}
                  title="View Profile and Topic Mastery Analytics"
                >
                  <span className="user-nav-avatar">{currentUser.avatar || '🎓'}</span>
                  <span className="user-nav-name desktop-only">{currentUser.name}</span>
                </button>
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
                    <span>
                      Select Topic ({activeSubject === 'english' ? 'English' : activeSubject === 'pyq' ? `${selectedYear} PYQ Papers` : 'Malayalam'})
                    </span>
                    <button
                      className="dropdown-close-btn"
                      onClick={() => setTopicDropdownOpen(false)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* PYQ Year Switcher Tabs inside dropdown */}
                  {activeSubject === 'pyq' && (
                    <div className="dropdown-year-switcher">
                      <span className="dropdown-year-title">📅 Exam Year:</span>
                      <div className="dropdown-year-chips">
                        {PYQ_YEARS.map(yr => (
                          <button
                            key={yr.id}
                            type="button"
                            className={`dropdown-year-chip ${selectedYear === yr.id ? 'active' : ''}`}
                            onClick={() => setSelectedYear(yr.id)}
                          >
                            {yr.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="dropdown-options-list">
                    {/* All Topics */}
                    {(() => {
                      const { solved, total } = getTopicCounts('all');
                      const progressPercent = total > 0 ? Math.min(100, Math.max(solved > 0 ? 3 : 0, (solved / total) * 100)) : 0;
                      return (
                        <div
                          className={`custom-dropdown-option ${selectedTopic === 'all' && !isRepeatOnlyMode ? 'selected' : ''}`}
                          onClick={() => {
                            setIsRepeatOnlyMode(false);
                            setSelectedTopic('all');
                            setTopicDropdownOpen(false);
                            setViewMode('quiz');
                          }}
                        >
                          <span className="opt-icon">🎯</span>
                          <div className="opt-details">
                            <div className="opt-title">All Topics (Full Mock)</div>
                            <div className="opt-count">
                              <span style={{ color: solved > 0 ? '#38bdf8' : '#94a3b8', fontWeight: 600 }}>
                                {solved} / {total}
                              </span>
                            </div>
                            <div className="topic-progress-mini-bar">
                              <div
                                className="topic-progress-mini-fill"
                                style={{ width: `${progressPercent}%`, background: '#6366f1' }}
                              />
                            </div>
                          </div>
                          {selectedTopic === 'all' && !isRepeatOnlyMode && <span className="opt-check">✓</span>}
                        </div>
                      );
                    })()}

                    <div className="dropdown-section-label">
                      {activeSubject === 'english' ? 'General English Topics (27)' : activeSubject === 'pyq' ? 'PYQ Topics (13)' : 'Malayalam Topics (13)'}
                    </div>

                    {/* All Subject Topics */}
                    {currentSyllabusTopics.filter(t => t.id !== 'all').map(topic => {
                      const { solved, total } = getTopicCounts(topic.id);
                      const isSelected = selectedTopic === topic.id && !isRepeatOnlyMode;
                      const progressPercent = total > 0 ? Math.min(100, Math.max(solved > 0 ? 3 : 0, (solved / total) * 100)) : 0;

                      return (
                        <div
                          key={topic.id}
                          className={`custom-dropdown-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setIsRepeatOnlyMode(false);
                            setSelectedTopic(topic.id);
                            setTopicDropdownOpen(false);
                            setViewMode('quiz');
                          }}
                        >
                          <span className="opt-icon">{topic.icon}</span>
                          <div className="opt-details">
                            <div className="opt-title">{topic.name}</div>
                            <div className="opt-count">
                              <span style={{ color: solved > 0 ? '#38bdf8' : '#94a3b8', fontWeight: 600 }}>
                                {solved} / {total}
                              </span>
                            </div>
                            <div className="topic-progress-mini-bar">
                              <div
                                className="topic-progress-mini-fill"
                                style={{
                                  width: `${progressPercent}%`,
                                  background: topic.color || '#38bdf8'
                                }}
                              />
                            </div>
                          </div>
                          <div className="opt-right-actions">
                            <button
                              type="button"
                              className="topic-reset-btn"
                              title={`Reset progress for ${topic.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRequestResetTopic(topic);
                              }}
                            >
                              ↺
                            </button>
                            {isSelected && <span className="opt-check">✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Main Content Viewport */}
        <div className="quiz-content-area">
          {viewMode === 'blueprint' ? (
            <BlueprintDashboard
              currentUser={currentUser}
              onStartPractice={handleStartPracticeFromBlueprint}
              onStartMock={handleStartMockFromBlueprint}
              questionCounts={questionCountsMap}
            />
          ) : currentQuestion ? (
            <div className="question-card">
              {/* Question Header & Badges */}
              <div className="card-top-bar">
                <div className="card-top-bar-left">
                  <span className="topic-badge">
                    {currentSyllabusTopics.find(t => matchesTopic(currentQuestion.topic, t.id))?.name || currentQuestion.topic || 'Practice Question'}
                  </span>
                  {activeSubject === 'pyq' && (currentQuestion.year || currentQuestion.id) && (
                    <span className="pyq-year-badge">
                      {currentQuestion.year || currentQuestion.id.match(/20\d\d/)?.[0] || 'PYQ'} Exam
                    </span>
                  )}
                  {activeSubject === 'pyq' && currentQuestion.qp_code && (
                    <span className="pyq-paper-code-badge" title="Original Kerala PSC Question Paper Code">
                      📜 QP: <strong>{currentQuestion.qp_code}</strong>
                    </span>
                  )}
                </div>

                <div className="card-top-bar-right">
                  {currentQuestion.isRepeat && (
                    <div className="repeat-alert-banner">
                      🔁 Spaced Repetition {currentQuestion.repeatDifficulty ? `• Level: ${currentQuestion.repeatDifficulty.toUpperCase()}` : ''} {currentQuestion.remainingRepeats ? `(${currentQuestion.remainingRepeats} repeat${currentQuestion.remainingRepeats > 1 ? 's' : ''} left)` : ''} — Practice until mastered!
                    </div>
                  )}

                  {/* Bookmark / Heart Button */}
                  <button
                    type="button"
                    className={`card-bookmark-btn ${isCurrentBookmarked ? 'bookmarked' : ''}`}
                    onClick={() => handleToggleBookmark(currentQuestion.id)}
                    title={isCurrentBookmarked ? "Remove from Favorites" : "Save this question to Favorites"}
                    aria-label="Save question"
                  >
                    <span className="heart-icon">{isCurrentBookmarked ? '❤️' : '🤍'}</span>
                    <span className="bookmark-btn-text">{isCurrentBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="question-text">
                <QuestionDisplay text={currentQuestion.question} />
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

                  {currentQuestion.isRepeat && selectedOption === currentQuestion.answer && (
                    <div className="repeat-info-subtext">
                      🔁 Scheduled Repeat ({currentQuestion.repeatDifficulty || 'spaced'} • {currentQuestion.remainingRepeats || 1} left). Choose <strong>Easy</strong> to complete & mark as learned!
                    </div>
                  )}

                  {selectedOption === currentQuestion.answer ? (
                    /* FOR RIGHT ANSWER: Show Easy and Hard (3 times) */
                    <div className="difficulty-prompt-container">
                      <div className="difficulty-prompt-header">
                        <span className="difficulty-prompt-title">
                          Rate recall to continue:
                        </span>
                      </div>

                      <div className="difficulty-buttons-grid two-options">
                        <button
                          type="button"
                          className="diff-btn diff-btn-hard"
                          onClick={() => handleDifficultySelect('hard')}
                          title="Will repeat 3 times (minimum 5 question gap)"
                        >
                          <span className="diff-btn-icon">🔴</span>
                          <div className="diff-btn-content">
                            <span className="diff-btn-name">Hard</span>
                            <span className="diff-btn-desc">Repeats 3 times</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          className="diff-btn diff-btn-easy"
                          onClick={() => handleDifficultySelect('easy')}
                          title="Mark as learned (will not repeat)"
                        >
                          <span className="diff-btn-icon">🟢</span>
                          <div className="diff-btn-content">
                            <span className="diff-btn-name">Easy</span>
                            <span className="diff-btn-desc">Mark as Learned</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* FOR INCORRECT ANSWER: Auto-queued for 3 repeats (min 5 gap) -> Next Question button */
                    <div className="difficulty-prompt-container incorrect-prompt">
                      <div className="auto-queue-banner">
                        <span className="auto-queue-icon">🔁</span>
                        <div className="auto-queue-text">
                          <strong>
                            {currentQuestion.isRepeat
                              ? `Scheduled repeat (${(currentQuestion.remainingRepeats && currentQuestion.remainingRepeats > 1) ? currentQuestion.remainingRepeats - 1 : 3} left)`
                              : 'Scheduled to repeat 3 times'}
                          </strong>
                          <span>Will reappear after at least 5 questions</span>
                        </div>
                      </div>

                      <div className="action-row" style={{ marginTop: '0.85rem' }}>
                        <button
                          type="button"
                          className="next-btn"
                          onClick={loadNextQuestion}
                          title="Proceed to next question (Enter / Space)"
                        >
                          <span>Next Question</span>
                          <span>➔</span>
                        </button>
                      </div>

                      <div className="misclick-escape-row">
                        <button
                          type="button"
                          className="misclick-escape-btn"
                          onClick={() => handleDifficultySelect('easy')}
                        >
                          Accidental misclick? Skip repeats & mark as learned
                        </button>
                      </div>
                    </div>
                  )}
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
                <span>🔁 Spaced Review & Repeat Queue ({activeSubject === 'english' ? 'English' : activeSubject === 'pyq' ? 'PYQ' : 'Malayalam'})</span>
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
                        <span className="mistake-idx">{idx + 1}.</span>{' '}
                        <QuestionDisplay text={item.question} />
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

      {/* LDC Official Syllabus Modal */}
      {showSyllabusModal && (
        <SyllabusModal
          isOpen={showSyllabusModal}
          onClose={() => setShowSyllabusModal(false)}
          onSelectSubjectTopic={handleSelectSubjectTopic}
        />
      )}

      {/* Mock Exam Modal */}
      {showMockExam && (
        <MockExamModal
          year={selectedYear}
          onClose={() => setShowMockExam(false)}
        />
      )}

      {/* Themed Confirmation Modal */}
      <ConfirmModal
        {...confirmDialog}
        onCancel={closeConfirmDialog}
      />
    </div>
  );
}
