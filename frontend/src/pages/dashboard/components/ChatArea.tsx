import { Phone, Video, Info, Paperclip, Smile, Send, MoreHorizontal } from 'lucide-react';

export function ChatArea() {
    return (
        <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
            {/* Header */}
            <div className="h-[73px] border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                        S
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">Sarah Johnson</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="text-xs text-slate-500">Active now</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Video className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-2" />
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Info className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                <TimeDivider date="Today, Oct 24" />

                <MessageBubble
                    text="Hi there! I was wondering if you have the black variant in stock?"
                    time="10:23 AM"
                    isIncoming
                />

                <MessageBubble
                    text="Hello Sarah! Yes, we just restocked them this morning."
                    time="10:25 AM"
                    isOutgoing
                    status="read"
                />

                <MessageBubble
                    text="That's great! Do you offer express shipping to NY?"
                    time="10:26 AM"
                    isIncoming
                />

                <MessageBubble
                    text="Absolutely. We have next-day delivery available for NY orders placed before 2 PM."
                    time="10:28 AM"
                    isOutgoing
                    status="delivered"
                />

                <div className="flex justify-center my-4">
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        Sarah is typing...
                    </span>
                </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <textarea
                        className="flex-1 bg-transparent border-0 focus:ring-0 p-2 text-slate-900 placeholder-slate-400 resize-none max-h-32 min-h-[44px]"
                        placeholder="Type a message..."
                        rows={1}
                    />
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">
                    Press <kbd className="font-sans px-1 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-500">Enter</kbd> to send
                </p>
            </div>
        </div>
    );
}

function TimeDivider({ date }: { date: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs font-medium text-slate-400">{date}</span>
            <div className="h-px bg-slate-200 flex-1" />
        </div>
    )
}

interface MessageBubbleProps {
    text: string;
    time: string;
    isIncoming?: boolean;
    isOutgoing?: boolean;
    status?: 'sent' | 'delivered' | 'read';
}

function MessageBubble({ text, time, isIncoming, isOutgoing, status }: MessageBubbleProps) {
    return (
        <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} group`}>
            {isIncoming && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 mr-2 self-end mb-1">
                    S
                </div>
            )}
            <div className={`max-w-[70%] ${isOutgoing ? 'order-1' : 'order-2'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isOutgoing
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                    }`}>
                    {text}
                </div>
                <div className={`flex items-center gap-1 mt-1 px-1 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-slate-400 font-medium">{time}</span>
                    {isOutgoing && status && (
                        <span className="text-slate-400">
                            {/* Simple status indicator logic */}
                            {status === 'read' ? (
                                <div className="flex -space-x-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                </div>
                            ) : status === 'delivered' ? (
                                <div className="flex -space-x-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                </div>
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
