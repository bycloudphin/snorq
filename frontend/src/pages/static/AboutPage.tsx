import { Link } from 'react-router-dom';
import { Target, Users, Zap, Heart, CheckCircle2 } from 'lucide-react';
import { StaticPageLayout } from '../../components/layout/StaticPageLayout';

export function AboutPage() {
    return (
        <StaticPageLayout>
            {/* Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                                We're building the <span className="text-green-500">future</span> of communication.
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0">
                                SNORQ is on a mission to unify the world's messaging. We help businesses connect with their customers on the platforms they love, all from one place.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <Link to="/register" className="btn btn-primary rounded-full px-8 py-3 font-semibold">
                                    Join Our Journey
                                </Link>
                                <a href="#story" className="btn btn-outline rounded-full px-8 py-3 font-semibold">
                                    Read Our Story
                                </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/5 blur-3xl rounded-full transform rotate-12" />
                            <img
                                src="/images/about-team.png"
                                alt="SNORQ Team Collaboration"
                                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section id="story" className="py-20 px-6 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <img
                                src="/images/about-connectivity.png"
                                alt="Global Connectivity"
                                className="w-full h-auto rounded-2xl shadow-lg border border-slate-100"
                            />
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
                                Our Story
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Born from frustration, built for <span className="underline-accent">connection</span>.
                            </h2>
                            <div className="text-slate-600 space-y-6 text-lg leading-relaxed">
                                <p>
                                    It started with a simple problem. We were drowning in tabs. WhatsApp on one screen, Messenger on another, TikTok DMs on the phone. We missed messages, lost context, and frustrated our customers.
                                </p>
                                <p>
                                    We realized that while communication channels were multiplying, the tools to manage them remained fragmented. Small businesses didn't need another complex CRM; they needed a simple, unified inbox.
                                </p>
                                <p>
                                    So we built SNORQ. Not just to aggregate messages, but to bring sanity back to business communication.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Driven by Purpose</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Mission</h3>
                            <p className="text-slate-600">
                                To democratize enterprise-grade communication tools for small businesses and creators, making professional customer service accessible to everyone.
                            </p>
                        </div>
                        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-6">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Vision</h3>
                            <p className="text-slate-600">
                                A world where businesses and customers communicate fluidly across any channel, without barriers, delays, or lost messages.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-6 bg-slate-900 text-white overflow-hidden relative">
                {/* Abstract Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-green-500 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            These principles guide every decision we make, from the code we write to the way we support our customers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ValueCard
                            icon={<Users className="w-6 h-6" />}
                            title="People First"
                            description="Technology serves people, not the other way around. We design for humans."
                        />
                        <ValueCard
                            icon={<Target className="w-6 h-6" />}
                            title="Radical Simplicity"
                            description="Complexity is the enemy. We fight to keep things simple and intuitive."
                        />
                        <ValueCard
                            icon={<Heart className="w-6 h-6" />}
                            title="Customer Love"
                            description="We don't just support our customers; we champion their success."
                        />
                        <ValueCard
                            icon={<CheckCircle2 className="w-6 h-6" />}
                            title="Trust & Transparency"
                            description="We are open, honest, and reliable. Your data is sacred."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        Be part of the story.
                    </h2>
                    <p className="text-lg text-slate-600 mb-10">
                        Join us in redefining how businesses communicate. Whether you're a customer, a partner, or a future team member, we'd love to have you on board.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="btn btn-primary rounded-full px-10 py-4 text-base font-bold shadow-xl shadow-green-200">
                            Get Started Free
                        </Link>
                        <Link to="/careers" className="btn btn-outline rounded-full px-10 py-4 text-base font-bold">
                            View Careers
                        </Link>
                    </div>
                </div>
            </section>
        </StaticPageLayout>
    );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-green-400 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
}
