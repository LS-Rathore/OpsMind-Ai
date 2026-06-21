import React, { useState, useEffect } from 'react';
import * as documentService from '../services/documentService.js';
import ConfirmModal from './ConfirmModal.jsx';

const DocumentList = ({ refresh }) => {
  const [documents, setDocuments] = useState([]);
  const [hoveredDelId, setHoveredDelId] = useState(null);
  const [reindexingId, setReindexingId] = useState(null);
  const [togglingVisId, setTogglingVisId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refresh]);

  const confirmDelete = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await documentService.deleteDocument(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null, name: '' });
      fetchDocuments();
    } catch (err) {
      console.error('Failed to delete document:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to delete document');
      setDeleteModal({ isOpen: false, id: null, name: '' });
    }
  };

  const handleReindex = async (id) => {
    try {
      setErrorMsg(null);
      setReindexingId(id);
      await documentService.reindexDocument(id);
      fetchDocuments();
    } catch (err) {
      console.error('Failed to reindex document:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to reindex document');
    } finally {
      setReindexingId(null);
    }
  };

  const handleToggleVisibility = async (doc) => {
    const newVisibility = doc.visibility === 'public' ? 'private' : 'public';
    try {
      setErrorMsg(null);
      setTogglingVisId(doc._id);
      await documentService.toggleVisibility(doc._id, newVisibility);
      fetchDocuments();
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to toggle visibility');
    } finally {
      setTogglingVisId(null);
    }
  };

  const containerStyle = {
    backgroundColor: 'transparent',
  };

  const headerStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '11px',
    color: '#a1a1aa',
    letterSpacing: '0.05em',
    marginBottom: '16px',
    fontWeight: '600',
    textTransform: 'uppercase',
  };

  const cardStyle = {
    backgroundColor: '#16161a',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
  };

  const filenameStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    color: '#f4f4f5',
    fontWeight: '600',
  };

  const metaStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    color: '#71717a',
    marginTop: '4px',
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  };

  const badgeStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: '600',
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '4px 10px',
    borderRadius: '9999px',
    letterSpacing: '0.02em',
  };

  const getDeleteBtnStyle = (id) => {
    const isHovered = hoveredDelId === id;
    return {
      backgroundColor: 'transparent',
      color: isHovered ? '#ef4444' : '#71717a',
      border: 'none',
      padding: '4px',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
    };
  };

  const reindexBtnStyle = {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  };

  const getVisibilityBtnStyle = (visibility, isToggling) => {
    const isPublic = visibility === 'public';
    return {
      backgroundColor: isPublic ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
      color: isPublic ? '#3b82f6' : '#f59e0b',
      border: `1px solid ${isPublic ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
      padding: '6px 12px',
      borderRadius: '6px',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '12px',
      fontWeight: '600',
      cursor: isToggling ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
      opacity: isToggling ? 0.5 : 1,
    };
  };

  const emptyStateStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    color: '#7d8187',
    textAlign: 'center',
    padding: '48px',
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>INDEXED DOCUMENTS ({documents.length})</h3>
      
      {errorMsg && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '16px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>&times;</button>
        </div>
      )}

      {documents.length === 0 ? (
        <div style={emptyStateStyle}>No documents uploaded yet</div>
      ) : (
        documents.map((doc) => (
          <div key={doc._id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '8px', 
                backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <div style={filenameStyle}>{doc.originalName}</div>
                <div style={metaStyle}>
                  {doc.totalChunks} chunks &bull; {new Date(doc.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div style={rightSectionStyle}>
              <span style={badgeStyle}>{doc.status === 'completed' || doc.status === 'indexed' || doc.status ? 'INDEXED' : doc.status}</span>
              
              <button
                onClick={() => handleToggleVisibility(doc)}
                disabled={togglingVisId === doc._id}
                style={getVisibilityBtnStyle(doc.visibility, togglingVisId === doc._id)}
                title={`Click to make ${doc.visibility === 'public' ? 'private' : 'public'}`}
              >
                {doc.visibility === 'public' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                )}
                {togglingVisId === doc._id ? 'Updating...' : (doc.visibility === 'public' ? 'Public' : 'Private')}
              </button>
              
              <button
                onClick={() => handleReindex(doc._id)}
                disabled={reindexingId === doc._id}
                style={{
                  ...reindexBtnStyle,
                  opacity: reindexingId === doc._id ? 0.5 : 1,
                  cursor: reindexingId === doc._id ? 'not-allowed' : 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                {reindexingId === doc._id ? 'Reindexing...' : 'Reindex'}
              </button>

              <button
                onClick={() => confirmDelete(doc._id, doc.originalName)}
                onMouseEnter={() => setHoveredDelId(doc._id)}
                onMouseLeave={() => setHoveredDelId(null)}
                style={getDeleteBtnStyle(doc._id)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Delete Document"
        message={`Are you sure you want to completely delete "${deleteModal.name}" and all its indexed vector chunks? This action cannot be undone.`}
        confirmText="Delete Document"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
      />
    </div>
  );
};

export default DocumentList;
