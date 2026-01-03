const TripCard = ({ trip, onView, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDuration = () => {
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return `${days} ${days === 1 ? 'day' : 'days'}`;
    };

    const getDestinationCount = () => {
        return trip.destinations?.length || 0;
    };

    const getActivityCount = () => {
        return trip.destinations?.reduce((total, dest) => total + (dest.activities?.length || 0), 0) || 0;
    };

    const getTripStatus = () => {
        const now = new Date();
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);

        if (now < start) return { label: 'Upcoming', class: 'badge-warning' };
        if (now >= start && now <= end) return { label: 'Ongoing', class: 'badge-success' };
        return { label: 'Completed', class: 'badge-gray' };
    };

    const status = getTripStatus();

    return (
        <div className="card card-compact animate-fade-in-up">
            {/* Card Header */}
            <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(184, 134, 11, 0.15)' }}>
                <div className="flex justify-between" style={{ marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                            {trip.name}
                        </h3>
                        <p className="text-warm-gray" style={{ fontSize: '0.875rem' }}>
                            📅 {formatDate(trip.start_date)} → {formatDate(trip.end_date)}
                        </p>
                    </div>
                    <span className={`badge ${status.class}`}>
                        {status.label}
                    </span>
                </div>

                {trip.description && (
                    <p className="text-warm-gray" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                        {trip.description.length > 100 ? trip.description.substring(0, 100) + '...' : trip.description}
                    </p>
                )}
            </div>

            {/* Stats Section */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div className="grid grid-3 gap-2">
                    <div className="stat-box">
                        <div className="stat-number" style={{ fontSize: '2rem' }}>
                            {getDestinationCount()}
                        </div>
                        <div className="stat-label">
                            Cities
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number" style={{ fontSize: '2rem' }}>
                            {getActivityCount()}
                        </div>
                        <div className="stat-label">
                            Activities
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number" style={{ fontSize: '2rem' }}>
                            {getDuration().split(' ')[0]}
                        </div>
                        <div className="stat-label">
                            Days
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Section */}
            {trip.budget && trip.budget.total > 0 && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.08), rgba(139, 105, 20, 0.08))',
                    border: '1px solid rgba(184, 134, 11, 0.2)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <div className="flex justify-between items-center">
                        <span className="text-warm-gray" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            Total Budget
                        </span>
                        <span className="text-gold" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                            ${trip.budget.total.toLocaleString()}
                        </span>
                    </div>
                    <div className="text-right mt-1">
                        <span className="text-warm-gray" style={{ fontSize: '0.75rem' }}>
                            ~${(trip.budget.total / parseInt(getDuration())).toFixed(0)} per day
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => onView(trip._id)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                >
                    👁️ View
                </button>
                <button
                    onClick={() => onEdit(trip._id)}
                    className="btn btn-outline btn-sm"
                    title="Edit Trip"
                >
                    ✏️
                </button>
                <button
                    onClick={() => onDelete(trip._id)}
                    className="btn btn-outline btn-sm"
                    title="Delete Trip"
                    style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'var(--danger)';
                        e.target.style.color = 'var(--white)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--danger)';
                    }}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default TripCard;
