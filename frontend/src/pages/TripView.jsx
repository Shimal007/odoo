import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TripView = ({ user, onLogout }) => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // list or timeline
    const [insights, setInsights] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchTrip();
    }, [tripId, user]);

    const fetchTrip = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}`);
            const data = await response.json();

            if (response.ok) {
                setTrip(data);
                if (data.destinations && data.destinations.length > 0) {
                    fetchInsights(data.destinations[0].city, data.destinations[0].country, data.start_date);
                }
            } else {
                navigate('/trips');
            }
        } catch (err) {
            console.error('Failed to fetch trip:', err);
            navigate('/trips');
        } finally {
            setLoading(false);
        }
    };

    const fetchInsights = async (city, country, startDate) => {
        setLoadingInsights(true);
        try {
            const response = await fetch('http://localhost:5000/api/trip-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city, country, startDate })
            });
            const data = await response.json();
            if (response.ok) {
                setInsights(data);
            }
        } catch (err) {
            console.error('Failed to fetch insights:', err);
        } finally {
            setLoadingInsights(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleShare = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}/share`, {
                method: 'POST'
            });
            const data = await response.json();

            if (response.ok) {
                navigator.clipboard.writeText(data.public_url);
                alert('Public link copied to clipboard!');
            }
        } catch (err) {
            console.error('Failed to share trip:', err);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <Navbar user={user} onLogout={onLogout} />
                <div className="container text-center p-5">
                    <p className="text-warm-gray">Loading your adventure...</p>
                </div>
            </div>
        );
    }

    if (!trip) return null;

    return (
        <div className="page-container">
            <Navbar user={user} onLogout={onLogout} />

            <div className="container section">
                {/* Minimal Header */}
                <div style={{
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '1.5rem'
                }} className="animate-fade-in">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{trip.name}</h1>
                            <p className="text-warm-gray" style={{ fontSize: '1.125rem' }}>
                                📅 {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => navigate(`/trips/${tripId}/edit`)} className="btn btn-outline btn-sm">Edit</button>
                            <button onClick={handleShare} className="btn btn-primary btn-sm">Share</button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-12 gap-3">
                    {/* Main Content - 8 cols */}
                    <div className="col-8">
                        {/* Itinerary Section */}
                        <div className="mb-4">
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Itinerary</h2>

                            {trip.destinations && trip.destinations.map((dest, idx) => (
                                <div key={idx} className="card mb-3" style={{ padding: '1.25rem' }}>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 style={{ fontSize: '1.25rem', color: 'var(--gold)' }}>
                                            {dest.city}, {dest.country}
                                        </h3>
                                        <span className="text-warm-gray" style={{ fontSize: '0.875rem' }}>
                                            {formatDate(dest.start_date)}
                                        </span>
                                    </div>

                                    {dest.activities && dest.activities.map((act, actIdx) => (
                                        <div key={actIdx} style={{
                                            padding: '0.75rem 0',
                                            borderTop: '1px solid rgba(184, 134, 11, 0.05)'
                                        }}>
                                            <div className="flex justify-between">
                                                <div className="flex-1">
                                                    <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                                                        <span style={{ color: 'var(--gold)', marginRight: '0.5rem' }}>{act.time}</span>
                                                        {act.name}
                                                    </h4>
                                                    <p className="text-warm-gray" style={{ fontSize: '0.875rem' }}>{act.description}</p>
                                                </div>
                                                {act.cost > 0 && <span className="font-semibold">${act.cost}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - 4 cols */}
                    <div className="col-4">
                        {/* AI Insights Card */}
                        <div className="card" style={{ padding: '1.25rem', background: 'var(--cream-light)', border: '1px solid var(--gold-light)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--gold-dark)' }}>✨ AI Insights</h3>

                            {loadingInsights ? (
                                <p className="text-warm-gray italic">Consulting AI experts...</p>
                            ) : insights ? (
                                <div>
                                    {/* Weather */}
                                    <div className="mb-4">
                                        <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.5rem' }}>🌤 Weather Forecast</h4>
                                        <p style={{ fontSize: '0.938rem', lineHeight: '1.4' }}>{insights.weatherForecast}</p>
                                    </div>

                                    {/* Packing List */}
                                    <div className="mb-4">
                                        <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.5rem' }}>🎒 Packing Essentials</h4>
                                        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.938rem' }}>
                                            {insights.packingList?.slice(0, 6).map((item, i) => (
                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Phrases */}
                                    <div className="mb-4">
                                        <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.5rem' }}>🗣 Local Phrases</h4>
                                        {insights.localPhrases?.slice(0, 3).map((p, i) => (
                                            <div key={i} style={{ marginBottom: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                                <div className="font-semibold">{p.phrase}</div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--gold)' }}>{p.translation}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', fontStyle: 'italic' }}>"{p.pronunciation}"</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pro Tips */}
                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.5rem' }}>💡 Pro Tips</h4>
                                        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.938rem' }}>
                                            {insights.proTips?.slice(0, 3).map((tip, i) => (
                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-warm-gray">No insights available for this trip.</p>
                            )}
                        </div>

                        {/* Budget Quick View */}
                        <div className="card mt-3" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>💰 Budget Overview</h3>
                            {trip.budget ? (
                                <div className="flex justify-between items-center">
                                    <span className="text-warm-gray">Total Planned</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold)' }}>${trip.budget.total || 0}</span>
                                </div>
                            ) : (
                                <p className="text-warm-gray">No budget set.</p>
                            )}
                            <button onClick={() => navigate(`/trips/${tripId}/budget`)} className="btn btn-ghost btn-sm mt-3 w-full">View Details</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .col-8 { grid-column: span 8; }
                .col-4 { grid-column: span 4; }
                .grid-12 { display: grid; grid-template-columns: repeat(12, 1fr); }
                @media (max-width: 992px) {
                    .col-8, .col-4 { grid-column: span 12; }
                }
            `}</style>
        </div>
    );
};

export default TripView;
