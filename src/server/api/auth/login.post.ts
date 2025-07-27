export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password }: { email: string; password: string } = body;

  // Fake user for testing
  const fakeUser = {
    email: "test@example.com",
    password: "password123",
    id: "1",
    firstName: "Test",
    lastName: "User",
    profileImage: null,
    phone: "+1234567890",
    isPro: true,
  };

  // Mock authentication - in real app, validate against database
  if (email === fakeUser.email && password === fakeUser.password) {
    // Return user data without password
    const user = {
      id: fakeUser.id,
      email: fakeUser.email,
      firstName: fakeUser.firstName,
      lastName: fakeUser.lastName,
      profileImage: fakeUser.profileImage,
      phone: fakeUser.phone,
      isPro: fakeUser.isPro,
    };

    // Mock JWT token
    const token = "mock-jwt-token-" + Date.now();

    return {
      success: true,
      user,
      token,
      message: "Login successful",
    };
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Invalid credentials",
  });
});
