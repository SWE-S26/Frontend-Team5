/**
 * DetailsValidationForm — Component Tests
 */

/// <reference types="jest" />

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DetailsValidationForm from "@/components/auth/DetailsValidationForm";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
beforeEach(() => {
  jest.clearAllMocks();
});

const mockOnBackToLogin = jest.fn();
const mockOnSendAgain   = jest.fn();

const defaultProps = {
  email: "test@test.com",
  onBackToLogin: mockOnBackToLogin,
  onSendAgain: mockOnSendAgain,
};

const renderForm = (props = {}) =>
  render(<DetailsValidationForm {...defaultProps} {...props} />);

// ════════════════════════════════════════════════════════════════════════════
// 1. Initial Render
// ════════════════════════════════════════════════════════════════════════════
describe("Initial Render", () => {
  test("renders the form container", () => {
    renderForm();
    expect(screen.getByTestId("Details-Validation-Form")).toBeTruthy();
  });

  test("renders 'Check your inbox!' heading", () => {
    renderForm();
    expect(screen.getByText(/check your inbox/i)).toBeTruthy();
  });

  test("renders the send again button", () => {
    renderForm();
    expect(screen.getByTestId("send-again-button")).toBeTruthy();
  });

  test("renders the back to login button", () => {
    renderForm();
    expect(screen.getByTestId("back-to-login-button-validate")).toBeTruthy();
  });

  test("renders Open Gmail link", () => {
    renderForm();
    expect(screen.getByText(/open gmail/i)).toBeTruthy();
  });

  test("Open Gmail link points to mail.google.com", () => {
    renderForm();
    const link = screen.getByText(/open gmail/i).closest("a") as HTMLAnchorElement;
    expect(link.href).toBe("https://mail.google.com/");
  });

  test("Open Gmail link opens in a new tab", () => {
    renderForm();
    const link = screen.getByText(/open gmail/i).closest("a") as HTMLAnchorElement;
    expect(link.target).toBe("_blank");
  });

  test("Open Gmail link has noopener noreferrer rel", () => {
    renderForm();
    const link = screen.getByText(/open gmail/i).closest("a") as HTMLAnchorElement;
    expect(link.rel).toContain("noopener");
    expect(link.rel).toContain("noreferrer");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Email Display
// ════════════════════════════════════════════════════════════════════════════
describe("Email Display", () => {
  test("displays the provided email address", () => {
    renderForm({ email: "test@test.com" });
    expect(screen.getByText("test@test.com")).toBeTruthy();
  });

  test("displays a different email address correctly", () => {
    renderForm({ email: "omar@beatza.com" });
    expect(screen.getByText("omar@beatza.com")).toBeTruthy();
  });

  test("renders helper text above email", () => {
    renderForm();
    expect(screen.getByText(/click on the link we sent to/i)).toBeTruthy();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Send Again Button
// ════════════════════════════════════════════════════════════════════════════
describe("Send Again Button", () => {
  test("calls onSendAgain when clicked", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("send-again-button"));
    expect(mockOnSendAgain).toHaveBeenCalledTimes(1);
  });

  test("does NOT call onBackToLogin when send again is clicked", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("send-again-button"));
    expect(mockOnBackToLogin).not.toHaveBeenCalled();
  });

  test("can be clicked multiple times", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("send-again-button"));
    await userEvent.click(screen.getByTestId("send-again-button"));
    await userEvent.click(screen.getByTestId("send-again-button"));
    expect(mockOnSendAgain).toHaveBeenCalledTimes(3);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Back to Login Button
// ════════════════════════════════════════════════════════════════════════════
describe("Back to Login Button", () => {
  test("calls onBackToLogin when clicked", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("back-to-login-button-validate"));
    expect(mockOnBackToLogin).toHaveBeenCalledTimes(1);
  });

  test("does NOT call onSendAgain when back to login is clicked", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("back-to-login-button-validate"));
    expect(mockOnSendAgain).not.toHaveBeenCalled();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Help Text
// ════════════════════════════════════════════════════════════════════════════
describe("Help Text", () => {
  test("renders 'No email in your inbox or spam folder?' text", () => {
    renderForm();
    expect(screen.getByText(/no email in your inbox or spam folder/i)).toBeTruthy();
  });

  test("renders 'Wrong address?' text", () => {
    renderForm();
    expect(screen.getByText(/wrong address/i)).toBeTruthy();
  });

  test("renders Help Center text", () => {
    renderForm();
    expect(screen.getByText(/help center/i)).toBeTruthy();
  });
});