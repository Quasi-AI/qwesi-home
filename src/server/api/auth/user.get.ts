export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const token = headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "No token provided",
    });
  }

  try {
    // Call the external user details API
    const userDetails = await $fetch(
      "https://dark-caldron-448714-u5.appspot.com/qwesi-details",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      user: userDetails,
    };
  } catch (error) {
    console.error("Fetch user details error:", error);
    throw createError({
      statusCode: 401,
      statusMessage: "Failed to fetch user details",
    });
  }
});
