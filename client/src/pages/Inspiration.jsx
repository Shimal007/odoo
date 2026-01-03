import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Inspiration = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['All', 'Beach', 'Adventure', 'Culture', 'Food', 'Luxury', 'Budget'];

    const inspirationPosts = [
        {
            id: 1,
            title: '10 Hidden Beaches in Southeast Asia',
            category: 'Beach',
            image: '🏝️',
            gradient: 'from-cyan-500 to-blue-500',
            excerpt: 'Discover pristine beaches away from tourist crowds',
            readTime: '5 min read',
            author: 'Emma Travel',
            views: '12.5K'
        },
        {
            id: 2,
            title: 'Trekking the Himalayas: A Beginner\'s Guide',
            category: 'Adventure',
            image: '🏔️',
            gradient: 'from-purple-500 to-pink-500',
            excerpt: 'Everything you need to know for your first Himalayan trek',
            readTime: '8 min read',
            author: 'Adventure Mike',
            views: '8.2K'
        },
        {
            id: 3,
            title: 'Street Food Tour: Tokyo Edition',
            category: 'Food',
            image: '🍜',
            gradient: 'from-orange-500 to-red-500',
            excerpt: 'Best street food spots locals don\'t want you to know',
            readTime: '6 min read',
            author: 'Foodie Sarah',
            views: '15.3K'
        },
        {
            id: 4,
            title: 'European Cities Under $50/Day',
            category: 'Budget',
            image: '💰',
            gradient: 'from-green-500 to-teal-500',
            excerpt: 'Explore Europe on a shoestring budget',
            readTime: '7 min read',
            author: 'Budget Backpacker',
            views: '20.1K'
        },
        {
            id: 5,
            title: 'Ancient Temples of Cambodia',
            category: 'Culture',
            image: '🛕',
            gradient: 'from-indigo-500 to-purple-500',
            excerpt: 'Beyond Angkor Wat: Lesser-known temple complexes',
            readTime: '9 min read',
            author: 'Culture Explorer',
            views: '6.7K'
        },
        {
            id: 6,
            title: 'Luxury Safari in Tanzania',
            category: 'Luxury',
            image: '🦁',
            gradient: 'from-yellow-500 to-orange-500',
            excerpt: 'Experience the ultimate African safari in style',
            readTime: '10 min read',
            author: 'Luxury Traveler',
            views: '9.4K'
        },
        {
            id: 7,
            title: 'Island Hopping in Greece',
            category: 'Beach',
            image: '⛵',
            gradient: 'from-blue-400 to-cyan-400',
            excerpt: 'The perfect 2-week Greek island itinerary',
            readTime: '8 min read',
            author: 'Mediterranean Dreams',
            views: '18.6K'
        },
        {
            id: 8,
            title: 'Wine Tasting Through Tuscany',
            category: 'Food',
            image: '🍷',
            gradient: 'from-red-500 to-pink-500',
            excerpt: 'Best vineyards and wine routes in Italy',
            readTime: '7 min read',
            author: 'Wine Connoisse ur',
            views: '11.2K'
        },
        {
            id: 9,
            title: 'Scuba Diving in the Maldives',
            category: 'Adventure',
            image: '🤿',
            gradient: 'from-teal-500 to-blue-500',
            excerpt: 'Top dive sites and marine life encounters',
            readTime: '6 min read',
            author: 'Deep Sea Diver',
            views: '13.8K'
        }
    ];

    const travelTips = [
        {
            icon: '✈️',
            title: 'Book Flights on Tuesday',
            description: 'Airlines typically release deals on Monday nights'
        },
        {
            icon: '🏨',
            title: 'Use Price Alerts',
            description: 'Set up notifications for hotel price drops'
        },
        {
            icon: '📱',
            title: 'Download Offline Maps',
            description: 'Save data and never get lost abroad'
        },
        {
            icon: '💳',
            title: 'No Foreign Transaction Fees',
            description: 'Choose credit cards wisely for international travel'
        }
    ];

    const filteredPosts = selectedCategory === 'all'
        ? inspirationPosts
        : inspirationPosts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                {/* Hero Section */}
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
                            Travel Inspiration ✨
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            opacity: 0.95,
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Discover amazing destinations, travel tips, and stories from around the world
                        </p>
                    </div>
                </div>

                <div className="container container-wide">
                    {/* Category Filter */}
                    <div style={{
                        marginBottom: 'var(--spacing-3xl)',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--spacing-sm)',
                        flexWrap: 'wrap'
                    }}>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category.toLowerCase())}
                                className={`btn btn-sm ${selectedCategory === category.toLowerCase() ? 'btn-primary' : 'btn-ghost'}`}
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Featured Post */}
                    {selectedCategory === 'all' && (
                        <div className="card card-elevated animate-fade-in-up" style={{
                            padding: 0,
                            overflow: 'hidden',
                            marginBottom: 'var(--spacing-3xl)',
                            display: 'grid',
                            gridTemplateColumns: '1.5fr 1fr',
                            minHeight: '350px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '8rem',
                                position: 'relative'
                            }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))' }} />
                                <span style={{ position: 'relative', zIndex: 1 }}>🌍</span>
                            </div>
                            <div style={{ padding: 'var(--spacing-2xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div className="badge badge-warning" style={{ marginBottom: 'var(--spacing-md)', width: 'fit-content' }}>
                                    ⭐ Featured
                                </div>
                                <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '2rem' }}>
                                    Ultimate Guide to World Travel in 2026
                                </h2>
                                <p style={{ marginBottom: 'var(--spacing-lg)', lineHeight: 1.7 }}>
                                    Your comprehensive guide to planning, budgeting, and experiencing the world like never before
                                </p>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                                    <span className="badge badge-primary">15 min read</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        👁️ 45.2K views
                                    </span>
                                </div>
                                <button className="btn btn-primary">
                                    Read Article →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Inspiration Grid */}
                    <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>
                            {selectedCategory === 'all' ? 'Latest Stories' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Travel`}
                        </h2>

                        <div className="grid grid-3">
                            {filteredPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className="card card-elevated animate-fade-in-up"
                                    style={{
                                        padding: 0,
                                        cursor: 'pointer',
                                        animationDelay: `${index * 100}ms`
                                    }}
                                >
                                    <div style={{
                                        height: '200px',
                                        background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '5rem',
                                        position: 'relative'
                                    }}>
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))' }} />
                                        <span style={{ position: 'relative', zIndex: 1 }}>{post.image}</span>
                                    </div>

                                    <div style={{ padding: 'var(--spacing-xl)' }}>
                                        <div className="badge badge-primary" style={{ marginBottom: 'var(--spacing-md)' }}>
                                            {post.category}
                                        </div>

                                        <h3 style={{
                                            fontSize: '1.25rem',
                                            marginBottom: 'var(--spacing-sm)',
                                            lineHeight: 1.3,
                                            fontWeight: 700
                                        }}>
                                            {post.title}
                                        </h3>

                                        <p style={{
                                            fontSize: '0.9375rem',
                                            color: 'var(--text-secondary)',
                                            marginBottom: 'var(--spacing-lg)',
                                            lineHeight: 1.6
                                        }}>
                                            {post.excerpt}
                                        </p>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingTop: 'var(--spacing-md)',
                                            borderTop: '1px solid var(--border-light)'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                                    {post.author}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {post.readTime}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                👁️ {post.views}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Travel Tips Section */}
                    <div style={{
                        padding: 'var(--spacing-3xl)',
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(236, 72, 153, 0.05))',
                        borderRadius: 'var(--radius-2xl)',
                        marginBottom: 'var(--spacing-3xl)'
                    }}>
                        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                            💡 Quick Travel Tips
                        </h2>

                        <div className="grid grid-4">
                            {travelTips.map((tip, index) => (
                                <div
                                    key={index}
                                    style={{
                                        textAlign: 'center',
                                        padding: 'var(--spacing-xl)'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '3rem',
                                        marginBottom: 'var(--spacing-md)'
                                    }}>
                                        {tip.icon}
                                    </div>
                                    <h4 style={{
                                        fontSize: '1.125rem',
                                        marginBottom: 'var(--spacing-sm)',
                                        fontWeight: 700
                                    }}>
                                        {tip.title}
                                    </h4>
                                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                                        {tip.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        color: 'white',
                        textAlign: 'center',
                        padding: 'var(--spacing-3xl)'
                    }}>
                        <h2 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>
                            Start Planning Your Dream Trip
                        </h2>
                        <p style={{ opacity: 0.95, marginBottom: 'var(--spacing-xl)', fontSize: '1.125rem' }}>
                            Turn inspiration into reality with our smart trip planner
                        </p>
                        <button
                            onClick={() => navigate('/trips/create')}
                            className="btn btn-lg"
                            style={{ background: 'white', color: 'var(--primary-gradient-start)' }}
                        >
                            Create Your Itinerary
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inspiration;
