import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'system', // 'light', 'dark', or 'system'
            setTheme: (newTheme) => {
                // Apply the theme to the root element
                const root = window.document.documentElement;
                const isDark =
                    newTheme === 'dark' ||
                    (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

                root.classList.remove(isDark ? 'light' : 'dark');
                root.classList.add(isDark ? 'dark' : 'light');

                set({ theme: newTheme });
            },
        }), {
            name: 'theme-storage', // The key in localStorage
        }
    )
);