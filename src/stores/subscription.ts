import { defineStore } from "pinia";
import type {
  SubscriptionState,
  SubscriptionResponse,
  SubscriptionPlan,
  Subscription,
  CreateSubscriptionData,
  UpdatePaymentMethodData,
  CheckoutData,
  CancelSubscriptionData,
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
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
            },
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
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
            },
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

    async createCheckoutSession(data: CheckoutData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<SubscriptionResponse>(
          "/api/subscription/checkout",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
            },
            body: data,
          }
        );

        if (response.success && response.checkoutUrl) {
          return { success: true, checkoutUrl: response.checkoutUrl };
        } else {
          this.error = response.message || "Failed to create checkout session";
          return { success: false, error: this.error };
        }
      } catch (error) {
        console.error("Create checkout session error:", error);
        this.error = "Failed to create checkout session";
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
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
            },
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

    async cancelSubscription(data: CancelSubscriptionData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<SubscriptionResponse>(
          "/api/subscription/cancel",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
            },
            body: data,
          }
        );

        if (response.success) {
          // Update local subscription status
          if (this.currentSubscription) {
            this.currentSubscription.status = "canceled";
            this.currentSubscription.cancelAtPeriodEnd = true;
          }
          return { success: true, message: response.message };
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
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
            },
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

    getAuthToken() {
      // Get token from localStorage or auth store
      if (process.client) {
        return localStorage.getItem("auth_token") || "";
      }
      return "";
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
