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
        { name: 'Paris', country: 'France', emoji: '🗼', color: '#667eea' },
        { name: 'Tokyo', country: 'Japan', emoji: '🗾', color: '#f59e0b' },
        { name: 'Bali', country: 'Indonesia', emoji: '🏝️', color: '#10b981' },
        { name: 'New York', country: 'USA', emoji: '🗽', color: '#ef4444' }
    ];

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                <div className="container container-wide">
                    {/* Welcome Section */}
                    <div className="animate-fade-in" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                            Welcome back, {user?.first_name}! 👋
                        </h1>
                        <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
                            Ready to plan your next adventure?
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div className="card text-center">
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>🌍</div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{stats.totalTrips}</h3>
                            <p className="text-secondary">Total Trips</p>
                        </div>

                        <div className="card text-center">
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>📅</div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{stats.upcomingTrips}</h3>
                            <p className="text-secondary">Upcoming</p>
                        </div>

                        <div className="card text-center">
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>📍</div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{stats.totalDestinations}</h3>
                            <p className="text-secondary">Destinations</p>
                        </div>

                        <div className="card text-center">
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>💰</div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>${stats.totalBudget}</h3>
                            <p className="text-secondary">Total Budget</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{
                        padding: 'var(--spacing-2xl)',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: 'var(--spacing-2xl)',
                        textAlign: 'center',
                        color: 'white'
                    }}>
                        <h2 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>
                            Start Planning Your Dream Trip
                        </h2>
                        <p style={{ marginBottom: 'var(--spacing-lg)', opacity: 0.9 }}>
                            Create a new itinerary and explore amazing destinations
                        </p>
                        <button onClick={handleCreateTrip} className="btn btn-lg" style={{
                            background: 'white',
                            color: 'var(--ocean-blue)'
                        }}>
                            ✨ Plan New Trip
                        </button>
                    </div>

                    {/* Recent Trips */}
                    <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <h2>Your Trips</h2>
                            <button onClick={() => navigate('/trips')} className="btn btn-ghost">
                                View All →
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                                <div className="animate-pulse">Loading your trips...</div>
                            </div>
                        ) : trips.length === 0 ? (
                            <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}>
                                    ✈️
                                </div>
                                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>No trips yet</h3>
                                <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    Start planning your first adventure!
                                </p>
                                <button onClick={handleCreateTrip} className="btn btn-primary">
                                    Create Your First Trip
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-3">
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

                    {/* Recommended Destinations */}
                    <div>
                        <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Recommended Destinations</h2>
                        <div className="grid grid-4">
                            {recommendedDestinations.map((dest, index) => (
                                <div
                                    key={index}
                                    className="card"
                                    style={{
                                        background: `linear-gradient(135deg, ${dest.color}20, ${dest.color}10)`,
                                        borderLeft: `4px solid ${dest.color}`,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate('/discover')}
                                >
                                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>
                                        {dest.emoji}
                                    </div>
                                    <h4 style={{ marginBottom: '0.25rem' }}>{dest.name}</h4>
                                    <p className="text-secondary">{dest.country}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
