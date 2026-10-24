// -------------------------------------------------------------
// CENTRAL QUESTION BANK & SYLLABUS CONFIGURATION
// -------------------------------------------------------------

// 1. JSON Data Imports
import malayalamQuestions from './malayalam_questions.json';
import englishQuestions from './english_questions.json';
import pyq2021Questions from './pyq_2021_questions.json';
import pyq2022Questions from './pyq_2022_questions.json';
import pyq2023Questions from './pyq_2023_questions.json';
import pyq2024Questions from './pyq_2024_questions.json';
import pyq2025Questions from './pyq_2025_questions.json';
import pyq2026Questions from './pyq_2026_questions.json';
import currentAffairsQuestions from './current_affairs_questions.json';

// -------------------------------------------------------------
// 2. Syllabus & Topic Taxonomy Definitions
// -------------------------------------------------------------

// Part V: മലയാളം (Malayalam Language & Literature)
export const SYLLABUS_TOPICS = [
  { id: 'all', name: 'All Topics (Full Mock)', icon: '🎯', desc: 'Random questions across entire 10-mark syllabus', color: '#6366f1' },
  { id: 'ottapadam', name: 'ഒറ്റപ്പദം', icon: '📝', desc: 'Single word substitution for phrases (ഒറ്റപ്പദം)', color: '#3b82f6' },
  { id: 'viparitham', name: 'വിപരീതപദം', icon: '🔄', desc: 'Direct antonyms and opposites (വിപരീതപദം)', color: '#10b981' },
  { id: 'samanapadham', name: 'സമാനപദം', icon: '📖', desc: 'Core synonyms and vocabulary meanings (സമാനപദം)', color: '#8b5cf6' },
  { id: 'paryayam', name: 'പര്യായപദം', icon: '🪶', desc: 'Alternative poetic & classical synonyms (പര്യായപദങ്ങൾ)', color: '#a855f7' },
  { id: 'arthavyathyasam', name: 'ശബ്ദാർത്ഥം / അർത്ഥവ്യത്യാസം', icon: '🔍', desc: 'Subtle semantic differences & definitions (ശബ്ദാർത്ഥം / അർത്ഥവ്യത്യാസം)', color: '#06b6d4' },
  { id: 'shaylikal', name: 'ശൈലികളും പഴഞ്ചൊല്ലുകളും', icon: '💡', desc: 'Malayalam idioms, phrases and proverbs (ശൈലികൾ & പഴഞ്ചൊല്ലുകൾ)', color: '#f59e0b' },
  { id: 'pirichezhuthal', name: 'പിരിച്ചെഴുതുക', icon: '✂️', desc: 'Splitting combined Malayalam words (പിരിച്ചെഴുത്ത്)', color: '#ec4899' },
  { id: 'sandhi', name: 'സന്ധി', icon: '🧬', desc: 'Identification of Agama, Adesha, Lopa & Dvitva sandhi (സന്ധി നിയമങ്ങൾ)', color: '#d946ef' },
  { id: 'cherkkayzhuthuka', name: 'ചേർത്തെഴുതുക', icon: '🔗', desc: 'Joining words with correct morphological junction (ചേർത്തെഴുതുക)', color: '#14b8a6' },
  { id: 'padashuddhi', name: 'പദശുദ്ധി', icon: '✨', desc: 'Spotting correct and pure Malayalam spellings (പദശുദ്ധി)', color: '#2dd4bf' },
  { id: 'vakyashuddhi', name: 'വാക്യശുദ്ധി', icon: '📐', desc: 'Grammatically flawless sentence identification (വാക്യശുദ്ധി)', color: '#84cc16' },
  { id: 'lingam', name: 'എതിർലിംഗം', icon: '👥', desc: 'Masculine, feminine & opposite gender forms (ലിംഗം / എതിർലിംഗം)', color: '#f43f5e' },
  { id: 'vachanam', name: 'വചനം', icon: '🔢', desc: 'Singular and plural word forms (വചനം)', color: '#fb7185' },
  { id: 'krithikal', name: 'കൃതികളും കഥാപാത്രങ്ങളും', icon: '📚', desc: 'Famous Malayalam literary works, authors & characters (കൃതികൾ & കഥാപാത്രങ്ങൾ)', color: '#eab308' },
  { id: 'varikal', name: 'കാവ്യവരികളും കവികളും', icon: '📜', desc: 'Famous poetic verses and classical lines (കാവ്യവരികളും കവികളും)', color: '#ca8a04' },
  { id: 'paribhasha', name: 'പരിഭാഷ', icon: '🌐', desc: 'English-to-Malayalam administrative terms and idioms (പരിഭാഷ)', color: '#0ea5e9' },
  { id: 'ghadakapadam', name: 'ഘടകപദം', icon: '🧩', desc: 'Sentence connectors and compound word forms (ഘടകപദം)', color: '#64748b' },
  { id: 'samasam', name: 'സമാസം', icon: '🧩', desc: 'Malayalam compound classifications and meanings (സമാസം)', color: '#6366f1' }
];

