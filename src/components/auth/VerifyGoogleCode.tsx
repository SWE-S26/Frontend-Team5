"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { useGoogleVerifyCode, useResendVerificationCode } from "@/hooks/useAuth";

function VerifyGoogleCodeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingToken = searchParams.get("pendingToken") || "";
  const email = searchParams.get("email") || "your email";

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [localError, setLocalError] = useState<string | null>(null);
  const [resendInfo, setResendInfo] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { verifyGoogleCode, loading, error } = useGoogleVerifyCode();
  const { resendVerificationCode, loading: resendLoading } = useResendVerificationCode();

  const code = digits.join("");
  const isCodeValid = code.trim().length === 6;
  const isDisabled = loading || !isCodeValid || !pendingToken;
  const isResendDisabled = resendLoading || resendCooldown > 0;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    const nextDigit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = nextDigit;
    setDigits(nextDigits);

    if (localError) {
      setLocalError(null);
    }

    if (nextDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    if (pasted.length === 0) {
      return;
    }

    const nextDigits = Array(6)
      .fill("")
      .map((_, idx) => pasted[idx] || "");
    setDigits(nextDigits);

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    if (!pendingToken) {
      setLocalError("Missing verification token. Please start sign-in again.");
      return;
    }

    if (!isCodeValid) {
      setLocalError("Please enter the 6-digit code.");
      return;
    }

    setLocalError(null);
    const res = await verifyGoogleCode(pendingToken, code.trim());

    if (res) {
      router.push("/home");
    }
  };

  const handleResend = async () => {
    if (!pendingToken) {
      setLocalError("Missing verification token. Please start sign-in again.");
      return;
    }

    setLocalError(null);
    setResendInfo(null);
    const res = await resendVerificationCode(pendingToken);

    if (res) {
      setResendCooldown(60);
      setResendInfo("Verification code resent. The original 5-minute expiry window is unchanged.");
    }
  };

  return (
    <main data-testid="Verify-Google-Code" className="min-h-dvh bg-chinese-black px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-105 items-center justify-center">
        <section className="w-full rounded-md border border-white/30 bg-chinese-black px-6 py-8 text-white-smoke shadow-[0_18px_60px_rgba(0,0,0,0.45)] sm:px-7 sm:py-9">
          <h1 className="text-center text-[48px] font-bold tracking-[-0.03em] text-[#e7e7e7] leading-none sm:text-[32px]">
            Welcome back!
          </h1>

          <p className="mx-auto mt-8 max-w-110 text-center text-[14px] leading-tight text-[#f0f0f0] sm:text-[14px]">
            We found an account for <span className="font-semibold">{email}</span>. Enter the code sent to your email to link your Google login and continue.
          </p>

          <div className="mt-8 flex items-center justify-between gap-2.5 sm:gap-2">
            {digits.map((digit, index) => (
              <input
                data-testid="Verify-Code-input"
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(event) => handleDigitChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-16 w-13 rounded-md border border-transparent bg-[#303030] text-center text-[28px] font-semibold text-[#f4f4f4] outline-none transition focus:border-[#dedede] focus:bg-[#2f3135]"
                aria-label={`Verification digit ${index + 1}`}
              />
            ))}
          </div>

          <div className="mt-5 min-h-6">
            {(localError || error) && (
              <p className="text-center text-[14px] text-[#ff7f9b]">{localError || error}</p>
            )}
            {!localError && !error && resendInfo && (
              <p className="text-center text-[14px] text-[#9ed7a6]">{resendInfo}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={isDisabled}
            className="mt-7 block h-12 w-full rounded-md bg-white-smoke px-6 text-[20px] font-semibold text-chinese-black disabled:cursor-not-allowed disabled:opacity-70 enabled:cursor-pointer enabled:hover:bg-[#f2f2f2]"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResendDisabled}
            className="mt-3 block h-12 w-full rounded-md bg-[#2f3135] px-6 text-[20px] font-semibold text-white-smoke disabled:cursor-not-allowed disabled:opacity-70 enabled:cursor-pointer enabled:hover:bg-[#36383d]"
          >
            {resendLoading ? "Resending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
          </button>

          <p className="mt-5 text-left text-[14px] text-[#a9aaad]">
            Not you?{" "}
            <button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="font-semibold text-[#5e98ff] hover:text-[#7aacff] cursor-pointer"
            >
              Back to login
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}

export default function VerifyGoogleCode() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyGoogleCodeInner />
    </Suspense>
  );
}