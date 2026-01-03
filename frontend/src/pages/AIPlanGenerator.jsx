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

    return (
        <div className="page-container">
            <Navbar user={user} onLogout={onLogout} />

            <div className="container section" style={{ maxWidth: '900px' }}>
                {/* Header */}
                <div className="text-center mb-4 animate-fade-in">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                        AI Travel Planner
                    </h1>
                    <p className="text-warm-gray">
                        {tripData?.city}, {tripData?.country}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gold)', marginTop: '0.5rem' }}>
                        {tripData?.startDate} — {tripData?.endDate}
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="card text-center p-4 animate-fade-in">
                        <div className="mb-3" style={{ fontSize: '3rem' }}>✨</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Generating Your Itinerary</h3>
                        <p className="text-warm-gray">
                            Our AI is creating a personalized travel plan...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="card p-4 animate-fade-in" style={{ borderColor: 'var(--danger)' }}>
                        <div className="text-center">
                            <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Error</h3>
                            <p className="text-warm-gray mb-3">{error}</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={generateAIPlan} className="btn btn-outline">
                                    Try Again
                                </button>
                                <button onClick={() => navigate('/trips/create')} className="btn btn-ghost">
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Itinerary Display */}
                {itinerary && !loading && (
                    <div className="animate-fade-in">
                        {/* Overview Card */}
                        <div className="card mb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
                                        {itinerary.tripName}
                                    </h2>
                                    <p className="text-warm-gray" style={{ lineHeight: '1.8' }}>
                                        {itinerary.overview}
                                    </p>
                                </div>
                                <button
                                    onClick={handleSaveTrip}
                                    className="btn btn-primary"
                                    disabled={saving}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {saving ? 'Saving...' : 'Save Trip'}
                                </button>
                            </div>

                            {/* Budget Summary */}
                            {itinerary.estimatedBudget && (
                                <div className="grid grid-3 gap-3 mt-4" style={{ 
                                    paddingTop: '1.5rem',
                                    borderTop: '1px solid rgba(184, 134, 11, 0.1)'
                                }}>
                                    <div className="text-center">
                                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.25rem' }}>
                                            ${itinerary.estimatedBudget.total || 0}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Total Budget
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.25rem' }}>
                                            {itinerary.days?.length || 0}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Days
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.25rem' }}>
                                            {itinerary.days?.reduce((sum, day) => sum + (day.activities?.length || 0), 0) || 0}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Activities
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Day-by-Day Itinerary */}
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--charcoal)', fontWeight: 600 }}>
                                Your Itinerary
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {itinerary.days && itinerary.days.map((day, dayIdx) => (
                                    <div key={dayIdx} className="card">
                                        {/* Day Header */}
                                        <div className="flex justify-between items-center mb-4" style={{
                                            paddingBottom: '1rem',
                                            borderBottom: '2px solid rgba(184, 134, 11, 0.1)'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                    Day {day.dayNumber}
                                                </div>
                                                <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                                                    {day.title}
                                                </h4>
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--warm-gray)' }}>
                                                {day.date}
                                            </div>
                                        </div>

                                        {/* Activities */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {day.activities && day.activities.map((activity, actIdx) => (
                                                <div key={actIdx}>
                                                    {/* Activity Header */}
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span style={{ 
                                                                    fontSize: '0.75rem', 
                                                                    fontWeight: 600,
                                                                    color: 'var(--gold)',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.05em'
                                                                }}>
                                                                    {activity.time}
                                                                </span>
                                                                {activity.cost > 0 && (
                                                                    <span style={{ 
                                                                        fontSize: '0.875rem', 
                                                                        fontWeight: 600,
                                                                        color: 'var(--charcoal)'
                                                                    }}>
                                                                        ${activity.cost}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h5 style={{ 
                                                                fontSize: '1.125rem', 
                                                                marginBottom: '0.5rem',
                                                                fontWeight: 600,
                                                                color: 'var(--charcoal)'
                                                            }}>
                                                                {activity.title}
                                                            </h5>
                                                            <p className="text-warm-gray" style={{ 
                                                                fontSize: '0.875rem', 
                                                                lineHeight: '1.6',
                                                                marginBottom: '0.75rem'
                                                            }}>
                                                                {activity.description}
                                                            </p>
                                                            {activity.location && (
                                                                <a
                                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.title + ' ' + itinerary.city)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{ 
                                                                        fontSize: '0.75rem', 
                                                                        color: 'var(--gold)',
                                                                        textDecoration: 'none',
                                                                        fontWeight: 600
                                                                    }}
                                                                >
                                                                    View on Map →
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Map Embed */}
                                                    <div style={{
                                                        width: '100%',
                                                        height: '250px',
                                                        borderRadius: 'var(--radius-md)',
                                                        overflow: 'hidden',
                                                        border: '1px solid rgba(184, 134, 11, 0.15)'
                                                    }}>
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            style={{ border: 0 }}
                                                            loading="lazy"
                                                            allowFullScreen
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(activity.title + ' ' + itinerary.city + ' ' + itinerary.country)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                                        ></iframe>
                                                    </div>

                                                    {/* Divider between activities */}
                                                    {actIdx < day.activities.length - 1 && (
                                                        <div style={{ 
                                                            height: '1px', 
                                                            background: 'rgba(184, 134, 11, 0.1)', 
                                                            margin: '1.5rem 0' 
                                                        }}></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-center mt-4">
                            <button
                                onClick={() => navigate('/trips/create')}
                                className="btn btn-ghost"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={generateAIPlan}
                                className="btn btn-outline"
                                disabled={loading}
                            >
                                Regenerate
                            </button>
                            <button
                                onClick={handleSaveTrip}
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Trip'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIPlanGenerator;
