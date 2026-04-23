import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  loadInvoices, saveInvoices, loadTheme, saveTheme,
  calcItemTotal, calcInvoiceTotal, getPaymentDue
} from '../utils/invoiceUtils';

const InvoiceContext = createContext(null);

const initialState = {
  invoices: loadInvoices(),
  theme: loadTheme(),
  filterStatuses: [],
  showForm: false,
  editingId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_THEME': {
      saveTheme(action.payload);
      return { ...state, theme: action.payload };
    }
    case 'SET_FILTER': {
      const { status, checked } = action.payload;
      const next = checked
        ? [...state.filterStatuses, status]
        : state.filterStatuses.filter(s => s !== status);
      return { ...state, filterStatuses: next };
    }
    case 'OPEN_NEW_FORM':
      return { ...state, showForm: true, editingId: null };
    case 'OPEN_EDIT_FORM':
      return { ...state, showForm: true, editingId: action.payload };
    case 'CLOSE_FORM':
      return { ...state, showForm: false, editingId: null };
    case 'SAVE_INVOICE': {
      const invoice = action.payload;
      const items = (invoice.items || []).map(item => ({
        ...item,
        id: item.id || uuidv4(),
        total: calcItemTotal(item.quantity, item.price)
      }));
      const total = calcInvoiceTotal(items);
      const paymentDue = getPaymentDue(invoice.createdAt, invoice.paymentTerms);
      const updated = { ...invoice, items, total, paymentDue };

      const exists = state.invoices.find(i => i.id === invoice.id);
      const invoices = exists
        ? state.invoices.map(i => i.id === invoice.id ? updated : i)
        : [...state.invoices, updated];

      saveInvoices(invoices);
      return { ...state, invoices, showForm: false, editingId: null };
    }
    case 'DELETE_INVOICE': {
      const invoices = state.invoices.filter(i => i.id !== action.payload);
      saveInvoices(invoices);
      return { ...state, invoices };
    }
    case 'MARK_PAID': {
      const invoices = state.invoices.map(i =>
        i.id === action.payload ? { ...i, status: 'paid' } : i
      );
      saveInvoices(invoices);
      return { ...state, invoices };
    }
    default:
      return state;
  }
}

export function InvoiceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  const toggleFilter = (status, checked) => {
    dispatch({ type: 'SET_FILTER', payload: { status, checked } });
  };

  const filteredInvoices = state.filterStatuses.length === 0
    ? state.invoices
    : state.invoices.filter(i => state.filterStatuses.includes(i.status));

  return (
    <InvoiceContext.Provider value={{
      invoices: state.invoices,
      filteredInvoices,
      theme: state.theme,
      filterStatuses: state.filterStatuses,
      showForm: state.showForm,
      editingId: state.editingId,
      toggleTheme,
      toggleFilter,
      openNewForm: () => dispatch({ type: 'OPEN_NEW_FORM' }),
      openEditForm: (id) => dispatch({ type: 'OPEN_EDIT_FORM', payload: id }),
      closeForm: () => dispatch({ type: 'CLOSE_FORM' }),
      saveInvoice: (invoice) => dispatch({ type: 'SAVE_INVOICE', payload: invoice }),
      deleteInvoice: (id) => dispatch({ type: 'DELETE_INVOICE', payload: id }),
      markPaid: (id) => dispatch({ type: 'MARK_PAID', payload: id }),
      getInvoice: (id) => state.invoices.find(i => i.id === id),
    }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoices = () => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error('useInvoices must be used within InvoiceProvider');
  return ctx;
};
