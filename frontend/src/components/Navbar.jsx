import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    ✈️ GlobeTrotter
                </Link>

                {user && (
                    <div className="navbar-menu">
                        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                        <Link to="/trips" className="navbar-link">My Trips</Link>
                        <Link to="/discover" className="navbar-link">Discover</Link>
                        <Link to="/activities" className="navbar-link">Activities</Link>
                        <Link to="/profile" className="navbar-link">Profile</Link>
                        <button onClick={handleLogout} className="btn btn-sm btn-outline">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
