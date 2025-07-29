import { API_ROUTES } from '~/shared/constants/api-routes';

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
  const { email } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required",
    });
  }

  try {
    const response = await $fetch(API_ROUTES.CANCEL_SUBSCRIPTION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email },
    });

    return {
      success: true,
      message: "Subscription cancelled successfully",
    };
  } catch (error: any) {
    console.error("Stripe cancel subscription error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to cancel subscription",
    });
  }
});
