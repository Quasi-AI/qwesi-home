export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "No token provided",
    });
  }

  const body = await readBody(event);
  const { paymentMethodId } = body;

  // Mock payment method update
  const subscription = {
    id: "sub_123",
    planId: "pro_monthly",
    status: "active",
    currentPeriodStart: "2024-01-01T00:00:00Z",
    currentPeriodEnd: "2024-02-01T00:00:00Z",
    cancelAtPeriodEnd: false,
    paymentMethod: {
      id: paymentMethodId,
      type: "card",
      last4: "5555",
      brand: "mastercard",
      expiryDate: "12/26",
      isDefault: true,
    },
  };

  return {
    success: true,
    subscription,
    message: "Payment method updated successfully",
  };
});
