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

  // Mock token validation - in real app, verify JWT token
  if (token.startsWith("mock-jwt-token-")) {
    // Extract user info from token (in real app, decode JWT)
    const user = {
      id: "1",
      email: "user@example.com",
      firstName: "User",
      lastName: "Example",
      profileImage: null,
      phone: null,
      isPro: false,
    };

    return {
      success: true,
      user,
      message: "Token valid",
    };
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Invalid token",
  });
});
