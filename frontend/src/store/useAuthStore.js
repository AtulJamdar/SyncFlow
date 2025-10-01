import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }), {
            name: 'auth-storage', // name of the item in the storage (must be unique)
        }
    )
);

export default useAuthStore;