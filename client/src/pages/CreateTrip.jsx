import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CreateTrip = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        city: '',
        country: '',
        start_date: '',
        end_date: '',
        cover_image: '🌍'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const coverEmojis = ['🌍', '✈️', '🏖️', '🏔️', '🗺️', '🧳', '🌴', '🗼', '🏝️', '🌅'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleGenerateAIPlan = async () => {
        // Validate required fields
        if (!formData.city || !formData.country || !formData.start_date || !formData.end_date) {
            setError('Please fill in city, country, and dates to generate AI plan');
            return;
        }

        if (new Date(formData.start_date) > new Date(formData.end_date)) {
            setError('End date must be after start date');
            return;
        }

        // Navigate to AI Plan Generator page with form data
        navigate('/ai-plan-generator', {
            state: {
                city: formData.city,
                country: formData.country,
                startDate: formData.start_date,
                endDate: formData.end_date,
                tripName: formData.name || `Trip to ${formData.city}`,
                description: formData.description
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (new Date(formData.start_date) > new Date(formData.end_date)) {
            setError('End date must be after start date');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    user_id: user._id
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`/trips/${data.trip._id}/edit`);
            } else {
                setError(data.error || 'Failed to create trip');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar user={user} onLogout={onLogout} />

            <div className="container container-narrow section">
                <div className="text-center mb-4 animate-fade-in">
                    <h1 style={{ fontSize: '3rem' }}>Create New Trip ✈️</h1>
                    <p className="text-warm-gray" style={{ fontSize: '1.125rem' }}>
                        Let's start planning your next adventure
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        {/* Cover Icon Selection */}
                        <div className="form-group">
                            <label className="form-label">Trip Icon</label>
                            <div className="grid" style={{
                                gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                                gap: '0.5rem'
                            }}>
                                {coverEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, cover_image: emoji })}
                                        style={{
                                            fontSize: '2rem',
                                            padding: '1rem',
                                            border: formData.cover_image === emoji
                                                ? '3px solid var(--gold)'
                                                : '1px solid rgba(184, 134, 11, 0.2)',
                                            borderRadius: 'var(--radius-md)',
                                            background: formData.cover_image === emoji
                                                ? 'rgba(184, 134, 11, 0.1)'
                                                : 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trip Name */}
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Trip Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Summer Europe Adventure"
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What's this trip about?"
                                rows="4"
                            />
                        </div>

                        {/* Location Fields - NEW */}
                        <div className="grid grid-2 gap-3">
                            <div className="form-group">
                                <label htmlFor="city" className="form-label">City *</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="form-input"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Chennai, Paris, Tokyo"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="country" className="form-label">Country *</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    className="form-input"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., India, France, Japan"
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-2 gap-3">
                            <div className="form-group">
                                <label htmlFor="start_date" className="form-label">Start Date *</label>
                                <input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    className="form-input"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="end_date" className="form-label">End Date *</label>
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    className="form-input"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="form-error">{error}</div>
                        )}

                        {/* AI Feature Highlight */}
                        <div className="mb-3" style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.08), rgba(139, 105, 20, 0.08))',
                            border: '1px solid rgba(184, 134, 11, 0.2)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖✨</div>
                            <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--gold)' }}>
                                Try AI-Powered Trip Planning
                            </h4>
                            <p className="text-warm-gray" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                                Let our AI create a personalized day-by-day itinerary for you!
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-2 gap-3" style={{ marginTop: '1.5rem' }}>
                            <button
                                type="button"
                                onClick={handleGenerateAIPlan}
                                className="btn btn-outline"
                                style={{ background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.05), rgba(139, 105, 20, 0.05))' }}
                            >
                                🤖 Generate AI Plan
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Manually →'}
                            </button>
                        </div>

                        <div className="text-center mt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-ghost"
                                style={{ fontSize: '0.875rem' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="grid grid-3 gap-3 mt-4">
                    <div className="card card-compact text-center">
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Add Destinations</h4>
                        <p className="text-warm-gray" style={{ fontSize: '0.875rem' }}>
                            Plan multi-city trips
                        </p>
                    </div>
                    <div className="card card-compact text-center">
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Day-wise Planning</h4>
                        <p className="text-warm-gray" style={{ fontSize: '0.875rem' }}>
                            Organize activities
                        </p>
                    </div>
                    <div className="card card-compact text-center">
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Budget Tracking</h4>
                        <p className="text-warm-gray" style={{ fontSize: '0.875rem' }}>
                            Manage expenses
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip;
