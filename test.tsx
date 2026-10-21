import {
  SYLLABUS_TOPICS,
  QUESTION_BANK,
  ENGLISH_SYLLABUS_TOPICS,
  ENGLISH_QUESTION_BANK,
  PYQ_TOPICS,
  PYQ_QUESTION_BANK
} from './src/data/questions.js';

import {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  adminLogin
} from './src/utils/adminAuth.js';

// Polyfill localStorage for node CLI testing environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) || null,
    setItem: (k: string, v: string) => store.set(k, String(v)),
    removeItem: (k: string) => store.delete(k),
    clear: () => store.clear(),
  } as any;
}

import {
  isSupabaseConfigured,
  adminFetchAllUsers,
  registerUser,
  loginUser,
  checkUserStatus,
  adminApproveUser,
  adminRejectUser,
  adminDeleteUser,
  syncUserProgressToCloud,
  fetchUserProgressFromCloud
} from './src/utils/supabaseClient.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runAllTests() {
  console.log('====================================================');
  console.log('🧪 PSC PORTAL FULL SYSTEM INTEGRATION TEST (test.tsx)');
  console.log('====================================================\n');

  // ── 1. QUESTION DATA & SYLLABUS AUDIT ──
  console.log('1. DATA INTEGRITY & SYLLABUS VERIFICATION:');
  assert(SYLLABUS_TOPICS.length === 18, `Malayalam topics count is 18 (found ${SYLLABUS_TOPICS.length})`);
  assert(QUESTION_BANK.length >= 2700, `Malayalam questions >= 2700 (found ${QUESTION_BANK.length})`);
  assert(ENGLISH_SYLLABUS_TOPICS.length === 28, `English topics count is 28 (found ${ENGLISH_SYLLABUS_TOPICS.length})`);
  assert(ENGLISH_QUESTION_BANK.length >= 4100, `English questions >= 4100 (found ${ENGLISH_QUESTION_BANK.length})`);
  assert(PYQ_TOPICS.length === 14, `PYQ topics count is 14 (found ${PYQ_TOPICS.length})`);
  assert(PYQ_QUESTION_BANK.length >= 10, `PYQ questions loaded (found ${PYQ_QUESTION_BANK.length})`);

  // Verify English topic coverage
  const engTopics = ENGLISH_SYLLABUS_TOPICS.filter(t => t.id !== 'all');
  let under150 = 0;
  engTopics.forEach(t => {
    const count = ENGLISH_QUESTION_BANK.filter(q => q.topic === t.id).length;
    if (count < 150) under150++;
  });
  assert(under150 === 0, `All 27 English topics have >= 150 questions each (under 150: ${under150})`);

  // Schema verification
  let schemaErrors = 0;
  [...QUESTION_BANK.slice(0, 100), ...ENGLISH_QUESTION_BANK.slice(0, 100)].forEach(q => {
    if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length < 4 || typeof q.answer !== 'number') {
      schemaErrors++;
    }
  });
  assert(schemaErrors === 0, `Question sample schema validation errors: ${schemaErrors}`);

  // ── 2. ADMIN AUTHENTICATION TESTS ──
  console.log('\n2. ADMIN AUTHENTICATION & CREDENTIALS:');
  assert(ADMIN_USERNAME === 'crazyaneeshus007@gmail.com', `Admin email matches crazyaneeshus007@gmail.com`);
  assert(ADMIN_PASSWORD === 'faith@123', `Admin password matches configured secret`);
  assert(adminLogin('crazyaneeshus007@gmail.com', 'faith@123') === true, `Admin verification succeeds with correct credentials`);
  assert(adminLogin('wrong@email.com', 'wrongpass') === false, `Admin rejects unauthorized login attempt`);

  // ── 3. SUPABASE CLOUD DATABASE & APPROVAL WORKFLOW TESTS ──
  console.log('\n3. SUPABASE CLOUD BACKEND & APPROVAL WORKFLOW:');
  assert(isSupabaseConfigured === true, `Supabase client is configured with Project URL & API Key`);

  const initialFetch = await adminFetchAllUsers();
  assert(initialFetch.error === null, `Supabase connection active and app_users table is readable`);

  const testEmail = `automated_test_${Date.now()}@example.com`;
  const testPassword = 'test_password_123';
  const testName = 'Automated Verification Tester';

  console.log(`\n  [Step A] Registering new candidate (${testEmail})...`);
  const regRes = await registerUser({
    name: testName,
    email: testEmail,
    password: testPassword
  });
  assert(regRes.success === true, `Registration submitted successfully for ${testEmail}`);
  assert(regRes.user?.status === 'pending', `New candidate initial status is 'pending'`);

  console.log('  [Step B] Candidate attempts login before admin approval...');
  const preApprovalLogin = await loginUser({
    email: testEmail,
    password: testPassword
  });
  assert(preApprovalLogin.success === false, `Login blocked while under verification`);
  assert(preApprovalLogin.isPending === true, `Returns pending verification notice to the candidate`);

  console.log('  [Step C] Checking status via checkUserStatus()...');
  const statusCheck = await checkUserStatus(testEmail);
  assert(statusCheck?.status === 'pending', `Status check correctly confirms 'pending'`);

  console.log('  [Step D] Admin approves candidate from Admin Panel...');
  const approveRes = await adminApproveUser(regRes.user.id);
  assert(approveRes.success === true, `Admin successfully approved candidate ID: ${regRes.user.id}`);
  assert(approveRes.user?.status === 'approved', `Status updated to 'approved'`);

  console.log('  [Step E] Candidate logs in after admin approval...');
  const postApprovalLogin = await loginUser({
    email: testEmail,
    password: testPassword
  });
  assert(postApprovalLogin.success === true, `Candidate successfully logs in after admin approval`);
  assert(postApprovalLogin.user?.name === testName, `User profile retrieved properly`);

  console.log('  [Step F] Multi-Device Cloud Progress Sync & Cross-Device Continuation...');
  const sampleProgress = {
    id: regRes.user.id,
    email: testEmail,
    stats: { correct: 42, total: 45, streak: 8, maxStreak: 12, topicStats: { grammar: { correct: 10, total: 10 } } },
    bookmarkedQuestions: ['mal_2026_q1', 'eng_2026_q8', 'pyq_2025_q14'],
    repeatQueue: [{ id: 'mal_2026_q2', step: 1, nextReview: Date.now() + 3600000 }],
    upcomingRepeats: [],
    questionHistory: [{ id: 'mal_2026_q1', isCorrect: true, timestamp: Date.now() }]
  };

  const syncRes = await syncUserProgressToCloud(sampleProgress);
  assert(syncRes.success === true, `Cloud sync saved bookmarks and stats to Supabase`);

  const fetchedCloudData = await fetchUserProgressFromCloud(regRes.user.id);
  assert(fetchedCloudData !== null, `Cloud progress retrieved successfully from Supabase`);
  assert(fetchedCloudData?.stats?.correct === 42, `Cloud stats match (expected 42 correct, found ${fetchedCloudData?.stats?.correct})`);
  assert(fetchedCloudData?.bookmarkedQuestions?.length === 3, `Cloud bookmarks match (expected 3 bookmarks, found ${fetchedCloudData?.bookmarkedQuestions?.length})`);

  console.log('  [Step G] Simulate login on a second device (Device B)...');
  const deviceBLogin = await loginUser({
    email: testEmail,
    password: testPassword
  });
  assert(deviceBLogin.success === true, `Device B successfully authenticated`);
  assert(deviceBLogin.user?.progress?.stats?.streak === 8, `Device B loaded cloud streak (streak: 8)`);
  assert(deviceBLogin.user?.progress?.bookmarkedQuestions?.includes('mal_2026_q1'), `Device B loaded cloud bookmarks`);

  console.log('  [Step H] Admin rejects/revokes access...');
  const rejectRes = await adminRejectUser(regRes.user.id);
  assert(rejectRes.success === true, `Admin successfully revoked access`);
  assert(rejectRes.user?.status === 'rejected', `Status updated to 'rejected'`);

  const postRejectLogin = await loginUser({
    email: testEmail,
    password: testPassword
  });
  assert(postRejectLogin.success === false && postRejectLogin.isRejected === true, `Candidate is blocked after revocation`);

  console.log('  [Step I] Cleanup test user from cloud database...');
  const deleteRes = await adminDeleteUser(regRes.user.id);
  assert(deleteRes.success === true, `Temporary test user deleted cleanly`);

  // ── FINAL SUMMARY ──
  console.log('\n====================================================');
  console.log(`📊 FINAL TEST REPORT: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL SYSTEMS, DATA, AUTH & CLOUD APPROVAL TESTS PASSED!\n');
    process.exit(0);
  }
}

runAllTests().catch(err => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
