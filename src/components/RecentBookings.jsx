import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RecentBookings() {
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            api.get('/bookings/recent')
                .then(res => {
                    setRecentBookings(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching recent bookings:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleRebook = (roomId) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);

        navigate(`/book/${roomId}`, {
            state: {
                checkIn: tomorrow.toISOString().split('T')[0],
                checkOut: dayAfter.toISOString().split('T')[0]
            }
        });
    };

    if (!token || recentBookings.length === 0) return null;

    return (
        <section className="recent-bookings-section" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your Recent Stays
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {recentBookings.map(booking => (
                    <div key={booking.id} className="card" style={{
                        padding: '1.25rem',
                        borderRadius: '16px',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        background: 'white',
                        border: '1px solid rgba(0,0,0,0.03)'
                    }}>
                        <img
                            src={booking.room?.hotel?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop'}
                            alt={booking.room?.hotel?.name}
                            style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>{booking.room?.hotel?.name}</h4>
                            <p className="text-muted" style={{ fontSize: '0.85rem', margin: '4px 0' }}>{booking.room?.type}</p>
                            <button
                                className="btn-primary-premium"
                                style={{ fontSize: '0.75rem', padding: '0.4rem 1rem', marginTop: '0.5rem' }}
                                onClick={() => handleRebook(booking.room?.id)}
                            >
                                Quick Rebook
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RecentBookings;
