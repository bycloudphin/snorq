import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle } from 'lucide-react';
import { StaticPageLayout } from '../../components/layout/StaticPageLayout';

const securityFeatures = [
    {
        icon: <Lock className="w-5 h-5" />,
        title: 'End-to-End Encryption',
        description: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.',
    },
    {
        icon: <Server className="w-5 h-5" />,
        title: 'Secure Infrastructure',
        description: "We use industry-leading cloud providers with SOC 2 Type II certification and 24/7 monitoring.",
    },
    {
        icon: <Eye className="w-5 h-5" />,
        title: 'Access Controls',
        description: 'Strict access controls and audit logging ensure only authorized personnel access production systems.',
    },
    {
        icon: <Shield className="w-5 h-5" />,
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
        <StaticPageLayout>
            {/* Hero */}
            <section className="py-16 px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-5">
                        <Shield className="w-7 h-7 text-green-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Security at SNORQ
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Your data security is our top priority. We employ industry-leading practices to keep your information safe.
                    </p>
                </div>
            </section>

            {/* Security Features */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How We Protect Your Data</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                        {securityFeatures.map((feature, index) => (
                            <div key={index} className="p-5 rounded-xl border border-slate-100">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-3">
                                    {feature.icon}
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-1">{feature.title}</h3>
                                <p className="text-sm text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Practices */}
            <section className="py-12 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Our Security Practices</h2>
                    <div className="bg-white p-6 rounded-xl border border-slate-100">
                        <div className="grid sm:grid-cols-2 gap-3">
                            {securityPractices.map((practice, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-700">{practice}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Compliance</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">GDPR Compliant</h3>
                            <p className="text-xs text-slate-600">
                                We comply with the General Data Protection Regulation, giving EU users full control over their personal data.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">SOC 2 Type II (In Progress)</h3>
                            <p className="text-xs text-slate-600">
                                We're working towards SOC 2 Type II certification to demonstrate our commitment to security best practices.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Report Vulnerability */}
            <section className="py-12 px-6 bg-amber-50 border-y border-amber-100">
                <div className="container mx-auto max-w-3xl text-center">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        Found a Security Issue?
                    </h2>
                    <p className="text-sm text-slate-600 mb-4">
                        We take security vulnerabilities seriously. If you've discovered a security issue, please report it responsibly.
                    </p>
                    <a
                        href="mailto:security@snorq.xyz"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-colors"
                    >
                        Report Vulnerability
                    </a>
                    <p className="text-xs text-slate-500 mt-3">
                        We respond to all security reports within 24 hours.
                    </p>
                </div>
            </section>
        </StaticPageLayout>
    );
}
