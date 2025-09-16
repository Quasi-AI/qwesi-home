// stores/auth.store.ts - Complete authentication store with token expiration handling
import { defineStore } from "pinia";
import type {
  AuthResponse,
  AuthState,
  LoginData,
  SignupData,
  ProfileData,
} from "~/features/auth/types/auth.types";

const API_BASE_URL = "https://dark-caldron-448714-u5.appspot.com";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
    isLoading: (state) => state.loading,
  },

  actions: {
    // Add JWT token expiration check (client-side)
    isJWTExpired(token: string): boolean {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
      } catch (error) {
        console.error('Error parsing JWT:', error);
        return true; // Treat invalid tokens as expired
      }
    },

    // Handle token expiration and redirect to login
    handleTokenExpiration() {
      console.log('Handling token expiration...');
      
      // Clear all auth state
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      
      // Clear from localStorage/sessionStorage
      if (process.client) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    },

    // Check if response indicates token expiration
    isTokenExpired(error: any): boolean {
      const status = error.status || error.statusCode;
      const message = error.data?.message || error.data?.error || error.message || '';
      
      return (
        status === 401 ||
        message.toLowerCase().includes('token expired') ||
        message.toLowerCase().includes('token has expired') ||
        message.toLowerCase().includes('unauthorized') ||
        message.toLowerCase().includes('invalid token') ||
        message.toLowerCase().includes('jwt expired') ||
        message.toLowerCase().includes('token invalid')
      );
    },

    // Enhanced fetch wrapper with automatic token expiration handling
    async authenticatedFetch<T>(url: string, options: any = {}): Promise<T> {
      try {
        if (!this.token) {
          throw new Error('No authentication token available');
        }

        const response = await $fetch<T>(API_BASE_URL, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${this.token}`,
          },
        });

        return response;
      } catch (error: any) {
        console.error('API request failed:', error);
        
        // Check if token expired and handle it
        if (this.isTokenExpired(error)) {
          this.handleTokenExpiration();
          throw new Error('Session expired. Please login again.');
        }
        
        // Re-throw the original error for other cases
        throw error;
      }
    },

    async login(data: LoginData) {
      this.loading = true;
      try {
        const response = await $fetch<AuthResponse>(`${API_BASE_URL}/qwesi/login`, {
          method: "POST",
          body: data,
        });

        if (response.success && response.token) {
          this.token = response.token;
          this.isAuthenticated = true;

          // If user data is provided, set it
          if (response.user) {
            this.user = response.user;
          } else {
            // If no user data in login response, try to fetch it separately
            try {
              const userResult = await this.fetchUser();
              if (userResult.success && userResult.user) {
                this.user = userResult.user;
              }
            } catch (fetchError) {
              console.error("Failed to fetch user details after login:", fetchError);
              // Check if the error is due to token expiration
              if (this.isTokenExpired(fetchError)) {
                this.handleTokenExpiration();
                return { success: false, error: "Session expired. Please login again." };
              }
            }
          }

          return { success: true };
        } else {
          return { success: false, error: response.message || "Login failed" };
        }
      } catch (error: any) {
        console.error("Login error:", error);
        
        // Check for token expiration during login
        if (this.isTokenExpired(error)) {
          this.handleTokenExpiration();
          return { success: false, error: "Session expired. Please login again." };
        }
        
        const errorMessage = error.data?.message || error.message || "Login failed. Please try again.";
        return { success: false, error: errorMessage };
      } finally {
        this.loading = false;
      }
    },

    async signup(userData: SignupData) {
      this.loading = true;
      try {
        const response = await $fetch<AuthResponse>(`${API_BASE_URL}/qwesi/signup`, {
          method: "POST",
          body: userData,
        });

        if (response.success) {
          return { success: true, message: response.message };
        } else {
          return { success: false, error: response.message || "Signup failed" };
        }
      } catch (error: any) {
        console.error("Signup error in auth store:", error);

        let errorMessage = "Signup failed. Please try again.";
        if (error.data) {
          errorMessage = error.data.message || error.data.error || errorMessage;
        } else if (error.statusMessage) {
          errorMessage = error.statusMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        // Optionally call logout endpoint
        if (this.token) {
          await $fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }).catch(() => {
            // Ignore errors during logout - we're clearing state anyway
            console.warn('Logout API call failed, but continuing with local logout');
          });
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Clear auth state
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        
        // Clear localStorage
        if (process.client) {
          localStorage.removeItem('auth');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
        
        // Redirect to login page
        if (process.client) {
          navigateTo('/auth/login');
        }
      }
    },

    async checkAuth(): Promise<boolean> {
       
      console.log('=== checkAuth called ===');
      console.log('Current token:', this.token ? 'exists' : 'null');
      console.log('Current isAuthenticated:', this.isAuthenticated);

      if (!this.token) {
        this.isAuthenticated = false;
        return false;
      }

      // Client-side JWT expiration check first
      if (this.isJWTExpired(this.token)) {
        console.log('Token expired (client-side check)');
        this.handleTokenExpiration();
        return false;
      }

      // Server-side verification using your backend endpoint
      try {
        const response = await $fetch(`${API_BASE_URL}/api/auth/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        // Check response based on your backend's structure
        if (response.success && response.tokenValid && response.user) {
          // Update user data with comprehensive info from your backend
          this.user = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            phone: response.user.phone,
            dob: response.user.dob,
            profileImage: response.user.profileImage,
            referralCode: response.user.referralCode,
            points: response.user.points,
            referralStats: response.user.referralStats,
            isSubscribe: response.user.isSubscribe,
            subscriptionStartDate: response.user.subscriptionStartDate,
            currentPeriodEnd: response.user.currentPeriodEnd,
            date_joined: response.user.date_joined,
            // Add any other fields your backend returns
          };
          this.isAuthenticated = true;
          return true;
        } else {
          console.log('Server verification failed');
          this.handleTokenExpiration();
          return false;
        }
      } catch (error: any) {
        console.error("Token verification error:", error);
        
        // Check if token expired based on your backend's error response
        const status = error.status || error.statusCode;
        const message = error.data?.message || error.message || '';
        
        const isTokenExpired = 
          status === 401 ||
          message.toLowerCase().includes('token expired') ||
          message.toLowerCase().includes('token has expired') ||
          message.toLowerCase().includes('unauthorized') ||
          message.toLowerCase().includes('invalid token');
        
        if (isTokenExpired) {
          console.log('Token expired or invalid (server response)');
          this.handleTokenExpiration();
        } else {
          // Other error, clear state but don't redirect (might be network issue)
          this.token = null;
          this.isAuthenticated = false;
          this.user = null;
        }
        
        return false;
      }
    },

    async fetchUser() {
      try {
        const response = await this.authenticatedFetch<AuthResponse>("/qwesi-details", {
          method: "GET",
        });

        if (response.success && response.user) {
          this.user = response.user;
          return { success: true, user: response.user };
        } else {
          return {
            success: false,
            error: response.message || "Failed to fetch user data",
          };
        }
      } catch (error: any) {
        console.error("Fetch user error:", error);
        
        return {
          success: false,
          error: error.message || "Failed to fetch user data. Please try again.",
        };
      }
    },

    async updateProfile(profileData: ProfileData) {
      try {
        const response = await this.authenticatedFetch<AuthResponse>("/qwesi-edit-profile", {
          method: "PUT",
          body: profileData,
        });

        if (response.success && response.user) {
          this.user = { ...this.user, ...response.user };
          return { success: true };
        } else {
          return {
            success: false,
            error: response.message || "Profile update failed",
          };
        }
      } catch (error: any) {
        console.error("Profile update error:", error);
        
        return {
          success: false,
          error: error.message || "Profile update failed. Please try again.",
        };
      }
    },

    async forgotPassword(email: string) {
      try {
        const response = await $fetch<AuthResponse>(`${API_BASE_URL}/api/auth/forgot-password`, {
          method: "POST",
          body: { email },
        });

        return { success: response.success, message: response.message };
      } catch (error: any) {
        console.error("Forgot password error:", error);
        return {
          success: false,
          error: "Failed to send reset email. Please try again.",
        };
      }
    },

    async resetPassword(token: string, newPassword: string) {
      try {
        const response = await $fetch<AuthResponse>(`${API_BASE_URL}/api/auth/reset-password`, {
          method: "POST",
          body: { token, newPassword },
        });

        return { success: response.success, message: response.message };
      } catch (error: any) {
        console.error("Reset password error:", error);
        return {
          success: false,
          error: "Password reset failed. Please try again.",
        };
      }
    },

    // Initialize auth state (call this in app.vue or layout)
    async initializeAuth() {
      // Only run on client side
      if (!process.client) {
        return false;
      }

      // If we have a token, check if it's expired before using it
      if (this.token && this.isJWTExpired(this.token)) {
        console.log('Stored token is expired, clearing auth state');
        this.handleTokenExpiration();
        return false;
      }

      // If we have a valid token, verify it with the server
      if (this.token) {
        try {
          const isAuthenticated = await this.checkAuth();
          return isAuthenticated;
        } catch (error) {
          console.error('Auth initialization failed:', error);
          return false;
        }
      }

      return false;
    },

    // Force refresh user data
    async refreshUser() {
      if (!this.isAuthenticated || !this.token) {
        return { success: false, error: 'Not authenticated' };
      }

      return await this.fetchUser();
    },

    // Check if current user has specific role/permission
    hasRole(role: string): boolean {
      return this.user?.roles?.includes(role) || false;
    },

    hasPermission(permission: string): boolean {
      return this.user?.permissions?.includes(permission) || false;
    },
  },

  persist: true,
});

