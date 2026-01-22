import { FileText } from 'lucide-react';

export default function CitationBadge({ citation, onClick }) {
    return (
        <button
            onClick={() => onClick(citation)}
            className="inline-flex items-center gap-1.5 bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 border border-blue-800 rounded-md px-2 py-0.5 text-xs font-medium transition-colors mx-1 align-baseline cursor-pointer"
        >
            <FileText size={12} />
            <span>{citation.documentName}</span>
            <span className="text-blue-500">|</span>
            <span>p. {citation.pageNumber}</span>
        </button>
    );
}
