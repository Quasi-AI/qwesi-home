import { API_ROUTES } from "~/constants/api";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { phone, password }: { phone: string; password: string } = body;

  try {
    // Call the external login API
    const response: any = await $fetch(API_ROUTES.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        phone,
        password,
      },
    });

    // If login is successful, fetch user details
    if (response) {
      // First, check if the login response itself contains user data
      if (response.user || response.data) {
        return {
          success: true,
          user: response.user || response.data,
          token:
            response.token ||
            response.access_token ||
            response.accessToken ||
            null,
          message: "Login successful",
        };
      }

      try {
        // Check if we have a token
        const token =
          response.token || response.access_token || response.accessToken;

        if (!token) {
          // Try to fetch user details without authentication
          try {
            const userDetails = await $fetch(
              API_ROUTES.USER_DETAILS,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            return {
              success: true,
              user: userDetails,
              token: null,
              message: "Login successful",
            };
          } catch (noAuthError: any) {
            // If no auth also fails, return success without user details
            return {
              success: true,
              user: null,
              token: null,
              message: "Login successful but user details not available",
            };
          }
        }

        const userDetails = await $fetch(
          API_ROUTES.USER_DETAILS,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return {
          success: true,
          user: userDetails,
          token: token,
          message: "Login successful",
        };
      } catch (userError: any) {
        console.error("Error fetching user details:", userError);

        return {
          success: true,
          user: null,
          token:
            response.token || response.access_token || response.accessToken,
          message: "Login successful but failed to fetch user details",
        };
      }
    }

    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  } catch (error: any) {
    console.error("Login error:", error);

    throw createError({
      statusCode: 401,
      statusMessage: "Login failed. Please check your credentials.",
    });
  }
});
