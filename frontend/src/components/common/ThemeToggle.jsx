import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();

    const toggleTheme = () => {
        const newTheme = theme === 'light' || theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        setTheme(newTheme);
    };

    // Determine the current effective theme for icon display
    const effectiveTheme = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Toggle theme"
        >
            {effectiveTheme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
    );
};

export default ThemeToggle;