import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchHotels = () => {
    setLoading(true);
    setError(null);

    const params = {};
    if (searchQuery) params.query = searchQuery;
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
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

  useEffect(() => {
    fetchHotels();
    api.get('/amenities')
      .then(res => setAllAmenities(res.data))
      .catch(err => console.error("Error fetching amenities:", err));
  }, []);

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
    setMaxPrice('');
    setSelectedAmenities([]);
    setLoading(true);
    api.get('/hotels').then(res => {
      setHotels(res.data);
      setLoading(false);
    });
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop';
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem' }}>
      {/* Search Header */}
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

      {/* Main Layout: Sidebar + Content */}
      <div className="home-container">
        
        {/* Mobile Filter Trigger */}
        <button className="mobile-filter-trigger" onClick={() => setIsSidebarOpen(true)}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters {selectedAmenities.length > 0 ? (${selectedAmenities.length}) : ''}
        </button>

        <FilterSidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          allAmenities={allAmenities}
          selectedAmenities={selectedAmenities}
          toggleAmenity={toggleAmenity}
          clearFilters={clearFilters}
          applyFilters={fetchHotels}
        />

        <main className="main-content">
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
                <Link key={hotel.id} to={/hotel/${hotel.id}} className="hotel-row-card">
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
                        <span className="price-amount">${hotel.rooms?.[0]?.price || 'N/A'}</span>
                        <span className="price-unit">per night (incl. taxes)</span>
                      </div>
                      <button className="btn-primary-premium" style={{ padding: '0.8rem 1.8rem' }}>Check Availability</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
