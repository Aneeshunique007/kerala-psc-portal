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

// PYQ (Previous Year Questions Subject Blueprint — 23 LDC Syllabus Topics)
export const PYQ_TOPICS = [
  {
    id: 'all',
    name: 'All Topics (Excl. Maths)',
    icon: '🎯',
    desc: 'Random questions across all topics for the selected year (Maths available in separate tab)',
    color: '#6366f1'
  },
  // Part I: പൊതുവിജ്ഞാനം (50 Marks) — (i) ചരിത്രം (5 Marks)
  {
    id: 'pq_kerala_history',
    name: 'കേരള ചരിത്രം (Kerala History)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🌴',
    desc: 'യൂറോപ്യന്മാരുടെ വരവ്, തിരുവിതാംകൂർ ചരിത്രം, നവോത്ഥാന പ്രസ്ഥാനങ്ങൾ, ഐക്യകേരളം',
    color: '#ec4899',
    subtopics: [
      'യൂറോപ്യന്മാരുടെ വരവും സംഭാവനകളും',
      'മാർത്താണ്ഡവർമ്മ മുതൽ ശ്രീചിത്തിരതിരുനാൾ വരെയുള്ള തിരുവിതാംകൂർ ചരിത്രം',
      'സാമൂഹിക, മത, നവോത്ഥാന പ്രസ്ഥാനങ്ങൾ',
      'കേരളത്തിലെ ദേശീയ പ്രസ്ഥാനങ്ങൾ',
      'ചരിത്രത്തിന്റെ സാഹിത്യ സ്രോതസ്സുകൾ',
      'ഐക്യകേരള പ്രസ്ഥാനം',
      '1956-ന് ശേഷമുള്ള സാമൂഹ്യ-രാഷ്ട്രീയ ചരിത്രം'
    ]
  },
  {
    id: 'pq_indian_history',
    name: 'ഇന്ത്യാ ചരിത്രം (Indian History)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🏛️',
    desc: 'ബ്രിട്ടീഷ് ആധിപത്യം, ഒന്നാം സ്വാതന്ത്ര്യസമരം, INC, ഗാന്ധിജിയും സ്വാതന്ത്ര്യസമരവും',
    color: '#f43f5e',
    subtopics: [
      'ബ്രിട്ടീഷ് ആധിപത്യം & ഒന്നാം സ്വാതന്ത്ര്യസമരം',
      'ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസ്സ് & സ്വദേശി പ്രസ്ഥാനം',
      'സാമൂഹ്യപരിഷ്കരണ പ്രസ്ഥാനങ്ങൾ & പത്രങ്ങൾ',
      'സ്വാതന്ത്ര്യസമരകാലത്തെ സാഹിത്യവും കലയും',
      'മഹാത്മാഗാന്ധിയും സ്വാതന്ത്ര്യസമരവും',
      'സ്വാതന്ത്ര്യാനന്തര കാലഘട്ടം & പുനഃസംഘടന',
      'ശാസ്ത്ര, വിദ്യാഭ്യാസ പുരോഗതി & വിദേശനയം'
    ]
  },
  {
    id: 'pq_world_history',
    name: 'ലോക ചരിത്രം (World History)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🌐',
    desc: 'ഇംഗ്ലണ്ട്, അമേരിക്കൻ, ഫ്രഞ്ച്, റഷ്യൻ, ചൈനീസ് വിപ്ലവങ്ങൾ, ഐക്യരാഷ്ട്രസഭ',
    color: '#d946ef',
    subtopics: [
      'ഇംഗ്ലണ്ടിലെ മഹത്തായ വിപ്ലവം (Glorious Rev.)',
      'അമേരിക്കൻ സ്വാതന്ത്ര്യ സമരം',
      'ഫ്രഞ്ച് വിപ്ലവം & റഷ്യൻ വിപ്ലവം',
      'ചൈനീസ് വിപ്ലവം',
      'രണ്ടാം ലോകമഹായുദ്ധാനന്തര രാഷ്ട്രീയം',
      'ഐക്യരാഷ്ട്രസഭ & അന്താരാഷ്ട്ര സംഘടനകൾ'
    ]
  },
  // (ii) ഭൂമിശാസ്ത്രം (5 Marks)
  {
    id: 'pq_basic_geography',
    name: 'ഭൂമിശാസ്ത്രം - അടിസ്ഥാന തത്ത്വങ്ങൾ (Basic Geography)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🌍',
    desc: 'ഭൂമിയുടെ ഘടന, അന്തരീക്ഷം, മർദ്ദവും കാറ്റും, ടോപ്പോഗ്രാഫിക് മാപ്പുകൾ, സമുദ്രങ്ങൾ',
    color: '#06b6d4',
    subtopics: [
      'ഭൂമിയുടെ ഘടന, അന്തരീക്ഷം, ശിലകൾ',
      'ഭൗമോപരിതലം, മർദ്ദവും കാറ്റും, താപനില',
      'ഋതുക്കൾ, ആഗോളതാപനം, മലിനീകരണം',
      'ടോപ്പോഗ്രാഫിക് മാപ്പുകൾ & ചിഹ്നങ്ങൾ',
      'വിദൂരസംവേദനം & GIS',
      'മഹാസമുദ്രങ്ങൾ, സമുദ്രചലനങ്ങൾ, ഭൂഖണ്ഡങ്ങൾ',
      'ലോകരാഷ്ട്രങ്ങളും സവിശേഷതകളും'
    ]
  },
  {
    id: 'pq_indian_geography',
    name: 'ഇന്ത്യൻ ഭൂമിശാസ്ത്രം (Indian Geography)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🗺️',
    desc: 'ഉത്തരപർവ്വത മേഖല, നദികൾ, ഉപദ്വീപീയ പീഠഭൂമി, കൃഷി, ധാതുക്കൾ, ഗതാഗതം',
    color: '#0ea5e9',
    subtopics: [
      'ഭൂപ്രകൃതി & സംസ്ഥാനങ്ങളുടെ സവിശേഷതകൾ',
      'ഉത്തരപർവ്വത മേഖല, നദികൾ, ഉത്തരസമതലം',
      'ഉപദ്വീപീയ പീഠഭൂമി, തീരദേശം',
      'കാലാവസ്ഥ & സ്വാഭാവിക സസ്യപ്രകൃതി',
      'കൃഷി, ധാതുക്കൾ & വ്യവസായങ്ങൾ',
      'ഊർജ്ജസ്രോതസ്സുകൾ',
      'റോഡ്, ജല, റെയിൽ, വ്യോമ ഗതാഗതം'
    ]
  },
  {
    id: 'pq_kerala_geography',
    name: 'കേരള ഭൂമിശാസ്ത്രം (Kerala Geography)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🏞️',
    desc: 'ഭൂപ്രകൃതി, ജില്ലകൾ, നദികൾ, വന്യജീവി & ഗവേഷണ സ്ഥാപനങ്ങൾ, ഊർജ്ജം, ഗതാഗതം',
    color: '#14b8a6',
    subtopics: [
      'ഭൂപ്രകൃതി & ജില്ലകളുടെ സവിശേഷതകൾ',
      'നദികൾ, കാലാവസ്ഥ, സസ്യപ്രകൃതി',
      'വന്യജീവി & ഗവേഷണ സ്ഥാപനങ്ങൾ',
      'ധാതുക്കളും വ്യവസായവും',
      'ഊർജ്ജസ്രോതസ്സുകൾ',
      'ഗതാഗത സംവിധാനങ്ങൾ'
    ]
  },
  // (iii) ധനതത്ത്വശാസ്ത്രം (5 Marks)
  {
    id: 'pq_economics',
    name: 'ധനതത്ത്വശാസ്ത്രം (Economics)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '📈',
    desc: 'പഞ്ചവത്സര പദ്ധതികൾ, നീതി ആയോഗ്, LPG നയങ്ങൾ, ധനകാര്യ സ്ഥാപനങ്ങൾ, ഹരിതവിപ്ലവം',
    color: '#10b981',
    subtopics: [
      'ഇന്ത്യൻ സാമ്പത്തിക രംഗം & പഞ്ചവത്സര പദ്ധതികൾ',
      'പ്ലാനിംഗ് കമ്മീഷൻ & നീതി ആയോഗ് (NITI Aayog)',
      'നവസാമ്പത്തിക പരിഷ്കാരങ്ങൾ (LPG നയങ്ങൾ)',
      'പ്രധാന ധനകാര്യ സ്ഥാപനങ്ങൾ',
      'കാർഷിക വിളകളും ധാതുക്കളും',
      'ഹരിതവിപ്ലവം (Green Revolution)'
    ]
  },
  // (iv) ഇന്ത്യൻ ഭരണഘടന (5 Marks)
  {
    id: 'pq_constitution',
    name: 'ഇന്ത്യൻ ഭരണഘടന (Indian Constitution)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '⚖️',
    desc: 'ആമുഖം, മൗലികാവകാശങ്ങൾ, മൗലിക കടമകൾ, ഭേദഗതികൾ, പഞ്ചായത്തീരാജ്, ഭരണഘടനാ സ്ഥാപനങ്ങൾ',
    color: '#84cc16',
    subtopics: [
      'ഭരണഘടനാ നിർമ്മാണ സമിതി & ആമുഖം',
      'പൗരത്വം, മൗലികാവകാശങ്ങൾ, നിർദ്ദേശക തത്ത്വങ്ങൾ, മൗലിക കടമകൾ',
      'ഗവൺമെന്റിന്റെ ഘടകങ്ങൾ (കാര്യനിർവ്വഹണം, നിയമനിർമ്മാണം, നീതിന്യായം)',
      'പ്രധാന ഭേദഗതികൾ (42, 44, 52, 73, 74, 86, 91) & പഞ്ചായത്തീരാജ്',
      'ഭരണഘടനാ സ്ഥാപനങ്ങളും ചുമതലകളും',
      'യൂണിയൻ ലിസ്റ്റ്, സ്റ്റേറ്റ് ലിസ്റ്റ്, കൺകറന്റ് ലിസ്റ്റ്'
    ]
  },
  // (v) കേരളം - ഭരണവും ഭരണസംവിധാനങ്ങളും (5 Marks)
  {
    id: 'pq_kerala_governance',
    name: 'കേരളം - ഭരണവും ഭരണസംവിധാനങ്ങളും (Kerala Governance)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🏢',
    desc: 'സിവിൽ സർവീസ് & കമ്മീഷനുകൾ, ദുരന്തനിവാരണ അതോറിറ്റി, തൊഴിൽ പദ്ധതികൾ, സാമൂഹ്യക്ഷേമം',
    color: '#f97316',
    subtopics: [
      'കേരള സംസ്ഥാന സിവിൽ സർവീസ് & കമ്മീഷനുകൾ',
      'സാമൂഹിക, സാമ്പത്തിക, വാണിജ്യ ആസൂത്രണം',
      'ദുരന്തനിവാരണ അതോറിറ്റി & തണ്ണീർത്തട സംരക്ഷണം',
      'തൊഴിലും ദേശീയ ഗ്രാമീണ തൊഴിൽ പദ്ധതികളും & ഭൂപരിഷ്കരണങ്ങൾ',
      'സ്ത്രീകൾ, കുട്ടികൾ, വയോജന സംരക്ഷണം',
      'സാമൂഹ്യക്ഷേമവും സാമൂഹ്യ സുരക്ഷിതത്വവും'
    ]
  },
  // (vi) ജീവശാസ്ത്രവും പൊതുജനാരോഗ്യവും (6 Marks)
  {
    id: 'pq_biology',
    name: 'ജീവശാസ്ത്രവും പൊതുജനാരോഗ്യവും (Biology & Public Health)',
    marks: '6 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🧬',
    desc: 'മനുഷ്യശരീരം, ജീവകങ്ങളും അപര്യാപ്തതാ രോഗങ്ങളും, സാംക്രമിക-ജീവിതശൈലീ രോഗങ്ങൾ, പരിസ്ഥിതി',
    color: '#22c55e',
    subtopics: [
      'മനുഷ്യ ശരീരത്തെക്കുറിച്ചുള്ള പൊതു അറിവ്',
      'ജീവകങ്ങളും ധാതുക്കളും - അപര്യാപ്തതാ രോഗങ്ങൾ',
      'സാംക്രമിക രോഗങ്ങളും രോഗകാരികളും',
      'കേരളത്തിലെ ആരോഗ്യക്ഷേമ പ്രവർത്തനങ്ങൾ',
      'ജീവിതശൈലീ രോഗങ്ങൾ & പ്രതിരോധം',
      'അടിസ്ഥാന ആരോഗ്യ വിജ്ഞാനം',
      'പരിസ്ഥിതിയും പരിസ്ഥിതി പ്രശ്നങ്ങളും'
    ]
  },
  // (vii) ഭൗതികശാസ്ത്രം (3 Marks)
  {
    id: 'pq_physics',
    name: 'ഭൗതികശാസ്ത്രം (Physics)',
    marks: '3 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '⚛️',
    desc: 'യൂണിറ്റും അളവുകളും, ചലനം, പ്രകാശം, ശബ്ദം, ബലം, ഗുരുത്വാകർഷണം, താപം, ഊർജ്ജം',
    color: '#a855f7',
    subtopics: [
      'ഭൗതികശാസ്ത്ര ശാഖകൾ, ദ്രവ്യം, യൂണിറ്റും അളവുകളും',
      'ചലനം, ന്യൂട്ടന്റെ നിയമങ്ങൾ, പ്രൊജക്ടൈൽ മോഷൻ, ISRO',
      'പ്രകാശം, ലെൻസ്, ദർപ്പണം, വർണ്ണങ്ങൾ, സ്പെക്ട്രം (IR, UV)',
      'ശബ്ദം, തരംഗങ്ങൾ, പ്രവേഗം, അനുരണനം',
      'ബലം, ഘർഷണം, ദ്രാവകമർദ്ദം, പ്ലവക്ഷമബലം, സാന്ദ്രത',
      'ഗുരുത്വാകർഷണം, ഉപഗ്രഹങ്ങൾ, പലായന പ്രവേഗം, \'g\'',
      'താപം, താപനില, തെർമോമീറ്ററുകൾ, ആർദ്രത',
      'പ്രവൃത്തി, ഊർജ്ജം, പവർ, ഉത്തോലകങ്ങൾ'
    ]
  },
  // (viii) രസതന്ത്രം (3 Marks)
  {
    id: 'pq_chemistry',
    name: 'രസതന്ത്രം (Chemistry)',
    marks: '3 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🧪',
    desc: 'ആറ്റം, തന്മാത്ര, മൂലകങ്ങൾ, ആവർത്തനപ്പട്ടിക, ലോഹസങ്കരങ്ങൾ, ആസിഡും ആൽക്കലിയും, pH മൂല്യം',
    color: '#8b5cf6',
    subtopics: [
      'ആറ്റം, തന്മാത്ര, ദ്രവ്യത്തിന്റെ അവസ്ഥകൾ',
      'രൂപാന്തരത്വം, വാതക നിയമങ്ങൾ, അക്വാറീജിയ',
      'മൂലകങ്ങൾ, ആവർത്തനപ്പട്ടിക',
      'ലോഹങ്ങളും അലോഹങ്ങളും, ലോഹസങ്കരങ്ങൾ',
      'രാസ-ഭൗതിക മാറ്റങ്ങൾ, രാസപ്രവർത്തനങ്ങൾ',
      'ലായനികൾ, മിശ്രിതങ്ങൾ, സംയുക്തങ്ങൾ',
      'ആസിഡും ആൽക്കലിയും, pH മൂല്യം',
      'ആൽക്കലോയിഡുകൾ'
    ]
  },
  // (ix) കല, കായികം, സാഹിത്യം, സംസ്കാരം (5 Marks)
  {
    id: 'pq_arts_culture',
    name: 'കല & സംസ്കാരം (Arts & Culture)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🎨',
    desc: 'കേരളത്തിലെ ദൃശ്യ-ശ്രവ്യ കലകൾ, ആഘോഷങ്ങൾ, ഉത്സവങ്ങൾ, സാംസ്കാരിക കേന്ദ്രങ്ങൾ',
    color: '#e11d48',
    subtopics: [
      'കേരളത്തിലെ പ്രധാന ദൃശ്യ-ശ്രവ്യ കലകൾ',
      'ഉത്ഭവം, വ്യാപനം, പരിശീലന കേന്ദ്രങ്ങൾ',
      'പ്രശസ്തമായ സ്ഥലങ്ങൾ, സ്ഥാപനങ്ങൾ, വ്യക്തികൾ',
      'പ്രധാന ആഘോഷങ്ങൾ, ഉത്സവങ്ങൾ, തീർത്ഥാടന കേന്ദ്രങ്ങൾ',
      'സാംസ്കാരിക കേന്ദ്രങ്ങൾ, സാംസ്കാരിക നായകർ'
    ]
  },
  {
    id: 'pq_sports',
    name: 'കായികം (Sports)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🏆',
    desc: 'കായികതാരങ്ങൾ, അവാർഡുകൾ, ട്രോഫികൾ, ഒളിമ്പിക്സ്, ഏഷ്യൻ & ദേശീയ ഗെയിംസ്',
    color: '#f43f5e',
    subtopics: [
      'പ്രമുഖ കായികതാരങ്ങളും നേട്ടങ്ങളും',
      'അവാർഡുകൾ & ജേതാക്കൾ, പ്രധാന ട്രോഫികൾ',
      'കളിക്കാരുടെ എണ്ണം & പ്രധാന കായിക പദങ്ങൾ',
      'ഒളിമ്പിക്സ് (വേദികൾ, ഇന്ത്യയുടെ പ്രകടനം, പാരാ ഒളിമ്പിക്സ്)',
      'ഏഷ്യൻ ഗെയിംസ്, കോമൺവെൽത്ത്, സാഫ്, ദേശീയ ഗെയിംസ്',
      'ഓരോ രാജ്യത്തിന്റെയും ദേശീയ വിനോദങ്ങൾ'
    ]
  },
  {
    id: 'pq_literature_cinema',
    name: 'സാഹിത്യം & സിനിമ (Literature & Cinema)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '🎬',
    desc: 'സാഹിത്യ പ്രസ്ഥാനങ്ങൾ, കൃതികൾ, തൂലികാനാമങ്ങൾ, പത്രപ്രവർത്തന ചരിത്രം, മലയാള സിനിമ',
    color: '#fb7185',
    subtopics: [
      'പ്രധാന സാഹിത്യ പ്രസ്ഥാനങ്ങൾ, ആദ്യകൃതികൾ, കർത്താക്കൾ',
      'എഴുത്തുകാരും തൂലികാനാമങ്ങളും, പ്രധാന കഥാപാത്രങ്ങൾ',
      'പ്രശസ്തമായ വരികളും എഴുത്തുകാരും',
      'മലയാള പത്രപ്രവർത്തന ചരിത്രം',
      'സാഹിത്യ അവാർഡുകൾ & ജ്ഞാനപീഠം നേടിയ മലയാളികൾ',
      'മലയാള സിനിമ (ഉത്ഭവം, നാഴികക്കല്ലുകൾ, ദേശീയ അവാർഡുകൾ)'
    ]
  },
  // (x) കമ്പ്യൂട്ടർ - അടിസ്ഥാന വിവരങ്ങൾ (3 Marks)
  {
    id: 'pq_computer',
    name: 'കമ്പ്യൂട്ടർ - അടിസ്ഥാന വിവരങ്ങൾ (Computer)',
    marks: '3 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '💻',
    desc: 'Hardware, Software, Networks, Internet, HTML, Cyber Crimes & IT Act',
    color: '#0284c7',
    subtopics: [
      'Hardware: Input/Output Devices, Memory (Primary/Secondary)',
      'Software: System & Application, OS, Office Packages',
      'Programming Basics: Instructions, Control transfer',
      'Networks: LAN, WAN, MAN, Network Devices (Router, Hub)',
      'Internet: WWW, Email, Search Engines, Social Media, HTML',
      'Cyber Laws: Cyber Crimes, IT Act (Awareness level)'
    ]
  },
  // (xi) സുപ്രധാന നിയമങ്ങൾ (5 Marks)
  {
    id: 'pq_acts_laws',
    name: 'സുപ്രധാന നിയമങ്ങൾ (Important Acts)',
    marks: '5 Marks',
    section: 'Part I: പൊതുവിജ്ഞാനം',
    sectionMarks: '50 Marks',
    icon: '📜',
    desc: 'RTI Act 2005, Consumer Protection, SC/ST Act, Human Rights, Domestic Violence & POCSO Act',
    color: '#d97706',
    subtopics: [
      'വിവരാവകാശ നിയമം (RTI Act 2005) - കമ്മീഷനുകൾ, അധികാരങ്ങൾ',
      'ഉപഭോക്തൃ സംരക്ഷണ നിയമം (Consumer Protection)',
      'SC/ST അതിക്രമങ്ങൾ തടയൽ നിയമം & കമ്മീഷനുകൾ',
      'മനുഷ്യാവകാശ കമ്മീഷനുകൾ & വയോജന സംരക്ഷണം',
      'ഗാർഹിക പീഡന നിരോധന നിയമം (2005) & വനിതാ കമ്മീഷൻ',
      'പോക്സോ നിയമം (POCSO Act 2012)'
    ]
  },
  // Part II: ആനുകാലിക വിഷയങ്ങൾ (20 Marks)
  {
    id: 'pq_current_affairs',
    name: 'ആനുകാലിക വിഷയങ്ങൾ (Current Affairs)',
    marks: '20 Marks',
    section: 'Part II: ആനുകാലിക വിഷയങ്ങൾ',
    sectionMarks: '20 Marks',
    icon: '📰',
    desc: 'സമകാലിക സംഭവങ്ങൾ, പുരസ്കാരങ്ങൾ, നിയമനങ്ങൾ, കായിക നേട്ടങ്ങൾ, പദ്ധതികൾ, ശാസ്ത്ര വാർത്തകൾ',
    color: '#eab308',
    subtopics: [
      'ദേശീയ, അന്തർദേശീയ, സംസ്ഥാന തലങ്ങളിലെ സമകാലിക സംഭവങ്ങൾ',
      'പ്രധാന പുരസ്കാരങ്ങൾ, ബഹുമതികൾ, ജേതാക്കൾ',
      'പ്രധാന ഭരണഘടനാ/ഭരണപരമായ നിയമനങ്ങൾ',
      'കായിക രംഗത്തെ സുപ്രധാന നേട്ടങ്ങൾ & റെക്കോർഡുകൾ',
      'സർക്കാരിന്റെ പ്രധാന നയങ്ങൾ, വികസന പദ്ധതികൾ & ക്ഷേമപദ്ധതികൾ',
      'ശാസ്ത്ര-സാങ്കേതിക-ബഹിരാകാശ രംഗത്തെ പുതിയ വാർത്തകൾ'
    ]
  },
  // Part III: ലഘുഗണിതവും മാനസിക ശേഷിയും (10 Marks)
  {
    id: 'pq_arithmetic',
    name: 'ലഘുഗണിതം (Simple Arithmetic)',
    marks: '5 Marks',
    section: 'Part III: കണക്കും റീസണിംഗും',
    sectionMarks: '10 Marks',
    icon: '🔢',
    desc: 'സംഖ്യകൾ, ശതമാനം, ലാഭവും നഷ്ടവും, പലിശ, അംശബന്ധം, സമയവും ദൂരവും, ശരാശരി, ക്ഷേത്രഗണിതം',
    color: '#f59e0b',
    subtopics: [
      'സംഖ്യകളും അടിസ്ഥാന ക്രിയകളും',
      'ഭിന്നസംഖ്യകളും ദശാംശ സംഖ്യകളും',
      'ശതമാനം (Percentage)',
      'ലാഭവും നഷ്ടവും (Profit & Loss)',
      'സാധാരണ പലിശയും കൂട്ടുപലിശയും',
      'അംശബന്ധവും അനുപാതവും (Ratio & Proportion)',
      'സമയവും ദൂരവും (Time & Distance)',
      'സമയവും പ്രവൃത്തിയും (Time & Work)',
      'ശരാശരി (Average)',
      'കൃത്യങ്കങ്ങൾ (Laws of Exponents)',
      'ക്ഷേത്രഗണിതം - ചുറ്റളവ്, വിസ്തീർണ്ണം, വ്യാപ്തം',
      'പ്രോഗ്രഷനുകൾ (AP & GP)'
    ]
  },
  {
    id: 'pq_mental_ability',
    name: 'മാനസികശേഷി പരിശോധന (Mental Ability)',
    marks: '5 Marks',
    section: 'Part III: കണക്കും റീസണിംഗും',
    sectionMarks: '10 Marks',
    icon: '🧠',
    desc: 'ശ്രേണികൾ, സ്ഥാന നിർണ്ണയം, സമാന ബന്ധങ്ങൾ, ഒറ്റയാനെ കണ്ടെത്തുക, കോഡിംഗ്, ദിശാബോധം, ക്ലോക്ക്, കലണ്ടർ',
    color: '#f97316',
    subtopics: [
      'ശ്രേണികൾ (സംഖ്യാ, അക്ഷര ശ്രേണികൾ)',
      'ഗണിത ചിഹ്നങ്ങൾ ഉപയോഗിച്ചുള്ള പ്രശ്നങ്ങൾ',
      'സ്ഥാന നിർണ്ണയ പരിശോധന (Ranking)',
      'സമാന ബന്ധങ്ങൾ (Analogy)',
      'ഒറ്റയാനെ കണ്ടെത്തുക (Odd Man Out)',
      'സംഖ്യാവലോകന പ്രശ്നങ്ങൾ',
      'കോഡിംഗും ഡീകോഡിംഗും',
      'കുടുംബ ബന്ധങ്ങൾ (Blood Relations)',
      'ദിശാബോധം (Sense of Direction)',
      'ക്ലോക്കിലെ സമയവും കോണളവും & പ്രതിബിംബവും',
      'കലണ്ടറും തീയതിയും',
      'ക്ലറിക്കൽ ശേഷി പരിശോധന (Clerical Ability)'
    ]
  },
  // Part IV: General English (10 Marks)
  {
    id: 'pq_english_grammar',
    name: 'English Grammar',
    marks: '5 Marks',
    section: 'Part IV: General English',
    sectionMarks: '10 Marks',
    icon: '🇬🇧',
    desc: 'Sentences, Parts of Speech, Articles, Question Tags, Tenses, Prepositions, Voice & Speech',
    color: '#10b981',
    subtopics: [
      'Types & Interchange of Sentences',
      'Parts of Speech & Subject-Verb Agreement',
      'Articles, Auxiliaries & Modals',
      'Question Tags, Infinitives & Gerunds',
      'Tenses & Conditional Sentences',
      'Prepositions & Correlatives',
      'Direct & Indirect Speech',
      'Active & Passive Voice',
      'Sentence Correction & Degrees of Comparison'
    ]
  },
  {
    id: 'pq_english_vocabulary',
    name: 'English Vocabulary',
    marks: '5 Marks',
    section: 'Part IV: General English',
    sectionMarks: '10 Marks',
    icon: '📖',
    desc: 'Synonyms, Antonyms, Phrasal Verbs, Foreign Words, One Word Substitutes, Idioms & Spelling',
    color: '#059669',
    subtopics: [
      'Singular & Plural, Gender, Collective Nouns',
      'Word Formation, Prefixes & Suffixes',
      'Compound Words',
      'Synonyms & Antonyms',
      'Phrasal Verbs',
      'Foreign Words & Phrases',
      'One Word Substitutes',
      'Words Often Confused & Spelling Test',
      'Idioms & Meanings, Common Abbreviations'
    ]
  },
  // Part V: മലയാളം (10 Marks)
  {
    id: 'pq_malayalam',
    name: 'പ്രാദേശിക ഭാഷകൾ (മലയാളം)',
    marks: '10 Marks',
    section: 'Part V: മലയാളം',
    sectionMarks: '10 Marks',
    icon: '📚',
    desc: 'പദശുദ്ധി, വാക്യശുദ്ധി, പരിഭാഷ, ഒറ്റപ്പദം, പര്യായപദം, ശൈലികൾ, ചേർത്തെഴുതുക, ലിംഗം, വചനം',
    color: '#3b82f6',
    subtopics: [
      'പദശുദ്ധി & വാക്യശുദ്ധി',
      'പരിഭാഷ (Translation)',
      'ഒറ്റപ്പദം & സമാനപദം',
      'പര്യായപദം & വിപരീത പദം',
      'ശൈലികളും പഴഞ്ചൊല്ലുകളും',
      'ചേർത്തെഴുതുക & പിരിച്ചെഴുതൽ',
      'സ്ത്രീലിംഗം / പുല്ലിംഗം & വചനം',
      'ഘടകപദം (വാക്യം ചേർത്തെഴുതുക)'
    ]
  }
];

