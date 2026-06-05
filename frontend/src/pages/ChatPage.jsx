import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useSSEChat } from '../hooks/useSSEChat.js';
import ConversationList from '../components/ConversationList.jsx';
import MessageBubble from '../components/MessageBubble.jsx';
import SourcesPanel from '../components/SourcesPanel.jsx';
import ChatInput from '../components/ChatInput.jsx';
import DocumentModal from '../components/DocumentModal.jsx';
import PDFViewerPanel from '../components/PDFViewerPanel.jsx';
import { getDocumentByFilename, getDocumentViewUrl } from '../services/documentService.js';
import { submitMessageFeedback } from '../services/chatService.js';

const ChatPage = () => {
  const {
    messages,
    isLoading,
    sources,
    sendMessage,
    startNewConversation,
    loadConversation,
    currentConversationId,
    setMessages,
  } = useSSEChat();

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState('');
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [pdfViewer, setPdfViewer] = useState(null); // { pdfUrl, filename, pageNumber }

  const handleSourceClick = async (source) => {
    try {
      const doc = await getDocumentByFilename(source.filename);
      if (doc) {
        const pdfUrl = getDocumentViewUrl(doc._id);
        setPdfViewer({
          pdfUrl,
          filename: source.filename,
          pageNumber: source.pageNumber,
        });
      } else {
        console.warn('Document not found for filename:', source.filename);
      }
    } catch (err) {
      console.error('Failed to open PDF viewer:', err);
    }
  };

  const handleFeedback = async (messageId, type) => {
    // Optimistic UI update
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback: type } : msg
      )
    );

    if (currentConversationId) {
      try {
        await submitMessageFeedback(currentConversationId, messageId, type);
      } catch (err) {
        console.error('Failed to submit feedback:', err);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const outerContainerStyle = {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#e2e8f0',
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  };

  const chatAreaStyle = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    boxSizing: 'border-box',
  };

  // Removed topBarStyle and topBarButtonStyle

  const messagesAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '48px 24px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0', // Let MessageBubble handle its own margins
  };

  const emptyStateStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '28px',
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: '-0.02em',
    textAlign: 'center',
    gap: '16px',
  };

  const emptyStateSubtextStyle = {
    fontSize: '15px',
    fontWeight: '400',
    color: '#94a3b8',
    maxWidth: '500px',
    lineHeight: '1.5',
  };

  const panelWrapperStyle = {
    padding: '0 24px',
    backgroundColor: 'transparent',
  };

  const inputAreaStyle = {
    padding: '0 24px 24px 24px',
    backgroundColor: 'transparent',
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
  };

  return (
    <div style={outerContainerStyle}>
      <ConversationList
        onSelect={loadConversation}
        onNew={startNewConversation}
        currentId={currentConversationId}
        user={user}
        logout={logout}
        onDocsClick={() => setIsDocsOpen(true)}
      />
      <div style={chatAreaStyle}>
        {messages.length === 0 ? (
          <div style={emptyStateStyle}>
            Ask anything about your SOPs
          </div>
        ) : (
          <div style={messagesAreaStyle}>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                id={msg.id}
                role={msg.role}
                content={msg.content}
                isStreaming={msg.isStreaming}
                feedback={msg.feedback}
                onFeedback={handleFeedback}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {sources.length > 0 && (
          <div style={panelWrapperStyle}>
            <SourcesPanel sources={sources} onSourceClick={handleSourceClick} />
          </div>
        )}

        <div style={inputAreaStyle}>
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
      <DocumentModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      {pdfViewer && (
        <PDFViewerPanel
          pdfUrl={pdfViewer.pdfUrl}
          filename={pdfViewer.filename}
          pageNumber={pdfViewer.pageNumber}
          onClose={() => setPdfViewer(null)}
        />
      )}
    </div>
  );
};

export default ChatPage;
