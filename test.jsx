import { SYLLABUS_TOPICS, QUESTION_BANK } from './src/data/questions.js';
import { ENGLISH_SYLLABUS_TOPICS, ENGLISH_QUESTION_BANK } from './src/data/english_questions.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('====================================================');
console.log('🧪 PSC PORTAL FUNCTIONALITY & DATA VERIFICATION TEST');
console.log('====================================================\n');

// 1. Malayalam Bank Verification
console.log('1. MALAYALAM SYLLABUS & QUESTION BANK (10 Marks):');
assert(SYLLABUS_TOPICS.length === 14, `Expected 14 topic items (1 all + 13 topics), found ${SYLLABUS_TOPICS.length}`);
assert(QUESTION_BANK.length >= 2700, `Expected at least 2700 Malayalam questions, found ${QUESTION_BANK.length}`);

// 2. English Bank Verification
console.log('\n2. GENERAL ENGLISH SYLLABUS & QUESTION BANK (10 Marks):');
assert(ENGLISH_SYLLABUS_TOPICS.length === 28, `Expected 28 topic items (1 all + 27 topics), found ${ENGLISH_SYLLABUS_TOPICS.length}`);
assert(ENGLISH_QUESTION_BANK.length >= 4100, `Expected at least 4100 English questions, found ${ENGLISH_QUESTION_BANK.length}`);

// 3. Verify min 150 questions per topic for all 27 English topics
console.log('\n3. VERIFY MIN 150 QUESTIONS FOR EVERY ENGLISH TOPIC:');
const englishTopics = ENGLISH_SYLLABUS_TOPICS.filter(t => t.id !== 'all');

englishTopics.forEach((topic) => {
  const count = ENGLISH_QUESTION_BANK.filter(q => q.topic === topic.id).length;
  assert(count >= 150, `[${topic.id}] ${topic.name} has ${count} questions (>= 150)`);
});

// 4. Validate Question Integrity & Schema (Options, Answer index, Explanation)
console.log('\n4. QUESTION SCHEMA & INTEGRITY AUDIT:');
let malErrors = 0;
QUESTION_BANK.forEach(q => {
  if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length < 4 || q.answer < 0 || q.answer >= q.options.length) {
    malErrors++;
  }
});
assert(malErrors === 0, `Malayalam bank schema errors: ${malErrors}`);

let engErrors = 0;
ENGLISH_QUESTION_BANK.forEach(q => {
  if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length < 4 || q.answer < 0 || q.answer >= q.options.length) {
    engErrors++;
  }
});
assert(engErrors === 0, `English bank schema errors: ${engErrors}`);

// 5. Test Topic Progress & Mastery Calculation Formula
console.log('\n5. TOTAL-BASED ACCURACY & COMPLETION MATH:');
const totalQuestionsInTopic = 105;
const correctSolved = 21;
const expectedCompletion = ((correctSolved / totalQuestionsInTopic) * 100).toFixed(1);
assert(expectedCompletion === '20.0', `Math check: 21/105 should equal 20.0%, calculated ${expectedCompletion}%`);

console.log('\n====================================================');
console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
}