// Global composable for authentication with automatic token expiration handling
export const useAuth = () => {
  const authStore = useAuthStore();

  const login = async (credentials: LoginData) => {
    const result = await authStore.login(credentials);
    if (result.success) {
      // Check for redirect query parameter
      if (process.client) {
        const redirectUrl = localStorage.getItem("redirect_after_login") || '/dashboard';
        localStorage.removeItem("redirect_after_login");
        await navigateTo(redirectUrl);
      } else {
        await navigateTo('/dashboard');
      }
    }
    return result;
  };

  const logout = async () => {
    await authStore.logout();
    // Navigation is handled in the store
  };

  const checkAuthWithRedirect = async (redirectTo = '/auth/login') => {
    const isAuthenticated = await authStore.checkAuth();
    if (!isAuthenticated && process.client) {
      // Store current route for redirect after login
      const currentRoute = useRoute();
      const redirectQuery = currentRoute.path !== '/auth/login' ? 
        `?redirect=${encodeURIComponent(currentRoute.fullPath)}` : '';
      
      await navigateTo(`${redirectTo}${redirectQuery}`);
    }
    return isAuthenticated;
  };

  // Periodic token check (every 5 minutes)
  if (process.client) {
    const checkInterval = setInterval(async () => {
      if (authStore.isAuthenticated && authStore.token) {
        // Check if token is about to expire (within 5 minutes)
        if (authStore.isJWTExpired(authStore.token)) {
          console.log('Token expired during periodic check');
          authStore.handleTokenExpiration();
          clearInterval(checkInterval);
        }
      } else {
        clearInterval(checkInterval);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Clear interval when page unloads
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        clearInterval(checkInterval);
      });
    }
  }

  // Watch for authentication state changes
  if (process.client) {
    const stopWatcher = watch(
      () => authStore.isAuthenticated,
      (newVal, oldVal) => {
        // If user was authenticated but now isn't, they were logged out
        if (oldVal && !newVal) {
          const route = useRoute();
          const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];
          
          if (!publicRoutes.includes(route.path)) {
            console.log('User authentication lost, redirecting to login');
            navigateTo('/auth/login');
          }
        }
      }
    );

    // Cleanup watcher when component unmounts
    onUnmounted(() => {
      stopWatcher();
    });
  }

  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.loading),
    token: computed(() => authStore.token),
    
    // Actions
    login,
    logout,
    checkAuthWithRedirect,
    refreshUser: authStore.refreshUser,
    initializeAuth: authStore.initializeAuth,
    
    // Utilities
    hasRole: authStore.hasRole,
    hasPermission: authStore.hasPermission,
    
    // Direct store access for advanced usage
    store: authStore,
  };
};

