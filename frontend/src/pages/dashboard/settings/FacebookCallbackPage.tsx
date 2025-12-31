import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

interface MetaPage {
    id: string;
    name: string;
    category: string;
    access_token: string;
    instagram_business_account?: {
        id: string;
    };
}

export function FacebookCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    const [status, setStatus] = useState<'loading' | 'selecting_page' | 'connecting' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [pages, setPages] = useState<MetaPage[]>([]);
    const [userAccessToken, setUserAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            setStatus('error');
            setError('No authorization code found');
            return;
        }

        if (status === 'loading' && pages.length === 0) {
            exchangeToken(code);
        }
    }, [searchParams]);

    const exchangeToken = async (code: string) => {
        try {
            const response = await fetch(`${API_URL}/meta/exchange-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (data.success) {
                setPages(data.data.pages);
                setUserAccessToken(data.data.userAccessToken);
                setStatus('selecting_page');
            } else {
                setStatus('error');
                setError(data.error?.message || 'Failed to exchange token');
            }
        } catch (err) {
            setStatus('error');
            setError('Network error during token exchange');
        }
    };

    const handleConnectPage = async (pageId: string) => {
        const selectedPage = pages.find(p => p.id === pageId);
        if (!selectedPage) return;

        setStatus('connecting');
        try {
            const response = await fetch(`${API_URL}/meta/connect-page`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    pageId: selectedPage.id,
                    pageAccessToken: selectedPage.access_token,
                    pageName: selectedPage.name,
                    instagramId: selectedPage.instagram_business_account?.id
                }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setTimeout(() => {
                    navigate('/dashboard/settings');
                }, 2000);
            } else {
                setStatus('error');
                setError(data.error?.message || 'Failed to connect page');
            }
        } catch (err) {
            setStatus('error');
            setError('Network error during page connection');
        }
    };

    const content = () => {
        if (status === 'loading') {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-4" />
                    <p className="text-slate-600">Connecting to Facebook...</p>
                </div>
            );
        }

        if (status === 'error') {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Connection Failed</h2>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard/settings')}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                    >
                        Return to Settings
                    </button>
                </div>
            );
        }

        if (status === 'selecting_page') {
            return (
                <div className="max-w-2xl mx-auto py-10 px-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Select Facebook Page</h1>
                    <p className="text-slate-500 mb-8">Choose which page you want to connect to SNORQ.</p>

                    <div className="space-y-4">
                        {pages.map((page) => (
                            <div
                                key={page.id}
                                className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:border-green-500 transition-colors shadow-sm"
                            >
                                <div>
                                    <h3 className="font-bold text-slate-900">{page.name}</h3>
                                    <p className="text-sm text-slate-500 capitalize">{page.category}</p>
                                    {page.instagram_business_account && (
                                        <span className="inline-flex items-center gap-1 text-xs text-pink-600 mt-1 font-medium bg-pink-50 px-2 py-0.5 rounded-full">
                                            Includes Instagram
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleConnectPage(page.id)}
                                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    Connect
                                </button>
                            </div>
                        ))}

                        {pages.length === 0 && (
                            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <p className="text-slate-500">No pages found for this account.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (status === 'success') {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Connected Successfully!</h2>
                    <p className="text-slate-500">Redirecting you back to settings...</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-slate-50">
            {content()}
        </div>
    );
}
