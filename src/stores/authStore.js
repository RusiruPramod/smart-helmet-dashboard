import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      
      // Set user
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        loading: false
      }),
      
      // Logout
      logout: () => set({
        user: null,
        isAuthenticated: false,
        loading: false
      }),
      
      // Set loading
      setLoading: (loading) => set({ loading }),
      
      // Check if user has role
      hasRole: (role) => {
        const user = get().user;
        return user && user.role === role;
      },
      
      // Check if user is admin
      isAdmin: () => {
        const user = get().user;
        return user && user.role === 'admin';
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
