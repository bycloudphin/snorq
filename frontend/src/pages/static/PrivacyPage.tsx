import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export function PrivacyPage() {
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

            {/* Content */}
            <main className="py-16 px-6">
                <div className="container mx-auto max-w-3xl">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                        <p className="text-slate-500">Last updated: January 1, 2024</p>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 mb-8">
                            At SNORQ, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                        </p>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Personal Information</h3>
                            <p className="text-slate-600 mb-4">
                                When you register for SNORQ, we collect:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                                <li>Name and email address</li>
                                <li>Profile information from connected social accounts (when you use Google OAuth)</li>
                                <li>Billing information (if you upgrade to a paid plan)</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Message Data</h3>
                            <p className="text-slate-600 mb-4">
                                To provide our unified inbox service, we access and store:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li>Messages from connected platforms (TikTok, WhatsApp, Messenger)</li>
                                <li>Conversation metadata (timestamps, read status)</li>
                                <li>Media files shared in conversations</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                            <p className="text-slate-600 mb-4">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Send you updates, notifications, and support messages</li>
                                <li>Process transactions and send billing information</li>
                                <li>Detect and prevent fraud and abuse</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Sharing</h2>
                            <p className="text-slate-600 mb-4">
                                We do not sell your personal information. We may share your information with:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li><strong>Service providers:</strong> Companies that help us deliver our services (hosting, analytics)</li>
                                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business transfers:</strong> In connection with a merger or acquisition</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
                            <p className="text-slate-600 mb-4">
                                We implement appropriate security measures to protect your data:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                                <li>Access to production systems is restricted and logged</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Secure OAuth 2.0 for platform integrations</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Your Rights (GDPR)</h2>
                            <p className="text-slate-600 mb-4">
                                If you're located in the EU, you have the following rights:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
                                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                                <li><strong>Object:</strong> Object to processing in certain circumstances</li>
                            </ul>
                            <p className="text-slate-600 mt-4">
                                To exercise these rights, contact us at{' '}
                                <a href="mailto:privacy@snorq.xyz" className="text-green-600 hover:underline">
                                    privacy@snorq.xyz
                                </a>
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
                            <p className="text-slate-600">
                                We retain your data for as long as your account is active. Message history retention depends on your plan (30 days for Free, unlimited for paid plans). When you delete your account, we remove your personal data within 30 days, except where we're legally required to retain it.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies</h2>
                            <p className="text-slate-600">
                                We use essential cookies to keep you logged in and remember your preferences. We do not use third-party advertising cookies. Analytics cookies are only used with your consent.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to This Policy</h2>
                            <p className="text-slate-600">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Us</h2>
                            <p className="text-slate-600">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <ul className="list-none text-slate-600 mt-4 space-y-2">
                                <li>Email: <a href="mailto:privacy@snorq.xyz" className="text-green-600 hover:underline">privacy@snorq.xyz</a></li>
                                <li>Address: Sydney, Australia</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>

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
