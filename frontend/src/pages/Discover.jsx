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

                            <div className="grid grid-3">
                                {filteredCities.map((city, index) => (
                                    <div
                                        key={index}
                                        className="card card-elevated"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {/* City Image/Banner */}
                                        <div style={{
                                            height: '150px',
                                            background: `linear-gradient(135deg, var(--sky-gradient-start), var(--sky-gradient-end))`,
                                            borderRadius: 'var(--radius-lg)',
                                            marginBottom: 'var(--spacing-lg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '4rem'
                                        }}>
                                            {city.name === 'Paris' ? '🗼' :
                                                city.name === 'Tokyo' ? '🗾' :
                                                    city.name === 'New York' ? '🗽' :
                                                        city.name === 'Bali' ? '🏝️' :
                                                            city.name === 'Barcelona' ? '🏖️' :
                                                                city.name === 'Dubai' ? '🏙️' :
                                                                    city.name === 'London' ? '🏰' :
                                                                        city.name === 'Bangkok' ? '🛕' :
                                                                            city.name === 'Rome' ? '🏛️' :
                                                                                city.name === 'Istanbul' ? '🕌' : '🌆'}
                                        </div>

                                        {/* City Info */}
                                        <h3 style={{ marginBottom: '0.25rem' }}>{city.name}</h3>
                                        <p className="text-secondary" style={{ marginBottom: 'var(--spacing-md)' }}>
                                            {city.country} • {city.region}
                                        </p>

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
