import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      admin: null,
      isAuthenticated: !!Cookies.get('adminToken'),
      setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),
      logout: () => {
        Cookies.remove('adminToken');
        set({ admin: null, isAuthenticated: false });
      },
      checkAuth: () => {
        const token = Cookies.get('adminToken');
        const isAuthenticated = !!token;
        set({ isAuthenticated });
        return isAuthenticated;
      },
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({ admin: state.admin }),
    }
  )
);