/**
 * ForgotPasswordForm — Component Tests
 */

/// <reference types="jest" />

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ─── Mock next/navigation ────────────────────────────────────────────────────
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

// ─── Mock useForgetPassword hook ─────────────────────────────────────────────
const mockForgetPassword = jest.fn();
let mockLoading = false;
let mockHookError: string | null = null;

jest.mock("@/hooks/useAuth", () => ({
  useForgetPassword: () => ({
    forgetPassword: mockForgetPassword,
    loading: mockLoading,
    error: mockHookError,
  }),
}));

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
beforeEach(() => {
  jest.clearAllMocks();
  mockLoading = false;
  mockHookError = null;
});

const mockOnBack    = jest.fn();
const mockOnSuccess = jest.fn();
const mockSetEmail  = jest.fn();

const defaultProps = {
  email: "",
  setEmail: mockSetEmail,
  onBack: mockOnBack,
  onSuccess: mockOnSuccess,
};

const renderForm = (props = {}) =>
  render(<ForgotPasswordForm {...defaultProps} {...props} />);

// ════════════════════════════════════════════════════════════════════════════
// 1. Initial Render
// ════════════════════════════════════════════════════════════════════════════
describe("Initial Render", () => {
  test("renders the form container", () => {
    renderForm();
    expect(screen.getByTestId("Forget-Password-Form")).toBeTruthy();
  });

  test("renders email input", () => {
    renderForm();
    expect(screen.getByTestId("forget-password-email-input")).toBeTruthy();
  });

  test("renders back button", () => {
    renderForm();
    expect(screen.getByTestId("back-to-login-forgot")).toBeTruthy();
  });

  test("renders send reset link button", () => {
    renderForm();
    expect(screen.getByTestId("send-link-button")).toBeTruthy();
  });

  test("renders 'Reset password' heading", () => {
    renderForm();
    expect(screen.getByText(/reset password/i)).toBeTruthy();
  });

  test("send button is disabled when email is empty", () => {
    renderForm({ email: "" });
    const btn = screen.getByTestId("send-link-button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  test("send button is enabled when email is provided", () => {
    renderForm({ email: "test@test.com" });
    const btn = screen.getByTestId("send-link-button") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  test("email input shows the current email value", () => {
    renderForm({ email: "test@test.com" });
    const input = screen.getByTestId("forget-password-email-input") as HTMLInputElement;
    expect(input.value).toBe("test@test.com");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Email Input
// ════════════════════════════════════════════════════════════════════════════
describe("Email Input", () => {
  test("calls setEmail when user types", async () => {
    renderForm();
    await userEvent.type(screen.getByTestId("forget-password-email-input"), "a");
    expect(mockSetEmail).toHaveBeenCalled();
  });

  test("does not show email error initially", () => {
    renderForm();
    expect(screen.queryByText(/valid email/i)).toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Email Validation
// ════════════════════════════════════════════════════════════════════════════
describe("Email Validation", () => {
  test("shows error for invalid email format", async () => {
    renderForm({ email: "notanemail" });
    await userEvent.click(screen.getByTestId("send-link-button"));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeTruthy();
    });
  });

  test("does NOT call forgetPassword for invalid email", async () => {
    renderForm({ email: "notanemail" });
    await userEvent.click(screen.getByTestId("send-link-button"));
    expect(mockForgetPassword).not.toHaveBeenCalled();
  });

  test("does NOT call forgetPassword for empty email", async () => {
    renderForm({ email: "" });
    await userEvent.click(screen.getByTestId("send-link-button"));
    expect(mockForgetPassword).not.toHaveBeenCalled();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Sending Reset Link
// ════════════════════════════════════════════════════════════════════════════
describe("Sending Reset Link", () => {
  test("calls forgetPassword with correct email on valid submit", async () => {
    mockForgetPassword.mockResolvedValueOnce({ success: true });
    renderForm({ email: "test@test.com" });
    await userEvent.click(screen.getByTestId("send-link-button"));
    await waitFor(() => {
      expect(mockForgetPassword).toHaveBeenCalledWith("test@test.com");
    });
  });

  test("calls onSuccess after successful submission", async () => {
    mockForgetPassword.mockResolvedValueOnce({ success: true });
    renderForm({ email: "test@test.com" });
    await userEvent.click(screen.getByTestId("send-link-button"));
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  test("does NOT call onSuccess when forgetPassword returns falsy", async () => {
    mockForgetPassword.mockResolvedValueOnce(null);
    renderForm({ email: "test@test.com" });
    await userEvent.click(screen.getByTestId("send-link-button"));
    await waitFor(() => {
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Loading State
// ════════════════════════════════════════════════════════════════════════════
describe("Loading State", () => {
  test("shows 'Sending...' when loading=true", () => {
    mockLoading = true;

    render(
      <ForgotPasswordForm
        email="test@test.com"
        setEmail={mockSetEmail}
        onBack={mockOnBack}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText(/sending/i)).toBeTruthy();
  });

  test("button is disabled when loading", () => {
    mockLoading = true;
    renderForm({ email: "test@test.com" });
    const btn = screen.getByTestId("send-link-button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. Error from Hook
// ════════════════════════════════════════════════════════════════════════════
describe("Error from Hook", () => {
  test("shows error message from hook when present", () => {
    mockHookError = "User not found";
    render(
      <ForgotPasswordForm
        email="test@test.com"
        setEmail={mockSetEmail}
        onBack={mockOnBack}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText("User not found")).toBeTruthy();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 7. Back Button
// ════════════════════════════════════════════════════════════════════════════
describe("Back Button", () => {
  test("calls onBack when back button is clicked", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("back-to-login-forgot"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test("does NOT call forgetPassword when back is clicked", async () => {
    renderForm({ email: "test@test.com" });
    await userEvent.click(screen.getByTestId("back-to-login-forgot"));
    expect(mockForgetPassword).not.toHaveBeenCalled();
  });
});