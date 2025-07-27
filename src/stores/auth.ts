import { defineStore } from "pinia";
import type {
  AuthResponse,
  AuthState,
  LoginData,
  SignupData,
  ProfileData,
} from "~/types/auth";

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
    async login(data: LoginData) {
      this.loading = true;
      try {
        const response = await $fetch<AuthResponse>("/api/auth/login", {
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
            console.log(
              "No user data in login response, attempting to fetch user details..."
            );
            try {
              const userResult = await this.fetchUser();
              if (userResult.success && userResult.user) {
                this.user = userResult.user;
              }
            } catch (fetchError) {
              console.error(
                "Failed to fetch user details after login:",
                fetchError
              );
            }
          }

          // Store token in localStorage
          if (process.client) {
            localStorage.setItem("auth_token", response.token);
          }

          return { success: true };
        } else {
          return { success: false, error: response.message || "Login failed" };
        }
      } catch (error: any) {
        console.error("Login error:", error);
        return { success: false, error: "Login failed. Please try again." };
      } finally {
        this.loading = false;
      }
    },

    async signup(userData: SignupData) {
      this.loading = true;
      try {
        const response = await $fetch<AuthResponse>("/api/auth/signup", {
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
        
        // Try to extract error message
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
        // Optional: Call logout API endpoint
        if (this.token) {
          await $fetch("/api/auth/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
        }
      } catch (error: any) {
        console.error("Logout error:", error);
      } finally {
        // Clear local state
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;

        // Clear stored token
        if (process.client) {
          localStorage.removeItem("auth_token");
        }
      }
    },

    async checkAuth(): Promise<boolean> {
      if (this.isAuthenticated && this.user) {
        return true;
      }

      // Check for stored token
      if (process.client) {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
          try {
            // Verify token with backend
            const response = await $fetch<AuthResponse>("/api/auth/verify", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (response.success && response.user) {
              this.user = response.user;
              this.token = storedToken;
              this.isAuthenticated = true;
              return true;
            } else {
              // Invalid token, clear it
              localStorage.removeItem("auth_token");
            }
          } catch (error: any) {
            console.error("Token verification error:", error);
            localStorage.removeItem("auth_token");
          }
        }
      }

      return false;
    },

    async fetchUser() {
      try {
        const response = await $fetch<AuthResponse>("/api/auth/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
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
          error: "Failed to fetch user data. Please try again.",
        };
      }
    },

    async updateProfile(profileData: ProfileData) {
      try {
        const response = await $fetch<AuthResponse>("/api/auth/profile", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
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
          error: "Profile update failed. Please try again.",
        };
      }
    },

    async forgotPassword(email: string) {
      try {
        const response = await $fetch<AuthResponse>(
          "/api/auth/forgot-password",
          {
            method: "POST",
            body: { email },
          }
        );

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
        const response = await $fetch<AuthResponse>(
          "/api/auth/reset-password",
          {
            method: "POST",
            body: { token, newPassword },
          }
        );

        return { success: response.success, message: response.message };
      } catch (error: any) {
        console.error("Reset password error:", error);
        return {
          success: false,
          error: "Password reset failed. Please try again.",
        };
      }
    },
  },

  persist: true,
});
