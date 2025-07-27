export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const authHeader = headers.authorization;

  // In a real app, you might want to invalidate the token on the server
  // For now, just return success since the client will clear the token

  return {
    success: true,
    message: "Logged out successfully",
  };
});
