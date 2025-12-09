import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Hook that automatically logs out the user after 10 minutes of inactivity
 * Tracks mouse movements, keyboard events, clicks, and scrolls
 */
export const useIdleTimeout = () => {
    const { logout, currentUser } = useAuth();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(async () => {
            if (currentUser) {
                console.log('User idle for 10 minutes, logging out...');
                await logout();
            }
        }, IDLE_TIMEOUT);
    };

    useEffect(() => {
        // Only set up listeners if user is logged in
        if (!currentUser) {
            return;
        }

        // Events that indicate user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        // Reset timer on any activity
        const handleActivity = () => {
            resetTimer();
        };

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, handleActivity);
        });

        // Initialize timer
        resetTimer();

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentUser, logout]);
};
