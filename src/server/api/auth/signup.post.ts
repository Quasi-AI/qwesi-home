export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    phone,
    name,
    dob,
    email,
    password,
  }: {
    phone: string;
    name: string;
    dob: string;
    email: string;
    password: string;
  } = body;

  // Validate required fields
  if (!phone || !name || !dob || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "All fields are required: phone, name, dob, email, password",
    });
  }

  // Validate phone number format (should start with +)
  if (!phone.startsWith("+")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Phone number must start with +",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email format",
    });
  }

  // Validate date format (should be DD/MM/YYYY)
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dob)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Date must be in DD/MM/YYYY format",
    });
  }

  // Validate password (minimum 4 characters)
  if (password.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 4 characters long",
    });
  }

  try {
    // Call the external signup API
    const response = await $fetch(
      "https://dark-caldron-448714-u5.appspot.com/qwesi/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          phone,
          name,
          dob,
          email,
          password,
        },
      }
    );

    // If signup is successful, return success response
    if (response) {
      return {
        success: true,
        message: "Account created successfully",
      };
    }

    throw createError({
      statusCode: 400,
      statusMessage: "Signup failed",
    });
  } catch (error: any) {
    console.error("Signup error:", error);

    // Try to extract error message from the response
    let errorMessage = "Signup failed. Please try again.";

    if (error.data) {
      errorMessage = error.data.message || error.data.error || errorMessage;
    }

    throw createError({
      statusCode: 400,
      statusMessage: errorMessage,
    });
  }
});
