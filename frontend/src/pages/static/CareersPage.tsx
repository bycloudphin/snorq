import { Link } from 'react-router-dom';
import { MessageSquare, MapPin, Briefcase, Heart, Coffee, Zap, Users } from 'lucide-react';

const openPositions = [
    {
        title: 'Senior Full-Stack Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
    },
    {
        title: 'Product Designer',
        department: 'Design',
        location: 'Remote',
        type: 'Full-time',
    },
    {
        title: 'Customer Success Manager',
        department: 'Customer Support',
        location: 'Remote',
        type: 'Full-time',
    },
];

const perks = [
    { icon: <Coffee className="w-5 h-5" />, title: 'Flexible Hours', description: 'Work when you\'re most productive' },
    { icon: <MapPin className="w-5 h-5" />, title: '100% Remote', description: 'Work from anywhere in the world' },
    { icon: <Heart className="w-5 h-5" />, title: 'Health & Wellness', description: 'Comprehensive health benefits' },
    { icon: <Zap className="w-5 h-5" />, title: 'Learning Budget', description: '$1,000/year for professional growth' },
    { icon: <Users className="w-5 h-5" />, title: 'Team Retreats', description: 'Annual company gatherings' },
    { icon: <Briefcase className="w-5 h-5" />, title: 'Equity Options', description: 'Own a piece of what you build' },
];

export function CareersPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">SNORQ</span>
                    </Link>
                    <Link to="/login" className="btn-primary text-sm px-4 py-2">
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="py-20 px-6 bg-gradient-to-b from-green-50 to-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Join the <span className="text-green-500">SNORQ</span> Team
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Help us build the future of business messaging. We're looking for passionate people who want to make a difference.
                    </p>
                </div>
            </section>

            {/* Perks */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why Work With Us</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {perks.map((perk, index) => (
                            <div key={index} className="p-6 rounded-2xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                    {perk.icon}
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1">{perk.title}</h3>
                                <p className="text-sm text-slate-600">{perk.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Open Positions</h2>

                    {openPositions.length > 0 ? (
                        <div className="space-y-4">
                            {openPositions.map((position, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-900 text-lg">{position.title}</h3>
                                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                {position.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {position.location}
                                            </span>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                                {position.type}
                                            </span>
                                        </div>
                                    </div>
                                    <Link to="/contact" className="btn-primary text-sm px-4 py-2 whitespace-nowrap">
                                        Apply Now
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-white rounded-2xl border border-slate-100">
                            <p className="text-slate-600 mb-4">No open positions at the moment.</p>
                            <p className="text-sm text-slate-500">
                                Check back soon or send your resume to{' '}
                                <a href="mailto:careers@snorq.xyz" className="text-green-600 hover:underline">
                                    careers@snorq.xyz
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Don't see the right role?
                    </h2>
                    <p className="text-slate-600 mb-6">
                        We're always looking for talented people. Send us your resume and we'll reach out when we have a match.
                    </p>
                    <a href="mailto:careers@snorq.xyz" className="btn-secondary inline-flex items-center gap-2">
                        Send Your Resume
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-slate-900" />
                            </div>
                            <span className="font-bold text-white">SNORQ</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link to="/about" className="hover:text-white transition-colors">About</Link>
                            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                            <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
                            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        </div>
                        <div className="text-sm">
                            © {new Date().getFullYear()} SNORQ. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
