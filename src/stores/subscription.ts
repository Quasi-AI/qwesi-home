import { defineStore } from "pinia";
import type {
  SubscriptionState,
  SubscriptionResponse,
  SubscriptionPlan,
  Subscription,
  CreateSubscriptionData,
  UpdatePaymentMethodData,
} from "~/types/subscription";

export const useSubscriptionStore = defineStore("subscription", {
  state: (): SubscriptionState => ({
    currentSubscription: null,
    availablePlans: [],
    loading: false,
    error: null,
  }),

  getters: {
    getCurrentSubscription: (state) => state.currentSubscription,
    getAvailablePlans: (state) => state.availablePlans,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isSubscribed: (state) => state.currentSubscription?.status === "active",
    isPro: (state) => state.currentSubscription?.status === "active",
  },

  actions: {
    async fetchSubscription() {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<SubscriptionResponse>(
          "/api/subscription",
          {
            method: "GET",
          }
        );

        if (response.success && response.subscription) {
          this.currentSubscription = response.subscription;
          return { success: true, subscription: response.subscription };
        } else {
          this.error = response.message || "Failed to fetch subscription";
          return { success: false, error: this.error };
        }
      } catch (error) {
        console.error("Fetch subscription error:", error);
        this.error = "Failed to fetch subscription data";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async fetchPlans() {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<SubscriptionResponse>(
          "/api/subscription/plans",
          {
            method: "GET",
          }
        );

        if (response.success && response.plans) {
          this.availablePlans = response.plans;
          return { success: true, plans: response.plans };
        } else {
          this.error = response.message || "Failed to fetch plans";
          return { success: false, error: this.error };
        }
      } catch (error) {
        console.error("Fetch plans error:", error);
        this.error = "Failed to fetch subscription plans";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async createSubscription(data: CreateSubscriptionData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<SubscriptionResponse>(
          "/api/subscription",
          {
            method: "POST",
            body: data,
          }
        );

        if (response.success && response.subscription) {
          this.currentSubscription = response.subscription;
          return { success: true, subscription: response.subscription };
        } else {
          this.error = response.message || "Failed to create subscription";
          return { success: false, error: this.error };
        }
      } catch (error) {
        console.error("Create subscription error:", error);
        this.error = "Failed to create subscription";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async cancelSubscription() {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<SubscriptionResponse>(
          "/api/subscription/cancel",
          {
            method: "POST",
          }
        );

        if (response.success && response.subscription) {
          this.currentSubscription = response.subscription;
          return { success: true, subscription: response.subscription };
        } else {
          this.error = response.message || "Failed to cancel subscription";
          return { success: false, error: this.error };
        }
      } catch (error) {
        console.error("Cancel subscription error:", error);
        this.error = "Failed to cancel subscription";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updatePaymentMethod(data: UpdatePaymentMethodData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<SubscriptionResponse>(
          "/api/subscription/payment-method",
          {
            method: "PUT",
            body: data,
          }
        );

        if (response.success && response.subscription) {
          this.currentSubscription = response.subscription;
          return { success: true, subscription: response.subscription };
        } else {
          this.error = response.message || "Failed to update payment method";
          return { success: false, error: this.error };
        }
      } catch (error) {
        console.error("Update payment method error:", error);
        this.error = "Failed to update payment method";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    reset() {
      this.currentSubscription = null;
      this.availablePlans = [];
      this.loading = false;
      this.error = null;
    },
  },

  persist: true,
});
