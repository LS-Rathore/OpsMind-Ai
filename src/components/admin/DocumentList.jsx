import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../../services/documentService';
import { FileText, Trash2, Calendar, HardDrive, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function DocumentList() {
    const queryClient = useQueryClient();

    const { data: documents, isLoading, error } = useQuery({
        queryKey: ['documents'],
        queryFn: documentService.getDocuments,
    });

    const deleteMutation = useMutation({
        mutationFn: documentService.deleteDocument,
        onSuccess: () => {
            queryClient.invalidateQueries(['documents']);
        },
    });

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 text-slate-400">
                <Loader2 size={32} className="animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-lg flex items-center gap-3 border border-red-900/50">
                <AlertCircle size={24} />
                <div>
                    <p className="font-medium">Failed to load documents</p>
                    <p className="text-sm">Please try refreshing the page.</p>
                </div>
            </div>
        );
    }

    if (!documents?.length) {
        return (
            <div className="text-center p-12 border rounded-xl border-dashed border-slate-800">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 mb-3">
                    <FileText className="text-slate-500" size={24} />
                </div>
                <p className="text-slate-500 font-medium">No documents uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {documents.map((doc) => (
                <div key={doc.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm hover:shadow-md transition-shadow hover:border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-900/20 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-200 truncate max-w-[160px]" title={doc.name}>
                                    {doc.name}
                                </h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/20 text-green-400 font-medium border border-green-900/30">
                                    Indexed
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this document?')) {
                                    deleteMutation.mutate(doc.id);
                                }
                            }}
                            disabled={deleteMutation.isPending}
                            className="text-slate-600 hover:text-red-400 p-1 rounded-lg hover:bg-red-900/20 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="space-y-2 mt-4">
                        <div className="flex items-center text-xs text-slate-500 gap-2">
                            <Calendar size={14} />
                            <span>{doc.createdAt ? format(new Date(doc.createdAt), 'MMM d, yyyy') : 'Unknown Date'}</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 gap-2">
                            <HardDrive size={14} />
                            <span>{formatSize(doc.size || 0)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
