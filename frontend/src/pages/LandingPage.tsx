import { useState } from 'react';
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
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export function LandingPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
            const response = await fetch(`${API_URL}/waitlist/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitted(true);
                // Don't clear email immediately so we can display it
                // setEmail(''); 
            } else {
                console.error('Subscription failed:', data.error);
                // Optional: You could set an error state here to show to the user
            }
        } catch (error) {
            console.error('Subscription error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

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
                            {isSubmitted ? (
                                <div className="animate-fade-in p-6 bg-green-50/80 backdrop-blur border border-green-200 rounded-2xl flex gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                        <Check className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-green-900 text-lg mb-1">You&apos;re on the list! 🚀</h3>
                                        <p className="text-green-800 leading-relaxed">
                                            Thanks for joining. We&apos;ve sent a confirmation email to <span className="font-semibold">{email}</span>. We&apos;ll keep you posted!
                                        </p>
                                        <button
                                            onClick={() => { setIsSubmitted(false); setEmail(''); }}
                                            className="text-sm font-semibold text-green-700 hover:text-green-800 mt-3 underline decoration-green-300 underline-offset-4"
                                        >
                                            Add another email
                                        </button>
                                    </div>
                                </div>
                            ) : (
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
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="btn btn-primary rounded-full px-8 py-4 text-base font-semibold whitespace-nowrap group disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Joining...
                                                </span>
                                            ) : (
                                                <>
                                                    Get Notified
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

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
            <section id="platforms" className="py-20 px-6 bg-white border-y border-slate-100">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            One inbox for all your platforms
                        </h2>
                        <p className="text-slate-500 max-w-lg mx-auto">
                            Connect your favorite messaging apps and manage all conversations from a single dashboard
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        <PlatformLogo name="TikTok" platform="tiktok" />
                        <PlatformLogo name="WhatsApp" platform="whatsapp" />
                        <PlatformLogo name="Messenger" platform="messenger" />
                        <PlatformLogo name="Instagram" platform="instagram" soon />
                        <PlatformLogo name="Telegram" platform="telegram" soon />
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
                            Simple setup, powerful results. Here&apos;s how SNORQ transforms your workflow.
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
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary rounded-full px-8 py-4 text-base font-semibold min-w-[160px] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Joining...
                                    </span>
                                ) : isSubmitted ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Check className="w-5 h-5" />
                                        Subscribed
                                    </span>
                                ) : (
                                    'Join Waitlist'
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-slate-500 mt-6">
                        🔒 No spam, ever. We&apos;ll only email you about the launch.
                    </p>
                </div>
            </section>

            <Footer />
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

function PlatformLogo({ name, platform, soon = false }: { name: string; platform: string; soon?: boolean }) {
    const logos: Record<string, React.ReactNode> = {
        tiktok: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
                <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
        ),
        whatsapp: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
                <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
        ),
        messenger: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
                <path fill="currentColor" d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
            </svg>
        ),
        instagram: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
                <path fill="currentColor" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
            </svg>
        ),
        telegram: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
                <path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
        ),
    };

    const colors: Record<string, string> = {
        tiktok: 'text-black bg-white',
        whatsapp: 'text-white bg-[#25D366]',
        messenger: 'text-white bg-gradient-to-br from-[#00B2FF] to-[#006AFF]',
        instagram: 'text-white bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
        telegram: 'text-white bg-[#0088CC]',
    };

    return (
        <div className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${soon ? 'opacity-40' : 'hover:bg-slate-50 hover:scale-105 cursor-pointer'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${colors[platform] || 'bg-slate-200 text-slate-600'}`}>
                {logos[platform]}
            </div>
            <div className="text-center">
                <span className="text-sm font-medium text-slate-700 block">{name}</span>
                {soon && <span className="text-xs text-slate-400">Coming soon</span>}
            </div>
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
