import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TripEdit = ({ user, onLogout }) => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Forms for adding destinations and activities
    const [showDestinationForm, setShowDestinationForm] = useState(false);
    const [showActivityForm, setShowActivityForm] = useState(false);
    const [selectedDestIndex, setSelectedDestIndex] = useState(null);

    const [newDestination, setNewDestination] = useState({
        city: '',
        country: '',
        start_date: '',
        end_date: '',
        budget: 0
    });

    const [newActivity, setNewActivity] = useState({
        name: '',
        description: '',
        time: '',
        duration: 1,
        cost: 0,
        type: 'sightseeing',
        day: 1
    });

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

    const handleTripUpdate = async (updates) => {
        setSaving(true);
        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                fetchTrip();
            }
        } catch (err) {
            console.error('Failed to update trip:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleAddDestination = async (e) => {
        e.preventDefault();

        const updatedDestinations = [...(trip.destinations || []), {
            ...newDestination,
            activities: [],
            order: trip.destinations?.length || 0
        }];

        await handleTripUpdate({ destinations: updatedDestinations });

        setNewDestination({
            city: '',
            country: '',
            start_date: '',
            end_date: '',
            budget: 0
        });
        setShowDestinationForm(false);
    };

    const handleAddActivity = async (e) => {
        e.preventDefault();

        const updatedDestinations = [...trip.destinations];
        if (!updatedDestinations[selectedDestIndex].activities) {
            updatedDestinations[selectedDestIndex].activities = [];
        }
        updatedDestinations[selectedDestIndex].activities.push(newActivity);

        await handleTripUpdate({ destinations: updatedDestinations });

        setNewActivity({
            name: '',
            description: '',
            time: '',
            duration: 1,
            cost: 0,
            type: 'sightseeing',
            day: 1
        });
        setShowActivityForm(false);
        setSelectedDestIndex(null);
    };

    const handleRemoveDestination = async (index) => {
        if (!confirm('Remove this destination and all its activities?')) return;

        const updatedDestinations = trip.destinations.filter((_, i) => i !== index);
        await handleTripUpdate({ destinations: updatedDestinations });
    };

    const handleRemoveActivity = async (destIndex, actIndex) => {
        if (!confirm('Remove this activity?')) return;

        const updatedDestinations = [...trip.destinations];
        updatedDestinations[destIndex].activities = updatedDestinations[destIndex].activities.filter((_, i) => i !== actIndex);

        await handleTripUpdate({ destinations: updatedDestinations });
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <Navbar user={user} onLogout={onLogout} />
                <div className="content-wrapper">
                    <div className="container text-center">
                        <div className="animate-pulse" style={{ padding: 'var(--spacing-2xl)' }}>
                            Loading trip...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!trip) return null;

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                <div className="container container-wide">
                    {/* Header */}
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div>
                            <h1>Edit Trip: {trip.name}</h1>
                            <p className="text-secondary">Build your itinerary and add activities</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/trips/${tripId}`)}
                                className="btn btn-secondary"
                            >
                                ← Back to View
                            </button>
                            <button
                                onClick={() => navigate('/trips')}
                                className="btn btn-outline"
                            >
                                Done
                            </button>
                        </div>
                    </div>

                    {/* Add Destination Button */}
                    <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <button
                            onClick={() => setShowDestinationForm(!showDestinationForm)}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                        >
                            {showDestinationForm ? '✖ Cancel' : '➕ Add Destination'}
                        </button>
                    </div>

                    {/* Destination Form */}
                    {showDestinationForm && (
                        <div className="card card-elevated" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Add New Destination</h3>
                            <form onSubmit={handleAddDestination}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                    <div className="form-group">
                                        <label className="form-label">City *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newDestination.city}
                                            onChange={(e) => setNewDestination({ ...newDestination, city: e.target.value })}
                                            required
                                            placeholder="e.g., Paris"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Country *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newDestination.country}
                                            onChange={(e) => setNewDestination({ ...newDestination, country: e.target.value })}
                                            required
                                            placeholder="e.g., France"
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Start Date *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={newDestination.start_date}
                                            onChange={(e) => setNewDestination({ ...newDestination, start_date: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">End Date *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={newDestination.end_date}
                                            onChange={(e) => setNewDestination({ ...newDestination, end_date: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Budget (USD)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={newDestination.budget}
                                            onChange={(e) => setNewDestination({ ...newDestination, budget: parseFloat(e.target.value) })}
                                            min="0"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Adding...' : 'Add Destination'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Destinations List */}
                    {trip.destinations && trip.destinations.length > 0 ? (
                        <div className="grid" style={{ gap: 'var(--spacing-xl)' }}>
                            {trip.destinations.map((destination, destIndex) => (
                                <div key={destIndex} className="card card-elevated">
                                    <div className="card-header">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="card-title">
                                                    {destIndex + 1}. {destination.city}, {destination.country}
                                                </h3>
                                                <p className="text-secondary">
                                                    {new Date(destination.start_date).toLocaleDateString()} - {new Date(destination.end_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDestIndex(destIndex);
                                                        setShowActivityForm(true);
                                                    }}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    ➕ Add Activity
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveDestination(destIndex)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Activity Form for this destination */}
                                    {showActivityForm && selectedDestIndex === destIndex && (
                                        <div style={{
                                            padding: 'var(--spacing-lg)',
                                            background: 'var(--bg-secondary)',
                                            borderRadius: 'var(--radius-md)',
                                            marginBottom: 'var(--spacing-md)'
                                        }}>
                                            <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Add Activity</h4>
                                            <form onSubmit={handleAddActivity}>
                                                <div className="form-group">
                                                    <label className="form-label">Activity Name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={newActivity.name}
                                                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                                                        required
                                                        placeholder="e.g., Visit Eiffel Tower"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Description</label>
                                                    <textarea
                                                        className="form-textarea"
                                                        value={newActivity.description}
                                                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                                        placeholder="Optional details about this activity"
                                                        rows="2"
                                                    />
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                                                    <div className="form-group">
                                                        <label className="form-label">Time</label>
                                                        <input
                                                            type="time"
                                                            className="form-input"
                                                            value={newActivity.time}
                                                            onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="form-label">Duration (hrs)</label>
                                                        <input
                                                            type="number"
                                                            className="form-input"
                                                            value={newActivity.duration}
                                                            onChange={(e) => setNewActivity({ ...newActivity, duration: parseFloat(e.target.value) })}
                                                            min="0.5"
                                                            step="0.5"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="form-label">Cost (USD)</label>
                                                        <input
                                                            type="number"
                                                            className="form-input"
                                                            value={newActivity.cost}
                                                            onChange={(e) => setNewActivity({ ...newActivity, cost: parseFloat(e.target.value) })}
                                                            min="0"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="form-label">Type</label>
                                                        <select
                                                            className="form-select"
                                                            value={newActivity.type}
                                                            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                                                        >
                                                            <option value="sightseeing">Sightseeing</option>
                                                            <option value="culture">Culture</option>
                                                            <option value="food">Food</option>
                                                            <option value="adventure">Adventure</option>
                                                            <option value="relaxation">Relaxation</option>
                                                            <option value="shopping">Shopping</option>
                                                            <option value="nightlife">Nightlife</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button type="submit" className="btn btn-sm btn-success" disabled={saving}>
                                                        {saving ? 'Adding...' : 'Add Activity'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowActivityForm(false);
                                                            setSelectedDestIndex(null);
                                                        }}
                                                        className="btn btn-sm btn-secondary"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* Activities List */}
                                    <div className="card-body">
                                        {destination.activities && destination.activities.length > 0 ? (
                                            destination.activities.map((activity, actIndex) => (
                                                <div
                                                    key={actIndex}
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
                                                                    <span className="badge badge-primary">🕐 {activity.time}</span>
                                                                )}
                                                                {activity.duration && (
                                                                    <span className="badge badge-success">⏱️ {activity.duration}h</span>
                                                                )}
                                                                {activity.type && (
                                                                    <span className="badge badge-primary">{activity.type}</span>
                                                                )}
                                                                {activity.cost > 0 && (
                                                                    <span className="badge badge-warning">${activity.cost}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveActivity(destIndex, actIndex)}
                                                            className="btn btn-sm btn-danger"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-secondary" style={{ padding: 'var(--spacing-lg)' }}>
                                                <p>No activities yet. Click "Add Activity" to start planning!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)', opacity: 0.3 }}>
                                📍
                            </div>
                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>No destinations yet</h3>
                            <p className="text-secondary">
                                Click "Add Destination" above to start building your itinerary
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripEdit;