// Part II: Current Affairs (Monthly Capsules & Topic-Wise Sections)
export const CURRENT_AFFAIRS_MONTH_TOPICS = [
  {
    id: 'ca_sep',
    qp_code: 'SEP-CA/2026',
    name: 'സെപ്റ്റംബർ 2026 (September)',
    icon: '',
    desc: 'Current events, appointments, sports & awards from September 2026',
    color: '#ec4899',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_aug',
    qp_code: 'AUG-CA/2026',
    name: 'ഓഗസ്റ്റ് 2026 (August)',
    icon: '',
    desc: 'Current events, appointments, sports & awards from August 2026',
    color: '#f59e0b',
    section: '2026 Monthly Capsules',
    sectionMarks: '250 Qs'
  },
  {
    id: 'ca_jul',
    qp_code: 'JUL-CA/2026',
    name: 'ജൂലൈ 2026 (July)',
    icon: '',
    desc: 'Current events, appointments, sports & awards from July 2026',
    color: '#10b981',
    section: '2026 Monthly Capsules',
    sectionMarks: '420 Qs'
  },
  {
    id: 'ca_jun',
    qp_code: 'JUN-CA/2026',
    name: 'ജൂൺ 2026 (June)',
    icon: '',
    desc: 'Current events, appointments, sports & awards from June 2026',
    color: '#06b6d4',
    section: '2026 Monthly Capsules',
    sectionMarks: '420 Qs'
  },
  {
    id: 'ca_may',
    qp_code: 'MAY-CA/2026',
    name: 'മേയ് 2026 (May)',
    icon: '',
    desc: 'Current events, appointments, sports & awards from May 2026',
    color: '#8b5cf6',
    section: '2026 Monthly Capsules',
    sectionMarks: '420 Qs'
  },
  {
    id: 'ca_apr',
    qp_code: 'APR-CA/2026',
    name: 'ഏപ്രിൽ 2026 (April)',
    icon: '',
    desc: 'Current events, appointments, sports & awards from April 2026',
    color: '#14b8a6',
    section: '2026 Monthly Capsules',
    sectionMarks: '420 Qs'
  },
  {
    id: 'ca_mar',
    qp_code: 'MAR-CA/2026',
    name: 'മാർച്ച് 2026 (March)',
    icon: '',
    desc: 'Current events, appointments, sports & awards from March 2026',
    color: '#84cc16',
    section: '2026 Monthly Capsules',
    sectionMarks: '420 Qs'
  },
  {
    id: 'ca_feb',
    qp_code: 'FEB-CA/2026',
    name: 'ഫെബ്രുവരി 2026 (February)',
    icon: '',
    desc: 'Current events, appointments, sports & awards from February 2026',
    color: '#f43f5e',
    section: '2026 Monthly Capsules',
    sectionMarks: '420 Qs'
  },
  {
    id: 'ca_jan',
    qp_code: 'JAN-CA/2026',
    name: 'ജനുവരി 2026 (January)',
    icon: '',
    desc: 'Current events, appointments, sports & awards from January 2026',
    color: '#3b82f6',
    section: '2026 Monthly Capsules',
    sectionMarks: '420 Qs'
  }
];

