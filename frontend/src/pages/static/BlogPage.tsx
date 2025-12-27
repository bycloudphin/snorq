import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, Clock, ArrowRight, User } from 'lucide-react';

const blogPosts = [
    {
        id: 1,
        title: 'How to Manage Multiple Social Media DMs Without Losing Your Mind',
        excerpt: 'Learn the best practices for handling customer messages across TikTok, WhatsApp, and Messenger efficiently.',
        author: 'SNORQ Team',
        date: '2024-01-15',
        readTime: '5 min read',
        category: 'Tips & Tricks',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    },
    {
        id: 2,
        title: 'Why Small Businesses Need a Unified Inbox',
        excerpt: 'Discover how consolidating your messaging platforms can save time and boost customer satisfaction.',
        author: 'SNORQ Team',
        date: '2024-01-10',
        readTime: '4 min read',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
    },
    {
        id: 3,
        title: 'TikTok for Business: A Complete Guide to DM Management',
        excerpt: "TikTok's messaging features are evolving. Here's everything you need to know about managing DMs.",
        author: 'SNORQ Team',
        date: '2024-01-05',
        readTime: '7 min read',
        category: 'Platform Guides',
        image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=400&fit=crop',
    },
];

export function BlogPage() {
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
            <section className="py-20 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        SNORQ Blog
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Tips, insights, and best practices for managing customer conversations across social platforms.
                    </p>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid gap-8">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="group">
                                <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-lg transition-all">
                                    <div className="md:w-1/3">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-48 md:h-full object-cover rounded-xl"
                                        />
                                    </div>
                                    <div className="md:w-2/3 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                    {post.category}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-slate-600 mb-4">{post.excerpt}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    {post.author}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {post.readTime}
                                                </span>
                                            </div>
                                            <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                                                Read more <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Coming Soon */}
                    <div className="mt-12 text-center p-8 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-slate-600">
                            More articles coming soon! Stay tuned for weekly updates.
                        </p>
                    </div>
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
