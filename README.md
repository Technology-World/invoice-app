# Invoice Management App — Stage 2

A fully responsive Invoice Management Application built with React + Vite.

## Features
- CRUD invoices (Create, Read, Update, Delete)
- Draft / Pending / Paid status flow
- Filter by status (multi-select)
- Light & dark mode (persisted in localStorage)
- Full form validation with inline errors
- Responsive: mobile (320px+), tablet, desktop
- Data persisted via localStorage with 7 sample invoices

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

## Deploy to Vercel
Connect the GitHub repo in the Vercel dashboard — Vite is auto-detected. Or:
```bash
npm i -g vercel && vercel
```

## Architecture

```
src/
├── context/InvoiceContext.jsx   # useReducer global state + localStorage
├── components/
│   ├── Sidebar.jsx              # Nav + theme toggle
│   ├── StatusBadge.jsx          # Reusable status pill
│   ├── Filter.jsx               # Multi-checkbox dropdown
│   ├── InvoiceForm.jsx          # Create/Edit form with validation
│   └── DeleteModal.jsx          # Accessible confirmation modal
├── pages/
│   ├── InvoiceList.jsx          # List view + empty state
│   └── InvoiceDetail.jsx        # Detail view + action bar
├── utils/invoiceUtils.js        # Pure helpers, validators, seed data
└── index.css                    # CSS variables design system
```

**State**: `useReducer` + Context API. All state in one place, dispatched actions update invoices array and persist to localStorage on every mutation.

**Routing**: React Router v6 — `/` (list), `/invoice/:id` (detail).

## Trade-offs
| Decision | Rationale |
|---|---|
| localStorage over IndexedDB | Sufficient scale; simpler API |
| useReducer over Redux | Self-contained state; no external dep needed |
| CSS Variables over Tailwind | Precise Figma token system; clean theme switching |
| Inline SVGs | No icon lib overhead; crisp at all sizes |

## Accessibility
- Semantic HTML: nav, main, article, fieldset, legend
- Skip link ("Skip to main content") at page top
- Focus trapped in DeleteModal (Tab/Shift+Tab); Escape dismisses
- InvoiceForm focuses first input on open
- aria-modal, aria-labelledby, aria-live, aria-invalid throughout
- Errors announced via role="alert"
- Status badges use colour + dot indicator (not colour alone)
- WCAG AA colour contrast in both light and dark themes
- All interactive elements keyboard accessible

## Extras Beyond Requirements
- Slide-in form animation, scale-in modal animation
- Payment due auto-calculated from createdAt + paymentTerms
- Line item totals update live as qty/price change
- Mobile sticky action bar (fixed bottom on small screens)
- 7 realistic seed invoices covering all statuses
