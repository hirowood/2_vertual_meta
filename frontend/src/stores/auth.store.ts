import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth.types';
import { authApi } from '@/lib/api/auth.api';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Login action
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response: AuthResponse = await authApi.login(credentials);
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Register action
      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response: AuthResponse = await authApi.register(data);
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        const { clearAuth } = get();
        clearAuth();
        // APIコールで無効化
        authApi.logout().catch(console.error);
      },

      // Refresh token action
      refreshToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response: AuthResponse = await authApi.refreshToken(refreshToken);
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user,
          });
        } catch (error) {
          const { clearAuth } = get();
          clearAuth();
          throw error;
        }
      },

      // Update user action
      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      // Clear auth state
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
