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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--cream) 0%, var(--cream-light) 100%)' }}>
            <Navbar user={user} onLogout={onLogout} />

            {/* Hero Header with Pattern */}
            <div style={{
                background: 'linear-gradient(135deg, var(--brown) 0%, var(--brown-dark) 100%)',
                padding: 'var(--spacing-3xl) 0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(circle, var(--gold) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        color: 'var(--gold)',
                        fontFamily: 'var(--font-serif)',
                        marginBottom: 'var(--spacing-sm)',
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        My Profile
                    </h1>
                    <p style={{ color: 'var(--cream)', fontSize: '1.125rem', opacity: 0.9 }}>
                        Manage your account settings and travel preferences
                    </p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1000px', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
                {/* Profile Card */}
                <div className="card animate-fade-in-up" style={{
                    marginBottom: 'var(--spacing-2xl)',
                    background: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Element */}
                    <div style={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                        borderRadius: '50%',
                        opacity: 0.05
                    }} />

                    {/* Avatar Section */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingBottom: 'var(--spacing-xl)',
                        borderBottom: '2px solid var(--cream-dark)',
                        position: 'relative'
                    }}>
                        <div className="profile-avatar" style={{
                            marginBottom: 'var(--spacing-lg)',
                            position: 'relative'
                        }}>
                            {formData.profile_photo || '👤'}
                            {/* Online Status Badge */}
                            <div style={{
                                position: 'absolute',
                                bottom: 5,
                                right: 5,
                                width: 24,
                                height: 24,
                                background: '#4ade80',
                                border: '3px solid white',
                                borderRadius: '50%',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }} />
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '2rem',
                            color: 'var(--charcoal)',
                            marginBottom: 'var(--spacing-xs)'
                        }}>
                            {formData.first_name} {formData.last_name}
                        </h2>
                        <p style={{
                            color: 'var(--warm-gray)',
                            fontSize: '1rem',
                            marginBottom: 'var(--spacing-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>📍</span>
                            {formData.city && formData.country ? `${formData.city}, ${formData.country}` : 'Location not set'}
                        </p>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <span>✏️</span>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Personal Information */}
                    <div style={{ marginTop: 'var(--spacing-xl)' }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--charcoal)',
                            marginBottom: 'var(--spacing-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <span style={{ fontSize: '1.75rem' }}>👤</span>
                            Personal Information
                        </h3>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                                {/* Avatar Selection */}
                                <div className="form-group">
                                    <label className="form-label">Choose Avatar</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                                        {avatarEmojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, profile_photo: emoji })}
                                                style={{
                                                    fontSize: '2.5rem',
                                                    padding: '1rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: formData.profile_photo === emoji
                                                        ? '3px solid var(--gold)'
                                                        : '2px solid var(--cream-dark)',
                                                    background: formData.profile_photo === emoji
                                                        ? 'rgba(184, 134, 11, 0.1)'
                                                        : 'white',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    transform: formData.profile_photo === emoji ? 'scale(1.1)' : 'scale(1)',
                                                    boxShadow: formData.profile_photo === emoji ? '0 4px 12px rgba(184, 134, 11, 0.3)' : 'none'
                                                }}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name Fields */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
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
                                        value={formData.email}
                                        disabled
                                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', marginTop: '0.5rem' }}>
                                        🔒 Email cannot be changed
                                    </p>
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
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
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
                                    <div className={message.includes('success') ? 'form-success' : 'form-error'}>
                                        {message}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
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
                                        disabled={loading}
                                        style={{ flex: 1 }}
                                    >
                                        {loading ? 'Saving...' : '💾 Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                <div className="user-info-row">
                                    <span style={{ color: 'var(--warm-gray)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>📧</span> Email
                                    </span>
                                    <span style={{ color: 'var(--charcoal)', fontWeight: 500 }}>{formData.email}</span>
                                </div>
                                <div className="user-info-row">
                                    <span style={{ color: 'var(--warm-gray)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>📱</span> Phone
                                    </span>
                                    <span style={{ color: 'var(--charcoal)', fontWeight: 500 }}>{formData.phone || 'Not set'}</span>
                                </div>
                                <div className="user-info-row">
                                    <span style={{ color: 'var(--warm-gray)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>📍</span> Location
                                    </span>
                                    <span style={{ color: 'var(--charcoal)', fontWeight: 500 }}>
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
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h3 style={{
                        fontSize: '1.75rem',
                        fontFamily: 'var(--font-serif)',
                        color: 'var(--charcoal)',
                        marginBottom: 'var(--spacing-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <span style={{ fontSize: '2rem' }}>📊</span>
                        Travel Statistics
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        <div className="card" style={{
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1))',
                            border: '2px solid rgba(79, 70, 229, 0.2)',
                            transition: 'all 0.3s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(79, 70, 229, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>🗺️</div>
                            <div className="stat-number" style={{ color: '#4f46e5' }}>{userStats.total}</div>
                            <div className="stat-label">Total Trips</div>
                        </div>
                        <div className="card" style={{
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(202, 138, 4, 0.1))',
                            border: '2px solid rgba(234, 179, 8, 0.2)',
                            transition: 'all 0.3s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(234, 179, 8, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>📅</div>
                            <div className="stat-number" style={{ color: '#eab308' }}>{userStats.planned}</div>
                            <div className="stat-label">Upcoming Trips</div>
                        </div>
                        <div className="card" style={{
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))',
                            border: '2px solid rgba(34, 197, 94, 0.2)',
                            transition: 'all 0.3s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(34, 197, 94, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>✅</div>
                            <div className="stat-number" style={{ color: '#22c55e' }}>{userStats.previous}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
