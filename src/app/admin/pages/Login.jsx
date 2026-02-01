import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const data = {
            email: email,
            password: password
        };

        // Mock Login Check for Admin
        if (email === 'admin@opsmind.ai' && password === 'admin') {
            toast.success("Admin Login Successful! (Mock)");
            localStorage.setItem('admintoken', 'mock-admin-token');
            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 1000);
            setIsLoading(false);
            return;
        }

        try {
            // Using the same endpoint as user login, assuming it handles admin logic/returns role
            const res = await axios.post("http://localhost:3200/api/user/login", data);

            if (res?.data?.role === "admin" || res?.data?.role === "superadmin") { // Adjust role check as needed
                toast.success("Admin Login Successful!");
                localStorage.setItem('admintoken', res?.data?.token);
                // Also setting regular token might be useful if admin also acts as user, but sticking to admintoken as per AdminRoute
                setTimeout(() => {
                    navigate("/admin/dashboard");
                }, 1000);
            } else {
                toast.error("Unauthorized. You do not have admin access.");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Login failed. Please check your credentials.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                theme="dark"
            />
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
                    <div className="text-center mb-8 mt-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-6 border border-slate-700">
                            <Shield className="text-blue-500" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-slate-400 text-sm">Restricted Access</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="admin@opsmind.ai"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Admin Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    'Access Dashboard'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
