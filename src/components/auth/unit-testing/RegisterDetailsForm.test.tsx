/**
 * RegisterDetailsForm — Component Tests
 *
 * Tests rendering, form validation, dropdowns, and onComplete callback.
 */

import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterDetailsForm from "@/components/auth/RegisterDetailsForm";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
beforeEach(() => {
  jest.clearAllMocks();
});

const mockOnBack     = jest.fn();
const mockOnComplete = jest.fn();

const defaultProps = {
  email: "test@test.com",
  onBack: mockOnBack,
  onComplete: mockOnComplete,
};

const renderForm = (props = {}) =>
  render(<RegisterDetailsForm {...defaultProps} {...props} />);

// Fill all required dropdowns to make the form valid
const fillDropdowns = async () => {
  fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "January" } });  // month
  fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "1" } });         // day
  fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "2000" } });      // year
  fireEvent.change(screen.getAllByRole("combobox")[3], { target: { value: "Male" } });      // gender
};

// ════════════════════════════════════════════════════════════════════════════
// 1. Initial Render
// ════════════════════════════════════════════════════════════════════════════
describe("Initial Render", () => {
  test("renders the form container", () => {
    renderForm();
    expect(screen.getByTestId("Register-Details-Form")).toBeTruthy();
  });

  test("renders back button", () => {
    renderForm();
    expect(screen.getByTestId("back-to-login-button-details")).toBeTruthy();
  });

  test("renders continue button", () => {
    renderForm();
    expect(screen.getByTestId("continue-button-details")).toBeTruthy();
  });

  test("renders display name input by default", () => {
    renderForm();
    expect(screen.getByTestId("DisplayName-input")).toBeTruthy();
  });

  test("renders month, day, year dropdowns", () => {
    renderForm();
    const selects = screen.getAllByRole("combobox");
    // month, day, year, gender = 4 selects when requireDisplayName=true
    expect(selects.length).toBe(4);
  });

  test("renders gender dropdown", () => {
    renderForm();
    expect(screen.getByText(/gender/i)).toBeTruthy();
  });

  test("continue button is disabled initially", () => {
    renderForm();
    const btn = screen.getByTestId("continue-button-details") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  test("renders 'Tell us more about you' heading", () => {
    renderForm();
    expect(screen.getByText(/tell us more about you/i)).toBeTruthy();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Display Name
// ════════════════════════════════════════════════════════════════════════════
describe("Display Name", () => {
  test("pre-fills display name from email prefix", () => {
    renderForm({ email: "john123@test.com" });
    const input = screen.getByTestId("DisplayName-input") as HTMLInputElement;
    expect(input.value).toBe("john123");
  });

  test("strips special characters from email prefix", () => {
    renderForm({ email: "john.doe+test@test.com" });
    const input = screen.getByTestId("DisplayName-input") as HTMLInputElement;
    expect(input.value).toBe("johndoetest");
  });

  test("user can change display name", async () => {
    renderForm();
    const input = screen.getByTestId("DisplayName-input");
    await userEvent.clear(input);
    await userEvent.type(input, "MyArtistName");
    expect((input as HTMLInputElement).value).toBe("MyArtistName");
  });

  test("does NOT render display name input when requireDisplayName=false", () => {
    renderForm({ requireDisplayName: false });
    expect(screen.queryByTestId("DisplayName-input")).toBeNull();
  });

  test("only 3 dropdowns when requireDisplayName=false (month, day, year, gender)", () => {
    renderForm({ requireDisplayName: false });
    // month, day, year, gender = still 4 selects, but no display name input
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBe(4);
    expect(screen.queryByTestId("DisplayName-input")).toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. Date of Birth Dropdowns
// ════════════════════════════════════════════════════════════════════════════
describe("Date of Birth Dropdowns", () => {
  test("month dropdown has 12 months", () => {
    renderForm();
    const monthSelect = screen.getAllByRole("combobox")[0];
    // 12 months + 1 disabled placeholder
    expect(monthSelect.querySelectorAll("option").length).toBe(13);
  });

  test("day dropdown has 31 days", () => {
    renderForm();
    const daySelect = screen.getAllByRole("combobox")[1];
    // 31 days + 1 disabled placeholder
    expect(daySelect.querySelectorAll("option").length).toBe(32);
  });

  test("year dropdown has 100 years", () => {
    renderForm();
    const yearSelect = screen.getAllByRole("combobox")[2];
    // 100 years + 1 disabled placeholder
    expect(yearSelect.querySelectorAll("option").length).toBe(101);
  });

  test("selecting a month updates the dropdown", () => {
    renderForm();
    const monthSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(monthSelect, { target: { value: "March" } });
    expect((monthSelect as HTMLSelectElement).value).toBe("March");
  });

  test("selecting a day updates the dropdown", () => {
    renderForm();
    const daySelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(daySelect, { target: { value: "15" } });
    expect((daySelect as HTMLSelectElement).value).toBe("15");
  });

  test("selecting a year updates the dropdown", () => {
    renderForm();
    const yearSelect = screen.getAllByRole("combobox")[2];
    fireEvent.change(yearSelect, { target: { value: "1995" } });
    expect((yearSelect as HTMLSelectElement).value).toBe("1995");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. Gender Dropdown
// ════════════════════════════════════════════════════════════════════════════
describe("Gender Dropdown", () => {
  test("has Male and Female options", () => {
    renderForm();
    const genderSelect = screen.getAllByRole("combobox")[3];
    const options = Array.from(genderSelect.querySelectorAll("option")).map(
      (o) => o.textContent
    );
    expect(options).toContain("Male");
    expect(options).toContain("Female");
  });

  test("selecting gender updates the dropdown", () => {
    renderForm();
    const genderSelect = screen.getAllByRole("combobox")[3];
    fireEvent.change(genderSelect, { target: { value: "Female" } });
    expect((genderSelect as HTMLSelectElement).value).toBe("Female");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. Form Validation — Continue Button
// ════════════════════════════════════════════════════════════════════════════
describe("Form Validation", () => {
  test("continue button is disabled when only month is filled", () => {
    renderForm();
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "January" } });
    const btn = screen.getByTestId("continue-button-details") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  test("continue button is disabled when display name is empty (requireDisplayName=true)", async () => {
    renderForm();
    const input = screen.getByTestId("DisplayName-input");
    await userEvent.clear(input);
    await fillDropdowns();
    const btn = screen.getByTestId("continue-button-details") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  test("continue button is enabled when all fields are filled", async () => {
    renderForm();
    await fillDropdowns();
    const btn = screen.getByTestId("continue-button-details") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  test("continue button is enabled without display name when requireDisplayName=false", async () => {
    renderForm({ requireDisplayName: false });
    // Only 3 dropdowns (month, day, year, gender) — no display name needed
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "January" } });
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "1" } });
    fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "2000" } });
    fireEvent.change(screen.getAllByRole("combobox")[3], { target: { value: "Male" } });
    const btn = screen.getByTestId("continue-button-details") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  test("clicking continue does nothing when form is invalid", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("continue-button-details"));
    expect(mockOnComplete).not.toHaveBeenCalled();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. onComplete Callback
// ════════════════════════════════════════════════════════════════════════════
describe("onComplete Callback", () => {
  test("calls onComplete with correct data when form is submitted", async () => {
    renderForm({ email: "john@test.com" });
    await fillDropdowns();
    await userEvent.click(screen.getByTestId("continue-button-details"));

    expect(mockOnComplete).toHaveBeenCalledWith({
      displayName: "john",
      dob: "2000-01-01",
      gender: "Male",
    });
  });

  test("calls onComplete with empty displayName when requireDisplayName=false", async () => {
    renderForm({ requireDisplayName: false, email: "john@test.com" });
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "June" } });
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "15" } });
    fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "1998" } });
    fireEvent.change(screen.getAllByRole("combobox")[3], { target: { value: "Female" } });
    await userEvent.click(screen.getByTestId("continue-button-details"));

    expect(mockOnComplete).toHaveBeenCalledWith({
      displayName: "",
      dob: "1998-06-15",
      gender: "Female",
    });
  });

  test("formats dob correctly as YYYY-MM-DD", async () => {
    renderForm();
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "March" } });   // month 3
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "5" } });        // day 5
    fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "1995" } });     // year
    fireEvent.change(screen.getAllByRole("combobox")[3], { target: { value: "Male" } });
    await userEvent.click(screen.getByTestId("continue-button-details"));

    const call = mockOnComplete.mock.calls[0][0] as any;
    expect(call.dob).toBe("1995-03-05");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 7. Submit Error
// ════════════════════════════════════════════════════════════════════════════
describe("Submit Error", () => {
  test("shows submit error message when submitError prop is passed", () => {
    renderForm({ submitError: "Could not create account. Please try again." });
    expect(screen.getByText(/could not create account/i)).toBeTruthy();
  });

  test("does NOT show error message when submitError is null", () => {
    renderForm({ submitError: null });
    expect(screen.queryByText(/could not create account/i)).toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 8. Submitting State
// ════════════════════════════════════════════════════════════════════════════
describe("Submitting State", () => {
  test("shows 'Continuing...' when isSubmitting=true", () => {
    renderForm({ isSubmitting: true });
    expect(screen.getByText("Continuing...")).toBeTruthy();
  });

  test("continue button is disabled when isSubmitting=true", () => {
    renderForm({ isSubmitting: true });
    const btn = screen.getByTestId("continue-button-details") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  test("shows 'Continue' when isSubmitting=false", () => {
    renderForm({ isSubmitting: false });
    expect(screen.getByText("Continue")).toBeTruthy();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 9. Back Button
// ════════════════════════════════════════════════════════════════════════════
describe("Back Button", () => {
  test("calls onBack when back button is clicked", async () => {
    renderForm();
    await userEvent.click(screen.getByTestId("back-to-login-button-details"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});