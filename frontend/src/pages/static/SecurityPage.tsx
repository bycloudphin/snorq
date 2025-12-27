import { Link } from 'react-router-dom';
import { MessageSquare, Shield, Lock, Eye, Server, AlertTriangle, CheckCircle } from 'lucide-react';

const securityFeatures = [
    {
        icon: <Lock className="w-6 h-6" />,
        title: 'End-to-End Encryption',
        description: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.',
    },
    {
        icon: <Server className="w-6 h-6" />,
        title: 'Secure Infrastructure',
        description: "We use industry-leading cloud providers with SOC 2 Type II certification and 24/7 monitoring.",
    },
    {
        icon: <Eye className="w-6 h-6" />,
        title: 'Access Controls',
        description: 'Strict access controls and audit logging ensure only authorized personnel access production systems.',
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: 'OAuth 2.0',
        description: 'Secure authentication with Google OAuth. We never store your social platform passwords.',
    },
];

const securityPractices = [
    'Regular penetration testing and security audits',
    'Bug bounty program for responsible disclosure',
    'Automatic security updates and patching',
    'Multi-factor authentication for all team members',
    'Employee security training and background checks',
    'Incident response plan and 24-hour security team',
];

export function SecurityPage() {
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
            <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-green-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Security at SNORQ
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Your data security is our top priority. We employ industry-leading practices to keep your information safe.
                    </p>
                </div>
            </section>

            {/* Security Features */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How We Protect Your Data</h2>
                    <div className="grid sm:grid-cols-2 gap-8">
                        {securityFeatures.map((feature, index) => (
                            <div key={index} className="p-6 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Practices */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Security Practices</h2>
                    <div className="bg-white p-8 rounded-2xl border border-slate-100">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {securityPractices.map((practice, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700">{practice}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Compliance</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-2">GDPR Compliant</h3>
                            <p className="text-slate-600 text-sm">
                                We comply with the General Data Protection Regulation, giving EU users full control over their personal data.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-2">SOC 2 Type II (In Progress)</h3>
                            <p className="text-slate-600 text-sm">
                                We're working towards SOC 2 Type II certification to demonstrate our commitment to security best practices.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Report Vulnerability */}
            <section className="py-16 px-6 bg-amber-50 border-y border-amber-100">
                <div className="container mx-auto max-w-3xl text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Found a Security Issue?
                    </h2>
                    <p className="text-slate-600 mb-6">
                        We take security vulnerabilities seriously. If you've discovered a security issue, please report it responsibly.
                    </p>
                    <a
                        href="mailto:security@snorq.xyz"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                    >
                        Report Vulnerability
                    </a>
                    <p className="text-sm text-slate-500 mt-4">
                        We respond to all security reports within 24 hours.
                    </p>
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
