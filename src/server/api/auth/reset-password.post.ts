export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token, newPassword } = body;

  // Mock reset password - in real app, validate token and update password
  if (token && newPassword) {
    return {
      success: true,
      message: "Password reset successfully",
    };
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Token and new password are required",
  });
});
