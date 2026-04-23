import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useInvoices } from '../context/InvoiceContext';
import {
  createEmptyInvoice, validateInvoice,
  calcItemTotal, formatCurrency
} from '../utils/invoiceUtils';

const TrashIcon = () => (
  <svg width="13" height="16" viewBox="0 0 13 16" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M8.47 0L9.28.812H12.5v1.625H0V.812h3.22L4.03 0h4.44zM1.625 16a1.625 1.625 0 01-1.625-1.625V3.25h10.563v11.125A1.625 1.625 0 019.938 16H1.624z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
    <path d="M6.313 0v4.688H11v1.625H6.313V11H4.687V6.313H0V4.687h4.688V0h1.624z"/>
  </svg>
);

export default function InvoiceForm() {
  const { closeForm, saveInvoice, getInvoice, editingId } = useInvoices();
  const isEditing = !!editingId;

  const [form, setForm] = useState(() => {
    if (editingId) {
      const ex = getInvoice(editingId);
      return ex ? JSON.parse(JSON.stringify(ex)) : createEmptyInvoice();
    }
    return createEmptyInvoice();
  });

  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  // Prevent body scroll behind overlay
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Focus first field; ESC closes
  useEffect(() => {
    firstRef.current?.focus();
    const esc = (e) => { if (e.key === 'Escape') closeForm(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [closeForm]);

  /* ── Helpers ─────────────────────────────────────────── */
  const setField = (path, value) => {
    setForm(prev => {
      const parts = path.split('.');
      if (parts.length === 1) return { ...prev, [path]: value };
      const [obj, key] = parts;
      return { ...prev, [obj]: { ...prev[obj], [key]: value } };
    });
    // Clear error on change
    const errKey = path.replace('.', '');
    setErrors(prev => { const e = { ...prev }; delete e[errKey]; return e; });
  };

  const setItem = (idx, field, raw) => {
    const value = (field === 'quantity' || field === 'price') ? raw : raw;
    setForm(prev => {
      const items = prev.items.map((it, i) => {
        if (i !== idx) return it;
        const qty  = field === 'quantity' ? raw : it.quantity;
        const prc  = field === 'price'    ? raw : it.price;
        return { ...it, [field]: raw, total: calcItemTotal(qty, prc) };
      });
      return { ...prev, items };
    });
    const key = `item_${idx}_${field === 'quantity' ? 'qty' : field}`;
    setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const removeItem = (idx) => {
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const handleSave = (status) => {
    const payload = { ...form, status };
    const errs = validateInvoice(payload, status === 'draft');
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    saveInvoice(payload);
  };

  /* ── Derived ─────────────────────────────────────────── */
  const hasErrors  = Object.keys(errors).length > 0;
  const itemsHaveError = Object.keys(errors).some(k => k.startsWith('item_'));

  /* ── Field helpers ───────────────────────────────────── */
  const F = ({ id, label, error, children }) => (
    <div className="form-field">
      <label htmlFor={id} className={error ? 'has-error' : ''}>
        {label}
        {error && <span className="field-error-msg">{error}</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div
      className="form-overlay"
      onClick={e => { if (e.target === e.currentTarget) closeForm(); }}
    >
      <div
        className="form-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-heading"
      >
        {/* ── Scrollable body ──────────────────────────── */}
        <div className="form-scroll-area">
          <h1 className="form-title" id="form-heading">
            {isEditing ? <>Edit <span>#</span>{editingId}</> : 'New Invoice'}
          </h1>

          {/* ── Bill From ─────────────────────────────── */}
          <fieldset className="form-section" style={{ border: 'none' }}>
            <legend className="form-section-title">Bill From</legend>

            <div className="form-row">
              <F id="s-street" label="Street Address" error={errors.senderStreet}>
                <input id="s-street" ref={firstRef}
                  className={`form-input ${errors.senderStreet ? 'error' : ''}`}
                  value={form.senderAddress?.street || ''}
                  onChange={e => setField('senderAddress.street', e.target.value)}
                  aria-invalid={!!errors.senderStreet}
                />
              </F>
            </div>

            <div className="form-row form-grid-3">
              <F id="s-city" label="City" error={errors.senderCity}>
                <input id="s-city"
                  className={`form-input ${errors.senderCity ? 'error' : ''}`}
                  value={form.senderAddress?.city || ''}
                  onChange={e => setField('senderAddress.city', e.target.value)}
                  aria-invalid={!!errors.senderCity}
                />
              </F>
              <F id="s-post" label="Post Code" error={errors.senderPostCode}>
                <input id="s-post"
                  className={`form-input ${errors.senderPostCode ? 'error' : ''}`}
                  value={form.senderAddress?.postCode || ''}
                  onChange={e => setField('senderAddress.postCode', e.target.value)}
                  aria-invalid={!!errors.senderPostCode}
                />
              </F>
              <F id="s-country" label="Country" error={errors.senderCountry}>
                <input id="s-country"
                  className={`form-input ${errors.senderCountry ? 'error' : ''}`}
                  value={form.senderAddress?.country || ''}
                  onChange={e => setField('senderAddress.country', e.target.value)}
                  aria-invalid={!!errors.senderCountry}
                />
              </F>
            </div>
          </fieldset>

          {/* ── Bill To ───────────────────────────────── */}
          <fieldset className="form-section" style={{ border: 'none' }}>
            <legend className="form-section-title">Bill To</legend>

            <div className="form-row">
              <F id="c-name" label="Client's Name" error={errors.clientName}>
                <input id="c-name"
                  className={`form-input ${errors.clientName ? 'error' : ''}`}
                  value={form.clientName || ''}
                  onChange={e => setField('clientName', e.target.value)}
                  aria-invalid={!!errors.clientName}
                />
              </F>
            </div>

            <div className="form-row">
              <F id="c-email" label="Client's Email" error={errors.clientEmail}>
                <input id="c-email" type="email"
                  className={`form-input ${errors.clientEmail ? 'error' : ''}`}
                  value={form.clientEmail || ''}
                  onChange={e => setField('clientEmail', e.target.value)}
                  placeholder="e.g. email@example.com"
                  aria-invalid={!!errors.clientEmail}
                />
              </F>
            </div>

            <div className="form-row">
              <F id="c-street" label="Street Address" error={errors.clientStreet}>
                <input id="c-street"
                  className={`form-input ${errors.clientStreet ? 'error' : ''}`}
                  value={form.clientAddress?.street || ''}
                  onChange={e => setField('clientAddress.street', e.target.value)}
                  aria-invalid={!!errors.clientStreet}
                />
              </F>
            </div>

            <div className="form-row form-grid-3">
              <F id="c-city" label="City" error={errors.clientCity}>
                <input id="c-city"
                  className={`form-input ${errors.clientCity ? 'error' : ''}`}
                  value={form.clientAddress?.city || ''}
                  onChange={e => setField('clientAddress.city', e.target.value)}
                  aria-invalid={!!errors.clientCity}
                />
              </F>
              <F id="c-post" label="Post Code" error={errors.clientPostCode}>
                <input id="c-post"
                  className={`form-input ${errors.clientPostCode ? 'error' : ''}`}
                  value={form.clientAddress?.postCode || ''}
                  onChange={e => setField('clientAddress.postCode', e.target.value)}
                  aria-invalid={!!errors.clientPostCode}
                />
              </F>
              <F id="c-country" label="Country" error={errors.clientCountry}>
                <input id="c-country"
                  className={`form-input ${errors.clientCountry ? 'error' : ''}`}
                  value={form.clientAddress?.country || ''}
                  onChange={e => setField('clientAddress.country', e.target.value)}
                  aria-invalid={!!errors.clientCountry}
                />
              </F>
            </div>
          </fieldset>

          {/* ── Invoice Info ──────────────────────────── */}
          <fieldset className="form-section" style={{ border: 'none' }}>
            <legend className="sr-only">Invoice Info</legend>

            <div className="form-row form-grid-2">
              <F id="inv-date" label="Invoice Date" error={errors.createdAt}>
                <input id="inv-date" type="date"
                  className={`form-input ${errors.createdAt ? 'error' : ''}`}
                  value={form.createdAt || ''}
                  onChange={e => setField('createdAt', e.target.value)}
                  disabled={isEditing}
                  aria-invalid={!!errors.createdAt}
                />
              </F>
              <F id="payment-terms" label="Payment Terms">
                <select id="payment-terms" className="form-input form-select"
                  value={form.paymentTerms || 30}
                  onChange={e => setField('paymentTerms', parseInt(e.target.value))}>
                  <option value={1}>Net 1 Day</option>
                  <option value={7}>Net 7 Days</option>
                  <option value={14}>Net 14 Days</option>
                  <option value={30}>Net 30 Days</option>
                </select>
              </F>
            </div>

            <div className="form-row">
              <F id="description" label="Project / Description" error={errors.description}>
                <input id="description"
                  className={`form-input ${errors.description ? 'error' : ''}`}
                  value={form.description || ''}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="e.g. Graphic Design Service"
                  aria-invalid={!!errors.description}
                />
              </F>
            </div>
          </fieldset>

          {/* ── Item List ─────────────────────────────── */}
          <div style={{ marginBottom: '16px' }}>
            <p className="items-heading">Item List</p>

            {form.items.length > 0 && (
              <div className="items-col-header" aria-hidden="true">
                <span>Item Name</span>
                <span>Qty.</span>
                <span>Price</span>
                <span className="col-right">Total</span>
                <span></span>
              </div>
            )}

            {form.items.map((item, idx) => (
              <div key={item.id} className="item-row-form" role="group" aria-label={`Item ${idx + 1}`}>
                {/* Name */}
                <div>
                  <label htmlFor={`item-name-${idx}`} className="sr-only">Item name</label>
                  <input id={`item-name-${idx}`}
                    className={`form-input ${errors[`item_${idx}_name`] ? 'error' : ''}`}
                    value={item.name}
                    onChange={e => setItem(idx, 'name', e.target.value)}
                    placeholder="Item name"
                    aria-invalid={!!errors[`item_${idx}_name`]}
                  />
                </div>
                {/* Qty */}
                <div>
                  <label htmlFor={`item-qty-${idx}`} className="sr-only">Quantity</label>
                  <input id={`item-qty-${idx}`} type="number" min="1"
                    className={`form-input ${errors[`item_${idx}_qty`] ? 'error' : ''}`}
                    value={item.quantity}
                    onChange={e => setItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    aria-invalid={!!errors[`item_${idx}_qty`]}
                  />
                </div>
                {/* Price */}
                <div>
                  <label htmlFor={`item-price-${idx}`} className="sr-only">Price</label>
                  <input id={`item-price-${idx}`} type="number" min="0" step="0.01"
                    className={`form-input ${errors[`item_${idx}_price`] ? 'error' : ''}`}
                    value={item.price}
                    onChange={e => setItem(idx, 'price', parseFloat(e.target.value) || 0)}
                    aria-invalid={!!errors[`item_${idx}_price`]}
                  />
                </div>
                {/* Total (read-only) */}
                <div className="item-total-static" aria-label={`Total: ${formatCurrency(item.total)}`}>
                  {formatCurrency(item.total)}
                </div>
                {/* Delete */}
                <button type="button" className="item-delete-btn"
                  onClick={() => removeItem(idx)}
                  aria-label={`Delete item ${idx + 1}: ${item.name || 'unnamed'}`}>
                  <TrashIcon />
                </button>
              </div>
            ))}

            {/* Validation messages */}
            {(errors.items || itemsHaveError) && (
              <div className="form-errors-summary" role="alert">
                {errors.items && <p>— {errors.items}</p>}
                {itemsHaveError && <p>— All item fields are required</p>}
              </div>
            )}

            <button type="button" className="add-item-btn" onClick={addItem}>
              <PlusIcon /> &nbsp; Add New Item
            </button>
          </div>

          {/* Global validation summary */}
          {hasErrors && !errors.items && !itemsHaveError && (
            <p role="alert" style={{ color: 'var(--red)', fontSize: '10px', fontWeight: 700, marginBottom: '24px' }}>
              — All fields must be added
            </p>
          )}
        </div>

        {/* ── Sticky footer actions ────────────────────── */}
        {!isEditing ? (
          <div className="form-footer justify-between">
            <button type="button" className="btn btn-discard" onClick={closeForm}>
              Discard
            </button>
            <div className="form-footer-right">
              <button type="button" className="btn btn-draft" onClick={() => handleSave('draft')}>
                Save as Draft
              </button>
              <button type="button" className="btn btn-primary" onClick={() => handleSave('pending')}>
                Save &amp; Send
              </button>
            </div>
          </div>
        ) : (
          <div className="form-footer" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={closeForm}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={() => handleSave(form.status)}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
