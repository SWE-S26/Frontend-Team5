"use client";

import { FcGoogle } from "react-icons/fc";
import { SiMinutemailer } from "react-icons/si";
import { DetailsValidationFormProps } from "@/types/auth.types";

export default function DetailsValidationForm({
  email,
  onBackToLogin,
  onSendAgain,
}: DetailsValidationFormProps) {
  return (
    <div data-testid="Details-Validation-Form" className="w-full text-white-smoke flex flex-col items-center text-center px-1 sm:px-0">
      <h1 className="mb-4 text-[24px] font-bold leading-tight sm:text-[28px]">
        Check your inbox!
      </h1>

      <p className="text-sm text-gray-300 mb-1">Click on the link we sent to</p>
      <p className="text-sm font-bold text-white-smoke mb-4">{email}</p>

      <p className="text-sm text-gray-400 mb-6">
        No email in your inbox or spam folder?{" "}
        <button data-testid="send-again-button"
          onClick={onSendAgain}
          className="text-[#699FFF] hover:underline cursor-pointer font-medium"
        >
          Send again
        </button>
      </p>

      {/* Paper plane illustration */}
      <div
        className="relative mb-8 flex h-40 w-40 items-center justify-center overflow-hidden sm:h-56 sm:w-56"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--fg) 15%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--fg) 15%, transparent) 1px, transparent 1px)",
          backgroundSize: "10% 10%",
        }}
      >
        <SiMinutemailer className="relative scale-x-[-1] text-[160px] text-white-smoke sm:text-[200px]" />
      </div>

      {/* Open Gmail button */}
      <a
        href="https://mail.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-12 bg-white-smoke text-chinese-black font-bold rounded flex items-center justify-center gap-3 mb-6 hover:opacity-90 transition-colors"
      >
        <FcGoogle size={20} />
        Open Gmail
      </a>

      <p className="text-sm text-gray-400">
        Wrong address?{" "}
        <button data-testid="back-to-login-button-validate"
          onClick={onBackToLogin}
          className="text-[#699FFF] hover:underline cursor-pointer font-medium"
        >
          Back to login
        </button>
      </p>
      <p className="text-sm text-gray-400 mt-1">
        If you still need help, visit our{" "}
        <span className="text-[#699FFF] hover:underline cursor-pointer font-medium">
          Help Center.
        </span>
      </p>
    </div>
  );
}
