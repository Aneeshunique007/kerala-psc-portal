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
    console.error('Approve error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, user: data };
}

// Admin: reject or revoke a user
export async function adminRejectUser(userId) {
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('app_users')
    .update({
      status: 'rejected',
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Reject error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, user: data };
}

// Admin: delete user completely
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
