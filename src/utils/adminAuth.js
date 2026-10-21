// ─── Admin Credentials ──────────────────────────────────────────────────────
// Change ADMIN_PASSWORD to something secret. This is a front-end only app,
// so store it here. It's obfuscated enough for a private study portal.
export const ADMIN_USERNAME = 'crazyaneeshus007@gmail.com';
export const ADMIN_PASSWORD = 'faith@123';

// ─── LocalStorage Keys ───────────────────────────────────────────────────────
const KEYS = {
  INVITE_CODES: 'psc_invite_codes',
  APPROVED_USERS: 'psc_approved_users',
  ADMIN_SESSION: 'psc_admin_session',
};

// ─── Invite Codes ─────────────────────────────────────────────────────────────
export function getInviteCodes() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.INVITE_CODES) || '[]');
  } catch {
    return [];
  }
}

function saveInviteCodes(codes) {
  localStorage.setItem(KEYS.INVITE_CODES, JSON.stringify(codes));
}

export function generateInviteCode(label = '', maxUses = 1) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let code = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  const newCode = {
    id: `code_${Date.now()}`,
    code,
    label: label || 'Invite',
    maxUses,
    usedCount: 0,
    usedBy: [],
    createdAt: Date.now(),
    active: true,
  };
  const codes = getInviteCodes();
  codes.unshift(newCode);
  saveInviteCodes(codes);
  return newCode;
}

export function validateInviteCode(inputCode) {
  const codes = getInviteCodes();
  const normalized = inputCode.trim().toUpperCase().replace(/\s/g, '');
  const found = codes.find(
    (c) => c.code === normalized && c.active && c.usedCount < c.maxUses
  );
  return found || null;
}

export function consumeInviteCode(codeId, userName) {
  const codes = getInviteCodes();
  const idx = codes.findIndex((c) => c.id === codeId);
  if (idx === -1) return false;
  codes[idx].usedCount += 1;
  codes[idx].usedBy.push({ name: userName, at: Date.now() });
  if (codes[idx].usedCount >= codes[idx].maxUses) {
    codes[idx].active = false;
  }
  saveInviteCodes(codes);
  return true;
}

export function deleteInviteCode(codeId) {
  const codes = getInviteCodes().filter((c) => c.id !== codeId);
  saveInviteCodes(codes);
}

export function toggleInviteCode(codeId) {
  const codes = getInviteCodes();
  const idx = codes.findIndex((c) => c.id === codeId);
  if (idx !== -1) codes[idx].active = !codes[idx].active;
  saveInviteCodes(codes);
}

// ─── Approved Users Registry ──────────────────────────────────────────────────
export function getApprovedUserIds() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.APPROVED_USERS) || '[]');
  } catch {
    return [];
  }
}

export function approveUser(userId) {
  const list = getApprovedUserIds();
  if (!list.includes(userId)) {
    list.push(userId);
    localStorage.setItem(KEYS.APPROVED_USERS, JSON.stringify(list));
  }
}

export function revokeUser(userId) {
  const list = getApprovedUserIds().filter((id) => id !== userId);
  localStorage.setItem(KEYS.APPROVED_USERS, JSON.stringify(list));
}

export function isUserApproved(userId) {
  return getApprovedUserIds().includes(userId);
}

// ─── Admin Session ─────────────────────────────────────────────────────────────
export function adminLogin(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem(KEYS.ADMIN_SESSION, '1');
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(KEYS.ADMIN_SESSION);
}

export function isAdminLoggedIn() {
  return localStorage.getItem(KEYS.ADMIN_SESSION) === '1';
}
