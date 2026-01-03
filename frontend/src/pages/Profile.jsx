import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = ({ user, onLogout, onUpdateUser }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        profile_photo: ''
    });
    const [userStats, setUserStats] = useState({ planned: 0, previous: 0, total: 0 });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadUserData();
        fetchTripStats();
    }, [user]);

    const loadUserData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${user._id}`);
            const data = await response.json();

            if (response.ok) {
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    city: data.city || '',
                    country: data.country || '',
                    profile_photo: data.profile_photo || '👤'
                });
            }
        } catch (err) {
            console.error('Failed to load user data:', err);
        }
    };

    const fetchTripStats = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/trips/user/${user._id}`);
            const data = await response.json();

            if (response.ok) {
                const now = new Date();
                const planned = data.filter(t => new Date(t.start_date) > now).length;
                const previous = data.filter(t => new Date(t.end_date) < now).length;
                setUserStats({ planned, previous, total: data.length });
            }
        } catch (err) {
            console.error('Failed to fetch trip stats:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`http://localhost:5000/api/user/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Profile updated successfully!');
                setIsEditing(false);
                onUpdateUser({ ...user, ...formData });
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(data.error || 'Failed to update profile');
            }
        } catch (err) {
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const avatarEmojis = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧳', '✈️', '🌍'];

    return (
        <div className="page-container">
            <Navbar user={user} onLogout={onLogout} />

            <div className="container container-narrow section">
                {/* Header */}
                <div className="card mb-4 animate-fade-in-up">
                    <h1 className="text-gradient-gold text-center" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        My Profile
                    </h1>
                    <p className="text-center text-warm-gray">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Profile Section */}
                <div className="card mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* Avatar and Header */}
                    <div className="flex gap-4 pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                        <div className="profile-avatar">
                            {formData.profile_photo || '👤'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                                {formData.first_name} {formData.last_name}
                            </h2>
                            <p className="text-warm-gray" style={{ marginBottom: '1rem' }}>
                                {formData.city && formData.country ? `${formData.city}, ${formData.country}` : 'Location not set'}
                            </p>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-outline btn-sm"
                                >
                                    <span style={{ marginRight: '0.5rem' }}>✏️</span>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User Details */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--charcoal)' }}>
                            Personal Information
                        </h3>

                        {isEditing ? (
                            <form onSubmit={handleSubmit}>
                                {/* Avatar Selection */}
                                <div className="form-group">
                                    <label className="form-label">Choose Avatar</label>
                                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                                        {avatarEmojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, profile_photo: emoji })}
                                                style={{
                                                    fontSize: '2rem',
                                                    padding: '0.75rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: formData.profile_photo === emoji ? '2px solid var(--gold)' : '2px solid var(--border-color)',
                                                    background: formData.profile_photo === emoji ? 'var(--cream-light)' : 'transparent',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name Fields */}
                                <div className="grid grid-2 gap-3 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="first_name" className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            className="form-input"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="last_name" className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            className="form-input"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                        value={formData.email}
                                        disabled
                                    />
                                    <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Email cannot be changed</p>
                                </div>

                                {/* Phone */}
                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>

                                {/* Location */}
                                <div className="grid grid-2 gap-3 mb-4">
                                    <div className="form-group">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            className="form-input"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            className="form-input"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="USA"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                {message && (
                                    <div className={message.includes('success') ? 'form-success mb-3' : 'form-error mb-3'}>
                                        {message}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            loadUserData();
                                        }}
                                        className="btn btn-outline"
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ flex: 1 }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="user-info-row">
                                    <span className="font-bold uppercase tracking-wider text-xs">Email</span>
                                    <span className="text-charcoal">{formData.email}</span>
                                </div>
                                <div className="user-info-row">
                                    <span className="font-bold uppercase tracking-wider text-xs">Phone</span>
                                    <span className="text-charcoal">{formData.phone || 'Not set'}</span>
                                </div>
                                <div className="user-info-row">
                                    <span className="font-bold uppercase tracking-wider text-xs">Location</span>
                                    <span className="text-charcoal">
                                        {formData.city && formData.country
                                            ? `${formData.city}, ${formData.country}`
                                            : 'Not set'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trip Statistics */}
                <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--charcoal)' }}>
                        Travel Statistics
                    </h3>
                    <div className="grid grid-3 gap-3">
                        <div className="stat-box">
                            <div className="stat-number">{userStats.total}</div>
                            <div className="stat-label">Total Trips</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">{userStats.planned}</div>
                            <div className="stat-label">Planned</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">{userStats.previous}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
