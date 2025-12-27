import { Link } from 'react-router-dom';
import { FileText, Scale, Users, Building } from 'lucide-react';
import { StaticPageLayout } from '../../components/layout/StaticPageLayout';

const legalDocuments = [
    {
        icon: <FileText className="w-5 h-5" />,
        title: 'Terms of Service',
        description: 'Our terms and conditions for using SNORQ services.',
        link: '/terms',
        updated: 'January 1, 2024',
    },
    {
        icon: <Scale className="w-5 h-5" />,
        title: 'Privacy Policy',
        description: 'How we collect, use, and protect your personal information.',
        link: '/privacy',
        updated: 'January 1, 2024',
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: 'Acceptable Use Policy',
        description: 'Guidelines for using our platform responsibly.',
        link: '/terms#acceptable-use',
        updated: 'January 1, 2024',
    },
    {
        icon: <Building className="w-5 h-5" />,
        title: 'Data Processing Agreement',
        description: 'For business customers requiring DPA documentation.',
        link: '/contact',
        updated: 'January 1, 2024',
    },
];

export function LegalPage() {
    return (
        <StaticPageLayout>
            {/* Hero */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Legal
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Transparency is important to us. Here you'll find all our legal documents and policies.
                    </p>
                </div>
            </section>

            {/* Legal Documents */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {legalDocuments.map((doc, index) => (
                            <Link
                                key={index}
                                to={doc.link}
                                className="group p-5 rounded-xl border border-slate-100 hover:border-green-200 hover:shadow-md transition-all"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                    {doc.icon}
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-green-600 transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-sm text-slate-600 mb-2">{doc.description}</p>
                                <p className="text-xs text-slate-400">Last updated: {doc.updated}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact for Legal */}
            <section className="py-12 px-6 bg-slate-50">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                        Have legal questions?
                    </h2>
                    <p className="text-sm text-slate-600 mb-4">
                        For legal inquiries, data requests, or compliance questions, please contact our legal team.
                    </p>
                    <a href="mailto:legal@snorq.xyz" className="text-green-600 font-medium text-sm hover:underline">
                        legal@snorq.xyz
                    </a>
                </div>
            </section>
        </StaticPageLayout>
    );
}
