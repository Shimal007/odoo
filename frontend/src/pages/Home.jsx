import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: '🗺️',
            title: 'Multi-City Planning',
            description: 'Plan complex trips across multiple destinations with ease'
        },
        {
            icon: '📅',
            title: 'Day-wise Itineraries',
            description: 'Organize your activities day by day for perfect planning'
        },
        {
            icon: '💰',
            title: 'Budget Tracking',
            description: 'Keep track of expenses and stay within budget'
        },
        {
            icon: '🔗',
            title: 'Share & Collaborate',
            description: 'Share your itineraries with friends and family'
        },
        {
            icon: '🌍',
            title: 'Discover Destinations',
            description: 'Explore amazing cities and attractions worldwide'
        },
        {
            icon: '📱',
            title: 'Responsive Design',
            description: 'Access your plans anywhere, on any device'
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
        }}>
            {/* Hero Section */}
            <div className="container" style={{
                padding: 'var(--spacing-2xl) var(--spacing-lg)',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '5rem',
                    marginBottom: 'var(--spacing-lg)',
                    animation: 'fadeIn 1s ease-out'
                }}>
                    ✈️🌍
                </div>

                <h1 style={{
                    fontSize: '4rem',
                    color: 'white',
                    marginBottom: 'var(--spacing-lg)',
                    fontFamily: 'Playfair Display, serif',
                    animation: 'fadeIn 1s ease-out 0.2s backwards'
                }}>
                    GlobeTrotter
                </h1>

                <p style={{
                    fontSize: '1.5rem',
                    marginBottom: 'var(--spacing-2xl)',
                    opacity: 0.95,
                    maxWidth: '700px',
                    margin: '0 auto var(--spacing-2xl)',
                    animation: 'fadeIn 1s ease-out 0.4s backwards'
                }}>
                    Empowering Personalized Travel Planning
                </p>

                <p style={{
                    fontSize: '1.125rem',
                    marginBottom: 'var(--spacing-2xl)',
                    opacity: 0.9,
                    maxWidth: '600px',
                    margin: '0 auto var(--spacing-2xl)',
                    animation: 'fadeIn 1s ease-out 0.6s backwards'
                }}>
                    Plan multi-city trips, build day-wise itineraries, manage budgets, and share your adventures with the world.
                </p>

                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-lg)',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    animation: 'fadeIn 1s ease-out 0.8s backwards'
                }}>
                    <button
                        onClick={() => navigate('/signup')}
                        className="btn btn-lg"
                        style={{
                            background: 'white',
                            color: 'var(--ocean-blue)',
                            fontSize: '1.25rem',
                            padding: '1.25rem 3rem',
                            boxShadow: 'var(--shadow-2xl)'
                        }}
                    >
                        Get Started Free
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-lg"
                        style={{
                            background: 'transparent',
                            color: 'white',
                            border: '2px solid white',
                            fontSize: '1.25rem',
                            padding: '1.25rem 3rem'
                        }}
                    >
                        Sign In
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: 'var(--spacing-2xl) 0'
            }}>
                <div className="container">
                    <h2 style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: '2.5rem',
                        marginBottom: 'var(--spacing-2xl)'
                    }}>
                        Everything You Need for Perfect Trips
                    </h2>

                    <div className="grid grid-3" style={{ gap: 'var(--spacing-xl)' }}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--spacing-xl)',
                                    textAlign: 'center',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    transition: 'all var(--transition-base)',
                                    cursor: 'pointer'
                                }}
                                className="card"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    color: 'white',
                                    marginBottom: 'var(--spacing-sm)',
                                    fontSize: '1.5rem'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container" style={{
                textAlign: 'center',
                padding: 'var(--spacing-2xl) var(--spacing-lg)'
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    color: 'white',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    Ready to Start Your Journey?
                </h2>

                <p style={{
                    fontSize: '1.25rem',
                    marginBottom: 'var(--spacing-2xl)',
                    opacity: 0.9,
                    maxWidth: '600px',
                    margin: '0 auto var(--spacing-2xl)'
                }}>
                    Join thousands of travelers planning their dream trips with GlobeTrotter
                </p>

                <button
                    onClick={() => navigate('/signup')}
                    className="btn btn-lg"
                    style={{
                        background: 'white',
                        color: 'var(--ocean-blue)',
                        fontSize: '1.25rem',
                        padding: '1.25rem 3rem',
                        boxShadow: 'var(--shadow-2xl)'
                    }}
                >
                    Create Your First Trip →
                </button>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-xl)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                opacity: 0.8
            }}>
                <p>© 2026 GlobeTrotter. Built with ❤️ for travelers worldwide.</p>
            </div>
        </div>
    );
};

export default Home;
