import { Link, useLocation } from 'react-router-dom';
import {
    MessageSquare,
    Settings,
    LayoutGrid,
    LogOut,
    Inbox
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="w-[280px] bg-slate-900 h-screen flex flex-col text-slate-300">
            {/* Logo */}
            <div className="p-6">
                <Link to="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">SNORQ</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Menu
                </p>

                <NavItem
                    to="/dashboard"
                    icon={<LayoutGrid className="w-5 h-5" />}
                    label="Overview"
                    active={isActive('/dashboard')}
                />
                <NavItem
                    to="/dashboard/chat"
                    icon={<Inbox className="w-5 h-5" />}
                    label="Inbox"
                    active={isActive('/dashboard/chat')}
                    badge="12"
                />
                <NavItem
                    to="/dashboard/channels"
                    icon={<MessageSquare className="w-5 h-5" />}
                    label="Channels"
                    active={isActive('/dashboard/channels')}
                />
                {/*
                <NavItem
                    to="/dashboard/contacts"
                    icon={<Users className="w-5 h-5" />}
                    label="Contacts"
                    active={isActive('/dashboard/contacts')}
                />
                */}

                <div className="pt-8">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                        System
                    </p>
                    <NavItem
                        to="/dashboard/settings"
                        icon={<Settings className="w-5 h-5" />}
                        label="Settings"
                        active={isActive('/dashboard/settings')}
                    />
                </div>
            </nav>

            {/* Profile */}
            <UserSection />
        </aside>
    );
}

function UserSection() {
    const { logout, user } = useAuth();
    // Get initials from name or email
    const getInitials = () => {
        if (user?.name) {
            return user.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.substring(0, 2).toUpperCase() || '??';
    };

    if (!user) return null;

    return (
        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium border-2 border-slate-600 group-hover:border-slate-500">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name || 'User'} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        getInitials()
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering parent click if any
                        logout();
                    }}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    badge?: string;
}

function NavItem({ to, icon, label, active, badge }: NavItemProps) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? 'bg-green-500 text-white shadow-lg shadow-green-900/20 font-medium'
                : 'hover:bg-slate-800 hover:text-white'
                }`}
        >
            <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}>
                {icon}
            </span>
            <span className="flex-1">{label}</span>
            {badge && (
                <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${active ? 'bg-white/20 text-white' : 'bg-green-500 text-white'
                        }`}
                >
                    {badge}
                </span>
            )}
        </Link>
    );
}
