import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LayoutDashboard } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
    const token = localStorage.getItem("admintoken")
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    const Logout = () => {
        if (token) {
            localStorage.removeItem('admintoken')
        }
        navigate("/admin/login")
    }

    return (
        <div className="flex h-screen bg-[#212121]">
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={clsx(
                "fixed inset-y-0 left-0 z-30 w-[260px] bg-[#171717] text-gray-100 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-3 mb-2 flex-shrink-0">
                    <button
                        className="w-full flex items-center gap-3 hover:bg-[#212121] text-gray-100 py-3 px-3 rounded-lg transition-colors text-sm border border-transparent hover:border-gray-700/50 text-left group"
                    >
                        <div className="bg-white text-black p-1 rounded-full group-hover:bg-gray-200 transition-colors">
                            <span className="text-1xl">⚡</span>

                        </div>
                        <span className="font-medium">OpsMindAI Admin</span>
                    </button>


                    <div className="mt-4 px-2">
                        {token &&
                            <>
                                <NavLink
                                    to="/admin/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => clsx(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm mb-1",
                                        isActive
                                            ? "bg-[#212121] text-gray-100"
                                            : "text-gray-300 hover:bg-[#212121]"
                                    )}
                                >
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </NavLink>
                                <NavLink
                                    to="/admin/userslist"
                                    end // Exact match for root
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => clsx(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                                        isActive && !activeConversationId
                                            ? "bg-[#212121] text-gray-100"
                                            : "text-gray-300 hover:bg-[#212121]"
                                    )}
                                >
                                    <User size={18} />
                                    <span>Users List</span>
                                </NavLink>
                                <NavLink
                                    to="/admin/profile"
                                    end // Exact match for root
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => clsx(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                                        isActive && !activeConversationId
                                            ? "bg-[#212121] text-gray-100"
                                            : "text-gray-300 hover:bg-[#212121]"
                                    )}
                                >
                                    <User size={18} />
                                    <span>Profile</span>
                                </NavLink>
                            </>
                        }
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col min-h-0">

                </div>
                <div className="p-3 border-t border-white/5 flex-shrink-0">
                    <NavLink
                        to="/login"
                        onClick={Logout}
                        className="flex items-center gap-3 px-2 py-3 hover:bg-[#212121] rounded-lg cursor-pointer transition-colors text-gray-300 hover:text-gray-100"
                    >
                        <div className="w-8 h-8 rounded-sm bg-gray-700/50 flex items-center justify-center shrink-0">
                            <User size={16} />
                        </div>
                        <div className="flex-1 text-sm font-medium">
                            Logout
                        </div>
                    </NavLink>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full relative">
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
