import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (role !== 'ROLE_ADMIN') {
      navigate('/');
    } else {
      fetchHotels();
    }
  }, [role, navigate]);

  const fetchHotels = () => {
    api.get('/hotels').then(res => setHotels(res.data)).catch(console.error);
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/hotels', { name, location, description });
      alert('Hotel added!');
      setName(''); setLocation(''); setDescription('');
      fetchHotels();
    } catch(err) {
      alert('Failed to add hotel');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <div className="card" style={{marginTop: '1rem', maxWidth: '500px'}}>
        <h3>Add New Hotel</h3>
        <form onSubmit={handleAddHotel} style={{marginTop: '1rem'}}>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input className="form-control" value={location} onChange={e=>setLocation(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" value={description} onChange={e=>setDescription(e.target.value)} required />
          </div>
          <button className="btn" type="submit">Add Hotel</button>
        </form>
      </div>

      <h3 style={{marginTop: '2rem'}}>Existing Hotels</h3>
      {hotels.map(h => (
        <div key={h.id} className="card" style={{marginTop: '1rem'}}>
          <h4>{h.name}</h4>
          <p>{h.location}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
