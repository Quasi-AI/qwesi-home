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

  try {
    // Verify token with external API
    const response = await $fetch(
      "https://dark-caldron-448714-u5.appspot.com/qwesi-details",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return {
      success: true,
      user: response,
      message: "Token valid",
    };
  } catch (error: any) {
    console.error("Token verification error:", error);
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token",
    });
  }
});
