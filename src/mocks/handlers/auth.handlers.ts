import { http, HttpResponse } from "msw";

export const authHandlers = [
  /* (1) */
  http.post("/api/auth/v1/find-email", async ({ request }) => {
    const body = (await request.json()) as { email: string };

    // 400 - missing or invalid email
    if (!body.email || !body.email.includes("@")) {
      return HttpResponse.json(
        { message: "Email is required or invalid format" },
        { status: 400 },
      );
    }

    // 429 - too many requests (simulate by using specific test email)
    if (body.email === "ratelimit@test.com") {
      return HttpResponse.json(
        { message: "Too many requests, please try again later" },
        { status: 429 },
      );
    }

    // 500 - server error (simulate by using specific test email)
    if (body.email === "error@test.com") {
      return HttpResponse.json(
        { message: "Something went wrong on the server" },
        { status: 500 },
      );
    }

    // 200 - success
    const existingEmails = ["test@test.com", "omar@beatza.com"];
    const exists = existingEmails.includes(body.email);
    return HttpResponse.json(
      { exists, message: "Email exists in the system" },
      { status: 200 },
    );
  }),

  /* (2) */
  http.post("/api/auth/v1/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    // 400 - missing or invalid email
    if (!body.email || !body.email.includes("@")) {
      return HttpResponse.json(
        {
          success: false,
          message: "Email is required or invalid format",
          data: {},
        },
        { status: 400 },
      );
    }

    // 400 - missing password
    if (!body.password || body.password.trim().length === 0) {
      return HttpResponse.json(
        { success: false, message: "Password is required", data: {} },
        { status: 400 },
      );
    }

    // 429 - too many requests (simulate by using specific test email)
    if (body.email === "ratelimit@test.com") {
      return HttpResponse.json(
        {
          success: false,
          message: "Too many requests, please try again later",
          data: {},
        },
        { status: 429 },
      );
    }

    // 500 - server error (simulate by using specific test email)
    if (body.email === "error@test.com") {
      return HttpResponse.json(
        {
          success: false,
          message: "Something went wrong on the server",
          data: {},
        },
        { status: 500 },
      );
    }

    // 404 - user not found
    const existingUsers = {
      "test@test.com": "test1234",
      "omar@beatza.com": "omar1234",
    } as Record<string, string>;

    const storedPassword = existingUsers[body.email];
    if (!storedPassword) {
      return HttpResponse.json(
        { success: false, message: "User not found", data: {} },
        { status: 404 },
      );
    }

    // 401 - invalid credentials
    if (storedPassword !== body.password) {
      return HttpResponse.json(
        { success: false, message: "Authorization failed", data: {} },
        { status: 401 },
      );
    }

    // 200 - success (tokens are typically set via httpOnly cookies)
    return HttpResponse.json(
      { success: true, message: "Authenticated successfully", data: {} },
      { status: 200 },
    );
  }),

  /* (3) */
  http.post("/api/auth/v1/sign-up", async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      displayName: string;
      dateOfBirth: string;
      gender: string;
    };

    // 400 - missing or invalid email
    if (!body.email || !body.email.includes("@")) {
      return HttpResponse.json(
        {
          success: false,
          message: "Email is required or invalid format",
          data: {},
        },
        { status: 400 },
      );
    }

    // 400 - missing password
    if (!body.password || body.password.trim().length === 0) {
      return HttpResponse.json(
        { success: false, message: "Password is required", data: {} },
        { status: 400 },
      );
    }

    // 400 - missing displayName
    if (!body.displayName || body.displayName.trim().length === 0) {
      return HttpResponse.json(
        { success: false, message: "Display name is required", data: {} },
        { status: 400 },
      );
    }

    // 400 - missing or invalid dateOfBirth
    if (!body.dateOfBirth || isNaN(Date.parse(body.dateOfBirth))) {
      return HttpResponse.json(
        {
          success: false,
          message: "Date of birth is required or invalid format",
          data: {},
        },
        { status: 400 },
      );
    }

    // 400 - missing gender
    if (!body.gender) {
      return HttpResponse.json(
        { success: false, message: "Gender is required", data: {} },
        { status: 400 },
      );
    }

    // 429 - rate limit simulation
    if (body.email === "ratelimit@test.com") {
      return HttpResponse.json(
        {
          success: false,
          message: "Too many requests, please try again later",
          data: {},
        },
        { status: 429 },
      );
    }

    // 500 - server error simulation
    if (body.email === "error@test.com") {
      return HttpResponse.json(
        { success: false, message: "Internal server error", data: {} },
        { status: 500 },
      );
    }

    // 401 - simulate already-registered email (conflict/auth guard)
    const existingEmails = ["test@test.com", "omar@beatza.com"];
    if (existingEmails.includes(body.email)) {
      return HttpResponse.json(
        { success: false, message: "Authorization failed", data: {} },
        { status: 401 },
      );
    }

    // 404 - resource not found (e.g. org/tenant not found, per Swagger)
    if (body.email.endsWith("@notfound.com")) {
      return HttpResponse.json(
        {
          success: false,
          message: "Property not found or not updated",
          data: {},
        },
        { status: 404 },
      );
    }

    // 200 - signup successful
    return HttpResponse.json(
      { success: true, message: "Signup successful", data: null },
      { status: 200 },
    );
  }),

  /* (4) */
  http.post("/api/auth/v1/forget-password", async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
    };

    // 400 - missing or invalid email
    if (!body.email || !body.email.includes("@")) {
      return HttpResponse.json(
        {
          success: false,
          message: "Email is required or invalid format",
          data: {},
        },
        { status: 400 },
      );
    }

    // 429 - rate limit simulation
    if (body.email === "ratelimit@test.com") {
      return HttpResponse.json(
        {
          success: false,
          message: "Too many requests, please try again later",
          data: {},
        },
        { status: 429 },
      );
    }

    // 500 - server error simulation
    if (body.email === "error@test.com") {
      return HttpResponse.json(
        { success: false, message: "Internal server error", data: {} },
        { status: 500 },
      );
    }

    // 401 - unauthorized
    if (body.email === "unauth@test.com") {
      return HttpResponse.json(
        { success: false, message: "Authorization failed", data: {} },
        { status: 401 },
      );
    }

    // 404 - email not registered
    const registeredEmails = ["test@test.com", "omar@beatza.com"];
    if (!registeredEmails.includes(body.email)) {
      return HttpResponse.json(
        {
          success: false,
          message: "Property not found or not updated",
          data: {},
        },
        { status: 404 },
      );
    }

    // 200 - email sent successfully
    return HttpResponse.json(
      {
        success: true,
        message: "Password reset email sent successfully",
        data: null,
      },
      { status: 200 },
    );
  }),

  /* (5) */
  http.post("/api/auth/v1/reset-password", async ({ request }) => {
    const body = (await request.json()) as {
      token: string;
      newPassword: string;
    };

    // 400 - missing token or password
    if (!body.token || !body.newPassword) {
      return HttpResponse.json(
        {
          success: false,
          message: "Token and new password are required",
          data: {},
        },
        { status: 400 },
      );
    }

    // 401 - unauthorized / invalid token
    if (body.token === "invalid-token") {
      return HttpResponse.json(
        {
          success: false,
          message: "Authorization failed",
          data: {},
        },
        { status: 401 },
      );
    }

    // 404 - token expired or not found
    if (body.token === "expired-token") {
      return HttpResponse.json(
        {
          success: false,
          message: "Property not found or not updated",
          data: {},
        },
        { status: 404 },
      );
    }

    // 500 - server error simulation
    if (body.token === "error-token") {
      return HttpResponse.json(
        {
          success: false,
          message: "Internal server error",
          data: {},
        },
        { status: 500 },
      );
    }

    // 200 - success
    return HttpResponse.json(
      {
        success: true,
        message: "Password reset successfully",
        data: null,
      },
      { status: 200 },
    );
  }),
];
