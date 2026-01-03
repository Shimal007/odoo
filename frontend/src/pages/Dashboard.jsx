import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TripCard from '../components/TripCard';

const Dashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTrips: 0,
        upcomingTrips: 0,
        totalDestinations: 0,
        totalBudget: 0
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchTrips();
    }, [user]);

    const fetchTrips = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/trips/user/${user._id}`);
            const data = await response.json();

            if (response.ok) {
                setTrips(data);
                calculateStats(data);
            }
        } catch (err) {
            console.error('Failed to fetch trips:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (tripsData) => {
        const now = new Date();
        const upcoming = tripsData.filter(trip => new Date(trip.start_date) > now);
        const totalDest = tripsData.reduce((sum, trip) => sum + (trip.destinations?.length || 0), 0);
        const totalBudg = tripsData.reduce((sum, trip) => sum + (trip.budget?.total || 0), 0);

        setStats({
            totalTrips: tripsData.length,
            upcomingTrips: upcoming.length,
            totalDestinations: totalDest,
            totalBudget: totalBudg
        });
    };

    const handleCreateTrip = () => {
        navigate('/trips/create');
    };

    const handleViewTrip = (tripId) => {
        navigate(`/trips/${tripId}`);
    };

    const handleEditTrip = (tripId) => {
        navigate(`/trips/${tripId}/edit`);
    };

    const handleDeleteTrip = async (tripId) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchTrips();
            }
        } catch (err) {
            console.error('Failed to delete trip:', err);
        }
    };

    const recommendedDestinations = [
        {
            name: 'Paris',
            country: 'France',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
        },
        {
            name: 'Tokyo',
            country: 'Japan',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
        },
        {
            name: 'Bali',
            country: 'Indonesia',
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
        },
        {
            name: 'New York',
            country: 'USA',
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'
        }
    ];

    return (
        <div className="page-container">
            <Navbar user={user} onLogout={onLogout} />

            <div className="container section">
                {/* Welcome Section - Clean & Simple */}
                <div className="mb-5 animate-fade-in">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                        Welcome back, {user?.first_name}!
                    </h1>
                    <p className="text-warm-gray" style={{ fontSize: '1.125rem' }}>
                        Ready to plan your next adventure?
                    </p>
                </div>

                {/* Stats Cards - Minimal Design */}
                <div className="grid grid-4 gap-3 mb-5">
                    <div className="card text-center">
                        <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--gold)' }}>
                            {stats.totalTrips}
                        </h3>
                        <p className="text-warm-gray" style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Total Trips
                        </p>
                    </div>

                    <div className="card text-center">
                        <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--gold)' }}>
                            {stats.upcomingTrips}
                        </h3>
                        <p className="text-warm-gray" style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Upcoming
                        </p>
                    </div>

                    <div className="card text-center">
                        <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--gold)' }}>
                            {stats.totalDestinations}
                        </h3>
                        <p className="text-warm-gray" style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Destinations
                        </p>
                    </div>

                    <div className="card text-center">
                        <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--gold)' }}>
                            ${stats.totalBudget}
                        </h3>
                        <p className="text-warm-gray" style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Total Budget
                        </p>
                    </div>
                </div>

                {/* Hero CTA - Clean with subtle gradient */}
                <div style={{
                    padding: '4rem 3rem',
                    background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.1), rgba(139, 105, 20, 0.05))',
                    border: '2px solid rgba(184, 134, 11, 0.2)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: '3rem',
                    textAlign: 'center'
                }} className="animate-fade-in">
                    <h2 style={{
                        fontSize: '2rem',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-serif)',
                        color: 'var(--charcoal)'
                    }}>
                        Start Planning Your Dream Trip
                    </h2>
                    <p className="text-warm-gray" style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
                        Create a new itinerary and explore amazing destinations
                    </p>
                    <button
                        onClick={handleCreateTrip}
                        className="btn btn-primary btn-lg"
                        style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}
                    >
                        Plan New Trip
                    </button>
                </div>

                {/* Recent Trips */}
                <div style={{ marginBottom: '3rem' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)' }}>Your Trips</h2>
                        <button onClick={() => navigate('/trips')} className="btn btn-ghost">
                            View All →
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center p-4">
                            <p className="text-warm-gray">Loading your trips...</p>
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="card text-center p-5">
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>No trips yet</h3>
                            <p className="text-warm-gray mb-3">
                                Start planning your first adventure!
                            </p>
                            <button onClick={handleCreateTrip} className="btn btn-primary">
                                Create Your First Trip
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-3 gap-3">
                            {trips.slice(0, 6).map((trip) => (
                                <TripCard
                                    key={trip._id}
                                    trip={trip}
                                    onView={handleViewTrip}
                                    onEdit={handleEditTrip}
                                    onDelete={handleDeleteTrip}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommended Destinations - With Real Images */}
                <div>
                    <h2 style={{ marginBottom: '2rem', fontSize: '1.75rem', fontFamily: 'var(--font-serif)' }}>
                        Recommended Destinations
                    </h2>
                    <div className="grid grid-4 gap-3">
                        {recommendedDestinations.map((dest, index) => (
                            <div
                                key={index}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-sm)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                                className="animate-fade-in-up"
                                onClick={() => navigate('/discover')}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                }}
                            >
                                <div style={{
                                    height: '200px',
                                    background: `url(${dest.image}) center/cover`,
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '1.5rem 1rem',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                        color: 'white'
                                    }}>
                                        <h4 style={{ marginBottom: '0.25rem', fontSize: '1.25rem', color: 'white' }}>
                                            {dest.name}
                                        </h4>
                                        <p style={{ fontSize: '0.875rem', opacity: 0.9, color: 'white' }}>
                                            {dest.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
