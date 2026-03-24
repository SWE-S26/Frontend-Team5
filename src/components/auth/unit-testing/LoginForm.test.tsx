/// <reference types="jest" />

/**
 * LoginForm — Component Tests
 *
 * Tests UI rendering, user interactions, and step transitions.
 * All hooks and child components are mocked.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ─── Mock next/navigation ────────────────────────────────────────────────────
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

// ─── Mock child components ───────────────────────────────────────────────────
jest.mock("../ForgotPasswordForm", () => ({
  __esModule: true,
  default: ({ onBack }: any) => (
    <div data-testid="forgot-password-form">
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

jest.mock("../RegisterDetailsForm", () => ({
  __esModule: true,
  default: ({ onBack, onComplete }: any) => (
    <div data-testid="register-details-form">
      <button onClick={onBack}>Back</button>
      <button onClick={() => onComplete({ displayName: "John", dob: "2000-01-01", gender: "male" })}>
        Complete
      </button>
    </div>
  ),
}));

jest.mock("../DetailsValidationForm", () => ({
  __esModule: true,
  default: ({ onBackToLogin }: any) => (
    <div data-testid="details-validation-form">
      <button onClick={onBackToLogin}>Back to Login</button>
    </div>
  ),
}));

// ─── Mock hooks ──────────────────────────────────────────────────────────────
const mockFindEmail       = jest.fn();
const mockLogin           = jest.fn();
const mockSignup          = jest.fn();
const mockForgetPassword  = jest.fn();
const mockCompleteGoogle  = jest.fn();
const mockVerifyGoogle    = jest.fn();
const mockResendVerification = jest.fn();

jest.mock("@/hooks/useAuth", () => ({
  useFindEmail: () => ({
    findEmail: mockFindEmail,
    loading: false,
    error: null,
    exists: null,
  }),
  useLogin: () => ({
    login: mockLogin,
    loading: false,
    error: null,
    success: null,
  }),
  useSignup: () => ({
    signup: mockSignup,
    loading: false,
    error: null,
    success: null,
  }),
  useForgetPassword: () => ({
    forgetPassword: mockForgetPassword,
    loading: false,
    error: null,
  }),
  useGoogleComplete: () => ({
    completeGoogleSignup: mockCompleteGoogle,
    loading: false,
    error: null,
  }),
  useGoogleVerifyCode: () => ({
    verifyGoogleCode: mockVerifyGoogle,
    loading: false,
    error: null,
  }),
  useResendVerificationEmail: () => ({
    resendVerificationEmail: mockResendVerification,
    loading: false,
    success: null,
  }),
}));

import LoginForm from "@/components/auth/LoginForm"; // 👈 update path if needed

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
beforeEach(() => jest.clearAllMocks());

const renderForm = (props = {}) => render(<LoginForm {...props} />);

// Move to password step (existing user)
const goToPasswordStep = async (email = "test@test.com", exists = true) => {
  mockFindEmail.mockResolvedValueOnce({ data: { exists } });
  renderForm();
  await userEvent.click(screen.getByTestId("email-input"));
  await userEvent.type(screen.getByTestId("email-input"), email);
  await userEvent.click(screen.getByTestId("continue-button-login"));
  await waitFor(() => screen.getByTestId("password-input"));
};

// ════════════════════════════════════════════════════════════════════════════
// 1. Initial Render — Email Step
// ════════════════════════════════════════════════════════════════════════════
describe("Initial Render (email step)", () => {
  test("renders the login form container", () => {
    renderForm();
    expect(screen.getByTestId("Login-Form")).toBeTruthy();
  });

  test("renders email input", () => {
    renderForm();
    expect(screen.getByTestId("email-input")).toBeTruthy();
  });

  test("renders continue button", () => {
    renderForm();
    expect(screen.getByTestId("continue-button-login")).toBeTruthy();
  });

  test("renders Google sign-in button", () => {
    renderForm();
    expect(screen.getByTestId("signin-google")).toBeTruthy();
  });

  test("renders QR code sign-in button", () => {
    renderForm();
    expect(screen.getByTestId("signin-qrCode")).toBeTruthy();
  });

  test("renders need help button", () => {
    renderForm();
    expect(screen.getByTestId("need-help-button")).toBeTruthy();
  });

  test("continue button is disabled when email is empty", () => {
    renderForm();
    const btn = screen.getByTestId("continue-button-login") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  test("continue button is enabled when email is typed", async () => {
    renderForm();
    await userEvent.type(screen.getByTestId("email-input"), "test@test.com");
    const btn = screen.getByTestId("continue-button-login") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  test("does NOT show back button initially", () => {
    renderForm();
    expect(screen.queryByTestId("back-to-login-button-login")).toBeNull();
  });

  test("shows back button after email input is focused", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("email-input"));
    expect(screen.getByTestId("back-to-login-button-login")).toBeTruthy();
  });

  test("password input is NOT visible on email step", () => {
    renderForm();
    expect(screen.queryByTestId("password-input")).toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Email Validation
// ════════════════════════════════════════════════════════════════════════════
describe("Email Validation", () => {
  test("shows error for invalid email format", async () => {
    renderForm();
    await userEvent.type(screen.getByTestId("email-input"), "notanemail");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeTruthy();
    });
  });

  test("does NOT call findEmail for invalid email", async () => {
    renderForm();
    await userEvent.type(screen.getByTestId("email-input"), "notanemail");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    expect(mockFindEmail).not.toHaveBeenCalled();
  });

  test("clears email error when user starts typing again", async () => {
    renderForm();
    await userEvent.type(screen.getByTestId("email-input"), "bad");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => screen.getByText(/valid email/i));
    await userEvent.type(screen.getByTestId("email-input"), "@test.com");
    await waitFor(() => {
      expect(screen.queryByText(/valid email/i)).toBeNull();
    });
  });

  test("calls findEmail with correct email for valid input", async () => {
    mockFindEmail.mockResolvedValueOnce({ data: { exists: true } });
    renderForm();
    await userEvent.type(screen.getByTestId("email-input"), "test@test.com");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => {
      expect(mockFindEmail).toHaveBeenCalledWith("test@test.com");
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Step Transition — Email → Password
// ════════════════════════════════════════════════════════════════════════════
describe("Step Transition: Email → Password", () => {
  test("shows password input after valid email and findEmail succeeds", async () => {
    await goToPasswordStep();
    expect(screen.getByTestId("password-input")).toBeTruthy();
  });

  test("shows 'Welcome back!' for existing user", async () => {
    await goToPasswordStep("test@test.com", true);
    expect(screen.getByText(/welcome back/i)).toBeTruthy();
  });

  test("shows 'Create an account' for new user", async () => {
    await goToPasswordStep("new@test.com", false);
    expect(screen.getByText(/create an account/i)).toBeTruthy();
  });

  test("shows forgot password button for existing user", async () => {
    await goToPasswordStep("test@test.com", true);
    expect(screen.getByTestId("forgot-password-button")).toBeTruthy();
  });

  test("does NOT show forgot password button for new user", async () => {
    await goToPasswordStep("new@test.com", false);
    expect(screen.queryByTestId("forgot-password-button")).toBeNull();
  });

  test("hides Google and QR buttons on password step", async () => {
    await goToPasswordStep();
    expect(screen.queryByTestId("signin-google")).toBeNull();
    expect(screen.queryByTestId("signin-qrCode")).toBeNull();
  });

  test("shows back button on password step", async () => {
    await goToPasswordStep();
    expect(screen.getByTestId("back-to-login-button-login")).toBeTruthy();
  });

  test("continue button is disabled when password is empty", async () => {
    await goToPasswordStep();
    const btn = screen.getByTestId("continue-button-login") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  test("continue button is enabled when password is typed", async () => {
    await goToPasswordStep();
    await userEvent.type(screen.getByTestId("password-input"), "pass123");
    const btn = screen.getByTestId("continue-button-login") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Password Visibility Toggle
// ════════════════════════════════════════════════════════════════════════════
describe("Password Visibility Toggle", () => {
  test("password is hidden by default", async () => {
    await goToPasswordStep();
    const input = screen.getByTestId("password-input") as HTMLInputElement;
    expect(input.type).toBe("password");
  });

  test("clicking show password button reveals password", async () => {
    await goToPasswordStep();
    await userEvent.click(screen.getByTestId("show-password-button"));
    const input = screen.getByTestId("password-input") as HTMLInputElement;
    expect(input.type).toBe("text");
  });

  test("clicking show password button again hides it", async () => {
    await goToPasswordStep();
    await userEvent.click(screen.getByTestId("show-password-button"));
    await userEvent.click(screen.getByTestId("show-password-button"));
    const input = screen.getByTestId("password-input") as HTMLInputElement;
    expect(input.type).toBe("password");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Login (Existing User)
// ════════════════════════════════════════════════════════════════════════════
describe("Login — Existing User", () => {
  test("calls login with correct email and password", async () => {
    mockFindEmail.mockResolvedValueOnce({ data: { exists: true } });
    mockLogin.mockResolvedValueOnce({ message: "Authenticated successfully" });

    renderForm();
    await userEvent.type(screen.getByTestId("email-input"), "test@test.com");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => screen.getByTestId("password-input"));

    await userEvent.type(screen.getByTestId("password-input"), "pass1234");
    await userEvent.click(screen.getByTestId("continue-button-login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@test.com", "pass1234");
    });
  });

  test("calls onAuthSuccess callback on successful login", async () => {
    mockFindEmail.mockResolvedValueOnce({ data: { exists: true } });
    mockLogin.mockResolvedValueOnce({ message: "Authenticated successfully" });
    const onAuthSuccess = jest.fn();

    render(<LoginForm onAuthSuccess={onAuthSuccess} />);
    await userEvent.type(screen.getByTestId("email-input"), "test@test.com");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => screen.getByTestId("password-input"));

    await userEvent.type(screen.getByTestId("password-input"), "pass1234");
    await userEvent.click(screen.getByTestId("continue-button-login"));

    await waitFor(() => expect(onAuthSuccess).toHaveBeenCalled());
  });

  test("shows success message after login", async () => {
    mockFindEmail.mockResolvedValueOnce({ data: { exists: true } });
    mockLogin.mockResolvedValueOnce({ message: "Authenticated successfully" });

    renderForm();
    await userEvent.type(screen.getByTestId("email-input"), "test@test.com");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => screen.getByTestId("password-input"));

    await userEvent.type(screen.getByTestId("password-input"), "pass1234");
    await userEvent.click(screen.getByTestId("continue-button-login"));

    await waitFor(() => {
      expect(screen.getByText(/signed in successfully/i)).toBeTruthy();
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. Back Button Navigation
// ════════════════════════════════════════════════════════════════════════════
describe("Back Button Navigation", () => {
  test("clicking back on password step returns to email step", async () => {
    await goToPasswordStep();
    await userEvent.click(screen.getByTestId("back-to-login-button-login"));
    await waitFor(() => {
      expect(screen.queryByTestId("password-input")).toBeNull();
      expect(screen.getByTestId("email-input")).toBeTruthy();
    });
  });

  test("clicking back clears password field", async () => {
    await goToPasswordStep();
    await userEvent.type(screen.getByTestId("password-input"), "mypassword");
    await userEvent.click(screen.getByTestId("back-to-login-button-login"));
    await waitFor(() => screen.getByTestId("email-input"));
    // Go to password step again - password should be cleared
    mockFindEmail.mockResolvedValueOnce({ data: { exists: true } });
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => screen.getByTestId("password-input"));
    const input = screen.getByTestId("password-input") as HTMLInputElement;
    expect(input.value).toBe("");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 7. Forgot Password
// ════════════════════════════════════════════════════════════════════════════
describe("Forgot Password", () => {
  test("clicking forgot password shows ForgotPasswordForm", async () => {
    await goToPasswordStep("test@test.com", true);
    await userEvent.click(screen.getByTestId("forgot-password-button"));
    await waitFor(() => {
      expect(screen.getByTestId("forgot-password-form")).toBeTruthy();
    });
  });

  test("clicking back in ForgotPasswordForm returns to email step", async () => {
    await goToPasswordStep("test@test.com", true);
    await userEvent.click(screen.getByTestId("forgot-password-button"));
    await waitFor(() => screen.getByTestId("forgot-password-form"));
    await userEvent.click(screen.getByText("Back"));
    await waitFor(() => {
      expect(screen.queryByTestId("forgot-password-form")).toBeNull();
      expect(screen.getByTestId("email-input")).toBeTruthy();
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 8. Sign Up (New User) → Register Details
// ════════════════════════════════════════════════════════════════════════════
describe("Sign Up — New User", () => {
  test("navigates to RegisterDetailsForm for new user with valid password", async () => {
    await goToPasswordStep("new@test.com", false);
    // Use a strong password that passes validation
    await userEvent.type(screen.getByTestId("password-input"), "StrongPass1!");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => {
      expect(screen.getByTestId("register-details-form")).toBeTruthy();
    });
  });

  test("shows password validation error for weak password on signup", async () => {
    await goToPasswordStep("new@test.com", false);
    await userEvent.type(screen.getByTestId("password-input"), "weak");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeTruthy();
    });
  });

  test("calls signup after completing register details", async () => {
    mockSignup.mockResolvedValueOnce({ success: true });
    await goToPasswordStep("new@test.com", false);
    await userEvent.type(screen.getByTestId("password-input"), "StrongPass1!");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => screen.getByTestId("register-details-form"));
    await userEvent.click(screen.getByText("Complete"));
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "new@test.com", "StrongPass1!", "John", "2000-01-01", "male"
      );
    });
  });

  test("shows DetailsValidationForm after successful signup", async () => {
    mockSignup.mockResolvedValueOnce({ success: true });
    await goToPasswordStep("new@test.com", false);
    await userEvent.type(screen.getByTestId("password-input"), "StrongPass1!");
    await userEvent.click(screen.getByTestId("continue-button-login"));
    await waitFor(() => screen.getByTestId("register-details-form"));
    await userEvent.click(screen.getByText("Complete"));
    await waitFor(() => {
      expect(screen.getByTestId("details-validation-form")).toBeTruthy();
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 9. Google & QR Sign-In Buttons
// ════════════════════════════════════════════════════════════════════════════
describe("Google & QR Sign-In", () => {
  test("clicking QR code button calls router.push('/qr-login')", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("signin-qrCode"));
    expect(mockPush).toHaveBeenCalledWith("/qr-login");
  });
});