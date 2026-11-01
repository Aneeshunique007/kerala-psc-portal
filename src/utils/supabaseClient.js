import { createClient } from '@supabase/supabase-js';

// Fallback configuration
const DEFAULT_URL = 'https://ougllajltksgzknqqnrc.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_3U5KEx-OIWY2CJ2eOepjFA_S5NYsrdl';

const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

const supabaseUrl =
  metaEnv.VITE_SUPABASE_URL ||
  metaEnv.NEXT_PUBLIC_SUPABASE_URL ||
  DEFAULT_URL;

const supabaseAnonKey =
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Service functions for user registration and verification workflow
 */

// Register a new user with pending status
export async function registerUser({ name, email, password }) {
  if (!supabase) throw new Error('Supabase client not configured');
  
  const cleanEmail = email.trim().toLowerCase();

  // Protect administrator email from being registered as candidate
  if (cleanEmail === 'crazyaneeshus007@gmail.com') {
    return {
      success: false,
      message: 'This email is reserved for the Administrator. Please log in directly via the Sign In tab.',
    };
  }
  
  // Check if user already exists
  const { data: existing, error: checkError } = await supabase
    .from('app_users')
    .select('id, status, email')
    .eq('email', cleanEmail)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking user:', checkError);
  }

  if (existing) {
    return {
      success: false,
      alreadyExists: true,
      status: existing.status,
      message:
        existing.status === 'pending'
          ? 'Your account is already submitted and currently under verification.'
          : existing.status === 'rejected'
          ? 'This account request was declined. Please contact admin.'
          : 'An account with this email already exists. Please log in.',
    };
  }

  const { data, error } = await supabase
    .from('app_users')
    .insert([
      {
        name: name.trim(),
        email: cleanEmail,
        password: password,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, user: data };
}

// User login: validates email + password and checks approval status
export async function loginUser({ email, password }) {
  if (!supabase) throw new Error('Supabase client not configured');

  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('email', cleanEmail)
    .maybeSingle();

  if (error) {
    console.error('Login query error:', error);
    return { success: false, error: 'Database connection error' };
  }

  if (!data) {
    return { success: false, notFound: true, error: 'No account found with this email. Please sign up first.' };
  }

  if (data.password !== password) {
    return { success: false, error: 'Incorrect password.' };
  }

  if (data.status === 'pending') {
    return {
      success: false,
      isPending: true,
      status: 'pending',
      user: data,
      error: 'Your account is under verification. Admin approval is required before you can access the portal.',
    };
  }

  if (data.status === 'rejected') {
    return {
      success: false,
      isRejected: true,
      status: 'rejected',
      error: 'Your account request was declined by the administrator.',
    };
  }

  // Status is approved
  return { success: true, user: data };
}

// Check verification status by email (for polling or checking status)
export async function checkUserStatus(email) {
  if (!supabase) return null;
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from('app_users')
    .select('id, name, email, status, approved_at')
    .eq('email', cleanEmail)
    .maybeSingle();

  if (error) return null;
  return data;
}

// Admin: fetch all users grouped or filtered
export async function adminFetchAllUsers() {
  if (!supabase) return { users: [], error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Admin fetch users error:', error);
    return { users: [], error: error.message };
  }

  return { users: data || [], error: null };
}

// Admin: approve a pending or rejected user
export async function adminApproveUser(userId) {
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('app_users')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data };
}

// Admin: reject a pending user
export async function adminRejectUser(userId) {
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('app_users')
    .update({ status: 'rejected' })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data };
}