// Part IV: General English (Grammar & Vocabulary)
export const ENGLISH_SYLLABUS_TOPICS = [
  {
    "id": "all",
    "name": "All English Topics (Mock)",
    "icon": "🎯",
    "desc": "Random practice across entire 10-mark English syllabus",
    "color": "#6366f1",
    "marks": "10 Marks",
    "section": "General English (10 Marks)",
    "sectionMarks": "10 Marks"
  },
  {
    "id": "types_of_sentences",
    "name": "Types of Sentences & Interchange",
    "icon": "🔄",
    "desc": "Simple, compound, complex, assertive & negative conversions",
    "color": "#3b82f6",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "parts_of_speech",
    "name": "Different Parts of Speech",
    "icon": "🏷️",
    "desc": "Identifying nouns, verbs, adjectives, adverbs in context",
    "color": "#8b5cf6",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "subject_verb_agreement",
    "name": "Subject-Verb Agreement (Concord)",
    "icon": "🤝",
    "desc": "Singular/plural rules, collective nouns, compound subjects",
    "color": "#10b981",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "articles",
    "name": "Articles (Definite & Indefinite)",
    "icon": "🅰️",
    "desc": "Rules of a, an, the, and omission of articles",
    "color": "#f59e0b",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "modal_auxiliaries",
    "name": "Primary & Modal Auxiliary Verbs",
    "icon": "⚡",
    "desc": "Can, could, may, might, must, should, ought to, used to",
    "color": "#ec4899",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "question_tags",
    "name": "Question Tags",
    "icon": "❓",
    "desc": "Affirmative/negative tags, imperatives, special pronoun tags",
    "color": "#06b6d4",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "infinitives_gerunds",
    "name": "Infinitives and Gerunds",
    "icon": "🏊",
    "desc": "To-infinitives, bare infinitives, gerundial nouns",
    "color": "#14b8a6",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "tenses",
    "name": "Tenses",
    "icon": "⏳",
    "desc": "Present, past, future tenses, perfect & continuous forms",
    "color": "#84cc16",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "conditional_sentences",
    "name": "Tenses in Conditional Sentences",
    "icon": "🔀",
    "desc": "Zero, Type 1, Type 2, and Type 3 conditional clauses",
    "color": "#f43f5e",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "prepositions",
    "name": "Prepositions",
    "icon": "📍",
    "desc": "Time, place, direction prepositions & fixed prepositions",
    "color": "#a855f7",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "correlatives",
    "name": "The Use of Correlatives",
    "icon": "🔗",
    "desc": "Neither...nor, either...or, scarcely...when, no sooner...than",
    "color": "#eab308",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "reported_speech",
    "name": "Direct and Indirect Speech",
    "icon": "💬",
    "desc": "Statements, questions, requests, imperative conversions",
    "color": "#0ea5e9",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "active_passive_voice",
    "name": "Active and Passive Voice",
    "icon": "📢",
    "desc": "Voice transformations across all tenses & interrogatives",
    "color": "#64748b",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "sentence_correction",
    "name": "Correction of Sentences",
    "icon": "✨",
    "desc": "Error spotting, redundant words, dangling modifiers",
    "color": "#10b981",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "degrees_of_comparison",
    "name": "Degrees of Comparison",
    "icon": "📈",
    "desc": "Positive, comparative, and superlative degree transformations",
    "color": "#6366f1",
    "marks": "5 Marks",
    "section": "Part IV(i): English Grammar (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "singular_plural_gender_collective",
    "name": "Number, Gender & Collective Nouns",
    "icon": "👥",
    "desc": "Irregular plurals, masculine/feminine, group nouns",
    "color": "#f97316",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "word_formation_affixes",
    "name": "Word Formation, Prefixes & Suffixes",
    "icon": "🧱",
    "desc": "Roots, negative prefixes, adjective/noun derivations",
    "color": "#06b6d4",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "compound_words_eng",
    "name": "Compound Words",
    "icon": "🧩",
    "desc": "Noun+Noun, Verb+Noun, Gerund+Noun combinations",
    "color": "#8b5cf6",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "synonyms_eng",
    "name": "Synonyms",
    "icon": "📖",
    "desc": "Most frequently asked synonyms and word meanings",
    "color": "#3b82f6",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "antonyms_eng",
    "name": "Antonyms",
    "icon": "🔄",
    "desc": "Direct opposites and contrasting vocabulary",
    "color": "#ef4444",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "phrasal_verbs",
    "name": "Phrasal Verbs",
    "icon": "🏃",
    "desc": "Verb + preposition combinations and idiomatic usages",
    "color": "#14b8a6",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "foreign_words",
    "name": "Foreign Words and Phrases",
    "icon": "🌍",
    "desc": "Latin, French, and legal phrases commonly used in English",
    "color": "#f59e0b",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "one_word_substitutes_eng",
    "name": "One Word Substitutes",
    "icon": "📝",
    "desc": "Single word representations for complex concepts",
    "color": "#a855f7",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "confused_words",
    "name": "Words Often Confused",
    "icon": "🤔",
    "desc": "Homophones, homonyms, and commonly mistaken word pairs",
    "color": "#ec4899",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "spelling_test_eng",
    "name": "Spelling Test",
    "icon": "✍️",
    "desc": "Spotting correct spellings of tricky English words",
    "color": "#10b981",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "idioms_meanings",
    "name": "Idioms and their Meanings",
    "icon": "💡",
    "desc": "Popular figurative idioms, proverbs, and expressions",
    "color": "#eab308",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  },
  {
    "id": "abbreviations",
    "name": "Abbreviations and Expansions",
    "icon": "🔤",
    "desc": "National and international organizations, terms & acronyms",
    "color": "#0ea5e9",
    "marks": "5 Marks",
    "section": "Part IV(ii): Vocabulary (5 Marks)",
    "sectionMarks": "5 Marks"
  }
];

