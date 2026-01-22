import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../../services/documentService';
import { UploadCloud, File, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function DocumentUpload() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: (file) => documentService.uploadDocument(file, setProgress),
        onSuccess: () => {
            queryClient.invalidateQueries(['documents']);
            setFile(null);
            setProgress(0);
            // Optional: Show success toast
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to upload document');
            setProgress(0);
        },
    });

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        setError('');
        if (selectedFile.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }
        // 10MB limit
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = () => {
        if (file) {
            uploadMutation.mutate(file);
        }
    };

    return (
        <div className="w-full mb-8">
            <div
                className={clsx(
                    "relative border-2 border-dashed rounded-xl p-8 transition-all text-center",
                    dragActive ? "border-blue-500 bg-blue-900/20" : "border-slate-700 hover:border-blue-500/50",
                    error ? "border-red-500/50 bg-red-900/20" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleChange}
                />

                {!file && !uploadMutation.isPending && (
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-800 text-blue-500 rounded-full flex items-center justify-center mb-4">
                            <UploadCloud size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-200">Click to upload or drag and drop</h3>
                        <p className="text-slate-400 mt-2">PDF files up to 10MB</p>
                    </label>
                )}

                {file && !uploadMutation.isPending && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-4">
                            <File size={32} />
                        </div>
                        <p className="font-medium text-slate-200 mb-4">{file.name}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleUpload}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Upload File
                            </button>
                            <button
                                onClick={() => setFile(null)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {uploadMutation.isPending && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
                            <Loader2 size={32} className="animate-spin" />
                        </div>
                        <p className="font-medium text-slate-300 mb-2">Uploading...</p>
                        <div className="w-full max-w-xs bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute top-4 right-4 text-red-400 flex items-center gap-2 text-sm bg-slate-900 px-3 py-1 rounded-full shadow-sm border border-red-900/50">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
