import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TripCard from '../components/TripCard';

const MyTrips = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, past

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
            }
        } catch (err) {
            console.error('Failed to fetch trips:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewTrip = (tripId) => {
        navigate(`/trips/${tripId}`);
    };

    const handleEditTrip = (tripId) => {
        navigate(`/trips/${tripId}/edit`);
    };

    const handleDeleteTrip = async (tripId) => {
        if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setTrips(trips.filter(trip => trip._id !== tripId));
            }
        } catch (err) {
            console.error('Failed to delete trip:', err);
        }
    };

    const getFilteredTrips = () => {
        const now = new Date();

        switch (filter) {
            case 'upcoming':
                return trips.filter(trip => new Date(trip.start_date) > now);
            case 'past':
                return trips.filter(trip => new Date(trip.end_date) < now);
            default:
                return trips;
        }
    };

    const filteredTrips = getFilteredTrips();

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                <div className="container container-wide">
                    {/* Header */}
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div>
                            <h1>My Trips 🗺️</h1>
                            <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
                                Manage and view all your travel plans
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/trips/create')}
                            className="btn btn-primary btn-lg"
                        >
                            ✨ Create New Trip
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <button
                            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('all')}
                        >
                            All Trips ({trips.length})
                        </button>
                        <button
                            className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('upcoming')}
                        >
                            Upcoming ({trips.filter(t => new Date(t.start_date) > new Date()).length})
                        </button>
                        <button
                            className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('past')}
                        >
                            Past ({trips.filter(t => new Date(t.end_date) < new Date()).length})
                        </button>
                    </div>

                    {/* Trips Grid */}
                    {loading ? (
                        <div className="text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                            <div className="animate-pulse">Loading your trips...</div>
                        </div>
                    ) : filteredTrips.length === 0 ? (
                        <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                            <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-lg)', opacity: 0.3 }}>
                                {filter === 'all' ? '✈️' : filter === 'upcoming' ? '📅' : '📚'}
                            </div>
                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                                {filter === 'all'
                                    ? 'No trips yet'
                                    : filter === 'upcoming'
                                        ? 'No upcoming trips'
                                        : 'No past trips'}
                            </h3>
                            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-xl)', maxWidth: '500px', margin: '0 auto' }}>
                                {filter === 'all'
                                    ? 'Start planning your first adventure and create unforgettable memories!'
                                    : filter === 'upcoming'
                                        ? 'Plan a new trip to add to your upcoming adventures'
                                        : 'Complete some trips to see them here'}
                            </p>
                            {filter === 'all' && (
                                <button
                                    onClick={() => navigate('/trips/create')}
                                    className="btn btn-primary btn-lg"
                                >
                                    Create Your First Trip
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-3">
                            {filteredTrips.map((trip) => (
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
            </div>
        </div>
    );
};

export default MyTrips;
