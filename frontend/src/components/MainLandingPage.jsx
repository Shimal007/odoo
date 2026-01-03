import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, Plus, User, MapPin, Globe, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

const MainLandingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Simulate loading effect
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // State for search and filtering
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    // Mock data with descriptions
    const regions = [
        {
            name: "Napa Valley",
            image: "https://plus.unsplash.com/premium_photo-1661935429798-37eaa222de28?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TmFwYSUyMHZhbGxleXxlbnwwfHwwfHx8MA%3D%3D",
            description: "Experience world-class vineyards and luxury wine tastings in the heart of California."
        },
        {
            name: "Sonoma",
            image: "https://images.unsplash.com/photo-1621528080981-61ae45dd2b71?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29ub21hfGVufDB8fDB8fHww",
            description: "A rustic yet refined escape featuring rolling hills and artisanal culinary delights."
        },
        {
            name: "Paris",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
            description: "The City of Light awaits with iconic landmarks, art, and timeless romance."
        },
        {
            name: "Tuscany",
            image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHVzY2FueXxlbnwwfHwwfHx8MA%3D%3D",
            description: "Discover rolling countryside, Renaissance art, and exquisite Italian cuisine."
        },
        {
            name: "Kyoto",
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
            description: "Immerse yourself in ancient temples, traditional tea houses, and sublime gardens."
        },
        {
            name: "Santorini",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600&auto=format&fit=crop",
            description: "Breathtaking sunsets and white-washed architecture overlooking the Aegean Sea."
        },
    ];

    const previousTrips = [
        { title: "Summer in Italy", dates: "Jun 2024", image: "https://images.unsplash.com/photo-1521743603402-45e3c79a2958?q=80&w=600&auto=format&fit=crop" },
        { title: "Tokyo Adventure", dates: "Mar 2023", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop" },
        { title: "Bali Escape", dates: "Dec 2022", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop" },
    ];

    // Filtered Regions Logic
    const filteredRegions = regions.filter(region =>
        region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        region.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 50 }
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-[#FDF8F5] flex flex-col items-center justify-center z-50">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    className="flex flex-col items-center"
                >
                    <Globe size={64} className="text-[#5D4037] mb-4" strokeWidth={1.5} />
                    <h2 className="text-2xl font-serif text-[#5D4037] tracking-widest">GLOBETROTTER</h2>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDF8F5] text-[#4A3B32] font-['DM_Sans'] selection:bg-[#A68A64] selection:text-white overflow-x-hidden">
            <Navbar />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-6 py-8 space-y-16"
            >

                {/* Banner Section */}
                <motion.section variants={itemVariants} className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"
                        alt="Travel Banner"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[700ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-center text-center p-6">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <h2 className="text-white text-5xl md:text-7xl font-['Playfair_Display'] font-bold tracking-wider mb-4 drop-shadow-lg">
                                Discover Luxury
                            </h2>
                            <p className="text-white/90 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
                                Curate your perfect journey with our premium itinerary planner.
                            </p>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Search & Filter */}
                <motion.section variants={itemVariants} className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-24 z-30 bg-[#FDF8F5]/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-[#E6DCCF]/50">
                    <div className="relative w-full md:max-w-xl group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-[#A68A64] group-focus-within:text-[#5D4037] transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search destinations (e.g., 'Kyoto', 'Paris')"
                            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white border-2 border-transparent shadow-sm hover:shadow-md focus:shadow-lg focus:border-[#D4C3AA] focus:outline-none transition-all duration-300 placeholder-[#B0A69D]"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-3 flex items-center text-[#A68A64] hover:text-[#5D4037] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 font-medium">
                        {['Filter', 'Group By', 'Sort'].map((label, idx) => (
                            <button key={idx} className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4C3AA] text-[#5D4037] hover:bg-[#5D4037] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap bg-white active:scale-95">
                                {label === 'Filter' && <Filter size={16} />}
                                {label === 'Sort' && <SortAsc size={16} />}
                                {label}
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* Top Regional Selections */}
                <motion.section variants={itemVariants}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-3xl font-['Playfair_Display'] font-bold text-[#5D4037] flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#A68A64] rounded-full inline-block"></span>
                            Top Regional Selections
                        </h3>
                        <button className="text-[#A68A64] hover:text-[#5D4037] flex items-center gap-1 font-medium transition cursor-pointer">
                            View All <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x p-1">
                        {filteredRegions.map((region, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="min-w-[280px] md:min-w-[320px] snap-center bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col"
                            >
                                <div className="h-64 w-full overflow-hidden">
                                    <img
                                        src={region.image}
                                        alt={region.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h4 className="text-[#5D4037] font-['Playfair_Display'] text-2xl font-bold mb-3 group-hover:text-[#A68A64] transition-colors">{region.name}</h4>
                                    <p className="text-[#8D7F71] text-sm font-normal leading-relaxed">
                                        {region.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        {filteredRegions.length === 0 && (
                            <div className="w-full text-center py-10 text-[#8D7F71]">
                                No destinations found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Previous Trips Section */}
                <motion.section variants={itemVariants} className="pb-16">
                    <h3 className="text-3xl font-['Playfair_Display'] font-bold text-[#5D4037] mb-8 flex items-center gap-3">
                        <span className="w-2 h-8 bg-[#A68A64] rounded-full inline-block"></span>
                        Your Journeys
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                        {/* Plan a Trip Card (First) */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/create-trip')}
                            className="min-h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-[#EFE6DB] to-[#E6DCCF] border-2 border-dashed border-[#A68A64]/50 rounded-[2rem] cursor-pointer hover:border-[#A68A64] transition-all duration-300 shadow-sm hover:shadow-xl group"
                        >
                            <div className="w-20 h-20 bg-[#5D4037] rounded-full flex items-center justify-center text-white mb-6 shadow-xl group-hover:rotate-90 transition-transform duration-500">
                                <Plus size={40} />
                            </div>
                            <span className="text-xl font-['Playfair_Display'] font-bold text-[#5D4037]">Plan a New Trip</span>
                            <span className="text-[#8D7F71] text-sm mt-2">Start your next adventure</span>
                        </motion.div>



                    </div>
                </motion.section>
            </motion.main>
        </div>
    );
};

export default MainLandingPage;
