import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Heart, Coffee, Zap, Users } from 'lucide-react';
import { StaticPageLayout } from '../../components/layout/StaticPageLayout';

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
    { icon: <Coffee className="w-4 h-4" />, title: 'Flexible Hours', description: 'Work when you\'re most productive' },
    { icon: <MapPin className="w-4 h-4" />, title: '100% Remote', description: 'Work from anywhere in the world' },
    { icon: <Heart className="w-4 h-4" />, title: 'Health & Wellness', description: 'Comprehensive health benefits' },
    { icon: <Zap className="w-4 h-4" />, title: 'Learning Budget', description: '$1,000/year for professional growth' },
    { icon: <Users className="w-4 h-4" />, title: 'Team Retreats', description: 'Annual company gatherings' },
    { icon: <Briefcase className="w-4 h-4" />, title: 'Equity Options', description: 'Own a piece of what you build' },
];

export function CareersPage() {
    return (
        <StaticPageLayout>
            {/* Hero */}
            <section className="py-16 px-6 bg-gradient-to-b from-green-50 to-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Join the <span className="text-green-500">SNORQ</span> Team
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Help us build the future of business messaging. We&apos;re looking for passionate people who want to make a difference.
                    </p>
                </div>
            </section>

            {/* Perks */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Why Work With Us</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {perks.map((perk, index) => (
                            <div key={index} className="p-4 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-3">
                                    {perk.icon}
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-1">{perk.title}</h3>
                                <p className="text-xs text-slate-600">{perk.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-12 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Open Positions</h2>

                    {openPositions.length > 0 ? (
                        <div className="space-y-3">
                            {openPositions.map((position, index) => (
                                <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 hover:border-green-200 hover:shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{position.title}</h3>
                                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-3 h-3" />
                                                {position.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {position.location}
                                            </span>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                {position.type}
                                            </span>
                                        </div>
                                    </div>
                                    <Link to="/contact" className="btn-primary text-xs px-3 py-1.5 whitespace-nowrap">
                                        Apply Now
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-white rounded-xl border border-slate-100">
                            <p className="text-sm text-slate-600 mb-2">No open positions at the moment.</p>
                            <p className="text-xs text-slate-500">
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
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        Don&apos;t see the right role?
                    </h2>
                    <p className="text-sm text-slate-600 mb-4">
                        We&apos;re always looking for talented people. Send us your resume and we&apos;ll reach out when we have a match.
                    </p>
                    <a href="mailto:careers@snorq.xyz" className="btn-secondary inline-flex items-center gap-2 text-sm">
                        Send Your Resume
                    </a>
                </div>
            </section>
        </StaticPageLayout>
    );
}
