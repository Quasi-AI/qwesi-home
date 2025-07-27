export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  // Mock forgot password - in real app, send reset email
  if (email) {
    return {
      success: true,
      message: "Reset instructions sent to your email",
    };
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Email is required",
  });
});
