import { Link } from 'react-router-dom';
import { Target, Users, Zap, Heart, ArrowRight } from 'lucide-react';
import { StaticPageLayout } from '../../components/layout/StaticPageLayout';

export function AboutPage() {
    return (
        <StaticPageLayout>
            {/* Hero */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        About <span className="text-green-500">SNORQ</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We're on a mission to help small businesses and creators never miss a customer conversation, no matter which platform it comes from.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-12 px-6 bg-slate-50">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Our Story</h2>
                    <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
                        <p>
                            SNORQ was born from a simple frustration: managing customer messages across multiple platforms is overwhelming. As business owners ourselves, we spent countless hours switching between TikTok, WhatsApp, and Messenger, often missing important customer inquiries.
                        </p>
                        <p>
                            We looked for solutions, but found that most unified inbox tools were either too expensive for small businesses or packed with features we didn't need. That's when we decided to build something different.
                        </p>
                        <p>
                            SNORQ is designed to be simple, affordable, and focused on what matters most: helping you connect with your customers without the complexity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ValueCard
                            icon={<Target className="w-5 h-5" />}
                            title="Simplicity First"
                            description="We believe software should be intuitive. No manual needed, no learning curve. Just sign up and start chatting."
                        />
                        <ValueCard
                            icon={<Heart className="w-5 h-5" />}
                            title="Customer Obsessed"
                            description="Every feature we build starts with a customer need. Your success is our success."
                        />
                        <ValueCard
                            icon={<Users className="w-5 h-5" />}
                            title="Built for Small Business"
                            description="We're not trying to be everything for everyone. We're focused on helping small businesses thrive."
                        />
                        <ValueCard
                            icon={<Zap className="w-5 h-5" />}
                            title="Speed Matters"
                            description="In customer service, every second counts. That's why we've built the fastest messaging platform possible."
                        />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 px-6 bg-slate-900 text-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-1">3+</div>
                            <div className="text-sm text-slate-400">Platforms</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-1">10k+</div>
                            <div className="text-sm text-slate-400">Messages Daily</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-1">99.9%</div>
                            <div className="text-sm text-slate-400">Uptime</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-1">&lt;2s</div>
                            <div className="text-sm text-slate-400">Delivery Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                        Ready to simplify your messaging?
                    </h2>
                    <p className="text-sm text-slate-600 mb-6">
                        Join thousands of businesses using SNORQ to manage their customer conversations.
                    </p>
                    <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                        Get Started Free <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </StaticPageLayout>
    );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-5 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-3">
                {icon}
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
        </div>
    );
}
