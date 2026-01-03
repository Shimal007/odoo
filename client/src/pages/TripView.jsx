import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TripView = ({ user, onLogout }) => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // list or timeline

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysBetween = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
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
            <div className="page-wrapper">
                <Navbar user={user} onLogout={onLogout} />
                <div className="content-wrapper">
                    <div className="container text-center">
                        <div className="animate-pulse" style={{ padding: 'var(--spacing-2xl)' }}>
                            Loading trip details...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!trip) {
        return null;
    }

    const totalDays = getDaysBetween(trip.start_date, trip.end_date);

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                <div className="container container-wide">
                    {/* Trip Header */}
                    <div className="card animate-fade-in" style={{
                        background: 'linear-gradient(135deg, var(--brown) 0%, var(--brown-dark) 100%)',
                        color: 'white',
                        padding: 'var(--spacing-2xl)',
                        borderRadius: '2rem',
                        marginBottom: 'var(--spacing-xl)',
                        border: '1px solid var(--gold)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'var(--gold)', opacity: 0.1, borderRadius: '50%', filter: 'blur(80px)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '4.5rem', marginBottom: 'var(--spacing-sm)', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))' }}>
                                    {trip.cover_image || '🌍'}
                                </div>
                                <h1 style={{ color: 'var(--gold)', marginBottom: 'var(--spacing-xs)', fontSize: '3.5rem', fontFamily: 'var(--font-serif)' }}>
                                    {trip.name}
                                </h1>
                                {trip.description && (
                                    <p style={{ opacity: 0.8, marginBottom: 'var(--spacing-lg)', fontSize: '1.1rem', maxWidth: '800px', color: 'var(--cream-light)' }}>
                                        {trip.description}
                                    </p>
                                )}
                                <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(184, 134, 11, 0.3)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', backdropFilter: 'blur(5px)' }}>
                                        📅 {formatDate(trip.start_date)} → {formatDate(trip.end_date)}
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(184, 134, 11, 0.3)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', backdropFilter: 'blur(5px)' }}>
                                        ⏱️ {totalDays} days
                                    </div>
                                    {trip.destinations && trip.destinations.length > 0 && (
                                        <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(184, 134, 11, 0.3)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', backdropFilter: 'blur(5px)' }}>
                                            📍 {trip.destinations.length} destinations
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3" style={{ minWidth: '200px' }}>
                                <button
                                    onClick={() => navigate(`/trips/${tripId}/edit`)}
                                    className="btn btn-primary"
                                    style={{ width: '100%', boxShadow: '0 10px 20px rgba(184, 134, 11, 0.2)' }}
                                >
                                    ✏️ Edit Itinerary
                                </button>
                                <button
                                    onClick={() => navigate(`/trips/${tripId}/budget`)}
                                    className="btn btn-outline"
                                    style={{ width: '100%', borderColor: 'var(--gold)', color: 'var(--gold)' }}
                                >
                                    💰 Budget Analysis
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="btn btn-ghost"
                                    style={{ width: '100%', color: 'var(--cream)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    🔗 Share Trip
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h2>Itinerary</h2>
                        <div className="flex gap-2">
                            <button
                                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setViewMode('list')}
                            >
                                📝 List View
                            </button>
                            <button
                                className={`btn btn-sm ${viewMode === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setViewMode('timeline')}
                            >
                                📅 Timeline View
                            </button>
                        </div>
                    </div>

                    {/* Destinations & Activities */}
                    {trip.destinations && trip.destinations.length > 0 ? (
                        <div className="grid" style={{ gap: 'var(--spacing-xl)' }}>
                            {trip.destinations.map((destination, index) => (
                                <div key={index} className="card card-elevated">
                                    <div className="card-header">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="card-title">
                                                    {index + 1}. {destination.city}, {destination.country}
                                                </h3>
                                                <p className="text-secondary">
                                                    {formatDate(destination.start_date)} - {formatDate(destination.end_date)}
                                                </p>
                                            </div>
                                            {destination.budget > 0 && (
                                                <div className="badge badge-warning">
                                                    💰 ${destination.budget}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {destination.activities && destination.activities.length > 0 ? (
                                        <div className="card-body">
                                            {destination.activities.map((activity, actIdx) => (
                                                <div
                                                    key={actIdx}
                                                    style={{
                                                        padding: 'var(--spacing-md)',
                                                        background: 'var(--bg-secondary)',
                                                        borderRadius: 'var(--radius-md)',
                                                        marginBottom: 'var(--spacing-md)',
                                                        borderLeft: '4px solid var(--ocean-blue)'
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div style={{ flex: 1 }}>
                                                            <h4 style={{ marginBottom: '0.25rem' }}>{activity.name}</h4>
                                                            {activity.description && (
                                                                <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                                                    {activity.description}
                                                                </p>
                                                            )}
                                                            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                                                {activity.time && (
                                                                    <span className="badge badge-primary">
                                                                        🕐 {activity.time}
                                                                    </span>
                                                                )}
                                                                {activity.duration && (
                                                                    <span className="badge badge-success">
                                                                        ⏱️ {activity.duration}h
                                                                    </span>
                                                                )}
                                                                {activity.type && (
                                                                    <span className="badge badge-primary">
                                                                        {activity.type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {activity.cost > 0 && (
                                                            <div className="text-primary font-semibold" style={{ fontSize: '1.125rem' }}>
                                                                ${activity.cost}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="card-body text-center text-secondary">
                                            <p>No activities added yet</p>
                                            <button
                                                onClick={() => navigate(`/trips/${tripId}/edit`)}
                                                className="btn btn-sm btn-outline mt-3"
                                            >
                                                Add Activities
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)', opacity: 0.3 }}>
                                📍
                            </div>
                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>No destinations added yet</h3>
                            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                Start building your itinerary by adding destinations
                            </p>
                            <button
                                onClick={() => navigate(`/trips/${tripId}/edit`)}
                                className="btn btn-primary"
                            >
                                Add Destinations
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripView;
