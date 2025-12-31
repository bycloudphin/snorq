import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
    Facebook,
    Instagram,
    MessageCircle, // WhatsApp-like icon
    Music2, // TikTok-like icon
    CheckCircle2,
    Plus,
    Loader2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

interface PlatformConnection {
    id: string;
    platform: 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP' | 'TIKTOK';
    platformUsername: string;
    status: 'ACTIVE' | 'EXPIRED' | 'ERROR' | 'DISCONNECTED';
}

export function IntegrationsPage() {
    const { accessToken, organizations } = useAuth();
    const [connections, setConnections] = useState<PlatformConnection[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (organizations.length > 0 && accessToken) {
            fetchConnections(organizations[0].id);
        }
    }, [organizations, accessToken]);

    const fetchConnections = async (orgId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/organizations/${orgId}/integrations`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setConnections(data.data.connections);
            }
        } catch (error) {
            console.error('Failed to fetch connections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookConnect = async () => {
        try {
            // Get Auth URL from backend
            const response = await fetch(`${API_URL}/meta/auth-url`);
            const data = await response.json();

            if (data.success && data.data.url) {
                window.location.href = data.data.url;
            } else {
                console.error('Failed to get auth URL');
                alert('Could not start Facebook connection. Please check console.');
            }
        } catch (error) {
            console.error('Error starting FB connect:', error);
        }
    };

    const getConnection = (platform: string) => {
        return connections.find(c => c.platform === platform && c.status === 'ACTIVE');
    };

    const fbConnection = getConnection('FACEBOOK');
    const igConnection = getConnection('INSTAGRAM');

    return (
        <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
                        <p className="text-slate-500">Connect your messaging platforms to unified them in SNORQ.</p>
                    </div>
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Facebook */}
                    <IntegrationCard
                        platform="Facebook"
                        description="Connect your Facebook Page to receive Messenger messages."
                        icon={<Facebook className="w-8 h-8 text-blue-600" />}
                        status={fbConnection ? 'connected' : 'disconnected'}
                        connectedAs={fbConnection?.platformUsername}
                        onConnect={handleFacebookConnect}
                    />

                    {/* Instagram */}
                    <IntegrationCard
                        platform="Instagram"
                        description="Connect your Instagram Business account for Direct Messages."
                        icon={<Instagram className="w-8 h-8 text-pink-600" />}
                        status={igConnection ? 'connected' : 'disconnected'}
                        connectedAs={igConnection?.platformUsername}
                        onConnect={() => console.log('Connect IG')}
                        badge="Coming Soon"
                    />

                    {/* WhatsApp */}
                    <IntegrationCard
                        platform="WhatsApp"
                        description="Connect your WhatsApp Business number."
                        icon={<MessageCircle className="w-8 h-8 text-green-500" />}
                        status="disconnected"
                        onConnect={() => console.log('Connect WA')}
                        badge="Coming Soon"
                    />

                    {/* TikTok */}
                    <IntegrationCard
                        platform="TikTok"
                        description="Sync your TikTok Direct Messages."
                        icon={<Music2 className="w-8 h-8 text-black" />}
                        status="disconnected"
                        onConnect={() => console.log('Connect TikTok')}
                        badge="beta"
                    />
                </div>
            </div>
        </div>
    );
}

interface IntegrationCardProps {
    platform: string;
    description: string;
    icon: React.ReactNode;
    status: 'connected' | 'disconnected' | 'error';
    onConnect: () => void;
    badge?: string;
    connectedAs?: string;
}

function IntegrationCard({ platform, description, icon, status, onConnect, badge, connectedAs }: IntegrationCardProps) {
    const isConnected = status === 'connected';

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    {icon}
                </div>
                {badge && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {badge}
                    </span>
                )}
            </div>

            <div className="mb-6 flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    {platform}
                    {isConnected && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
                {isConnected ? (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Connected
                            </span>
                            <button className="text-sm text-slate-400 hover:text-red-500 transition-colors">
                                Disconnect
                            </button>
                        </div>
                        {connectedAs && (
                            <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                Connected as <span className="font-semibold text-slate-700">{connectedAs}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={onConnect}
                        className="w-full btn btn-outline rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group"
                    >
                        <Plus className="w-4 h-4 group-hover:bg-white/20 rounded-full" />
                        Connect {platform}
                    </button>
                )}
            </div>
        </div>
    );
}
