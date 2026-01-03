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
        <div className="min-h-screen bg-gradient-luxury">
            <Navbar user={user} onLogout={onLogout} />

            <div className="luxury-container max-w-4xl">
                {/* Header */}
                <div className="luxury-card mb-12 animate-fadeInUp">
                    <h1 className="text-4xl font-serif font-bold text-gradient-gold text-center">
                        My Profile
                    </h1>
                    <p className="text-center text-warm-gray mt-2">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Profile Section */}
                <div className="luxury-card mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    {/* Avatar and Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-8 border-b border-gold/20">
                        <div className="profile-avatar-luxury">
                            {formData.profile_photo || '👤'}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="font-serif text-3xl text-charcoal mb-2">
                                {formData.first_name} {formData.last_name}
                            </h2>
                            <p className="text-warm-gray mb-4">
                                {formData.city && formData.country ? `${formData.city}, ${formData.country}` : 'Location not set'}
                            </p>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-luxury-outline-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="mt-8">
                        <h3 className="text-xl font-serif font-semibold text-charcoal mb-6">
                            Personal Information
                        </h3>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Avatar Selection */}
                                <div className="form-group-luxury">
                                    <label className="label-luxury">Choose Avatar</label>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {avatarEmojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, profile_photo: emoji })}
                                                className={`text-4xl p-4 rounded-lg border-2 transition-all ${formData.profile_photo === emoji
                                                        ? 'border-gold bg-gold/10 scale-110'
                                                        : 'border-gold/20 hover:border-gold/50'
                                                    }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name Fields */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="form-group-luxury">
                                        <label htmlFor="first_name" className="label-luxury">First Name</label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            className="input-luxury"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group-luxury">
                                        <label htmlFor="last_name" className="label-luxury">Last Name</label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            className="input-luxury"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="form-group-luxury">
                                    <label htmlFor="email" className="label-luxury">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="input-luxury opacity-60 cursor-not-allowed"
                                        value={formData.email}
                                        disabled
                                    />
                                    <p className="text-xs text-warm-gray mt-1">Email cannot be changed</p>
                                </div>

                                {/* Phone */}
                                <div className="form-group-luxury">
                                    <label htmlFor="phone" className="label-luxury">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="input-luxury"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>

                                {/* Location */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="form-group-luxury">
                                        <label htmlFor="city" className="label-luxury">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            className="input-luxury"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div className="form-group-luxury">
                                        <label htmlFor="country" className="label-luxury">Country</label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            className="input-luxury"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="USA"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                {message && (
                                    <div className={`p-4 rounded-lg text-sm text-center ${message.includes('success')
                                            ? 'bg-green-50 border border-green-200 text-green-700'
                                            : 'bg-red-50 border border-red-200 text-red-700'
                                        }`}>
                                        {message}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            loadUserData();
                                        }}
                                        className="flex-1 btn-luxury-outline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 btn-luxury"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="user-info-row">
                                    <span className="text-warm-gray font-medium">Email</span>
                                    <span className="text-charcoal">{formData.email}</span>
                                </div>
                                <div className="user-info-row">
                                    <span className="text-warm-gray font-medium">Phone</span>
                                    <span className="text-charcoal">{formData.phone || 'Not set'}</span>
                                </div>
                                <div className="user-info-row">
                                    <span className="text-warm-gray font-medium">Location</span>
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
                <div className="luxury-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-6">
                        Travel Statistics
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
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
