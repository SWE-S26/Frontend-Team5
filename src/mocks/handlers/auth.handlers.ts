import { http, HttpResponse } from "msw";
const BASE = process.env.NEXT_PUBLIC_API_URL;
export const authHandlers = [
  /* (1) */
  http.post(`${BASE}/api/auth/v1/find-email`, async ({ request }) => {
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
    const existingEmails = [
      "test@test.com",
      "omar@beatza.com",
      "unverified@test.com",
    ];
    const exists = existingEmails.includes(body.email);
    return HttpResponse.json(
      { data: { exists }, message: "Email exists in the system" },
      { status: 200 },
    );
  }),

  /* (2) */
  http.post(`${BASE}/api/auth/v1/login`, async ({ request }) => {
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
      "unverified@test.com": "unverified1234",
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

    // 403 - email not verified
    if (body.email === "unverified@test.com") {
      return HttpResponse.json(
        {
          success: false,
          message:
            "Email not verified. Please verify your email before logging in.",
          data: {},
        },
        { status: 403 },
      );
    }

    // 200 - success (tokens are typically set via httpOnly cookies)
    return HttpResponse.json(
      { success: true, message: "Authenticated successfully", data: {} },
      { status: 200 },
    );
  }),

  /* (3) */
  http.post(`${BASE}/api/auth/v1/sign-up`, async ({ request }) => {
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
  http.post(`${BASE}/api/auth/v1/forgot-password`, async ({ request }) => {
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
  http.post(`${BASE}/api/auth/v1/reset-password`, async ({ request }) => {
    /*
      /reset-password?token=valid-token   -> success screen + redirect
      /reset-password?token=invalid-token -> "Authorization failed"
      /reset-password?token=expired-token -> "Property not found or not updated"
      /reset-password?token=error-token   -> "Internal server error" 
      /reset-password                     -> "Missing or invalid token!" 
    */
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

    // 200 - success (to test add a token in your url: {reset-password?token=valid-token})
    return HttpResponse.json(
      { message: "Password reset successfully" },
      { status: 200 },
    );
  }),

  /* (6) */
  http.get(`${BASE}/api/auth/v1/logout`, async () => {
    // 401 - no token / invalid token (handled automatically by axios interceptor)
    // 500 - server error simulation (no request body to trigger it, so use a flag or just leave it)

    // 200 - success
    return HttpResponse.json(
      { message: "Logged out successfully", data: null },
      { status: 200 },
    );
  }),

  /* (10) */
  http.get(`${BASE}/api/auth/v1/verify-email`, async ({ request }) => {
    /*
      /verify-email?token=valid-token   -> success
      /verify-email?token=expired-token -> Link is expired
      /verify-email?token=invalid-token -> Authorization failed
      /verify-email                     -> Invalid link
    */
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    // 400 - missing token
    if (!token) {
      return HttpResponse.json(
        { success: false, message: "Authorization failed", data: {} },
        { status: 401 },
      );
    }

    // 401 - invalid token
    if (token === "invalid-token") {
      return HttpResponse.json(
        { success: false, message: "Authorization failed", data: {} },
        { status: 401 },
      );
    }

    // 404 - token not found
    if (token === "not-found-token") {
      return HttpResponse.json(
        {
          success: false,
          message: "Property not found or not updated",
          data: {},
        },
        { status: 404 },
      );
    }

    // 410 - link expired
    if (token === "expired-token") {
      return HttpResponse.json(
        { success: false, message: "Link is expired" },
        { status: 410 },
      );
    }

    // 500 - server error
    if (token === "error-token") {
      return HttpResponse.json(
        { success: false, message: "Internal server error", data: {} },
        { status: 500 },
      );
    }

    // 200 - success
    return HttpResponse.json(
      { message: "User Verified successfully" },
      { status: 200 },
    );
  }),

  /* (11) */
  http.post(
    `${BASE}/api/auth/v1/resend-verification-email`,
    async ({ request }) => {
      const body = (await request.json()) as { email: string };

      // 404 - email not found
      if (!body.email || !body.email.includes("@")) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      // 500 - server error simulation
      if (body.email === "error@test.com") {
        return HttpResponse.json(
          { message: "Internal server error" },
          { status: 500 },
        );
      }

      // 404 - unregistered email
      const registeredEmails = ["test@test.com", "omar@beatza.com"];
      if (!registeredEmails.includes(body.email)) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      // 200 - success
      return HttpResponse.json(
        { message: "Verification email sent successfully" },
        { status: 200 },
      );
    },
  ),
  
  /* (12) Generate QR Code for Cross-Device Login */
  http.get(`${BASE}/api/auth/v1/cross/desktop`, async () => {
    // 429 - rate limit
    if (Math.random() > 0.98) {
      return HttpResponse.json(
        { message: "Too many requests, please try again later" },
        { status: 429 },
      );
    }

    // 500 - server error
    if (Math.random() > 0.99) {
      return HttpResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }

    // 200 - generate QR payload
    const pendingToken = "qr-" + Math.random().toString(36).slice(2, 10);
    return HttpResponse.json(
      {
        message: "QR code generated successfully",
        data: {
          pendingToken: {
            qrCode: pendingToken,
            expiresIn: 120,
            createdAt: new Date().toISOString(),
          },
        },
      },
      { status: 200 },
    );
  }),

  /* (13) Poll QR Login Status */
  http.post(`${BASE}/api/auth/v1/cross/desktop/poll`, async ({ request }) => {
    const body = (await request.json()) as { qrCode: string };

    // 400 - missing qrCode
    if (!body.qrCode) {
      return HttpResponse.json(
        { message: "QR code is required", status: "error" },
        { status: 400 },
      );
    }

    // Simulate different polling states based on qrCode value
    // Use qrCode suffix to control behavior for testing:
    // - qr-success-* -> successful login
    // - qr-expired-* -> expired
    // - qr-pending-* -> still waiting (default)
    // - qr-error-* -> server error

    if (body.qrCode.startsWith("qr-error-")) {
      return HttpResponse.json(
        { message: "Internal server error", status: "error" },
        { status: 500 },
      );
    }

    if (
      body.qrCode.startsWith("qr-expired-") ||
      body.qrCode.endsWith("-expired")
    ) {
      return HttpResponse.json(
        { message: "QR code has expired", status: "expired" },
        { status: 410 },
      );
    }

    if (
      body.qrCode.startsWith("qr-success-") ||
      body.qrCode.endsWith("-success")
    ) {
      // Simulate successful login after polling
      return HttpResponse.json(
        {
          message: "Login successful",
          status: "success",
          data: {
            user: {
              id: "user-123",
              displayName: "QR Login User",
              email: "qruser@test.com",
              profileImg: { imgLink: "https://example.com/qr-avatar.jpg" },
            },
          },
        },
        { status: 200 },
      );
    }

    // Default: still pending/waiting for scan
    return HttpResponse.json(
      { message: "Waiting for QR code scan", status: "pending" },
      { status: 200 },
    );
  }),
];

