/// <reference types="jest" />

/**
 * Auth Hooks — Unit Tests
 *
 * The auth service is mocked so hook behavior is tested deterministically
 * without real HTTP calls.
 */

import { renderHook, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { ReactNode } from "react"
import authReducer from "@/store/slices/authSlice"

// ─── Mock next/navigation ─────────────────────────────────────────────────
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

// ─── Redux store factory ──────────────────────────────────────────────────
// each test gets a fresh store so state never leaks between tests
function makeStore() {
  return configureStore({
    reducer: { auth: authReducer },
  })
}

// wrapper that provides the Redux store to any hook being tested
function makeWrapper(store: ReturnType<typeof makeStore>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }
}

import { authService } from "@/services/auth.service"
import {
  useFindEmail,
  useLogin,
  useSignup,
  useForgetPassword,
  useResetPassword,
  useLogout,
  useVerifyEmail,
  useResendVerificationEmail,
} from "@/hooks/useAuth"

const failWithMessage = (message: string) =>
  Promise.reject({ response: { data: { message } } })

beforeEach(() => {
  jest.spyOn(authService, "refreshToken").mockResolvedValue({ data: {} } as any)

  jest.spyOn(authService, "findEmail").mockImplementation(async ({ email }: any) => {
    if (!email || !email.includes("@")) {
      return failWithMessage("Email is required or invalid format")
    }
    if (email === "ratelimit@test.com") {
      return failWithMessage("Too many requests, please try again later")
    }
    if (email === "error@test.com") {
      return failWithMessage("Something went wrong on the server")
    }
    const exists = ["test@test.com", "omar@beatza.com", "unverified@test.com"].includes(email)
    return { data: { data: { exists } } } as any
  })

  jest.spyOn(authService, "login").mockImplementation(async ({ email, password }: any) => {
    if (!email || !email.includes("@")) {
      return failWithMessage("Email is required or invalid format")
    }
    if (!password || password.trim().length === 0) {
      return failWithMessage("Password is required")
    }
    if (email === "ratelimit@test.com") {
      return failWithMessage("Too many requests, please try again later")
    }
    if (email === "error@test.com") {
      return failWithMessage("Something went wrong on the server")
    }
    const existingUsers: Record<string, string> = {
      "test@test.com": "test1234",
      "omar@beatza.com": "omar1234",
      "unverified@test.com": "unverified1234",
    }
    const storedPassword = existingUsers[email]
    if (!storedPassword) {
      return failWithMessage("User not found")
    }
    if (storedPassword !== password) {
      return failWithMessage("Authorization failed")
    }
    if (email === "unverified@test.com") {
      return failWithMessage("Email not verified. Please verify your email before logging in.")
    }
    return { data: { success: true, message: "Authenticated successfully", data: {} } } as any
  })

  jest.spyOn(authService, "signup").mockImplementation(async ({ email, password, displayName, dateOfBirth, gender }: any) => {
    if (!email || !email.includes("@")) {
      return failWithMessage("Email is required or invalid format")
    }
    if (!password || password.trim().length === 0) {
      return failWithMessage("Password is required")
    }
    if (!displayName || displayName.trim().length === 0) {
      return failWithMessage("Display name is required")
    }
    if (!dateOfBirth || Number.isNaN(Date.parse(dateOfBirth))) {
      return failWithMessage("Date of birth is required or invalid format")
    }
    if (!gender) {
      return failWithMessage("Gender is required")
    }
    if (email === "ratelimit@test.com") {
      return failWithMessage("Too many requests, please try again later")
    }
    if (email === "error@test.com") {
      return failWithMessage("Internal server error")
    }
    if (["test@test.com", "omar@beatza.com"].includes(email)) {
      return failWithMessage("Authorization failed")
    }
    if (email.endsWith("@notfound.com")) {
      return failWithMessage("Property not found or not updated")
    }
    return { data: { success: true, message: "Signup successful", data: null } } as any
  })

  jest.spyOn(authService, "forgetPassword").mockImplementation(async ({ email }: any) => {
    if (!email || !email.includes("@")) {
      return failWithMessage("Email is required or invalid format")
    }
    if (email === "ratelimit@test.com") {
      return failWithMessage("Too many requests, please try again later")
    }
    if (email === "error@test.com") {
      return failWithMessage("Internal server error")
    }
    if (email === "unauth@test.com") {
      return failWithMessage("Authorization failed")
    }
    if (!["test@test.com", "omar@beatza.com"].includes(email)) {
      return failWithMessage("Property not found or not updated")
    }
    return { data: { success: true, message: "Password reset email sent successfully", data: null } } as any
  })

  jest.spyOn(authService, "resetPassword").mockImplementation(async ({ token, newPassword }: any) => {
    if (!token || !newPassword) {
      return failWithMessage("Token and new password are required")
    }
    if (token === "invalid-token") {
      return failWithMessage("Authorization failed")
    }
    if (token === "expired-token") {
      return failWithMessage("Property not found or not updated")
    }
    if (token === "error-token") {
      return failWithMessage("Internal server error")
    }
    return { data: { message: "Password reset successfully" } } as any
  })

  jest.spyOn(authService, "logout").mockResolvedValue({ data: { message: "Logged out successfully", data: null } } as any)

  jest.spyOn(authService, "verifyEmail").mockImplementation(async (token: string) => {
    if (!token || token === "invalid-token") {
      return failWithMessage("Authorization failed")
    }
    if (token === "not-found-token") {
      return failWithMessage("Property not found or not updated")
    }
    if (token === "expired-token") {
      return failWithMessage("Link is expired")
    }
    if (token === "error-token") {
      return failWithMessage("Internal server error")
    }
    return { data: { message: "User Verified successfully" } } as any
  })

  jest.spyOn(authService, "resendVerificationEmail").mockImplementation(async ({ email }: any) => {
    if (!email || !email.includes("@")) {
      return failWithMessage("User not found")
    }
    if (email === "error@test.com") {
      return failWithMessage("Internal server error")
    }
    if (!["test@test.com", "omar@beatza.com"].includes(email)) {
      return failWithMessage("User not found")
    }
    return { data: { message: "Verification email sent successfully" } } as any
  })
})

afterEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

// ═══════════════════════════════════════════════════════════════════════════
// 1. useFindEmail
//    Handler: POST /api/auth/v1/find-email
// ═══════════════════════════════════════════════════════════════════════════
describe("useFindEmail()", () => {
  test("exists=true for a registered email", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useFindEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.findEmail("test@test.com")
    })

    expect(result.current.exists).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  test("exists=false for an unregistered email", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useFindEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.findEmail("nobody@test.com")
    })

    expect(result.current.exists).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test("sets error for invalid email format (no @) → 400", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useFindEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.findEmail("notanemail")
    })

    expect(result.current.error).toBe("Email is required or invalid format")
    expect(result.current.exists).toBeNull()
  })

  test("sets error for rate-limited email → 429", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useFindEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.findEmail("ratelimit@test.com")
    })

    expect(result.current.error).toBe("Too many requests, please try again later")
  })

  test("sets error for server error email → 500", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useFindEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.findEmail("error@test.com")
    })

    expect(result.current.error).toBe("Something went wrong on the server")
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 2. useLogin
//    Handler: POST /api/auth/v1/login
// ═══════════════════════════════════════════════════════════════════════════
describe("useLogin()", () => {
  test("sets success and dispatches setAuth on correct credentials", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.login("test@test.com", "test1234")
    })

    expect(result.current.success).toBe(true)
    expect(result.current.error).toBeNull()

    // verify Redux state was updated instead of checking authStore calls
    expect(store.getState().auth.isAuthenticated).toBe(true)
  })

  test("sets error for wrong password → 401", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.login("test@test.com", "wrongpassword")
    })

    expect(result.current.error).toBe("Authorization failed")
    expect(result.current.success).toBe(false)
    expect(store.getState().auth.isAuthenticated).toBe(false)
  })

  test("sets error for unknown user → 404", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.login("ghost@test.com", "somepassword")
    })

    expect(result.current.error).toBe("User not found")
    expect(result.current.success).toBe(false)
  })

  test("sets error for unverified email → 403", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.login("unverified@test.com", "unverified1234")
    })

    expect(result.current.error).toMatch(/email not verified/i)
    expect(result.current.success).toBe(false)
  })

  test("sets error for invalid email format → 400", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.login("notanemail", "pass123")
    })

    expect(result.current.error).toBe("Email is required or invalid format")
  })

  test("sets error for empty password → 400", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.login("test@test.com", "   ")
    })

    expect(result.current.error).toBe("Password is required")
  })

  test("sets error for rate limit → 429", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.login("ratelimit@test.com", "pass123")
    })

    expect(result.current.error).toBe("Too many requests, please try again later")
  })

  test("sets error for server error → 500", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.login("error@test.com", "pass123")
    })

    expect(result.current.error).toBe("Something went wrong on the server")
  })

  test("loading resets to false after completion", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.login("test@test.com", "test1234")
    })

    expect(result.current.loading).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 3. useSignup