export const CURRENT_AFFAIRS_SUBJECT_TOPICS = [
  {
    id: 'ca_top_sports_cf',
    name: 'കായികം: ക്രിക്കറ്റ് & ഫുട്ബോൾ',
    icon: '',
    desc: 'ഐ.പി.എൽ, ട്വന്റി-20, ടെസ്റ്റ് ക്രിക്കറ്റ്, ഫിഫ, സന്തോഷ് ട്രോഫി, ISL',
    color: '#10b981',
    section: 'Topic-wise Revision',
    sectionMarks: '204 Qs'
  },
  {
    id: 'ca_top_sports_oth',
    name: 'കായികം: ഒളിമ്പിക്സ്, അത്‌ലറ്റിക്സ് & ഗെയിംസ്',
    icon: '',
    desc: 'ഒളിമ്പിക്സ്, പാരാലിമ്പിക്സ്, ചെസ്സ്, ബാഡ്മിന്റൺ, ടെന്നീസ്, ഏഷ്യൻ ഗെയിംസ്',
    color: '#06b6d4',
    section: 'Topic-wise Revision',
    sectionMarks: '193 Qs'
  },
  {
    id: 'ca_top_awards_gen',
    name: 'ദേശീയ-അന്തർദേശീയ പുരസ്കാരങ്ങൾ',
    icon: '',
    desc: 'ഭാരതരത്ന, പത്മ പുരസ്കാരങ്ങൾ, നോബൽ സമ്മാനം, ഗാലന്ററി അവാർഡുകൾ',
    color: '#eab308',
    section: 'Topic-wise Revision',
    sectionMarks: '98 Qs'
  },
  {
    id: 'ca_top_literature',
    name: 'സാഹിത്യ പുരസ്കാരങ്ങളും പുസ്തകങ്ങളും',
    icon: '',
    desc: 'ജ്ഞാനപീഠം, എഴുത്തച്ഛൻ, സാഹിത്യ അക്കാദമി, പുതിയ കൃതികൾ & രചയിതാക്കൾ',
    color: '#f97316',
    section: 'Topic-wise Revision',
    sectionMarks: '190 Qs'
  },
  {
    id: 'ca_top_cinema',
    name: 'ചലച്ചിത്ര പുരസ്കാരങ്ങളും സിനിമയും',
    icon: '',
    desc: 'ദേശീയ-സംസ്ഥാന ചലച്ചിത്ര അവാർഡുകൾ, ദാദാസാഹേബ് ഫാൽക്കെ, ഓസ്കാർ, കാൻ',
    color: '#8b5cf6',
    section: 'Topic-wise Revision',
    sectionMarks: '553 Qs'
  },
  {
    id: 'ca_top_culture',
    name: 'കല, സംസ്കാരം, പൈതൃകം & ജി.ഐ ടാഗുകൾ',
    icon: '',
    desc: 'സ്കൂൾ കലോത്സവങ്ങൾ, യുനെസ്കോ പൈതൃകം, ജി.ഐ ടാഗുകൾ, പരമ്പരാഗത കലകൾ',
    color: '#ec4899',
    section: 'Topic-wise Revision',
    sectionMarks: '58 Qs'
  },
  {
    id: 'ca_top_app_national',
    name: 'സുപ്രധാന ദേശീയ & അന്തർദേശീയ നിയമനങ്ങൾ',
    icon: '',
    desc: 'സുപ്രീം കോടതി, ഗവർണർമാർ, കേന്ദ്ര കമ്മീഷനുകൾ, ആഗോള തലവൻമാർ',
    color: '#3b82f6',
    section: 'Topic-wise Revision',
    sectionMarks: '76 Qs'
  },
  {
    id: 'ca_top_app_kerala',
    name: 'കേരളം: ഭരണതല നിയമനങ്ങളും പദവികളും',
    icon: '',
    desc: 'ഹൈക്കോടതി, പി.എസ്.സി ചെയർമാൻ, ചീഫ് സെക്രട്ടറി, സംസ്ഥാന കമ്മീഷനുകൾ',
    color: '#0ea5e9',
    section: 'Topic-wise Revision',
    sectionMarks: '18 Qs'
  },
  {
    id: 'ca_top_kerala_schemes',
    name: 'കേരള സർക്കാർ പദ്ധതികളും നയങ്ങളും',
    icon: '',
    desc: 'കുടുംബശ്രീ, കാരുണ്യ, ലൈഫ് മിഷൻ, അതിദാരിദ്ര്യ നിർമ്മാർജ്ജന പദ്ധതികൾ',
    color: '#14b8a6',
    section: 'Topic-wise Revision',
    sectionMarks: '72 Qs'
  },
  {
    id: 'ca_top_central_schemes',
    name: 'കേന്ദ്ര സർക്കാർ പദ്ധതികളും നയങ്ങളും',
    icon: '',
    desc: 'പി.എം ആവാസ്, പി.എം കിസാൻ, ആയുഷ്മാൻ ഭാരത്, കേന്ദ്ര ബജറ്റ് നയങ്ങൾ',
    color: '#f59e0b',
    section: 'Topic-wise Revision',
    sectionMarks: '1012 Qs'
  },
  {
    id: 'ca_top_space_isro',
    name: 'ബഹിരാകാശ ഗവേഷണവും ഐ.എസ്.ആർ.ഒയും',
    icon: '',
    desc: 'ഗഗൻയാൻ, ചന്ദ്രയാൻ, ആദിത്യ എൽ-1, നാസ, വി.എസ്.എസ്.സി, ഉപഗ്രഹങ്ങൾ',
    color: '#6366f1',
    section: 'Topic-wise Revision',
    sectionMarks: '123 Qs'
  },
  {
    id: 'ca_top_defence',
    name: 'പ്രതിരോധം, സൈനിക അഭ്യാസങ്ങൾ & സുരക്ഷ',
    icon: '',
    desc: 'കര-നാവിക-വ്യോമസേനകൾ, ഡി.ആർ.ഡി.ഒ, സംയുക്ത അഭ്യാസങ്ങൾ, യുദ്ധക്കപ്പലുകൾ',
    color: '#64748b',
    section: 'Topic-wise Revision',
    sectionMarks: '201 Qs'
  },
  {
    id: 'ca_top_science_ai',
    name: 'ശാസ്ത്ര സാങ്കേതികവിദ്യ, എ.ഐ & ഇന്നൊവേഷൻ',
    icon: '',
    desc: 'നിർമ്മിത ബുദ്ധി (AI), സൂപ്പർ കമ്പ്യൂട്ടറുകൾ, സൈബർ സുരക്ഷ, ഇന്നൊവേഷൻ',
    color: '#a855f7',
    section: 'Topic-wise Revision',
    sectionMarks: '86 Qs'
  },
  {
    id: 'ca_top_environment',
    name: 'പരിസ്ഥിതി, കാലാവസ്ഥ & റാംസർ സൈറ്റുകൾ',
    icon: '',
    desc: 'റാംസർ തണ്ണീർത്തടങ്ങൾ, ദേശീയോദ്യാനങ്ങൾ, വന്യജീവി സങ്കേതങ്ങൾ, കാലാവസ്ഥ',
    color: '#22c55e',
    section: 'Topic-wise Revision',
    sectionMarks: '111 Qs'
  },
  {
    id: 'ca_top_indices_summits',
    name: 'ആഗോള സൂചികകൾ, റിപ്പോർട്ടുകൾ & ഉച്ചകോടികൾ',
    icon: '',
    desc: 'ഹാപ്പിനസ് ഇൻഡക്സ്, ഹംഗർ ഇൻഡക്സ്, ജി-20, ബ്രിക്സ്, COP ഉച്ചകോടികൾ',
    color: '#0284c7',
    section: 'Topic-wise Revision',
    sectionMarks: '104 Qs'
  },
  {
    id: 'ca_top_kerala_infra',
    name: 'കേരളം: അടിസ്ഥാന സൗകര്യ വികസനം, തുറമുഖം & ഗതാഗതം',
    icon: '',
    desc: 'വിഴിഞ്ഞം അന്താരാഷ്ട്ര തുറമുഖം, വാട്ടർ മെട്രോ, ദേശീയപാത 66 വികസനം',
    color: '#059669',
    section: 'Topic-wise Revision',
    sectionMarks: '53 Qs'
  },
  {
    id: 'ca_top_days_themes',
    name: 'സുപ്രധാന ദിനങ്ങളും ഔദ്യോഗിക പ്രമേയങ്ങളും',
    icon: '',
    desc: 'ദേശീയ-അന്തർദേശീയ ദിനങ്ങൾ, ആചരണങ്ങൾ, അവയുടെ ഔദ്യോഗിക പ്രമേയങ്ങൾ',
    color: '#d97706',
    section: 'Topic-wise Revision',
    sectionMarks: '157 Qs'
  },
  {
    id: 'ca_top_obituaries',
    name: 'ചരമം: വിടവാങ്ങിയ പ്രമുഖ വ്യക്തികൾ',
    icon: '',
    desc: 'അടുത്തിടെ വിടവാങ്ങിയ സാംസ്കാരിക, രാഷ്ട്രീയ, കായിക, ചലച്ചിത്ര പ്രമുഖർ',
    color: '#475569',
    section: 'Topic-wise Revision',
    sectionMarks: '131 Qs'
  }
];

