"use client";

import { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { RegisterDetailsFormProps } from "@/types/auth.types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const GENDERS = ["Man", "Woman", "Max Verstappen", "Prefer not to say"];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

export default function RegisterDetailsForm({
  email,
  onBack,
  onComplete,
}: RegisterDetailsFormProps) {
  const [displayName, setDisplayName] = useState(
    email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") || ""
  );
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [isNameActive, setIsNameActive] = useState(displayName.length > 0);

  const isValid =
    displayName.trim().length > 0 &&
    month !== "" &&
    day !== "" &&
    year !== "" &&
    gender !== "";

  const handleContinue = () => {
    if (!isValid) return;
    const dob = `${year}-${String(MONTHS.indexOf(month) + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onComplete({ displayName: displayName.trim(), dob, gender });
  };

  return (
    <div className="w-full text-white-smoke transition-all duration-300">
      <button
        onClick={onBack}
        className="mb-4 -ml-2 p-2 bg-[#303030] rounded-full transition-colors cursor-pointer"
      >
        <IoChevronBack size={26} />
      </button>

      <h1 className="text-[28px] font-bold leading-tight mb-6 text-left">
        Tell us more about you
      </h1>

      <div className="space-y-4">
        {/* Display Name */}
        <div>
          <div className="relative bg-chinese-black border border-white/10 rounded p-3 h-16 flex flex-col justify-center">
            <label
              className={`absolute left-3 transition-all duration-200 text-gray-400 font-bold tracking-wider pointer-events-none ${
                isNameActive || displayName.length > 0
                  ? "text-[10px] top-2"
                  : "text-[12px] top-1/2 -translate-y-1/2"
              }`}
            >
              Display name
            </label>
            <input
              type="text"
              value={displayName}
              onFocus={() => setIsNameActive(true)}
              onBlur={() => setIsNameActive(displayName.length > 0)}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`w-full bg-transparent border-none outline-none text-white-smoke text-base ${
                isNameActive || displayName.length > 0 ? "pt-4" : "pt-0"
              }`}
            />
          </div>
          <p className="text-[12px] text-gray-400 mt-1.5 leading-relaxed">
            Your display name can be anything you like. Your name or artist name are good choices.
          </p>
        </div>

        {/* Date of Birth */}
        <div>
          <p className="text-sm font-bold text-white-smoke mb-2">Date of birth (required)</p>
          <div className="grid grid-cols-3 gap-2">
            {/* Month */}
            <div className="relative bg-chinese-black border border-white/10 rounded px-3 h-12 flex items-center">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-transparent text-sm outline-none appearance-none cursor-pointer text-white-smoke"
              >
                <option value="" disabled className="bg-chinese-black text-white-smoke">Month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m} className="bg-chinese-black text-white-smoke">{m}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Day */}
            <div className="relative bg-chinese-black border border-white/10 rounded px-3 h-12 flex items-center">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full bg-transparent text-sm outline-none appearance-none cursor-pointer text-white-smoke"
              >
                <option value="" disabled className="bg-chinese-black text-white-smoke">Day</option>
                {DAYS.map((d) => (
                  <option key={d} value={d} className="bg-chinese-black text-white-smoke">{d}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Year */}
            <div className="relative bg-chinese-black border border-white/10 rounded px-3 h-12 flex items-center">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-transparent text-sm outline-none appearance-none cursor-pointer text-white-smoke"
              >
                <option value="" disabled className="bg-chinese-black text-white-smoke">Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y} className="bg-chinese-black text-white-smoke">{y}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-[12px] text-gray-400 mt-1.5 leading-relaxed">
            Your date of birth is used to verify your age and is not shared publicly.
          </p>
        </div>

        {/* Gender */}
        <div className="relative bg-chinese-black border border-white/10 rounded px-3 h-12 flex items-center">
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-transparent text-sm outline-none appearance-none cursor-pointer text-white-smoke"
          >
            <option value="" disabled className="bg-chinese-black text-white-smoke">Gender (required)</option>
            {GENDERS.map((g) => (
              <option key={g} value={g} className="bg-chinese-black text-white-smoke">{g}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`w-full h-12 font-bold rounded transition-all duration-200 ${
            isValid
              ? "bg-white-smoke text-chinese-black cursor-pointer"
              : "bg-white-smoke/60 text-chinese-black cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}