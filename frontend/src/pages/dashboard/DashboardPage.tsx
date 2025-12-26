import { MessageSquare, Settings, LogOut, Inbox } from 'lucide-react';

export function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                {/* Logo */}
                <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold">SNORQ</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        <li>
                            <a
                                href="#"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white"
                            >
                                <Inbox className="w-5 h-5" />
                                <span>Inbox</span>
                                <span className="ml-auto bg-primary-500 text-xs px-2 py-0.5 rounded-full">
                                    12
                                </span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* User */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-sm font-medium">
                            U
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">User</p>
                            <p className="text-xs text-slate-400 truncate">user@example.com</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex">
                {/* Conversation List */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                        <input
                            type="search"
                            placeholder="Search conversations..."
                            className="input"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {/* Empty state */}
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="font-medium text-slate-900 mb-1">No conversations yet</h3>
                            <p className="text-sm text-slate-500">
                                Connect your social accounts to start receiving messages.
                            </p>
                            <button className="btn btn-primary mt-4">
                                Connect Accounts
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-10 h-10 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            Select a conversation
                        </h2>
                        <p className="text-slate-500">
                            Choose a conversation from the list to start chatting.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
