import { useAuthStore } from "~/features/auth/stores/auth.store";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/dashboard")) {
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

  // ALWAYS perform authentication check - this is the key fix
  const isAuthenticated = await authStore.checkAuth();

  if (!isAuthenticated) {
    // Clear any remaining auth state
    authStore.user = null;
    authStore.token = null;
    authStore.isAuthenticated = false;

    if (process.client) {
      localStorage.setItem("redirect_after_login", to.fullPath);
    }
    return navigateTo("/auth/login");
  }
});