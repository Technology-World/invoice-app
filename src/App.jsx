import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvoiceProvider, useInvoices } from './context/InvoiceContext';
import Sidebar from './components/Sidebar';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';

function AppShell() {
  const { showForm } = useInvoices();
  return (
    <div className="app-layout">
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#main-content"
        style={{
          position: 'absolute', left: '-9999px', top: '8px',
          background: 'var(--purple)', color: 'white',
          padding: '8px 16px', zIndex: 9999,
          borderRadius: '0 0 8px 0', fontWeight: 700,
        }}
        onFocus={e => { e.currentTarget.style.left = '0'; }}
        onBlur={e => { e.currentTarget.style.left = '-9999px'; }}
      >
        Skip to main content
      </a>

      <Sidebar />

      <div className="page-content">
        <Routes>
          <Route path="/"            element={<InvoiceList />} />
          <Route path="/invoice/:id" element={<InvoiceDetail />} />
        </Routes>
      </div>

      {showForm && <InvoiceForm />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <InvoiceProvider>
        <AppShell />
      </InvoiceProvider>
    </BrowserRouter>
  );
}
