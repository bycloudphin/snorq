
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface Conversation {
    id: string;
    contactName: string;
    contactAvatarUrl?: string;
    lastMessagePreview: string;
    lastMessageAt: string;
    unreadCount: number;
    platform: 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP';
}

interface Message {
    id: string;
    content: string;
    direction: 'INBOUND' | 'OUTBOUND';
    createdAt: string;
}

export function InboxPage() {
    const { accessToken, organizations } = useAuth();
    const { socket } = useSocket();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [inputMessage, setInputMessage] = useState('');

    // Auto-scroll to bottom of chat
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const organizationId = organizations?.[0]?.id; // Assuming first org for now
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

    // Fetch Conversations
    const fetchConversations = async () => {
        if (!organizationId || !accessToken) return;
        setIsLoadingConversations(true);
        try {
            const res = await fetch(`${API_URL}/organizations/${organizationId}/conversations`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (data.success) {
                setConversations(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        } finally {
            setIsLoadingConversations(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [organizationId, accessToken, API_URL]);

    // WebSocket Listener for New Messages
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: { conversationId: string, message: any, conversation?: any }) => {
            console.log('socket event: new_message', data);

            // 1. Update Messages list if this is the active conversation
            if (selectedConversationId === data.conversationId) {
                setMessages((prev) => {
                    if (prev.some(m => m.id === data.message.id)) return prev;
                    return [...prev, data.message];
                });
            }

            // 2. Update Conversations list
            setConversations((prev) => {
                const existingConvIndex = prev.findIndex(c => c.id === data.conversationId);
                let newConvs = [...prev];

                if (existingConvIndex !== -1) {
                    const conv = { ...newConvs[existingConvIndex] };
                    conv.lastMessagePreview = data.message.content;
                    conv.lastMessageAt = data.message.platformTimestamp || data.message.createdAt;

                    if (selectedConversationId !== data.conversationId) {
                        conv.unreadCount += 1;
                    }

                    newConvs.splice(existingConvIndex, 1);
                    newConvs.unshift(conv);
                } else if (data.conversation) {
                    newConvs.unshift(data.conversation);
                }
                return newConvs;
            });
        };

        socket.on('new_message', handleNewMessage);
        return () => { socket.off('new_message', handleNewMessage); };
    }, [socket, selectedConversationId]);

    // Fetch Messages when conversation selected
    useEffect(() => {
        if (!selectedConversationId || !accessToken) return;

        async function fetchMessages() {
            try {
                const res = await fetch(`${API_URL}/conversations/${selectedConversationId}/messages`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const data = await res.json();
                if (data.success) {
                    setMessages(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch messages', error);
            }
        }

        fetchMessages();
    }, [selectedConversationId, accessToken, API_URL]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    async function handleSendMessage() {
        if (!inputMessage.trim() || !selectedConversationId || !accessToken) return;

        const originalMessage = inputMessage;
        setInputMessage('');

        const tempId = `temp-${Date.now()}`;
        setMessages(prev => [...prev, {
            id: tempId,
            content: originalMessage,
            direction: 'OUTBOUND',
            createdAt: new Date().toISOString()
        }]);

        try {
            const res = await fetch(`${API_URL}/conversations/${selectedConversationId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ content: originalMessage })
            });

            const data = await res.json();
            if (!data.success) {
                setMessages(prev => prev.filter(m => m.id !== tempId));
                alert('Failed to send message');
                setInputMessage(originalMessage);
            } else {
                setMessages(prev => prev.map(m => m.id === tempId ? data.data : m));
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setInputMessage(originalMessage);
        }
    }

    async function handleSync() {
        if (!organizationId || !accessToken || isSyncing) return;
        setIsSyncing(true);
        try {
            const res = await fetch(`${API_URL}/organizations/${organizationId}/sync`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (data.success) {
                await fetchConversations();
            }
        } catch (error) {
            console.error('Failed to sync', error);
        } finally {
            setIsSyncing(false);
        }
    }

    return (
        <div className="flex h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Sidebar: Conversation List */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Inbox</h2>
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={`p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all ${isSyncing ? 'opacity-50' : ''}`}
                            title="Sync conversations"
                        >
                            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoadingConversations && conversations.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-sm">Loading chats...</div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <p className="text-sm">No conversations yet.</p>
                            <p className="text-xs mt-2 text-slate-400">Connect a page and receive a message to start.</p>
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversationId(conv.id)}
                                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-white ${selectedConversationId === conv.id ? 'bg-white border-l-4 border-l-green-500 shadow-sm' : 'border-l-4 border-l-transparent'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="relative shrink-0">
                                        {conv.contactAvatarUrl ? (
                                            <img src={conv.contactAvatarUrl} alt="" className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 font-bold text-sm">
                                                {conv.contactName?.[0]?.toUpperCase() || '?'}
                                            </div>
                                        )}
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold ${conv.platform === 'FACEBOOK' ? 'bg-blue-600' :
                                                conv.platform === 'INSTAGRAM' ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' :
                                                    'bg-slate-400'
                                            }`}>
                                            <span className="text-white">{conv.platform[0]}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-semibold text-slate-800 truncate pr-1 text-sm">{conv.contactName || 'Unknown User'}</h3>
                                            {conv.lastMessageAt && (
                                                <span className="text-[10px] text-slate-400 whitespace-nowrap pt-0.5">
                                                    {format(new Date(conv.lastMessageAt), 'h:mm a')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">
                                            {conv.lastMessagePreview || 'No messages'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Area: Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                {selectedConversation.contactAvatarUrl ? (
                                    <img src={selectedConversation.contactAvatarUrl} alt="" className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                        {selectedConversation.contactName?.[0]?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-slate-800">{selectedConversation.contactName}</h3>
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Active via {selectedConversation.platform}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><Phone className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><Video className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {messages.map((msg) => {
                                const isInbound = msg.direction === 'INBOUND';
                                return (
                                    <div key={msg.id} className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${isInbound
                                            ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                                            : 'bg-green-600 text-white rounded-tr-sm'
                                            }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isInbound ? 'text-slate-400' : 'text-green-200'}`}>
                                                {format(new Date(msg.createdAt), 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex items-end gap-2 max-w-4xl mx-auto bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-green-500/50 focus-within:ring-4 focus-within:ring-green-500/10 transition-all shadow-sm">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 resize-none py-2.5 max-h-32 text-sm"
                                    rows={1}
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            await handleSendMessage();
                                        }
                                    }}
                                />
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors">
                                    <Smile className="w-5 h-5" />
                                </button>
                                <button
                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!inputMessage.trim()}
                                    onClick={handleSendMessage}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                            <Send className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">Select a conversation</p>
                        <p className="text-sm text-slate-400 mt-2">Choose a chat from the sidebar to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