// PYQ (Previous Year Questions Subject Blueprint)
export const PYQ_TOPICS = [
  {
    id: 'all',
    name: 'All Topics (Full Mock)',
    icon: '🎯',
    desc: 'Random questions across all topics for the selected year',
    color: '#6366f1'
  },
  // Part I: പൊതുവിജ്ഞാനം (50 Marks)
  {
    id: 'pq_history',
    name: 'ചരിത്രം (History)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🏛️',
    desc: 'Kerala, Indian, and World History questions',
    color: '#ec4899'
  },
  {
    id: 'pq_geography',
    name: 'ഭൂമിശാസ്ത്രം (Geography)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🌍',
    desc: 'Physical, Indian, and Kerala Geography questions',
    color: '#06b6d4'
  },
  {
    id: 'pq_economics',
    name: 'ധനതത്വശാസ്ത്രം (Economics)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '📈',
    desc: 'Indian Economy, Five-Year Plans, NITI Aayog, Banking & Agriculture',
    color: '#10b981'
  },
  {
    id: 'pq_constitution',
    name: 'ഇന്ത്യൻ ഭരണഘടന (Constitution)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '⚖️',
    desc: 'Preamble, Fundamental Rights & Duties, Organs of Govt & Amendments',
    color: '#84cc16'
  },
  {
    id: 'pq_kerala_governance',
    name: 'കേരളം ഭരണസംവിധാനങ്ങൾ (Kerala Governance)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🏢',
    desc: 'State Civil Services, Commissions, Welfare & Employment Schemes',
    color: '#f97316'
  },
  {
    id: 'pq_science',
    name: 'ജനറൽ സയൻസ് (General Science)',
    marks: '12 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🔬',
    desc: 'Biology & Public Health (6M), Physics (3M), Chemistry (3M)',
    color: '#a855f7'
  },
  {
    id: 'pq_arts_sports',
    name: 'കല, കായികം, സംസ്കാരം (Arts & Sports)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🎨',
    desc: 'Kerala Arts, Sports & Olympics, Malayalam Cinema & Awards',
    color: '#e11d48'
  },
  {
    id: 'pq_computer',
    name: 'കമ്പ്യൂട്ടർ അടിസ്ഥാന വിവരങ്ങൾ (Computer)',
    marks: '3 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '💻',
    desc: 'Hardware, Software, Internet, HTML, Cyber Crimes & IT Act',
    color: '#0284c7'
  },
  {
    id: 'pq_acts_laws',
    name: 'സുപ്രധാന നിയമങ്ങൾ (Important Acts)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '📜',
    desc: 'RTI Act, Consumer Protection, Human Rights, Women & Child (POCSO) Laws',
    color: '#d97706'
  },
  // Part II: ആനുകാലിക വിഷയങ്ങൾ (20 Marks)
  {
    id: 'pq_current_affairs',
    name: 'ആനുകാലിക വിഷയങ്ങൾ (Current Affairs)',
    marks: '20 Marks',
    section: 'Part II: ആനുകാലിക വിഷയങ്ങൾ',
    sectionMarks: '20 Marks',
    icon: '📰',
    desc: 'National, International & Kerala Current Events, Awards & Sports',
    color: '#eab308'
  },
  // Part III: ലഘുഗണിതവും മാനസിക ശേഷിയും (10 Marks)
  {
    id: 'pq_maths',
    name: 'കണക്കും റീസണിംഗും (Maths & Mental Ability)',
    marks: '10 Marks',
    section: 'Part III: കണക്കും റീസണിംഗും',
    sectionMarks: '10 Marks',
    icon: '🔢',
    desc: 'Arithmetic (5M) and Mental Ability, Series & Reasoning (5M)',
    color: '#f59e0b'
  },
  // Part IV: General English (10 Marks)
  {
    id: 'pq_english',
    name: 'General English',
    marks: '10 Marks',
    section: 'Part IV: General English',
    sectionMarks: '10 Marks',
    icon: '🇬🇧',
    desc: 'English Grammar (5M) & Vocabulary (5M)',
    color: '#10b981'
  },
  // Part V: മലയാളം (10 Marks)
  {
    id: 'pq_malayalam',
    name: 'മലയാളം (Malayalam Language)',
    marks: '10 Marks',
    section: 'Part V: മലയാളം',
    sectionMarks: '10 Marks',
    icon: '📚',
    desc: 'Official Malayalam Grammar, Vocabulary & Literature (10M)',
    color: '#3b82f6'
  }
];

