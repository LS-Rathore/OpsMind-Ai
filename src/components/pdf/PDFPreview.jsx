import { X, FileText } from 'lucide-react';

export default function PDFPreview({ isOpen, onClose, citation }) {
    if (!isOpen || !citation) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <FileText className="text-blue-600" size={20} />
                        <h3 className="font-semibold text-slate-800">{citation.documentName}</h3>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            Page {citation.pageNumber}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 bg-slate-100 p-4 overflow-hidden">
                    {/* 
                In a real app, this would be an iframe pointing to the PDF URL 
                or a dedicated PDF viewer component.
                For now, we show a placeholder.
             */}
                    <div className="w-full h-full bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400">
                        <FileText size={48} className="mb-4 opacity-50" />
                        <p>PDF Preview for {citation.documentName}</p>
                        <p className="text-sm">Page {citation.pageNumber}</p>
                        {citation.text && (
                            <div className="mt-8 p-6 bg-yellow-50 max-w-lg text-slate-800 text-sm border-l-4 border-yellow-400">
                                <p className="font-mono text-xs text-yellow-600 mb-2">Excerpt:</p>
                                "{citation.text}"
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
