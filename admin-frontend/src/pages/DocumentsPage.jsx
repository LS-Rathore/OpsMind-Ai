import React, { useState } from 'react';
import DocumentUpload from '../components/DocumentUpload.jsx';
import DocumentList from '../components/DocumentList.jsx';

const DocumentsPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => !prev);
  };

  const titleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '0em',
    marginBottom: '24px',
  };

  const containerStyle = {
    maxWidth: '680px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    margin: '40px auto',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>SOP Documents</h1>
      
      <DocumentUpload onUploadSuccess={handleUploadSuccess} />
      <div style={{ height: '32px' }} />
      <DocumentList refresh={refreshTrigger} />
    </div>
  );
};

export default DocumentsPage;
