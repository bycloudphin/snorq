import { Link } from 'react-router-dom';
import { MessageSquare, Target, Users, Zap, Heart, ArrowRight } from 'lucide-react';

export function AboutPage() {
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
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        About <span className="text-green-500">SNORQ</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        We're on a mission to help small businesses and creators never miss a customer conversation, no matter which platform it comes from.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Story</h2>
                    <div className="prose prose-lg max-w-none text-slate-600">
                        <p className="mb-6">
                            SNORQ was born from a simple frustration: managing customer messages across multiple platforms is overwhelming. As business owners ourselves, we spent countless hours switching between TikTok, WhatsApp, and Messenger, often missing important customer inquiries.
                        </p>
                        <p className="mb-6">
                            We looked for solutions, but found that most unified inbox tools were either too expensive for small businesses or packed with features we didn't need. That's when we decided to build something different.
                        </p>
                        <p>
                            SNORQ is designed to be simple, affordable, and focused on what matters most: helping you connect with your customers without the complexity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <ValueCard
                            icon={<Target className="w-6 h-6" />}
                            title="Simplicity First"
                            description="We believe software should be intuitive. No manual needed, no learning curve. Just sign up and start chatting."
                        />
                        <ValueCard
                            icon={<Heart className="w-6 h-6" />}
                            title="Customer Obsessed"
                            description="Every feature we build starts with a customer need. Your success is our success."
                        />
                        <ValueCard
                            icon={<Users className="w-6 h-6" />}
                            title="Built for Small Business"
                            description="We're not trying to be everything for everyone. We're focused on helping small businesses thrive."
                        />
                        <ValueCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Speed Matters"
                            description="In customer service, every second counts. That's why we've built the fastest messaging platform possible."
                        />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6 bg-slate-900 text-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-green-400 mb-2">3+</div>
                            <div className="text-slate-400">Platforms</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-400 mb-2">10k+</div>
                            <div className="text-slate-400">Messages Daily</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
                            <div className="text-slate-400">Uptime</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-400 mb-2">&lt;2s</div>
                            <div className="text-slate-400">Delivery Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Ready to simplify your messaging?
                    </h2>
                    <p className="text-slate-600 mb-8">
                        Join thousands of businesses using SNORQ to manage their customer conversations.
                    </p>
                    <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                        Get Started Free <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-6 rounded-2xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    );
}

function Footer() {
    return (
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
    );
}
