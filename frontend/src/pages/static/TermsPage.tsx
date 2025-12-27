import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export function TermsPage() {
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
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                        <p className="text-slate-500">Last updated: January 1, 2024</p>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 mb-8">
                            Welcome to SNORQ. By using our service, you agree to these terms. Please read them carefully.
                        </p>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Agreement to Terms</h2>
                            <p className="text-slate-600">
                                By accessing or using SNORQ, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use of Service</h2>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Eligibility</h3>
                            <p className="text-slate-600 mb-4">
                                You must be at least 18 years old to use SNORQ. By using our service, you represent that you meet this requirement.
                            </p>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Account Registration</h3>
                            <p className="text-slate-600 mb-4">
                                To use SNORQ, you must create an account. You are responsible for:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li>Providing accurate and complete information</li>
                                <li>Maintaining the security of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                            </ul>
                        </section>

                        <section className="mb-10" id="acceptable-use">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Acceptable Use</h2>
                            <p className="text-slate-600 mb-4">You agree not to use SNORQ to:</p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li>Violate any laws or regulations</li>
                                <li>Send spam, unsolicited messages, or bulk messaging</li>
                                <li>Harass, abuse, or harm others</li>
                                <li>Transmit malware, viruses, or harmful code</li>
                                <li>Attempt to access other users' accounts or data</li>
                                <li>Interfere with the proper functioning of the service</li>
                                <li>Scrape, copy, or collect data without permission</li>
                                <li>Use the service for any illegal or fraudulent purposes</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Platform Integrations</h2>
                            <p className="text-slate-600 mb-4">
                                SNORQ connects to third-party platforms (TikTok, WhatsApp, Facebook Messenger). By connecting these platforms, you:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li>Authorize SNORQ to access your messages and account information</li>
                                <li>Agree to comply with each platform's terms of service</li>
                                <li>Understand that SNORQ's access depends on third-party APIs</li>
                                <li>Accept that service availability may be affected by platform changes</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Billing and Payments</h2>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Free Plan</h3>
                            <p className="text-slate-600 mb-4">
                                The Free plan includes limited features and is subject to usage limits. We reserve the right to modify free plan features at any time.
                            </p>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Paid Plans</h3>
                            <p className="text-slate-600 mb-4">
                                Paid subscriptions are billed monthly or annually. By subscribing, you:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li>Authorize us to charge your payment method</li>
                                <li>Agree that subscriptions auto-renew unless cancelled</li>
                                <li>Must cancel before the renewal date to avoid charges</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2 mt-4">Refunds</h3>
                            <p className="text-slate-600">
                                We offer a 14-day money-back guarantee for first-time paid subscribers. After this period, payments are non-refundable except where required by law.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
                            <p className="text-slate-600">
                                SNORQ and its original content, features, and functionality are owned by SNORQ Pty Ltd and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Disclaimer of Warranties</h2>
                            <p className="text-slate-600">
                                SNORQ is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free. We are not responsible for message delivery failures caused by third-party platforms.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
                            <p className="text-slate-600">
                                To the maximum extent permitted by law, SNORQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your use of the service.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Termination</h2>
                            <p className="text-slate-600 mb-4">
                                We may terminate or suspend your account immediately, without prior notice, if you:
                            </p>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                <li>Breach these Terms of Service</li>
                                <li>Engage in fraudulent or illegal activities</li>
                                <li>Use the service in a way that harms other users</li>
                            </ul>
                            <p className="text-slate-600 mt-4">
                                You may terminate your account at any time by contacting support or using the account deletion feature in settings.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to Terms</h2>
                            <p className="text-slate-600">
                                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Continued use of SNORQ after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Governing Law</h2>
                            <p className="text-slate-600">
                                These terms shall be governed by and construed in accordance with the laws of Australia, without regard to its conflict of law provisions. Any disputes arising from these terms will be resolved in the courts of New South Wales, Australia.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact</h2>
                            <p className="text-slate-600">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <ul className="list-none text-slate-600 mt-4 space-y-2">
                                <li>Email: <a href="mailto:legal@snorq.xyz" className="text-green-600 hover:underline">legal@snorq.xyz</a></li>
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
