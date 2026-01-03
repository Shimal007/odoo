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
    ArrowLeft
} from 'lucide-react';

const BuildItinerary = () => {
    const { tripId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Initial State
    const initialTrip = location.state?.trip || {
        tripName: 'Paris Escape',
        destination: 'Paris',
        startDate: '2024-01-10',
        endDate: '2024-01-15'
    };

    const [stops, setStops] = useState([
        {
            id: 'stop-1',
            title: 'Arrival & City Walk',
            description: 'Check-in at the boutique hotel and a sunset walk near the Eiffel Tower.',
            startDate: '2024-01-10',
            endDate: '2024-01-10',
            budget: 200,
            type: 'city',
            activities: ['Hotel Check-in', 'Eiffel Tower Sunset']
        },
        {
            id: 'stop-2',
            title: 'Louvre & Art District',
            description: 'A deep dive into history and art at the Louvre museum followed by Montmartre.',
            startDate: '2024-01-11',
            endDate: '2024-01-11',
            budget: 150,
            type: 'activity',
            activities: ['Louvre Tour', 'Montmartre Walk', 'Macaron Workshop']
        }
    ]);

    const addStop = () => {
        const newStop = {
            id: `stop-${Date.now()}`,
            title: 'New Stop',
            description: 'Add your activities and plans here...',
            startDate: initialTrip.startDate,
            endDate: initialTrip.startDate,
            budget: 100,
            type: 'city',
            activities: []
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
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-dark leading-none">{initialTrip.tripName}</h1>
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1">Multi-City Planner</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Budget</p>
                            <p className="text-xl font-black text-secondary">${totalBudget}</p>
                        </div>
                        <button className="bg-dark text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">
                            Finalize Trip
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-12 flex justify-between items-end">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-dark tracking-tighter italic flex items-center gap-3">
                            Your Itinerary
                            <TrendingUp className="text-secondary w-8 h-8" />
                        </h2>
                        <p className="text-gray-400 font-bold ml-1">Drag to reorder your stops or add new experiences.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-50 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-secondary" />
                            <span className="text-xs font-black">6 Days</span>
                        </div>
                    </div>
                </header>

                {/* Reorderable Stop Sections */}
                <Reorder.Group
                    values={stops}
                    onReorder={setStops}
                    className="space-y-6 relative"
                >
                    {/* Vertical Timeline Path (Unique Feature) */}
                    <div className="absolute left-[34px] top-10 bottom-10 w-1 bg-gradient-to-b from-secondary/20 via-secondary/10 to-transparent rounded-full -z-10 hidden sm:block"></div>

                    <AnimatePresence mode="popLayout">
                        {stops.map((stop, index) => (
                            <Reorder.Item
                                key={stop.id}
                                value={stop}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative group"
                            >
                                <div className="glass-card rounded-[2.5rem] p-8 flex gap-6 border-white/40 ring-1 ring-black/5 hover:ring-secondary/20 transition-all duration-300">

                                    {/* Reorder Handle & Stop Type Icon */}
                                    <div className="flex flex-col items-center gap-4 pt-1">
                                        <GripVertical className="text-gray-200 cursor-grab active:cursor-grabbing hover:text-gray-400 transition-colors" />
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 ${stop.type === 'travel' ? 'bg-blue-500 text-white shadow-blue-500/20' :
                                                stop.type === 'hotel' ? 'bg-orange-500 text-white shadow-orange-500/20' :
                                                    'bg-secondary text-white shadow-secondary/20'
                                            }`}>
                                            {stop.type === 'travel' ? <Plane className="w-6 h-6" /> :
                                                stop.type === 'hotel' ? <Hotel className="w-6 h-6" /> :
                                                    <MapPin className="w-6 h-6" />}
                                        </div>
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2 bg-gray-50 px-2 py-1 rounded-md">
                                            Stop {index + 1}
                                        </div>
                                    </div>

                                    {/* Stop Content */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1 flex-1">
                                                <input
                                                    type="text"
                                                    value={stop.title}
                                                    onChange={(e) => updateStop(stop.id, 'title', e.target.value)}
                                                    className="text-2xl font-black text-dark bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-gray-200"
                                                />
                                                <textarea
                                                    value={stop.description}
                                                    onChange={(e) => updateStop(stop.id, 'description', e.target.value)}
                                                    className="text-sm font-medium text-gray-400 bg-transparent border-none focus:ring-0 p-0 w-full resize-none h-12 overflow-hidden italic"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeStop(stop.id)}
                                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Date Range Picker Style */}
                                            <div className="bg-white/50 border border-gray-100/50 rounded-2xl p-4 flex items-center justify-between group/field hover:bg-white transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-4 h-4 text-secondary" />
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Date Range</p>
                                                        <div className="flex items-center gap-1 font-bold text-xs text-dark">
                                                            <input
                                                                type="text"
                                                                value={stop.startDate}
                                                                onChange={(e) => updateStop(stop.id, 'startDate', e.target.value)}
                                                                className="bg-transparent border-none p-0 w-20 focus:ring-0 text-xs font-bold"
                                                            />
                                                            <span className="text-gray-300 italic">to</span>
                                                            <input
                                                                type="text"
                                                                value={stop.endDate}
                                                                onChange={(e) => updateStop(stop.id, 'endDate', e.target.value)}
                                                                className="bg-transparent border-none p-0 w-20 focus:ring-0 text-xs font-bold"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Budget Field Style */}
                                            <div className="bg-white/50 border border-gray-100/50 rounded-2xl p-4 flex items-center justify-between group/field hover:bg-white transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <DollarSign className="w-4 h-4 text-orange-400" />
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Stop Budget</p>
                                                        <div className="flex items-center">
                                                            <span className="text-dark font-black text-xs">$</span>
                                                            <input
                                                                type="number"
                                                                value={stop.budget}
                                                                onChange={(e) => updateStop(stop.id, 'budget', e.target.value)}
                                                                className="bg-transparent border-none p-0 w-20 focus:ring-0 text-xs font-black"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activities Mini-Tags (Unique Feature) */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {stop.activities.map((act, i) => (
                                                <div key={i} className="flex items-center gap-2 bg-secondary/5 border border-secondary/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-secondary capitalize group/act hover:bg-secondary hover:text-white transition-all cursor-default">
                                                    {act}
                                                    <button className="opacity-0 group-hover/act:opacity-100 transition-opacity">
                                                        <Plus className="w-3 h-3 rotate-45" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-400 hover:bg-gray-100 hover:text-dark transition-all uppercase border border-dashed border-gray-200">
                                                <Plus className="w-3 h-3" /> Add Activity
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Reorder.Item>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>

                {/* Add Another Section Button */}
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addStop}
                    className="w-full mt-10 py-10 rounded-[2.5rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 hover:border-secondary/20 hover:text-secondary hover:bg-secondary/5 transition-all duration-300 space-y-3 shadow-sm hover:shadow-xl shadow-gray-200/50"
                >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-200 shadow-md transform group-hover:rotate-12">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="text-xl font-black italic tracking-tight">Add another Stop to your Journey</span>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 opacity-60">Multi-city planning enabled</p>
                </motion.button>

                {/* Quick Tips / AI Insight (Extra Uniqueness) */}
                <div className="mt-20 p-8 glass-card rounded-[3rem] border-orange-100 bg-orange-50/20">
                    <div className="flex items-center gap-3 mb-4">
                        <Camera className="text-orange-400 w-5 h-5" />
                        <h4 className="font-extrabold text-dark tracking-tight">Travel Insights</h4>
                    </div>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                        "Based on your 5-day stop in Paris, we recommend visiting the **Sacré-Cœur** at dawn for the best photography light. Your current budget is well-balanced for local experiences!"
                    </p>
                </div>

                {/* Footer Navigation */}
                <div className="mt-12 flex justify-end">
                    <button className="flex items-center gap-3 group">
                        <span className="text-gray-400 font-bold group-hover:text-dark transition-colors">See Full Overview</span>
                        <div className="bg-white p-3 rounded-full shadow-lg group-hover:translate-x-1 transition-transform border border-gray-50">
                            <ChevronRight className="w-5 h-5 text-secondary" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuildItinerary;
