import React, { useState, useEffect, useRef } from 'react';
import * as documentService from '../services/documentService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import ConfirmModal from './ConfirmModal.jsx';

const DocumentModal = ({ isOpen, onClose }) => {
  const { isAdmin, user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [hoveredDelId, setHoveredDelId] = useState(null);
  const [hoveredClose, setHoveredClose] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  const fileInputRef = useRef(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      setUploadError('');
      setUploadSuccess('');
      setUploadProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFile = async (file) => {
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.csv')) {
      setUploadError('Only PDF, DOCX, TXT, and CSV files are allowed');
      setUploadSuccess('');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit');
      setUploadSuccess('');
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await documentService.uploadDocument(file, (p) => setUploadProgress(p));
      setUploadSuccess('✓ Document indexed successfully');
      fetchDocuments();
    } catch (err) {
      setUploadError(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

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
      setDeleteModal({ isOpen: false, id: null, name: '' });
    }
  };

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
  };

  const modalStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-medium)',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '680px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    color: 'var(--text-primary)',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  };

  const headerStyle = {
    padding: '32px 32px 0 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '-0.025em',
  };

  const closeBtnStyle = {
    backgroundColor: 'transparent',
    color: hoveredClose ? 'var(--text-primary)' : 'var(--text-muted)',
    border: 'none',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    lineHeight: 1,
  };

  const contentStyle = {
    padding: '32px',
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  };

  const dropZoneStyle = {
    border: isDragging ? '1px dashed var(--color-accent)' : '1px dashed var(--border-medium)',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    background: isDragging ? 'var(--color-accent-bg)' : 'var(--bg-tertiary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const dropZoneTextPrimary = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    marginBottom: '8px',
  };

  const dropZoneTextSub = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '12px',
    color: 'var(--text-faint)',
  };

  const progressBgStyle = {
    backgroundColor: 'var(--bg-primary)',
    height: '3px',
    width: '100%',
    marginTop: '12px',
    overflow: 'hidden',
  };

  const progressFillStyle = {
    backgroundColor: 'var(--color-accent)',
    height: '100%',
    width: `${uploadProgress}%`,
    transition: 'width 0.1s linear',
  };

  const listHeaderStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '11px',
    color: 'var(--text-faint)',
    letterSpacing: '0.05em',
    marginBottom: '16px',
    fontWeight: '600',
    textTransform: 'uppercase',
  };

  const documentCardStyle = {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
  };

  const docNameStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '380px',
  };

  const docMetaStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  };

  const actionSectionStyle = {
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

  const getVisibilityBadgeStyle = (visibility) => {
    if (visibility === 'public') {
      return {
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        fontSize: '11px',
        fontWeight: '600',
        color: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        padding: '4px 10px',
        borderRadius: '9999px',
        letterSpacing: '0.02em',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      };
    }
    return {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '11px',
      fontWeight: '600',
      color: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
      padding: '4px 10px',
      borderRadius: '9999px',
      letterSpacing: '0.02em',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    };
  };

  const getDeleteBtnStyle = (id) => {
    const isHovered = hoveredDelId === id;
    return {
      backgroundColor: 'transparent',
      color: isHovered ? 'var(--color-danger)' : 'var(--text-muted)',
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

  const statusTextStyle = (isError) => ({
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    color: isError ? 'var(--color-danger)' : 'var(--color-success)',
    marginTop: '8px',
    textAlign: 'center',
  });

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>SOP Documents</h2>
          <button
            onClick={onClose}
            onMouseEnter={() => setHoveredClose(true)}
            onMouseLeave={() => setHoveredClose(false)}
            style={closeBtnStyle}
          >
            &times;
          </button>
        </div>

        <div style={contentStyle}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            style={dropZoneStyle}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              accept=".pdf,.docx,.txt,.csv"
              style={{ display: 'none' }}
            />
            <svg style={{ color: 'var(--text-faint)', width: '32px', height: '32px', marginBottom: '16px', display: 'inline-block' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <div style={dropZoneTextPrimary}>Drop Document here or <span style={{ color: 'var(--color-accent)', cursor: 'pointer' }}>click to browse</span></div>
            <div style={dropZoneTextSub}>PDF, DOCX, TXT, CSV &bull; Max 10MB</div>
            {isUploading && (
              <div style={progressBgStyle}>
                <div style={progressFillStyle} />
              </div>
            )}
          </div>

          {uploadSuccess && <div style={statusTextStyle(false)}>{uploadSuccess}</div>}
          {uploadError && <div style={statusTextStyle(true)}>{uploadError}</div>}

          <div>
            <div style={listHeaderStyle}>INDEXED DOCUMENTS ({documents.length})</div>
            <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
              {documents.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '14px', padding: '16px 0' }}>
                  No documents in the knowledge base.
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc._id} style={documentCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '8px', 
                        backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0
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
                        <div style={docNameStyle} title={doc.originalName}>
                          {doc.originalName}
                        </div>
                        <div style={docMetaStyle}>
                          {doc.totalChunks || 0} chunks &bull; {new Date(doc.createdAt || doc.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={actionSectionStyle}>
                      <span style={getVisibilityBadgeStyle(doc.visibility)}>
                        {doc.visibility === 'public' ? '🌐 PUBLIC' : '🔒 PRIVATE'}
                      </span>
                      <span style={badgeStyle}>{doc.status === 'completed' || doc.status === 'indexed' || doc.status ? 'INDEXED' : doc.status}</span>
                      {(() => {
                        const userId = user?._id || user?.id;
                        const uploaderId = doc.uploadedBy?._id || doc.uploadedBy;
                        const canDelete = isAdmin || (userId && uploaderId && String(userId) === String(uploaderId));
                        return canDelete;
                      })() && (
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
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
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

export default DocumentModal;
