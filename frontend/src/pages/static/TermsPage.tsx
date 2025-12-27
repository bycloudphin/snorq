import { StaticPageLayout } from '../../components/layout/StaticPageLayout';

export function TermsPage() {
    return (
        <StaticPageLayout>
            {/* Content */}
            <div className="py-12 px-6">
                <div className="container mx-auto max-w-3xl">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-3">Terms of Service</h1>
                        <p className="text-sm text-slate-500">Last updated: January 1, 2024</p>
                    </div>

                    <div className="space-y-8">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Welcome to SNORQ. By using our service, you agree to these terms. Please read them carefully.
                        </p>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Agreement to Terms</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                By accessing or using SNORQ, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Use of Service</h2>

                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Eligibility</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                You must be at least 18 years old to use SNORQ. By using our service, you represent that you meet this requirement.
                            </p>

                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Account Registration</h3>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                To use SNORQ, you must create an account. You are responsible for:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                <li>Providing accurate and complete information</li>
                                <li>Maintaining the security of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                            </ul>
                        </section>

                        <section id="acceptable-use">
                            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Acceptable Use</h2>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">You agree not to use SNORQ to:</p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
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

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Platform Integrations</h2>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                SNORQ connects to third-party platforms (TikTok, WhatsApp, Facebook Messenger). By connecting these platforms, you:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                <li>Authorize SNORQ to access your messages and account information</li>
                                <li>Agree to comply with each platform's terms of service</li>
                                <li>Understand that SNORQ's access depends on third-party APIs</li>
                                <li>Accept that service availability may be affected by platform changes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Billing and Payments</h2>

                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Free Plan</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                The Free plan includes limited features and is subject to usage limits. We reserve the right to modify free plan features at any time.
                            </p>

                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Paid Plans</h3>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                Paid subscriptions are billed monthly or annually. By subscribing, you:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 mb-4 space-y-1">
                                <li>Authorize us to charge your payment method</li>
                                <li>Agree that subscriptions auto-renew unless cancelled</li>
                                <li>Must cancel before the renewal date to avoid charges</li>
                            </ul>

                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Refunds</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We offer a 14-day money-back guarantee for first-time paid subscribers. After this period, payments are non-refundable except where required by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Intellectual Property</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                SNORQ and its original content, features, and functionality are owned by SNORQ Pty Ltd and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Disclaimer of Warranties</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                SNORQ is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free. We are not responsible for message delivery failures caused by third-party platforms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Limitation of Liability</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                To the maximum extent permitted by law, SNORQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your use of the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Termination</h2>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                We may terminate or suspend your account immediately, without prior notice, if you:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                <li>Breach these Terms of Service</li>
                                <li>Engage in fraudulent or illegal activities</li>
                                <li>Use the service in a way that harms other users</li>
                            </ul>
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                You may terminate your account at any time by contacting support or using the account deletion feature in settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">10. Changes to Terms</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Continued use of SNORQ after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">11. Governing Law</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                These terms shall be governed by and construed in accordance with the laws of Australia, without regard to its conflict of law provisions. Any disputes arising from these terms will be resolved in the courts of New South Wales, Australia.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">12. Contact</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <ul className="text-sm text-slate-600 mt-3 space-y-1">
                                <li>Email: <a href="mailto:legal@snorq.xyz" className="text-green-600 hover:underline">legal@snorq.xyz</a></li>
                                <li>Address: Sydney, Australia</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </StaticPageLayout>
    );
}
