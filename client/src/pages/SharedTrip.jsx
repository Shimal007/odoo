import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedTrip = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        fetchSharedTrip();
    }, [tripId]);

    const fetchSharedTrip = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/shared/${tripId}`);
            const data = await response.json();

            if (response.ok) {
                setTrip(data);
            } else {
                setError('This trip is not available or not public');
            }
        } catch (err) {
            setError('Failed to load trip');
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

    const handleCopyTrip = () => {
        alert('Copy trip feature requires user authentication. Please log in to copy this itinerary!');
        navigate('/signup');
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out this amazing ${trip.name} itinerary on GlobeTrotter!`;

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        };

        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)'
            }}>
                <div className="animate-pulse">Loading trip...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                background: 'var(--bg-primary)',
                padding: 'var(--spacing-xl)'
            }}>
                <div className="card text-center" style={{ maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)', opacity: 0.3 }}>
                        🔒
                    </div>
                    <h2>{error}</h2>
                    <p className="text-secondary" style={{ marginTop: 'var(--spacing-md)' }}>
                        This trip may be private or does not exist
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                        style={{ marginTop: 'var(--spacing-lg)' }}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!trip) return null;

    const totalDays = getDaysBetween(trip.start_date, trip.end_date);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Header Bar */}
            <div style={{
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-light)',
                padding: 'var(--spacing-md) 0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div className="container">
                    <div className="flex justify-between items-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <h2 style={{
                                fontFamily: 'Playfair Display, serif',
                                background: 'linear-gradient(135deg, var(--sky-gradient-start), var(--sky-gradient-end))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                margin: 0
                            }}>
                                ✈️ GlobeTrotter
                            </h2>
                            <span className="badge badge-primary">Public Trip</span>
                        </div>
                        <button onClick={() => navigate('/')} className="btn btn-secondary btn-sm">
                            Sign Up to Create Your Own
                        </button>
                    </div>
                </div>
            </div>

            <div className="content-wrapper">
                <div className="container container-wide">
                    {/* Trip Header */}
                    <div className="card animate-fade-in" style={{
                        background: 'linear-gradient(135deg, var(--brown) 0%, var(--brown-dark) 100%)',
                        color: 'white',
                        padding: 'var(--spacing-2xl)',
                        borderRadius: '2.5rem',
                        marginBottom: 'var(--spacing-2xl)',
                        border: '1px solid var(--gold)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'var(--gold)', opacity: 0.1, borderRadius: '50%', filter: 'blur(100px)' }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-md)', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))' }}>
                                {trip.cover_image || '🌍'}
                            </div>
                            <h1 style={{ color: 'var(--gold)', marginBottom: 'var(--spacing-md)', fontSize: '3.5rem', fontFamily: 'var(--font-serif)' }}>
                                {trip.name}
                            </h1>
                            {trip.description && (
                                <p style={{ opacity: 0.8, marginBottom: 'var(--spacing-lg)', fontSize: '1.25rem', maxWidth: '800px', color: 'var(--cream-light)' }}>
                                    {trip.description}
                                </p>
                            )}
                            <div className="flex gap-4" style={{ flexWrap: 'wrap', marginBottom: 'var(--spacing-2xl)' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184, 134, 11, 0.3)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', fontSize: '1rem', backdropFilter: 'blur(10px)' }}>
                                    📅 {formatDate(trip.start_date)} → {formatDate(trip.end_date)}
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184, 134, 11, 0.3)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', fontSize: '1rem', backdropFilter: 'blur(10px)' }}>
                                    ⏱️ {totalDays} days
                                </div>
                                {trip.destinations && trip.destinations.length > 0 && (
                                    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184, 134, 11, 0.3)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', fontSize: '1rem', backdropFilter: 'blur(10px)' }}>
                                        📍 {trip.destinations.length} destinations
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                                <button
                                    onClick={handleCopyTrip}
                                    className="btn btn-primary btn-lg"
                                    style={{ padding: '1rem 2.5rem', borderRadius: 'var(--radius-full)', boxShadow: '0 10px 20px rgba(184, 134, 11, 0.3)' }}
                                >
                                    📋 Save/Copy to My Trips
                                </button>
                                <button
                                    onClick={handleCopyUrl}
                                    className="btn btn-lg"
                                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem 2.5rem', borderRadius: 'var(--radius-full)' }}
                                >
                                    {copySuccess ? '✅ Link Copied!' : '🔗 Copy Share Link'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Share Section */}
                    <div className="card" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Share this trip 📱</h3>
                        <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            Inspire your friends and family with this itinerary
                        </p>
                        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                            <button
                                onClick={() => handleShare('twitter')}
                                className="btn btn-secondary"
                                style={{ flex: '1 0 150px' }}
                            >
                                🐦 Twitter
                            </button>
                            <button
                                onClick={() => handleShare('facebook')}
                                className="btn btn-secondary"
                                style={{ flex: '1 0 150px' }}
                            >
                                📘 Facebook
                            </button>
                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="btn btn-secondary"
                                style={{ flex: '1 0 150px' }}
                            >
                                💬 WhatsApp
                            </button>
                            <button
                                onClick={() => handleShare('linkedin')}
                                className="btn btn-secondary"
                                style={{ flex: '1 0 150px' }}
                            >
                                💼 LinkedIn
                            </button>
                        </div>
                    </div>

                    {/* Itinerary */}
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Trip Itinerary</h2>

                    {trip.destinations && trip.destinations.length > 0 ? (
                        <div className="grid" style={{ gap: 'var(--spacing-xl)' }}>
                            {trip.destinations.map((destination, index) => (
                                <div key={index} className="card card-elevated animate-fade-in">
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
                                                                    <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
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
                                            <p>No activities listed for this destination</p>
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
                            <p className="text-secondary">
                                This trip is still being planned
                            </p>
                        </div>
                    )}

                    {/* CTA Footer */}
                    <div className="card" style={{
                        marginTop: 'var(--spacing-2xl)',
                        background: 'linear-gradient(135deg, var(--sky-gradient-start), var(--sky-gradient-end))',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>
                            Love this itinerary? ❤️
                        </h2>
                        <p style={{ opacity: 0.95, marginBottom: 'var(--spacing-xl)', fontSize: '1.125rem' }}>
                            Create your own personalized travel plans with GlobeTrotter
                        </p>
                        <div className="flex gap-3 justify-center" style={{ flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/signup')}
                                className="btn btn-lg"
                                style={{ background: 'white', color: 'var(--ocean-blue)' }}
                            >
                                Sign Up Free
                            </button>
                            <button
                                onClick={handleCopyTrip}
                                className="btn btn-lg btn-outline"
                                style={{ borderColor: 'white', color: 'white' }}
                            >
                                Copy This Trip
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-2xl)',
                borderTop: '1px solid var(--border-light)',
                marginTop: 'var(--spacing-2xl)'
            }}>
                <p className="text-secondary">
                    Made with ❤️ on <strong>GlobeTrotter</strong> - Your Travel Planning Companion
                </p>
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <button onClick={() => navigate('/')} className="btn btn-ghost">
                        Create Your Own Trip →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SharedTrip;