export const CURRENT_AFFAIRS_TOPICS = [
  {
    id: 'all',
    name: 'All Current Affairs (2026 Mock)',
    icon: '🎯',
    desc: 'Practice across all 2026 monthly capsules & topics (3,440 Qs)',
    color: '#6366f1',
    section: '2026 Current Affairs (3,440 Qs)',
    sectionMarks: '3,440 Qs'
  },
  ...CURRENT_AFFAIRS_MONTH_TOPICS,
  ...CURRENT_AFFAIRS_SUBJECT_TOPICS
];

// -------------------------------------------------------------
// 3. Question Bank Exports
// -------------------------------------------------------------

export const QUESTION_BANK = Array.isArray(malayalamQuestions) ? malayalamQuestions : [];

export const ENGLISH_QUESTION_BANK = Array.isArray(englishQuestions) ? englishQuestions : [];

export const CURRENT_AFFAIRS_QUESTION_BANK = Array.isArray(currentAffairsQuestions) ? currentAffairsQuestions : [];

export const PYQ_YEARS = [
  { id: 'all', label: 'All Exam Papers (2026–2021)', shortLabel: '2026-2021', count: 17101 },
  { id: '2026', label: '2026 Exam Papers', shortLabel: '2026', count: Array.isArray(pyq2026Questions) ? pyq2026Questions.length : 2326 },
  { id: '2025', label: '2025 Exam Papers', shortLabel: '2025', count: Array.isArray(pyq2025Questions) ? pyq2025Questions.length : 3594 },
  { id: '2024', label: '2024 Exam Papers', shortLabel: '2024', count: Array.isArray(pyq2024Questions) ? pyq2024Questions.length : 4333 },
  { id: '2023', label: '2023 Exam Papers', shortLabel: '2023', count: Array.isArray(pyq2023Questions) ? pyq2023Questions.length : 4277 },
  { id: '2022', label: '2022 Exam Papers', shortLabel: '2022', count: Array.isArray(pyq2022Questions) ? pyq2022Questions.length : 1727 },
  { id: '2021', label: '2021 Exam Papers', shortLabel: '2021', count: Array.isArray(pyq2021Questions) ? pyq2021Questions.length : 844 }
];

