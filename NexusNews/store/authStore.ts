import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../utils/axiosClient';
import { useBookmarkStore } from './bookmarkStore';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  updateProfile: (profileData: { name?: string, bio?: string, avatar?: string }) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, pass) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axiosClient.post('/auth/login', { email, password: pass });
          await AsyncStorage.setItem('auth_token', res.data.token);
          set({ 
            user: res.data.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.msg || 'Failed to login', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      signup: async (name, email, pass) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axiosClient.post('/auth/register', { name, email, password: pass });
          await AsyncStorage.setItem('auth_token', res.data.token);
          set({ 
            user: res.data.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.msg || 'Failed to register', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      logout: async () => {
        await AsyncStorage.removeItem('auth_token');
        set({ user: null, isAuthenticated: false, error: null });
        useBookmarkStore.getState().clearAll();
      },
      
      continueAsGuest: () => {
        set({ 
          user: { id: 'guest', name: 'Guest User', email: '' }, 
          isAuthenticated: true,
          error: null
        });
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axiosClient.put('/auth/profile', profileData);
          set({ user: res.data, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.msg || 'Failed to update profile', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // only persist user and auth state
    }
  )
);
