import { X, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#171717] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-200">
                <div className="p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <span className="text-2xl font-bold">OM</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Create an account</h2>
                        <p className="text-gray-400 text-sm">
                            Sign in to continue chatting, upload documents, and save your history.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            <LogIn size={18} />
                            Log in
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white py-3 rounded-lg font-medium transition-colors border border-white/5"
                        >
                            Sign up
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            By continuing, you verify that you are an authorized user of OpsMind AI.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
