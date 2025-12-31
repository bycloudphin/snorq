import { MessageSquare, Users, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';

export function DashboardHome() {
    return (
        <div className="flex-1 overflow-y-auto p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Messages"
                    value="12,456"
                    change="+12%"
                    icon={<MessageSquare className="w-5 h-5 text-white" />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Conversations"
                    value="42"
                    change="+5%"
                    icon={<Users className="w-5 h-5 text-white" />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Avg Response Time"
                    value="1m 30s"
                    change="-15%"
                    icon={<Clock className="w-5 h-5 text-white" />}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Conversion Rate"
                    value="3.2%"
                    change="+0.5%"
                    icon={<TrendingUp className="w-5 h-5 text-white" />}
                    color="bg-purple-500"
                />
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-900">Message Volume</h3>
                        <select className="text-sm border-slate-200 rounded-lg text-slate-600">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                        Chart Placeholder
                    </div>
                </div>

                {/* Right Side Info */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-900 font-medium">New message from Sarah</p>
                                    <p className="text-xs text-slate-500">2 minutes ago • TikTok</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 btn btn-outline rounded-xl py-2.5 text-sm">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon, color }: any) {
    const isPositive = change.startsWith('+');
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-black/5 ${color}`}>
                    {icon}
                </div>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4 rotate-180" />}
                {change}
                <span className="text-slate-400 font-normal ml-1">vs last week</span>
            </div>
        </div>
    )
}
