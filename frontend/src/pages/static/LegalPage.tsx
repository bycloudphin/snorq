import { Link } from 'react-router-dom';
import { MessageSquare, FileText, Scale, Users, Building } from 'lucide-react';

const legalDocuments = [
    {
        icon: <FileText className="w-6 h-6" />,
        title: 'Terms of Service',
        description: 'Our terms and conditions for using SNORQ services.',
        link: '/terms',
        updated: 'January 1, 2024',
    },
    {
        icon: <Scale className="w-6 h-6" />,
        title: 'Privacy Policy',
        description: 'How we collect, use, and protect your personal information.',
        link: '/privacy',
        updated: 'January 1, 2024',
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: 'Acceptable Use Policy',
        description: 'Guidelines for using our platform responsibly.',
        link: '/terms#acceptable-use',
        updated: 'January 1, 2024',
    },
    {
        icon: <Building className="w-6 h-6" />,
        title: 'Data Processing Agreement',
        description: 'For business customers requiring DPA documentation.',
        link: '/contact',
        updated: 'January 1, 2024',
    },
];

export function LegalPage() {
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
                        Legal
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Transparency is important to us. Here you'll find all our legal documents and policies.
                    </p>
                </div>
            </section>

            {/* Legal Documents */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid sm:grid-cols-2 gap-6">
                        {legalDocuments.map((doc, index) => (
                            <Link
                                key={index}
                                to={doc.link}
                                className="group p-6 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                    {doc.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-slate-600 text-sm mb-3">{doc.description}</p>
                                <p className="text-xs text-slate-400">Last updated: {doc.updated}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact for Legal */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Have legal questions?
                    </h2>
                    <p className="text-slate-600 mb-6">
                        For legal inquiries, data requests, or compliance questions, please contact our legal team.
                    </p>
                    <a href="mailto:legal@snorq.xyz" className="text-green-600 font-medium hover:underline">
                        legal@snorq.xyz
                    </a>
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