const buildPyqPaperTopics = (questions, year) => {
  if (!Array.isArray(questions)) return [];
  const counts = new Map();
  for (const q of questions) {
    if (!q?.qp_code) continue;
    counts.set(q.qp_code, (counts.get(q.qp_code) || 0) + 1);
  }
  const sortedCodes = Array.from(counts.entries()).sort((a, b) => {
    const numA = parseInt(String(a[0]).match(/\d+/)?.[0] || '9999', 10);
    const numB = parseInt(String(b[0]).match(/\d+/)?.[0] || '9999', 10);
    return numA - numB || String(a[0]).localeCompare(String(b[0]));
  });
  return sortedCodes.map(([qpCode, count], idx) => ({
    id: `qp:${qpCode}`,
    qp_code: qpCode,
    year,
    paperNumber: idx + 1,
    name: `QP ${qpCode}`,
    marks: `${count} Qs`,
    section: `${year} Question Papers`,
    sectionMarks: `${sortedCodes.length} Papers`,
    icon: '📄',
    desc: `Official Kerala PSC Question Paper (${qpCode}) — ${count} Questions`,
    color: '#38bdf8'
  }));
};

export const PYQ_PAPER_TOPICS_BY_YEAR = {
  'all': [
    ...buildPyqPaperTopics(pyq2026Questions, '2026'),
    ...buildPyqPaperTopics(pyq2025Questions, '2025'),
    ...buildPyqPaperTopics(pyq2024Questions, '2024'),
    ...buildPyqPaperTopics(pyq2023Questions, '2023'),
    ...buildPyqPaperTopics(pyq2022Questions, '2022'),
    ...buildPyqPaperTopics(pyq2021Questions, '2021')
  ],
  '2026': buildPyqPaperTopics(pyq2026Questions, '2026'),
  '2025': buildPyqPaperTopics(pyq2025Questions, '2025'),
  '2024': buildPyqPaperTopics(pyq2024Questions, '2024'),
  '2023': buildPyqPaperTopics(pyq2023Questions, '2023'),
  '2022': buildPyqPaperTopics(pyq2022Questions, '2022'),
  '2021': buildPyqPaperTopics(pyq2021Questions, '2021')
};

export const PYQ_QUESTION_BANK = [
  ...(Array.isArray(pyq2026Questions) ? pyq2026Questions.map(q => ({ ...q, year: '2026' })) : []),
  ...(Array.isArray(pyq2025Questions) ? pyq2025Questions.map(q => ({ ...q, year: '2025' })) : []),
  ...(Array.isArray(pyq2024Questions) ? pyq2024Questions.map(q => ({ ...q, year: '2024' })) : []),
  ...(Array.isArray(pyq2023Questions) ? pyq2023Questions.map(q => ({ ...q, year: '2023' })) : []),
  ...(Array.isArray(pyq2022Questions) ? pyq2022Questions.map(q => ({ ...q, year: '2022' })) : []),
  ...(Array.isArray(pyq2021Questions) ? pyq2021Questions.map(q => ({ ...q, year: '2021' })) : [])
];
