import os
import json

TOPICS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'english_topics')
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'english_questions.js')

ENGLISH_SYLLABUS_TOPICS = [
    { "id": 'all', "name": 'All English Topics (Mock)', "icon": '🎯', "desc": 'Random practice across entire 10-mark English syllabus', "color": '#6366f1' },
    # Grammar (15)
    { "id": 'types_of_sentences', "name": 'Types of Sentences & Interchange', "icon": '🔄', "desc": 'Simple, compound, complex, assertive & negative conversions', "color": '#3b82f6' },
    { "id": 'parts_of_speech', "name": 'Different Parts of Speech', "icon": '🏷️', "desc": 'Identifying nouns, verbs, adjectives, adverbs in context', "color": '#8b5cf6' },
    { "id": 'subject_verb_agreement', "name": 'Subject-Verb Agreement (Concord)', "icon": '🤝', "desc": 'Singular/plural rules, collective nouns, compound subjects', "color": '#10b981' },
    { "id": 'articles', "name": 'Articles (Definite & Indefinite)', "icon": '🅰️', "desc": 'Rules of a, an, the, and omission of articles', "color": '#f59e0b' },
    { "id": 'modal_auxiliaries', "name": 'Primary & Modal Auxiliary Verbs', "icon": '⚡', "desc": 'Can, could, may, might, must, should, ought to, used to', "color": '#ec4899' },
    { "id": 'question_tags', "name": 'Question Tags', "icon": '❓', "desc": 'Affirmative/negative tags, imperatives, special pronoun tags', "color": '#06b6d4' },
    { "id": 'infinitives_gerunds', "name": 'Infinitives and Gerunds', "icon": '🏊', "desc": 'To-infinitives, bare infinitives, gerundial nouns', "color": '#14b8a6' },
    { "id": 'tenses', "name": 'Tenses', "icon": '⏳', "desc": 'Present, past, future tenses, perfect & continuous forms', "color": '#84cc16' },
    { "id": 'conditional_sentences', "name": 'Tenses in Conditional Sentences', "icon": '🔀', "desc": 'Zero, Type 1, Type 2, and Type 3 conditional clauses', "color": '#f43f5e' },
    { "id": 'prepositions', "name": 'Prepositions', "icon": '📍', "desc": 'Time, place, direction prepositions & fixed prepositions', "color": '#a855f7' },
    { "id": 'correlatives', "name": 'The Use of Correlatives', "icon": '🔗', "desc": 'Neither...nor, either...or, scarcely...when, no sooner...than', "color": '#eab308' },
    { "id": 'reported_speech', "name": 'Direct and Indirect Speech', "icon": '💬', "desc": 'Statements, questions, requests, imperative conversions', "color": '#0ea5e9' },
    { "id": 'active_passive_voice', "name": 'Active and Passive Voice', "icon": '📢', "desc": 'Voice transformations across all tenses & interrogatives', "color": '#64748b' },
    { "id": 'sentence_correction', "name": 'Correction of Sentences', "icon": '✨', "desc": 'Error spotting, redundant words, dangling modifiers', "color": '#10b981' },
    { "id": 'degrees_of_comparison', "name": 'Degrees of Comparison', "icon": '📈', "desc": 'Positive, comparative, and superlative degree transformations', "color": '#6366f1' },
    # Vocabulary (12)
    { "id": 'singular_plural_gender_collective', "name": 'Number, Gender & Collective Nouns', "icon": '👥', "desc": 'Irregular plurals, masculine/feminine, group nouns', "color": '#f97316' },
    { "id": 'word_formation_affixes', "name": 'Word Formation, Prefixes & Suffixes', "icon": '🧱', "desc": 'Roots, negative prefixes, adjective/noun derivations', "color": '#06b6d4' },
    { "id": 'compound_words_eng', "name": 'Compound Words', "icon": '🧩', "desc": 'Noun+Noun, Verb+Noun, Gerund+Noun combinations', "color": '#8b5cf6' },
    { "id": 'synonyms_eng', "name": 'Synonyms', "icon": '📖', "desc": 'Most frequently asked synonyms and word meanings', "color": '#3b82f6' },
    { "id": 'antonyms_eng', "name": 'Antonyms', "icon": '🔄', "desc": 'Direct opposites and contrasting vocabulary', "color": '#ef4444' },
    { "id": 'phrasal_verbs', "name": 'Phrasal Verbs', "icon": '🏃', "desc": 'Verb + preposition combinations and idiomatic usages', "color": '#14b8a6' },
    { "id": 'foreign_words', "name": 'Foreign Words and Phrases', "icon": '🌍', "desc": 'Latin, French, and legal phrases commonly used in English', "color": '#f59e0b' },
    { "id": 'one_word_substitutes_eng', "name": 'One Word Substitutes', "icon": '📝', "desc": 'Single word representations for complex concepts', "color": '#a855f7' },
    { "id": 'confused_words', "name": 'Words Often Confused', "icon": '🤔', "desc": 'Homophones, homonyms, and commonly mistaken word pairs', "color": '#ec4899' },
    { "id": 'spelling_test_eng', "name": 'Spelling Test', "icon": '✍️', "desc": 'Spotting correct spellings of tricky English words', "color": '#10b981' },
    { "id": 'idioms_meanings', "name": 'Idioms and their Meanings', "icon": '💡', "desc": 'Popular figurative idioms, proverbs, and expressions', "color": '#eab308' },
    { "id": 'abbreviations', "name": 'Abbreviations and Expansions', "icon": '🔤', "desc": 'National and international organizations, terms & acronyms', "color": '#0ea5e9' }
]

all_questions = []

# Order of files matching topics
topic_ids = [t['id'] for t in ENGLISH_SYLLABUS_TOPICS if t['id'] != 'all']

for tid in topic_ids:
    file_path = os.path.join(TOPICS_DIR, f"{tid}.json")
    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found!")
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        qs = data.get('questions', [])
        print(f"Adding {len(qs)} questions for {tid}")
        all_questions.extend(qs)

print(f"Total English questions combined: {len(all_questions)}")

# Write to src/data/english_questions.js
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write("// General English Syllabus Topics and 2800+ Question Bank\n")
    f.write("export const ENGLISH_SYLLABUS_TOPICS = " + json.dumps(ENGLISH_SYLLABUS_TOPICS, indent=2, ensure_ascii=False) + ";\n\n")
    f.write("export const ENGLISH_QUESTION_BANK = " + json.dumps(all_questions, indent=2, ensure_ascii=False) + ";\n")

print(f"Successfully generated {OUTPUT_FILE}")
