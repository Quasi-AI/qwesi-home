export default defineEventHandler(async (event) => {
  // Mock subscription plans
  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      currency: "USD",
      interval: "monthly",
      features: ["Basic AI features", "5 requests per day", "Email support"],
    },
    {
      id: "pro_monthly",
      name: "Pro",
      price: 29,
      currency: "USD",
      interval: "monthly",
      features: [
        "Advanced AI features",
        "Unlimited requests",
        "Priority support",
        "Custom models",
        "API access",
      ],
      isPopular: true,
    },
    {
      id: "pro_yearly",
      name: "Pro",
      price: 290,
      currency: "USD",
      interval: "yearly",
      features: [
        "Advanced AI features",
        "Unlimited requests",
        "Priority support",
        "Custom models",
        "API access",
        "2 months free",
      ],
    },
  ];

  return {
    success: true,
    plans,
    message: "Plans retrieved successfully",
  };
});
