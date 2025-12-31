import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-slate-200">404</h1>
                <h2 className="text-2xl font-semibold text-slate-900 mt-4 mb-2">
                    Page not found
                </h2>
                <p className="text-slate-500 mb-8">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for.
                </p>
                <Link to="/" className="btn btn-primary">
                    <Home className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
