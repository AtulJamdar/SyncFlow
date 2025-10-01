import React, { useEffect, createContext } from 'react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuthStore();
    
    useEffect(() => {
        
        if (!user) return; // Only connect if user is logged in

       const eventSource = new EventSource(`https://syncflow-backend-cbau.onrender.com/api/events`, { withCredentials: true });

        eventSource.onopen = () => {
            console.log('SSE connection established.');
        };

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('New SSE event:', data);

            // Show a toast notification
            if (data.payload?.message) {
                toast.success(data.payload.message, { icon: '🔔' });
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE Error:', err);
            eventSource.close();
        };

        // Cleanup on component unmount
        return () => {
            eventSource.close();
        };
    }, [user]);

    return (
        <NotificationContext.Provider value={{}}>
            {children}
        </NotificationContext.Provider>
    );
};
