import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
    Plus,
    MapPin,
    Calendar,
    DollarSign,
    GripVertical,
    Trash2,
    Plane,
    Hotel,
    Camera,
    ChevronRight,
    TrendingUp,
    Clock,
    ArrowLeft,
    Sparkles,
    LayoutGrid
} from 'lucide-react';

const BuildItinerary = () => {
    const { tripId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Initial State from navigation
    const tripDetails = location.state?.trip || {
        tripName: 'Paris Adventure',
        destination: 'Paris',
        startDate: '2024-01-10',
        endDate: '2024-01-15'
    };

    // State for itinerary sections (Stops)
    const [stops, setStops] = useState([]);

    // Function to add a stop (Section)
    const addStop = (defaultTitle = 'New Stop', defaultDesc = 'Plan your activities here...') => {
        const newStop = {
            id: `stop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: defaultTitle,
            description: defaultDesc,
            startDate: tripDetails.startDate,
            endDate: tripDetails.startDate,
            budget: 100,
            type: 'activity',
            activities: defaultTitle !== 'New Stop' ? [defaultTitle] : []
        };
        setStops([...stops, newStop]);
    };

    const removeStop = (id) => {
        setStops(stops.filter(stop => stop.id !== id));
    };

    const updateStop = (id, field, value) => {
        setStops(stops.map(stop => stop.id === id ? { ...stop, [field]: value } : stop));
    };

    const totalBudget = stops.reduce((sum, stop) => sum + Number(stop.budget), 0);

    return (
        <div className="min-h-screen bg-primary">
            {/* Premium Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/create-trip')}
                            className="flex items-center gap-2 text-gray-400 hover:text-dark font-bold text-sm transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Blueprint
                        </button>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-dark leading-none">{tripDetails.tripName}</h1>
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1">Multi-City Planner</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Budget</p>
                            <p className="text-lg font-black text-secondary leading-none">${totalBudget}</p>
                        </div>
                        <button className="bg-dark text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all">
                            Save Draft
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-12">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-secondary/10 px-3 py-1 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest border border-secondary/20">
                                Itinerary Phase
                            </div>
                            <span className="text-gray-300 font-bold text-xs uppercase">ID: {tripId}</span>
                        </div>
                        <h2 className="text-4xl font-black text-dark tracking-tighter italic flex items-center gap-3">
                            Build your Journey
                            <TrendingUp className="text-secondary w-8 h-8" />
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-50 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-secondary" />
                            <span className="text-xs font-black">Plan View</span>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-50 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span className="text-xs font-black">{tripDetails.destination}</span>
                        </div>
                    </div>
                </header>

                {/* Main Canvas Area */}
                <div className="min-h-[400px]">
                    {stops.length === 0 ? (
                        /* Empty State (The "Blank Canvas") */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/40 border-4 border-dashed border-gray-100 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 shadow-inner">
                                <LayoutGrid className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black text-dark">Your itinerary is a blank canvas</h4>
                                <p className="text-gray-400 font-medium max-w-sm mx-auto text-sm italic">
                                    "The world is a book and those who do not travel read only one page."
                                </p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => addStop()}
                                    className="px-10 py-4 bg-secondary text-white rounded-2xl font-black shadow-lg shadow-secondary/20 hover:-translate-y-1 transition-all"
                                >
                                    Start Building
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        /* Reorderable Stop Sections */
                        <Reorder.Group
                            values={stops}
                            onReorder={setStops}
                            className="space-y-8 relative"
                        >
                            <div className="absolute left-[34px] top-10 bottom-10 w-1 bg-gradient-to-b from-secondary/20 via-secondary/10 to-transparent rounded-full -z-10 hidden sm:block"></div>

                            <AnimatePresence mode="popLayout">
                                {stops.map((stop, index) => (
                                    <Reorder.Item
                                        key={stop.id}
                                        value={stop}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative"
                                    >
                                        <div className="glass-card rounded-[2.5rem] p-8 flex flex-col sm:flex-row gap-6 border-white/40 ring-1 ring-black/5 hover:ring-secondary/20 transition-all duration-300">

                                            {/* Section Marker */}
                                            <div className="flex flex-row sm:flex-col items-center gap-4">
                                                <GripVertical className="text-gray-200 cursor-grab active:cursor-grabbing hover:text-gray-400 md:block hidden" />
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-secondary text-white shadow-secondary/20 font-black`}>
                                                    {index + 1}
                                                </div>
                                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Section</span>
                                            </div>

                                            <div className="flex-1 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <input
                                                        type="text"
                                                        value={stop.title}
                                                        onChange={(e) => updateStop(stop.id, 'title', e.target.value)}
                                                        className="text-2xl font-black text-dark bg-transparent border-none focus:ring-0 p-0 w-full"
                                                    />
                                                    <button
                                                        onClick={() => removeStop(stop.id)}
                                                        className="p-2 text-gray-200 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <textarea
                                                    value={stop.description}
                                                    onChange={(e) => updateStop(stop.id, 'description', e.target.value)}
                                                    className="w-full bg-transparent border-none text-gray-400 italic text-sm p-0 focus:ring-0 resize-none h-12"
                                                />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-white/50 border border-gray-100/50 rounded-2xl p-4 flex items-center gap-3">
                                                        <Calendar className="w-4 h-4 text-secondary" />
                                                        <div className="flex-1">
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Date Range</p>
                                                            <div className="flex items-center gap-1 font-bold text-xs">
                                                                <input type="text" value={stop.startDate} onChange={(e) => updateStop(stop.id, 'startDate', e.target.value)} className="w-20 bg-transparent border-none p-0 focus:ring-0" />
                                                                <span className="text-gray-300">to</span>
                                                                <input type="text" value={stop.endDate} onChange={(e) => updateStop(stop.id, 'endDate', e.target.value)} className="w-20 bg-transparent border-none p-0 focus:ring-0" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white/50 border border-gray-100/50 rounded-2xl p-4 flex items-center gap-3">
                                                        <DollarSign className="w-4 h-4 text-orange-400" />
                                                        <div className="flex-1">
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Section Budget</p>
                                                            <div className="flex items-center gap-1 font-black text-xs">
                                                                <span>$</span>
                                                                <input type="number" value={stop.budget} onChange={(e) => updateStop(stop.id, 'budget', e.target.value)} className="w-20 bg-transparent border-none p-0 focus:ring-0" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Activity Tags */}
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {stop.activities.map((act, i) => (
                                                        <span key={i} className="bg-secondary/5 text-secondary px-3 py-1.5 rounded-xl text-[10px] font-black border border-secondary/10 capitalize">
                                                            {act}
                                                        </span>
                                                    ))}
                                                    <button className="text-[10px] font-black text-gray-300 uppercase hover:text-secondary transition-colors">+ Add Item</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>

                            {/* Add Button */}
                            <button
                                onClick={() => addStop()}
                                className="w-full py-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex items-center justify-center gap-3 text-gray-300 hover:border-secondary/20 hover:text-secondary hover:bg-secondary/5 transition-all group"
                            >
                                <div className="bg-white rounded-full p-2 shadow-sm group-hover:rotate-90 transition-transform">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="font-black italic">Add another Section</span>
                            </button>
                        </Reorder.Group>
                    )}
                </div>

                {/* Dynamic Suggestion Strip */}
                <section className="mt-20 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="section-label !mb-0">Suggested for your {tripDetails.destination} Journey</h3>
                        <Sparkles className="text-secondary w-4 h-4 animate-pulse" />
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar">
                        {[
                            { name: 'Louvre Museum', color: 'bg-orange-50' },
                            { name: 'Eiffel Tower', color: 'bg-blue-50' },
                            { name: 'Seine River Cruise', color: 'bg-cyan-50' },
                            { name: 'Montmartre Walk', color: 'bg-purple-50' },
                            { name: 'Macaron Workshop', color: 'bg-pink-50' },
                            { name: 'Luxury Stay', color: 'bg-yellow-50' }
                        ].map(item => (
                            <motion.button
                                key={item.name}
                                whileHover={{ y: -5, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => addStop(item.name, `Exploring the wonders of ${item.name} in ${tripDetails.destination}.`)}
                                className="flex-shrink-0 bg-white px-6 py-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4 shadow-gray-200/20 hover:shadow-xl hover:shadow-secondary/10 transition-all text-left group"
                            >
                                <div className={`w-10 h-10 ${item.color} rounded-2xl flex items-center justify-center`}>
                                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-secondary transition-colors" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-dark whitespace-nowrap">{item.name}</p>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-0.5">Add to Plan</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Footer Info */}
                <footer className="mt-20 flex flex-col items-center">
                    <div className="w-16 h-1 bg-gray-100 rounded-full mb-8"></div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Finishing touches for globaltrotter</p>
                </footer>
            </div>
        </div>
    );
};

export default BuildItinerary;
