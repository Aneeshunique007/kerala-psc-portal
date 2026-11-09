import React, { useState, useEffect } from 'react';
import { CheckIcon, XIcon } from './Icons';

// True statement bullets in Kerala PSC: (a)-(e), (i)-(vi), (1)-(10), 1.-10., 1)-10), a.-e., a)-e), i.-vi., i)-vi)
const BADGE_CHARS = '\\([a-e]\\)|\\([ivx]{1,6}\\)|\\((?:10|[1-9])\\)|(?:10|[1-9])\\.|(?:10|[1-9])\\)|[a-e]\\.|[a-e]\\)|[ivx]{1,6}\\.|[ivx]{1,6}\\)';
const MONTH_BEFORE = '(?<!ജനുവരി\\s+|ഫെബ്രുവരി\\s+|മാർച്ച്\\s+|ഏപ്രിൽ\\s+|മെയ്\\s+|ജൂൺ\\s+|ജൂലൈ\\s+|ഓഗസ്റ്റ്\\s+|സെപ്റ്റംബർ\\s+|ഒക്ടോബർ\\s+|നവംബർ\\s+|ഡിസംബർ\\s+)';
const BADGE_FINDER_REGEX = new RegExp('(?:^|\\s)(?<![a-z]\\.\\s*)(?<![a-z\\.+\\-×÷*/=^])' + MONTH_BEFORE + '(' + BADGE_CHARS + ')(?=\\s+(?!എന്നീ))', 'gi');
const INLINE_STATEMENT_REGEX = new RegExp('([^\\n+\\-×÷*/=^])\\s+(?<![a-z]\\.\\s*)(?<![a-z\\.])' + MONTH_BEFORE + '(' + BADGE_CHARS + ')\\s+(?!എന്നീ)', 'gi');
const STATEMENT_BADGE_REGEX = new RegExp('^(' + BADGE_CHARS + ')\\s+(.+)$', 'i');

