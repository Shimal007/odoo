import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <header className="flex justify-between items-center px-8 py-5 border-b border-[#E6DCCF]/50 bg-white/70 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-sm">
            <h1 className="text-3xl font-['Playfair_Display'] font-bold tracking-tight text-[#5D4037] cursor-pointer" onClick={() => navigate('/')}>
                GlobalTrotter<span className="text-[#A68A64]">.</span>
            </h1>

            <div className="flex items-center gap-8">
                <button
                    onClick={() => navigate('/')}
                    className="text-[#5D4037] hover:text-[#A68A64] font-medium transition text-base relative group"
                >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A68A64] transition-all group-hover:w-full"></span>
                </button>
               
            </div>
        </header>
    );
};

export default Navbar;