//    Handler: POST /api/auth/v1/sign-up
// ═══════════════════════════════════════════════════════════════════════════
describe("useSignup()", () => {
  const validArgs: [string, string, string, string, string] = [
    "newuser@test.com", "pass1234", "John", "2000-01-01", "male",
  ]

  test("sets success for a new valid user", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useSignup(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.signup(...validArgs)
    })

    expect(result.current.success).toBe(true)
    expect(result.current.error).toBeNull()
  })

  test("sets error for already registered email → 401", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useSignup(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.signup("test@test.com", "pass1234", "John", "2000-01-01", "male")
    })

    expect(result.current.error).toBe("Authorization failed")
    expect(result.current.success).toBe(false)
  })

  test("sets error for missing displayName → 400", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useSignup(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.signup("new@test.com", "pass1234", "", "2000-01-01", "male")
    })

    expect(result.current.error).toBe("Display name is required")
  })

  test("sets error for invalid dateOfBirth → 400", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useSignup(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.signup("new@test.com", "pass1234", "John", "not-a-date", "male")
    })

    expect(result.current.error).toBe("Date of birth is required or invalid format")
  })

  test("sets error for missing gender → 400", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useSignup(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.signup("new@test.com", "pass1234", "John", "2000-01-01", "")
    })

    expect(result.current.error).toBe("Gender is required")
  })

  test("sets error for rate limit → 429", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useSignup(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.signup("ratelimit@test.com", "pass1234", "John", "2000-01-01", "male")
    })

    expect(result.current.error).toBe("Too many requests, please try again later")
  })

  test("sets error for server error → 500", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useSignup(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.signup("error@test.com", "pass1234", "John", "2000-01-01", "male")
    })

    expect(result.current.error).toBe("Internal server error")
  })

  test("returns failure object when signup fails", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useSignup(), { wrapper: makeWrapper(store) })
    let returnValue: any

    await act(async () => {
      returnValue = await result.current.signup("test@test.com", "pass", "John", "2000-01-01", "male")
    })

    expect(returnValue.success).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 4. useForgetPassword
