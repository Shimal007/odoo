import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AIPlanGenerator = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const tripData = location.state;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [itinerary, setItinerary] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!tripData) {
            navigate('/trips/create');
            return;
        }

        // Auto-generate AI plan on mount
        generateAIPlan();
    }, [user, tripData]);

    const generateAIPlan = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/generate-ai-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    city: tripData.city,
                    country: tripData.country,
                    startDate: tripData.startDate,
                    endDate: tripData.endDate,
                    tripName: tripData.tripName,
                    description: tripData.description
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setItinerary(data.itinerary);
            } else {
                setError(data.error || 'Failed to generate AI plan');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTrip = async () => {
        setSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/trips/save-ai-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user._id,
                    itinerary: itinerary
                })
            });

            const data = await response.json();
            if (response.ok) {
                navigate(`/trips/${data.trip._id}`);
            } else {
                setError(data.error || 'Failed to save trip');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteActivity = (dayIndex, activityIndex) => {
        const updatedItinerary = { ...itinerary };
        updatedItinerary.days[dayIndex].activities.splice(activityIndex, 1);
        setItinerary(updatedItinerary);
    };

    const scrollToDay = (dayNum) => {
        document.getElementById(`day-${dayNum}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="page-container">
            <Navbar user={user} onLogout={onLogout} />

            <div className="container section">
                {/* Header Card */}
                <div className="card mb-4 animate-fade-in" style={{ background: 'linear-gradient(to right, white, var(--cream-light))' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-gradient-gold" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                                ✨ AI Bespoke Planner
                            </h1>
                            <p className="text-warm-gray font-medium">
                                Crafting a luxury escape to <span className="text-gold">{tripData?.city}, {tripData?.country}</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={generateAIPlan} className="btn btn-outline btn-sm" disabled={loading}>
                                🔄 Regenerate
                            </button>
                            {itinerary && (
                                <button onClick={handleSaveTrip} className="btn btn-primary btn-sm" disabled={saving}>
                                    {saving ? 'Saving...' : '💾 Save Itinerary'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Split Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>

                    {/* Left Side: Days & Activities */}
                    <div className="main-content">
                        {loading && (
                            <div className="card text-center p-4 animate-fade-in">
                                <div className="mb-3" style={{ fontSize: '3rem' }}>🤖</div>
                                <h3 className="font-serif">Curating your exclusive itinerary...</h3>
                                <p className="text-warm-gray">Analyzing local gems and gourmet experiences...</p>
                                <div className="mt-3">
                                    <div style={{ display: 'inline-block', width: '200px', height: '4px', background: 'var(--cream-dark)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: '60%', height: '100%', background: 'var(--gold)', animation: 'pulse 1.5s infinite' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="card p-4 text-center border-danger">
                                <p className="text-danger mb-3">{error}</p>
                                <button onClick={generateAIPlan} className="btn btn-primary btn-sm">Try Again</button>
                            </div>
                        )}

                        {itinerary && !loading && (
                            <div className="space-y-6">
                                {itinerary.days.map((day, dayIdx) => (
                                    <div key={dayIdx} id={`day-${day.dayNumber}`} className="mb-8 animate-fade-in-up" style={{ animationDelay: `${dayIdx * 0.1}s` }}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="bg-gold text-white w-12 h-12 rounded-full flex items-center justify-center font-serif text-xl border-4 border-cream shadow-md">
                                                {day.dayNumber}
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{day.title}</h3>
                                                <p className="text-warm-gray text-sm m-0">{day.date}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            {day.activities.map((activity, actIdx) => (
                                                <div key={actIdx} className="card-cream p-0 overflow-hidden group hover:shadow-lg transition-all" style={{ borderLeft: '6px solid var(--gold)', borderRadius: '1rem' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 280px', minHeight: '180px' }}>
                                                        {/* Content Side */}
                                                        <div className="p-4 flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{activity.time}</span>
                                                                    <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{activity.type}</span>
                                                                    {activity.cost > 0 && <span className="text-gold font-bold text-xs">${activity.cost}</span>}
                                                                </div>
                                                                <h5 className="mb-2 font-serif" style={{ fontSize: '1.25rem' }}>{activity.title}</h5>
                                                                <p className="text-warm-gray text-sm line-clamp-3 mb-3">{activity.description}</p>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <a
                                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((activity.location || activity.title) + ' ' + (itinerary.city || ''))}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-gold text-xs font-bold hover:underline"
                                                                >
                                                                    📍 Get Directions
                                                                </a>
                                                                <button onClick={() => handleDeleteActivity(dayIdx, actIdx)} className="text-danger opacity-0 group-hover:opacity-100 transition-opacity btn btn-ghost btn-sm">
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Map Side */}
                                                        <div className="bg-stone-200 border-l border-cream-dark">
                                                            <iframe
                                                                width="100%"
                                                                height="100%"
                                                                style={{ border: 0 }}
                                                                loading="lazy"
                                                                src={`https://maps.google.com/maps?q=${encodeURIComponent((activity.location || activity.title) + ' ' + (itinerary.city || ''))}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                                            ></iframe>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Sticky Widgets */}
                    <div className="sidebar sticky" style={{ top: '100px' }}>
                        {itinerary ? (
                            <div className="flex flex-col gap-4">
                                {/* Destination Card */}
                                <div className="card-cream p-4 text-center">
                                    <div style={{ fontSize: '2rem' }}>🌆</div>
                                    <h4 className="font-serif mt-2 mb-1">{itinerary.city}</h4>
                                    <p className="text-xs uppercase tracking-widest text-warm-gray mb-3">{itinerary.country}</p>
                                    <div className="flex justify-around border-t border-cream-dark pt-3">
                                        <div>
                                            <div className="text-gold font-bold">{itinerary.days?.length}</div>
                                            <div className="text-[10px] text-warm-gray uppercase">Days</div>
                                        </div>
                                        <div>
                                            <div className="text-gold font-bold">${itinerary.estimatedBudget?.total}</div>
                                            <div className="text-[10px] text-warm-gray uppercase">Est. Cost</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Day Navigator */}
                                <div className="card p-4">
                                    <h5 className="text-xs font-bold uppercase tracking-widest mb-3 text-gold">📅 Quick Navigator</h5>
                                    <div className="flex flex-col gap-2">
                                        {itinerary.days.map((day, idx) => (
                                            <button key={idx} onClick={() => scrollToDay(day.dayNumber)} className="flex items-center justify-between p-2 text-sm text-warm-gray hover:bg-cream-light rounded-md transition-all text-left group">
                                                <span>Day {day.dayNumber}: {day.title.length > 20 ? day.title.substring(0, 20) + '...' : day.title}</span>
                                                <span className="opacity-0 group-hover:opacity-100">→</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Insights Widget */}
                                <div className="card p-4 bg-charcoal text-white border-none shadow-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span style={{ fontSize: '1.2rem' }}>✨</span>
                                        <h5 className="text-xs font-bold uppercase tracking-widest text-gold-light" style={{ margin: 0, color: 'var(--gold-light)' }}>AI Insights</h5>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
                                        "This itinerary balances high-energy exploration with serene relaxation. We've prioritized local culinary favorites in {itinerary.city} while ensuring you hit the must-see landmarks."
                                    </p>
                                    <div className="bg-white/10 p-2 rounded text-[10px]">
                                        💡 <span className="text-gold-light font-bold">PRO TIP:</span> Use public transport near the city center to save up to 15% of your budget.
                                    </div>
                                </div>

                                {/* Budget Breakdown Meter */}
                                <div className="card p-4">
                                    <h5 className="text-xs font-bold uppercase tracking-widest mb-3 text-gold">💰 Budget Overview</h5>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span>Experiences</span>
                                                <span>${itinerary.estimatedBudget?.activities}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-cream-dark rounded-full overflow-hidden">
                                                <div className="h-full bg-gold" style={{ width: '65%' }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span>Gastronomy</span>
                                                <span>${itinerary.estimatedBudget?.food}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-cream-dark rounded-full overflow-hidden">
                                                <div className="h-full bg-gold" style={{ width: '45%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="card-cream p-4 text-center opacity-50">
                                <p className="text-xs italic">Plan details will appear here...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPlanGenerator;