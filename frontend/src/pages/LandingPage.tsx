import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MessageSquare,
    ArrowRight,
    Check,
    Star,
    Zap,
    Shield,
    Users,
    Clock,
    Send,
    Smartphone,
    ChevronDown,
    Menu,
    X,
} from 'lucide-react';

export function LandingPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // TODO: Integrate with backend API to save email
            console.log('Email submitted:', email);
            setIsSubmitted(true);
            setEmail('');
            setTimeout(() => setIsSubmitted(false), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
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
                            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                                How it Works
                            </a>
                            <a href="#platforms" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                                Platforms
                            </a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <button className="btn btn-outline rounded-full px-5 py-2.5">
                                Get Notified
                            </button>
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
                            <a href="#features" className="block text-slate-600 hover:text-slate-900 py-2">Features</a>
                            <a href="#how-it-works" className="block text-slate-600 hover:text-slate-900 py-2">How it Works</a>
                            <a href="#platforms" className="block text-slate-600 hover:text-slate-900 py-2">Platforms</a>
                            <button className="w-full btn btn-outline rounded-full">Get Notified</button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 overflow-hidden grid-pattern">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content */}
                        <div className="max-w-xl">
                            <div className="badge-coming-soon mb-6 animate-fade-in">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Coming Soon
                            </div>

                            <h1 className="heading-xl text-slate-900 mb-6 animate-slide-up">
                                Put <span className="font-serif italic underline-accent">conversations</span> first
                            </h1>

                            <p className="text-body mb-8 animate-slide-up stagger-1">
                                Fast, unified and seamless - manage all your TikTok, WhatsApp, and Messenger conversations in one powerful inbox with your own branded experience.
                            </p>

                            {/* Email Subscription Form */}
                            <form onSubmit={handleSubscribe} className="animate-slide-up stagger-2">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input input-lg pr-4 rounded-full"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-full px-8 py-4 text-base font-semibold whitespace-nowrap group"
                                    >
                                        {isSubmitted ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Subscribed!
                                            </>
                                        ) : (
                                            <>
                                                Get Notified
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                                {isSubmitted && (
                                    <p className="text-green-600 text-sm mt-3 animate-fade-in">
                                        🎉 You're on the list! We'll notify you when SNORQ launches.
                                    </p>
                                )}
                            </form>

                            {/* Stats */}
                            <div className="mt-12 pt-8 border-t border-slate-100 animate-slide-up stagger-3">
                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <p className="text-3xl md:text-4xl font-bold text-slate-900">3+</p>
                                        <p className="text-sm text-slate-500 mt-1">Platforms unified</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl md:text-4xl font-bold text-slate-900">~50%</p>
                                        <p className="text-sm text-slate-500 mt-1">Time saved</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4].map((i) => (
                                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            ))}
                                            <Star className="w-4 h-4 fill-amber-100 text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">4.5</p>
                                            <p className="text-xs text-slate-500">Beta rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - App Preview */}
                        <div className="relative animate-float">
                            <div className="relative z-10">
                                {/* Main Dashboard Card */}
                                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                    {/* Header */}
                                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600">Inbox</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span>All platforms</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Conversation List */}
                                    <div className="p-4 space-y-3">
                                        <ConversationItem
                                            platform="tiktok"
                                            name="Sarah Johnson"
                                            message="Love your products! When will..."
                                            time="2m"
                                            unread
                                        />
                                        <ConversationItem
                                            platform="whatsapp"
                                            name="Mike Chen"
                                            message="Thanks for the quick response!"
                                            time="15m"
                                        />
                                        <ConversationItem
                                            platform="messenger"
                                            name="Emma Wilson"
                                            message="Do you ship internationally?"
                                            time="1h"
                                            unread
                                        />
                                    </div>
                                </div>

                                {/* Floating Stats Card */}
                                <div className="absolute -right-4 top-1/4 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-20 animate-slide-up stagger-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900">↓ 42</p>
                                            <p className="text-xs text-slate-500">Response time</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Reply Floating Card */}
                                <div className="absolute -left-4 bottom-1/4 bg-slate-900 text-white rounded-2xl shadow-xl p-4 z-20 animate-slide-up stagger-5">
                                    <div className="flex items-center gap-3">
                                        <Send className="w-4 h-4 text-green-400" />
                                        <span className="text-sm font-medium">Quick replies ready</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-2 py-1 bg-slate-800 rounded text-xs">Thanks!</span>
                                        <span className="px-2 py-1 bg-slate-800 rounded text-xs">On it 👍</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By / Platforms */}
            <section id="platforms" className="py-16 px-6 bg-slate-50 border-y border-slate-100">
                <div className="container mx-auto max-w-5xl">
                    <p className="text-center text-sm text-slate-500 mb-8">Connects with the platforms you already use</p>
                    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
                        <PlatformLogo name="TikTok" icon="T" />
                        <PlatformLogo name="WhatsApp" icon="W" />
                        <PlatformLogo name="Messenger" icon="M" />
                        <PlatformLogo name="Instagram" icon="I" soon />
                        <PlatformLogo name="Telegram" icon="T" soon />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section-padding">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="heading-lg text-slate-900 mb-4">
                            Everything you need to manage conversations
                        </h2>
                        <p className="text-body max-w-2xl mx-auto">
                            Stop switching between apps. SNORQ brings all your customer messages into one beautiful, powerful inbox.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<MessageSquare className="w-6 h-6" />}
                            title="Unified Inbox"
                            description="All your TikTok, WhatsApp, and Messenger conversations in one beautifully organized dashboard."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Real-time Sync"
                            description="Instant message delivery with WebSocket technology. Never miss a customer message again."
                            highlighted
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6" />}
                            title="Team Collaboration"
                            description="Assign conversations, add internal notes, and collaborate seamlessly with your team."
                        />
                        <FeatureCard
                            icon={<Clock className="w-6 h-6" />}
                            title="Quick Responses"
                            description="Save time with pre-written response templates that you can send with one click."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Secure & Private"
                            description="Enterprise-grade encryption keeps your conversations and customer data safe."
                        />
                        <FeatureCard
                            icon={<Smartphone className="w-6 h-6" />}
                            title="Mobile Ready"
                            description="Manage conversations on the go with our responsive mobile-friendly design."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="section-padding bg-slate-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="heading-lg text-slate-900 mb-4">
                            Get started in minutes
                        </h2>
                        <p className="text-body max-w-2xl mx-auto">
                            Simple setup, powerful results. Here's how SNORQ transforms your workflow.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <StepCard
                            number="01"
                            title="Connect your platforms"
                            description="Link your TikTok, WhatsApp, and Messenger accounts with just a few clicks. No coding required."
                        />
                        <StepCard
                            number="02"
                            title="Invite your team"
                            description="Add team members and assign roles. Everyone gets the access they need, nothing more."
                        />
                        <StepCard
                            number="03"
                            title="Start chatting"
                            description="All your messages flow into one inbox. Respond faster and never lose track of a conversation."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-slate-900 text-white">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="heading-lg text-white mb-4">
                        Ready to unify your inbox?
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                        Join the waitlist and be the first to know when SNORQ launches. Early access members get exclusive perks.
                    </p>

                    <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-5 py-4 bg-slate-800 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-primary rounded-full px-8 py-4 text-base font-semibold"
                            >
                                Join Waitlist
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-slate-500 mt-6">
                        🔒 No spam, ever. We'll only email you about the launch.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-5 gap-12 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">SNORQ</span>
                            </Link>
                            <p className="text-slate-500 text-sm mb-4 max-w-xs">
                                The unified inbox for modern businesses. Manage all your social conversations in one place.
                            </p>
                            <div className="badge-coming-soon">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Launching 2025
                            </div>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#features" className="text-slate-500 hover:text-slate-900 transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="text-slate-500 hover:text-slate-900 transition-colors">How it Works</a></li>
                                <li><a href="#platforms" className="text-slate-500 hover:text-slate-900 transition-colors">Platforms</a></li>
                                <li><span className="text-slate-400">Pricing <span className="text-xs">(Coming soon)</span></span></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">About</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Blog</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Careers</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
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

// Components
function ConversationItem({
    platform,
    name,
    message,
    time,
    unread = false,
}: {
    platform: 'tiktok' | 'whatsapp' | 'messenger';
    name: string;
    message: string;
    time: string;
    unread?: boolean;
}) {
    const platformColors = {
        tiktok: 'bg-black',
        whatsapp: 'bg-green-500',
        messenger: 'bg-blue-500',
    };

    const platformIcons = {
        tiktok: 'T',
        whatsapp: 'W',
        messenger: 'M',
    };

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-slate-50 ${unread ? 'bg-green-50/50' : ''}`}>
            <div className={`w-10 h-10 ${platformColors[platform]} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                {platformIcons[platform]}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm ${unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{name}</span>
                    <span className="text-xs text-slate-400">{time}</span>
                </div>
                <p className={`text-sm truncate ${unread ? 'text-slate-700' : 'text-slate-500'}`}>{message}</p>
            </div>
            {unread && (
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
            )}
        </div>
    );
}

function PlatformLogo({ name, icon, soon = false }: { name: string; icon: string; soon?: boolean }) {
    return (
        <div className={`flex items-center gap-2 ${soon ? 'opacity-40' : 'opacity-70 hover:opacity-100 transition-opacity'}`}>
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {icon}
            </div>
            <span className="text-sm font-medium text-slate-600">{name}</span>
            {soon && <span className="text-xs text-slate-400">(Soon)</span>}
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    highlighted = false,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    highlighted?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl p-6 transition-all hover:-translate-y-1 ${highlighted
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-100 hover:shadow-lg hover:shadow-slate-100'
                }`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${highlighted ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                {icon}
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${highlighted ? 'text-white' : 'text-slate-900'}`}>
                {title}
            </h3>
            <p className={`text-sm ${highlighted ? 'text-slate-400' : 'text-slate-600'}`}>
                {description}
            </p>
        </div>
    );
}

function StepCard({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) {
    return (
        <div className="relative">
            <div className="text-5xl font-bold text-slate-100 mb-4">{number}</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm">{description}</p>
        </div>
    );
}
