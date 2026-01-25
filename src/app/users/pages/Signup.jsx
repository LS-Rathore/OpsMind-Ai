import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify"
// import { authService } from '../services/authService';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const data = {
            fullname: name,
            email: email,
            mobile: mobile,
            password: password
        }

        try {
            await axios.post("http://localhost:3200/api/user/signup", data)
            toast.success("SignUp Successfully!")
            setTimeout(() => {
                navigate("/login")
            }, 1000)
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong. Try again!");
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
                            <span className="text-3xl">⚡</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Sign Up</h1>
                        {/* <p className="text-slate-400 text-sm">Join OpsMind AI today</p> */}
                    </div>

                    <div className="p-8 pt-0">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="text"
                                        required
                                        name='fullname'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter Your Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="email"
                                        required
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={10} />
                                    <input
                                        type="number"
                                        required
                                        name='mobile'
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter Mobile Number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        name='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        data-testid="toggle-icon"
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
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign Up'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
