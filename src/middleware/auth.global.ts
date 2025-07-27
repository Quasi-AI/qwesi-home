import { useAuthStore } from "../stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/dashboard")) {
    return;
  }

  const authStore = useAuthStore();

  // Initialize auth state from localStorage first
  authStore.initializeAuth();

  // If already authenticated, allow access
  if (authStore.isAuthenticated && authStore.user) {
    return;
  }

  // Check if we're on the client side and wait for hydration
  if (process.client) {
    // Small delay to allow Pinia hydration from localStorage
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check again after hydration
    if (authStore.isAuthenticated && authStore.user) {
      return;
    }
  }

  // Perform authentication check
  const isAuthenticated = await authStore.checkAuth();

  if (!isAuthenticated) {
    if (process.client) {
      localStorage.setItem("redirect_after_login", to.fullPath);
    }
    return navigateTo("/auth/login");
  }
});
