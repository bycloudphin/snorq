import { StaticPageLayout } from '../../components/layout/StaticPageLayout';

export function PrivacyPage() {
    return (
        <StaticPageLayout>
            {/* Content */}
            <div className="py-12 px-6">
                <div className="container mx-auto max-w-3xl">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
                        <p className="text-sm text-slate-500">Last updated: January 1, 2024</p>
                    </div>

                    <div className="space-y-8">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            At SNORQ, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                        </p>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Information We Collect</h2>

                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Personal Information</h3>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                When you register for SNORQ, we collect:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 mb-4 space-y-1">
                                <li>Name and email address</li>
                                <li>Profile information from connected social accounts (when you use Google OAuth)</li>
                                <li>Billing information (if you upgrade to a paid plan)</li>
                            </ul>

                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Message Data</h3>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                To provide our unified inbox service, we access and store:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                <li>Messages from connected platforms (TikTok, WhatsApp, Messenger)</li>
                                <li>Conversation metadata (timestamps, read status)</li>
                                <li>Media files shared in conversations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">We use the information we collect to:</p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Send you updates, notifications, and support messages</li>
                                <li>Process transactions and send billing information</li>
                                <li>Detect and prevent fraud and abuse</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Data Sharing</h2>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                We do not sell your personal information. We may share your information with:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                <li><strong>Service providers:</strong> Companies that help us deliver our services (hosting, analytics)</li>
                                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business transfers:</strong> In connection with a merger or acquisition</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Data Security</h2>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                We implement appropriate security measures to protect your data:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                                <li>Access to production systems is restricted and logged</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Secure OAuth 2.0 for platform integrations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Your Rights (GDPR)</h2>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                If you're located in the EU, you have the following rights:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
                                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                                <li><strong>Object:</strong> Object to processing in certain circumstances</li>
                            </ul>
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                To exercise these rights, contact us at{' '}
                                <a href="mailto:privacy@snorq.xyz" className="text-green-600 hover:underline">
                                    privacy@snorq.xyz
                                </a>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Data Retention</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We retain your data for as long as your account is active. Message history retention depends on your plan (30 days for Free, unlimited for paid plans). When you delete your account, we remove your personal data within 30 days, except where we're legally required to retain it.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Cookies</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We use essential cookies to keep you logged in and remember your preferences. We do not use third-party advertising cookies. Analytics cookies are only used with your consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Changes to This Policy</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Contact Us</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <ul className="text-sm text-slate-600 mt-3 space-y-1">
                                <li>Email: <a href="mailto:privacy@snorq.xyz" className="text-green-600 hover:underline">privacy@snorq.xyz</a></li>
                                <li>Address: Sydney, Australia</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </StaticPageLayout>
    );
}
