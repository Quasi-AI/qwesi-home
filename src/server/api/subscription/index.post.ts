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
  const { planId, paymentMethodId } = body;

  // Mock subscription creation
  const subscription = {
    id: "sub_" + Date.now(),
    planId: planId,
    status: "active",
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(), // 7 days from now
    cancelAtPeriodEnd: false,
    paymentMethod: {
      id: paymentMethodId,
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
    message: "Subscription created successfully",
  };
});
