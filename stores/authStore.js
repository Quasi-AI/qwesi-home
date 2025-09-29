import { create } from 'zustand';
import { logoutUser } from '@/lib/auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  validationInterval: null,

  // Initialize auth state
  initAuth: () => {
    set({ isLoading: true });

    // Load API auth from localStorage
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { user, token } = JSON.parse(storedAuth);
        if (user && token && user.expiresAt && new Date(user.expiresAt) > new Date()) {
          get().setAuth(user, token);
        } else {
          localStorage.removeItem('auth');
        }
      } catch (e) {
        localStorage.removeItem('auth');
      }
    }

    set({ isLoading: false });
  },

  // Set auth data (for manual login/signup)
  setAuth: (user, token) => {
    const state = get();
    if (state.validationInterval) {
      clearInterval(state.validationInterval);
    }

    let interval = null;
    if (user && user.expiresAt) {
      interval = setInterval(() => {
        const currentState = get();
        if (currentState.user && currentState.user.expiresAt && new Date(currentState.user.expiresAt) < new Date()) {
          currentState.clearAuth();
        }
      }, 30000); // Check every 30 seconds
    }

    // Persist to localStorage
    if (user && token) {
      localStorage.setItem('auth', JSON.stringify({ user, token }));
    }

    set({
      user,
      token,
      isAuthenticated: !!user,
      validationInterval: interval
    });
  },

  setUser: (user) => {
    set(state => ({
      ...state,
      user,
      isAuthenticated: !!user,
    }));
  },

  // Clear auth data
  clearAuth: async () => {
    const state = get();
    if (state.validationInterval) {
      clearInterval(state.validationInterval);
      set({ validationInterval: null });
    }
    await logoutUser();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      validationInterval: null
    });
  },

  // Get current user
  getUser: () => get().user,

  // Get current token
  getToken: async () => {
    return get().token;
  },

  // Check if authenticated
  isAuth: () => get().isAuthenticated,

  // Check if loading
  isAuthLoading: () => get().isLoading,

  // Check token expiration
  checkTokenExpiration: () => {
    const state = get();
    if (!state.user || !state.user.expiresAt) return;

    const now = new Date();
    const expiresAt = new Date(state.user.expiresAt);

    if (now >= expiresAt) {
      // Token expired, logout
      get().clearAuth();
    }
  }
}));
