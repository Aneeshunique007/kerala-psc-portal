import React from 'react';

// True statement bullets in Kerala PSC: (a)-(e), (i)-(v), (1)-(9), or 1.-9.
const STATEMENT_BADGE_REGEX = /^(\([a-e]\)|\([ivx]{1,5}\)|\([1-9]\)|[1-9]\.|[a-e]\.)\s*(.+)$/i;
const INLINE_STATEMENT_REGEX = /([^\n])\s+(\([a-e]\)|\([ivx]{1,5}\)|\([1-9]\)|[1-9]\.|[a-e]\.)\s+/gi;
const BADGE_FINDER_REGEX = /(\([a-e]\)|\([ivx]{1,5}\)|\([1-9]\)|[1-9]\.|[a-e]\.)\s+/gi;

export default function FormattedQuestion({ text, className = '', showQpBadge = false }) {
  if (!text) return null;

  // Extract [QP: ...] code if present
  let qpCode = null;
  let clean = text.replace(/\[QP:\s*([^\]]+)\]/gi, (_, code) => {
    qpCode = code.trim();
    return '';
  }).replace(/[ \t]{2,}/g, ' ').trim();

  // 1. Check for markdown table FIRST on raw lines (before splitting inline badges)
  // This ensures badges like (i), (a) inside table cells do not corrupt the table structure
  const rawLines = clean.split('\n').map(l => l.trim()).filter(Boolean);
  const tableLines = rawLines.filter(l => l.startsWith('|') && l.endsWith('|'));
  if (tableLines.length >= 2) {
    const introLines = rawLines.filter(l => !l.startsWith('|'));
    const headerLine = tableLines[0];
    const headers = headerLine.split('|').map(c => c.trim()).filter(Boolean);
    const rowLines = tableLines.slice(1).filter(l => !l.includes('---'));
    const rows = rowLines.map(r => r.split('|').map(c => c.trim()).filter(Boolean));

    return (
      <div className={`pyq-rendered-question ${className}`}>
        {introLines.length > 0 && (
          <div className="pyq-question-intro">
            {introLines.join('\n')}
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
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. Only split inline statements if at least 2 valid badges exist
  // This prevents abbreviations like (OPEC), (WHO), (UN) from being mistaken as bullets
  const potentialBadges = clean.match(BADGE_FINDER_REGEX) || [];
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

  if (statements.length >= 2) {
    return (
      <div className={`pyq-rendered-question ${className}`}>
        {introLines.length > 0 && (
          <div className="pyq-question-intro">
            <span>{introLines.join(' ')}</span>
            {showQpBadge && qpCode && <span className="pyq-qp-badge">QP: {qpCode}</span>}
          </div>
        )}
        <div className="pyq-statements-list">
          {statements.map((st, idx) => (
            <div key={idx} className="pyq-statement-item">
              <span className="pyq-statement-badge">{st.badge}</span>
              <span className="pyq-statement-body">{st.body}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Regular single or multi-line question (including parenthetical terms like (OPEC), (WHO))
  return (
    <div className={`pyq-rendered-question ${className}`}>
      <span className="pyq-question-intro">
        {clean}
        {showQpBadge && qpCode && <span className="pyq-qp-badge">QP: {qpCode}</span>}
      </span>
    </div>
  );
}
