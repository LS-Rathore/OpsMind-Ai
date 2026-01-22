import DocumentUpload from '../components/admin/DocumentUpload';
import DocumentList from '../components/admin/DocumentList';

export default function AdminPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-100">Knowledge Base Management</h1>
                <p className="text-slate-400 mt-1">Upload and manage documents for RAG context</p>
            </div>

            <div className="space-y-8">
                <section>
                    <DocumentUpload />
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-100 mb-4">Uploaded Documents</h2>
                    <DocumentList />
                </section>
            </div>
        </div>
    );
}
