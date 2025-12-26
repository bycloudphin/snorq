import { Link } from 'react-router-dom';
import {
    MessageSquare,
    Zap,
    Shield,
    ArrowRight,
    Check,
    Star,
    Users,
    Clock,
    Bell,
    TrendingUp,
    Globe,
    Sparkles,
} from 'lucide-react';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">SNORQ</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                                How it Works
                            </a>
                            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                                Pricing
                            </a>
                            <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                                Testimonials
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium px-4 py-2"
                            >
                                Login
                            </Link>
                            <Link
                                to="/login"
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 overflow-hidden">
                <div className="container mx-auto text-center max-w-5xl">
                    <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200/50 mb-8">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm text-slate-600">Trusted by 2,000+ businesses worldwide</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                        Revolutionizing Customer{' '}
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                            Conversations
                        </span>{' '}
                        One Click Time
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                        Manage all your social media messages in one unified inbox. Connect TikTok, WhatsApp, and Facebook Messenger seamlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 group"
                        >
                            Start Free Trial
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="inline-flex items-center gap-2 text-slate-700 px-6 py-4 rounded-full text-base font-medium hover:bg-white/80 transition-all"
                        >
                            See How it Works
                        </a>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="relative mx-auto max-w-5xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl" />
                        <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/50 overflow-hidden">
                            {/* Dashboard Header */}
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">Dashboard</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">👋 Welcome back, Alex!</span>
                                    <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                        Upgrade to Pro
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6 grid grid-cols-12 gap-6">
                                {/* Stats Row */}
                                <div className="col-span-12 grid grid-cols-4 gap-4">
                                    <StatCard icon={<MessageSquare className="w-5 h-5" />} label="New Messages" value="450" subtext="+12%" />
                                    <StatCard icon={<Users className="w-5 h-5" />} label="Conversations" value="580" subtext="+8%" />
                                    <StatCard icon={<Clock className="w-5 h-5" />} label="Avg Response" value="2.5m" subtext="-15%" positive />
                                    <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Resolved Today" value="229" subtext="+24%" />
                                </div>

                                {/* Main Content */}
                                <div className="col-span-8 space-y-4">
                                    {/* Conversations Chart */}
                                    <div className="bg-slate-50 rounded-2xl p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-slate-800">Top Conversations</h3>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="px-2 py-1 bg-white rounded-md text-slate-600 border border-slate-200">Monthly</span>
                                            </div>
                                        </div>
                                        <div className="flex items-end gap-3 h-32">
                                            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                    <div
                                                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-lg transition-all hover:from-indigo-700 hover:to-indigo-500"
                                                        style={{ height: `${height}%` }}
                                                    />
                                                    <span className="text-xs text-slate-500">
                                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity Table */}
                                    <div className="bg-slate-50 rounded-2xl p-5">
                                        <h3 className="font-semibold text-slate-800 mb-4">Breakdown</h3>
                                        <div className="space-y-3">
                                            {[
                                                { platform: 'TikTok', status: 'Active', date: 'Dec 26', progress: 85 },
                                                { platform: 'WhatsApp', status: 'Processing', date: 'Dec 25', progress: 65 },
                                                { platform: 'Messenger', status: 'Complete', date: 'Dec 24', progress: 100 },
                                            ].map((row, i) => (
                                                <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-xl">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold
                            ${i === 0 ? 'bg-black' : i === 1 ? 'bg-green-500' : 'bg-blue-500'}`}>
                                                        {row.platform[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-medium text-slate-800">{row.platform}</span>
                                                            <span className="text-xs text-slate-500">{row.date}</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                                                                style={{ width: `${row.progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full
                            ${row.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                            row.status === 'Processing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {row.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Sidebar */}
                                <div className="col-span-4 space-y-4">
                                    {/* User Satisfaction */}
                                    <div className="bg-slate-50 rounded-2xl p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-slate-800">Users Satisfaction</h3>
                                            <span className="text-xs text-slate-500">Dec 2024</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-20 h-20">
                                                <svg className="w-20 h-20 -rotate-90">
                                                    <circle cx="40" cy="40" r="35" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                                                    <circle
                                                        cx="40" cy="40" r="35" fill="none" stroke="url(#gradient)" strokeWidth="6"
                                                        strokeDasharray="220" strokeDashoffset="44" strokeLinecap="round"
                                                    />
                                                    <defs>
                                                        <linearGradient id="gradient">
                                                            <stop offset="0%" stopColor="#6366f1" />
                                                            <stop offset="100%" stopColor="#a855f7" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800">
                                                    80%
                                                </span>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                    <span className="text-xs text-slate-600">Satisfied</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                    <span className="text-xs text-slate-600">Neutral</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reports */}
                                    <div className="bg-slate-50 rounded-2xl p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-slate-800">Reports</h3>
                                            <span className="text-xs text-indigo-600">View all</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 mb-1">$26,000<span className="text-lg text-slate-400">.80</span></p>
                                        <p className="text-xs text-slate-500 mb-3">Total Revenue</p>
                                        <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                                            View Full Analytics
                                        </button>
                                    </div>

                                    {/* Upgrade Card */}
                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
                                        <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                                        <p className="text-sm text-indigo-100 mb-4">Get access to all features and analytics</p>
                                        <button className="w-full bg-white text-indigo-600 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
                                            Upgrade Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-12 px-6 bg-white/50 border-y border-slate-200/50">
                <div className="container mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
                        {['TikTok', 'WhatsApp', 'Meta', 'Shopify', 'Stripe', 'Google'].map((brand) => (
                            <span key={brand} className="text-xl font-bold text-slate-400 tracking-wider">
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Start Your Messaging Journey Today
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Fast, secure, and effortless conversations for businesses and individuals.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            number="01"
                            title="Unified Inbox"
                            description="All your TikTok, WhatsApp, and Messenger conversations in one beautiful dashboard."
                            light
                        />
                        <FeatureCard
                            number="02"
                            title="Real-time Sync"
                            description="Instant message delivery with WebSocket technology. Never miss a customer message again."
                            dark
                        />
                        <FeatureCard
                            number="03"
                            title="24/7 Support"
                            description="Get help whenever you need from our expert customer service team."
                            light
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            {/* Reports Card */}
                            <div className="bg-slate-50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm text-slate-500 mb-1">Reports</h3>
                                        <p className="text-xs text-slate-400">Total Revenue</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-slate-900 mb-6">
                                    $26,000<span className="text-2xl text-slate-400">.80</span>
                                </p>
                                {/* Mini Chart */}
                                <div className="bg-white rounded-2xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-slate-700">August</span>
                                        <span className="text-xs text-indigo-600">+14%</span>
                                    </div>
                                    <div className="flex items-end gap-2 h-20">
                                        {[30, 50, 35, 70, 45, 85, 60, 75, 55, 90, 65, 80].map((h, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-sm transition-all ${i === 11 ? 'bg-indigo-600' : 'bg-indigo-200'}`}
                                                style={{ height: `${h}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">
                                Quick registration minimal needed
                            </h2>
                            <p className="text-slate-600 mb-8">
                                Ensure every incident becomes a learning opportunity with insightful automatically capture your incident activity and reduce system risk.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Easily track stages and milestones of your deals',
                                    'One-click call to action to expand your reach',
                                    'Collaborate with your team using live page content Manager',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-indigo-600" />
                                        </div>
                                        <span className="text-slate-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-all group"
                            >
                                Learn more
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payments Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">
                                Make and receive payments
                            </h2>
                            <p className="text-slate-600 mb-8">
                                Experience the speed and efficiency of submitting invoice requests in seconds with our user-friendly platform.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-indigo-600 font-medium group"
                            >
                                Learn more
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Send Invoices</h3>
                                        <p className="text-xs text-slate-500">Quick and easy billing</p>
                                    </div>
                                </div>

                                {/* Invoice List */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-slate-700">Recent Invoices</h4>
                                    {[
                                        { name: 'John Peterson', amount: '$850', status: 'Paid' },
                                        { name: 'Emma Wilson', amount: '$1,200', status: 'Pending' },
                                        { name: 'Albert Ross', amount: '$320', status: 'Paid' },
                                    ].map((invoice, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full" />
                                                <span className="text-sm font-medium text-slate-700">{invoice.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-slate-900">{invoice.amount}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">
                                What our customers says About Us
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-slate-600">+2,000 happy users</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-8">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <blockquote className="text-lg text-slate-700 mb-6">
                                "SNORQ has completely transformed how we handle customer messages. Before, I was constantly switching between TikTok, WhatsApp, and Messenger - now everything is in one place. Our response time dropped from hours to minutes!"
                            </blockquote>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                                <div>
                                    <p className="font-semibold text-slate-900">Sarah Mitchell</p>
                                    <p className="text-sm text-slate-500">Small Business Owner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-lg text-slate-600">
                            Start free, upgrade when you need more power.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <PricingCard
                            name="Free"
                            price="$0"
                            description="Perfect for getting started"
                            features={[
                                '1 User',
                                'All 3 platforms',
                                '30-day message history',
                                'Basic unified inbox',
                            ]}
                        />
                        <PricingCard
                            name="Pro"
                            price="$15"
                            description="For growing businesses"
                            features={[
                                'Up to 3 Users',
                                'All platforms',
                                'Unlimited history',
                                'Labels & notes',
                                'Priority support',
                            ]}
                            popular
                        />
                        <PricingCard
                            name="Business"
                            price="$35"
                            description="For larger teams"
                            features={[
                                'Up to 4 Users',
                                'All platforms',
                                'Analytics dashboard',
                                'API access',
                                'Custom integrations',
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to unify your inbox?
                            </h2>
                            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                                Join thousands of businesses managing their conversations with SNORQ. Start your free trial today.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full text-base font-medium hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1 group"
                            >
                                Get Started Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">SNORQ</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Unifying customer conversations across all platforms.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} SNORQ. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                                <Globe className="w-5 h-5 text-slate-400" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Components
function StatCard({
    icon,
    label,
    value,
    subtext,
    positive = true,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext: string;
    positive?: boolean;
}) {
    return (
        <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600">
                    {icon}
                </div>
                <span className="text-sm text-slate-500">{label}</span>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-slate-900">{value}</span>
                <span className={`text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}>
                    {subtext}
                </span>
            </div>
        </div>
    );
}

function FeatureCard({
    number,
    title,
    description,
    dark = false,
    light = false,
}: {
    number: string;
    title: string;
    description: string;
    dark?: boolean;
    light?: boolean;
}) {
    return (
        <div
            className={`rounded-3xl p-8 transition-all hover:-translate-y-1 ${dark
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'
                }`}
        >
            <div className="flex items-center justify-between mb-8">
                <span className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {number}
                </span>
                <ArrowRight className={`w-5 h-5 ${dark ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-3 ${dark ? 'text-white' : 'text-slate-900'}`}>
                {title}
            </h3>
            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{description}</p>
        </div>
    );
}

function PricingCard({
    name,
    price,
    description,
    features,
    popular = false,
}: {
    name: string;
    price: string;
    description: string;
    features: string[];
    popular?: boolean;
}) {
    return (
        <div
            className={`rounded-3xl p-8 relative ${popular
                    ? 'bg-slate-900 text-white ring-4 ring-indigo-500/20'
                    : 'bg-white border border-slate-200'
                }`}
        >
            {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium px-4 py-1 rounded-full">
                    Most Popular
                </div>
            )}
            <h3 className={`text-lg font-semibold mb-1 ${popular ? 'text-white' : 'text-slate-900'}`}>
                {name}
            </h3>
            <p className={`text-sm mb-4 ${popular ? 'text-slate-400' : 'text-slate-500'}`}>
                {description}
            </p>
            <div className="mb-6">
                <span className={`text-4xl font-bold ${popular ? 'text-white' : 'text-slate-900'}`}>
                    {price}
                </span>
                <span className={popular ? 'text-slate-400' : 'text-slate-500'}>/month</span>
            </div>
            <ul className="space-y-3 mb-8">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                        <Check className={`w-4 h-4 ${popular ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        <span className={popular ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                    </li>
                ))}
            </ul>
            <Link
                to="/login"
                className={`block w-full py-3 rounded-xl text-center font-medium transition-all ${popular
                        ? 'bg-white text-slate-900 hover:bg-slate-100'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
            >
                Get Started
            </Link>
        </div>
    );
}
