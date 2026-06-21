import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', type = 'danger' }) => {
  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  };

  const modalStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-medium)',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '12px',
  };

  const messageStyle = {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '24px',
  };

  const btnContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  };

  const cancelBtnStyle = {
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-medium)',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const isDanger = type === 'danger';
  const confirmBtnStyle = {
    backgroundColor: isDanger ? '#ef4444' : '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={messageStyle}>{message}</div>
        <div style={btnContainerStyle}>
          <button 
            style={cancelBtnStyle} 
            onClick={onCancel}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Cancel
          </button>
          <button 
            style={confirmBtnStyle} 
            onClick={onConfirm}
            onMouseEnter={(e) => e.target.style.backgroundColor = isDanger ? '#dc2626' : '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = isDanger ? '#ef4444' : '#3b82f6'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
