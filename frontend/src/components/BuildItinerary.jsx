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
    ChevronRight,
    TrendingUp,
    Clock,
    ArrowLeft,
    LayoutGrid,
    Sparkles
} from 'lucide-react';

const BuildItinerary = () => {
    const { tripId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const tripDetails = location.state?.trip || {
        tripName: 'Paris Adventure',
        destination: 'Paris',
        startDate: '2024-01-10',
        endDate: '2024-01-15'
    };

    const [stops, setStops] = useState([]);

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

    // Finalize navigation logic
    const handleFinalize = () => {
        navigate(`/view-itinerary/${tripId}`, { state: { trip: tripDetails } });
    };

    const totalBudget = stops.reduce((sum, stop) => sum + Number(stop.budget), 0);

    return (
        <div className="min-h-screen bg-primary">
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/create-trip')} className="flex items-center gap-2 text-gray-400 hover:text-dark font-bold text-sm transition-all group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
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
                        <button
                            onClick={handleFinalize}
                            className="bg-dark text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
                        >
                            Finalize & View
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-12">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-dark tracking-tighter italic flex items-center gap-3">
                            Build your Journey
                            <TrendingUp className="text-secondary w-8 h-8" />
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-50 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span className="text-xs font-black">{tripDetails.destination}</span>
                        </div>
                    </div>
                </header>

                <div className="min-h-[400px]">
                    {stops.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/40 border-4 border-dashed border-gray-100 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                <LayoutGrid className="w-10 h-10" />
                            </div>
                            <h4 className="text-2xl font-black text-dark">Start with a blank canvas</h4>
                            <button
                                onClick={() => addStop()}
                                className="px-10 py-4 bg-secondary text-white rounded-2xl font-black shadow-lg"
                            >
                                Start Building
                            </button>
                        </motion.div>
                    ) : (
                        <Reorder.Group values={stops} onReorder={setStops} className="space-y-8">
                            <AnimatePresence mode="popLayout">
                                {stops.map((stop, index) => (
                                    <Reorder.Item key={stop.id} value={stop} className="relative">
                                        <div className="glass-card rounded-[2.5rem] p-8 flex flex-col sm:flex-row gap-6">
                                            <div className="flex flex-row sm:flex-col items-center gap-4">
                                                <GripVertical className="text-gray-200 cursor-grab active:cursor-grabbing md:block hidden" />
                                                <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-black shadow-lg">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <input
                                                        type="text"
                                                        value={stop.title}
                                                        onChange={(e) => updateStop(stop.id, 'title', e.target.value)}
                                                        className="text-2xl font-black text-dark bg-transparent border-none focus:ring-0 p-0 w-full"
                                                    />
                                                    <button onClick={() => removeStop(stop.id)} className="p-2 text-gray-200 hover:text-red-400 rounded-xl transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-white/50 border border-gray-100/50 rounded-2xl p-4 flex gap-3 items-center">
                                                        <Calendar className="w-4 h-4 text-secondary" />
                                                        <div className="flex items-center gap-1 font-bold text-xs">
                                                            <input type="text" value={stop.startDate} onChange={(e) => updateStop(stop.id, 'startDate', e.target.value)} className="w-20 bg-transparent border-none p-0 focus:ring-0" />
                                                            <span className="text-gray-300">to</span>
                                                            <input type="text" value={stop.endDate} onChange={(e) => updateStop(stop.id, 'endDate', e.target.value)} className="w-20 bg-transparent border-none p-0 focus:ring-0" />
                                                        </div>
                                                    </div>
                                                    <div className="bg-white/50 border border-gray-100/50 rounded-2xl p-4 flex gap-3 items-center">
                                                        <DollarSign className="w-4 h-4 text-orange-400" />
                                                        <div className="flex items-center gap-1 font-black text-xs">
                                                            <span>$</span>
                                                            <input type="number" value={stop.budget} onChange={(e) => updateStop(stop.id, 'budget', e.target.value)} className="w-20 bg-transparent border-none p-0 focus:ring-0" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>
                            <button
                                onClick={() => addStop()}
                                className="w-full py-6 border-2 border-dashed border-gray-100 rounded-[2rem] text-gray-300 font-black italic hover:bg-secondary/5 hover:text-secondary transition-all"
                            >
                                + Add Another Section
                            </button>
                        </Reorder.Group>
                    )}
                </div>

                <section className="mt-20 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="section-label !mb-0">Suggested for {tripDetails.destination}</h3>
                        <Sparkles className="text-secondary w-4 h-4 animate-pulse" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                        {['Louvre Museum', 'Eiffel Tower', 'Seine Cruise', 'Montmartre'].map(name => (
                            <button
                                key={name}
                                onClick={() => addStop(name, `Exploring ${name} in ${tripDetails.destination}.`)}
                                className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4 hover:shadow-xl transition-all"
                            >
                                <Plus className="w-4 h-4 text-secondary" />
                                <span className="font-bold text-sm text-dark whitespace-nowrap">{name}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BuildItinerary;