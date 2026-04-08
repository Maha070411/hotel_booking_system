import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    window.location.href = '/';
  };

  return (
    <nav className="nav-bar premium-nav">
      <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {location.pathname !== '/' && (
          <Link to="/" className="back-arrow-premium-main" title="Go to Home">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Home</span>
          </Link>
        )}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="brand-icon">
            <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z"/></svg>
          </div>
          <span className="brand-text">Luxe<span style={{ color: 'var(--primary)' }}>Stays</span></span>
        </Link>
      </div>
      <div className="nav-links">
        {token && (
          <>
            {role === 'ROLE_USER' && <Link to="/profile" className="nav-item">My Bookings</Link>}
            {role === 'ROLE_ADMIN' && <Link to="/" className="nav-item">Admin Dashboard</Link>}
            {/* Dashboard link removed as admin features are now on the home page */}
            <button className="btn-logout-premium" onClick={handleLogout}>Log Out</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
