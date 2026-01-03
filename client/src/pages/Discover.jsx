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

    const getCityImageUrl = (city) => {
        // If API provided an image URL, use it
        if (city.imageUrl) {
            return city.imageUrl;
        }

        // Fallback: Map of popular cities to their Unsplash image URLs
        const cityImageMap = {
            'Paris': 'https://images.unsplash.com/photo-1502602898657-c74506e79316?auto=format&fit=crop&w=400&q=80',
            'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80',
            'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e3?auto=format&fit=crop&w=400&q=80',
            'London': 'https://images.unsplash.com/photo-1513635269190-d10b2e92f887?auto=format&fit=crop&w=400&q=80',
            'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80',
            'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=400&q=80',
            'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80',
            'Bangkok': 'https://images.unsplash.com/photo-1508009603792-200584711015?auto=format&fit=crop&w=400&q=80',
            'Bali': 'https://images.unsplash.com/photo-1537996194471-e0f8ca45e490?auto=format&fit=crop&w=400&q=80',
            'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80',
            'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=400&q=80',
            'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80',
            'Istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=400&q=80',
            'Prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=400&q=80',
            'Venice': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80',
            'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80',
            'Maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80',
            'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=400&q=80',
            'Rio de Janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=400&q=80',
            'Hong Kong': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=400&q=80'
        };

        // Check if we have a specific image for this city
        if (cityImageMap[city.name]) {
            return cityImageMap[city.name];
        }

        // Final fallback: Use Unsplash's random city image
        return `https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&q=80`;
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
                        <div className="card text-center" style={{ padding: 'var(--spacing-3xl)' }}>
                            <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-lg)' }} className="animate-pulse">
                                🌍
                            </div>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--charcoal)' }}>
                                Discovering Amazing Destinations...
                            </h3>
                            <p style={{ color: 'var(--warm-gray)', fontSize: '1rem' }}>
                                Our AI is exploring the world to find the perfect places for you
                            </p>
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

                            <div className="grid grid-3">
                                {filteredCities.map((city, index) => (
                                    <div
                                        key={index}
                                        className="card card-elevated"
                                        style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
                                    >
                                        {/* City Image/Banner */}
                                        <div style={{
                                            height: '200px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${getCityImageUrl(city)})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}>
                                            {/* City Name Overlay */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                padding: '1rem',
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                                color: 'white'
                                            }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                                    {city.name}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                                    {city.country}
                                                </div>
                                            </div>

                                            {/* Icon Badge */}
                                            {city.icon && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '0.75rem',
                                                    right: '0.75rem',
                                                    fontSize: '2rem',
                                                    background: 'rgba(255, 255, 255, 0.95)',
                                                    borderRadius: '10px',
                                                    padding: '0.4rem',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                    backdropFilter: 'blur(10px)'
                                                }}>
                                                    {city.icon}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Content */}
                                        <div style={{ padding: 'var(--spacing-lg)' }}>
                                            {/* City Info */}
                                            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                                                <p className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {city.region}
                                                </p>
                                            </div>

                                            {/* Description */}
                                            {city.description && (
                                                <p style={{
                                                    fontSize: '0.85rem',
                                                    color: 'var(--warm-gray)',
                                                    lineHeight: 1.5,
                                                    marginBottom: 'var(--spacing-md)',
                                                    minHeight: '3rem'
                                                }}>
                                                    {city.description}
                                                </p>
                                            )}

                                            {/* Badges */}
                                            <div className="flex gap-2" style={{ marginBottom: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                                <span className={`badge ${getCostBadge(city.cost_index).class}`}>
                                                    💵 {getCostBadge(city.cost_index).text}
                                                </span>
                                                <span className="badge badge-primary" title={`Popularity: ${city.popularity}%`}>
                                                    {getPopularityStars(city.popularity)}
                                                </span>
                                            </div>

                                            {/* Action */}
                                            <button
                                                className="btn btn-outline btn-sm"
                                                style={{ width: '100%' }}
                                                onClick={() => {
                                                    // In real app, this would add to current trip or create new one
                                                    alert(`Adding ${city.name} to your trip! (Feature coming soon)`);
                                                }}
                                            >
                                                Add to Trip
                                            </button>
                                        </div>
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

export default Discover;
