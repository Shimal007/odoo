import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AIPlanGenerator = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const tripData = location.state;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [itinerary, setItinerary] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!tripData) {
            navigate('/trips/create');
            return;
        }

        // Auto-generate AI plan on mount
        generateAIPlan();
    }, [user, tripData]);

    const generateAIPlan = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/generate-ai-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    city: tripData.city,
                    country: tripData.country,
                    startDate: tripData.startDate,
                    endDate: tripData.endDate,
                    tripName: tripData.tripName,
                    description: tripData.description
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setItinerary(data.itinerary);
            } else {
                setError(data.error || 'Failed to generate AI plan');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTrip = async () => {
        setSaving(true);

        try {
            const response = await fetch('http://localhost:5000/api/trips/save-ai-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user._id,
                    itinerary: itinerary
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`/trips/${data.trip._id}`);
            } else {
                setError(data.error || 'Failed to save trip');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleEditActivity = (dayIndex, activityIndex, field, value) => {
        const updatedItinerary = { ...itinerary };
        updatedItinerary.days[dayIndex].activities[activityIndex][field] = value;
        setItinerary(updatedItinerary);
    };

    const handleDeleteActivity = (dayIndex, activityIndex) => {
        const updatedItinerary = { ...itinerary };
        updatedItinerary.days[dayIndex].activities.splice(activityIndex, 1);
        setItinerary(updatedItinerary);
    };

    return (
        <div className="page-container">
            <Navbar user={user} onLogout={onLogout} />

            <div className="container section">
                {/* Header */}
                <div className="card mb-4 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-gradient-gold" style={{ fontSize: '2.5rem' }}>
                                🤖 AI Trip Planner
                            </h1>
                            <p className="text-warm-gray">
                                {tripData?.city}, {tripData?.country} • {tripData?.startDate} to {tripData?.endDate}
                            </p>
                        </div>
                        {itinerary && (
                            <button
                                onClick={handleSaveTrip}
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : '💾 Save Trip'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="card text-center p-4 animate-fade-in">
                        <div className="mb-3" style={{ fontSize: '3rem' }}>🤖</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Generating your AI-powered itinerary...</h3>
                        <p className="text-warm-gray">
                            Our AI is creating a personalized travel plan just for you!
                        </p>
                        <div className="mt-3">
                            <div style={{
                                display: 'inline-block',
                                width: '200px',
                                height: '4px',
                                background: 'rgba(184, 134, 11, 0.2)',
                                borderRadius: '2px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '60%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--gold), var(--gold-dark))',
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="card p-4 animate-fade-in" style={{ borderColor: 'var(--danger)' }}>
                        <div className="text-center">
                            <div className="mb-2" style={{ fontSize: '2rem' }}>⚠️</div>
                            <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Error</h3>
                            <p className="text-warm-gray mb-3">{error}</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={generateAIPlan} className="btn btn-outline">
                                    Try Again
                                </button>
                                <button onClick={() => navigate('/trips/create')} className="btn btn-ghost">
                                    Back to Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Itinerary Display */}
                {itinerary && !loading && (
                    <div className="animate-fade-in">
                        {/* Overview */}
                        <div className="card mb-4">
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{itinerary.tripName}</h2>
                            <p className="text-warm-gray mb-3">{itinerary.overview}</p>

                            {/* Highlights */}
                            {itinerary.highlights && itinerary.highlights.length > 0 && (
                                <div className="mb-3">
                                    <h4 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>✨ Highlights</h4>
                                    <ul style={{ paddingLeft: '1.5rem' }}>
                                        {itinerary.highlights.map((highlight, idx) => (
                                            <li key={idx} className="text-warm-gray mb-1">{highlight}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Budget */}
                            {itinerary.estimatedBudget && (
                                <div className="grid grid-3 gap-3 mt-4">
                                    <div className="stat-box">
                                        <div className="stat-number" style={{ fontSize: '1.5rem' }}>
                                            ${itinerary.estimatedBudget.total || 0}
                                        </div>
                                        <div className="stat-label">Total Budget</div>
                                    </div>
                                    <div className="stat-box">
                                        <div className="stat-number" style={{ fontSize: '1.5rem' }}>
                                            {itinerary.days?.length || 0}
                                        </div>
                                        <div className="stat-label">Days</div>
                                    </div>
                                    <div className="stat-box">
                                        <div className="stat-number" style={{ fontSize: '1.5rem' }}>
                                            {itinerary.days?.reduce((sum, day) => sum + (day.activities?.length || 0), 0) || 0}
                                        </div>
                                        <div className="stat-label">Activities</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Day-by-Day Itinerary */}
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--charcoal)' }}>
                                📅 Day-by-Day Itinerary
                            </h3>

                            {itinerary.days && itinerary.days.map((day, dayIdx) => (
                                <div key={dayIdx} className="card mb-4 animate-fade-in-up" style={{ animationDelay: `${dayIdx * 0.1}s` }}>
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <h4 style={{ fontSize: '1.25rem', color: 'var(--gold)' }}>
                                                Day {day.dayNumber}
                                            </h4>
                                            <p className="text-warm-gray text-sm">{day.date} • {day.title}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {day.activities && day.activities.map((activity, actIdx) => (
                                            <div
                                                key={actIdx}
                                                className="card-cream p-3"
                                                style={{ borderLeft: '4px solid var(--gold)' }}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                                                                {activity.time}
                                                            </span>
                                                            <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                                                                {activity.type}
                                                            </span>
                                                            {activity.cost > 0 && (
                                                                <span className="text-gold" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                                                    ${activity.cost}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h5 style={{ fontSize: '1.125rem' }}>
                                                                {activity.title}
                                                            </h5>
                                                            <a
                                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((activity.location || activity.title) + ' ' + (itinerary.city || ''))}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1 text-xs font-bold text-warm-gray hover:text-gold transition-colors"
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                <span>📍 View on Map</span>
                                                            </a>
                                                        </div>
                                                        <p className="text-warm-gray" style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                                                            {activity.description}
                                                        </p>

                                                        {/* Map Embed */}
                                                        <div className="w-full h-40 rounded-lg overflow-hidden border border-cream shadow-inner mb-3">
                                                            <iframe
                                                                width="100%"
                                                                height="100%"
                                                                style={{ border: 0 }}
                                                                loading="lazy"
                                                                allowFullScreen
                                                                referrerPolicy="no-referrer-when-downgrade"
                                                                src={`https://maps.google.com/maps?q=${encodeURIComponent((activity.location || activity.title) + ' ' + (itinerary.city || ''))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                                            ></iframe>
                                                        </div>

                                                        {activity.location && (
                                                            <p className="text-warm-gray italic" style={{ fontSize: '0.75rem' }}>
                                                                Address: {activity.location}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteActivity(dayIdx, actIdx)}
                                                        className="btn btn-ghost btn-sm"
                                                        style={{ color: 'var(--danger)', fontSize: '1.25rem' }}
                                                        title="Remove activity"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions Footer */}
                        <div className="flex gap-3 justify-center mt-4">
                            <button
                                onClick={() => navigate('/trips/create')}
                                className="btn btn-ghost"
                            >
                                ← Back to Create
                            </button>
                            <button
                                onClick={generateAIPlan}
                                className="btn btn-outline"
                                disabled={loading}
                            >
                                🔄 Regenerate Plan
                            </button>
                            <button
                                onClick={handleSaveTrip}
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : '💾 Save & Continue'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIPlanGenerator;
