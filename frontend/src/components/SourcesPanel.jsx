import React, { useState } from 'react';

const SourcesPanel = ({ sources, onSourceClick }) => {
  if (!sources || sources.length === 0) return null;

  const [activeTooltipIdx, setActiveTooltipIdx] = useState(null);

  const containerStyle = {
    background: 'transparent',
    borderTop: '1px solid var(--border-medium)',
    paddingTop: '12px',
    marginTop: '8px',
    position: 'relative',
  };

  const titleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '11px',
    color: 'var(--text-faint)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    width: '100%',
  };

  const listStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '8px',
    scrollbarWidth: 'thin',
  };

  const cardStyle = (isHovered) => ({
    background: isHovered ? 'var(--border-subtle)' : 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    padding: '12px 16px',
    minWidth: '220px',
    maxWidth: '280px',
    flexShrink: 0,
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  });

  const filenameStyle = {
    color: 'var(--text-primary)',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '4px',
  };

  const pageStyle = {
    color: 'var(--text-muted)',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '11px',
  };

  const tooltipStyle = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-strong)',
    borderRadius: '4px',
    padding: '12px',
    width: '280px',
    color: 'var(--text-secondary)',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    lineHeight: '1.4',
    boxShadow: '0 -8px 24px rgba(0,0,0,0.5)',
    zIndex: 100,
    marginBottom: '8px',
    pointerEvents: 'none',
  };

  const arrowStyle = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    marginLeft: '-5px',
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: 'var(--border-strong) transparent transparent transparent',
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>
        <span>SOURCES ({sources.length})</span>
        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          Verified
        </span>
      </div>
      <div style={listStyle}>
        {sources.map((source, idx) => {
          const isHovered = activeTooltipIdx === idx;
          return (
            <div
              key={idx}
              style={cardStyle(isHovered)}
              onMouseEnter={() => setActiveTooltipIdx(idx)}
              onMouseLeave={() => setActiveTooltipIdx(null)}
              onClick={() => onSourceClick && onSourceClick(source)}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '6px', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <text x="8" y="16" fontFamily="sans-serif" fontSize="6" stroke="none" fill="#ef4444" fontWeight="bold">PDF</text>
                </svg>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={filenameStyle} title={source.filename}>
                  {source.filename}
                </div>
                <div style={pageStyle}>Page {source.pageNumber} &bull; Reference Found</div>
              </div>

              {isHovered && (
                <div style={tooltipStyle}>
                  {source.text}
                  <div style={arrowStyle} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SourcesPanel;
