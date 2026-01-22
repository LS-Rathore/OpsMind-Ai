import { useState, useRef, useEffect, useCallback } from 'react';

export const useSSE = (url) => {
    const [data, setData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const eventSourceRef = useRef(null);

    const startStream = useCallback((queryParams) => {
        // Close existing connection if any
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        setIsLoading(true);
        setError(null);
        setData('');

        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            ...queryParams,
            token: token // Pass token in query since EventSource doesn't verify headers
        });

        const fullUrl = `${url}?${params.toString()}`;
        const eventSource = new EventSource(fullUrl);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            try {
                // Assuming simple text stream or JSON chunks
                // If it's a JSON stream, we might need parsing
                // For now, let's assume it appends text data
                const parsed = JSON.parse(event.data);
                if (parsed.content) {
                    setData((prev) => prev + parsed.content);
                }
                if (parsed.done) {
                    eventSource.close();
                    setIsLoading(false);
                }
            } catch (e) {
                // Fallback for plain text
                setData((prev) => prev + event.data);
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE Error:', err);
            setError('Connection failed');
            eventSource.close();
            setIsLoading(false);
        };

        return () => {
            eventSource.close();
        };
    }, [url]);

    const stopStream = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    return { data, isLoading, error, startStream, stopStream };
};