// Middleware for protecting routes (place in middleware/auth.ts)
export const authMiddleware = defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // Skip auth check for public routes
  const publicRoutes = [
    '/auth/login', 
    '/auth/signup', 
    '/auth/forgot-password', 
    '/auth/reset-password',
    '/', // home page
    '/about', 
    '/contact'
  ];

  if (publicRoutes.includes(to.path)) {
    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (authStore.isAuthenticated && to.path.startsWith('/auth/')) {
      return navigateTo('/dashboard');
    }
    return;
  }

  // Check authentication status for protected routes
  const isAuthenticated = await authStore.checkAuth();

  if (!isAuthenticated) {
    // Store the intended destination for redirect after login
    if (process.client) {
      localStorage.setItem("redirect_after_login", to.fullPath);
    }
    return navigateTo('/auth/login');
  }
});

// Plugin for global auth initialization (place in plugins/auth.client.ts)
export const authPlugin = defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  
  // Initialize auth state on app startup
  await authStore.initializeAuth();
  
  // Global error handler for API requests
  globalThis.$fetch = $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401) {
        const errorMessage = response._data?.message || response._data?.error || '';
        const isTokenExpired = 
          errorMessage.toLowerCase().includes('token expired') ||
          errorMessage.toLowerCase().includes('token has expired') ||
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('invalid token') ||
          response.status === 401;

        if (isTokenExpired) {
          console.warn('API request failed with 401, handling token expiration');
          authStore.handleTokenExpiration();
        }
      }
    },
  });
});