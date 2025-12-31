import { Search, MoreVertical, MessageSquare } from 'lucide-react';

export function ConversationList() {
    return (
        <div className="w-[320px] border-r border-slate-200 bg-white flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900 text-lg">Messages</h2>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-green-50 rounded-lg text-green-600 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="p-4 pb-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search messages..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 text-slate-900 placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Filter Tabs (Optional) */}
            <div className="flex px-4 gap-4 mt-2 mb-2 border-b border-slate-100/50 pb-2">
                <button className="text-sm font-medium text-slate-900 border-b-2 border-green-500 pb-1">All</button>
                <button className="text-sm font-medium text-slate-400 hover:text-slate-600 border-b-2 border-transparent pb-1">Unread</button>
                <button className="text-sm font-medium text-slate-400 hover:text-slate-600 border-b-2 border-transparent pb-1">Archived</button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                <ConversationItem
                    name="Sarah Johnson"
                    message="Hey! I love the new features. When..."
                    time="2m"
                    unread={2}
                    platform="tiktok"
                    active
                />
                <ConversationItem
                    name="Mike Chen"
                    message="Can we schedule a call for tomorrow?"
                    time="15m"
                    platform="whatsapp"
                />
                <ConversationItem
                    name="Emma Wilson"
                    message="Thanks for the help!"
                    time="1h"
                    platform="messenger"
                />
                {[1, 2, 3, 4, 5].map(i => (
                    <ConversationItem
                        key={i}
                        name={`User ${i}`}
                        message="Just checking in..."
                        time="1d"
                        platform="instagram"
                    />
                ))}
                <div className="h-4" /> {/* Spacer */}
            </div>
        </div>
    );
}

function ConversationItem({ name, message, time, unread, active }: any) {
    return (
        <div className={`flex items-center gap-3 p-4 mx-2 rounded-xl cursor-pointer transition-colors ${active ? 'bg-green-50' : 'hover:bg-slate-50'}`}>
            <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium text-lg">
                    {name.charAt(0)}
                </div>
                {/* Platform Badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center">
                    {/* Icon placeholder based on platform */}
                    <div className="w-2 h-2 rounded-full bg-white" />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`text-sm font-semibold truncate ${active ? 'text-slate-900' : 'text-slate-700'}`}>{name}</h3>
                    <span className={`text-xs ${unread ? 'text-green-600 font-medium' : 'text-slate-400'}`}>{time}</span>
                </div>
                <p className={`text-sm truncate ${unread ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                    {message}
                </p>
            </div>
            {unread && (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {unread}
                </div>
            )}
        </div>
    )
}
