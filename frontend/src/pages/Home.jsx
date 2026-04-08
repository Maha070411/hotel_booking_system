import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import FilterSidebar from '../components/FilterSidebar';

function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [location, setLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminView, setAdminView] = useState('hotels'); // 'hotels', 'categories', 'add-hotel', 'history'
  const [customerHistory, setCustomerHistory] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const fetchHotels = () => {
    setLoading(true);
    setError(null);

    const params = {};
    if (searchQuery) params.query = searchQuery;
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    if (location) params.location = location;
    if (maxPrice) params.maxPrice = maxPrice;
    if (selectedAmenities.length > 0) {
      params.amenities = selectedAmenities.join(',');
    }

    api.get('/hotels', { params })
      .then(res => {
        setHotels(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching hotels:", err);
        setError("Failed to fetch hotels. Please check filters or server status.");
        setLoading(false);
      });
  };

  const fetchHistory = () => {
    api.get('/admin/bookings')
      .then(res => setCustomerHistory(res.data))
      .catch(err => console.error("Error fetching history:", err));
  };

  useEffect(() => {
    if (token) {
      fetchHotels();
      api.get('/amenities')
        .then(res => setAllAmenities(res.data))
        .catch(err => console.error("Error fetching amenities:", err));
      
      if (role === 'ROLE_ADMIN') {
        fetchHistory();
      }
    }
  }, [token, role]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels();
  };

  const toggleAmenity = (name) => {
    setSelectedAmenities(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCheckIn('');
    setCheckOut('');
    setLocation('');
    setMaxPrice('');
    setSelectedAmenities([]);
    setLoading(true);
    api.get('/hotels').then(res => {
      setHotels(res.data);
      setLoading(false);
    });
  };

  const calculatePeriods = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    if (diff <= 0) return 1;
    const hours = diff / (1000 * 60 * 60);
    const periods = Math.ceil(hours / 24);
    return periods === 0 ? 1 : periods;
  };

  const calculatePrice = (basePrice) => {
    const periods = calculatePeriods();
    return (basePrice * periods).toFixed(2);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop';
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '8rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '800', textTransform: 'tight', marginBottom: '1.5rem', color: '#111827' }}>
          Experience Luxury,<br/><span style={{ color: 'var(--primary)' }}>Reimagined.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6B7280', maxWidth: '650px', margin: '0 auto 3rem auto', lineHeight: '1.8' }}>
          Join LuxeStays today to unlock exclusive access to the world's most premium hotel properties, special first-time discounts, and unforgettable experiences.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
           <Link to="/register" className="btn-primary-premium" style={{ textDecoration: 'none', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Create Free Account</Link>
           <Link to="/login" className="btn-login-premium" style={{ textDecoration: 'none', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem' }}>
      {/* Search Header - Only for User */}
      {role !== 'ROLE_ADMIN' && (
        <section className="search-container" style={{ margin: '3rem 0' }}>
          <h1 className="search-title">Discover Your Next Stay</h1>
          <form onSubmit={handleSearch} className="search-box-wrapper">
            <div style={{ position: 'relative', flex: 1 }}>
              <svg className="search-icon-inside" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.65 11a5.65 5.65 0 11-11.3 0 5.65 5.65 0 0111.3 0z" />
              </svg>
              <input
                type="text"
                className="search-input-premium"
                placeholder="Search by hotel name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn-premium">Search</button>
          </form>
        </section>
      )}

      {/* Main Layout: Sidebar + Content */}
      <div className="home-container">
        
        {role === 'ROLE_ADMIN' ? (
          <aside className="filter-sidebar open">
            <div className="sidebar-header">
              <h3>Admin Services</h3>
            </div>
            <div className="sidebar-content">
              <div className="sidebar-section">
                <nav className="admin-side-nav">
                  <button className={`admin-nav-item ${adminView === 'hotels' ? 'active' : ''}`} onClick={() => setAdminView('hotels')}>View Hotels</button>
                  <button className={`admin-nav-item ${adminView === 'categories' ? 'active' : ''}`} onClick={() => setAdminView('categories')}>Room Categories</button>
                  <button className={`admin-nav-item ${adminView === 'add-hotel' ? 'active' : ''}`} onClick={() => setAdminView('add-hotel')}>Add Hotel</button>
                  <button className={`admin-nav-item ${adminView === 'history' ? 'active' : ''}`} onClick={() => setAdminView('history')}>Customer History</button>
                </nav>
              </div>
            </div>
          </aside>
        ) : (
          <>
            {/* Mobile Filter Trigger */}
            <button className="mobile-filter-trigger" onClick={() => setIsSidebarOpen(true)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters {selectedAmenities.length > 0 ? `(${selectedAmenities.length})` : ''}
            </button>

            <FilterSidebar 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
              location={location}
              setLocation={setLocation}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              allAmenities={allAmenities}
              selectedAmenities={selectedAmenities}
              toggleAmenity={toggleAmenity}
              clearFilters={clearFilters}
              applyFilters={fetchHotels}
            />
          </>
        )}

        <main className="main-content">
          {adminView === 'hotels' || role !== 'ROLE_ADMIN' ? (
            <>
              {loading ? (
                <div className="text-center" style={{ padding: '5rem 0' }}>
                  <div className="loading-spinner"></div>
                  <p style={{ marginTop: '1rem' }}>Searching for the best hotels...</p>
                </div>
              ) : error ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#EF4444' }}>
                  <p>{error}</p>
                  <button className="btn" style={{ marginTop: '1rem' }} onClick={fetchHotels}>Retry</button>
                </div>
              ) : hotels.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                  <h2 style={{ marginBottom: '1rem' }}>No Hotels Found</h2>
                  <p className="text-muted">Try adjusting your filters or search query to find more results.</p>
                  <button className="btn" style={{ marginTop: '1.5rem' }} onClick={clearFilters}>
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="hotel-list-container">
                  {hotels.map(hotel => (
                    <Link key={hotel.id} to={`/hotel/${hotel.id}`} className="hotel-row-card">
                      <div className="hotel-row-image-wrapper">
                        <img
                          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop'}
                          alt={hotel.name}
                          className="hotel-row-image"
                          onError={handleImageError}
                        />
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#059669', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                          VERIFIED
                        </div>
                      </div>
                      <div className="hotel-row-content">
                        <div className="hotel-row-header">
                          <div>
                            <h3 className="hotel-row-title">{hotel.name}</h3>
                            <div className="hotel-row-location">
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                              {hotel.location}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F3F4FB', padding: '6px 12px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700 }}>
                            <span>⭐</span> {(4 + (hotel.id % 10) / 10).toFixed(1)}
                          </div>
                        </div>
                        
                        <p className="hotel-row-description">
                          {hotel.description ? hotel.description.substring(0, 160) + '...' : 'Enjoy a premium stay at our world-class facilities with exceptional service and breathtaking views.'}
                        </p>

                        <div className="hotel-row-footer">
                          <div className="hotel-row-price-box">
                            <span className="price-amount">${calculatePrice(hotel.rooms?.[0]?.price || 0)}</span>
                            <span className="price-unit">Total for {calculatePeriods()} night(s)</span>
                          </div>
                          <button className="btn-primary-premium" style={{ padding: '0.8rem 1.8rem' }}>Check Availability</button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : adminView === 'history' ? (
            <div className="admin-history-container">
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
                <div 
                  onClick={() => setAdminView('hotels')} 
                  style={{cursor: 'pointer', background: 'rgba(79, 70, 229, 0.1)', padding: '8px', borderRadius: '12px', color: 'var(--primary)', display: 'flex'}}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                <h2 className="search-title" style={{margin: 0}}>Customer Booking History</h2>
              </div>
              <div className="card" style={{padding: '0', overflow: 'hidden', borderRadius: '16px'}}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Hotel</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Total Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerHistory.map(booking => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td style={{fontWeight: '700'}}>{booking.user.name}</td>
                        <td>{booking.room.hotel.name}</td>
                        <td>{new Date(booking.checkIn).toLocaleString()}</td>
                        <td>{new Date(booking.checkOut).toLocaleString()}</td>
                        <td style={{color: 'var(--primary)', fontWeight: '800'}}>${booking.totalPrice?.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {customerHistory.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{textAlign: 'center', padding: '3rem', color: '#6B7280'}}>No bookings found in history.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : adminView === 'add-hotel' ? (
             <div className="admin-form-container">
               <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
                 <div 
                   onClick={() => setAdminView('hotels')} 
                   style={{cursor: 'pointer', background: 'rgba(79, 70, 229, 0.1)', padding: '8px', borderRadius: '12px', color: 'var(--primary)', display: 'flex'}}
                 >
                   <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                   </svg>
                 </div>
                 <h2 className="search-title" style={{margin: 0}}>Add New Hotel</h2>
               </div>
               <div className="card booking-card-premium" style={{maxWidth: '600px', padding: '2.5rem', borderRadius: '20px'}}>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const newHotel = Object.fromEntries(formData.entries());
                    api.post('/admin/hotels', newHotel)
                      .then(() => { alert('Hotel added successfully!'); setAdminView('hotels'); fetchHotels(); })
                      .catch(err => alert('Failed to add hotel.'));
                  }}>
                    <div className="form-group">
                      <label style={{fontWeight: '700', marginBottom: '0.5rem', display: 'block'}}>Hotel Name</label>
                      <input name="name" className="form-control-premium" style={{padding: '0.75rem 1rem'}} placeholder="e.g. Royal Palace" required />
                    </div>
                    <div className="form-group" style={{marginTop: '1.5rem'}}>
                      <label style={{fontWeight: '700', marginBottom: '0.5rem', display: 'block'}}>Location</label>
                      <input name="location" className="form-control-premium" style={{padding: '0.75rem 1rem'}} placeholder="e.g. Paris, France" required />
                    </div>
                    <div className="form-group" style={{marginTop: '1.5rem'}}>
                      <label style={{fontWeight: '700', marginBottom: '0.5rem', display: 'block'}}>Description</label>
                      <textarea name="description" className="form-control-premium" style={{padding: '0.75rem 1rem', height: '120px'}} placeholder="Describe the hotel amenities and services..." required />
                    </div>
                    <div className="form-group" style={{marginTop: '1.5rem'}}>
                      <label style={{fontWeight: '700', marginBottom: '0.5rem', display: 'block'}}>Image URL</label>
                      <input name="imageUrl" className="form-control-premium" style={{padding: '0.75rem 1rem'}} placeholder="https://..." />
                    </div>
                    <button type="submit" className="btn-primary-premium" style={{marginTop: '2rem', width: '100%'}}>Save Hotel</button>
                  </form>
               </div>
             </div>
          ) : (
              <div className="admin-categories-container">
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
                  <div 
                    onClick={() => setAdminView('hotels')} 
                    style={{cursor: 'pointer', background: 'rgba(79, 70, 229, 0.1)', padding: '8px', borderRadius: '12px', color: 'var(--primary)', display: 'flex'}}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </div>
                  <h2 className="search-title" style={{margin: 0}}>Room Categories</h2>
                </div>
                <div className="categories-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem'}}>
                   {['Deluxe King Room', 'Executive Suite', 'Ocean View Queen', 'Beachfront Bungalow', 'Standard Double Room', 'Mountain Vista Suite', 'Studio Loft', 'Penthouse Loft'].map(cat => (
                     <div key={cat} className="card hotel-row-card" style={{padding: '2rem', height: 'auto', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                        <div style={{background: 'var(--bg-color)', padding: '12px', borderRadius: '12px', marginBottom: '1rem'}}>
                           <svg width="24" height="24" fill="none" stroke="var(--primary)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z"/></svg>
                        </div>
                        <h3 style={{fontSize: '1.1rem', fontWeight: '800'}}>{cat}</h3>
                        <p className="text-muted" style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>Standard configurations and amenity sets for {cat} units across all properties.</p>
                     </div>
                   ))}
                </div>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
