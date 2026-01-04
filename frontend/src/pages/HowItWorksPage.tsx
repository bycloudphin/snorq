import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Shield,
    MessageSquare,
    Users,
    TrendingUp,
    Globe,
    ChevronRight,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const steps = [
    {
        id: 1,
        title: "Connect Your Platforms",
        description: "Securely link your Facebook, Instagram, and WhatsApp accounts in seconds. SNORQ uses official Meta APIs for bank-grade security and reliable connectivity.",
        icon: <Globe className="w-8 h-8 text-blue-400" />,
        stats: "2-minute setup",
        image: "/snorq_unified_inbox_concept_1767423726308.png",
        color: "from-blue-600/20 to-purple-600/20"
    },
    {
        id: 2,
        title: "Centralize Conversations",
        description: "Every message, comment, and story mention lands in one beautiful, unified inbox. No more jumping between apps or missing critical customer inquiries.",
        icon: <MessageSquare className="w-8 h-8 text-pink-400" />,
        stats: "Zero missed messages",
        image: "/snorq_collaboration_team_illustration_1767423746802.png",
        color: "from-pink-600/20 to-orange-600/20"
    },
    {
        id: 3,
        title: "Collaborate with Ease",
        description: "Assign chats to team members, leave internal notes, and manage complex customer journeys together. Scale your support without losing the personal touch.",
        icon: <Users className="w-8 h-8 text-indigo-400" />,
        stats: "Unlimited team members",
        image: "/snorq_collaboration_team_illustration_1767423746802.png",
        color: "from-indigo-600/20 to-blue-600/20"
    },
    {
        id: 4,
        title: "Analyze & Optimize",
        description: "Unlock powerful insights into response times, customer sentiment, and channel performance. Data-driven growth is just a dashboard away.",
        icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
        stats: "Real-time analytics",
        image: "/snorq_analytics_dashboard_illustration_1767423765465.png",
        color: "from-emerald-600/20 to-teal-600/20"
    }
];

export function HowItWorksPage() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-purple-500/30">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full -z-10" />
                <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full -z-10" />

                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6 inline-block">
                            Product Tour
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 tracking-tight">
                            A New Standard for <br />
                            Digital Communication
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                            SNORQ bridges the gap between fragmented social platforms and cohesive customer experiences. Here&apos;s exactly how it works.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2">
                                Start Free Trial <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-2xl transition-all backdrop-blur-sm">
                                Watch Demo Video
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Experience Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                        {/* Left: Step Indicators */}
                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    onClick={() => setActiveStep(index)}
                                    className={`group p-6 rounded-3xl border transition-all cursor-pointer ${activeStep === index
                                        ? 'bg-white/5 border-white/20 shadow-xl'
                                        : 'bg-transparent border-transparent grayscale opacity-50 hover:opacity-100 hover:grayscale-0'
                                        }`}
                                    whileHover={{ x: 10 }}
                                >
                                    <div className="flex items-start gap-6">
                                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} border border-white/10 shadow-inner`}>
                                            {step.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Step 0{step.id}</span>
                                                <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400 border border-white/10">{step.stats}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{step.title}</h3>
                                            <AnimatePresence mode="wait">
                                                {activeStep === index && (
                                                    <motion.p
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="text-slate-400 leading-relaxed overflow-hidden"
                                                    >
                                                        {step.description}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="ml-auto">
                                            {activeStep === index ? (
                                                <CheckCircle2 className="w-6 h-6 text-purple-500" />
                                            ) : (
                                                <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-white/40" />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right: Visual Frame */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="relative z-10 aspect-square"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-[80px] rounded-full" />
                                    <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-[#111114]">
                                        <img
                                            src={steps[activeStep].image}
                                            alt={steps[activeStep].title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60" />

                                        {/* Floating Decorative Elements */}
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center">
                                                    <Zap className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Smart Integration Engine</p>
                                                    <p className="text-xs text-slate-400">Processing real-time sync with 99.9% uptime</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Background Accents */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full animate-pulse" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
                        </div>

                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-white/[0.02] border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Everything You Need to Scale</h2>
                        <p className="text-slate-400">Powerful tools beneath a seamless interface.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Bank-Grade Security",
                                desc: "Your data is encrypted end-to-end using AES-256 standards.",
                                icon: <Shield className="w-6 h-6" />
                            },
                            {
                                title: "Global Reach",
                                desc: "Connect with customers in any language, anywhere in the world.",
                                icon: <Globe className="w-6 h-6" />
                            },
                            {
                                title: "Lightning Fast",
                                desc: "Optimized architecture ensures sub-100ms message delivery.",
                                icon: <Zap className="w-6 h-6" />
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all text-center"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 mb-6 mx-auto">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
