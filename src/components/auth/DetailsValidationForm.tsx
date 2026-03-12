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
    <div className="w-full text-white flex flex-col items-center text-center">
      <h1 className="text-[28px] font-bold leading-tight mb-4">
        Check your inbox!
      </h1>

      <p className="text-sm text-gray-300 mb-1">Click on the link we sent to</p>
      <p className="text-sm font-bold text-white mb-4">{email}</p>

      <p className="text-sm text-gray-400 mb-6">
        No email in your inbox or spam folder?{" "}
        <button
          onClick={onSendAgain}
          className="text-[#699FFF] hover:underline cursor-pointer font-medium"
        >
          Send again
        </button>
      </p>

      {/* Paper plane illustration */}
      <div
        className="mb-8 w-56 h-56 flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "10% 10%",
        }}
      >
        <SiMinutemailer size={200} className="relative scale-x-[-1]" />
      </div>

      {/* Open Gmail button */}
      <a
        href="https://mail.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-12 bg-white text-[#111111] font-bold rounded flex items-center justify-center gap-3 mb-6 hover:bg-gray-100 transition-colors"
      >
        <FcGoogle size={20} />
        Open Gmail
      </a>

      <p className="text-sm text-gray-400">
        Wrong address?{" "}
        <button
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