// ---- Highlight positive (ശരിയായ, ശരി...) vs negative (തെറ്റ്, ശരിയല്ലാത്ത, പൊരുത്തപ്പെടാത്തത്, ഉൾപ്പെടാത്തത്...) keywords in question stems ----
const KW_POS_EARLY = 'തെറ്റില്ലാത്ത[\\p{L}\\p{M}\\u200C\\u200D]*';
const KW_NEG_SRC = '(?:ശരിയല്ലാത്ത|ശരിയല്ല|തെറ്റായ|തെറ്റായി|തെറ്റാണ്|തെറ്റ്|പൊരുത്തപ്പെടാത്ത|യോജിക്കാത്ത|ബന്ധമില്ലാത്ത|ബന്ധപ്പെടാത്ത|ബന്ധപ്പെട്ടിട്ടില്ലാത്ത|ഉ(?:ൾ|ള\\u0D4D\\u200D)പ്പെടാത്ത|ഉ(?:ൾ|ള\\u0D4D\\u200D)പ്പെടുന്നില്ല|പെടാത്ത|അല്ലാത്ത|ഒഴികെ|ഒറ്റപ്പെട്ട|വ്യത്യസ്തമായ)[\\p{L}\\p{M}\\u200C\\u200D]*|[\\p{L}\\p{M}\\u200C\\u200D]+(?:ല്ലാത്ത|പെടാത്ത|പ്പെടാത്ത)[\\p{L}\\p{M}\\u200C\\u200D]*|\\b(?:not\\s+correct|not\\s+true|incorrect|incorrectly|false|wrong|wrongly|misspelt|misspelled|wrongly\\s+spelt|wrongly\\s+spelled|incorrectly\\s+spelt|incorrectly\\s+spelled|mismatch\\w*|not\\s+match\\w*|does\\s+not\\s+belong|not\\s+related|except|odd\\s+one(?:\\s+out)?|odd\\s+man(?:\\s+out)?)\\b';
const KW_POS_SRC = '(?:ശരിയായ|ശരിയായി|ശരിയാണ്|ശരിയേത്|ശരി|പൊരുത്തപ്പെടുന്ന|യോജിക്കുന്ന|യോജിച്ച|ഉ(?:ൾ|ള\\u0D4D\\u200D)പ്പെടുന്ന)[\\p{L}\\p{M}\\u200C\\u200D]*|\\b(?:correct|correctly|right|true|correctly\\s+spelt|correctly\\s+spelled|spelt\\s+correctly|spelled\\s+correctly)\\b';
const POLARITY_KW_REGEX = new RegExp(`(?<![\\p{L}\\p{M}])(?:(${KW_POS_EARLY})|(${KW_NEG_SRC})|(${KW_POS_SRC}))(?![\\p{L}\\p{M}])`, 'giu');
const NEEDS_OPTIONS_REGEX = /താഴെ\s*(?:തന്നിരിക്കുന്ന|പറയുന്ന|കൊടുത്തിരിക്കുന്ന|നൽകിയിരിക്കുന്ന|സൂചിപ്പിക്കുന്ന|പറഞ്ഞിരിക്കുന്ന)|ചുവടെ\s*(?:തന്നിരിക്കുന്ന|പറയുന്ന|കൊടുത്തിരിക്കുന്ന|നൽകിയിരിക്കുന്ന|പറഞ്ഞിരിക്കുന്ന)|ഇനിപ്പറയുന്നവയിൽ|ഇവയിൽ\s*നിന്ന്|അക്ഷരത്തെറ്റില്ലാത്ത|അക്ഷരത്തെറ്റുള്ള|ശരിയായ പദം|തെറ്റായ പദം|ശരിയായ വാക്യം|തെറ്റായ വാക്യം|പദശുദ്ധി|വാക്യശുദ്ധി|കൂട്ടത്തിൽ പെടാത്തത്|ചേരാത്തത്|ഒറ്റപ്പദം|\b(?:one\s+of\s+the\s+following|which\s+of\s+the\s+following|among\s+the\s+following|which\s+one\s+of\s+the\s+following|any\s+of\s+the\s+following|all\s+of\s+the\s+following|following\s+words?|following\s+sentences?|following\s+pairs?|misspelt|misspelled|correctly\s+spelt|correctly\s+spelled|odd\s+one\s+out|odd\s+man\s+out)\b/iu;

// ---- Statement verdicts (Browse Mode): work out which statements are correct ----
const normBadge = (b) => String(b || '').replace(/[().\s]/g, '').toLowerCase();
const NEGATIVE_Q = new RegExp(KW_NEG_SRC, 'iu');
const ORDER_Q = /കാലഗണന|കാലക്രമ|ശരിയായ ക്രമം|(?<!എന്ന\s)ക്രമത്തിൽ|ക്രമീകരിക്ക|ക്രമപ്പെടുത്ത|\b(arrange|chronolog\w*|sequence|order)\b/i;

function highlightQuestionPolarity(text) {
  if (!text) return text;
  const parts = [];
  let lastIdx = 0;
  let key = 0;
  for (const m of text.matchAll(POLARITY_KW_REGEX)) {
    const idx = m.index;
    if (idx > lastIdx) parts.push(text.slice(lastIdx, idx));
    const isNeg = Boolean(m[2]);
    parts.push(
      <span key={`kw-${key++}`} className={isNeg ? 'pyq-kw-negative' : 'pyq-kw-positive'}>
        {m[0]}
      </span>
    );
    lastIdx = idx + m[0].length;
  }
  if (parts.length === 0) return text;
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}
const ALL_ANS = /all of the above|all the above|all are|(?:എ|െ)ല്ലാം|മുഴുവൻ|എല്ലാ|രണ്ട് പ്രസ്താവനകളും ശരി/i;
const NONE_ANS = /none of the above|none of these|(?:ഒ|ൊ)ന്നുമല്ല|(?:ഒ|ൊ)ന്നും?\s*അല്ല|ഒന്നും ശരിയല്ല|ഇവയാനുമല്ല|none/i;
const LABEL_IN_ANS = /(?<![\p{L}\d])\(?([ivxIVX]{1,4}|[a-eA-E]|10|[1-9])[.)]?(?![\p{L}\d])/gu;

