import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface StaticPageLayoutProps {
    children: ReactNode;
}

export function StaticPageLayout({ children }: StaticPageLayoutProps) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}
