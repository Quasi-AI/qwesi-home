import { useAuthStore } from "~/stores/auth";
import type { DashboardSummary } from "~/types/dashboard";

export const useDashboard = () => {
  const authStore = useAuthStore();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const summary = ref<DashboardSummary | null>(null);

  const user = computed(() => authStore.getUser);

  const fetchDashboardSummary = async (email?: string) => {
    loading.value = true;
    error.value = null;

    try {
      const userEmail = email || user.value?.email;

      if (!userEmail || typeof userEmail !== 'string' || !userEmail.includes('@')) {
        throw new Error("Valid user email is required");
      }

      const response = await $fetch("/api/dashboard/summary", {
        method: "GET",
        params: { email: userEmail },
        headers: {
          ...(authStore.getToken && {
            Authorization: `Bearer ${authStore.getToken}`,
          }),
        },
      });

      if (response.success) {
        summary.value = response.data;
      } else {
        throw new Error(
          response.message || "Failed to fetch dashboard summary"
        );
      }
    } catch (err: any) {
      console.error("Dashboard summary fetch error:", err);
      error.value = err.message || "Failed to fetch dashboard summary";
      
      // Don't set any fallback data - let the error be handled by the UI
    } finally {
      loading.value = false;
    }
  };

  const refreshSummary = () => {
    return fetchDashboardSummary();
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    summary: readonly(summary),
    fetchDashboardSummary,
    refreshSummary,
  };
};
