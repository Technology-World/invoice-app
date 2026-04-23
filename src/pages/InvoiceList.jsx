import { Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import Filter from '../components/Filter';
import { formatDate, formatCurrency } from '../utils/invoiceUtils';

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
    <path d="M6.313 0v4.688H11v1.625H6.313V11H4.687V6.313H0V4.687h4.688V0h1.624z"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
    <path d="M1 1l4.228 4.228L1 9.456" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmptyIllustration = () => (
  <svg width="242" height="200" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="121" cy="158" rx="121" ry="42" fill="var(--row-bg)"/>
    <rect x="56" y="34" width="130" height="156" rx="8" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1"/>
    <rect x="72" y="65" width="98" height="8" rx="4" fill="var(--border)"/>
    <rect x="72" y="80" width="60" height="8" rx="4" fill="var(--border)"/>
    <rect x="72" y="104" width="98" height="8" rx="4" fill="var(--border)"/>
    <rect x="72" y="120" width="60" height="8" rx="4" fill="var(--border)"/>
    <rect x="72" y="144" width="98" height="8" rx="4" fill="var(--border)"/>
    <rect x="72" y="160" width="60" height="8" rx="4" fill="var(--border)"/>
    <circle cx="121" cy="42" r="22" fill="var(--purple)"/>
    <path d="M121 32v20M111 42h20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export default function InvoiceList() {
  const { filteredInvoices, invoices, filterStatuses, openNewForm } = useInvoices();
  const count = filteredInvoices.length;

  const countLabel = filterStatuses.length > 0
    ? `${count} result${count !== 1 ? 's' : ''}`
    : `${count} invoice${count !== 1 ? 's' : ''}`;

  return (
    <main className="main-content" id="main-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Invoices</h1>
          <p aria-live="polite" aria-atomic="true">{countLabel}</p>
        </div>
        <div className="page-header-right">
          <Filter />
          <button
            className="btn btn-new"
            onClick={openNewForm}
            aria-label="Create new invoice"
          >
            <span className="icon-circle" aria-hidden="true">
              <PlusIcon />
            </span>
            New <span className="mobile-hide">&nbsp;Invoice</span>
          </button>
        </div>
      </div>

      {/* List or empty */}
      {filteredInvoices.length === 0 ? (
        <div className="empty" role="status">
          <EmptyIllustration aria-hidden="true" />
          <h2>There is nothing here</h2>
          <p>
            {invoices.length === 0
              ? 'Create an invoice by clicking the New Invoice button and get started.'
              : 'Try adjusting the filter to show more invoices.'}
          </p>
        </div>
      ) : (
        <ul className="invoice-list" role="list" aria-label="Invoice list">
          {filteredInvoices.map(inv => (
            <li key={inv.id}>
              <Link
                to={`/invoice/${inv.id}`}
                className="invoice-card"
                aria-label={`Invoice ${inv.id} for ${inv.clientName}, due ${formatDate(inv.paymentDue)}, ${formatCurrency(inv.total)}, status: ${inv.status}`}
              >
                <span className="ic-id"><span>#</span>{inv.id}</span>
                <span className="ic-due">Due {formatDate(inv.paymentDue) || '—'}</span>
                <span className="ic-client">{inv.clientName || '—'}</span>
                <span className="ic-amount">{formatCurrency(inv.total)}</span>
                <StatusBadge status={inv.status} />
                <span className="ic-arrow" aria-hidden="true"><ArrowRight /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
