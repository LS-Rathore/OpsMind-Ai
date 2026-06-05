import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // limit max height to around 5 rows (approx 120px)
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const wrapperStyle = {
    position: 'relative',
    width: '100%',
  };

  const textareaStyle = {
    backgroundColor: '#121212',
    color: '#f8fafc',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '16px 56px 16px 24px',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '15px',
    letterSpacing: '0',
    width: '100%',
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: isFocused ? '0 0 0 1px rgba(255,255,255,0.1)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
    overflowY: textareaRef.current && textareaRef.current.scrollHeight > 120 ? 'auto' : 'hidden',
    transition: 'all 0.2s ease',
  };

  const isButtonDisabled = isLoading || !text.trim();

  const buttonStyle = {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: isButtonDisabled ? 'rgba(255, 255, 255, 0.05)' : '#1f2228',
    color: isButtonDisabled ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <form onSubmit={handleSubmit} style={wrapperStyle}>
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Ask anything about your SOPs..."
        style={textareaStyle}
      />
      <button type="submit" disabled={isButtonDisabled} style={buttonStyle} title="Send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;
