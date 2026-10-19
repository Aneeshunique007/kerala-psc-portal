import React, { useEffect } from 'react';
import { AlertTriangleIcon } from './Icons';

export default function ConfirmModal({
  isOpen,
  title = 'Confirmation',
  highlight = '',
  message = '',
  details = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon = null,
  variant = 'warning', // 'warning' | 'danger'
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div 
        className="confirm-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="confirm-modal-header">
          <div className={`confirm-icon-badge ${isDanger ? 'badge-danger' : 'badge-warning'}`}>
            {icon || <AlertTriangleIcon size={22} />}
          </div>
          <button 
            type="button" 
            className="confirm-close-btn" 
            onClick={onCancel}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="confirm-modal-body">
          <h3 id="confirm-modal-title" className="confirm-modal-title">
            {title}
          </h3>

          {highlight && (
            <div className="confirm-modal-highlight">
              {highlight}
            </div>
          )}

          {message && (
            <p className="confirm-modal-desc">
              {message}
            </p>
          )}

          {details && (
            <div className={`confirm-modal-details ${isDanger ? 'details-danger' : 'details-warning'}`}>
              <span className="details-dot">●</span>
              <span>{details}</span>
            </div>
          )}
        </div>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-btn-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-btn-action ${isDanger ? 'btn-danger' : 'btn-warning'}`}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
