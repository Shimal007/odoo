import { Link, useNavigate } from 'react-router-dom';
import { Wind, User, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/create-trip" className="flex items-center gap-3 group">
                    <div className="bg-secondary p-2 rounded-xl shadow-lg shadow-secondary/20 group-hover:rotate-12 transition-transform">
                        <Wind className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-black text-dark tracking-tighter">GlobalTrotter</h1>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-2 hover:text-secondary transition-colors">
                                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                                    {user.first_name?.[0] || 'U'}
                                </div>
                                <span className="hidden md:block font-bold text-sm text-dark">{user.first_name}</span>
                            </Link>
                            <button
                                onClick={() => {
                                    onLogout();
                                    navigate('/create-trip');
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/profile" className="flex items-center gap-2 text-gray-400 hover:text-secondary transition-all">
                            <User className="w-5 h-5" />
                            <span className="font-bold text-sm">Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
