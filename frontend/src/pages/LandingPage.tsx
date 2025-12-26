import { Link } from 'react-router-dom';
import { MessageSquare, Zap, DollarSign, Shield } from 'lucide-react';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">SNORQ</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/login"
                            className="btn btn-primary"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <main className="container mx-auto px-4 pt-20 pb-32">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        All your messages.
                        <span className="block bg-gradient-to-r from-primary-400 to-pink-400 bg-clip-text text-transparent">
                            One inbox.
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Manage TikTok, WhatsApp, and Facebook Messenger conversations in one beautiful dashboard. Never miss a customer message again.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/login"
                            className="btn btn-primary text-lg px-8 py-3"
                        >
                            Start for Free
                        </Link>
                        <a
                            href="#features"
                            className="btn btn-ghost text-white text-lg px-8 py-3"
                        >
                            Learn More →
                        </a>
                    </div>
                </div>

                {/* Platform badges */}
                <div className="flex items-center justify-center gap-4 mt-16">
                    <span className="badge badge-tiktok px-4 py-2 text-sm">TikTok</span>
                    <span className="badge badge-whatsapp px-4 py-2 text-sm">WhatsApp</span>
                    <span className="badge badge-facebook px-4 py-2 text-sm">Messenger</span>
                </div>
            </main>

            {/* Features */}
            <section id="features" className="bg-white py-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        Why choose SNORQ?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-8 h-8" />}
                            title="Lightning Fast"
                            description="Real-time message sync across all platforms. Reply to customers in seconds, not minutes."
                        />
                        <FeatureCard
                            icon={<DollarSign className="w-8 h-8" />}
                            title="Affordable"
                            description="Free tier available. Pro plans start at just $15/month. No enterprise pricing nonsense."
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8" />}
                            title="Secure & Private"
                            description="End-to-end encryption, GDPR compliant, and we never sell your data."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary-600 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to unify your inbox?
                    </h2>
                    <p className="text-primary-100 mb-8 text-lg">
                        Join thousands of businesses managing their conversations with SNORQ.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-white">SNORQ</span>
                        </div>
                        <p className="text-sm">
                            © {new Date().getFullYear()} SNORQ. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="card p-8 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    );
}
