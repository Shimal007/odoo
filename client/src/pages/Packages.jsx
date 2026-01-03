import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Packages = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');

    const packages = [
        {
            id: 1,
            name: 'Magical Bali Escape',
            destination: 'Bali, Indonesia',
            duration: '7 Days / 6 Nights',
            price: 1299,
            originalPrice: 1799,
            discount: 28,
            rating: 4.9,
            reviews: 342,
            image: '🏝️',
            gradient: 'from-green-500 to-teal-500',
            type: 'beach',
            includes: ['✈️ Flights', '🏨 4-Star Hotels', '🍽️ Breakfast', '🚐 Transfers', '🎯 3 Activities'],
            highlights: ['Ubud Rice Terraces', 'Beach Sunset', 'Temple Tour', 'Spa Experience']
        },
        {
            id: 2,
            name: 'European Grand Tour',
            destination: 'Paris, Rome, Barcelona',
            duration: '14 Days / 13 Nights',
            price: 3499,
            originalPrice: 4299,
            discount: 19,
            rating: 4.8,
            reviews: 567,
            image: '🏰',
            gradient: 'from-purple-500 to-pink-500',
            type: 'culture',
            includes: ['✈️ Flights', '🏨 5-Star Hotels', '🍽️ Half Board', '🚄 Train Tickets', '👨‍🏫 Guided Tours'],
            highlights: ['Eiffel Tower', 'Colosseum', 'Sagrada Familia', 'Wine Tasting']
        },
        {
            id: 3,
            name: 'Himalayan Adventure',
            destination: 'Nepal & Bhutan',
            duration: '10 Days / 9 Nights',
            price: 2199,
            originalPrice: 2899,
            discount: 24,
            rating: 4.9,
            reviews: 234,
            image: '🏔️',
            gradient: 'from-blue-500 to-indigo-500',
            type: 'adventure',
            includes: ['✈️ Flights', '🏕️ Lodges & Hotels', '🍽️ Full Board', '🥾 Trekking Gear', '🧗 Adventure Activities'],
            highlights: ['Everest Base Camp', 'Tiger\'s Nest', 'Mountain Views', 'Local Culture']
        },
        {
            id: 4,
            name: 'Dubai Luxury Experience',
            destination: 'Dubai, UAE',
            duration: '5 Days / 4 Nights',
            price: 1899,
            originalPrice: 2499,
            discount: 24,
            rating: 4.7,
            reviews: 445,
            image: '🏙️',
            gradient: 'from-yellow-500 to-orange-500',
            type: 'luxury',
            includes: ['✈️ First Class Flights', '🏨 7-Star Hotel', '🍽️ Gourmet Dining', '🚗 Luxury Transfers', '🎪 VIP Access'],
            highlights: ['Burj Khalifa', 'Desert Safari', 'Luxury Shopping', 'Yacht Tour']
        },
        {
            id: 5,
            name: 'Maldives Honeymoon',
            destination: 'Maldives',
            duration: '6 Days / 5 Nights',
            price: 2799,
            originalPrice: 3599,
            discount: 22,
            rating: 5.0,
            reviews: 892,
            image: '🏖️',
            gradient: 'from-cyan-500 to-blue-500',
            type: 'beach',
            includes: ['✈️ Seaplane Transfers', '🏝️ Overwater Villa', '🍽️ All Inclusive', '🤿 Water Sports', '💑 Spa for Two'],
            highlights: ['Private Beach', 'Snorkeling', 'Candlelight Dinner', 'Sunset Cruise']
        },
        {
            id: 6,
            name: 'African Safari Adventure',
            destination: 'Tanzania & Kenya',
            duration: '12 Days / 11 Nights',
            price: 4299,
            originalPrice: 5499,
            discount: 22,
            rating: 4.9,
            reviews: 178,
            image: '🦁',
            gradient: 'from-orange-500 to-red-500',
            type: 'adventure',
            includes: ['✈️ Flights', '🏕️ Safari Lodges', '🍽️ Full Board', '🚙 4x4 Game Drives', '📸 Photo Tours'],
            highlights: ['Serengeti', 'Big Five', 'Maasai Village', 'Hot Air Balloon']
        },
        {
            id: 7,
            name: 'Japanese Cultural Journey',
            destination: 'Tokyo, Kyoto, Osaka',
            duration: '9 Days / 8 Nights',
            price: 2599,
            originalPrice: 3199,
            discount: 19,
            rating: 4.8,
            reviews: 523,
            image: '⛩️',
            gradient: 'from-red-500 to-pink-500',
            type: 'culture',
            includes: ['✈️ Flights', '🏨 Ryokan & Hotels', '🍽️ Japanese Breakfast', '🚄 JR Pass', '🎎 Cultural Experiences'],
            highlights: ['Mount Fuji', 'Tea Ceremony', 'Ancient Temples', 'Sushi Making']
        },
        {
            id: 8,
            name: 'Caribbean Island Hopping',
            destination: 'Bahamas, Jamaica, Aruba',
            duration: '8 Days / 7 Nights',
            price: 1999,
            originalPrice: 2599,
            discount: 23,
            rating: 4.7,
            reviews: 401,
            image: '🌴',
            gradient: 'from-teal-500 to-green-500',
            type: 'beach',
            includes: ['✈️ Flights', '🏖️ Beach Resorts', '🍽️ All Meals', '⛵ Island Tours', '🎵 Beach Parties'],
            highlights: ['Crystal Waters', 'Water Sports', 'Beach BBQ', 'Reggae Nights']
        }
    ];

    const filters = [
        { value: 'all', label: 'All Packages' },
        { value: 'beach', label: '🏖️ Beach' },
        { value: 'adventure', label: '🏔️ Adventure' },
        { value: 'culture', label: '🎎 Culture' },
        { value: 'luxury', label: '💎 Luxury' }
    ];

    const priceFilters = [
        { value: 'all', label: 'All Prices' },
        { value: 'budget', label: 'Under $2000' },
        { value: 'mid', label: '$2000 - $3500' },
        { value: 'luxury', label: 'Above $3500' }
    ];

    const getFilteredPackages = () => {
        let filtered = packages;

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(pkg => pkg.type === selectedFilter);
        }

        if (priceFilter === 'budget') {
            filtered = filtered.filter(pkg => pkg.price < 2000);
        } else if (priceFilter === 'mid') {
            filtered = filtered.filter(pkg => pkg.price >= 2000 && pkg.price <= 3500);
        } else if (priceFilter === 'luxury') {
            filtered = filtered.filter(pkg => pkg.price > 3500);
        }

        return filtered;
    };

    const filteredPackages = getFilteredPackages();

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                {/* Hero */}
                <div style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                    color: 'white',
                    padding: 'var(--spacing-3xl) 0',
                    textAlign: 'center',
                    marginBottom: 'var(--spacing-3xl)'
                }}>
                    <div className="container">
                        <h1 style={{
                            color: 'white',
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            Holiday Packages 🎁
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            opacity: 0.95,
                            maxWidth: '700px',
                            margin: '0 auto var(--spacing-lg)'
                        }}>
                            Curated vacation packages with everything included
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-lg)',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginTop: 'var(--spacing-xl)'
                        }}>
                            {['✈️ Flights', '🏨 Hotels', '🍽️ Meals', '🎯 Activities', '🚐 Transfers'].map((item, i) => (
                                <div key={i} style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-full)',
                                    backdropFilter: 'blur(10px)',
                                    fontSize: '0.9375rem',
                                    fontWeight: 600
                                }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container container-wide">
                    {/* Filters */}
                    <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto',
                                gap: 'var(--spacing-xl)',
                                alignItems: 'center'
                            }}>
                                <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                                    Filter by:
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                    {filters.map(filter => (
                                        <button
                                            key={filter.value}
                                            onClick={() => setSelectedFilter(filter.value)}
                                            className={`btn btn-sm ${selectedFilter === filter.value ? 'btn-primary' : 'btn-ghost'}`}
                                            style={{ borderRadius: 'var(--radius-full)' }}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>

                                <select
                                    className="form-select"
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value)}
                                    style={{ width: '200px' }}
                                >
                                    {priceFilters.map(filter => (
                                        <option key={filter.value} value={filter.value}>
                                            {filter.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <h3>
                            {filteredPackages.length} {filteredPackages.length === 1 ? 'Package' : 'Packages'} Available
                        </h3>
                    </div>

                    {/* Packages Grid */}
                    <div className="grid grid-2">
                        {filteredPackages.map((pkg, index) => (
                            <div
                                key={pkg.id}
                                className="card card-elevated animate-fade-in-up"
                                style={{
                                    padding: 0,
                                    animationDelay: `${index * 100}ms`,
                                    position: 'relative'
                                }}
                            >
                                {/* Discount Badge */}
                                {pkg.discount > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 800,
                                        fontSize: '0.875rem',
                                        zIndex: 10,
                                        boxShadow: 'var(--shadow-lg)'
                                    }}>
                                        {pkg.discount}% OFF
                                    </div>
                                )}

                                {/* Image */}
                                <div style={{
                                    height: '250px',
                                    background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '6rem',
                                    position: 'relative'
                                }}>
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))' }} />
                                    <span style={{ position: 'relative', zIndex: 1 }}>{pkg.image}</span>
                                </div>

                                <div style={{ padding: 'var(--spacing-xl)' }}>
                                    {/* Header */}
                                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                        <h3 style={{
                                            fontSize: '1.5rem',
                                            marginBottom: '0.5rem',
                                            fontWeight: 700
                                        }}>
                                            {pkg.name}
                                        </h3>
                                        <p style={{
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <span>📍</span> {pkg.destination}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                                            ⏱️ {pkg.duration}
                                        </p>
                                    </div>

                                    {/* Rating */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: 'var(--spacing-lg)'
                                    }}>
                                        <span style={{ color: '#fbbf24', fontSize: '1.125rem' }}>
                                            {'⭐'.repeat(Math.floor(pkg.rating))}
                                        </span>
                                        <span style={{ fontWeight: 700 }}>{pkg.rating}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            ({pkg.reviews} reviews)
                                        </span>
                                    </div>

                                    {/* Includes */}
                                    <div style={{
                                        background: 'var(--bg-secondary)',
                                        padding: 'var(--spacing-md)',
                                        borderRadius: 'var(--radius-lg)',
                                        marginBottom: 'var(--spacing-lg)'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                            Package Includes:
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {pkg.includes.map((item, i) => (
                                                <span key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                            Highlights:
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {pkg.highlights.map((highlight, i) => (
                                                <span key={i} className="badge badge-primary">
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price & CTA */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: 'var(--spacing-lg)',
                                        borderTop: '2px solid var(--border-light)'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: 'var(--text-muted)',
                                                textDecoration: 'line-through'
                                            }}>
                                                ${pkg.originalPrice}
                                            </div>
                                            <div style={{
                                                fontSize: '2rem',
                                                fontWeight: 800,
                                                color: 'var(--primary-gradient-start)'
                                            }}>
                                                ${pkg.price}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                per person
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-lg">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredPackages.length === 0 && (
                        <div className="card text-center" style={{ padding: 'var(--spacing-3xl)' }}>
                            <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-md)', opacity: 0.3 }}>
                                🔍
                            </div>
                            <h3>No packages found</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Try adjusting your filters
                            </p>
                        </div>
                    )}

                    {/* Why Book With Us */}
                    <div style={{
                        marginTop: 'var(--spacing-3xl)',
                        padding: 'var(--spacing-3xl)',
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(236, 72, 153, 0.05))',
                        borderRadius: 'var(--radius-2xl)'
                    }}>
                        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                            Why Book With Us? 🌟
                        </h2>
                        <div className="grid grid-4">
                            {[
                                { icon: '💰', title: 'Best Price Guarantee', desc: 'Lowest prices or we refund the difference' },
                                { icon: '✅', title: 'Verified Reviews', desc: 'Real reviews from real travelers' },
                                { icon: '🛡️', title: 'Secure Booking', desc: 'Your payment is safe and secure' },
                                { icon: '🎧', title: '24/7 Support', desc: 'We\'re here to help anytime' }
                            ].map((item, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
                                        {item.icon}
                                    </div>
                                    <h4 style={{ marginBottom: 'var(--spacing-sm)', fontWeight: 700 }}>
                                        {item.title}
                                    </h4>
                                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Packages;
