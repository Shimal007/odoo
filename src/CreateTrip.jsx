import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Calendar,
    Sparkles,
    ChevronRight,
    Wind,
    Trophy,
    PlaneTakeoff,
    Globe2,
    Camera,
    Heart
} from 'lucide-react';

// Import assets
import suggestion1 from './assets/suggestion1.png';
import suggestion2 from './assets/suggestion2.png';
import suggestion3 from './assets/suggestion3.png';
import suggestion4 from './assets/suggestion4.png';
import suggestion5 from './assets/suggestion5.png';
import suggestion6 from './assets/suggestion6.png';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        place: '',
        description: '',
        style: 'Relaxed'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [activeField, setActiveField] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        setIsLoading(true);

        // Specific object requested by user
        const tripObject = {
            tripId: "trip" + Math.random().toString(36).substr(2, 5).toUpperCase(),
            userId: "abc123",
            tripName: formData.name || "Untitled Trip",
            startDate: formData.startDate,
            endDate: formData.endDate,
            destination: formData.place || "Unknown Location",
            // Important: NO activities yet
        };

        console.log("Creating Trip Object:", tripObject);

        // Transition delay for professional feel
        setTimeout(() => {
            setIsLoading(false);
            navigate(`/build-itinerary/${tripObject.tripId}`, { state: { trip: tripObject } });
        }, 2500);
    };

    const suggestions = [
        { id: 1, title: 'Mountain Peaks', img: suggestion1, mood: 'Adventurous' },
        { id: 2, title: 'European Streets', img: suggestion2, mood: 'Romantic' },
        { id: 3, title: 'Crystal Waters', img: suggestion3, mood: 'Tropical' },
        { id: 4, title: 'Forest Trails', img: suggestion4, mood: 'Serene' },
        { id: 5, title: 'Eternal Cities', img: suggestion5, mood: 'Classic' },
        { id: 6, title: 'Night Markets', img: suggestion6, mood: 'Vibrant' },
    ];

    const travelQuotes = [
        "To travel is to live.",
        "Adventure awaits.",
        "Collect moments, not things.",
        "Explore the unexplored."
    ];

    return (
        <div className="min-h-screen bg-primary px-4 py-12 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Side: Creative Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7 space-y-10"
                >
                    <header className="space-y-2">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 5 }}
                                className="bg-secondary p-3 rounded-2xl shadow-lg shadow-secondary/20"
                            >
                                <Wind className="text-white w-6 h-6" />
                            </motion.div>
                            <h1 className="text-3xl font-black text-dark tracking-tighter">GlobalTrotter</h1>
                        </div>
                        <p className="text-gray-400 font-bold ml-1">Begin your next chapter of exploration</p>
                    </header>

                    <section className="glass-card rounded-[3rem] p-10 relative overflow-hidden">
                        {/* Background Decorative Element */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black flex items-center gap-2">
                                    <Sparkles className="text-secondary w-5 h-5" />
                                    Trip Blueprint
                                </h2>
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-secondary' : 'bg-gray-200'}`} />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="section-label">What should we call this journey?</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('name')}
                                        placeholder="e.g. My Dream Paris Escape"
                                        className="input-field"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="section-label">Departure</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="input-field !pl-12"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="section-label">Return</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="input-field !pl-12"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="section-label">Select Your Compass</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                        <select
                                            name="place"
                                            value={formData.place}
                                            onChange={handleChange}
                                            className="input-field !pl-12 appearance-none"
                                        >
                                            <option value="">Search destination...</option>
                                            <option value="Paris">Paris, France</option>
                                            <option value="Bali">Bali, Indonesia</option>
                                            <option value="Tokyo">Tokyo, Japan</option>
                                            <option value="Rome">Rome, Italy</option>
                                            <option value="Santorini">Santorini, Greece</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="section-label">Trip Style</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Relaxed', 'Adventurous', 'Cultural', 'Luxury'].map(style => (
                                            <button
                                                key={style}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, style }))}
                                                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${formData.style === style
                                                        ? 'bg-secondary text-white shadow-lg scale-105'
                                                        : 'bg-white text-gray-400 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="section-label">Tell the story before it starts</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Briefly describe your vision for this trip..."
                                        className="input-field resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center font-bold text-[10px] shadow-sm">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center font-bold text-[10px] text-secondary shadow-sm">
                                        +12
                                    </div>
                                </div>
                                <button
                                    onClick={handleNext}
                                    disabled={!formData.name || !formData.place}
                                    className="btn-primary group"
                                >
                                    <span className="flex items-center gap-2">
                                        Create Journey <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </section>
                </motion.div>

                {/* Right Side: Professional Live Preview & Info */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 space-y-8"
                >
                    {/* Live Preview Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-orange-200 rounded-[3rem] blur-xl opacity-25 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative bg-white rounded-[3rem] overflow-hidden shadow-premium">
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                <img
                                    src={formData.place === 'Paris' ? suggestion2 : formData.place === 'Bali' ? suggestion3 : suggestion1}
                                    className="w-full h-full object-cover opacity-80"
                                    alt="Preview"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                        <PlaneTakeoff className="w-3 h-3" /> Flight Booked
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 -mt-12 relative z-10 bg-white shadow-[0_-20px_40px_rgba(255,255,255,1)]">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-secondary font-black uppercase text-[10px] tracking-widest">{formData.style} Journey</p>
                                    <Heart className="text-pink-400 w-5 h-5" />
                                </div>
                                <h3 className="text-3xl font-black text-dark mb-4 leading-tight">
                                    {formData.name || "Predicting your Next Adventure..."}
                                </h3>
                                <div className="flex items-center gap-6 text-sm font-bold text-gray-400 border-b border-gray-50 pb-6 mb-6">
                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary" /> {formData.place || 'Somewhere beautiful'}</span>
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-secondary" /> {formData.startDate || 'Soon'}</span>
                                </div>

                                <div className="space-y-4">
                                    <p className="section-label !text-secondary !mb-4">Why this matters</p>
                                    <div className="bg-primary/30 p-4 rounded-2xl border border-secondary/10">
                                        <p className="text-sm font-medium italic text-gray-500 line-clamp-2">
                                            "{formData.description || "Every trip starts with a single dream. This voyage is your canvas to paint memories that last a lifetime."}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Suggestion Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {suggestions.slice(0, 4).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.05 }}
                                className="relative h-40 rounded-3xl overflow-hidden cursor-pointer group shadow-sm"
                            >
                                <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
                                <div className="absolute bottom-4 left-4">
                                    <p className="text-white text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{item.mood}</p>
                                    <p className="text-white font-bold text-xs">{item.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Modern AI Generating Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [1, 0.5, 1],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="w-32 h-32 rounded-full border-2 border-secondary/20"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe2 className="w-12 h-12 text-secondary animate-pulse" />
                            </div>

                            {/* Spinning Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-0 w-32 h-32 rounded-full border-t-2 border-secondary"
                            />
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 space-y-4"
                        >
                            <h2 className="text-4xl font-black italic tracking-tighter text-dark">Weaving your itinerary...</h2>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-secondary font-black uppercase text-[10px] tracking-[0.3em]">AI Tailoring Active</p>
                                <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                        className="w-full h-full bg-secondary"
                                    />
                                </div>
                            </div>
                            <p className="text-gray-400 font-medium max-w-xs mx-auto text-sm mt-4 italic">
                                "{travelQuotes[Math.floor(Math.random() * travelQuotes.length)]}"
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreateTrip;
