import { useState, useRef } from 'react';
import { CHAT_STREAM_URL, getConversation } from '../services/chatService.js';

export const useSSEChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const currentConversationIdRef = useRef(currentConversationId);
  currentConversationIdRef.current = currentConversationId;

  const sendMessage = async (query) => {
    setIsLoading(true);
    setSources([]);

    const userMessageId = Date.now();
    const assistantMessageId = Date.now() + 1;

    const userMsg = { role: 'user', content: query, id: userMessageId };
    const assistantMsg = { role: 'assistant', content: '', id: assistantMessageId, isStreaming: true, sources: [] };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    try {
      const response = await fetch(CHAT_STREAM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('opsmind_token')}`,
        },
        body: JSON.stringify({ query, conversationId: currentConversationIdRef.current }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const data = JSON.parse(dataStr);

              if (data.type === 'token') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + data.content }
                      : msg
                  )
                );
              } else if (data.type === 'sources') {
                setSources(data.sources);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, sources: data.sources } : msg
                  )
                );
              } else if (data.type === 'conversationId') {
                setCurrentConversationId(data.id);
                currentConversationIdRef.current = data.id;
              } else if (data.type === 'done') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
                  )
                );
                setIsLoading(false);
              } else if (data.type === 'error') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: `Error: ${data.message}`, isStreaming: false }
                      : msg
                  )
                );
                setIsLoading(false);
              }
            } catch (e) {
              // Ignore partial JSON parse errors
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: `Error: ${error.message}`, isStreaming: false }
            : msg
        )
      );
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setSources([]);
    setCurrentConversationId(null);
    currentConversationIdRef.current = null;
  };

  const loadConversation = async (conversation) => {
    try {
      const fullConvo = await getConversation(conversation._id);
      const formattedMessages = fullConvo.messages.map((m, idx) => ({
        ...m,
        id: m._id || Date.now() + idx,
      }));
      setMessages(formattedMessages);
      setCurrentConversationId(fullConvo._id);
      currentConversationIdRef.current = fullConvo._id;
      const lastAssistantMessage = formattedMessages
        .slice()
        .reverse()
        .find((m) => m.role === 'assistant');
      setSources(lastAssistantMessage?.sources || []);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  return {
    messages,
    isLoading,
    sources,
    sendMessage,
    startNewConversation,
    loadConversation,
    currentConversationId,
    setMessages,
  };
};
