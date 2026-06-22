import { create } from 'zustand';
import { User } from '../lib/mockData';

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Safely parse user from localStorage on initialization
const getInitialUser = (): User | null => {
  try {
    const saved = localStorage.getItem('wooltown_current_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  login: (user) => {
    localStorage.setItem('wooltown_current_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('wooltown_current_user');
    set({ user: null });
  },
}));