// Malayalam number words used in answers such as "രണ്ടും മൂന്നും ശരിയാണ്" or "മൂന്നും ശരി"
const NUM_WORDS = { 'ഒന്ന്': 1, 'ഒന്നു': 1, 'ഒന്നൂ': 1, 'ഒന്നും': 1, 'ഒന്നൂം': 1, 'ഒന്നാമത്തെ': 1, 'രണ്ട്': 2, 'രണ്ടു': 2, 'രണ്ടൂ': 2, 'രണ്ടും': 2, 'രണ്ടൂം': 2, 'രണ്ടാമത്തെ': 2, 'മൂന്ന്': 3, 'മൂന്നു': 3, 'മൂന്നും': 3, 'മൂന്നാമത്തെ': 3, 'നാല്': 4, 'നാലു': 4, 'നാലും': 4, 'നാലാമത്തെ': 4, 'അഞ്ച്': 5, 'അഞ്ചു': 5, 'അഞ്ചും': 5 };
const FILLER_WORDS = new Set(['ശരിയാണ്', 'ശരി', 'മാത്രം', 'എന്നിവ', 'ഉം', 'ശരിയായവ', 'പ്രസ്താവനകളും', 'പ്രസ്താവനകൾ', 'പ്രസ്താവന', 'പ്രസ്താവനയും']);