//    Handler: POST /api/auth/v1/forgot-password
// ═══════════════════════════════════════════════════════════════════════════
describe("useForgetPassword()", () => {
  test("sets success for registered email", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useForgetPassword(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.forgetPassword("test@test.com")
    })

    expect(result.current.success).toBe(true)
    expect(result.current.error).toBeNull()
  })

  test("sets error for unregistered email → 404", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useForgetPassword(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.forgetPassword("nobody@test.com")
    })

    expect(result.current.error).toBe("Property not found or not updated")
    expect(result.current.success).toBe(false)
  })

  test("sets error for invalid email format → 400", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useForgetPassword(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.forgetPassword("notanemail")
    })

    expect(result.current.error).toBe("Email is required or invalid format")
  })

  test("sets error for rate limit → 429", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useForgetPassword(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.forgetPassword("ratelimit@test.com")
    })

    expect(result.current.error).toBe("Too many requests, please try again later")
  })

  test("sets error for unauthorized email → 401", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useForgetPassword(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.forgetPassword("unauth@test.com")
    })

    expect(result.current.error).toBe("Authorization failed")
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 5. useResetPassword
//    Handler: POST /api/auth/v1/reset-password
// ═══════════════════════════════════════════════════════════════════════════
describe("useResetPassword()", () => {
  test("sets success for valid token", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useResetPassword(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.resetPassword("valid-token", "NewPass123!")
    })

    expect(result.current.success).toBe(true)
    expect(result.current.error).toBeNull()
  })

  test("sets error for invalid token → 401", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useResetPassword(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.resetPassword("invalid-token", "NewPass123!")
    })

    expect(result.current.error).toBe("Authorization failed")
    expect(result.current.success).toBe(false)
  })

  test("sets error for expired token → 404", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useResetPassword(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.resetPassword("expired-token", "NewPass123!")
    })

    expect(result.current.error).toBe("Property not found or not updated")
  })

  test("sets error for server error token → 500", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useResetPassword(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.resetPassword("error-token", "NewPass123!")
    })

    expect(result.current.error).toBe("Internal server error")
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 6. useLogout
//    Handler: GET /api/auth/v1/logout
// ═══════════════════════════════════════════════════════════════════════════
describe("useLogout()", () => {
  test("clears auth state in Redux and sets success", async () => {
    const store = makeStore()

    // pre-load some auth state so we can verify it gets cleared
    store.dispatch({ type: "auth/setAuth", payload: {
      userId: "123",
      displayName: "Omar",
      profileImgLink: null,
      bannerImgLink: null,
    }})

    const { result } = renderHook(() => useLogout(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.success).toBe(true)
    expect(result.current.error).toBeNull()

    // verify Redux was cleared instead of checking individual authStore calls
    expect(store.getState().auth.isAuthenticated).toBe(false)
    expect(store.getState().auth.userId).toBeNull()
    expect(store.getState().auth.displayName).toBeNull()
    expect(store.getState().auth.profileImgLink).toBeNull()
    expect(store.getState().auth.bannerImgLink).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 7. useVerifyEmail
//    Handler: GET /api/auth/v1/verify-email?token=...
// ═══════════════════════════════════════════════════════════════════════════
describe("useVerifyEmail()", () => {
  test("sets success for valid token", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useVerifyEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.verifyEmail("valid-token")
    })

    expect(result.current.success).toBe(true)
    expect(result.current.error).toBeNull()
  })

  test("sets error for invalid token → 401", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useVerifyEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.verifyEmail("invalid-token")
    })

    expect(result.current.error).toBe("Authorization failed")
    expect(result.current.success).toBe(false)
  })

  test("sets error for expired token → 410", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useVerifyEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.verifyEmail("expired-token")
    })

    expect(result.current.error).toBe("Link is expired")
  })

  test("sets error for not-found token → 404", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useVerifyEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.verifyEmail("not-found-token")
    })

    expect(result.current.error).toBe("Property not found or not updated")
  })

  test("sets error for server error token → 500", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useVerifyEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.verifyEmail("error-token")
    })

    expect(result.current.error).toBe("Internal server error")
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 8. useResendVerificationEmail
//    Handler: POST /api/auth/v1/resend-verification-email
// ═══════════════════════════════════════════════════════════════════════════
describe("useResendVerificationEmail()", () => {
  test("sets success for a registered email", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useResendVerificationEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.resendVerificationEmail("test@test.com")
    })

    expect(result.current.success).toBe(true)
    expect(result.current.error).toBeNull()
  })

  test("sets error for unregistered email → 404", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useResendVerificationEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.resendVerificationEmail("notregistered@test.com")
    })

    expect(result.current.error).toBe("User not found")
    expect(result.current.success).toBe(false)
  })

  test("sets error for invalid email format → 404", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useResendVerificationEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.resendVerificationEmail("notanemail")
    })

    expect(result.current.error).toBe("User not found")
  })

  test("sets error for server error → 500", async () => {
    const store = makeStore()
    const { result } = renderHook(() => useResendVerificationEmail(), { wrapper: makeWrapper(store) })

    await act(async () => {
      await result.current.resendVerificationEmail("error@test.com")
    })

    expect(result.current.error).toBe("Internal server error")
  })
})