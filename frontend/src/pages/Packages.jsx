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
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
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
            image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800',
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
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
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
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
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
            image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800',
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
            image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
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
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
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
            image: 'https://images.unsplash.com/photo-1548574505-12737441edb2?auto=format&fit=crop&q=80&w=800',
            type: 'beach',
            includes: ['✈️ Flights', '🏖️ Beach Resorts', '🍽️ All Meals', '⛵ Island Tours', '🎵 Beach Parties'],
            highlights: ['Crystal Waters', 'Water Sports', 'Beach BBQ', 'Reggae Nights']
        }
    ];

    const filters = [
        { value: 'all', label: 'All Packages' },
        { value: 'beach', label: 'Beach' },
        { value: 'adventure', label: 'Adventure' },
        { value: 'culture', label: 'Culture' },
        { value: 'luxury', label: 'Luxury' }
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
                            Bespoke Holiday Packages
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: 'var(--cream)',
                            opacity: 0.9,
                            maxWidth: '700px',
                            margin: '0 auto 2rem'
                        }}>
                            Curated luxury travel experiences with uncompromised comfort
                        </p>
                        <div className="flex gap-2 justify-center flex-wrap">
                            {['Flights', 'Hotels', 'Meals', 'Activities', 'Transfers'].map((item, i) => (
                                <div key={i} style={{
                                    background: 'rgba(184, 134, 11, 0.2)',
                                    color: 'var(--gold-light)',
                                    padding: '0.4rem 1rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--gold)',
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em'
                                }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container section" style={{ paddingTop: 0 }}>
                    {/* Compact Filters */}
                    <div className="card mb-4" style={{ padding: '1.25rem' }}>
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-sm uppercase tracking-wider text-warm-gray">Filter:</span>
                                <div className="flex gap-2">
                                    {filters.map(filter => (
                                        <button
                                            key={filter.value}
                                            onClick={() => setSelectedFilter(filter.value)}
                                            className={`btn btn-sm ${selectedFilter === filter.value ? 'btn-primary' : 'btn-ghost'}`}
                                            style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <select
                                className="form-select"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                style={{ width: '180px', fontSize: '0.875rem' }}
                            >
                                {priceFilters.map(filter => (
                                    <option key={filter.value} value={filter.value}>
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h3 className="font-serif" style={{ fontSize: '1.5rem' }}>
                            {filteredPackages.length} Exclusive Packages Available
                        </h3>
                    </div>

                    {/* Quality Grid */}
                    <div className="grid grid-2 gap-4">
                        {filteredPackages.map((pkg, index) => (
                            <div
                                key={pkg.id}
                                className="card p-0 overflow-hidden animate-fade-in-up"
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {/* Image Container */}
                                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={pkg.image}
                                        alt={pkg.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '1rem',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                        color: 'white'
                                    }}>
                                        <div className="flex justify-between items-end">
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                                {pkg.destination}
                                            </span>
                                            <span style={{ fontSize: '0.75rem' }}>⭐ {pkg.rating}</span>
                                        </div>
                                    </div>
                                    {pkg.discount > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            left: '1rem',
                                            background: 'var(--danger)',
                                            color: 'white',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontWeight: 700,
                                            fontSize: '0.75rem'
                                        }}>
                                            {pkg.discount}% OFF
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--charcoal)' }}>{pkg.name}</h3>
                                    <p className="text-warm-gray mb-3" style={{ fontSize: '0.875rem' }}>⏱️ {pkg.duration}</p>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                                        {pkg.highlights.map((h, i) => (
                                            <span key={i} style={{
                                                fontSize: '0.7rem',
                                                background: 'var(--cream-light)',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--warm-gray)'
                                            }}>
                                                {h}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid var(--cream-dark)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', textDecoration: 'line-through' }}>${pkg.originalPrice}</span>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)' }}>${pkg.price}</div>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--warm-gray)', textTransform: 'uppercase' }}>per person</span>
                                        </div>
                                        <button className="btn btn-primary btn-sm">Bespoke Inquiry</button>
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

                    {/* Why Book With Us - Tighter */}
                    <div className="card mt-5" style={{ background: 'var(--cream-light)', border: '1px solid var(--gold-light)', padding: '2rem' }}>
                        <h2 className="text-center font-serif mb-4" style={{ fontSize: '1.75rem' }}>The GlobeTrotter Difference</h2>
                        <div className="grid grid-4 gap-4">
                            {[
                                { icon: '💎', title: 'Curated Luxury', desc: 'Hand-picked premium stays' },
                                { icon: '🛡️', title: 'Full Protection', desc: 'Secure booking & insurance' },
                                { icon: '✨', title: 'Personalized', desc: 'Tailored to your preferences' },
                                { icon: '🎧', title: '24/7 Concierge', desc: 'Dedicated travel support' }
                            ].map((item, i) => (
                                <div key={i} className="text-center">
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                                    <h4 className="font-serif mb-1" style={{ fontSize: '1.125rem' }}>{item.title}</h4>
                                    <p className="text-warm-gray" style={{ fontSize: '0.8rem' }}>{item.desc}</p>
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
