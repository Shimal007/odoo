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
    const [preferences, setPreferences] = useState({
        currency: 'USD',
        language: 'en',
        privacy: 'public'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadUserData();
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
                    profile_photo: data.profile_photo || ''
                });
                setPreferences(data.preferences || preferences);
            }
        } catch (err) {
            console.error('Failed to load user data:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePreferenceChange = (e) => {
        setPreferences({
            ...preferences,
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
                body: JSON.stringify({
                    ...formData,
                    preferences
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Profile updated successfully!');
                setIsEditing(false);
                onUpdateUser({ ...user, ...formData });
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
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                <div className="container container-narrow">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1>My Profile ⚙️</h1>
                        <p className="text-secondary">Manage your account settings and preferences</p>
                    </div>

                    <div className="grid" style={{ gap: 'var(--spacing-2xl)' }}>
                        {/* Profile Info Card */}
                        <div className="card card-elevated">
                            <div className="card-header flex justify-between items-center">
                                <h3 className="card-title">Personal Information</h3>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn btn-sm btn-outline"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Avatar Selection */}
                                <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--sky-gradient-start), var(--sky-gradient-end))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '4rem',
                                        margin: '0 auto var(--spacing-md)'
                                    }}>
                                        {formData.profile_photo || '👤'}
                                    </div>

                                    {isEditing && (
                                        <div style={{
                                            display: 'flex',
                                            gap: 'var(--spacing-xs)',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap'
                                        }}>
                                            {avatarEmojis.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, profile_photo: emoji })}
                                                    style={{
                                                        fontSize: '1.5rem',
                                                        padding: 'var(--spacing-sm)',
                                                        border: formData.profile_photo === emoji
                                                            ? '2px solid var(--ocean-blue)'
                                                            : '1px solid var(--border-light)',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'transparent',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Form Fields */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                    <div className="form-group">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            className="form-input"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            className="form-input"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        disabled
                                    />
                                    <p className="form-help">Email cannot be changed</p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="form-input"
                                            value={formData.city}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="New York"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            className="form-input"
                                            value={formData.country}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="USA"
                                        />
                                    </div>
                                </div>

                                {message && (
                                    <div className={message.includes('success') ? 'text-success' : 'form-error'} style={{ textAlign: 'center' }}>
                                        {message}
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="flex gap-3" style={{ marginTop: 'var(--spacing-lg)' }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                loadUserData();
                                            }}
                                            className="btn btn-secondary"
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
                                )}
                            </form>
                        </div>

                        {/* Preferences Card */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Preferences</h3>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Default Currency</label>
                                <select
                                    name="currency"
                                    className="form-select"
                                    value={preferences.currency}
                                    onChange={handlePreferenceChange}
                                    disabled={!isEditing}
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                    <option value="INR">INR - Indian Rupee</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Language</label>
                                <select
                                    name="language"
                                    className="form-select"
                                    value={preferences.language}
                                    onChange={handlePreferenceChange}
                                    disabled={!isEditing}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="ja">日本語</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Privacy</label>
                                <select
                                    name="privacy"
                                    className="form-select"
                                    value={preferences.privacy}
                                    onChange={handlePreferenceChange}
                                    disabled={!isEditing}
                                >
                                    <option value="public">Public - Anyone can see your trips</option>
                                    <option value="private">Private - Only you can see your trips</option>
                                    <option value="friends">Friends - Only friends can see</option>
                                </select>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="card" style={{ borderLeft: '4px solid var(--error)' }}>
                            <div className="card-header">
                                <h3 className="card-title text-error">Danger Zone</h3>
                            </div>
                            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-md)' }}>
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    if (confirm('Are you absolutely sure? This action cannot be undone.')) {
                                        alert('Account deletion feature coming soon');
                                    }
                                }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
