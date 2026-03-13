"use client";

import { IoChevronBack } from "react-icons/io5";
import { ForgotPasswordFormProps } from "@/types/auth.types";

export default function ForgotPasswordForm({
  email,
  setEmail,
  onBack,
}: ForgotPasswordFormProps) {
  const isEmailActive = email.length > 0;

  return (
    <div className="w-full text-white-smoke animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="mb-4 -ml-2 p-2 bg-[#303030] rounded-full transition-colors cursor-pointer"
      >
        <IoChevronBack size={26} />
      </button>

      <h1 className="text-[28px] font-bold leading-tight mb-8 text-center">
        Reset password
      </h1>

      <div className="space-y-6">
        <div className="relative bg-chinese-black border border-white/10 rounded p-3 h-18 flex flex-col justify-center">
          <label
            className={`absolute left-3 transition-all duration-200 text-gray-400 font-bold tracking-wider pointer-events-none ${isEmailActive ? "text-[10px] top-2" : "text-[14px] top-1/2 -translate-y-1/2"}`}
          >
            Your email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-transparent border-none outline-none text-white-smoke text-base ${isEmailActive ? "pt-4" : "pt-0"}`}
          />
        </div>

        <p className="text-[14px] text-gray-300 leading-relaxed">
          If the email address is in our database, we will send you an email to
          reset your password. Need help?
          <span className="text-[#699FFF] cursor-pointer ml-1">
            visit our Help Center.
          </span>
        </p>

        <button
          disabled={!email.trim()}
          className={`w-full h-12 font-bold rounded transition-all duration-200 ${!email.trim() ? "bg-white-smoke/60 text-chinese-black" : "bg-white-smoke text-chinese-black cursor-pointer "}`}
        >
          Send reset link
        </button>
      </div>
    </div>
  );
}
