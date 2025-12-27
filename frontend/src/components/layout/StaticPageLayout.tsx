import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Menu, X } from 'lucide-react';

interface StaticPageLayoutProps {
    children: ReactNode;
}

export function StaticPageLayout({ children }: StaticPageLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header - Same as Landing Page */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto max-w-6xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">SNORQ</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="/#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Features
                            </a>
                            <a href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                How it Works
                            </a>
                            <a href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Pricing
                            </a>
                            <Link to="/blog" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Blog
                            </Link>
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn-primary text-sm px-4 py-2">
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-slate-100 pt-4">
                            <nav className="flex flex-col gap-4">
                                <a href="/#features" className="text-sm font-medium text-slate-600">Features</a>
                                <a href="/#how-it-works" className="text-sm font-medium text-slate-600">How it Works</a>
                                <a href="/#pricing" className="text-sm font-medium text-slate-600">Pricing</a>
                                <Link to="/blog" className="text-sm font-medium text-slate-600">Blog</Link>
                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <Link to="/login" className="flex-1 btn-secondary text-center text-sm py-2">Sign In</Link>
                                    <Link to="/register" className="flex-1 btn-primary text-center text-sm py-2">Get Started</Link>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer - Same as Landing Page */}
            <footer className="bg-slate-50 border-t border-slate-100 py-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                        {/* Logo & Description */}
                        <div className="col-span-2">
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">SNORQ</span>
                            </Link>
                            <p className="text-sm text-slate-500 max-w-xs">
                                Unify your customer conversations from TikTok, WhatsApp, and Messenger in one beautiful inbox.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="/#features" className="text-slate-500 hover:text-slate-900 transition-colors">Features</a></li>
                                <li><a href="/#pricing" className="text-slate-500 hover:text-slate-900 transition-colors">Pricing</a></li>
                                <li><a href="/#platforms" className="text-slate-500 hover:text-slate-900 transition-colors">Integrations</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/about" className="text-slate-500 hover:text-slate-900 transition-colors">About</Link></li>
                                <li><Link to="/blog" className="text-slate-500 hover:text-slate-900 transition-colors">Blog</Link></li>
                                <li><Link to="/careers" className="text-slate-500 hover:text-slate-900 transition-colors">Careers</Link></li>
                                <li><Link to="/contact" className="text-slate-500 hover:text-slate-900 transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/privacy" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                                <li><Link to="/security" className="text-slate-500 hover:text-slate-900 transition-colors">Security</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} SNORQ. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