// Part II: Current Affairs (Monthly Capsules & Special Guides)
export const CURRENT_AFFAIRS_TOPICS = [
  {
    id: 'all',
    name: 'All Current Affairs (2026 Mock)',
    icon: '🎯',
    desc: 'Practice across all 2026 monthly capsules & revision guides (2,300 Qs)',
    color: '#6366f1',
    section: '2026 Current Affairs (2,300 Qs)',
    sectionMarks: '2,300 Qs'
  },
  {
    id: 'ca_sep',
    qp_code: 'SEP-CA/2026',
    name: 'സെപ്റ്റംബർ 2026 (September)',
    icon: '📅',
    desc: 'Current events, appointments, sports & awards from September 2026',
    color: '#ec4899',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_aug',
    qp_code: 'AUG-CA/2026',
    name: 'ഓഗസ്റ്റ് 2026 (August)',
    icon: '📅',
    desc: 'Current events, appointments, sports & awards from August 2026',
    color: '#f59e0b',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_jul',
    qp_code: 'JUL-CA/2026',
    name: 'ജൂലൈ 2026 (July)',
    icon: '📅',
    desc: 'Current events, appointments, sports & awards from July 2026',
    color: '#10b981',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_jun',
    qp_code: 'JUN-CA/2026',
    name: 'ജൂൺ 2026 (June)',
    icon: '📅',
    desc: 'Current events, appointments, sports & awards from June 2026',
    color: '#06b6d4',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_may',
    qp_code: 'MAY-CA/2026',
    name: 'മേയ് 2026 (May)',
    icon: '📅',
    desc: 'Current events, appointments, sports & awards from May 2026',
    color: '#8b5cf6',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_apr',
    qp_code: 'APR-CA/2026',
    name: 'ഏപ്രിൽ 2026 (April)',
    icon: '📅',
    desc: 'Current events, appointments, sports & awards from April 2026',
    color: '#14b8a6',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_mar',
    qp_code: 'MAR-CA/2026',
    name: 'മാർച്ച് 2026 (March)',
    icon: '📅',
    desc: 'Current events, appointments, sports & awards from March 2026',
    color: '#84cc16',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_feb',
    qp_code: 'FEB-CA/2026',
    name: 'ഫെബ്രുവരി 2026 (February)',
    icon: '📅',
    desc: 'Current events, appointments, sports & awards from February 2026',
    color: '#f43f5e',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_jan',
    qp_code: 'JAN-CA/2026',
    name: 'ജനുവരി 2026 (January)',
    icon: '📅',
    desc: 'Current events, appointments, sports & awards from January 2026',
    color: '#3b82f6',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_guide',
    qp_code: 'CA-GUIDE/2026',
    name: 'കറന്റ് അഫയേഴ്‌സ് ഗൈഡ് (Special Capsule)',
    icon: '📘',
    desc: 'High-priority appointments, governance & special state capsule',
    color: '#eab308',
    section: 'Special Revision Capsules',
    sectionMarks: '50 Qs'
  }
];

