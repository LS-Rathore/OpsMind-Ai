import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MAX_GUEST_MESSAGES = 4;

export function useGuestUsage() {
    const { user } = useAuth();
    const [usageCount, setUsageCount] = useState(0);

    // Load initial usage
    useEffect(() => {
        const stored = localStorage.getItem('guest_message_count');
        if (stored) {
            setUsageCount(parseInt(stored, 10));
        }
    }, []);

    const incrementUsage = () => {
        if (!user) {
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            localStorage.setItem('guest_message_count', newCount.toString());
        }
    };

    const isLimitReached = !user && usageCount >= MAX_GUEST_MESSAGES;
    const remaining = Math.max(0, MAX_GUEST_MESSAGES - usageCount);

    return {
        usageCount,
        isLimitReached,
        remaining,
        incrementUsage,
        MAX_GUEST_MESSAGES
    };
}
