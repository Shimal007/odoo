import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Discover = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [loading, setLoading] = useState(true);

    const regions = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East'];

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        filterCities();
    }, [searchQuery, selectedRegion, cities]);

    const fetchCities = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/cities/search');
            const data = await response.json();

            if (response.ok) {
                setCities(data);
                setFilteredCities(data);
            }
        } catch (err) {
            console.error('Failed to fetch cities:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterCities = () => {
        let filtered = cities;

        if (searchQuery) {
            filtered = filtered.filter(city =>
                city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                city.country.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedRegion && selectedRegion !== 'All') {
            filtered = filtered.filter(city => city.region === selectedRegion);
        }

        setFilteredCities(filtered);
    };

    const getCostBadge = (costIndex) => {
        if (costIndex <= 3) return { text: 'Budget', class: 'badge-success' };
        if (costIndex <= 6) return { text: 'Moderate', class: 'badge-warning' };
        return { text: 'Expensive', class: 'badge-danger' };
    };

    const getPopularityStars = (popularity) => {
        const stars = Math.round(popularity / 20);
        return '⭐'.repeat(stars);
    };

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                <div className="container container-wide">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1>Discover Destinations 🌍</h1>
                        <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
                            Explore amazing cities around the world
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="card" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
                            <div>
                                <label className="form-label">Search Cities</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search by city or country... 🔍"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="form-label">Filter by Region</label>
                                <select
                                    className="form-select"
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                >
                                    {regions.map(region => (
                                        <option key={region} value={region === 'All' ? '' : region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Cities Grid */}
                    {loading ? (
                        <div className="text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                            <div className="animate-pulse">Discovering destinations...</div>
                        </div>
                    ) : filteredCities.length === 0 ? (
                        <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)', opacity: 0.3 }}>
                                🔍
                            </div>
                            <h3>No destinations found</h3>
                            <p className="text-secondary">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <p className="text-secondary">
                                    Found <strong>{filteredCities.length}</strong> destinations
                                </p>
                            </div>

                            <div className="grid grid-2 gap-4">
                                {filteredCities.map((city, index) => {
                                    // Get city-specific image from Unsplash
                                    const getCityImage = (cityName) => {
                                        const imageMap = {
                                            'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
                                            'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
                                            'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800',
                                            'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
                                            'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=800',
                                            'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
                                            'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800',
                                            'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=800',
                                            'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800',
                                            'Istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800'
                                        };
                                        return imageMap[cityName] || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800`;
                                    };

                                    const costBadge = getCostBadge(city.cost_index);

                                    return (
                                        <div
                                            key={index}
                                            className="card p-0 overflow-hidden animate-fade-in-up"
                                            style={{
                                                animationDelay: `${index * 0.05}s`,
                                                cursor: 'pointer',
                                                border: '1px solid var(--border-color)'
                                            }}
                                        >
                                            {/* City Image with Overlay */}
                                            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                                <img
                                                    src={getCityImage(city.name)}
                                                    alt={city.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    className="hover:scale-105 transition-transform duration-700"
                                                />

                                                {/* Popularity Badge */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '1rem',
                                                    right: '1rem',
                                                    background: 'var(--gold)',
                                                    color: 'white',
                                                    padding: '0.4rem 0.75rem',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {city.popularity}% POPULAR
                                                </div>

                                                {/* Cost Badge Overlay */}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                                    padding: '1rem',
                                                    color: 'white'
                                                }}>
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.1em'
                                                    }}>
                                                        {costBadge.text}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* City Details */}
                                            <div style={{ padding: '1.5rem' }}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--charcoal)' }}>
                                                            {city.name}
                                                        </h3>
                                                        <p className="text-warm-gray" style={{ fontSize: '0.875rem', marginBottom: '0' }}>
                                                            📍 {city.country}, {city.region}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-warm-gray" style={{
                                                    fontSize: '0.9rem',
                                                    lineHeight: '1.5',
                                                    marginBottom: '1rem',
                                                    marginTop: '0.75rem'
                                                }}>
                                                    Discover the beauty and culture of {city.name}
                                                </p>

                                                {/* Footer with Rating and Button */}
                                                <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid var(--cream-dark)' }}>
                                                    <div className="flex items-center gap-2">
                                                        <span style={{ fontSize: '0.9rem' }}>
                                                            {getPopularityStars(city.popularity)}
                                                        </span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--warm-gray)' }}>
                                                            {(city.popularity / 20).toFixed(1)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            alert(`Adding ${city.name} to your journey!`);
                                                        }}
                                                    >
                                                        Add to Journey
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discover;