// Admin: delete a user record entirely
export async function adminDeleteUser(userId) {
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { error } = await supabase
    .from('app_users')
    .delete()
    .eq('id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Sync candidate study progress (stats, bookmarks, repetition queues, quiz history) to Supabase
export async function syncUserProgressToCloud(user) {
  if (!supabase || !user) return { success: false, error: 'No user or supabase client' };

  const payload = {
    stats: user.stats || { correct: 0, total: 0, streak: 0, maxStreak: 0, topicStats: {} },
    bookmarkedQuestions: user.bookmarkedQuestions || [],
    repeatQueue: (user.repeatQueue || []).map((r) => ({
      id: r.id,
      step: r.step || 0,
      nextReview: r.nextReview || 0,
      difficulty: r.difficulty || null,
      remainingRepeats: r.remainingRepeats ?? null,
      minAvailableAt: r.minAvailableAt ?? null,
    })),
    upcomingRepeats: (user.upcomingRepeats || []).map((r) => ({
      id: r.id,
      step: r.step || 0,
      nextReview: r.nextReview || 0,
      difficulty: r.difficulty || null,
      remainingRepeats: r.remainingRepeats ?? null,
      minAvailableAt: r.minAvailableAt ?? null,
    })),
    learnedQuestions: user.learnedQuestions || [],
    solvedQuestions: user.solvedQuestions || [],
    questionHistory: (user.questionHistory || []).slice(-200),
    progressResetAt: user.progressResetAt || null,
    lastSyncedAt: new Date().toISOString(),
  };

  try {
    const isUuid = user.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
    let query = supabase.from('app_users').select('progress');

    if (isUuid) {
      query = query.eq('id', user.id);
    } else if (user.email) {
      query = query.eq('email', user.email.toLowerCase().trim());
    } else {
      return { success: false, error: 'No valid user ID or email' };
    }

    const { data: existingUser, error: lookupError } = await query.maybeSingle();
    if (lookupError) {
      console.warn('Cloud progress sync notice:', lookupError.message);
      return { success: false, error: lookupError.message };
    }
    const cloudResetAt = existingUser?.progress?.progressResetAt;
    if (cloudResetAt && user.progressResetAt !== cloudResetAt) {
      return { success: false, error: 'Cloud progress was reset; local progress must be refreshed first.' };
    }

    // Protection Guard: Never allow an uninitialized or stale local session to overwrite or downgrade higher cloud progress!
    const cloudProgress = existingUser?.progress;
    if (cloudProgress && !user._isExplicitReset) {
      const cloudLearned = cloudProgress.learnedQuestions || [];
      const localLearned = payload.learnedQuestions || [];
      const cloudSolved = cloudProgress.solvedQuestions || [];
      const localSolved = payload.solvedQuestions || [];
      const cloudStats = cloudProgress.stats || {};
      const localStats = payload.stats || {};

      // If cloud has more learned questions or higher total, safely merge to preserve all progress
      if (cloudLearned.length > localLearned.length || (cloudStats.total || 0) > (localStats.total || 0)) {
        payload.learnedQuestions = Array.from(new Set([...cloudLearned, ...localLearned]));
        payload.solvedQuestions = Array.from(new Set([...cloudSolved, ...localSolved]));
        payload.bookmarkedQuestions = Array.from(
          new Set([...(cloudProgress.bookmarkedQuestions || []), ...(payload.bookmarkedQuestions || [])])
        );

        const mergedTopicStats = { ...(cloudStats.topicStats || {}) };
        for (const [topId, topVal] of Object.entries(localStats.topicStats || {})) {
          if (!mergedTopicStats[topId] || (topVal.total || 0) > (mergedTopicStats[topId].total || 0)) {
            mergedTopicStats[topId] = topVal;
          }
        }

        payload.stats = {
          correct: Math.max(cloudStats.correct || 0, localStats.correct || 0),
          total: Math.max(cloudStats.total || 0, localStats.total || 0),
          streak: Math.max(cloudStats.streak || 0, localStats.streak || 0),
          maxStreak: Math.max(cloudStats.maxStreak || 0, localStats.maxStreak || 0, payload.stats.streak || 0),
          topicStats: mergedTopicStats,
        };

        if ((!payload.repeatQueue || payload.repeatQueue.length === 0) && cloudProgress.repeatQueue?.length) {
          payload.repeatQueue = cloudProgress.repeatQueue;
        }
        if ((!payload.upcomingRepeats || payload.upcomingRepeats.length === 0) && cloudProgress.upcomingRepeats?.length) {
          payload.upcomingRepeats = cloudProgress.upcomingRepeats;
        }
      }
    }

    let updateQuery = supabase.from('app_users').update({ progress: payload });
    if (isUuid) {
      updateQuery = updateQuery.eq('id', user.id);
    } else {
      updateQuery = updateQuery.eq('email', user.email.toLowerCase().trim());
    }

    const { error } = await updateQuery;
    if (error) {
      console.warn('Cloud progress sync notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, lastSyncedAt: payload.lastSyncedAt };
  } catch (err) {
    console.warn('Cloud sync exception:', err);
    return { success: false, error: err.message };
  }
}

// Fetch candidate study progress from Supabase
export async function fetchUserProgressFromCloud(identifier) {
  if (!supabase || !identifier) return null;

  try {
    const isUuid = typeof identifier === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    let query = supabase.from('app_users').select('progress');
    
    if (isUuid) {
      query = query.eq('id', identifier);
    } else {
      query = query.eq('email', String(identifier).toLowerCase().trim());
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) return null;
    return data.progress || null;
  } catch (err) {
    console.warn('Fetch cloud progress error:', err);
    return null;
  }
}

// Diagnostic: fetch full user row (id + progress) by email — for debugging sync issues
export async function fetchUserRowByEmail(email) {
  if (!supabase || !email) return null;
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('id, name, email, status, progress, created_at')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();
    if (error) { console.warn('fetchUserRowByEmail error:', error.message); return null; }
    return data;
  } catch (err) {
    console.warn('fetchUserRowByEmail exception:', err);
    return null;
  }
}
