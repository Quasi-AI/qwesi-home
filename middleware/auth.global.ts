export default defineNuxtRouteMiddleware(async (to) => {
  // Skip auth check for dashboard route to prevent redirect loop
  if (to.path.startsWith("/dashboard")) {
    return;
  }

  const authStore = useAuthStore();

  // Initialize auth state from localStorage first
  authStore.initializeAuth();

  // Check if we're on the client side and wait for hydration
  if (process.client) {
    // Small delay to allow Pinia hydration from localStorage
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // ALWAYS perform authentication check
  const isAuthenticated = await authStore.checkAuth();

  if (!isAuthenticated) {
    // Clear any remaining auth state
    authStore.user = null;
    authStore.token = null;
    authStore.isAuthenticated = false;
    
    // Only redirect if we're trying to access a protected route
    const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/public');
    
    if (!isPublicRoute) {
      console.log('Redirecting to login due to authentication failure');
      return navigateTo('/login');
    }
  }
});