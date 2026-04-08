import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [fullName, setFullName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert("Please login to book a room");
      navigate('/login');
      return;
    }
    // Fetch room details for summary
    api.get(`/rooms/${roomId}`)
      .then(res => setRoom(res.data))
      .catch(err => {
        console.error(err);
        alert("Could not load room details");
      });

    // Check if first time user
    api.get('/bookings/my-bookings')
      .then(res => setIsFirstTime(res.data.length === 0))
      .catch(console.error);
  }, [token, navigate, roomId]);

  const validate = () => {
    const newErrors = {};
    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!checkIn) newErrors.checkIn = 'Check-in time is required';
    if (checkIn && checkIn < today) newErrors.checkIn = 'Check-in cannot be in the past';
    
    if (!checkOut) newErrors.checkOut = 'Check-out time is required';
    if (checkOut && checkOut <= checkIn) newErrors.checkOut = 'Check-out must be after check-in';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePeriods = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const hours = diffTime / (1000 * 60 * 60);
    const periods = Math.ceil(hours / 24);
    return periods === 0 ? 1 : periods;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post('/bookings', { roomId, checkIn, checkOut });
      alert('Booking Successful! We look forward to hosting you.');
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed due to overlap or error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const periods = calculatePeriods();
  const rawPrice = room ? (periods * room.price) : 0;
  const discount = isFirstTime ? rawPrice * 0.10 : 0;
  const totalPrice = rawPrice - discount;

  if (!room) return <div className="text-center" style={{padding: '5rem'}}>Loading room details...</div>;

  return (
    <div className="booking-page-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card booking-card-premium" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Complete Booking</h1>
          <p className="text-muted">Review your stay at <strong>{room.hotel?.name || 'Hotel'}</strong></p>
        </div>

        {/* Room Summary Mini Card */}
        <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #F3F4F6', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img 
            src={room.imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=100&h=100&fit=crop'} 
            style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
            alt={room.type}
            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=100&h=100&fit=crop'}
          />
          <div>
            <h4 style={{ margin: 0, fontWeight: '700' }}>{room.type}</h4>
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: '4px 0' }}>${room.price} / night</p>
          </div>
        </div>

        <form onSubmit={handleBooking} noValidate>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <input 
                className={`form-control-premium ${errors.fullName ? 'error' : ''}`}
                type="text" 
                placeholder="Enter your full name" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)}
              />
            </div>
            {errors.fullName && <span style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Check-in</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <input 
                  className={`form-control-premium ${errors.checkIn ? 'error' : ''}`}
                  type="datetime-local" 
                  value={checkIn} 
                  onChange={e => setCheckIn(e.target.value)}
                />
              </div>
              {errors.checkIn && <span style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.checkIn}</span>}
            </div>

            <div className="form-group">
              <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Check-out</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <input 
                  className={`form-control-premium ${errors.checkOut ? 'error' : ''}`}
                  type="datetime-local" 
                  value={checkOut} 
                  onChange={e => setCheckOut(e.target.value)}
                />
              </div>
              {errors.checkOut && <span style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.checkOut}</span>}
            </div>
          </div>

          {/* Pricing Summary */}
          {periods > 0 && (
            <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #fde68a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Duration</span>
                <strong>{periods} {periods === 1 ? 'Period (up to 24h)' : 'Periods (24h blocks)'}</strong>
              </div>
              {isFirstTime && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#059669' }}>
                  <span>First Time Discount (10%)</span>
                  <strong>-${discount.toFixed(2)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '800', color: '#92400e' }}>
                <span>Total Amount</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button 
            className="search-btn-premium" 
            type="submit" 
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
