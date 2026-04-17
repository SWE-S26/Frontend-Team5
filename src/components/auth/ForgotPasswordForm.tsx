"use client";

import { z } from "zod";
import { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { ForgotPasswordFormProps } from "@/types/auth.types";
import { useForgetPassword } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const emailSchema = z.string().email("Please enter a valid email address")

export default function ForgotPasswordForm({
  email,
  setEmail,
  onBack,
  onSuccess,
}: ForgotPasswordFormProps) {
  const isEmailActive = email.length > 0;
  const { forgetPassword, loading, error } = useForgetPassword();

  const [emailError, setEmailError] = useState("")
  const router = useRouter()
  

  const handleSendLink = async () => {
    const result = emailSchema.safeParse(email)
    if (!result.success) {
      setEmailError(result.error.issues[0].message)
      return
    }
    setEmailError("")
    const res = await forgetPassword(email);
    if (res) onSuccess?.();
  };

  return (
    <div data-testid="Forget-Password-Form" className="w-full text-white-smoke animate-in fade-in duration-300">
      <div className="mb-6 flex items-center gap-2 sm:mb-8">
        <button
          data-testid="back-to-login-forgot"
          onClick={onBack}
          className="shrink-0 rounded-full bg-back p-2 transition-colors cursor-pointer"
        >
          <IoChevronBack size={26} />
        </button>
        <h1 className="text-[18px] font-semibold leading-tight sm:text-[20px] pl-16">
          Reset password
        </h1>
      </div>

      <div className="space-y-6">
        <div className="relative bg-chinese-black border border-white/10 rounded p-3 h-16 sm:h-18 flex flex-col justify-center">
          <label className={`absolute left-3 transition-all duration-200 text-gray-400 font-bold tracking-wider pointer-events-none ${isEmailActive ? "text-[10px] top-2" : "text-[14px] top-1/2 -translate-y-1/2"}`}>
            Your email address
          </label>
          <input
            data-testid="forget-password-email-input"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError("") }}
            className={`w-full bg-transparent border-none outline-none text-white-smoke text-base ${isEmailActive ? "pt-4" : "pt-0"}`}
          />
        </div>

        {emailError && <p className="text-red-500 text-xs">{emailError}</p>}

        <p className="text-[14px] text-white-smoke leading-relaxed">
          If the email address is in our database, we will send you an email to
          reset your password. Need help?
          <span onClick={() => router.push("/need-help")} className="text-[#044DD2] cursor-pointer ml-1">
            visit our Help Center.
          </span>
        </p>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          data-testid="send-link-button"
          disabled={!email.trim() || loading}
          onClick={handleSendLink}
          className={`w-full h-12 font-bold rounded transition-all duration-200 ${!email.trim() || loading ? "bg-white-smoke/60 text-chinese-black" : "bg-white-smoke text-chinese-black cursor-pointer"}`}
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </div>
    </div>
  );
}