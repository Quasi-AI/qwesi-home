export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "No token provided",
    });
  }

  // Mock subscription cancellation
  const subscription = {
    id: "sub_123",
    planId: "pro_monthly",
    status: "canceled",
    currentPeriodStart: "2024-01-01T00:00:00Z",
    currentPeriodEnd: "2024-02-01T00:00:00Z",
    cancelAtPeriodEnd: true,
    paymentMethod: {
      id: "pm_123",
      type: "card",
      last4: "4242",
      brand: "visa",
      expiryDate: "12/25",
      isDefault: true,
    },
  };

  return {
    success: true,
    subscription,
    message: "Subscription cancelled successfully",
  };
});