// -------------------------------------------------------------
// 3. Question Bank Exports
// -------------------------------------------------------------

export const QUESTION_BANK = Array.isArray(malayalamQuestions) ? malayalamQuestions : [];

export const ENGLISH_QUESTION_BANK = Array.isArray(englishQuestions) ? englishQuestions : [];

export const CURRENT_AFFAIRS_QUESTION_BANK = Array.isArray(currentAffairsQuestions) ? currentAffairsQuestions : [];

export const PYQ_YEARS = [
  { id: '2026', label: '2026 Exam Papers', count: 1944 + (Array.isArray(currentAffairsQuestions) ? currentAffairsQuestions.length : 0) },
  { id: '2025', label: '2025 Exam Papers', count: 2956 },
  { id: '2024', label: '2024 Exam Papers', count: 2711 },
  { id: '2023', label: '2023 Exam Papers', count: 2235 },
  { id: '2022', label: '2022 Exam Papers', count: 879 },
  { id: '2021', label: '2021 Exam Papers', count: 593 }
];

export const PYQ_QUESTION_BANK = [
  ...(Array.isArray(currentAffairsQuestions) ? currentAffairsQuestions.map(q => ({ ...q, year: '2026' })) : []),
  ...(Array.isArray(pyq2026Questions) ? pyq2026Questions.map(q => ({ ...q, year: '2026' })) : []),
  ...(Array.isArray(pyq2025Questions) ? pyq2025Questions.map(q => ({ ...q, year: '2025' })) : []),
  ...(Array.isArray(pyq2024Questions) ? pyq2024Questions.map(q => ({ ...q, year: '2024' })) : []),
  ...(Array.isArray(pyq2023Questions) ? pyq2023Questions.map(q => ({ ...q, year: '2023' })) : []),
  ...(Array.isArray(pyq2022Questions) ? pyq2022Questions.map(q => ({ ...q, year: '2022' })) : []),
  ...(Array.isArray(pyq2021Questions) ? pyq2021Questions.map(q => ({ ...q, year: '2021' })) : [])
];
