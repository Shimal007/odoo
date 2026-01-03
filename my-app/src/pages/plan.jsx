import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Clock, Send, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TravelItineraryBuilder = () => {
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        city: '',
        country: '',
        startDate: '',
        endDate: '',
    });

    const generateItinerary = async () => {
        if (!formData.city || !formData.country || !formData.startDate || !formData.endDate) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/itinerary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                setItinerary(data.itinerary);
            } else {
                alert(data.error || 'Failed to generate itinerary');
            }
        } catch (error) {
            console.error('Error generating itinerary:', error);
            alert('Failed to connect to the server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#2d3436] font-sans">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 text-stone-500 hover:text-amber-700 transition-colors">
                            <ArrowLeft size={20} />
                            <span className="font-medium text-sm">Back to Home</span>
                        </Link>
                        <div className="text-center">
                            <h1 className="text-2xl font-serif text-stone-800 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                                Wanderlust AI
                            </h1>
                        </div>
                        <div className="w-24"></div> {/* Spacer for symmetry */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {!itinerary ? (
                    <div className="max-w-xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-6 text-amber-700">
                                <Sparkles size={32} />
                            </div>
                            <h2 className="text-4xl font-serif text-stone-900 mb-4">Plan Your Perfect Escape</h2>
                            <p className="text-stone-500 text-lg">Enter your destination and dates, and our AI will craft a bespoke itinerary for you.</p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Destination City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Paris"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-stone-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none text-stone-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Country</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="e.g. France"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-stone-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none text-stone-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-stone-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none text-stone-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">End Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-stone-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none text-stone-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={generateItinerary}
                                disabled={loading}
                                className="w-full py-5 bg-stone-900 hover:bg-amber-800 disabled:bg-stone-400 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-stone-900/10 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>Crafting Your Experience...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="group-hover:rotate-12 transition-transform" size={20} />
                                        <span>Generate AI Itinerary</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-4xl font-serif text-stone-900 mb-2">{itinerary.city}, {itinerary.country}</h2>
                                <p className="text-amber-700 font-medium tracking-wide">
                                    {new Date(itinerary.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — {new Date(itinerary.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <button
                                onClick={() => setItinerary(null)}
                                className="px-6 py-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-stone-600 font-medium text-sm"
                            >
                                Plan Another Trip
                            </button>
                        </div>

                        <div className="space-y-12">
                            {itinerary.days.map((day, dIdx) => (
                                <div key={dIdx} className="relative pl-8 border-l-2 border-amber-100 last:border-l-transparent">
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-[#faf9f6]"></div>
                                    <h3 className="text-2xl font-serif text-stone-800 mb-6">{day.day}</h3>

                                    <div className="grid gap-6">
                                        {day.activities.map((activity, aIdx) => (
                                            <div key={aIdx} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow group">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-stone-50 rounded-xl text-amber-700 group-hover:bg-amber-50 transition-colors">
                                                        <Clock size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-bold text-amber-700 uppercase tracking-wider">{activity.time}</span>
                                                            <a
                                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.title + ' ' + itinerary.city)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-700 transition-colors uppercase tracking-widest"
                                                            >
                                                                <MapPin size={14} />
                                                                View on Map
                                                            </a>
                                                        </div>
                                                        <h4 className="text-xl font-serif text-stone-900 mb-2">{activity.title}</h4>
                                                        <p className="text-stone-500 leading-relaxed mb-4">{activity.description}</p>

                                                        {/* Map Embed */}
                                                        <div className="w-full h-48 rounded-xl overflow-hidden border border-stone-100 shadow-inner bg-stone-50">
                                                            <iframe
                                                                width="100%"
                                                                height="100%"
                                                                style={{ border: 0 }}
                                                                loading="lazy"
                                                                allowFullScreen
                                                                referrerPolicy="no-referrer-when-downgrade"
                                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(activity.title + ' ' + itinerary.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                                            ></iframe>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelItineraryBuilder;
