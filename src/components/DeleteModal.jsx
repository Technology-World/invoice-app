import { useEffect, useRef } from 'react';

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') { onCancel(); return; }

      // Focus trap
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="modal" ref={modalRef}>
        <h2 id="modal-title">Confirm Deletion</h2>
        <p id="modal-desc">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} ref={cancelRef}>
            Cancel
          </button>
          <button className="btn btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
