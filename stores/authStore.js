import { create } from 'zustand';
import { logoutUser } from '@/lib/auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  validationInterval: null,
  idleTimeout: null,
  idleTimeoutDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
  lastActivity: Date.now(),
  activityHandler: null,

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
    if (state.idleTimeout) {
      clearTimeout(state.idleTimeout);
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

    // Start idle timeout tracking
    const idleTimeout = setTimeout(() => {
      get().handleIdleTimeout();
    }, state.idleTimeoutDuration);

    // Set up activity listeners
    get().setupActivityListeners();

    // Persist to localStorage
    if (user && token) {
      localStorage.setItem('auth', JSON.stringify({ user, token }));
    }

    set({
      user,
      token,
      isAuthenticated: !!user,
      validationInterval: interval,
      idleTimeout,
      lastActivity: Date.now()
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
    if (state.idleTimeout) {
      clearTimeout(state.idleTimeout);
      set({ idleTimeout: null });
    }

    // Remove activity listeners
    get().removeActivityListeners();

    await logoutUser();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      validationInterval: null,
      idleTimeout: null,
      lastActivity: Date.now(),
      activityHandler: null
    });
  },

  // Handle idle timeout
  handleIdleTimeout: () => {
    console.log('Idle timeout reached, logging out user');
    get().clearAuth();
  },

  // Reset idle timer on activity
  resetIdleTimer: () => {
    const state = get();
    if (!state.isAuthenticated) return;

    set({ lastActivity: Date.now() });

    if (state.idleTimeout) {
      clearTimeout(state.idleTimeout);
    }

    const newIdleTimeout = setTimeout(() => {
      get().handleIdleTimeout();
    }, state.idleTimeoutDuration);

    set({ idleTimeout: newIdleTimeout });
  },

  // Set up activity event listeners
  setupActivityListeners: () => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      get().resetIdleTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Store the handler for cleanup
    set({ activityHandler: handleActivity });
  },

  // Remove activity event listeners
  removeActivityListeners: () => {
    const state = get();
    if (state.activityHandler) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.removeEventListener(event, state.activityHandler, true);
      });
    }
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
