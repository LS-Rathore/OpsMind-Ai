import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';
import { useGuestUsage } from '../hooks/useGuestUsage';
import { useSSE } from '../hooks/useSSE';
import { Loader2 } from 'lucide-react';

import ChatWindow from '../components/chat/ChatWindow';
import ConversationList from '../components/chat/ConversationList';
import MessageList from '../components/chat/MessageList';
import InputBox from '../components/chat/InputBox';
import PDFPreview from '../components/pdf/PDFPreview';
import LoginModal from '../components/auth/LoginModal';

export default function ChatPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const conversationId = searchParams.get('c');

    const [messages, setMessages] = useState([]);
    const [previewCitation, setPreviewCitation] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const { user } = useAuth();
    const { isLimitReached, incrementUsage, MAX_GUEST_MESSAGES } = useGuestUsage();

    const queryClient = useQueryClient();

    // Stream management...
    const { startStream, stopStream, data: streamData, isLoading: isStreaming, error: streamError } = useSSE(
        'http://localhost:3000/api/chat/stream'
    );

    // Note: Conversations are now fetched in Layout.jsx

    // Fetch Messages for current conversation
    const { data: historyData, isLoading: loadingHistory } = useQuery({
        queryKey: ['conversation', conversationId],
        queryFn: () => chatService.getConversation(conversationId),
        enabled: !!conversationId,
    });

    // Update messages when history loads
    useEffect(() => {
        if (historyData?.messages) {
            setMessages(historyData.messages);
        } else if (!conversationId) {
            setMessages([]);
        }
    }, [historyData, conversationId]);

    // Handle streaming data updates
    useEffect(() => {
        if (streamData) {
            // Stream is accumulating text for the assistant's message
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === 'assistant' && lastMsg.isStreaming) {
                    // Update existing streaming message
                    return [
                        ...prev.slice(0, -1),
                        { ...lastMsg, content: streamData }
                    ];
                } else {
                    // Should not happen if we add optimistic message correctly
                    return prev;
                }
            });
        }
    }, [streamData]);

    const sendMessageMutation = useMutation({
        mutationFn: chatService.sendMessage,
        onSuccess: (data) => {
            // Usually backend returns the Assistant message if not streaming
            // But for streaming, we handled it separately. 
            // If we use standard POST for everything, we might not need SSE hook separately 
            // unless the POST response itself triggers the stream or we use GET /stream.
            // User spec says: GET /chat/stream (query params: query, conversationId, token)

            // So the flow is likely:
            // 1. Send POST to save user message ? OR
            // 2. Just GET /stream? 
            // Spec says: POST /api/chat/message - Send message
            // AND GET /chat/stream

            // Let's assume sending the message initiates the process, 
            // OR we just use stream for everything.
            // Given the spec, let's try the stream approach for the Answer.
        }
    });

    const handleSend = async (text) => {
        // Check for Guest Limit
        if (!user && isLimitReached) {
            setShowLoginModal(true);
            return;
        }

        // Increment guest usage if applicable
        incrementUsage();

        // 1. Optimistic User Message
        const tempId = Date.now().toString();
        const newUserMsg = { id: tempId, role: 'user', content: text, timestamp: new Date() };

        setMessages(prev => [...prev, newUserMsg]);

        // 2. Determine Conversation ID (create new if none)
        let currentId = conversationId;
        if (!currentId) {
            // Logic to create conversation or let backend handle it
            // Let's assume we treat 'new' logic here or pass null
            // For simplicity, let's assume valid ID is required for stream on this specific backend
            // OR the backend creates one on the fly.
            // If we need ID, we might call createConversation first
            try {
                const newConv = await chatService.createConversation();
                currentId = newConv.id;
                setSearchParams({ c: currentId });
                queryClient.invalidateQueries(['conversations']);
            } catch (e) {
                console.error("Failed to create conversation", e);
                return;
            }
        }

        // 3. Add placeholder assistant message
        setMessages(prev => [...prev, { id: 'streaming', role: 'assistant', content: '', isStreaming: true }]);

        // Special Mock Handling for Refund Demo (offline mode support)
        if (text.toLowerCase().includes('refund')) {
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Get verified mock response
                const mockResponse = await chatService.sendMessage(currentId, text);

                // Replace streaming placeholder with full response
                setMessages(prev => [
                    ...prev.slice(0, -1),
                    mockResponse
                ]);
            } catch (e) {
                console.error("Mock error", e);
            }
            return;
        }

        // 4. Start Transfer/Stream (Real Backend)
        startStream({
            conversationId: currentId,
            query: text
        });

        // Also likely need to invalidate conversation list to update last message/time
        queryClient.invalidateQueries(['conversations']);
    };

    const handleNewChat = () => {
        setSearchParams({}); // Clear ID
        setMessages([]);
        stopStream();
    };

    const handleDeleteConversation = async (id) => {
        await chatService.deleteConversation(id);
        queryClient.invalidateQueries(['conversations']);
        if (conversationId === id) {
            handleNewChat();
        }
    };

    const handleUpload = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        // Logic to open file picker for logged in users
        // For now, prompt usage
        alert("File Upload Logic to be implemented. (Secure Area)");
    };

    return (
        <div className="h-full flex flex-col">
            <ChatWindow>
                <div className="flex-1 flex flex-col h-full bg-[#212121] relative">
                    {!conversationId && messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <span className="text-2xl font-bold">OM</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-100 mb-2">OpsMind AI</h2>
                            <p className="text-gray-400 max-w-md mx-auto mb-2 font-medium">
                                Context-Aware Corporate Knowledge Brain
                            </p>
                            <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm">
                                Enterprise SOP Agent. Ask me questions about your procedures.
                            </p>


                        </div>
                    ) : (
                        <MessageList
                            messages={messages}
                            isStreaming={isStreaming}
                            onCitationClick={setPreviewCitation}
                        />
                    )}

                    <div className="p-4 md:p-6 bg-transparent">
                        <div className="max-w-3xl mx-auto">
                            <InputBox onSend={handleSend} onUpload={handleUpload} disabled={isStreaming} />
                        </div>
                    </div>
                </div>
            </ChatWindow>

            <PDFPreview
                isOpen={!!previewCitation}
                onClose={() => setPreviewCitation(null)}
                citation={previewCitation}
            />

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
}
