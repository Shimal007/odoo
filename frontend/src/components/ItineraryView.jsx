import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    MapPin,
    Clock,
    DollarSign,
    List,
    LayoutGrid,
    ChevronLeft,
    Share2,
    Download,
    CheckCircle2,
    Navigation2,
    Coffee,
    Sun,
    Moon,
    Plane
} from 'lucide-react';

const ItineraryView = () => {
    const { tripId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

    const trip = location.state?.trip || {
        tripName: 'Paris Luxury Getaway',
        destination: 'Paris',
        startDate: '2024-01-10',
        endDate: '2024-01-15'
    };

    // Mock data for the itinerary view
    const days = [
        {
            day: 1,
            date: 'Jan 10, 2024',
            city: 'Paris',
            activities: [
                { time: '10:00 AM', title: 'Arrival & Hotel Transfer', cost: 50, icon: <Plane className="w-4 h-4" /> },
                { time: '02:00 PM', title: 'Check-in at Le Bristol', cost: 0, icon: <LayoutGrid className="w-4 h-4" /> },
                { time: '07:00 PM', title: 'Seine River Dinner Cruise', cost: 120, icon: <Moon className="w-4 h-4" /> }
            ]
        },
        {
            day: 2,
            date: 'Jan 11, 2024',
            city: 'Paris',
            activities: [
                { time: '09:00 AM', title: 'Private Louvre Gallery Tour', cost: 80, icon: <Sun className="w-4 h-4" /> },
                { time: '01:00 PM', title: 'Lunch at Parisian Café', cost: 40, icon: <Coffee className="w-4 h-4" /> },
                { time: '04:00 PM', title: 'Eiffel Tower Access', cost: 30, icon: <MapPin className="w-4 h-4" /> }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-primary">
            {/* Dynamic Header */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-dark font-bold text-sm transition-all group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Edit Plan
                    </button>

                    <div className="text-center">
                        <h1 className="text-xl font-black text-dark tracking-tighter leading-none">{trip.tripName}</h1>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1">Confirmed Itinerary</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-secondary transition-all">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-secondary transition-all">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

                {/* View Toggle & Summary Header */}
                <section className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-12">
                    <div className="space-y-4 max-w-lg">
                        <div className="flex items-center gap-3">
                            <div className="bg-secondary p-3 rounded-2xl text-white shadow-lg shadow-secondary/30">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-dark tracking-tight">Your Journey is Ready</h2>
                                <p className="text-gray-400 font-bold text-sm">Everything is structured for your perfect escape.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-xs font-black text-secondary bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                                <Clock className="w-4 h-4" /> 6 Days
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black text-orange-400 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                                <DollarSign className="w-4 h-4" /> $1,200 Total
                            </div>
                        </div>
                    </div>

                    {/* View Toggle Switch */}
                    <div className="bg-white p-1.5 rounded-2xl shadow-premium border border-gray-50 flex gap-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all ${viewMode === 'list' ? 'bg-secondary text-white shadow-lg' : 'text-gray-300 hover:text-dark'}`}
                        >
                            <List className="w-4 h-4" /> List View
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all ${viewMode === 'calendar' ? 'bg-secondary text-white shadow-lg' : 'text-gray-300 hover:text-dark'}`}
                        >
                            <Calendar className="w-4 h-4" /> Calendar
                        </button>
                    </div>
                </section>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Itinerary Content */}
                    <div className="lg:col-span-8 space-y-12">
                        <AnimatePresence mode="wait">
                            {viewMode === 'list' ? (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-16"
                                >
                                    {days.map((day, idx) => (
                                        <div key={day.day} className="relative group">
                                            {/* Day Heading */}
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-14 h-14 bg-white rounded-2xl shadow-md border border-gray-50 flex flex-col items-center justify-center">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Day</span>
                                                    <span className="text-xl font-black text-secondary leading-none">{day.day}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-dark tracking-tight">{day.city}</h3>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{day.date}</p>
                                                </div>
                                            </div>

                                            {/* Timeline & Activities */}
                                            <div className="ml-7 border-l-2 border-dashed border-gray-100 pl-11 space-y-6 relative">
                                                {day.activities.map((activity, aIdx) => (
                                                    <motion.div
                                                        key={aIdx}
                                                        whileHover={{ x: 5 }}
                                                        className="relative bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/item hover:shadow-xl hover:shadow-secondary/5 transition-all"
                                                    >
                                                        {/* Indicator dot */}
                                                        <div className="absolute left-[-55px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white bg-secondary shadow-sm" />

                                                        <div className="flex items-center gap-6">
                                                            <div className="text-center sm:w-20">
                                                                <p className="text-xs font-black text-dark leading-none">{activity.time}</p>
                                                                <p className="text-[8px] font-bold text-gray-300 uppercase mt-1">Scheduled</p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                                                                    {activity.icon}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-dark">{activity.title}</h4>
                                                                    <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
                                                                        <Navigation2 className="w-3 h-3 text-secondary" /> 2.4 km from Previous
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl self-start sm:self-auto">
                                                            <span className="text-xs font-black text-gray-400 lowercase">approx.</span>
                                                            <span className="font-black text-secondary tracking-tight">${activity.cost}</span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="calendar"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="bg-white rounded-[3rem] p-10 shadow-premium border border-gray-50 overflow-hidden"
                                >
                                    <div className="grid grid-cols-7 gap-4 mb-8 border-b border-gray-50 pb-6 text-center">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                            <span key={d} className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{d}</span>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 h-96">
                                        {Array.from({ length: 35 }).map((_, i) => (
                                            <div key={i} className={`rounded-2xl border border-gray-50 p-2 flex flex-col justify-between ${i === 9 || i === 10 ? 'bg-secondary/5 border-secondary/20 ring-2 ring-secondary/5' : ''}`}>
                                                <span className={`text-[10px] font-black ${i === 9 || i === 10 ? 'text-secondary' : 'text-gray-200'}`}>{i - 2 > 0 && i - 2 < 31 ? i - 2 : ''}</span>
                                                {(i === 9 || i === 10) && (
                                                    <div className="w-full h-1 bg-secondary rounded-full" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        <p className="text-xs font-bold text-gray-400 italic">Calendar view is currently in Preview mode.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Insights */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-dark rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            {/* Decorative Pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(160,196,161,0.2),transparent)] opacity-50 transition-opacity group-hover:opacity-80" />

                            <div className="relative z-10 space-y-6">
                                <header className="flex justify-between items-start">
                                    <div>
                                        <p className="text-secondary font-black uppercase text-[10px] tracking-widest leading-none mb-1">Destination</p>
                                        <h4 className="text-2xl font-black italic">Trip Map</h4>
                                    </div>
                                    <LayoutGrid className="text-secondary w-6 h-6" />
                                </header>

                                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-4 group/map cursor-pointer transition-all hover:bg-white/10">
                                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center text-secondary border border-secondary/20 group-hover/map:scale-110 transition-transform">
                                        <MapPin className="w-8 h-8" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 group-hover/map:text-white">Load Interactive Map</p>
                                </div>

                                <button className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-xs shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all active:scale-95">
                                    Get Directions
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-gray-50 space-y-6">
                            <h4 className="section-label">Travel Tips</h4>
                            <div className="space-y-4">
                                <div className="flex gap-4 p-4 rounded-2xl bg-primary/50 border border-secondary/10">
                                    <Coffee className="text-secondary w-5 h-5 flex-shrink-0" />
                                    <p className="text-xs font-medium text-gray-500 leading-relaxed">Early morning is best for Louvre photos. Wear comfortable walking shoes!</p>
                                </div>
                                <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <Plane className="text-blue-400 w-5 h-5 flex-shrink-0" />
                                    <p className="text-xs font-medium text-gray-500 leading-relaxed">Flight DL45 is on time. Terminal 2E at CDG Airport.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ItineraryView;