import React, { useState, useEffect } from 'react';

const PDFViewerPanel = ({ pdfUrl, filename, pageNumber, searchText, onClose }) => {
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [error, setError] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pdfUrl) return;

    setLoading(true);
    setError(null);
    setBlobUrl(null);

    fetch(pdfUrl)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load PDF');
        }
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [pdfUrl]);

  if (!pdfUrl) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '480px',
    backgroundColor: '#0f0f11',
    borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInFromRight 0.3s ease-out',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    flexShrink: 0,
  };

  const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    overflow: 'hidden',
    flex: 1,
  };

  const iconWrapperStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const titleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    color: '#f8fafc',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const subtitleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '2px',
  };

  const closeBtnStyle = {
    background: isCloseHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
    border: 'none',
    color: isCloseHovered ? '#ffffff' : '#94a3b8',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  };

  const iframeContainerStyle = {
    flex: 1,
    overflow: 'hidden',
  };

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: '#1a1a1a',
  };

  const errorContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    textAlign: 'center',
    gap: '16px',
  };

  const errorIconStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const errorTitleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '16px',
    fontWeight: '600',
    color: '#f8fafc',
  };

  const errorTextStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: '1.6',
    maxWidth: '340px',
  };

  const loadingContainerStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const spinnerStyle = {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  // Build the URL with native PDF search parameter
  let fullUrl = null;
  if (blobUrl) {
    fullUrl = `${blobUrl}#page=${pageNumber}`;
    if (searchText) {
      // Encode first ~40 chars to ensure it finds a robust match without breaking URL limits
      const cleanSearch = searchText.substring(0, 40).replace(/\s+/g, ' ').trim();
      if (cleanSearch) {
        fullUrl += `&search=${encodeURIComponent(`"${cleanSearch}"`)}`;
      }
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <div style={iconWrapperStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={titleStyle} title={filename}>{filename}</div>
            <div style={subtitleStyle}>Page {pageNumber}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          style={closeBtnStyle}
          title="Close viewer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {loading && (
        <div style={loadingContainerStyle}>
          <div style={spinnerStyle} />
        </div>
      )}

      {error && (
        <div style={errorContainerStyle}>
          <div style={errorIconStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div style={errorTitleStyle}>PDF Not Available</div>
          <div style={errorTextStyle}>
            This document was uploaded before PDF viewing was enabled. Please re-upload the document to enable the in-app viewer.
          </div>
        </div>
      )}

      {!loading && !error && fullUrl && (
        <div style={iframeContainerStyle}>
          <iframe
            src={fullUrl}
            style={iframeStyle}
            title={`PDF Viewer - ${filename}`}
          />
        </div>
      )}
    </div>
  );
};

export default PDFViewerPanel;
