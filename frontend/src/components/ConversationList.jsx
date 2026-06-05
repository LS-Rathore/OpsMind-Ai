import React, { useState, useEffect } from 'react';
import * as chatService from '../services/chatService.js';
import * as documentService from '../services/documentService.js';
import ConfirmModal from './ConfirmModal.jsx';

const ConversationList = ({ onSelect, onNew, currentId, user, logout, onDocsClick }) => {
  const [conversations, setConversations] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [hoveredAction, setHoveredAction] = useState({ id: null, type: null });
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [docCount, setDocCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
    const fetchDocsCount = async () => {
      try {
        const docs = await documentService.getDocuments();
        setDocCount(docs.length);
      } catch (err) {
        console.error('Failed to fetch doc count:', err);
      }
    };
    fetchDocsCount();
  }, [currentId]);

  const confirmDelete = (e, id) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await chatService.deleteConversation(deleteModal.id);
      fetchConversations();
      if (currentId === deleteModal.id) {
        onNew();
      }
      setDeleteModal({ isOpen: false, id: null });
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const startRename = (e, convo) => {
    e.stopPropagation();
    setEditingId(convo._id);
    setEditTitle(convo.title);
  };

  const handleRenameSubmit = async (id) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await chatService.renameConversation(id, editTitle.trim());
      setEditingId(null);
      fetchConversations();
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  const containerStyle = {
    backgroundColor: '#121212',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    width: '280px',
    flexShrink: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    boxSizing: 'border-box',
  };

  const headerStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '18px',
    color: '#ffffff',
    letterSpacing: '0.02em',
    marginBottom: '32px',
    fontWeight: '800',
    paddingLeft: '12px',
    textTransform: 'uppercase',
  };

  const newChatBtnStyle = {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'opacity 0.2s ease',
    opacity: isBtnHovered ? '0.9' : '1',
  };

  const sectionLabelStyle = {
    fontFamily: "'Space Mono', ui-monospace, monospace",
    fontSize: '11px',
    color: '#6b7280',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '12px',
    paddingLeft: '12px',
    fontWeight: '600',
  };

  const listStyle = {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const getItemStyle = (id) => {
    const isActive = currentId === id;
    const isHovered = hoveredId === id;
    return {
      padding: '10px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      color: isActive || isHovered ? '#f8fafc' : '#94a3b8',
      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : isHovered ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      transition: 'all 0.2s ease',
      fontWeight: '500',
    };
  };

  const textContainerStyle = {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const actionsContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const getActionBtnStyle = (id, type) => {
    const isHovered = hoveredAction.id === id && hoveredAction.type === type;
    return {
      background: 'transparent',
      border: 'none',
      color: isHovered ? '#ffffff' : '#7d8187',
      cursor: 'pointer',
      padding: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.15s ease',
    };
  };

  const renameInputStyle = {
    background: '#131312',
    border: '1px solid #1f2228',
    color: '#ffffff',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    padding: '4px 6px',
    borderRadius: '4px',
    width: '100%',
    outline: 'none',
  };

  // Profile Section Styles
  const profileContainerStyle = {
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '16px',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    paddingLeft: '12px',
    paddingRight: '12px',
  };

  const profileInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    overflow: 'hidden',
    flex: 1,
  };

  const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const detailsStyle = {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const emailStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    fontWeight: '500',
    color: '#e5e7eb',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const roleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '2px',
  };

  const logoutBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: isLogoutHovered ? '#ffffff' : '#7d8187',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  };

  const userInitial = user?.email ? user.email.charAt(0) : 'U';

  const [isDocsHovered, setIsDocsHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '4px' }}>
        <div style={{ width: '28px', height: '28px', backgroundColor: '#1a1a24', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '14px', height: '14px', color: '#3b82f6' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
        <div style={{ fontFamily: 'Inter, ui-sans-serif', fontSize: '15px', fontWeight: '700', color: '#f8fafc', letterSpacing: '-0.025em' }}>
          OPSMIND AI
        </div>
      </div>
      <button
        onClick={onNew}
        onMouseEnter={() => setIsBtnHovered(true)}
        onMouseLeave={() => setIsBtnHovered(false)}
        style={newChatBtnStyle}
      >
        <span>New Chat</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <div style={sectionLabelStyle}>RECENT SESSIONS</div>
      <div style={listStyle}>
        {conversations.map((convo) => (
          <div
            key={convo._id}
            onClick={() => {
              if (editingId !== convo._id) {
                onSelect(convo);
              }
            }}
            onMouseEnter={() => setHoveredId(convo._id)}
            onMouseLeave={() => {
              setHoveredId(null);
              setHoveredAction({ id: null, type: null });
            }}
            style={getItemStyle(convo._id)}
            title={convo.title}
          >
            {editingId === convo._id ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleRenameSubmit(convo._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit(convo._id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                style={renameInputStyle}
              />
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <div style={textContainerStyle}>{convo.title}</div>
                </div>
                {hoveredId === convo._id && (
                  <div style={actionsContainerStyle}>
                    <button
                      onClick={(e) => startRename(e, convo)}
                      onMouseEnter={() => setHoveredAction({ id: convo._id, type: 'rename' })}
                      onMouseLeave={() => setHoveredAction({ id: null, type: null })}
                      style={getActionBtnStyle(convo._id, 'rename')}
                      title="Rename"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => confirmDelete(e, convo._id)}
                      onMouseEnter={() => setHoveredAction({ id: convo._id, type: 'delete' })}
                      onMouseLeave={() => setHoveredAction({ id: null, type: null })}
                      style={getActionBtnStyle(convo._id, 'delete')}
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px', marginBottom: '8px' }}>
        <div style={sectionLabelStyle}>KNOWLEDGE</div>
        <div
          onClick={onDocsClick}
          onMouseEnter={() => setIsDocsHovered(true)}
          onMouseLeave={() => setIsDocsHovered(false)}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: isDocsHovered ? '#e5e7eb' : '#9ca3af',
            backgroundColor: isDocsHovered ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: '13.5px',
            letterSpacing: '0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Documents
          </div>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600'
          }}>{docCount}</div>
        </div>
      </div>

      {user && (
        <div style={profileContainerStyle}>
          <div style={profileInfoStyle}>
            <div style={avatarStyle}>{userInitial}</div>
            <div style={detailsStyle}>
              <span style={emailStyle}>{user.email}</span>
              <span style={roleStyle}>{user.role || 'User'}</span>
            </div>
          </div>
          <button
            onClick={logout}
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
            style={logoutBtnStyle}
            title="Sign Out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      )}
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete Conversation"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default ConversationList;
