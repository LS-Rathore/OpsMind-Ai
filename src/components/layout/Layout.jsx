import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Upload, LogOut, Menu, X, User, Plus, LayoutDashboard } from 'lucide-react';
import clsx from 'clsx';
import { chatService } from '../../services/chatService';
import ConversationList from '../chat/ConversationList';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const queryClient = useQueryClient();

    const isChatPage = location.pathname === '/';
    const activeConversationId = searchParams.get('c');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Fetch conversations only if we are on the chat page (or always if we want sidebar persistence)
    // For a pervasive sidebar, we fetch always.
    const { data: conversations = [], isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: chatService.getConversations,
        enabled: !!user // Only fetch if logged in
    });

    const handleNewChat = () => {
        navigate('/');
    };

    const handleDeleteConversation = async (id) => {
        await chatService.deleteConversation(id);
        queryClient.invalidateQueries(['conversations']);
        if (activeConversationId === id) {
            navigate('/');
        }
    };

    const handleSelectConversation = (id) => {
        navigate(`/?c=${id}`);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-[#212121]">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-30 w-[260px] bg-[#171717] text-gray-100 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header: New Chat */}
                <div className="p-3 mb-2 flex-shrink-0">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center gap-3 hover:bg-[#212121] text-gray-100 py-3 px-3 rounded-lg transition-colors text-sm border border-transparent hover:border-gray-700/50 text-left group"
                    >
                        <div className="bg-white text-black p-1 rounded-full group-hover:bg-gray-200 transition-colors">
                            <Plus size={16} strokeWidth={3} />
                        </div>
                        <span className="font-medium">New chat</span>
                    </button>

                    <div className="mt-4 px-2">
                        <div className="text-xs font-semibold text-gray-500 mb-2">Platform</div>
                        {user?.role === 'admin' && (
                            <NavLink
                                to="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => clsx(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm mb-1",
                                    isActive
                                        ? "bg-[#212121] text-gray-100"
                                        : "text-gray-300 hover:bg-[#212121]"
                                )}
                            >
                                <LayoutDashboard size={18} />
                                <span>Admin Dashboard</span>
                            </NavLink>
                        )}
                        <NavLink
                            to="/"
                            end // Exact match for root
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                                isActive && !activeConversationId
                                    ? "bg-[#212121] text-gray-100"
                                    : "text-gray-300 hover:bg-[#212121]"
                            )}
                        >
                            <MessageSquare size={18} />
                            <span>Chat</span>
                        </NavLink>
                    </div>
                </div>

                {/* Body: Conversation List */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <div className="px-5 pb-2 text-xs font-semibold text-gray-500 mt-2">History</div>
                    <ConversationList
                        conversations={conversations}
                        activeId={activeConversationId}
                        onSelect={handleSelectConversation}
                        onDelete={handleDeleteConversation}
                    />
                </div>

                {/* Footer: User Profile */}
                <div className="p-3 border-t border-white/5 flex-shrink-0">
                    {user ? (
                        <div className="flex items-center gap-3 px-2 py-3 hover:bg-[#212121] rounded-lg cursor-pointer transition-colors group">
                            <div className="w-8 h-8 rounded-sm bg-gray-600 flex items-center justify-center text-white shrink-0">
                                <User size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-gray-200">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                                title="Sign out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            className="flex items-center gap-3 px-2 py-3 hover:bg-[#212121] rounded-lg cursor-pointer transition-colors text-gray-300 hover:text-gray-100"
                        >
                            <div className="w-8 h-8 rounded-sm bg-gray-700/50 flex items-center justify-center shrink-0">
                                <User size={16} />
                            </div>
                            <div className="flex-1 text-sm font-medium">
                                Sign In
                            </div>
                        </NavLink>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full relative">
                {/* Mobile Header */}
                <header className="lg:hidden bg-[#171717] p-4 flex items-center justify-between z-10 sticky top-0">
                    <h1 className="font-bold text-gray-100">OpsMind AI</h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-400 hover:bg-[#212121] rounded-lg"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                <main className="flex-1 h-full overflow-hidden relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
