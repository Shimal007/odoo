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
import suggestion1 from '../assets/suggestion1.png';
import suggestion2 from '../assets/suggestion2.png';
import suggestion3 from '../assets/suggestion3.png';
import suggestion4 from '../assets/suggestion4.png';
import suggestion5 from '../assets/suggestion5.png';
import suggestion6 from '../assets/suggestion6.png';

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
        <div className="min-h-screen bg-[#FDF8F5] px-4 py-8 md:px-8 font-['DM_Sans'] text-[#5D4037]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Left Side: Creative Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7 space-y-8"
                >
                    <header className="space-y-2">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 5 }}
                                className="bg-[#A68A64] p-3 rounded-2xl shadow-lg shadow-[#A68A64]/20"
                            >
                                <Wind className="text-white w-6 h-6" />
                            </motion.div>
                            <h1 className="text-3xl font-['Playfair_Display'] font-black text-[#5D4037] tracking-tight">GlobalTrotter</h1>
                        </div>
                        <p className="text-[#8D7F71] font-medium ml-1">Begin your next chapter of exploration</p>
                    </header>

                    <section className="bg-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-xl border border-[#E6DCCF]/50">
                        {/* Background Decorative Element */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#A68A64]/5 rounded-full blur-3xl"></div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-['Playfair_Display'] font-bold flex items-center gap-2 text-[#5D4037]">
                                    <Sparkles className="text-[#A68A64] w-5 h-5" />
                                    Trip Blueprint
                                </h2>
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-[#A68A64]' : 'bg-[#E6DCCF]'}`} />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#5D4037] mb-2 ml-1">What should we call this journey?</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('name')}
                                        placeholder="e.g. My Dream Paris Escape"
                                        className="w-full bg-[#FDF8F5] border-2 border-transparent focus:border-[#A68A64]/30 rounded-xl px-5 py-4 text-[#5D4037] placeholder-[#B0A69D] outline-none transition-all font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#5D4037] mb-2 ml-1">Departure</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A68A64] w-5 h-5 pointer-events-none" />
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="w-full bg-[#FDF8F5] border-2 border-transparent focus:border-[#A68A64]/30 rounded-xl pl-12 pr-4 py-4 text-[#5D4037] outline-none transition-all font-medium appearance-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#5D4037] mb-2 ml-1">Return</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A68A64] w-5 h-5 pointer-events-none" />
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="w-full bg-[#FDF8F5] border-2 border-transparent focus:border-[#A68A64]/30 rounded-xl pl-12 pr-4 py-4 text-[#5D4037] outline-none transition-all font-medium appearance-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#5D4037] mb-2 ml-1">Select Your Compass</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A68A64] w-5 h-5 pointer-events-none" />
                                        <select
                                            name="place"
                                            value={formData.place}
                                            onChange={handleChange}
                                            className="w-full bg-[#FDF8F5] border-2 border-transparent focus:border-[#A68A64]/30 rounded-xl pl-12 pr-4 py-4 text-[#5D4037] outline-none transition-all font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="">Search destination...</option>
                                            <option value="Paris">Paris, France</option>
                                            <option value="Bali">Bali, Indonesia</option>
                                            <option value="Tokyo">Tokyo, Japan</option>
                                            <option value="Rome">Rome, Italy</option>
                                            <option value="Santorini">Santorini, Greece</option>
                                            <option value="New York">New York, USA</option>
                                            <option value="Dubai">Dubai, UAE</option>
                                            <option value="Kyoto">Kyoto, Japan</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#5D4037] mb-2 ml-1">Trip Style</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Relaxed', 'Adventurous', 'Cultural', 'Luxury'].map(style => (
                                            <button
                                                key={style}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, style }))}
                                                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 border-2 ${formData.style === style
                                                        ? 'bg-[#A68A64] border-[#A68A64] text-white shadow-lg shadow-[#A68A64]/25 scale-105'
                                                        : 'bg-white border-[#E6DCCF] text-[#8D7F71] hover:border-[#A68A64] hover:text-[#A68A64]'
                                                    }`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#5D4037] mb-2 ml-1">Tell the story before it starts</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Briefly describe your vision for this trip..."
                                        className="w-full bg-[#FDF8F5] border-2 border-transparent focus:border-[#A68A64]/30 rounded-xl px-5 py-4 text-[#5D4037] placeholder-[#B0A69D] outline-none transition-all font-medium resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-[#E6DCCF]/50 flex items-center justify-between">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-[#E6DCCF] flex items-center justify-center font-bold text-[10px] text-[#5D4037] shadow-sm">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#5D4037] flex items-center justify-center font-bold text-[10px] text-white shadow-sm">
                                        +12
                                    </div>
                                </div>
                                <button
                                    onClick={handleNext}
                                    disabled={!formData.name || !formData.place}
                                    className="px-8 py-4 bg-[#5D4037] text-white rounded-xl font-bold text-base shadow-xl shadow-[#5D4037]/20 hover:bg-[#4A322C] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-2"
                                >
                                    Create Journey
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </section>
                </motion.div>

                {/* Right Side: Professional Live Preview & Info */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 space-y-8 lg:sticky lg:top-8"
                >
                    {/* Live Preview Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#A68A64]/20 to-[#E6DCCF] rounded-[3rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative bg-white rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-[#E6DCCF]">
                            <div className="h-56 bg-gray-100 relative overflow-hidden">
                                <img
                                    src={formData.place === 'Paris' ? suggestion2 : formData.place === 'Bali' ? suggestion3 : formData.place === 'Tokyo' ? suggestion6 : suggestion1}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm text-[#5D4037]">
                                        <PlaneTakeoff className="w-3 h-3" /> Flight Booked
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 -mt-16 relative z-10 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-[#A68A64] font-black uppercase text-[10px] tracking-widest">{formData.style} Journey</p>
                                    <Heart className="text-red-400 w-5 h-5 fill-red-400/10" />
                                </div>
                                <h3 className="text-3xl font-['Playfair_Display'] font-black text-[#5D4037] mb-4 leading-tight">
                                    {formData.name || "Predicting your Next Adventure..."}
                                </h3>
                                <div className="flex items-center gap-6 text-sm font-bold text-[#8D7F71] border-b border-[#E6DCCF] pb-6 mb-6">
                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#A68A64]" /> {formData.place || 'Somewhere beautiful'}</span>
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#A68A64]" /> {formData.startDate || 'Soon'}</span>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-black uppercase tracking-widest text-[#A68A64]">Why this matters</p>
                                    <div className="bg-[#FDF8F5] p-5 rounded-2xl border border-[#E6DCCF]">
                                        <p className="text-sm font-medium italic text-[#5D4037]/80 line-clamp-3 leading-relaxed">
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
                                whileHover={{ scale: 1.03 }}
                                onClick={() => setFormData(prev => ({ ...prev, place: item.id === 2 ? 'Paris' : item.id === 3 ? 'Bali' : item.id === 6 ? 'Tokyo' : prev.place }))}
                                className="relative h-32 rounded-3xl overflow-hidden cursor-pointer group shadow-md"
                            >
                                <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all"></div>
                                <div className="absolute bottom-4 left-4">
                                    <p className="text-white/80 text-[9px] font-black uppercase tracking-widest mb-0.5">{item.mood}</p>
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
                        className="fixed inset-0 z-50 bg-[#FDF8F5]/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [1, 0.8, 1],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="w-32 h-32 rounded-full border-2 border-[#A68A64]/20"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe2 className="w-12 h-12 text-[#A68A64] animate-pulse" />
                            </div>

                            {/* Spinning Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-0 w-32 h-32 rounded-full border-t-2 border-[#A68A64]"
                            />
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 space-y-4"
                        >
                            <h2 className="text-4xl font-['Playfair_Display'] font-bold text-[#5D4037]">Weaving your itinerary...</h2>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-[#A68A64] font-black uppercase text-[10px] tracking-[0.3em]">AI Tailoring Active</p>
                                <div className="w-48 h-1 bg-[#E6DCCF] rounded-full overflow-hidden mt-2">
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                        className="w-full h-full bg-[#A68A64]"
                                    />
                                </div>
                            </div>
                            <p className="text-[#8D7F71] font-medium max-w-xs mx-auto text-sm mt-4 italic">
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