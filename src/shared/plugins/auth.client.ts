import { useAuthStore } from "~/features/auth/stores/auth.store";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  
  // Initialize auth state on app startup
  await authStore.initializeAuth();
  
  // Global error handler for API requests
  globalThis.$fetch = $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401) {
        const authStore = useAuthStore();
        const errorMessage = response._data?.message || response._data?.error || '';
        
        const isTokenExpired = 
          errorMessage.toLowerCase().includes('token expired') ||
          errorMessage.toLowerCase().includes('token has expired') ||
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('invalid token');

        if (isTokenExpired) {
          console.warn('API request failed with 401, handling token expiration');
          authStore.handleTokenExpiration();
          
          // Navigate to login only if we're not already there
          if (process.client && window.location.pathname !== '/login') {
            navigateTo('/login');
          }
        }
      }
    }
  });
});