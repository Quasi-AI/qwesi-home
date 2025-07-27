import { useAuthStore } from "../stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/dashboard")) {
    return;
  }

  const authStore = useAuthStore();

  if (authStore.isAuthenticated && authStore.user) {
    return;
  }

  const isAuthenticated = await authStore.checkAuth();

  if (!isAuthenticated) {
    if (process.client) {
      localStorage.setItem("redirect_after_login", to.fullPath);
    }
    return navigateTo("/auth/login");
  }
});
