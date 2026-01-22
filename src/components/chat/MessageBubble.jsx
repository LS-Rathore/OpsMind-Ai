import clsx from 'clsx';
import { User, Bot } from 'lucide-react';
import { format } from 'date-fns';
import CitationBadge from './CitationBadge';
import { useState } from 'react';
import PDFPreview from '../pdf/PDFPreview';

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const [previewCitation, setPreviewCitation] = useState(null);

    return (
        <>
            <div className={clsx(
                "group w-full text-gray-100 border-b border-black/5 dark:border-white/5",
                isUser ? "bg-[#2f2f2f]/30" : "bg-transparent"
            )}>
                <div className="max-w-3xl mx-auto px-4 py-8 flex gap-6 m-auto">
                    <div className="flex-shrink-0 flex flex-col relative items-end">
                        <div className={clsx(
                            "w-8 h-8 rounded-sm flex items-center justify-center shrink-0 overflow-hidden",
                            isUser ? "bg-transparent" : "bg-white"
                        )}>
                            {isUser ? (
                                <div className="w-8 h-8 bg-gray-500 rounded-sm flex items-center justify-center">
                                    <User size={20} className="text-white" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full p-1">
                                    <span className="font-bold text-xs">OM</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative flex-1 overflow-hidden pt-1">
                        <div className="font-semibold text-sm mb-1 opacity-90 block md:hidden">
                            {isUser ? "You" : "OpsMind AI"}
                        </div>
                        <div className="prose prose-invert max-w-none leading-7 text-[16px] break-words whitespace-pre-wrap text-gray-100">
                            {message.content}
                        </div>

                        {message.citations && message.citations.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {message.citations.map((citation, index) => (
                                    <CitationBadge
                                        key={index}
                                        citation={citation}
                                        onClick={() => setPreviewCitation(citation)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {previewCitation && (
                <PDFPreview
                    citation={previewCitation}
                    onClose={() => setPreviewCitation(null)}
                />
            )}
        </>
    );
}
