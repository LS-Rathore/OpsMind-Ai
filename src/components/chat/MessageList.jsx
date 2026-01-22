import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages, isStreaming, onCitationClick }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isStreaming]);

    return (
        <div className="flex-1 overflow-y-auto w-full">
            <div className="flex flex-col pb-4">
                {messages.map((msg, idx) => (
                    <MessageBubble
                        key={msg.id || idx}
                        message={msg}
                        onCitationClick={onCitationClick}
                    />
                ))}

                {isStreaming && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                        <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        </div>
    );
}
