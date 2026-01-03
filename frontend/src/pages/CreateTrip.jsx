import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CreateTrip = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
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
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                <div className="container container-narrow">
                    <div className="text-center mb-5 animate-fade-in">
                        <h1>Create New Trip ✈️</h1>
                        <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
                            Let's start planning your next adventure
                        </p>
                    </div>

                    <div className="card card-elevated">
                        <form onSubmit={handleSubmit}>
                            {/* Cover Icon Selection */}
                            <div className="form-group">
                                <label className="form-label">Trip Icon</label>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                                    gap: 'var(--spacing-sm)'
                                }}>
                                    {coverEmojis.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, cover_image: emoji })}
                                            style={{
                                                fontSize: '2rem',
                                                padding: 'var(--spacing-md)',
                                                border: formData.cover_image === emoji
                                                    ? '3px solid var(--ocean-blue)'
                                                    : '1px solid var(--border-light)',
                                                borderRadius: 'var(--radius-md)',
                                                background: formData.cover_image === emoji
                                                    ? 'rgba(79, 70, 229, 0.1)'
                                                    : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all var(--transition-base)'
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

                            {/* Dates */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
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
                                <div className="form-error text-center">{error}</div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3" style={{ marginTop: 'var(--spacing-xl)' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 2 }}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Trip & Continue →'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-3" style={{ marginTop: 'var(--spacing-2xl)' }}>
                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📍</div>
                            <h4>Add Destinations</h4>
                            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                Plan multi-city trips
                            </p>
                        </div>
                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📅</div>
                            <h4>Day-wise Planning</h4>
                            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                Organize activities
                            </p>
                        </div>
                        <div className="card text-center">
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>💰</div>
                            <h4>Budget Tracking</h4>
                            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                Manage expenses
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip;
