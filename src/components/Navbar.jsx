import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <nav className="nav-bar">
            <h2><Link style={{ color: 'inherit', textDecoration: 'none' }} to="/">Hotel Booking System</Link></h2>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {token ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        {role === 'ROLE_ADMIN' && <Link to="/admin">Admin</Link>}
                        <button className="btn" style={{ marginLeft: '1.5rem' }} onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
