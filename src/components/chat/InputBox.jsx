import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import clsx from 'clsx';

export default function InputBox({ onSend, onUpload, disabled }) {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (!input.trim() || disabled) return;
        onSend(input);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 pb-6 pt-2 w-full">
            <div className="relative flex items-center w-full p-3 bg-[#2f2f2f] rounded-xl border border-white/10 shadow-xl focus-within:border-gray-500/50 focus-within:ring-1 focus-within:ring-gray-500/20 transition-all">
                <button
                    onClick={onUpload}
                    disabled={disabled}
                    className="p-2 mr-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                    <Paperclip size={20} />
                </button>

                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message OpsMind..."
                    className="flex-1 max-h-[200px] py-2 bg-transparent resize-none border-none focus:ring-0 text-gray-100 placeholder:text-gray-400 text-base leading-relaxed overflow-y-auto"
                    rows={1}
                    disabled={disabled}
                    style={{ minHeight: '44px' }}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || disabled}
                    className={clsx(
                        "p-2 rounded-lg transition-all ml-2",
                        input.trim() && !disabled
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-transparent text-gray-500 cursor-not-allowed"
                    )}
                >
                    <Send size={18} />
                </button>
            </div>
            <div className="text-center mt-2 text-xs text-gray-500">
                OpsMind can make mistakes. Consider checking important information.
            </div>
        </div>
    );
}
