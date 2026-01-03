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

    // Expanded mock activities database with real images
    const mockActivities = [
        // Paris
        { name: 'Eiffel Tower Visit', city: 'Paris', country: 'France', type: 'sightseeing', duration: 3, cost: 25, description: 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris', image: 'https://images.unsplash.com/photo-1511739001486-6bfe100772fc?auto=format&fit=crop&q=80&w=800', rating: 4.8, popularity: 95 },
        { name: 'Louvre Museum', city: 'Paris', country: 'France', type: 'culture', duration: 4, cost: 17, description: 'Explore the world\'s largest art museum and historic monument', image: 'https://images.unsplash.com/photo-1597923896141-d4de3119853c?auto=format&fit=crop&q=80&w=800', rating: 4.9, popularity: 98 },
        { name: 'Seine River Cruise', city: 'Paris', country: 'France', type: 'experience', duration: 2, cost: 35, description: 'Romantic cruise along the Seine with dinner option', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800', rating: 4.7, popularity: 85 },
        { name: 'Montmartre Walking Tour', city: 'Paris', country: 'France', type: 'culture', duration: 3, cost: 15, description: 'Discover the artistic heart of Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800', rating: 4.6, popularity: 80 },
        { name: 'French Cooking Class', city: 'Paris', country: 'France', type: 'food', duration: 4, cost: 85, description: 'Learn to cook authentic French cuisine', image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80&w=800', rating: 4.9, popularity: 70 },

        // Tokyo
        { name: 'Tokyo Skytree', city: 'Tokyo', country: 'Japan', type: 'sightseeing', duration: 2, cost: 20, description: 'Visit Japan\'s tallest structure with observation decks', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800', rating: 4.7, popularity: 92 },
        { name: 'Senso-ji Temple', city: 'Tokyo', country: 'Japan', type: 'culture', duration: 2, cost: 0, description: 'Ancient Buddhist temple in Asakusa', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=800', rating: 4.8, popularity: 90 },
        { name: 'Tsukiji Fish Market Tour', city: 'Tokyo', country: 'Japan', type: 'food', duration: 3, cost: 50, description: 'Early morning sushi breakfast and market tour', image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?auto=format&fit=crop&q=80&w=800', rating: 4.9, popularity: 85 },
        { name: 'Shibuya Crossing', city: 'Tokyo', country: 'Japan', type: 'sightseeing', duration: 1, cost: 0, description: 'Visit the world\'s busiest pedestrian crossing', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=800', rating: 4.5, popularity: 88 },
        { name: 'Mt. Fuji Day Trip', city: 'Tokyo', country: 'Japan', type: 'adventure', duration: 10, cost: 120, description: 'Full day excursion to iconic Mt. Fuji', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800', rating: 4.9, popularity: 95 },

        // New York
        { name: 'Statue of Liberty', city: 'New York', country: 'USA', type: 'sightseeing', duration: 4, cost: 45, description: 'Ferry ride and tour of Lady Liberty', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&q=80&w=800', rating: 4.7, popularity: 96 },
        { name: 'Central Park Bike Tour', city: 'New York', country: 'USA', type: 'adventure', duration: 3, cost: 35, description: 'Explore 843 acres of urban park', image: 'https://images.unsplash.com/photo-1523374228107-6e44bd2b524e?auto=format&fit=crop&q=80&w=800', rating: 4.6, popularity: 82 },
        { name: 'Broadway Show', city: 'New York', country: 'USA', type: 'culture', duration: 3, cost: 150, description: 'Watch a world-class theater performance', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800', rating: 4.9, popularity: 90 },

        // Bali
        { name: 'Ubud Rice Terraces', city: 'Bali', country: 'Indonesia', type: 'sightseeing', duration: 3, cost: 10, description: 'UNESCO World Heritage rice paddies', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800', rating: 4.8, popularity: 92 },
        { name: 'Temple Sunset Tour', city: 'Bali', country: 'Indonesia', type: 'culture', duration: 4, cost: 25, description: 'Visit ancient temples at golden hour', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800', rating: 4.9, popularity: 88 }
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
        <div className="page-container">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                {/* Premium Hero Section */}
                <div style={{
                    background: 'var(--charcoal)',
                    color: 'white',
                    padding: '3rem 0',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    borderBottom: '4px solid var(--gold)'
                }}>
                    <div className="container">
                        <h1 style={{
                            color: 'var(--gold)',
                            fontSize: '3rem',
                            marginBottom: '0.5rem',
                            fontFamily: 'var(--font-serif)'
                        }}>
                            Bespoke Activities
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: 'var(--cream)',
                            opacity: 0.9,
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Extraordinary experiences tailored for your unique journey
                        </p>
                    </div>
                </div>

                <div className="container container-wide section" style={{ paddingTop: 0 }}>
                    {/* Compact Filter Card */}
                    <div className="card mb-4" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                            <div>
                                <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--warm-gray)' }}>Find Experience</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search by name... 🔍"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div>
                                <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--warm-gray)' }}>Destination</label>
                                <select
                                    className="form-select"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}
                                >
                                    <option value="">All Cities</option>
                                    {uniqueCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--warm-gray)' }}>Activity Type</label>
                                <select
                                    className="form-select"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}
                                >
                                    {activityTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--warm-gray)' }}>Budget</label>
                                <select
                                    className="form-select"
                                    value={costRange}
                                    onChange={(e) => setCostRange(e.target.value)}
                                    style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}
                                >
                                    <option value="all">All Prices</option>
                                    <option value="free">Complimentary</option>
                                    <option value="budget">Value ($1-$30)</option>
                                    <option value="moderate">Premium ($31-$70)</option>
                                    <option value="premium">Elite ($70+)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-3">
                        <p style={{ fontSize: '0.875rem', color: 'var(--warm-gray)', fontWeight: 600 }}>
                            {filteredActivities.length} Exceptional Experiences Discovered
                        </p>
                    </div>

                    {/* Quality Grid */}
                    <div className="grid grid-3 gap-4">
                        {filteredActivities.map((activity, index) => (
                            <div key={index} className="card p-0 overflow-hidden group hover:shadow-xl transition-all"
                                style={{
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>

                                {/* Activity Image */}
                                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={activity.image}
                                        alt={activity.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        className="group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '0.75rem',
                                        right: '0.75rem',
                                        background: 'rgba(255,255,255,0.9)',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: 'var(--gold)'
                                    }}>
                                        {activity.popularity}% POPULAR
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '1rem',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                        color: 'white'
                                    }}>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>{activity.type}</div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 style={{ fontSize: '1.2rem', color: 'var(--charcoal)' }}>{activity.name}</h3>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gold)' }}>
                                            {activity.cost === 0 ? 'FREE' : `$${activity.cost}`}
                                        </span>
                                    </div>
                                    <p className="text-warm-gray mb-3" style={{ fontSize: '0.75rem' }}>
                                        📍 {activity.city}, {activity.country} • {activity.duration}h duration
                                    </p>

                                    <p className="text-warm-gray mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.5', flex: 1 }}>
                                        {activity.description}
                                    </p>

                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-cream-dark">
                                        <div>
                                            <span style={{ fontSize: '0.8rem' }}>{getStars(activity.rating)}</span>
                                            <span style={{ fontSize: '0.75rem', marginLeft: '0.4rem', color: 'var(--warm-gray)' }}>{activity.rating}</span>
                                        </div>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => alert('Bespoke inquiry started for ' + activity.name)}
                                            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                                        >
                                            Add to Journey
                                        </button>
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

export default ActivitySearch;
