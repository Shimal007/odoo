import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ActivitySearch = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const cityParam = searchParams.get('city') || '';

    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState(cityParam);
    const [selectedType, setSelectedType] = useState('');
    const [costRange, setCostRange] = useState('all');
    const [loading, setLoading] = useState(true);

    const activityTypes = [
        'All Types',
        'sightseeing',
        'culture',
        'food',
        'adventure',
        'relaxation',
        'shopping',
        'nightlife'
    ];

    // Expanded mock activities database
    const mockActivities = [
        // Paris
        { name: 'Eiffel Tower Visit', city: 'Paris', country: 'France', type: 'sightseeing', duration: 3, cost: 25, description: 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris', image: '🗼', rating: 4.8, popularity: 95 },
        { name: 'Louvre Museum', city: 'Paris', country: 'France', type: 'culture', duration: 4, cost: 17, description: 'Explore the world\'s largest art museum and historic monument', image: '🖼️', rating: 4.9, popularity: 98 },
        { name: 'Seine River Cruise', city: 'Paris', country: 'France', type: 'experience', duration: 2, cost: 35, description: 'Romantic cruise along the Seine with dinner option', image: '🚢', rating: 4.7, popularity: 85 },
        { name: 'Montmartre Walking Tour', city: 'Paris', country: 'France', type: 'culture', duration: 3, cost: 15, description: 'Discover the artistic heart of Paris', image: '🎨', rating: 4.6, popularity: 80 },
        { name: 'French Cooking Class', city: 'Paris', country: 'France', type: 'food', duration: 4, cost: 85, description: 'Learn to cook authentic French cuisine', image: '👨‍🍳', rating: 4.9, popularity: 70 },

        // Tokyo
        { name: 'Tokyo Skytree', city: 'Tokyo', country: 'Japan', type: 'sightseeing', duration: 2, cost: 20, description: 'Visit Japan\'s tallest structure with observation decks', image: '🗼', rating: 4.7, popularity: 92 },
        { name: 'Senso-ji Temple', city: 'Tokyo', country: 'Japan', type: 'culture', duration: 2, cost: 0, description: 'Ancient Buddhist temple in Asakusa', image: '⛩️', rating: 4.8, popularity: 90 },
        { name: 'Tsukiji Fish Market Tour', city: 'Tokyo', country: 'Japan', type: 'food', duration: 3, cost: 50, description: 'Early morning sushi breakfast and market tour', image: '🍣', rating: 4.9, popularity: 85 },
        { name: 'Shibuya Crossing Experience', city: 'Tokyo', country: 'Japan', type: 'sightseeing', duration: 1, cost: 0, description: 'Visit the world\'s busiest pedestrian crossing', image: '🚸', rating: 4.5, popularity: 88 },
        { name: 'Mt. Fuji Day Trip', city: 'Tokyo', country: 'Japan', type: 'adventure', duration: 10, cost: 120, description: 'Full day excursion to iconic Mt. Fuji', image: '🗻', rating: 4.9, popularity: 95 },

        // New York
        { name: 'Statue of Liberty Tour', city: 'New York', country: 'USA', type: 'sightseeing', duration: 4, cost: 45, description: 'Ferry ride and tour of Lady Liberty', image: '🗽', rating: 4.7, popularity: 96 },
        { name: 'Central Park Bike Tour', city: 'New York', country: 'USA', type: 'adventure', duration: 3, cost: 35, description: 'Explore 843 acres of urban park', image: '🚴', rating: 4.6, popularity: 82 },
        { name: 'Broadway Show', city: 'New York', country: 'USA', type: 'culture', duration: 3, cost: 150, description: 'Watch a world-class theater performance', image: '🎭', rating: 4.9, popularity: 90 },
        { name: 'Empire State Building', city: 'New York', country: 'USA', type: 'sightseeing', duration: 2, cost: 40, description: 'Iconic skyscraper with observation deck', image: '🏙️', rating: 4.7, popularity: 93 },
        { name: 'NYC Food Tour', city: 'New York', country: 'USA', type: 'food', duration: 4, cost: 75, description: 'Taste authentic NYC pizza, bagels, and more', image: '🍕', rating: 4.8, popularity: 87 },

        // Bali
        { name: 'Ubud Rice Terraces', city: 'Bali', country: 'Indonesia', type: 'sightseeing', duration: 3, cost: 10, description: 'UNESCO World Heritage rice paddies', image: '🌾', rating: 4.8, popularity: 92 },
        { name: 'Beach Surfing Lesson', city: 'Bali', country: 'Indonesia', type: 'adventure', duration: 2, cost: 30, description: 'Learn to surf on beautiful Bali beaches', image: '🏄', rating: 4.7, popularity: 85 },
        { name: 'Balinese Cooking Class', city: 'Bali', country: 'Indonesia', type: 'food', duration: 4, cost: 35, description: 'Traditional Indonesian cooking workshop', image: '🍛', rating: 4.9, popularity: 78 },
        { name: 'Temple Sunset Tour', city: 'Bali', country: 'Indonesia', type: 'culture', duration: 4, cost: 25, description: 'Visit ancient temples at golden hour', image: '🛕', rating: 4.9, popularity: 88 },
        { name: 'Spa & Wellness Day', city: 'Bali', country: 'Indonesia', type: 'relaxation', duration: 5, cost: 60, description: 'Traditional Balinese massage and spa', image: '💆', rating: 4.8, popularity: 80 },

        // London
        { name: 'Tower of London', city: 'London', country: 'UK', type: 'culture', duration: 3, cost: 30, description: 'Historic castle and Crown Jewels', image: '🏰', rating: 4.7, popularity: 91 },
        { name: 'London Eye', city: 'London', country: 'UK', type: 'sightseeing', duration: 1, cost: 35, description: 'Giant Ferris wheel on River Thames', image: '🎡', rating: 4.6, popularity: 89 },
        { name: 'British Museum', city: 'London', country: 'UK', type: 'culture', duration: 4, cost: 0, description: 'World-famous museum with free entry', image: '🏛️', rating: 4.9, popularity: 94 },
        { name: 'Afternoon Tea Experience', city: 'London', country: 'UK', type: 'food', duration: 2, cost: 50, description: 'Traditional British afternoon tea', image: '☕', rating: 4.8, popularity: 75 },
        { name: 'West End Theatre Show', city: 'London', country: 'UK', type: 'nightlife', duration: 3, cost: 80, description: 'London\'s famous theatre district', image: '🎭', rating: 4.8, popularity: 86 }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setActivities(mockActivities);
            setFilteredActivities(mockActivities);
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        filterActivities();
    }, [searchQuery, selectedCity, selectedType, costRange, activities]);

    const filterActivities = () => {
        let filtered = activities;

        if (searchQuery) {
            filtered = filtered.filter(activity =>
                activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCity) {
            filtered = filtered.filter(activity => activity.city.toLowerCase() === selectedCity.toLowerCase());
        }

        if (selectedType && selectedType !== 'All Types') {
            filtered = filtered.filter(activity => activity.type === selectedType);
        }

        if (costRange !== 'all') {
            if (costRange === 'free') {
                filtered = filtered.filter(activity => activity.cost === 0);
            } else if (costRange === 'budget') {
                filtered = filtered.filter(activity => activity.cost > 0 && activity.cost <= 30);
            } else if (costRange === 'moderate') {
                filtered = filtered.filter(activity => activity.cost > 30 && activity.cost <= 70);
            } else if (costRange === 'premium') {
                filtered = filtered.filter(activity => activity.cost > 70);
            }
        }

        setFilteredActivities(filtered);
    };

    const getCostBadge = (cost) => {
        if (cost === 0) return { text: 'Free', class: 'badge-success' };
        if (cost <= 30) return { text: 'Budget', class: 'badge-success' };
        if (cost <= 70) return { text: 'Moderate', class: 'badge-warning' };
        return { text: 'Premium', class: 'badge-danger' };
    };

    const getStars = (rating) => {
        return '⭐'.repeat(Math.round(rating));
    };

    const uniqueCities = [...new Set(activities.map(a => a.city))].sort();

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                <div className="container container-wide">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1>Discover Activities 🎯</h1>
                        <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
                            Find amazing experiences for your trip
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="card" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--spacing-lg)' }}>
                            <div>
                                <label className="form-label">Search Activities</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search by name or description... 🔍"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="form-label">City</label>
                                <select
                                    className="form-select"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                >
                                    <option value="">All Cities</option>
                                    {uniqueCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {activityTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Price Range</label>
                                <select
                                    className="form-select"
                                    value={costRange}
                                    onChange={(e) => setCostRange(e.target.value)}
                                >
                                    <option value="all">All Prices</option>
                                    <option value="free">Free</option>
                                    <option value="budget">Budget ($1-$30)</option>
                                    <option value="moderate">Moderate ($31-$70)</option>
                                    <option value="premium">Premium ($70+)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className="text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                            <div className="animate-pulse">Loading activities...</div>
                        </div>
                    ) : filteredActivities.length === 0 ? (
                        <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)', opacity: 0.3 }}>
                                🔍
                            </div>
                            <h3>No activities found</h3>
                            <p className="text-secondary">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <p className="text-secondary">
                                    Found <strong>{filteredActivities.length}</strong> activities
                                </p>
                            </div>

                            <div className="grid grid-3">
                                {filteredActivities.map((activity, index) => (
                                    <div key={index} className="card card-elevated">
                                        {/* Activity Image */}
                                        <div style={{
                                            height: '160px',
                                            background: `linear-gradient(135deg, var(--sky-gradient-start), var(--sky-gradient-end))`,
                                            borderRadius: 'var(--radius-lg)',
                                            marginBottom: 'var(--spacing-lg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '4rem'
                                        }}>
                                            {activity.image}
                                        </div>

                                        {/* Activity Info */}
                                        <h3 style={{ marginBottom: '0.25rem' }}>{activity.name}</h3>
                                        <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                                            📍 {activity.city}, {activity.country}
                                        </p>

                                        <p className="text-secondary" style={{
                                            fontSize: '0.875rem',
                                            marginBottom: 'var(--spacing-md)',
                                            minHeight: '40px'
                                        }}>
                                            {activity.description}
                                        </p>

                                        {/* Details */}
                                        <div className="flex gap-2" style={{ marginBottom: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                            <span className={`badge ${getCostBadge(activity.cost).class}`}>
                                                {activity.cost === 0 ? 'Free' : `$${activity.cost}`}
                                            </span>
                                            <span className="badge badge-primary">
                                                ⏱️ {activity.duration}h
                                            </span>
                                            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                                                {activity.type}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                            <span style={{ fontSize: '0.875rem' }}>{getStars(activity.rating)}</span>
                                            <span className="text-secondary" style={{ fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                                                {activity.rating} · {activity.popularity}% popular
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <button
                                            className="btn btn-outline btn-sm"
                                            style={{ width: '100%' }}
                                            onClick={() => {
                                                alert(`Adding "${activity.name}" to your trip! (This will integrate with trip builder in production)`);
                                            }}
                                        >
                                            Add to Trip
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivitySearch;
