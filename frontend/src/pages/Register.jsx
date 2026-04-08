import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      alert('Registration successful! You can now login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '1rem' }}>
      <div className="card booking-card-premium" style={{ maxWidth: '450px', width: '100%', padding: '3rem', borderRadius: '24px', textAlign: 'center', position: 'relative' }}>
        <div 
          onClick={() => navigate('/')} 
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', cursor: 'pointer', background: 'rgba(79, 70, 229, 0.1)', padding: '8px', borderRadius: '12px', color: 'var(--primary)', transition: 'all 0.2s ease', display: 'flex' }}
          title="Back to Home"
          className="back-btn-hover"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#111827' }}>Create an Account</h2>
          <p className="text-muted">Join us today to get special first-time discounts!</p>
        </div>
        <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#374151' }}>Full Name</label>
            <input 
              className="form-control-premium" 
              type="text"
              placeholder="John Doe" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#374151' }}>Email Address</label>
            <input 
              className="form-control-premium" 
              type="email" 
              placeholder="name@example.com"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#374151' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                className="form-control-premium" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                required 
                style={{ paddingRight: '2.5rem' }}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '12px', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </span>
            </div>
          </div>
          <button className="search-btn-premium" type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Register Now</button>
        </form>
        <p style={{ marginTop: '2rem', color: '#6B7280', fontSize: '0.95rem' }}>
          Already have an account? <span style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
