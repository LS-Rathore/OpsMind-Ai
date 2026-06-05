import React, { useState, useRef } from 'react';
import * as documentService from '../services/documentService.js';

const DocumentUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      setSuccessMessage('');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit');
      setSuccessMessage('');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsUploading(true);
    setProgress(0);

    try {
      await documentService.uploadDocument(file, (p) => setProgress(p));
      setSuccessMessage('✓ Document indexed successfully');
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const dropZoneStyle = {
    border: isDragging ? '1px dashed #6366f1' : '1px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    background: isDragging ? 'rgba(99, 102, 241, 0.05)' : '#16161a',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  };

  const iconStyle = {
    color: '#a1a1aa',
    width: '32px',
    height: '32px',
    marginBottom: '16px',
    display: 'inline-block',
  };

  const primaryTextStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    color: '#e4e4e7',
    fontWeight: '500',
    marginBottom: '8px',
  };

  const subTextStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '12px',
    color: '#71717a',
  };

  const progressBgStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: '4px',
    width: '100%',
    marginTop: '16px',
    borderRadius: '2px',
    position: 'relative',
    overflow: 'hidden',
  };

  const progressFillStyle = {
    backgroundColor: '#6366f1',
    height: '100%',
    width: `${progress}%`,
    transition: 'width 0.1s linear',
  };

  const statusTextStyle = (isError) => ({
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    color: isError ? '#7d8187' : '#ffffff',
    marginTop: '12px',
  });

  return (
    <div>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerBrowse}
        style={dropZoneStyle}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept=".pdf"
          style={{ display: 'none' }}
        />
        <svg
          style={iconStyle}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <div style={primaryTextStyle}>Drop SOP PDF here or <span style={{ color: '#6366f1', cursor: 'pointer' }}>click to browse</span></div>
        <div style={subTextStyle}>PDF only &bull; Max 10MB</div>

        {isUploading && (
          <div style={progressBgStyle}>
            <div style={progressFillStyle} />
          </div>
        )}
      </div>

      {successMessage && <div style={statusTextStyle(false)}>{successMessage}</div>}
      {error && <div style={statusTextStyle(true)}>{error}</div>}
    </div>
  );
};

export default DocumentUpload;
