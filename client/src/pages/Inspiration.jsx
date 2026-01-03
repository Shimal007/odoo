import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { DotLottiePlayer } from '@dotlottie/react-player';

const Inspiration = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [posts, setPosts] = useState([]);
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = ['All', 'Beach', 'Adventure', 'Culture', 'Food', 'Luxury', 'Budget'];

    useEffect(() => {
        fetchInspiration();
    }, []);

    const fetchInspiration = async () => {
        setLoading(true);
        setError(null);
        try {
            // Using a controller to handle potential hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const response = await fetch('http://localhost:5000/api/inspiration', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();
            if (response.ok) {
                setPosts(data.posts || []);
                setTips(data.tips || []);
            } else {
                setError(data.error || 'The AI is taking a short break. Please try again.');
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('Generation took too long. The AI is busy, please retry!');
            } else {
                setError('Unable to connect to the travel inspiration engine.');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = selectedCategory === 'all'
        ? posts
        : posts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());

    const featuredPost = posts.length > 0 ? posts[0] : null;

    if (loading) {
        return (
            <div className="page-wrapper" style={{ background: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar user={user} onLogout={onLogout} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="text-center w-full animate-fade-in" style={{ maxWidth: '400px' }}>
                        <DotLottiePlayer
                            src="/loading.lottie"
                            autoplay
                            loop
                            style={{ width: '100%', height: 'auto' }}
                        />
                        <h2 className="font-serif text-3xl mb-2 text-charcoal">Curating Your Inspiration</h2>
                        <p className="text-warm-gray">Our AI is traveling the world to find the best stories...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Navbar user={user} onLogout={onLogout} />

            <div className="content-wrapper">
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--gold-dark) 100%)',
                    color: 'white',
                    padding: 'var(--spacing-xl) 0',
                    textAlign: 'center',
                    marginBottom: 'var(--spacing-xl)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div className="container">
                        <h1 className="font-serif" style={{
                            color: 'var(--cream-light)',
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: 'var(--spacing-xs)'
                        }}>
                            Wanderlust Inspiration ✨
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--cream)',
                            opacity: 0.9,
                            maxWidth: '700px',
                            margin: '0 auto',
                            fontStyle: 'italic'
                        }}>
                            AI-Curated stories, hidden gems, and pro travel wisdom.
                        </p>
                    </div>
                </div>

                <div className="container container-wide">
                    {/* Error State */}
                    {error && (
                        <div className="card text-center p-4 border-danger mb-4">
                            <p className="text-danger">{error}</p>
                            <button onClick={fetchInspiration} className="btn btn-primary btn-sm mt-4 px-8">Try Again</button>
                        </div>
                    )}

                    {!error && (
                        <>
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
                            {selectedCategory === 'all' && featuredPost && (
                                <div className="card card-elevated animate-fade-in-up" style={{
                                    padding: 0,
                                    overflow: 'hidden',
                                    marginBottom: 'var(--spacing-3xl)',
                                    display: 'grid',
                                    gridTemplateColumns: '1.5fr 1fr',
                                    minHeight: '400px',
                                    border: 'none',
                                    boxShadow: 'var(--shadow-xl)'
                                }}>
                                    <div style={{
                                        backgroundImage: `url(${featuredPost.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative'
                                    }}>
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)' }} />
                                    </div>
                                    <div style={{ padding: 'var(--spacing-2xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' }}>
                                        <div className="badge badge-gold" style={{ marginBottom: 'var(--spacing-md)', width: 'fit-content' }}>
                                            ⭐ Trending Now
                                        </div>
                                        <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '2.25rem', fontFamily: 'var(--font-serif)' }}>
                                            {featuredPost.title}
                                        </h2>
                                        <p style={{ marginBottom: 'var(--spacing-lg)', lineHeight: 1.7, color: 'var(--warm-gray)' }}>
                                            {featuredPost.excerpt}
                                        </p>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                                            <span className="badge badge-gray">{featuredPost.readTime}</span>
                                            <span style={{ color: 'var(--warm-gray)', fontSize: '0.875rem', fontWeight: 600 }}>
                                                👁️ {featuredPost.views} explorers
                                            </span>
                                        </div>
                                        <button className="btn btn-primary" style={{ alignSelf: 'start' }}>
                                            Read Feature Story →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Inspiration Grid */}
                            <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                                <h2 className="font-serif" style={{ marginBottom: 'var(--spacing-xl)', fontSize: '2rem' }}>
                                    {selectedCategory === 'all' ? 'Latest Stories' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Travel`}
                                </h2>

                                <div className="grid grid-3">
                                    {filteredPosts.map((post, index) => (
                                        <div
                                            key={post.id}
                                            className="card card-elevated animate-fade-in-up group"
                                            style={{
                                                padding: 0,
                                                cursor: 'pointer',
                                                animationDelay: `${index * 100}ms`,
                                                overflow: 'hidden',
                                                border: '1px solid rgba(184, 134, 11, 0.1)'
                                            }}
                                        >
                                            <div style={{
                                                height: '240px',
                                                backgroundImage: `url(${post.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                transition: 'transform 0.5s ease',
                                                position: 'relative'
                                            }} className="group-hover:scale-110">
                                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }} />
                                                <div className="badge badge-gold" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                                    {post.category}
                                                </div>
                                            </div>

                                            <div style={{ padding: 'var(--spacing-xl)', background: 'white', position: 'relative', zIndex: 1 }}>
                                                <h3 style={{
                                                    fontSize: '1.4rem',
                                                    marginBottom: 'var(--spacing-sm)',
                                                    lineHeight: 1.3,
                                                    fontFamily: 'var(--font-serif)'
                                                }}>
                                                    {post.title}
                                                </h3>

                                                <p style={{
                                                    fontSize: '0.9rem',
                                                    color: 'var(--warm-gray)',
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
                                                    borderTop: '1px solid var(--cream-dark)'
                                                }}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center text-xs font-bold text-gold">
                                                            {post.author.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                                                {post.author}
                                                            </div>
                                                            <div style={{ fontSize: '0.7rem', color: 'var(--warm-gray)' }}>
                                                                {post.readTime}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', fontWeight: 600 }}>
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
                                background: 'white',
                                borderRadius: 'var(--radius-2xl)',
                                marginBottom: 'var(--spacing-3xl)',
                                border: '2px solid var(--cream-dark)',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                                <h2 className="font-serif text-center" style={{ marginBottom: 'var(--spacing-2xl)', fontSize: '2.5rem' }}>
                                    💡 Global Travel Smarts
                                </h2>

                                <div className="grid grid-4">
                                    {tips.map((tip, index) => (
                                        <div
                                            key={index}
                                            className="text-center p-4 hover:transform hover:-translate-y-2 transition-all"
                                        >
                                            <div style={{
                                                fontSize: '3.5rem',
                                                marginBottom: 'var(--spacing-md)',
                                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                                            }}>
                                                {tip.icon}
                                            </div>
                                            <h4 style={{
                                                fontSize: '1.25rem',
                                                marginBottom: 'var(--spacing-sm)',
                                                fontWeight: 700,
                                                color: 'var(--gold)'
                                            }}>
                                                {tip.title}
                                            </h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--warm-gray)', lineHeight: 1.6 }}>
                                                {tip.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

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
