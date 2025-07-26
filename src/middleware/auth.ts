import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  const isAuthenticated = await authStore.checkAuth();

  if (!isAuthenticated) {
    return navigateTo("/login");
  }
});
