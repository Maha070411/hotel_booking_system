import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get(/hotels/${id}).then(res => setHotel(res.data)).catch(console.error);
    api.get(/rooms?hotelId=${id}).then(res => setRooms(res.data)).catch(console.error);
  }, [id]);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop';
  };

  const handleRoomImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop';
  };

  if (!hotel) return <div className="text-center" style={{padding: '5rem'}}>Loading...</div>;

  return (
    <div className="hotel-details-page">
      <div className="card hotel-hero-card" style={{ padding: 0, overflow: 'hidden', border: 'none', borderRadius: '24px' }}>
        <img
          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop'}
          alt={hotel.name}
          className="card-img-detail"
          style={{ height: '450px' }}
          onError={handleImageError}
        />
        <div style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem'}}>{hotel.name}</h1>
              <p className="text-muted" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {hotel.location}
              </p>
            </div>
            <div className="price-badge" style={{background: 'var(--primary)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '99px', fontWeight: 'bold'}}>
              Featured
            </div>
          </div>
          <p style={{ marginTop: '1.5rem', lineHeight: '1.8', fontSize: '1.1rem', color: '#4B5563' }}>{hotel.description}</p>
        </div>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>Select Your Room</h2>
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {rooms.map(room => (
            <div key={room.id} className="card room-card-premium" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px' }}>
              <img
                src={room.imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop'}
                alt={room.type}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                onError={handleRoomImageError}
              />
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{room.type}</h3>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>${room.price}<span style={{fontSize: '0.9rem', fontWeight: '400', color: 'var(--text-muted)'}}>/night</span></p>
                </div>
                
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Amenities</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {room.amenities && room.amenities.length > 0 ? (
                    room.amenities.map(amenity => (
                      <span key={amenity.id} className="amenity-tag">
                        {amenity.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted" style={{fontSize: '0.9rem'}}>No specific amenities listed</span>
                  )}
                </div>

                <Link to={/book/${room.id}}>
                  <button className="search-btn-premium" style={{ width: '100%', padding: '1rem' }}>Book Now</button>
                </Link>
              </div>
            </div>
          ))}
          {rooms.length === 0 && <p className="text-muted">No rooms available for this hotel at the moment.</p>}
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;
