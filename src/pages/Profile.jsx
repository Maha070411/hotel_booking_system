import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, bookingsRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/bookings/my-bookings')
        ]);
        setUser(userRes.data);
        setBookings(bookingsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const cancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.put(/bookings/${id}/cancel);
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      } catch (err) {
        alert('Could not cancel booking');
      }
    }
  };

  if (loading) return <div className="text-center" style={{ padding: '5rem' }}>Loading profile...</div>;

  return (
    <div className="profile-page">
      {/* User Info Section */}
      <section className="user-profile-card">
        <div className="card" style={{ padding: '2.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '2rem', border: 'none', background: 'white' }}>
          <div className="user-avatar" style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' }}>{user?.name}</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>{user?.email}</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <span className="amenity-tag" style={{ background: '#EEF2FF', color: 'var(--primary)', borderColor: 'transparent' }}>
                {user?.role === 'ADMIN' ? 'Administrator' : 'Verified Member'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bookings Section */}
      <section style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem' }}>My Bookings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>You haven't made any bookings yet.</p>
              <button className="search-btn-premium" style={{ marginTop: '1.5rem', width: 'auto' }} onClick={() => navigate('/')}>
                Browse Hotels
              </button>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="card booking-card" style={{ 
                padding: '1.5rem', 
                borderRadius: '16px', 
                border: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{ 
                  width: '120px', 
                  height: '100px', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  background: '#F3F4F6'
                }}>
                  <img 
                    src={booking.room?.hotel?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop'} 
                    alt={booking.room?.hotel?.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop'}
                  />
                </div>
                
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    {booking.room?.hotel?.name || 'Hotel Information Unavailable'}
                  </h3>
                  <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                    {booking.room?.type || 'Room Details Unavailable'}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Check In</span>
                      <strong>{booking.checkIn}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Check Out</span>
                      <strong>{booking.checkOut}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '150px' }}>
                  <span className={status-badge ${booking.status.toLowerCase()}} style={{
                    display: 'inline-block',
                    padding: '0.4rem 1rem',
                    borderRadius: '99px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                    backgroundColor: booking.status === 'CANCELLED' ? '#FEE2E2' : '#D1FAE5',
                    color: booking.status === 'CANCELLED' ? '#EF4444' : '#10B981'
                  }}>
                    {booking.status}
                  </span>
                  <div>
                    {booking.status !== 'CANCELLED' && (
                      <button className="clear-btn-premium" style={{ borderColor: '#F3F4F6', fontSize: '0.85rem' }} onClick={() => cancelBooking(booking.id)}>
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Profile;
