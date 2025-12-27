import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle } from 'lucide-react';
import { StaticPageLayout } from '../../components/layout/StaticPageLayout';

export function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    return (
        <StaticPageLayout>
            {/* Hero */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Have a question, feedback, or just want to say hi? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="pb-16 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-5">Contact Information</h2>

                            <div className="space-y-5">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">Email</h3>
                                        <a href="mailto:hello@snorq.xyz" className="text-sm text-green-600 hover:underline">
                                            hello@snorq.xyz
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">Support</h3>
                                        <p className="text-sm text-slate-600">Available Mon-Fri, 9am-5pm AEST</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">Location</h3>
                                        <p className="text-sm text-slate-600">Sydney, Australia</p>
                                        <p className="text-xs text-slate-500">Remote-first company</p>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="mt-8 p-4 bg-slate-50 rounded-xl">
                                <h3 className="text-sm font-semibold text-slate-900 mb-1">Looking for quick answers?</h3>
                                <p className="text-xs text-slate-600 mb-3">
                                    Check our documentation for common questions about platform integrations, billing, and features.
                                </p>
                                <a href="#" className="text-green-600 font-medium text-xs hover:underline">
                                    Visit Help Center →
                                </a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-slate-50 p-6 rounded-xl">
                            {isSubmitted ? (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Message Sent!</h3>
                                    <p className="text-sm text-slate-600">
                                        Thank you for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-slate-900 mb-5">Send us a message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1">
                                                Your Name
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="you@example.com"
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-xs font-medium text-slate-700 mb-1">
                                                Subject
                                            </label>
                                            <select
                                                id="subject"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white"
                                                required
                                            >
                                                <option value="">Select a topic...</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="support">Technical Support</option>
                                                <option value="billing">Billing Question</option>
                                                <option value="partnership">Partnership Opportunity</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-xs font-medium text-slate-700 mb-1">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="How can we help you?"
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white resize-none"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-2"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    Send Message <Send className="w-3 h-3" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </StaticPageLayout>
    );
}
