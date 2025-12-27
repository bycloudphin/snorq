import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Menu, X, ChevronDown } from 'lucide-react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">SNORQ</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium cursor-pointer">
                            Product
                            <ChevronDown className="w-4 h-4" />
                        </div>
                        <a href="/#features" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                            Features
                        </a>
                        <a href="/#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                            How it Works
                        </a>
                        <a href="/#platforms" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                            Platforms
                        </a>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login" className="btn btn-ghost text-sm font-medium text-slate-600 hover:text-slate-900">
                            Sign In
                        </Link>
                        <Link to="/register" className="btn btn-outline rounded-full px-5 py-2.5">
                            Get Notified
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pt-4 pb-6 space-y-4 border-t border-slate-100 mt-4">
                        <a href="/#features" className="block text-slate-600 hover:text-slate-900 py-2">Features</a>
                        <a href="/#how-it-works" className="block text-slate-600 hover:text-slate-900 py-2">How it Works</a>
                        <a href="/#platforms" className="block text-slate-600 hover:text-slate-900 py-2">Platforms</a>
                        <div className="flex gap-4 pt-4 border-t border-slate-100">
                            <Link to="/login" className="flex-1 btn btn-ghost text-center">Sign In</Link>
                            <Link to="/register" className="flex-1 btn btn-outline rounded-full text-center">Get Notified</Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
