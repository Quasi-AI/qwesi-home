import { API_ROUTES } from "~/shared/constants/api-routes";

export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const token = headers.authorization?.replace("Bearer ", "");
  const query = getQuery(event);
  const email = query.email as string;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid email parameter is required",
    });
  }

  try {
    // Call the external dashboard summary API
    const response = await $fetch(`${API_ROUTES.DASHBOARD_SUMMARY}${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return {
      success: true,
      data: response,
      message: "Dashboard summary retrieved successfully",
    };
  } catch (error: any) {
    console.error("Dashboard summary fetch error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch dashboard summary from external API",
    });
  }
});
