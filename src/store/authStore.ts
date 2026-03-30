import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string;
  baseUrl: string;
  demoMode: boolean;
  setToken: (token: string) => void;
  setBaseUrl: (url: string) => void;
  setDemoMode: (enabled: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: '',
      baseUrl: 'https://api.github.com',
      demoMode: true,
      setToken: (token) => set({ token, demoMode: !token }),
      setBaseUrl: (baseUrl) => set({ baseUrl }),
      setDemoMode: (demoMode) => set({ demoMode }),
      clearAuth: () => set({ token: '', demoMode: true }),
    }),
    { name: 'copilot-dashboard-auth' }
  )
);
