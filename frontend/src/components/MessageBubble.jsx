import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ id, role, content, sources, isStreaming, feedback, onFeedback }) => {
  const isUser = role === 'user';

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '32px',
    width: '100%',
    maxWidth: '850px',
    margin: '0 auto 32px auto',
  };

  const bubbleStyle = isUser
    ? {
      backgroundColor: '#1f2228',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      color: '#f8fafc',
      maxWidth: '70%',
      borderRadius: '16px',
      padding: '12px 18px',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '15px',
      letterSpacing: '-0.01em',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    }
    : {
      color: '#e2e8f0',
      width: '100%',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '15px',
      letterSpacing: '-0.01em',
      lineHeight: '1.7',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    };

  const timestampStyle = {
    fontFamily: "'Space Mono', ui-monospace, monospace",
    fontSize: '11px',
    color: '#64748b',
    letterSpacing: '0.05em',
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const iconBtnStyle = (isActive, type) => ({
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: isActive ? (type === 'up' ? '#10b981' : '#ef4444') : '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
    borderRadius: '4px',
  });

  const handleThumbClick = (type) => {
    if (!isUser && !isStreaming && onFeedback) {
      onFeedback(id, feedback === type ? null : type);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={bubbleStyle} className="markdown-body">
        {isUser ? (
          content
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}
        {!isUser && isStreaming && <span className="cursor-blink" />}
      </div>
      <div style={timestampStyle}>
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {!isUser && !isStreaming && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button 
              style={iconBtnStyle(feedback === 'up', 'up')}
              onClick={() => handleThumbClick('up')}
              title="Good response"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>
            <button 
              style={iconBtnStyle(feedback === 'down', 'down')}
              onClick={() => handleThumbClick('down')}
              title="Bad response"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
