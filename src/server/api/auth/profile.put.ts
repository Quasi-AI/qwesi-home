import { API_ROUTES } from "~/constants/api";

export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "No token provided",
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const body = await readBody(event);

  // Map the data to match external API expectations
  const apiPayload = {
    name: body.name,
    email: body.email,
    dob: body.dob,
  };

  try {
    const response = await $fetch(API_ROUTES.EDIT_PROFILE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: apiPayload,
    });

    return {
      success: true,
      user: (response as any).user || (response as any).data,
      message: (response as any).message || "Profile updated successfully",
    };
  } catch (error: any) {
    console.error("Profile update error:", error);

    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - Invalid or expired token",
      });
    }

    if (error.statusCode === 400) {
      throw createError({
        statusCode: 400,
        statusMessage:
          error.data?.message ||
          error.statusMessage ||
          "Bad request - check your data format",
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to update profile",
    });
  }
});
