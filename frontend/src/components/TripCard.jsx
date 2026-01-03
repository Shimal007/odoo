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

    return (
        <div className="card card-elevated animate-fade-in">
            {trip.cover_image && (
                <div style={{
                    height: '200px',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--spacing-lg)',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, var(--sky-gradient-start), var(--sky-gradient-end))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem'
                }}>
                    {trip.cover_image || '🌍'}
                </div>
            )}

            <div className="card-header">
                <h3 className="card-title">{trip.name}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-xs)' }}>
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </p>
            </div>

            <div className="card-body">
                {trip.description && (
                    <p className="text-secondary" style={{ marginBottom: 'var(--spacing-md)' }}>
                        {trip.description}
                    </p>
                )}

                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">
                        📍 {getDestinationCount()} {getDestinationCount() === 1 ? 'destination' : 'destinations'}
                    </span>
                    <span className="badge badge-success">
                        ⏱️ {getDuration()}
                    </span>
                    {trip.budget && trip.budget.total > 0 && (
                        <span className="badge badge-warning">
                            💰 ${trip.budget.total}
                        </span>
                    )}
                </div>
            </div>

            <div className="card-footer flex gap-2">
                <button onClick={() => onView(trip._id)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    View
                </button>
                <button onClick={() => onEdit(trip._id)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    Edit
                </button>
                <button onClick={() => onDelete(trip._id)} className="btn btn-danger btn-sm">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TripCard;
