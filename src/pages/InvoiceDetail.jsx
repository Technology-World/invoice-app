import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';
import { formatDate, formatCurrency } from '../utils/invoiceUtils';

const BackArrow = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1L1.772 5.228 6 9.456" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, deleteInvoice, markPaid, openEditForm } = useInvoices();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const invoice = getInvoice(id);

  if (!invoice) {
    return (
      <main className="main-content" id="main-content">
        <button className="detail-back-btn" onClick={() => navigate('/')}>
          <BackArrow />&nbsp; Go back
        </button>
        <p style={{ color: 'var(--text-secondary)' }}>Invoice not found.</p>
      </main>
    );
  }

  const handleDelete = () => {
    deleteInvoice(id);
    navigate('/');
  };

  // Action buttons — rendered in both desktop status bar and mobile footer
  const ActionButtons = () => (
    <>
      {invoice.status !== 'paid' && (
        <button className="btn btn-edit" onClick={() => openEditForm(id)} aria-label={`Edit invoice ${id}`}>
          Edit
        </button>
      )}
      <button className="btn btn-delete" onClick={() => setShowDeleteModal(true)} aria-label={`Delete invoice ${id}`}>
        Delete
      </button>
      {invoice.status === 'pending' && (
        <button className="btn btn-mark-paid" onClick={() => markPaid(id)} aria-label={`Mark invoice ${id} as paid`}>
          Mark as Paid
        </button>
      )}
    </>
  );

  return (
    <main className="main-content" id="main-content" style={{ paddingBottom: '60px' }}>

      {/* ── Back ─────────────────────────────────────────── */}
      <button
        className="detail-back-btn"
        onClick={() => navigate('/')}
        aria-label="Go back to invoice list"
      >
        <BackArrow />&nbsp; Go back
      </button>

      {/* ── Status bar ───────────────────────────────────── */}
      <div className="detail-status-bar">
        <span className="detail-status-label">Status</span>
        <StatusBadge status={invoice.status} />
        {/* Desktop actions */}
        <div className="detail-actions-desktop">
          <ActionButtons />
        </div>
      </div>

      {/* ── Invoice body ─────────────────────────────────── */}
      <article className="detail-body" aria-label={`Invoice ${invoice.id} details`}>

        {/* Top row: ID + description left, sender address right */}
        <div className="detail-top-row">
          <div>
            <p className="detail-id"><span>#</span>{invoice.id}</p>
            <p className="detail-description">{invoice.description || '—'}</p>
          </div>
          <address className="detail-sender-addr" aria-label="Sender address">
            <p>{invoice.senderAddress?.street || ''}</p>
            <p>{invoice.senderAddress?.city || ''}</p>
            <p>{invoice.senderAddress?.postCode || ''}</p>
            <p>{invoice.senderAddress?.country || ''}</p>
          </address>
        </div>

        {/* Meta row: Date | Due | Bill To | Sent To */}
        <div className="detail-meta-grid">
          <div className="detail-meta-col">
            <div className="detail-meta-item">
              <p className="meta-label">Invoice Date</p>
              <p className="meta-value">{formatDate(invoice.createdAt)}</p>
            </div>
            <div className="detail-meta-item" style={{ marginTop: '32px' }}>
              <p className="meta-label">Payment Due</p>
              <p className="meta-value">{formatDate(invoice.paymentDue)}</p>
            </div>
          </div>

          <div className="detail-meta-col">
            <div className="detail-meta-item">
              <p className="meta-label">Bill To</p>
              <p className="meta-value" style={{ marginBottom: '8px' }}>{invoice.clientName || '—'}</p>
              <address className="detail-client-addr">
                <p>{invoice.clientAddress?.street || ''}</p>
                <p>{invoice.clientAddress?.city || ''}</p>
                <p>{invoice.clientAddress?.postCode || ''}</p>
                <p>{invoice.clientAddress?.country || ''}</p>
              </address>
            </div>
          </div>

          <div className="detail-meta-col">
            <div className="detail-meta-item">
              <p className="meta-label">Sent To</p>
              <p className="meta-value">{invoice.clientEmail || '—'}</p>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="items-wrapper" role="table" aria-label="Invoice items">
          {/* Header */}
          <div className="items-table-head" role="row" aria-hidden="true">
            <span role="columnheader">Item Name</span>
            <span className="text-right" role="columnheader">QTY.</span>
            <span className="text-right" role="columnheader">Price</span>
            <span className="text-right" role="columnheader">Total</span>
          </div>
          {/* Rows */}
          <div className="items-table-body">
            {(invoice.items || []).map(item => (
              <div key={item.id} className="items-table-row" role="row">
                <div role="cell">
                  <p className="item-name-cell">{item.name}</p>
                  <p className="item-qty-mobile">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="text-right item-muted" role="cell">{item.quantity}</p>
                <p className="text-right item-muted" role="cell">{formatCurrency(item.price)}</p>
                <p className="text-right item-bold" role="cell">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
          {/* Total bar */}
          <div className="items-total-bar">
            <p className="total-bar-label">Amount Due</p>
            <p className="total-bar-amount">{formatCurrency(invoice.total)}</p>
          </div>
        </div>

      </article>

      {/* ── Mobile action bar ────────────────────────────── */}
      <div className="detail-actions-mobile" role="group" aria-label="Invoice actions">
        <ActionButtons />
      </div>

      {/* ── Delete modal ─────────────────────────────────── */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </main>
  );
}
