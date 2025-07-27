export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string } = body;

  // Mock signup - in real app, validate and create user in database
  if (email && password && firstName && lastName) {
    // Simulate user data
    const user = {
      id: "2",
      email: email,
      firstName: firstName,
      lastName: lastName,
      profileImage: null,
      phone: null,
      isPro: false,
    };

    // Mock JWT token
    const token = "mock-jwt-token-" + Date.now();

    return {
      success: true,
      user,
      token,
      message: "Account created successfully",
    };
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Invalid signup data",
  });
});
