/**
 * Utility to sanitize explanation strings across the app.
 * Strips out Kerala PSC Question Paper codes, question numbers, and citation brackets,
 * e.g., "[Kerala PSC QP Code: 056/2026-M, Qn. 9, Option D]" or "[QP: 056/2025-M]".
 * Preserves grammar brackets (e.g. [noun], [adjective]) and mathematical steps.
 */
export function cleanExplanation(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    // Matches brackets referencing Kerala PSC, QP Code, Question Paper, Qn, etc.
    .replace(/\s*\[(?:Kerala\s*PSC|PSC|QP(?:\s*Code)?|Question\s*Paper)[^\]]*\]/gi, '')
    .replace(/\s*\[[^\]]*(?:QP\s*Code|Question\s*Paper|Kerala\s*PSC)[^\]]*\]/gi, '')
    .trim();
}

export default cleanExplanation;