// Automatically format Malayalam poem stanzas with slashes into verse lines
function formatPoemVerses(text) {
  if (!text || !text.includes(' / ')) return text;

  // 1. Quoted poem stanzas: "verse 1 / verse 2" or “verse 1 / verse 2” or 'verse 1 / verse 2'
  let res = text.replace(/(["“'])(.+?\s+\/\s+.+?)\1(\s*[—–-]?\s*(?:ഈ\s+വരികൾ|എന്ന\s+വരികൾ|ഇവ\s+ആരുടെ|ആരുടെ\s+വരികൾ|ഏത്\s+കൃതി|ആരുടെ\s+രചന|ആരുടേത്|എന്ന\s+കവിത|ആരുടെ\s+കവിതാ)[^?]*\??)?/gu, (match, qOpen, poemBody, tail) => {
    const verses = poemBody.split(/\s+\/\s+/).map(v => v.trim()).filter(Boolean);
    const hasPoemTail = Boolean(tail && tail.trim());
    const isPoem = hasPoemTail || verses.length >= 3 || (verses.length >= 2 && verses.every(v => v.length >= 10 && v.includes(' ')));
    if (!isPoem) return match;
    const closeQuote = qOpen === '“' ? '”' : qOpen;
    const formattedPoem = verses.join('\n');
    const formattedTail = tail ? '\n' + tail.trim() : '';
    return `${qOpen}${formattedPoem}${closeQuote}${formattedTail}`;
  });

  // 2. Unquoted poem stanzas ending with — ഈ വരികൾ ...
  res = res.replace(/(^|\n)([^\n"“'\(\)]+?\s+\/\s+[^\n"“'\(\)]+?)\s*([—–-]\s*(?:ഈ\s+വരികൾ|എന്ന\s+വരികൾ|ആരുടെ\s+വരികൾ|ഏത്\s+കൃതി|ആരുടെ\s+രചന|ആരുടേത്)[^\n]*)/gu, (match, prefix, poemBody, tail) => {
    const verses = poemBody.split(/\s+\/\s+/).map(v => v.trim()).filter(Boolean);
    if (verses.length >= 2 && verses.every(v => v.length >= 8)) {
      return `${prefix}${verses.join('\n')}\n${tail.trim()}`;
    }
    return match;
  });

  return res;
}

// Converts Malayalam number-word answers to something the label parser understands.
// Returns { all: true } for "both/all N correct", or { text } with digits, or null.
function normaliseNumberWords(answerText, statementCount) {
  const words = answerText.trim().split(/[\s,]+/).filter(Boolean);
  const nums = words.filter(w => NUM_WORDS[w]);
  if (nums.length === 0 || words.some(w => !NUM_WORDS[w] && !FILLER_WORDS.has(w))) return null;
  if (nums.length === 1) {
    // "നാല് മാത്രം" => only statement 4
    if (words.includes('മാത്രം')) return { text: String(NUM_WORDS[nums[0]]) };
    // "രണ്ടും ശരി" => all of N statements; a bare count ("രണ്ട്") is ambiguous
    return nums[0].endsWith('ും') && NUM_WORDS[nums[0]] === statementCount ? { all: true } : null;
  }
  return { text: nums.map(w => NUM_WORDS[w]).join(', ') };
}

// Answers that spell out verdicts, e.g. "ii, iii, iv ശരിയാണ്, i ശരിയല്ല" or "ഒന്നും രണ്ടും ശരി മൂന്ന് തെറ്റ്"
const VERDICT_TOKEN = /(ശരിയല്ല|തെറ്റ(?:്|ാണ്|ായ|ും))|(ശരി(?:യാണ്|യും|യായ)?)|(ഒന്നാമത്തെ|രണ്ടാമത്തെ|മൂന്നാമത്തെ|നാലാമത്തെ|ഒന്നും|ഒന്ന്|ഒന്നു|രണ്ടും|രണ്ട്|രണ്ടു|മൂന്നും|മൂന്ന്|മൂന്നു|നാലും|നാല്|നാലു|അഞ്ചും|അഞ്ച്|അഞ്ചു)|(?<![\p{L}\d])\(?([ivxIVX]{1,4}|[a-eA-E]|10|[1-9])[.)]?(?![\p{L}\d])/gu;
function explicitVerdicts(answerText, labels) {
  const assigned = {};
  let pending = [];
  let used = 0;
  for (const m of answerText.matchAll(VERDICT_TOKEN)) {
    if (m[1] || m[2]) {
      const v = m[1] ? 'wrong' : 'correct';
      if (pending.length === 0) return null;
      pending.forEach(l => { assigned[l] = v; });
      pending = [];
      used++;
    } else {
      let l = m[3] ? String(NUM_WORDS[m[3]]) : normBadge(m[4]);
      if (!labels.includes(l) && /^[1-9]$/.test(l) && Number(l) <= labels.length && labels.every(x => !/^[1-9]$/.test(x))) {
        l = labels[Number(l) - 1];
      }
      if (!labels.includes(l)) return null;
      pending.push(l);
    }
  }
  if (used === 0 || pending.length) return null;
  const vals = new Set(Object.values(assigned));
  const out = {};
  labels.forEach(l => {
    if (assigned[l]) out[l] = assigned[l];
    else if (vals.size === 1) out[l] = vals.has('correct') ? 'wrong' : 'correct';
  });
  return labels.every(l => out[l]) ? out : null;
}

// For chronological / ordering statement questions in Browse Mode:
// returns the statements rearranged in the exact order given by answerText, or null.
function computeOrderedStatements(statements, answerText, introText) {
  try {
    if (!answerText || statements.length < 2) return null;
    if (/ശരി|തെറ്റ|മാത്രം|എല്ലാം|only|all|both|true|false/i.test(answerText)) return null;
    const labels = statements.map(st => normBadge(st.badge));
    if (new Set(labels).size !== labels.length) return null;

    let seq = [...String(answerText).matchAll(LABEL_IN_ANS)].map(m => normBadge(m[1]));
    const compact = String(answerText).trim().toLowerCase();
    if (seq.length !== labels.length && /^[a-e1-9]{3,6}$/.test(compact) && compact.length === labels.length) {
      seq = compact.split('');
    }
    if (seq.some(l => !labels.includes(l)) && seq.every(l => /^[1-9]$/.test(l) && Number(l) <= labels.length) && labels.every(l => !/^[1-9]$/.test(l))) {
      seq = seq.map(l => labels[Number(l) - 1]);
    }
    if (seq.length === labels.length && new Set(seq).size === labels.length && seq.every(l => labels.includes(l))) {
      if (ORDER_Q.test(introText || '') || seq.join(',') !== labels.join(',')) {
        const byLabel = new Map(statements.map(s => [normBadge(s.badge), s]));
        return seq.map(l => byLabel.get(l));
      }
    }
    if (ORDER_Q.test(introText || '')) {
      const parts = String(answerText).split(/\s*(?:,|;|>|→|->|–|-)\s*/).map(s => s.trim()).filter(Boolean);
      if (parts.length === statements.length) {
        const matched = parts.map(p => statements.find(s => s.body.trim().toLowerCase() === p.toLowerCase()));
        if (matched.every(Boolean) && new Set(matched).size === statements.length) return matched;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Returns { [normalisedBadge]: 'correct' | 'wrong' } or null if it cannot be determined safely
function computeVerdicts(statements, answerText, questionText) {
  try {
    if (!answerText || statements.length < 2) return null;
    const labels = statements.map(st => normBadge(st.badge));
    if (new Set(labels).size !== labels.length) return null;

    const explicit = explicitVerdicts(answerText, labels);
    if (explicit) return explicit;
    if (/തെറ്റായ പ്രസ്താവനകൾ ഇല്ല|തെറ്റായ പ്രസ്താവന ഇല്ല/.test(answerText)) {
      const all = {};
      labels.forEach(l => { all[l] = 'correct'; });
      return all;
    }

    let picked;
    const nw = normaliseNumberWords(answerText, statements.length);
    if (nw && nw.all) answerText = 'all of the above';
    else if (nw && nw.text) answerText = nw.text;
    if (ALL_ANS.test(answerText) && !/[ivx1-9]/i.test(answerText.replace(new RegExp(ALL_ANS.source, 'gi'), ''))) {
      picked = new Set(labels);
    } else if (NONE_ANS.test(answerText) && !/[ivx1-9]/i.test(answerText.replace(new RegExp(NONE_ANS.source, 'gi'), ''))) {
      picked = new Set();
    } else {
      const seq = [...answerText.matchAll(LABEL_IN_ANS)].map(m => normBadge(m[1]));
      picked = new Set(seq);
      if (picked.size === 0) return null;
      // Statements labelled (i)/(a)/… but answer uses 1, 2, 3 => position in the list
      if ([...picked].some(l => !labels.includes(l)) && [...picked].every(l => /^[1-9]$/.test(l) && Number(l) <= labels.length) && labels.every(l => !/^[1-9]$/.test(l))) {
        const byPos = new Set([...picked].map(l => labels[Number(l) - 1]));
        seq.length = 0;
        labels.forEach(l => { if (byPos.has(l)) seq.push(l); });
        picked = byPos;
      }
      for (const l of picked) if (!labels.includes(l)) return null;
      // Listing every label out of order (e.g. "1, 4, 3, 2") is an ordering answer, not a selection
      if (picked.size === labels.length && [...picked].join(',') !== labels.join(',')) return null;
    }

    const negative = NEGATIVE_Q.test(questionText || '');
    const verdicts = {};
    labels.forEach(l => {
      const inPicked = picked.has(l);
      verdicts[l] = (negative ? !inPicked : inPicked) ? 'correct' : 'wrong';
    });
    return verdicts;
  } catch {
    return null;
  }
}

export default function FormattedQuestion({ text, className = '', showQpBadge = false, answerText = null, verdictOverride = null, options = null, answerIndex = null }) {
  if (!text) return null;

  // Extract [QP: ...] code if present, and strip exam tags like [LDC 2020], [Kerala PSC PYQ], and topic tags like [സാഹിത്യം]
  let qpCode = null;
  let clean = text
    .replace(/\[QP:\s*([^\]]+)\]/gi, (_, code) => {
      qpCode = code.trim();
      return '';
    })
    .replace(/\s*\[(10th|Degree|CPO|VEO|VFA|LDC|LGS|Kerala PSC|Secretariat|University|Assistant|Asst)[^\]]*\]/gi, '')
    .replace(/^\s*\[[^\d+×÷/=\-^()[\]]+\]\s*/, '')
    .replace(/\[(സാഹിത്യം|അർത്ഥം|ഒറ്റപ്പദം|കടങ്കഥ|ക്രിയ|പദവിഭജനം|പദശുദ്ധി|പരിഭാഷ|പര്യായപദം|പഴഞ്ചൊൽ|ലിംഗം|വചനം|വാക്യശുദ്ധി|വിപരീതപദം|വ്യാകരണം|ശൈലി|സന്ധി|സമാനപദം|സമാസം)\]\s*/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  clean = formatPoemVerses(clean);

  // 1. Check for markdown table FIRST on raw lines (before splitting inline badges)
  // This ensures badges like (i), (a) inside table cells do not corrupt the table structure
  const rawLines = clean.split('\n').map(l => l.trim()).filter(Boolean);
  const tableLines = rawLines.filter(l => l.startsWith('|') && l.endsWith('|'));
  if (tableLines.length >= 2) {
    const firstTableIdx = rawLines.findIndex(l => l.startsWith('|') && l.endsWith('|'));
    const lastTableIdx = rawLines.findLastIndex(l => l.startsWith('|') && l.endsWith('|'));
    const introLines = rawLines.slice(0, firstTableIdx).filter(l => !l.startsWith('|'));
    const outroLines = rawLines.slice(lastTableIdx + 1).filter(l => !l.startsWith('|'));
    const headerLine = tableLines[0];
    const headers = headerLine.split('|').map(c => c.trim()).filter(Boolean);
    const rowLines = tableLines.slice(1).filter(l => !l.includes('---'));
    const rows = rowLines.map(r => r.split('|').map(c => c.trim()).filter(Boolean));
    const tableStmts = rows
      .map(r => (r[0] || '').match(STATEMENT_BADGE_REGEX))
      .filter(Boolean)
      .map(m => ({ badge: m[1], body: m[2] }));
    const tableVerdicts =
      answerText && tableStmts.length === rows.length
        ? computeVerdicts(tableStmts, answerText, clean)
        : null;

    return (
      <div className={`pyq-rendered-question ${className}`}>
        {introLines.length > 0 && (
          <div className="pyq-question-intro">
            {highlightQuestionPolarity(introLines.join('\n'))}
            {showQpBadge && qpCode && <span className="pyq-qp-badge">QP: {qpCode}</span>}
          </div>
        )}
        <div className="pyq-table-container">
          <table className="pyq-table">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => {
                const v = tableVerdicts ? tableVerdicts[normBadge(tableStmts[rIdx].badge)] : null;
                return (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>
                        {cIdx === row.length - 1 && v ? (
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span>{cell}</span>
                            <span
                              className={`statement-verdict-pill ${v}`}
                              style={{ flexShrink: 0 }}
                              aria-label={v === 'correct' ? 'ശരിയായ ജോഡി' : 'തെറ്റായ ജോഡി'}
                            >
                              {v === 'correct' ? <CheckIcon size={12} /> : <XIcon size={12} />}
                              <span className="verdict-pill-text">{v === 'correct' ? 'ശരി' : 'തെറ്റ്'}</span>
                            </span>
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {outroLines.length > 0 && (
          <div className="pyq-question-intro" style={{ marginTop: '8px' }}>
            {highlightQuestionPolarity(outroLines.join('\n'))}
          </div>
        )}
      </div>
    );
  }

  // 2. Only split inline statements if at least 2 valid badges exist
  // This prevents abbreviations like (OPEC), (WHO), (UN) from being mistaken as bullets
  const potentialBadges = [...clean.matchAll(BADGE_FINDER_REGEX)].map(m => m[1]);
  if (potentialBadges.length >= 2) {
    clean = clean.replace(INLINE_STATEMENT_REGEX, '$1\n$2 ');
  }

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);

  // Check for genuine statements list (must have at least 2 statements)
  const statements = [];
  const introLines = [];

  lines.forEach(l => {
    const match = l.match(STATEMENT_BADGE_REGEX);
    if (match) {
      statements.push({ badge: match[1], body: match[2] });
    } else {
      introLines.push(l);
    }
  });

  const [statementMarks, setStatementMarks] = useState({});

  useEffect(() => {
    setStatementMarks({});
  }, [text]);

  const cycleStatementMark = (idx) => {
    setStatementMarks(prev => {
      const cur = prev[idx] || 'none';
      const next = cur === 'none' ? 'correct' : cur === 'correct' ? 'wrong' : 'none';
      return { ...prev, [idx]: next };
    });
  };

  const setDirectWrong = (idx) => {
    setStatementMarks(prev => ({
      ...prev,
      [idx]: prev[idx] === 'wrong' ? 'none' : 'wrong'
    }));
  };

  if (statements.length >= 2) {
    const orderedStmts = computeOrderedStatements(statements, answerText, introLines.join(' '));
    let verdicts = orderedStmts ? null : computeVerdicts(statements, answerText, clean);
    // Hand-checked verdicts stored with the question, e.g. "cwww" (c = correct, w = wrong)
    if (!orderedStmts && typeof verdictOverride === 'string' && verdictOverride.length === statements.length) {
      verdicts = {};
      statements.forEach((st, i) => { verdicts[normBadge(st.badge)] = verdictOverride[i] === 'c' ? 'correct' : 'wrong'; });
    }
    if (orderedStmts) {
      return (
        <div className={`pyq-rendered-question ${className}`}>
          {introLines.length > 0 && (
            <div className="pyq-question-intro">
              <span>{highlightQuestionPolarity(introLines.join('\n'))}</span>
              {showQpBadge && qpCode && <span className="pyq-qp-badge">QP: {qpCode}</span>}
            </div>
          )}
          <div className="pyq-statements-list">
            {orderedStmts.map((st, idx) => (
              <div key={idx} className="pyq-statement-item statement-marked-correct">
                <span className="pyq-statement-badge">{st.badge}</span>
                <span className="pyq-statement-body" style={{ textDecoration: 'none', opacity: 1 }}>{st.body}</span>
                <span
                  className="scratch-checkbox statement-scratch correct"
                  style={{ fontWeight: 700, fontSize: '0.78rem' }}
                  aria-label={`Order ${idx + 1}`}
                >
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className={`pyq-rendered-question ${className}`}>
        {introLines.length > 0 && (
          <div className="pyq-question-intro">
            <span>{highlightQuestionPolarity(introLines.join('\n'))}</span>
            {showQpBadge && qpCode && <span className="pyq-qp-badge">QP: {qpCode}</span>}
          </div>
        )}
        {!verdicts && (
        <div className="statement-scratch-guide">
          <span className="scratch-guide-label">Statements</span>
          <span className="scratch-guide-pill">
            <span className="scratch-guide-step"><span className="step-tag correct"><CheckIcon size={10} /></span> 1-tap</span>
            <span className="scratch-guide-sep">•</span>
            <span className="scratch-guide-step"><span className="step-tag wrong"><XIcon size={10} /></span> 2-tap</span>
            <span className="scratch-guide-sep">•</span>
            <span className="scratch-guide-step">3-tap clear</span>
          </span>
        </div>
        )}
        <div className="pyq-statements-list">
          {statements.map((st, idx) => {
            const verdict = verdicts ? verdicts[normBadge(st.badge)] : null;
            const markStatus = verdict || statementMarks[idx] || 'none';
            if (verdict) {
              const isEnglishQ = !/[\u0D00-\u0D7F]/.test(clean || '');
              const verdictLabel = verdict === 'correct' ? (isEnglishQ ? 'Correct' : 'ശരി') : (isEnglishQ ? 'Incorrect' : 'തെറ്റ്');
              return (
                <div
                  key={idx}
                  className={`pyq-statement-item ${verdict === 'correct' ? 'statement-marked-correct' : 'statement-marked-wrong'}`}
                >
                  <span className="pyq-statement-badge">{st.badge}</span>
                  <span className="pyq-statement-body" style={{ textDecoration: 'none', opacity: 1 }}>{st.body}</span>
                  <span
                    className={`statement-verdict-pill ${verdict}`}
                    aria-label={verdictLabel}
                  >
                    {verdict === 'correct' ? <CheckIcon size={12} /> : <XIcon size={12} />}
                    <span className="verdict-pill-text">{verdictLabel}</span>
                  </span>
                </div>
              );
            }
            return (
              <div
                key={idx}
                className={`pyq-statement-item ${
                  markStatus === 'correct' ? 'statement-marked-correct' :
                  markStatus === 'wrong' ? 'statement-marked-wrong' : ''
                }`}
                onClick={() => cycleStatementMark(idx)}
              >
                <span className="pyq-statement-badge">{st.badge}</span>
                <span className="pyq-statement-body">{st.body}</span>
                <button
                  type="button"
                  className={`scratch-checkbox statement-scratch ${markStatus}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    cycleStatementMark(idx);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDirectWrong(idx);
                  }}
                  aria-label={`Mark statement ${st.badge}`}
                >
                  {markStatus === 'correct' && <CheckIcon size={14} />}
                  {markStatus === 'wrong' && <XIcon size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Regular single or multi-line question: if it asks a positive/negative or "which of the following" question in Browse Mode, show the options with ✓ / ✗
  const kwMatches = [...clean.matchAll(POLARITY_KW_REGEX)];
  const showOptionStatements =
    Array.isArray(options) &&
    options.length >= 2 &&
    typeof answerIndex === 'number' &&
    !options.some(o => /^ഓപ്ഷൻ\s*[A-D]$/i.test(String(o || '').trim())) &&
    (kwMatches.length > 0 || NEEDS_OPTIONS_REGEX.test(clean));

  if (showOptionStatements) {
    const hasNegKw = kwMatches.some(m => Boolean(m[2]));
    const ansOpt = String(options[answerIndex] || '');
    const isAllAns = ALL_ANS.test(ansOpt);
    const isNoneAns = NONE_ANS.test(ansOpt);
    const optBadges = ['(A)', '(B)', '(C)', '(D)', '(E)'];

    return (
      <div className={`pyq-rendered-question ${className}`}>
        <div className="pyq-question-intro">
          <span>{highlightQuestionPolarity(clean)}</span>
          {showQpBadge && qpCode && <span className="pyq-qp-badge">QP: {qpCode}</span>}
        </div>
        <div className="pyq-statements-list">
          {options.map((opt, oIdx) => {
            const isPicked = oIdx === answerIndex;
            let verdict;
            if (isAllAns) {
              verdict = hasNegKw ? 'wrong' : 'correct';
            } else if (isNoneAns) {
              verdict = isPicked ? 'correct' : (hasNegKw ? 'correct' : 'wrong');
            } else {
              verdict = (hasNegKw ? !isPicked : isPicked) ? 'correct' : 'wrong';
            }
            const isEnglishQ = !/[\u0D00-\u0D7F]/.test(clean || '');
            const verdictText = verdict === 'correct' ? (isEnglishQ ? 'Correct' : 'ശരി') : (isEnglishQ ? 'Incorrect' : 'തെറ്റ്');
            return (
              <div
                key={oIdx}
                className={`pyq-statement-item ${verdict === 'correct' ? 'statement-marked-correct' : 'statement-marked-wrong'}`}
              >
                <span className="pyq-statement-badge">{optBadges[oIdx] || `(${oIdx + 1})`}</span>
                <span className="pyq-statement-body" style={{ textDecoration: 'none', opacity: 1 }}>{opt}</span>
                <span
                  className={`statement-verdict-pill ${verdict}`}
                  aria-label={verdictText}
                >
                  {verdict === 'correct' ? <CheckIcon size={12} /> : <XIcon size={12} />}
                  <span className="verdict-pill-text">{verdictText}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`pyq-rendered-question ${className}`}>
      <span className="pyq-question-intro">
        {highlightQuestionPolarity(clean)}
        {showQpBadge && qpCode && <span className="pyq-qp-badge">QP: {qpCode}</span>}
      </span>
    </div>
  );
}
