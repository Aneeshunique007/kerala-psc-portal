import React, { useState, useEffect } from 'react';
import { CheckIcon, XIcon } from './Icons';

// True statement bullets in Kerala PSC: (a)-(e), (i)-(vi), (1)-(9), 1.-9., 1)-9), a.-e., a)-e), i.-vi., i)-vi)
const BADGE_CHARS = '\\([a-e]\\)|\\([ivx]{1,6}\\)|\\([1-9]\\)|[1-9]\\.|[1-9]\\)|[a-e]\\.|[a-e]\\)|[ivx]{1,6}\\.|[ivx]{1,6}\\)';
const BADGE_FINDER_REGEX = new RegExp('(?:^|\\s)(?<![a-z\\.])(' + BADGE_CHARS + ')(?=\\s+)', 'gi');
const INLINE_STATEMENT_REGEX = new RegExp('([^\\n])\\s+(?<![a-z\\.])(' + BADGE_CHARS + ')\\s+', 'gi');
const STATEMENT_BADGE_REGEX = new RegExp('^(' + BADGE_CHARS + ')\\s*(.+)$', 'i');

export default function FormattedQuestion({ text, className = '', showQpBadge = false }) {
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
    return (
      <div className={`pyq-rendered-question ${className}`}>
        {introLines.length > 0 && (
          <div className="pyq-question-intro">
            <span>{introLines.join(' ')}</span>
            {showQpBadge && qpCode && <span className="pyq-qp-badge">QP: {qpCode}</span>}
          </div>
        )}
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
        <div className="pyq-statements-list">
          {statements.map((st, idx) => {
            const markStatus = statementMarks[idx] || 'none';
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
