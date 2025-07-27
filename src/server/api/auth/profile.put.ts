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

  // Mock token validation - in real app, verify JWT token
  if (token.startsWith("mock-jwt-token-")) {
    // Update user data (in real app, update in database)
    const updatedUser = {
      id: "1",
      email: body.email || "user@example.com",
      firstName: body.firstName || "User",
      lastName: body.lastName || "Example",
      profileImage: body.profileImage || null,
      phone: body.phone || null,
      isPro: false,
    };

    return {
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    };
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Invalid token",
  });
});
