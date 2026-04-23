import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';

export const generateId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const l1 = letters[Math.floor(Math.random() * 26)];
  const l2 = letters[Math.floor(Math.random() * 26)];
  const nums = String(Math.floor(Math.random() * 9000) + 1000);
  return `${l1}${l2}${nums}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
};

export const calcItemTotal = (qty, price) => {
  const q = parseFloat(qty) || 0;
  const p = parseFloat(price) || 0;
  return q * p;
};

export const calcInvoiceTotal = (items) => {
  return (items || []).reduce((sum, item) => {
    return sum + calcItemTotal(item.quantity, item.price);
  }, 0);
};

export const getPaymentDue = (createdAt, paymentTerms) => {
  if (!createdAt) return '';
  const days = parseInt(paymentTerms) || 0;
  return format(addDays(new Date(createdAt), days), 'yyyy-MM-dd');
};

const sampleInvoices = [
  {
    id: 'RT3080',
    createdAt: '2021-08-18',
    paymentDue: '2021-08-19',
    description: 'Re-branding',
    paymentTerms: 1,
    clientName: 'Jensen Huang',
    clientEmail: 'jensenh@mail.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '106 Kendell Street', city: 'Sharrington', postCode: 'NR24 5WQ', country: 'United Kingdom' },
    items: [
      { id: uuidv4(), name: 'Brand Guidelines', quantity: 1, price: 1800.90, total: 1800.90 }
    ],
    total: 1800.90
  },
  {
    id: 'XM9141',
    createdAt: '2021-08-21',
    paymentDue: '2021-09-20',
    description: 'Graphic Design',
    paymentTerms: 30,
    clientName: 'Alex Grim',
    clientEmail: 'alexgrim@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '84 Church Way', city: 'Bradford', postCode: 'BD1 9PB', country: 'United Kingdom' },
    items: [
      { id: uuidv4(), name: 'Banner Design', quantity: 1, price: 156.00, total: 156.00 },
      { id: uuidv4(), name: 'Email Design', quantity: 2, price: 200.00, total: 400.00 }
    ],
    total: 556.00
  },
  {
    id: 'RG0314',
    createdAt: '2021-09-24',
    paymentDue: '2021-10-01',
    description: 'Website Redesign',
    paymentTerms: 7,
    clientName: 'John Morrison',
    clientEmail: 'jm@myco.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '79 Dover Road', city: 'Westhall', postCode: 'IP19 3PF', country: 'United Kingdom' },
    items: [
      { id: uuidv4(), name: 'Website Redesign', quantity: 1, price: 14002.33, total: 14002.33 }
    ],
    total: 14002.33
  },
  {
    id: 'RT2080',
    createdAt: '2021-10-11',
    paymentDue: '2021-10-12',
    description: 'Logo Concept',
    paymentTerms: 1,
    clientName: 'Alysa Werner',
    clientEmail: 'awerner@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '63 Warwick Road', city: 'Carlisle', postCode: 'CA20 2TG', country: 'United Kingdom' },
    items: [
      { id: uuidv4(), name: 'Logo Sketches', quantity: 1, price: 102.04, total: 102.04 }
    ],
    total: 102.04
  },
  {
    id: 'AA1449',
    createdAt: '2021-10-7',
    paymentDue: '2021-10-14',
    description: 'Re-branding',
    paymentTerms: 7,
    clientName: 'Mellisa Clarke',
    clientEmail: 'mellisa.clarke@example.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '46 Abbey Row', city: 'Cambridge', postCode: 'CB5 6EG', country: 'United Kingdom' },
    items: [
      { id: uuidv4(), name: 'New Logo', quantity: 1, price: 1532.33, total: 1532.33 },
      { id: uuidv4(), name: 'Brand Guidelines', quantity: 1, price: 2500.00, total: 2500.00 }
    ],
    total: 4032.33
  },
  {
    id: 'TY9141',
    createdAt: '2021-10-01',
    paymentDue: '2021-10-31',
    description: 'Landing Page Design',
    paymentTerms: 30,
    clientName: 'Thomas Wayne',
    clientEmail: 'thomas@wayne.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '3964 Queens Lane', city: 'Gotham', postCode: 'MK17 9BE', country: 'United Kingdom' },
    items: [
      { id: uuidv4(), name: 'Design', quantity: 1, price: 6155.91, total: 6155.91 }
    ],
    total: 6155.91
  },
  {
    id: 'FV2353',
    createdAt: '2021-11-05',
    paymentDue: '2021-11-12',
    description: 'Logo Re-design',
    paymentTerms: 7,
    clientName: 'Anita Wainwright',
    clientEmail: '',
    status: 'draft',
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: [
      { id: uuidv4(), name: 'Logo Re-design', quantity: 1, price: 3102.04, total: 3102.04 }
    ],
    total: 3102.04
  }
];

export const loadInvoices = () => {
  try {
    const stored = localStorage.getItem('invoices');
    if (stored) return JSON.parse(stored);
    return sampleInvoices;
  } catch {
    return sampleInvoices;
  }
};

export const saveInvoices = (invoices) => {
  try {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  } catch (e) {
    console.error('Failed to save invoices', e);
  }
};

export const loadTheme = () => {
  return localStorage.getItem('theme') || 'light';
};

export const saveTheme = (theme) => {
  localStorage.setItem('theme', theme);
};

export const createEmptyInvoice = () => ({
  id: generateId(),
  createdAt: format(new Date(), 'yyyy-MM-dd'),
  paymentDue: '',
  description: '',
  paymentTerms: 30,
  clientName: '',
  clientEmail: '',
  status: 'draft',
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [{ id: uuidv4(), name: '', quantity: 1, price: 0, total: 0 }],
  total: 0
});

export const validateInvoice = (invoice, isDraft = false) => {
  const errors = {};

  if (!isDraft) {
    if (!invoice.senderAddress?.street?.trim()) errors.senderStreet = "can't be empty";
    if (!invoice.senderAddress?.city?.trim()) errors.senderCity = "can't be empty";
    if (!invoice.senderAddress?.postCode?.trim()) errors.senderPostCode = "can't be empty";
    if (!invoice.senderAddress?.country?.trim()) errors.senderCountry = "can't be empty";
    if (!invoice.clientName?.trim()) errors.clientName = "can't be empty";
    if (!invoice.clientEmail?.trim()) {
      errors.clientEmail = "can't be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invoice.clientEmail)) {
      errors.clientEmail = "invalid email";
    }
    if (!invoice.clientAddress?.street?.trim()) errors.clientStreet = "can't be empty";
    if (!invoice.clientAddress?.city?.trim()) errors.clientCity = "can't be empty";
    if (!invoice.clientAddress?.postCode?.trim()) errors.clientPostCode = "can't be empty";
    if (!invoice.clientAddress?.country?.trim()) errors.clientCountry = "can't be empty";
    if (!invoice.createdAt) errors.createdAt = "can't be empty";
    if (!invoice.description?.trim()) errors.description = "can't be empty";

    if (!invoice.items || invoice.items.length === 0) {
      errors.items = 'An item must be added';
    } else {
      const itemErrors = {};
      invoice.items.forEach((item, i) => {
        if (!item.name?.trim()) itemErrors[`item_${i}_name`] = "can't be empty";
        if (!item.quantity || item.quantity <= 0) itemErrors[`item_${i}_qty`] = 'must be > 0';
        if (item.price === undefined || item.price < 0) itemErrors[`item_${i}_price`] = 'must be ≥ 0';
      });
      if (Object.keys(itemErrors).length > 0) Object.assign(errors, itemErrors);
    }
  }

  return errors;
};
