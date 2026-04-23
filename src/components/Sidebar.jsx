import { useInvoices } from '../context/InvoiceContext';

const Logo = () => (
  <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M20.513 0C24.965 2.309 28 6.922 28 12.22 28 19.343 22.568 25.144 15.585 25.664L20.513 0Z"
      fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd"
      d="M7.487 25.664C2.854 24.194 0 19.583 0 12.22 0 5.899 3.034 1.287 7.487 0L7.487 25.664Z"
      fill="white" fillOpacity="0.5"/>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.994 1.5v-1.5M9.994 20v-1.5M3.523 3.523L2.462 2.461M17.537 17.537l-1.061-1.061M1.5 10h1.5M20 10h-1.5M3.523 16.477l-1.061 1.062M17.537 2.463l-1.061 1.061"
      stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="9.994" cy="10" r="4.5" stroke="#858BB2" strokeWidth="1.5"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M9.148 2.202A7.931 7.931 0 0 0 17.73 9.148 7.917 7.917 0 0 1 10 18a8 8 0 0 1-.852-15.798Z"
      stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Sidebar() {
  const { theme, toggleTheme } = useInvoices();

  return (
    <nav className="sidebar" role="navigation" aria-label="Main navigation">
      <a href="/" className="sidebar-logo-wrap" aria-label="Invoice App - go to home">
        <Logo />
      </a>

      <div className="sidebar-bottom">
        <button
          className="theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <div className="sidebar-hr" role="separator" />
        <div className="avatar" aria-label="User avatar" aria-hidden="true">
          <img
            src="/avatar.jpg"
            alt="User avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        </div>
      </div>
    </nav>
  );
}
