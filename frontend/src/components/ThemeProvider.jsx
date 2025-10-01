import { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';

export const ThemeProvider = ({ children }) => {
    const { theme, setTheme } = useThemeStore();

    // Initialize theme on component mount
    useEffect(() => {
        setTheme(theme);
    }, [theme, setTheme]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (theme === 'system') {
                setTheme('system'); // Re-apply system theme
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, setTheme]);

    return <>{children}</>;
};