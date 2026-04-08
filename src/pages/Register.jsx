import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="card" style={{maxWidth: '400px', margin: '2rem auto'}}>
      <h2>Register</h2>
      <form onSubmit={handleRegister} style={{marginTop: '1rem'}}>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" type="text" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit" style={{width: '100%'}}>Register</button>
      </form>
    </div>
  );
}

export default Register;