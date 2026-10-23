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
import MockExamPage from './components/MockExamPage';
import FormattedQuestion from './components/FormattedQuestion';
import BookmarksPage from './components/BookmarksPage';
import InviteGate from './components/InviteGate';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboardView from './components/AdminDashboardView';
import TopicNotes from './components/TopicNotes';
import { cleanExplanation } from './utils/cleanExplanation';
import {
  consumeInviteCode,
  approveUser,
  isUserApproved,
  isAdminLoggedIn,
  revokeUser,
  adminLogout
} from './utils/adminAuth';
import {
  syncUserProgressToCloud,
  fetchUserProgressFromCloud
} from './utils/supabaseClient';
import {
  BookmarkIcon,
  RotateIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  FileTextIcon,
  TargetIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  TrophyIcon,
  CheckCircleIcon,
  InfoIcon,
  ShieldIcon,
  ShieldCheckIcon,
  LogOutIcon
} from './components/Icons';
import './App.css';

const MALAYALAM_TOPIC_ALIASES = {
  ottapadam: ['ottapadam', 'ഒറ്റപ്പദം'],
  viparitham: ['viparitham', 'വിപരീതപദം'],
  samanapadham: ['samanapadham'],
  paryayam: ['paryayam', 'പര്യായപദം', 'പര്യായം'],
  arthavyathyasam: ['arthavyathyasam', 'ശബ്ദാർത്ഥം', 'അർത്ഥവ്യത്യാസം'],
  shaylikal: ['shaylikal', 'shailikal', 'ശൈലികൾ'],
  pirichezhuthal: ['pirichezhuthal', 'പിരിച്ചെഴുത്ത്'],
  sandhi: ['sandhi', 'സന്ധി'],
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
  // Admin / Invite Gate state
  const [showInviteGate, setShowInviteGate] = useState(false);
  const [pendingInviteCode, setPendingInviteCode] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(() => isAdminLoggedIn());

  const currentUser = users.find(u => u.id === activeUserId) || null;

  // Selected Topic & Practice State
  const [viewMode, setViewMode] = useState('blueprint'); // 'blueprint' (homepage), 'quiz', or 'bookmarks'
  const [previousViewMode, setPreviousViewMode] = useState('blueprint');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [isRepeatOnlyMode, setIsRepeatOnlyMode] = useState(false);
  const [isTopicReviewMode, setIsTopicReviewMode] = useState(false);
  const [showMockExam, setShowMockExam] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  // If no current user, trigger Auth Modal (or invite gate for new users)
  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      // If user was revoked, boot them out
      if (!isUserApproved(currentUser.id)) {
        setActiveUserId(null);
        localStorage.removeItem('psc_active_user_id');
        setShowAuthModal(true);
      } else {
        setShowAuthModal(false);
      }
    }
  }, [currentUser]);

  const cloudSyncTimeoutRef = React.useRef(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced'

  // Sync users to localStorage and debounced cloud sync
  const persistUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('psc_malayalam_users', JSON.stringify(updatedUsers));

    // Debounced cloud sync to Supabase (1.2s debounce)
    if (activeUserId) {
      const active = updatedUsers.find((u) => u.id === activeUserId);
      if (active && (active.email || (active.id && active.id.includes('-')))) {
        if (cloudSyncTimeoutRef.current) {
          clearTimeout(cloudSyncTimeoutRef.current);
        }
        cloudSyncTimeoutRef.current = setTimeout(async () => {
          setCloudSyncStatus('syncing');
          const res = await syncUserProgressToCloud(active);
          if (res?.success) {
            setCloudSyncStatus('synced');
            setTimeout(() => setCloudSyncStatus('idle'), 3000);
          } else {
            setCloudSyncStatus('idle');
          }
        }, 1200);
      }
    }
  };

  // Manual trigger for user profile sync
  const handleManualCloudSync = async () => {
    if (!currentUser) return;
    setCloudSyncStatus('syncing');
    
    // First push local state
    await syncUserProgressToCloud(currentUser);
    
    // Fetch latest cloud progress
    const remote = await fetchUserProgressFromCloud(currentUser.id || currentUser.email);
    if (remote) {
      if (remote.progressResetAt && currentUser.progressResetAt !== remote.progressResetAt) {
        const resetUser = {
          ...currentUser,
          stats: remote.stats || { correct: 0, total: 0, streak: 0, maxStreak: 0, topicStats: {} },
          bookmarkedQuestions: remote.bookmarkedQuestions || [],
          repeatQueue: (remote.repeatQueue || []).map((item) => ({ ...getFreshQuestion(item), ...item })),
          upcomingRepeats: (remote.upcomingRepeats || []).map((item) => ({ ...getFreshQuestion(item), ...item })),
          questionHistory: remote.questionHistory || [],
          learnedQuestions: remote.learnedQuestions || [],
          solvedQuestions: remote.solvedQuestions || [],
          progressResetAt: remote.progressResetAt
        };
        persistUsers(users.map((user) => user.id === currentUser.id ? resetUser : user));
        setCloudSyncStatus('synced');
        setTimeout(() => setCloudSyncStatus('idle'), 3000);
        return;
      }

      const mergedBookmarks = Array.from(
        new Set([
          ...(currentUser.bookmarkedQuestions || []),
          ...(remote.bookmarkedQuestions || [])
        ])
      );
      const updatedUser = {
        ...currentUser,
        bookmarkedQuestions: mergedBookmarks,
        stats: (remote.stats?.total || 0) > (currentUser.stats?.total || 0) ? remote.stats : currentUser.stats,
      };
      const updatedList = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
      persistUsers(updatedList);
    }
    setCloudSyncStatus('synced');
    setTimeout(() => setCloudSyncStatus('idle'), 3000);
  };

  // One-time migration: approve all pre-existing users so they aren't locked out
  useEffect(() => {
    if (users.length > 0) {
      users.forEach(u => approveUser(u.id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    let cancelled = false;
    fetchUserProgressFromCloud(currentUser.id || currentUser.email).then((cloudProgress) => {
      const resetAt = cloudProgress?.progressResetAt;
      if (cancelled || !resetAt || currentUser.progressResetAt === resetAt) return;

      const updatedUser = {
        ...currentUser,
        stats: cloudProgress.stats || { correct: 0, total: 0, streak: 0, maxStreak: 0, topicStats: {} },
        bookmarkedQuestions: cloudProgress.bookmarkedQuestions || [],
        repeatQueue: (cloudProgress.repeatQueue || []).map((item) => ({ ...getFreshQuestion(item), ...item })),
        upcomingRepeats: (cloudProgress.upcomingRepeats || []).map((item) => ({ ...getFreshQuestion(item), ...item })),
        questionHistory: cloudProgress.questionHistory || [],
        learnedQuestions: cloudProgress.learnedQuestions || [],
        solvedQuestions: cloudProgress.solvedQuestions || [],
        progressResetAt: resetAt
      };
      persistUsers(users.map((user) => user.id === currentUser.id ? updatedUser : user));
    });

    return () => {
      cancelled = true;
    };
  // Check the reset marker when the active account changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUserId]);

  const handleSelectUser = (userId) => {
    setActiveUserId(userId);
    localStorage.setItem('psc_active_user_id', userId);
    setShowAuthModal(false);
  };

  // Called when user logs in or is approved from Supabase
  const handleUserAuthenticated = async (dbUser) => {
    const cleanEmail = dbUser.email?.toLowerCase().trim();

    // Check if cloud progress is present, or fetch from Supabase
    let cloudProgress = dbUser.progress || null;
    if (!cloudProgress && (dbUser.id || cleanEmail)) {
      cloudProgress = await fetchUserProgressFromCloud(dbUser.id || cleanEmail);
    }

    const existingIndex = users.findIndex(
      (u) =>
        u.id === dbUser.id ||
        (u.email && u.email.toLowerCase().trim() === cleanEmail)
    );

    let activeUser;

    if (existingIndex >= 0) {
      // User profile already present on this device - merge cloud progress seamlessly
      const existing = users[existingIndex];
      const resetAt = cloudProgress?.progressResetAt;
      if (resetAt && existing.progressResetAt !== resetAt) {
        activeUser = {
          ...existing,
          id: dbUser.id || existing.id,
          name: dbUser.name || existing.name,
          email: dbUser.email || existing.email,
          stats: cloudProgress.stats || { correct: 0, total: 0, streak: 0, maxStreak: 0, topicStats: {} },
          bookmarkedQuestions: cloudProgress.bookmarkedQuestions || [],
          repeatQueue: (cloudProgress.repeatQueue || []).map((item) => ({ ...getFreshQuestion(item), ...item })),
          upcomingRepeats: (cloudProgress.upcomingRepeats || []).map((item) => ({ ...getFreshQuestion(item), ...item })),
          questionHistory: cloudProgress.questionHistory || [],
          learnedQuestions: cloudProgress.learnedQuestions || [],
          solvedQuestions: cloudProgress.solvedQuestions || [],
          progressResetAt: resetAt
        };
      } else {
        const mergedBookmarks = Array.from(
          new Set([
            ...(existing.bookmarkedQuestions || []),
            ...(cloudProgress?.bookmarkedQuestions || [])
          ])
        );

        const existingTotal = existing.stats?.total || 0;
        const cloudTotal = cloudProgress?.stats?.total || 0;
        const mergedStats = cloudTotal > existingTotal ? cloudProgress.stats : existing.stats;

        const localRepeatIds = new Set((existing.repeatQueue || []).map((r) => r.id));
        const mergedRepeats = [...(existing.repeatQueue || [])];
        (cloudProgress?.repeatQueue || []).forEach((cr) => {
          if (!localRepeatIds.has(cr.id)) {
            mergedRepeats.push({ ...getFreshQuestion(cr), ...cr });
          }
        });

        activeUser = {
          ...existing,
          id: dbUser.id || existing.id,
          name: dbUser.name || existing.name,
          email: dbUser.email || existing.email,
          stats: mergedStats || existing.stats,
          bookmarkedQuestions: mergedBookmarks,
          repeatQueue: mergedRepeats,
          upcomingRepeats: existing.upcomingRepeats?.length
            ? existing.upcomingRepeats
            : (cloudProgress?.upcomingRepeats || []).map((cr) => ({ ...getFreshQuestion(cr), ...cr })),
          questionHistory: existing.questionHistory?.length
            ? existing.questionHistory
            : (cloudProgress?.questionHistory || []),
          learnedQuestions: existing.learnedQuestions?.length
            ? existing.learnedQuestions
            : (cloudProgress?.learnedQuestions || []),
          solvedQuestions: existing.solvedQuestions?.length
            ? existing.solvedQuestions
            : (cloudProgress?.solvedQuestions || []),
          progressResetAt: resetAt || existing.progressResetAt
        };
      }

      const updated = [...users];
      updated[existingIndex] = activeUser;
      persistUsers(updated);
    } else {
      // Brand new login on this device - restore completely from cloud progress
      const restoredBookmarks = cloudProgress?.bookmarkedQuestions || [];
      const restoredStats = cloudProgress?.stats || {
        correct: 0,
        total: 0,
        streak: 0,
        maxStreak: 0,
        topicStats: {},
      };
      const restoredRepeats = (cloudProgress?.repeatQueue || []).map((cr) => ({ ...getFreshQuestion(cr), ...cr }));
      const restoredUpcoming = (cloudProgress?.upcomingRepeats || []).map((cr) => ({ ...getFreshQuestion(cr), ...cr }));
      const restoredHistory = cloudProgress?.questionHistory || [];

      activeUser = {
        id: dbUser.id || `user_${Date.now()}`,
        name: dbUser.name,
        email: dbUser.email,
        avatar: (dbUser.name?.[0] || 'U').toUpperCase(),
        createdAt: dbUser.created_at ? new Date(dbUser.created_at).getTime() : Date.now(),
        stats: restoredStats,
        bookmarkedQuestions: restoredBookmarks,
        repeatQueue: restoredRepeats,
        upcomingRepeats: restoredUpcoming,
        questionHistory: restoredHistory,
        learnedQuestions: cloudProgress?.learnedQuestions || [],
        solvedQuestions: cloudProgress?.solvedQuestions || [],
        progressResetAt: cloudProgress?.progressResetAt || null,
      };
      persistUsers([...users, activeUser]);
    }

    approveUser(activeUser.id);
    setActiveUserId(activeUser.id);
    localStorage.setItem('psc_active_user_id', activeUser.id);
    setShowAuthModal(false);

    // Initial background sync to ensure cloud is up to date
    syncUserProgressToCloud(activeUser);
  };

  const handleAdminAuthenticated = () => {
    setAdminUnlocked(true);
    let adminUser = users.find(u => u.isAdmin || u.email === 'crazyaneeshus007@gmail.com');
    if (!adminUser) {
      adminUser = {
        id: 'admin_master_aneesh',
        name: 'Aneesh (Admin)',
        email: 'crazyaneeshus007@gmail.com',
        isAdmin: true,
        avatar: 'A',
        createdAt: Date.now(),
        stats: {
          correct: 0,
          total: 0,
          streak: 0,
          maxStreak: 0,
          topicStats: {},
        },
        repeatQueue: [],
        upcomingRepeats: [],
        questionHistory: [],
      };
      persistUsers([...users, adminUser]);
    }
    approveUser(adminUser.id);
    setActiveUserId(adminUser.id);
    localStorage.setItem('psc_active_user_id', adminUser.id);
    setShowAuthModal(false);
    setViewMode('admin');
  };

  // Called from InviteGate after code validated
  const handleInviteCodeValid = (codeObj) => {
    setPendingInviteCode(codeObj);
    setShowInviteGate(false);
    setShowAuthModal(true);
  };

  const handleCreateUser = (newUser) => {
    if (pendingInviteCode) {
      consumeInviteCode(pendingInviteCode.id, newUser.name);
      setPendingInviteCode(null);
    }
    approveUser(newUser.id);
    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);
    setActiveUserId(newUser.id);
    localStorage.setItem('psc_active_user_id', newUser.id);
    setShowAuthModal(false);
    setShowInviteGate(false);
  };

  const handleRevokeUserFromAdmin = (userId) => {
    revokeUser(userId);
    // If the active user is being revoked, sign them out
    if (activeUserId === userId) {
      setActiveUserId(null);
      localStorage.removeItem('psc_active_user_id');
    }
  };

  const handleDeleteUserFromAdmin = (userId) => {
    revokeUser(userId);
    const updated = users.filter(u => u.id !== userId);
    persistUsers(updated);
    if (activeUserId === userId) {
      setActiveUserId(null);
      localStorage.removeItem('psc_active_user_id');
    }
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
          questionHistory: [],
          learnedQuestions: [],
          solvedQuestions: []
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

        const subjectBank = subject === 'english'
          ? ENGLISH_QUESTION_BANK
          : subject === 'pyq'
          ? PYQ_QUESTION_BANK
          : QUESTION_BANK;
        const topicQuestionIds = new Set(subjectBank.filter(isTopicMatch).map(q => q.id));

        // Repeat items are flat question objects; history/learned/solved are plain ID lists
        const newRepeatQueue = (u.repeatQueue || []).filter(q => !isTopicMatch(getFreshQuestion(q)));
        const newUpcoming = (u.upcomingRepeats || []).filter(item => !isTopicMatch(getFreshQuestion(item)));
        const newHistory = (u.questionHistory || []).filter(id => !topicQuestionIds.has(id));
        const newLearned = (u.learnedQuestions || []).filter(id => !topicQuestionIds.has(id));
        const newSolved = (u.solvedQuestions || []).filter(id => !topicQuestionIds.has(id));

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
          questionHistory: newHistory,
          learnedQuestions: newLearned,
          solvedQuestions: newSolved
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

  const handleLogout = () => {
    setActiveUserId(null);
    localStorage.removeItem('psc_active_user_id');
    localStorage.removeItem('psc_pending_verification_email');
    localStorage.removeItem('psc_pending_verification_name');
    adminLogout();
    setAdminUnlocked(false);
    setViewMode('quiz');
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
    setViewMode(subject === 'malayalam' || subject === 'english' || subject === 'pyq' ? 'notes' : 'quiz');
  };

  const handleChooseTopic = (subject, topicId) => {
    setActiveSubject(subject);
    localStorage.setItem('psc_active_subject', subject);
    setSelectedTopic(topicId);
    setViewMode(
      subject === 'malayalam'
        || subject === 'english'
        || (subject === 'pyq' && ['all', 'pq_history', 'pq_geography', 'pq_economics', 'pq_constitution', 'pq_kerala_governance', 'pq_science', 'pq_arts_sports', 'pq_computer', 'pq_acts_laws', 'pq_current_affairs', 'pq_maths', 'pq_english', 'pq_malayalam'].includes(topicId))
        ? 'notes'
        : 'quiz'
    );
    setIsRepeatOnlyMode(false);
    setTopicDropdownOpen(false);
    setMobileSidebarOpen(false);
  };

  const handleSelectSubjectTopic = (subject, topicId) => {
    handleChooseTopic(subject, topicId);
  };

  const handleStartPracticeFromBlueprint = (subject, topicId) => {
    handleChooseTopic(subject, topicId);
  };

  const handleStartMockFromBlueprint = () => {
    setPreviousViewMode(viewMode);
    setViewMode('mock');
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
  // Topic progress counts only questions explicitly marked as learned.
  const userSolvedSet = new Set(currentUser?.learnedQuestions || []);

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

  const handleClearAllBookmarks = () => {
    if (!currentUser) return;
    const updated = users.map(u => {
      if (u.id === activeUserId) {
        return {
          ...u,
          bookmarkedQuestions: []
        };
      }
      return u;
    });
    persistUsers(updated);
  };

  const handleOpenBookmarks = () => {
    if (viewMode === 'bookmarks') {
      setViewMode(previousViewMode || 'blueprint');
    } else {
      setPreviousViewMode(viewMode === 'bookmarks' ? 'blueprint' : viewMode);
      setViewMode('bookmarks');
    }
  };

  const getBookmarkedQuestionsList = () => {
    return userBookmarks.map(id => {
      const qMal = QUESTION_BANK.find(q => q.id === id);
      if (qMal) return { ...qMal, subject: qMal.subject || 'malayalam' };
      const qEng = ENGLISH_QUESTION_BANK.find(q => q.id === id);
      if (qEng) return { ...qEng, subject: qEng.subject || 'english' };
      const qPyq = PYQ_QUESTION_BANK.find(q => q.id === id);
      if (qPyq) return { ...qPyq, subject: qPyq.subject || 'pyq' };
      return null;
    }).filter(Boolean);
  };

  const bookmarkedList = getBookmarkedQuestionsList();

  // Close year dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarYearDropdownRef.current && !sidebarYearDropdownRef.current.contains(e.target)) {
        setSidebarYearDropdownOpen(false);
      }
    };
    if (sidebarYearDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarYearDropdownOpen]);

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

  // Topic matching uses the module-level MALAYALAM_TOPIC_ALIASES (one topic per question)

  const matchesTopic = (question, targetTopicId) => {
    if (targetTopicId === 'all') return true;
    if (activeSubject === 'english' || activeSubject === 'pyq') {
      return question.topic === targetTopicId;
    }
    if (targetTopicId === 'samasam') {
      return question.topic === 'ghadakapadam'
        && (String(question.id).startsWith('sam_') || String(question.question).includes('സമാസ'));
    }
    if (targetTopicId === 'ghadakapadam') {
      return question.topic === 'ghadakapadam'
        && !String(question.id).startsWith('sam_')
        && !String(question.question).includes('സമാസ');
    }
    const aliases = MALAYALAM_TOPIC_ALIASES[targetTopicId] || [targetTopicId];
    return aliases.includes(question.topic);
  };

  const getTopicCounts = (topicId) => {
    const bank = activeSubject === 'pyq'
      ? currentQuestionBank.filter(q => q.year === selectedYear || String(q.id || '').includes(`_${selectedYear}_`))
      : currentQuestionBank;
    const topicQuestions = topicId === 'all'
      ? bank
      : bank.filter(q => matchesTopic(q, topicId));
    const total = topicQuestions.length;
    // Count each question only once, and only if it was answered correctly
    const solved = topicQuestions.filter(q => userSolvedSet.has(q.id)).length;
    return { solved, total };
  };

  const isInActiveSubject = (qId) => {
    if (activeSubject === 'english') return ENGLISH_QUESTION_BANK.some(eq => eq.id === qId);
    if (activeSubject === 'pyq') return PYQ_QUESTION_BANK.some(pq => pq.id === qId);
    return QUESTION_BANK.some(mq => mq.id === qId);
  };

  const matchesYearFilter = (q) =>
    activeSubject !== 'pyq' || q?.year === selectedYear || String(q?.id || '').includes(`_${selectedYear}_`);

  const getFilteredPool = (repeatQueueList = userRepeatQueue) => {
    let pool;
    if (isRepeatOnlyMode) {
      pool = repeatQueueList.filter(q => isInActiveSubject(q.id));
    } else if (selectedTopic === 'all') {
      pool = [...currentQuestionBank];
    } else {
      pool = currentQuestionBank.filter(q => matchesTopic(q, selectedTopic));
    }
    return pool.filter(matchesYearFilter);
  };

  // overrideUsers: pass the freshly-updated users array when calling right after persistUsers(),
  // so this function never overwrites the just-saved state with stale data.
  // reviewMode: allow re-practising already completed questions once a topic is finished.
  const loadNextQuestion = ({ overrideUsers = null, reviewMode = null } = {}) => {
    setIsAnswered(false);
    setSelectedOption(null);

    const baseUsers = Array.isArray(overrideUsers) ? overrideUsers : users;
    const baseUser = baseUsers.find(u => u.id === activeUserId) || currentUser;
    const upcomingList = baseUser?.upcomingRepeats || [];
    const repeatQueueList = baseUser?.repeatQueue || [];
    const historyList = baseUser?.questionHistory || [];
    const baseTotal = baseUser?.stats?.total || 0;
    const learnedSet = new Set(baseUser?.learnedQuestions || []);
    const solvedSet = new Set(baseUser?.solvedQuestions || []);
    const upcomingIds = new Set(upcomingList.map(r => r.id));
    const currentId = currentQuestion?.id;
    const allowReview = reviewMode ?? isTopicReviewMode;

    const pool = getFilteredPool(repeatQueueList);

    if (pool.length === 0) {
      setCurrentQuestion(null);
      return;
    }

    let nextQ = null;
    let isRepeat = false;

    if (isRepeatOnlyMode) {
      // In Mistake Queue mode: pick from the subject's repeat queue without immediate repeats
      const candidates = pool.length > 1 ? pool.filter(q => q.id !== currentId) : pool;
      const randIndex = Math.floor(Math.random() * candidates.length);
      nextQ = getFreshQuestion(candidates[randIndex]);
      isRepeat = true;
    } else {
      // All pending repeats for this subject / topic / year
      const topicRepeats = upcomingList.filter(rep => {
        const freshQ = getFreshQuestion(rep);
        return isInActiveSubject(freshQ.id)
          && (selectedTopic === 'all' || matchesTopic(freshQ, selectedTopic))
          && matchesYearFilter(freshQ)
          && (rep.remainingRepeats ?? 1) > 0;
      });

      // Repeats that are due: passed the 5-question gap, not recent, not the current question
      const recent = historyList.slice(-5);
      const dueRepeats = topicRepeats.filter(rep =>
        (!rep.minAvailableAt || baseTotal >= rep.minAvailableAt)
        && !recent.includes(rep.id)
        && rep.id !== currentId
      );

      // Fresh questions: never answered correctly, not learned, not waiting in the repeat queue
      const freshCandidates = pool.filter(q =>
        !solvedSet.has(q.id)
        && !learnedSet.has(q.id)
        && !upcomingIds.has(q.id)
        && q.id !== currentId
      );

      if (dueRepeats.length > 0 && (freshCandidates.length === 0 || Math.random() > 0.3)) {
        nextQ = getFreshQuestion(dueRepeats[0]);
        isRepeat = true;
        soundFX.playRepeatAlert();
      } else if (freshCandidates.length > 0) {
        const randIndex = Math.floor(Math.random() * freshCandidates.length);
        nextQ = getFreshQuestion(freshCandidates[randIndex]);
      } else if (topicRepeats.length > 0) {
        // No fresh questions left: finish the pending repeats (earliest due first)
        const waiting = topicRepeats.filter(r => r.id !== currentId);
        const ordered = [...(waiting.length > 0 ? waiting : topicRepeats)]
          .sort((a, b) => (a.minAvailableAt || 0) - (b.minAvailableAt || 0));
        nextQ = getFreshQuestion(ordered[0]);
        isRepeat = true;
        soundFX.playRepeatAlert();
      } else if (allowReview) {
        // Topic finished and the user chose to review it again
        const reviewPool = pool.filter(q => q.id !== currentId && !recent.includes(q.id));
        const fallback = pool.filter(q => q.id !== currentId);
        const selectionPool = reviewPool.length > 0 ? reviewPool : (fallback.length > 0 ? fallback : pool);
        const randIndex = Math.floor(Math.random() * selectionPool.length);
        nextQ = getFreshQuestion(selectionPool[randIndex]);
      }
      // Otherwise nextQ stays null -> "Topic Completely Mastered" screen
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

      const activeRep = upcomingList.find(r => r.id === nextQ.id)
        || repeatQueueList.find(r => r.id === nextQ.id);

      setCurrentQuestion({
        ...nextQ,
        options: finalOptions,
        answer: finalAnswer,
        isRepeat,
        repeatDifficulty: activeRep?.difficulty || nextQ.difficulty || null,
        remainingRepeats: isRepeat ? (activeRep?.remainingRepeats ?? 3) : null
      });

      if (baseUser) {
        const updatedHistory = [...historyList.slice(-20), nextQ.id];
        const updated = baseUsers.map(u => u.id === activeUserId ? { ...u, questionHistory: updatedHistory } : u);
        persistUsers(updated);
      }
    } else {
      setCurrentQuestion(null);
    }
  };

  // Load question when topic, mode, subject, year, or active user changes
  useEffect(() => {
    if (currentUser && viewMode === 'quiz') {
      setIsTopicReviewMode(false);
      loadNextQuestion({ reviewMode: false });
    }
  }, [selectedTopic, isRepeatOnlyMode, activeSubject, selectedYear, activeUserId, viewMode]);

  const handleOptionSelect = (rawOptionIndex) => {
    if (isAnswered || !currentQuestion || !currentUser) return;

    // Some questions contain the correct answer text twice; treat an identical option as the correct one
    const correctText = currentQuestion.options?.[currentQuestion.answer];
    const optionIndex = currentQuestion.options?.[rawOptionIndex] === correctText
      ? currentQuestion.answer
      : rawOptionIndex;

    setIsAnswered(true);
    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === currentQuestion.answer;

    // Find topic ID for stats
    const matchedSyllabus = currentSyllabusTopics.find(t => t.id !== 'all' && matchesTopic(currentQuestion, t.id));
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

      const qId = currentQuestion.id;
      const currentTotal = (userStats.total || 0) + 1;
      let updatedUpcoming = [...userUpcomingRepeats];
      let updatedRepeatQueue = [...userRepeatQueue];
      let updatedLearned = [...(currentUser?.learnedQuestions || [])];
      const prevSolved = currentUser?.solvedQuestions || [];
      const updatedSolved = prevSolved.includes(qId) ? prevSolved : [...prevSolved, qId];

      if (currentQuestion.isRepeat) {
        // When an active repeat question is answered correctly: automatically advance repeat countdown!
        const existingRepeat = userUpcomingRepeats.find(item => item.id === qId);
        const prevRemaining = currentQuestion.remainingRepeats ?? existingRepeat?.remainingRepeats ?? 3;
        const nextRemaining = prevRemaining > 1 ? prevRemaining - 1 : 0;

        if (nextRemaining === 0) {
          // Completed all 3 repeats! Mastered and graduated
          updatedUpcoming = updatedUpcoming.filter(item => item.id !== qId);
          updatedRepeatQueue = updatedRepeatQueue.filter(item => item.id !== qId);
          if (!updatedLearned.includes(qId)) {
            updatedLearned.push(qId);
          }
        } else {
          const freshQ = getFreshQuestion(currentQuestion);
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
        }
      }

      const updated = users.map(u => {
        if (u.id === activeUserId) {
          return {
            ...u,
            repeatQueue: updatedRepeatQueue,
            upcomingRepeats: updatedUpcoming,
            learnedQuestions: updatedLearned,
            solvedQuestions: updatedSolved,
            stats: {
              correct: u.stats.correct + 1,
              total: currentTotal,
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
      // A wrong answer means the question is no longer counted as solved until answered correctly again
      const updatedSolved = (currentUser?.solvedQuestions || []).filter(id => id !== qId);

      const updated = users.map(u => {
        if (u.id === activeUserId) {
          return {
            ...u,
            repeatQueue: updatedRepeatQueue,
            upcomingRepeats: updatedUpcoming,
            learnedQuestions: updatedLearned,
            solvedQuestions: updatedSolved,
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
    if (difficulty === 'easy' && (
      currentQuestion.isRepeat
      || !isAnswered
      || selectedOption !== currentQuestion.answer
    )) return;

    const currentTotal = userStats.total || 0;
    const qId = currentQuestion.id;
    const freshQ = getFreshQuestion(currentQuestion);

    const existingRepeat = userUpcomingRepeats.find(item => item.id === qId);

    let updatedUpcoming = [...userUpcomingRepeats];
    let updatedRepeatQueue = [...userRepeatQueue];
    let updatedLearned = [...(currentUser?.learnedQuestions || [])];

    let updatedSolved = [...(currentUser?.solvedQuestions || [])];

    if (difficulty === 'easy') {
      // Marked as learned! Removed from repeat queues
      updatedUpcoming = updatedUpcoming.filter(item => item.id !== qId);
      updatedRepeatQueue = updatedRepeatQueue.filter(item => item.id !== qId);
      if (!updatedLearned.includes(qId)) {
        updatedLearned.push(qId);
      }
      if (!updatedSolved.includes(qId)) {
        updatedSolved.push(qId);
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
      // Fresh question marked Hard: schedules for 3 repeats with min 5 question gap
      const repeatItem = {
        ...freshQ,
        id: qId,
        difficulty: 'hard',
        remainingRepeats: 3,
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

    const updated = users.map(u => {
      if (u.id === activeUserId) {
        return {
          ...u,
          repeatQueue: updatedRepeatQueue,
          upcomingRepeats: updatedUpcoming,
          learnedQuestions: updatedLearned,
          solvedQuestions: updatedSolved
        };
      }
      return u;
    });

    persistUsers(updated);
    // Pass the updated users so loadNextQuestion doesn't overwrite this choice with stale state
    loadNextQuestion({ overrideUsers: updated });
  };

  // Keyboard shortcut listener for Easy (1/e) & Hard (2/h) when correct, or Next (Enter/Space/1) when incorrect
  useEffect(() => {
    if (!isAnswered || !currentQuestion) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      const isCorrect = selectedOption === currentQuestion.answer;

      if (isCorrect && !currentQuestion.isRepeat) {
        // Fresh question answered correctly: 1/h for Hard, 2/e for Easy
        if (e.key === '1' || e.key.toLowerCase() === 'h') {
          e.preventDefault();
          handleDifficultySelect('hard');
        } else if (e.key === '2' || e.key.toLowerCase() === 'e') {
          e.preventDefault();
          handleDifficultySelect('easy');
        }
      } else {
        // Repeat question answered correctly OR incorrect answer: Enter/Space/1/ArrowRight advances!
        if (e.key === 'Enter' || e.key === ' ' || e.key === '1' || e.key === 'ArrowRight') {
          e.preventDefault();
          loadNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQuestion, selectedOption, userUpcomingRepeats, userRepeatQueue, userStats, users]);

  const currentTopicData = currentSyllabusTopics.find(t => t.id === selectedTopic) || currentSyllabusTopics[0];
  const currentTopicProgress = getTopicCounts(selectedTopic);

  return (
    <div className={`app-container${viewMode === 'admin' ? ' admin-mode' : ''}${viewMode === 'mock' ? ' mock-mode' : ''}`}>
      {/* Invite Gate — shown to new users who need an invite code */}
      {showInviteGate && (
        <InviteGate onValidCode={handleInviteCodeValid} />
      )}

      {/* Auth Modal when not logged in or switching */}
      {showAuthModal && (
        <AuthModal
          users={users}
          onSelectUser={handleSelectUser}
          onUserAuthenticated={handleUserAuthenticated}
          onAdminAuthenticated={handleAdminAuthenticated}
        />
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={() => {
            setAdminUnlocked(true);
            setShowAdminLogin(false);
            setShowAdminPanel(true);
          }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          users={users}
          onRevokeUser={handleRevokeUserFromAdmin}
        />
      )}

      {/* User Profile Modal */}
      {showProfileModal && currentUser && (
        <ProfileModal
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout}
          onResetProgress={handleRequestResetAllProgress}
          onDeleteAccount={handleRequestDeleteAccount}
          onUpdateUser={handleUpdateUser}
          onSyncNow={handleManualCloudSync}
          cloudSyncStatus={cloudSyncStatus}
        />
      )}

      {/* Sidebar: Syllabus Topics */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''} ${viewMode === 'admin' || viewMode === 'mock' ? 'sidebar-hidden' : ''}`}>
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
              <span className="subject-btn-label">Malayalam</span>
              <span className="subject-qcount">{QUESTION_BANK.length.toLocaleString()} Qs</span>
            </button>
            <button
              type="button"
              className={`subject-switch-btn ${activeSubject === 'english' ? 'active' : ''}`}
              onClick={() => handleSwitchSubject('english')}
            >
              <span className="subject-btn-label">General English</span>
              <span className="subject-qcount">{ENGLISH_QUESTION_BANK.length.toLocaleString()} Qs</span>
            </button>
          </div>

          <div className={`pyq-switch-bottom-row ${activeSubject === 'pyq' ? 'active' : ''}`}>
            <button
              type="button"
              className="pyq-switch-btn-left"
              onClick={() => handleSwitchSubject('pyq')}
            >
              <span className="pyq-btn-title">Previous Year Papers</span>
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
                <span>{selectedYear}</span>
                <ChevronDownIcon size={14} className={`sidebar-year-chevron ${sidebarYearDropdownOpen ? 'open' : ''}`} />
              </button>

              {sidebarYearDropdownOpen && (
                <div className="sidebar-year-dropdown-menu">
                  <div className="sidebar-year-dropdown-header">
                    <span>Select Exam Year</span>
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
            const isActive = selectedTopic === topic.id
              && !isRepeatOnlyMode
              && (viewMode === 'quiz' || viewMode === 'notes');
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
                    handleChooseTopic(activeSubject, topic.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleChooseTopic(activeSubject, topic.id);
                    }
                  }}
                >
                  <span className="topic-icon">
                    {topic.id === 'all' ? (
                      <TargetIcon size={16} />
                    ) : (
                      <span className="topic-accent-dot" />
                    )}
                  </span>
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
                          background: 'linear-gradient(90deg, #0284c7, #38bdf8)'
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
        {viewMode !== 'mock' && (
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

              {/* Mobile Subject Toggle - hidden in admin mode */}
              {viewMode !== 'admin' ? (
                <div className="mobile-subject-nav-toggle mobile-only">
                  <button
                    type="button"
                    className={`mob-subj-btn ${activeSubject === 'malayalam' ? 'active' : ''}`}
                    onClick={() => handleSwitchSubject('malayalam')}
                  >
                    MAL
                  </button>
                  <button
                    type="button"
                    className={`mob-subj-btn ${activeSubject === 'english' ? 'active' : ''}`}
                    onClick={() => handleSwitchSubject('english')}
                  >
                    ENG
                  </button>
                  <button
                    type="button"
                    className={`mob-subj-btn ${activeSubject === 'pyq' ? 'active' : ''}`}
                    onClick={() => handleSwitchSubject('pyq')}
                  >
                    PYQ
                  </button>
                </div>
              ) : (
                <div className="mobile-admin-title mobile-only">
                  <ShieldCheckIcon size={14} />
                  <span>Admin Mode</span>
                </div>
              )}

              {/* Desktop View: Active Topic Pill */}
              {viewMode === 'admin' ? null : viewMode === 'blueprint' ? (
                <div className="current-topic-pill desktop-only blueprint-nav-pill">
                  <LayoutDashboardIcon size={15} />
                  <strong>LDC 100-Mark Blueprint Dashboard</strong>
                </div>
              ) : viewMode === 'bookmarks' ? (
                <div className="current-topic-pill desktop-only">
                  <BookmarkIcon size={15} />
                  <strong>Bookmarks Library</strong>
                </div>
              ) : (
                <div className="current-topic-pill desktop-only">
                  {isRepeatOnlyMode ? <RotateIcon size={15} /> : <TargetIcon size={15} />}
                  <strong>{isRepeatOnlyMode ? 'Review Queue' : currentTopicData.name}</strong>
                </div>
              )}
            </div>

            <div className="nav-right">
              {/* Admin Center Navbar Button */}
              {adminUnlocked && (
                <button
                  type="button"
                  className={`nav-admin-center-btn ${viewMode === 'admin' ? 'active' : ''}`}
                  onClick={() => {
                    if (viewMode === 'admin') {
                      setViewMode(previousViewMode || 'quiz');
                    } else {
                      setPreviousViewMode(viewMode);
                      setViewMode('admin');
                    }
                  }}
                  title={viewMode === 'admin' ? "Return to Practice Quiz" : "Administrator Control Center"}
                >
                  {viewMode === 'admin' ? (
                    <>
                      <ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} />
                      <span className="desktop-only">Back to Practice</span>
                    </>
                  ) : (
                    <>
                      <ShieldIcon size={15} />
                      <span className="desktop-only">Admin Center</span>
                    </>
                  )}
                </button>
              )}

              {/* Bookmarks Navbar Button (Opens Full Page Library) - hidden in admin on mobile */}
              {viewMode !== 'admin' && (
                <button
                  type="button"
                  className={`nav-bookmark-btn ${viewMode === 'bookmarks' ? 'active' : ''}`}
                  onClick={handleOpenBookmarks}
                  title="View Bookmarks (Full Page Library)"
                >
                  <BookmarkIcon size={16} className="nav-bookmark-icon" />
                  <span className="nav-bookmark-label desktop-only">Bookmark</span>
                </button>
              )}

              {/* Spaced Review Queue Pill on Navbar - shown only when not empty & not in admin */}
              {viewMode !== 'admin' && currentSubjectRepeatQueue.length > 0 && (
                <button
                  type="button"
                  className="nav-review-queue-pill"
                  onClick={() => setShowRepeatModal(true)}
                  title={`Open Spaced Review Queue (${currentSubjectRepeatQueue.length} questions waiting)`}
                >
                  <RotateIcon size={15} className="queue-pill-icon" />
                  <span className="queue-pill-label desktop-only">Review Queue</span>
                </button>
              )}

              {/* User Profile Badge (Top Right) */}
              {currentUser && (
                <>
                  <button
                    className="user-nav-badge"
                    onClick={() => setShowProfileModal(true)}
                    title="View Profile and Topic Mastery Analytics"
                  >
                    <span className="user-nav-avatar-initials">
                      {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                    </span>
                    <span className="user-nav-name desktop-only">{currentUser.name}</span>
                  </button>
                  <button
                    className="user-nav-logout-btn"
                    onClick={handleLogout}
                    title="Log Out"
                  >
                    <LogOutIcon size={14} />
                    <span className="desktop-only">Log Out</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Keep topic selection available on mobile while reading notes or practicing. */}
          {(viewMode === 'quiz' || viewMode === 'notes') && (
            <div className="mobile-topic-bar mobile-only">
            <button
              type="button"
              className={`custom-topic-trigger ${topicDropdownOpen ? 'active' : ''}`}
              onClick={() => setTopicDropdownOpen(!topicDropdownOpen)}
              aria-expanded={topicDropdownOpen}
            >
              <div className="trigger-left">
                <span className="trigger-icon">{isRepeatOnlyMode ? <RotateIcon size={15} /> : <TargetIcon size={15} />}</span>
                <span className="trigger-name">{isRepeatOnlyMode ? 'Review Queue Practice' : currentTopicData.name}</span>
              </div>
              <span
                className="mobile-topic-count"
                aria-label={`${currentTopicProgress.solved} of ${currentTopicProgress.total} questions learned`}
                title={`${currentTopicProgress.solved} of ${currentTopicProgress.total} questions learned`}
              >
                {currentTopicProgress.solved} / {currentTopicProgress.total}
              </span>
              <ChevronDownIcon size={15} className={`trigger-chevron ${topicDropdownOpen ? 'open' : ''}`} />
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
                      <span className="dropdown-year-title">Exam Year:</span>
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
                            handleChooseTopic(activeSubject, 'all');
                          }}
                        >
                          <span className="opt-icon"><TargetIcon size={16} /></span>
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
                                style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }}
                              />
                            </div>
                          </div>
                          {selectedTopic === 'all' && !isRepeatOnlyMode && <span className="opt-check">✓</span>}
                        </div>
                      );
                    })()}

                    <div className="dropdown-section-label">
                      {activeSubject === 'english' ? 'General English' : activeSubject === 'pyq' ? 'PYQ' : 'Malayalam'} Topics ({currentSyllabusTopics.filter(t => t.id !== 'all').length})
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
                            handleChooseTopic(activeSubject, topic.id);
                          }}
                        >
                          <span className="opt-icon">
                            <span className="topic-accent-dot" />
                          </span>
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
                                  background: 'linear-gradient(90deg, #0284c7, #38bdf8)'
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
        )}
          </header>
        )}

        {/* Main Content Viewport */}
        <div className="quiz-content-area">
          {viewMode === 'admin' ? (
            <AdminDashboardView
              onStartPractice={() => {
                setPreviousViewMode('admin');
                setViewMode('quiz');
              }}
              onStartBlueprint={() => setViewMode('blueprint')}
              onRevokeUser={handleRevokeUserFromAdmin}
              onDeleteUser={handleDeleteUserFromAdmin}
              onLogout={handleLogout}
            />
          ) : viewMode === 'blueprint' ? (
            <BlueprintDashboard
              currentUser={currentUser}
              onStartPractice={handleStartPracticeFromBlueprint}
              onStartMock={handleStartMockFromBlueprint}
              questionCounts={questionCountsMap}
            />
          ) : viewMode === 'bookmarks' ? (
            <BookmarksPage
              bookmarkedQuestions={bookmarkedList}
              onRemoveBookmark={handleToggleBookmark}
              onClearAll={handleClearAllBookmarks}
              onBack={() => setViewMode(previousViewMode || 'blueprint')}
              onPracticeTopic={(subject, topicId) => {
                handleSelectSubjectTopic(subject, topicId);
              }}
              syllabusTopics={SYLLABUS_TOPICS}
              englishTopics={ENGLISH_SYLLABUS_TOPICS}
              pyqTopics={PYQ_TOPICS}
            />
          ) : viewMode === 'mock' ? (
            <MockExamPage
              year={selectedYear}
              onExit={() => setViewMode(previousViewMode || 'blueprint')}
            />
          ) : viewMode === 'notes' ? (
            <TopicNotes
              subject={activeSubject}
              topicId={selectedTopic}
              onProceed={() => setViewMode('quiz')}
            />
          ) : currentQuestion ? (
            <div className="question-card">
              {/* Question Header & Badges */}
              <div className="card-top-bar">
                <div className="card-top-bar-left">
                  <span className="topic-badge">
                    {currentSyllabusTopics.find(t => matchesTopic(currentQuestion, t.id))?.name || currentQuestion.topic || 'Practice Question'}
                  </span>
                  {activeSubject === 'pyq' && (currentQuestion.year || currentQuestion.id) && (
                    <span className="pyq-year-badge">
                      {currentQuestion.year || String(currentQuestion.id || '').match(/20\d\d/)?.[0] || 'PYQ'} Exam
                    </span>
                  )}
                  {activeSubject === 'pyq' && currentQuestion.qp_code && (
                    <span className="pyq-paper-code-badge" title="Original Kerala PSC Question Paper Code">
                      <FileTextIcon size={12} />
                      <span>QP: <strong>{currentQuestion.qp_code}</strong></span>
                    </span>
                  )}
                </div>

                <div className="card-top-bar-right">
                  {/* Bookmark Button */}
                  <button
                    type="button"
                    className={`card-bookmark-btn ${isCurrentBookmarked ? 'bookmarked' : ''}`}
                    onClick={() => handleToggleBookmark(currentQuestion.id)}
                    title={isCurrentBookmarked ? "Remove Bookmark" : "Bookmark this question"}
                    aria-label="Bookmark question"
                  >
                    <BookmarkIcon size={15} />
                    <span className="bookmark-btn-text">{isCurrentBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>
                </div>
              </div>

              {/* Spaced Review Queue Banner */}
              {currentQuestion.isRepeat && (
                <div className="repeat-alert-banner">
                  <RotateIcon size={13} />
                  <span>Review Queue {currentQuestion.repeatDifficulty ? `• Level: ${currentQuestion.repeatDifficulty.toUpperCase()}` : ''} {currentQuestion.remainingRepeats ? (
                    isAnswered && selectedOption === currentQuestion.answer
                      ? `(${Math.max(0, currentQuestion.remainingRepeats - 1)} repeat${Math.max(0, currentQuestion.remainingRepeats - 1) === 1 ? '' : 's'} left)`
                      : `(${currentQuestion.remainingRepeats} repeat${currentQuestion.remainingRepeats > 1 ? 's' : ''} left)`
                  ) : ''} — Practice until mastered</span>
                </div>
              )}

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

                  {currentQuestion.explanation && (
                    <div className="explanation-box">
                      <div className="explanation-header-title">
                        <InfoIcon size={14} />
                        <span className="explanation-heading">Explanation / വിശദീകരണം:</span>
                      </div>
                      <div className="explanation-text-body">
                        {cleanExplanation(currentQuestion.explanation)}
                      </div>
                    </div>
                  )}

                  {/* FOR FRESH RIGHT ANSWER: Show Hard (repeat 3x) and Easy (mark learned) */}
                  {selectedOption === currentQuestion.answer && !currentQuestion.isRepeat ? (
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
                          <span className="diff-indicator diff-hard" />
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
                          <span className="diff-indicator diff-easy" />
                          <div className="diff-btn-content">
                            <span className="diff-btn-name">Easy</span>
                            <span className="diff-btn-desc">Mark as Learned</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : selectedOption === currentQuestion.answer && currentQuestion.isRepeat ? (
                    /* FOR REPEAT QUESTION ANSWERED CORRECTLY */
                    <div className="difficulty-prompt-container repeat-correct-prompt">
                      <div className="auto-queue-banner repeat-success-banner">
                        <span className="auto-queue-icon">
                          {(currentQuestion.remainingRepeats ?? 3) <= 1 ? <CheckIcon size={18} /> : <RotateIcon size={18} />}
                        </span>
                        <div className="auto-queue-text">
                          <strong>
                            {(currentQuestion.remainingRepeats ?? 3) <= 1
                              ? 'Mastered! All 3 repeats completed'
                              : `Repeat completed! (${(currentQuestion.remainingRepeats ?? 3) - 1} left)`}
                          </strong>
                          <span>
                            {(currentQuestion.remainingRepeats ?? 3) <= 1
                              ? 'Question successfully mastered and marked as learned!'
                              : 'Will reappear after at least 5 questions'}
                          </span>
                        </div>
                      </div>

                      <div className="action-row" style={{ marginTop: '0.85rem' }}>
                        <button
                          type="button"
                          className="next-btn"
                          onClick={() => loadNextQuestion()}
                          title="Advance to next question (Enter / Space)"
                        >
                          <span>Next Question</span>
                          <ArrowRightIcon size={15} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* FOR INCORRECT ANSWER: Auto-queued for 3 repeats (min 5 gap) */
                    <div className="difficulty-prompt-container incorrect-prompt">
                      <div className="auto-queue-banner">
                        <span className="auto-queue-icon">
                          <RotateIcon size={18} />
                        </span>
                        <div className="auto-queue-text">
                          <strong>
                            {currentQuestion.isRepeat
                              ? 'Repeat counter reset — 3 more correct repeats needed'
                              : 'Scheduled to repeat 3 times'}
                          </strong>
                          <span>Will reappear after at least 5 questions</span>
                        </div>
                      </div>

                      <div className="action-row" style={{ marginTop: '0.85rem' }}>
                        <button
                          type="button"
                          className="next-btn"
                          onClick={() => loadNextQuestion()}
                          title="Proceed to next question (Enter / Space)"
                        >
                          <span>Next Question</span>
                          <ArrowRightIcon size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state-card">
              <div style={{ marginBottom: '1rem', color: '#10b981', display: 'flex', justifyContent: 'center' }}>
                <TrophyIcon size={44} />
              </div>
              <h2>Topic Completely Mastered!</h2>
              <p>Every question here has been answered correctly and all repeats are finished. Switch topics or practice another syllabus section.</p>
              <div className="empty-state-actions">
                {!isRepeatOnlyMode && (
                  <button
                    type="button"
                    id="review-topic-again-btn"
                    className="next-btn"
                    onClick={() => {
                      setIsTopicReviewMode(true);
                      loadNextQuestion({ reviewMode: true });
                    }}
                  >
                    Review This Topic Again
                  </button>
                )}
                <button
                  type="button"
                  className="next-btn"
                  onClick={() => {
                    setIsRepeatOnlyMode(false);
                    setSelectedTopic('all');
                  }}
                >
                  Switch to All Topics
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Repeat Queue Modal */}
      {showRepeatModal && (
        <div className="modal-overlay" onClick={() => setShowRepeatModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateIcon size={18} />
                <span>Spaced Review & Repeat Queue ({activeSubject === 'english' ? 'English' : activeSubject === 'pyq' ? 'PYQ' : 'Malayalam'})</span>
                <span className="repeat-badge-count">{currentSubjectRepeatQueue.length}</span>
              </h2>
              <button className="close-btn" onClick={() => setShowRepeatModal(false)} aria-label="Close">
                <XIcon size={18} />
              </button>
            </div>

            <div className="modal-body">
              {currentSubjectRepeatQueue.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                  <div style={{ marginBottom: '1rem', color: '#38bdf8', display: 'flex', justifyContent: 'center' }}>
                    <CheckCircleIcon size={44} />
                  </div>
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
                      style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => {
                        setShowRepeatModal(false);
                        setIsRepeatOnlyMode(true);
                      }}
                    >
                      <span>Practice Missed Questions Only</span>
                      <ArrowRightIcon size={14} />
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
                      {item.explanation && (
                        <div className="mistake-card-exp">
                          <div className="explanation-header-title">
                            <InfoIcon size={13} />
                            <span className="explanation-heading">Explanation / വിശദീകരണം:</span>
                          </div>
                          <div>{cleanExplanation(item.explanation)}</div>
                        </div>
                      )}
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


      {/* Themed Confirmation Modal */}
      <ConfirmModal
        {...confirmDialog}
        onCancel={closeConfirmDialog}
      />
    </div>
  );
}
