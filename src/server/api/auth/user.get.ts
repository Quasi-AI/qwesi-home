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
    // Return fake user data (in real app, decode JWT and fetch from database)
    const user = {
      id: "1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      profileImage: null,
      phone: "+1234567890",
      isPro: true,
    };

    return {
      success: true,
      user,
      message: "User data retrieved successfully",
    };
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Invalid token",
  });
});
