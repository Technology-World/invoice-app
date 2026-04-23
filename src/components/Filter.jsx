import { useState, useRef, useEffect } from 'react';
import { useInvoices } from '../context/InvoiceContext';

const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 3.304L3.696 6l5.5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg width="11" height="7" viewBox="0 0 11 7" fill="none"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '150ms ease' }}>
    <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const STATUSES = ['draft', 'pending', 'paid'];

export default function Filter() {
  const { filterStatuses, toggleFilter } = useInvoices();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <div className="filter-wrap" ref={wrapRef}>
      <button
        className={`filter-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Filter by status"
      >
        <span>Filter <span className="mobile-hide">by status</span></span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          className="filter-panel"
          role="listbox"
          aria-multiselectable="true"
          aria-label="Filter options"
        >
          {STATUSES.map(status => (
            <label
              key={status}
              className="filter-option"
              role="option"
              aria-selected={filterStatuses.includes(status)}
            >
              <input
                type="checkbox"
                checked={filterStatuses.includes(status)}
                onChange={e => toggleFilter(status, e.target.checked)}
              />
              <span className="checkbox" aria-hidden="true">
                {filterStatuses.includes(status) && <CheckIcon />}
              </span>
              <span className="label">{status}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
