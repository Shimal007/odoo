const TripCard = ({ trip, onView, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTripStatus = () => {
        const now = new Date();
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);

        if (now < start) return { label: 'UPCOMING', color: 'rgba(218, 165, 32, 0.15)' };
        if (now >= start && now <= end) return { label: 'ONGOING', color: 'rgba(40, 167, 69, 0.15)' };
        return { label: 'COMPLETED', color: 'rgba(139, 126, 116, 0.15)' };
    };

    const getDestinationCount = () => trip.destinations?.length || 0;
    const getActivityCount = () => trip.destinations?.reduce((total, dest) => total + (dest.activities?.length || 0), 0) || 0;
    const getDays = () => {
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    };

    // Get a random travel image based on trip name
    const getTripImage = () => {
        const images = [
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
            'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
            'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800'
        ];
        const index = trip.name.length % images.length;
        return trip.cover_image && trip.cover_image.startsWith('http') ? trip.cover_image : images[index];
    };

    const status = getTripStatus();

    return (
        <div style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            background: 'white'
        }}
            className="animate-fade-in-up"
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            {/* Trip Image */}
            <div
                style={{
                    height: '180px',
                    background: `url(${getTripImage()}) center/cover`,
                    position: 'relative'
                }}
                onClick={() => onView(trip._id)}
            >
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.5rem 1rem',
                    background: status.color,
                    backdropFilter: 'blur(10px)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    color: 'var(--charcoal)'
                }}>
                    {status.label}
                </div>
            </div>

            {/* Trip Content */}
            <div style={{ padding: '1.25rem' }}>
                <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--charcoal)'
                }}>
                    {trip.name}
                </h3>
                <p className="text-warm-gray" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
                </p>

                {/* Stats Grid - Clean Numbers */}
                <div className="grid grid-3 gap-2 mb-3">
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.25rem' }}>
                            {getDestinationCount()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Cities
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.25rem' }}>
                            {getActivityCount()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Activities
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.25rem' }}>
                            {getDays()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Days
                        </div>
                    </div>
                </div>

                {/* Budget */}
                {trip.budget?.total > 0 && (
                    <div style={{
                        padding: '0.75rem',
                        background: 'rgba(184, 134, 11, 0.08)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold)' }}>
                            ${trip.budget.total}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', marginLeft: '0.5rem', textTransform: 'uppercase' }}>
                            Budget
                        </span>
                    </div>
                )}

                {/* Action Buttons - Clean */}
                <div className="grid grid-3 gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(trip._id);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.875rem' }}
                    >
                        View
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(trip._id);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.875rem' }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(trip._id);
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '0.875rem', color: 'var(--danger)' }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TripCard;
