import { useAuthStore } from "~/features/auth/stores/auth.store";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const authStore = useAuthStore();
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/auth/login', 
    '/auth/signup', 
    '/auth/forgot-password', 
    '/auth/reset-password',
    '/',
    '/about',
    '/contact'
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(to.path);

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (authStore.isAuthenticated && to.path.startsWith('/auth/')) {
    return navigateTo('/dashboard');
  }

  // Skip auth check for public routes
  if (isPublicRoute) {
    return;
  }

  // Get token from store or localStorage as fallback
  let token = authStore.token || localStorage.getItem("token");

  // If no token found, handle unauthorized access
  if (!token) {
    // Store the intended destination for redirect after login
    const redirectQuery = `?redirect=${encodeURIComponent(to.fullPath)}`;
    return navigateTo(`/auth/login${redirectQuery}`);
  }

  // Validate token format and check expiration
  try {
    const tokenParts = token.split(".");
    
    if (tokenParts.length !== 3) {
      throw new Error("Invalid Token Format");
    }

    // Decode and check token expiration
    const tokenPayload = JSON.parse(atob(tokenParts[1]));
    const tokenExpiry = tokenPayload.exp * 1000;
    const currentTime = Date.now();

    // Check if token is expired
    if (currentTime >= tokenExpiry) {
      console.warn("Token expired. Logging out...");
      
      // Use auth store's token expiration handler
      authStore.handleTokenExpiration();
      await logoutUser();
      
      const redirectQuery = `?redirect=${encodeURIComponent(to.fullPath)}`;
      return navigateTo(`/auth/login${redirectQuery}`);
    }

    // Token is valid, verify with backend if user data is missing
    if (!authStore.user) {
      try {
        const isAuthenticated = await authStore.checkAuth();
        
        if (!isAuthenticated) {
          await logoutUser();
          
          const redirectQuery = `?redirect=${encodeURIComponent(to.fullPath)}`;
          return navigateTo(`/auth/login${redirectQuery}`);
        }
      } catch (error: any) {
        console.error("Backend auth verification error:", error);
        
        // Check if it's a token expiration error
        if (authStore.isTokenExpired(error)) {
          authStore.handleTokenExpiration();
          await logoutUser();
          
          const redirectQuery = `?redirect=${encodeURIComponent(to.fullPath)}`;
          return navigateTo(`/auth/login${redirectQuery}`);
        }

        throw error;
      }
    }

    // Log successful authentication
  } catch (error: any) {
    console.error("Token validation error:", error);
    
    // Clear invalid token and redirect
    await logoutUser();
    authStore.handleTokenExpiration();
    
    const redirectQuery = `?redirect=${encodeURIComponent(to.fullPath)}`;
    return navigateTo(`/auth/login${redirectQuery}`);
  }
});

// Enhanced logout function that integrates with auth store
const logoutUser = async () => {
  try {
    const authStore = useAuthStore();
    
    // Clear localStorage
    if (process.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("email");
    }
    
    // Clear auth store state
    authStore.user = null;
    authStore.token = null;
    authStore.isAuthenticated = false;
    
  } catch (error) {
    console.error("Error during logout:", error);
  }
};


// Enhanced security utilities (optional - export for use in components)
export const securityUtils = {
  logoutUser,
  
  // Function to manually check token expiration
  checkTokenExpiration: (token?: string): boolean => {
    try {
      const authToken = token || useAuthStore().token || localStorage.getItem("token");
      
      if (!authToken) return true; // No token = expired
      
      const tokenParts = authToken.split(".");
      if (tokenParts.length !== 3) return true; // Invalid format = expired
      
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const tokenExpiry = tokenPayload.exp * 1000;
      const currentTime = Date.now();
      
      return currentTime >= tokenExpiry;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; // Error = treat as expired
    }
  },
  
  // Function to get token expiry time
  getTokenExpiryTime: (token?: string): Date | null => {
    try {
      const authToken = token || useAuthStore().token || localStorage.getItem("token");
      
      if (!authToken) return null;
      
      const tokenParts = authToken.split(".");
      if (tokenParts.length !== 3) return null;
      
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      return new Date(tokenPayload.exp * 1000);
    } catch (error) {
      console.error("Error getting token expiry time:", error);
      return null;
    }
  }
};