import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: '🗺️',
            title: 'Smart Itinerary Planning',
            description: 'AI-powered suggestions for the perfect day-by-day travel plan'
        },
        {
            icon: '💰',
            title: 'Budget Management',
            description: 'Real-time cost tracking and smart budget recommendations'
        },
        {
            icon: '🌍',
            title: '1000+ Destinations',
            description: 'Explore cities worldwide with detailed guides and insights'
        },
        {
            icon: '🎯',
            title: 'Curated Activities',
            description: 'Hand-picked experiences rated by real travelers'
        },
        {
            icon: '📱',
            title: 'Mobile Friendly',
            description: 'Plan and manage trips seamlessly across all devices'
        },
        {
            icon: '🔗',
            title: 'Share & Collaborate',
            description: 'Create shareable itineraries with friends and family'
        }
    ];

    const popularDestinations = [
        { name: 'Paris', country: 'France', icon: '🗼', gradient: 'from-purple-500 to-pink-500', trips: '12.5K' },
        { name: 'Tokyo', country: 'Japan', icon: '🗾', gradient: 'from-red-500 to-yellow-500', trips: '10.2K' },
        { name: 'Bali', country: 'Indonesia', icon: '🏝️', gradient: 'from-green-500 to-teal-500', trips: '8.7K' },
        { name: 'New York', country: 'USA', icon: '🗽', gradient: 'from-blue-500 to-cyan-500', trips: '15.3K' },
        { name: 'Dubai', country: 'UAE', icon: '🏙️', gradient: 'from-orange-500 to-red-500', trips: '9.1K' },
        { name: 'Rome', country: 'Italy', icon: '🏛️', gradient: 'from-indigo-500 to-purple-500', trips: '11.4K' }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Travel Blogger',
            image: '👩‍💼',
            text: 'GlobeTrotter transformed how I plan trips. The budget tracking feature saved me thousands!',
            rating: 5
        },
        {
            name: 'Michael Chen',
            role: 'Adventure Seeker',
            image: '🧑‍💻',
            text: 'Best travel planning tool I\'ve used. The activity suggestions are spot-on!',
            rating: 5
        },
        {
            name: 'Emma Williams',
            role: 'Family Traveler',
            image: '👩‍⚕️',
            text: 'Planning our family vacation was so easy. Loved sharing the itinerary with everyone!',
            rating: 5
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background Elements */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0.1
                }}>
                    <div className="animate-float" style={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        fontSize: '8rem',
                        animationDelay: '0s'
                    }}>✈️</div>
                    <div className="animate-float" style={{
                        position: 'absolute',
                        top: '60%',
                        right: '15%',
                        fontSize: '6rem',
                        animationDelay: '2s'
                    }}>🌍</div>
                    <div className="animate-float" style={{
                        position: 'absolute',
                        bottom: '20%',
                        left: '20%',
                        fontSize: '5rem',
                        animationDelay: '4s'
                    }}>🏖️</div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-3xl) 0'
                    }}>
                        <div className="animate-fade-in-up" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '0.5rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 'var(--radius-full)',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                ✨ Trusted by 50,000+ Travelers
                            </span>
                        </div>

                        <h1 className="animate-fade-in-up delay-100" style={{
                            color: 'white',
                            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                            fontWeight: 900,
                            marginBottom: 'var(--spacing-lg)',
                            lineHeight: 1.1
                        }}>
                            Your Dream Journey<br />
                            Starts Here
                        </h1>

                        <p className="animate-fade-in-up delay-200" style={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                            maxWidth: '700px',
                            margin: '0 auto var(--spacing-2xl)',
                            lineHeight: 1.6
                        }}>
                            Plan, organize, and share your perfect travel experiences with our intelligent trip planning platform
                        </p>

                        <div className="animate-fade-in-up delay-300" style={{
                            display: 'flex',
                            gap: 'var(--spacing-lg)',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginBottom: 'var(--spacing-2xl)'
                        }}>
                            <button
                                onClick={() => navigate('/signup')}
                                className="btn btn-lg"
                                style={{
                                    background: 'white',
                                    color: 'var(--primary-gradient-start)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                    fontSize: '1.25rem',
                                    padding: '1.25rem 3rem'
                                }}
                            >
                                🚀 Start Planning Free
                            </button>

                            <button
                                onClick={() => navigate('/discover')}
                                className="btn btn-lg btn-outline"
                                style={{
                                    borderColor: 'white',
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    padding: '1.25rem 3rem'
                                }}
                            >
                                🌍 Explore Destinations
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="animate-fade-in-up delay-400" style={{
                            display: 'flex',
                            gap: 'var(--spacing-2xl)',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginTop: 'var(--spacing-3xl)'
                        }}>
                            {[
                                { value: '50K+', label: 'Happy Travelers' },
                                { value: '120K+', label: 'Trips Planned' },
                                { value: '1000+', label: 'Destinations' },
                                { value: '4.9★', label: 'User Rating' }
                            ].map((stat, index) => (
                                <div key={index} style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: '2.5rem',
                                        fontWeight: 800,
                                        color: 'white',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {stat.value}
                                    </div>
                                    <div style={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '0.875rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={{ padding: 'var(--spacing-3xl) 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--spacing-md)' }}>
                            Everything You Need for <span className="text-gradient">Perfect Trips</span>
                        </h2>
                        <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                            Powerful features designed to make travel planning effortless and enjoyable
                        </p>
                    </div>

                    <div className="grid grid-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card card-elevated animate-fade-in-up"
                                style={{
                                    textAlign: 'center',
                                    animationDelay: `${index * 100}ms`,
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{
                                    fontSize: '4rem',
                                    marginBottom: 'var(--spacing-lg)',
                                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: 'var(--spacing-sm)',
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 700
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Destinations */}
            <div style={{ padding: 'var(--spacing-3xl) 0' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--spacing-md)' }}>
                            Trending <span className="text-gradient-sunset">Destinations</span>
                        </h2>
                        <p style={{ fontSize: '1.125rem' }}>
                            Discover where travelers are planning their next adventure
                        </p>
                    </div>

                    <div className="grid grid-3">
                        {popularDestinations.map((dest, index) => (
                            <div
                                key={index}
                                className="card card-elevated animate-scale-in"
                                style={{
                                    padding: 0,
                                    cursor: 'pointer',
                                    animationDelay: `${index * 100}ms`
                                }}
                                onClick={() => navigate('/discover')}
                            >
                                <div style={{
                                    height: '200px',
                                    background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '6rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))' }} />
                                    <span style={{ position: 'relative', zIndex: 1 }}>{dest.icon}</span>
                                </div>
                                <div style={{ padding: 'var(--spacing-xl)' }}>
                                    <h3 style={{
                                        fontSize: '1.75rem',
                                        marginBottom: '0.25rem',
                                        fontWeight: 700
                                    }}>
                                        {dest.name}
                                    </h3>
                                    <p style={{
                                        color: 'var(--text-muted)',
                                        marginBottom: 'var(--spacing-md)',
                                        fontSize: '1rem'
                                    }}>
                                        {dest.country}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="badge badge-primary">
                                            📊 {dest.trips} trips
                                        </span>
                                        <span style={{
                                            color: 'var(--primary-gradient-start)',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            Explore →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div style={{
                padding: 'var(--spacing-3xl) 0',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(236, 72, 153, 0.05))'
            }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--spacing-md)' }}>
                            Loved by <span className="text-gradient">Travelers Worldwide</span>
                        </h2>
                        <p style={{ fontSize: '1.125rem' }}>
                            See what our community has to say
                        </p>
                    </div>

                    <div className="grid grid-3">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="card animate-fade-in-up"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    borderTop: '4px solid var(--primary-gradient-start)'
                                }}
                            >
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    {'⭐'.repeat(testimonial.rating)}
                                </div>
                                <p style={{
                                    fontSize: '1.125rem',
                                    marginBottom: 'var(--spacing-lg)',
                                    fontStyle: 'italic',
                                    lineHeight: 1.7
                                }}>
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div style={{
                                        fontSize: '3rem',
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
                                        borderRadius: 'var(--radius-full)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {testimonial.image}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                                            {testimonial.name}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div style={{
                padding: 'var(--spacing-3xl) 0',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{
                        color: 'white',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        Ready to Start Your Adventure?
                    </h2>
                    <p style={{
                        fontSize: '1.25rem',
                        opacity: 0.95,
                        marginBottom: 'var(--spacing-2xl)',
                        maxWidth: '600px',
                        margin: '0 auto var(--spacing-2xl)'
                    }}>
                        Join thousands of travelers creating unforgettable journeys with GlobeTrotter
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="btn btn-lg"
                        style={{
                            background: 'white',
                            color: 'var(--primary-gradient-start)',
                            fontSize: '1.25rem',
                            padding: '1.25rem 3rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}
                    >
                        Get Started Free - No Credit Card Required
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: 'var(--spacing-2xl)',
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-light)'
            }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 'var(--spacing-md)'
                    }}>
                        <div>
                            <div style={{
                                fontFamily: 'Playfair Display, serif',
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                ✈️ GlobeTrotter
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                © 2026 GlobeTrotter. Empowering travelers worldwide.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>About</a>
                            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>Blog</a>
                            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>Help</a>
                            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
