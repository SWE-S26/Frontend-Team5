"use client";

import { useState, useEffect, useRef } from "react";
import { Select } from "antd";
import ThemeSwitcher from "@/components/settings/theme/ThemeSwitcher";
import Button from "@/components/ui/Button";
import DeleteAccountModal from "@/components/settings/DeleteAccountModal";
import InfoPopover from "@/components/settings/InfoPopover";
import { useForgotPasswordLoggedIn } from "@/hooks/useAuth";
import { useAccountSettings } from "@/hooks/useSettings";
import { Gender, Theme } from "@/types/settings.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

const MONTH_OPTIONS = MONTHS.map((m) => ({ value: m, label: m }));

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseDateOfBirth = (dob: string) => {
  const date = new Date(dob);
  return {
    month: MONTHS[date.getUTCMonth()],
    day: String(date.getUTCDate()),
    year: String(date.getUTCFullYear()),
  };
};

const buildDateOfBirth = (month: string, day: string, year: string): string => {
  const monthIndex = MONTHS.indexOf(month) + 1;
  return `${year}-${String(monthIndex).padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Settings() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { settings, loading, saveStatus, updateSettings } = useAccountSettings();

  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthDay, setBirthDay] = useState<string>("");
  const [birthYear, setBirthYear] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const birthMonthRef = useRef(birthMonth);
  const birthDayRef = useRef(birthDay);
  const birthYearRef = useRef(birthYear);

  useEffect(() => {
    birthMonthRef.current = birthMonth;
  }, [birthMonth]);
  useEffect(() => {
    birthDayRef.current = birthDay;
  }, [birthDay]);
  useEffect(() => {
    birthYearRef.current = birthYear;
  }, [birthYear]);

  // Hydrate date/gender — also keep localStorage in sync for ThemeProvider
  useEffect(() => {
    if (!settings) return;

    localStorage.setItem("theme", settings.theme.toLowerCase());

    const { month, day, year } = parseDateOfBirth(settings.dateOfBirth);
    setBirthMonth(month);
    setBirthDay(day);
    setBirthYear(year);
    setGender(settings.gender);
  }, [settings]);

  const { forgotPasswordLoggedIn, loading: pwLoading, error } = useForgotPasswordLoggedIn();

  const handleResetPassword = async () => {
    const res = await forgotPasswordLoggedIn();
    if (res) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const handleDateChange = (month: string, day: string, year: string) => {
    if (!month || !day || !year) return;
    updateSettings({ dateOfBirth: buildDateOfBirth(month, day, year) });
  };

  const handleMonthChange = (val: string) => {
    setBirthMonth(val);
    handleDateChange(val, birthDayRef.current, birthYearRef.current);
  };

  const handleDayChange = (val: string) => {
    setBirthDay(val);
    handleDateChange(birthMonthRef.current, val, birthYearRef.current);
  };

  const handleYearChange = (val: string) => {
    setBirthYear(val);
    handleDateChange(birthMonthRef.current, birthDayRef.current, val);
  };

  const handleGenderChange = (val: string) => {
    setGender(val);
    updateSettings({ gender: val as Gender });
  };

  return (
    <div className="bg-chinese-black w-full max-w-3xl">
      <ThemeSwitcher
        saveStatus={saveStatus}
        onThemeChange={(val) =>
          updateSettings({ theme: (val.charAt(0).toUpperCase() + val.slice(1)) as Theme })
        }
      />

      {/* Password */}
      <div className="my-5 font-bold">
        <h1 className="mb-3">Password</h1>
        {showSuccess && (
          <p className="text-silver text-xs mb-2">
            We've sent you an email with a link to reset your password.
          </p>
        )}
        {error && <p className="text-anger text-xs mb-2">{error}</p>}
        <Button
          className="px-3 py-2 bg-off-black text-white-smoke text-xs cursor-pointer hover:text-silver"
          onClick={handleResetPassword}
          disabled={pwLoading}
        >
          {pwLoading ? "Sending..." : "Send password-reset link"}
        </Button>
      </div>

      {/* Basic information */}
      <div className="mb-8 font-bold">
        <h1 className="mb-5">Basic information</h1>

        {loading ? (
          <p className="text-white-smoke/40 text-sm">Loading...</p>
        ) : (
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-16">
            {/* Birth date */}
            <div className="w-full sm:w-auto">
              <label className="text-sm text-white-smoke flex items-center gap-1.5 mb-2">
                Birth date
                <InfoPopover text="The date of birth you provided at sign-up" className="w-78" />
              </label>
              <div className="flex items-center gap-2">
                <Select
                  value={birthMonth || undefined}
                  onChange={handleMonthChange}
                  options={MONTH_OPTIONS}
                  placeholder="January"
                  style={{ width: 120 }}
                  className="notif-select"
                  classNames={{ popup: { root: "notif-dropdown-popup" } }}
                />
                <Select
                  value={birthDay || undefined}
                  onChange={handleDayChange}
                  options={DAYS}
                  placeholder="1"
                  style={{ width: 68 }}
                  className="notif-select"
                  classNames={{ popup: { root: "notif-dropdown-popup" } }}
                />
                <Select
                  value={birthYear || undefined}
                  onChange={handleYearChange}
                  options={YEARS}
                  placeholder="1988"
                  style={{ width: 88 }}
                  className="notif-select"
                  classNames={{ popup: { root: "notif-dropdown-popup" } }}
                />
              </div>
            </div>

            {/* Gender */}
            <div className="w-full sm:w-auto">
              <label className="text-sm text-white-smoke flex items-center gap-1 mb-2">
                Gender
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <Select
                value={gender || undefined}
                onChange={handleGenderChange}
                options={GENDER_OPTIONS}
                placeholder="Indicate gender"
                style={{ width: 170 }}
                className="notif-select"
                classNames={{ popup: { root: "notif-dropdown-popup" } }}
              />
            </div>
          </div>
        )}
      </div>

      <Button
        className="text-red-500 text-sm cursor-pointer"
        onClick={() => setDeleteModalOpen(true)}
      >
        Delete Account
      </Button>
      <DeleteAccountModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} />
    </div>
  );
}
