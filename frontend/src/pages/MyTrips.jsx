import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TripCard from '../components/TripCard';

const MyTrips = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleViewTrip = (tripId) => navigate(`/trips/${tripId}`);
    const handleEditTrip = (tripId) => navigate(`/trips/${tripId}/edit`);

    const handleDeleteTrip = async (tripId) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;
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
        let filtered = trips;

        switch (filter) {
            case 'ongoing':
                filtered = trips.filter(trip => {
                    const start = new Date(trip.start_date);
                    const end = new Date(trip.end_date);
                    return now >= start && now <= end;
                });
                break;
            case 'upcoming':
                filtered = trips.filter(trip => new Date(trip.start_date) > now);
                break;
            case 'completed':
                filtered = trips.filter(trip => new Date(trip.end_date) < now);
                break;
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter(trip =>
                trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                trip.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredTrips = getFilteredTrips();
    const counts = {
        all: trips.length,
        ongoing: trips.filter(t => {
            const now = new Date();
            return now >= new Date(t.start_date) && now <= new Date(t.end_date);
        }).length,
        upcoming: trips.filter(t => new Date(t.start_date) > new Date()).length,
        completed: trips.filter(t => new Date(t.end_date) < new Date()).length,
    };

    return (
        <div className="page-container">
            <Navbar user={user} onLogout={onLogout} />

            <div className="container section">
                {/* Header */}
                <div className="card mb-4 animate-fade-in-up">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-gradient-gold" style={{ fontSize: '2.5rem' }}>
                                My Trips
                            </h1>
                            <p className="text-warm-gray">
                                Manage and explore your travel adventures
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/trips/create')}
                            className="btn btn-primary"
                        >
                            ✨ Create New Trip
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-4 animate-fade-in">
                    <div className="search-bar mb-3">
                        <span style={{ fontSize: '1.25rem' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search trips..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-chips">
                        <button
                            className={`filter-chip ${filter === 'all' ? 'filter-chip-active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Trips ({counts.all})
                        </button>
                        <button
                            className={`filter-chip ${filter === 'ongoing' ? 'filter-chip-active' : ''}`}
                            onClick={() => setFilter('ongoing')}
                        >
                            Ongoing ({counts.ongoing})
                        </button>
                        <button
                            className={`filter-chip ${filter === 'upcoming' ? 'filter-chip-active' : ''}`}
                            onClick={() => setFilter('upcoming')}
                        >
                            Upcoming ({counts.upcoming})
                        </button>
                        <button
                            className={`filter-chip ${filter === 'completed' ? 'filter-chip-active' : ''}`}
                            onClick={() => setFilter('completed')}
                        >
                            Completed ({counts.completed})
                        </button>
                    </div>
                </div>

                {/* Trips Grid */}
                {loading ? (
                    <div className="card text-center p-4">
                        <p className="text-warm-gray">Loading your trips...</p>
                    </div>
                ) : filteredTrips.length === 0 ? (
                    <div className="card text-center p-4 animate-fade-in-up">
                        <div style={{ fontSize: '5rem', opacity: 0.3, marginBottom: '1rem' }}>
                            {searchQuery ? '🔍' : filter === 'all' ? '✈️' : '📭'}
                        </div>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                            {searchQuery ? 'No trips found' : filter === 'all' ? 'No trips yet' : `No ${filter} trips`}
                        </h3>
                        <p className="text-warm-gray mb-3">
                            {searchQuery ? 'Try adjusting your search terms' :
                                filter === 'all' ? 'Start planning your first adventure!' :
                                    'Try selecting a different filter'}
                        </p>
                        {filter === 'all' && !searchQuery && (
                            <button
                                onClick={() => navigate('/trips/create')}
                                className="btn btn-primary"
                            >
                                Create Your First Trip
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-3 gap-3">
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
    );
};

export default MyTrips;
