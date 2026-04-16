"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, Suspense } from "react";
import { useGoogleVerifyCode } from "@/hooks/useAuth";

function VerifyGoogleCodeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingToken = searchParams.get("pendingToken") || "";
  const email = searchParams.get("email") || "your email";

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { verifyGoogleCode, loading, error } = useGoogleVerifyCode();

  const code = digits.join("");
  const isCodeValid = code.trim().length === 6;
  const isDisabled = loading || !isCodeValid || !pendingToken;

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

  return (
    <main data-testid="Verify-Google-Code" className="relative min-h-dvh bg-chinese-black">
      <div className="mx-auto flex min-h-dvh w-full items-center justify-center px-4 py-8 sm:px-6">
        <section className="w-full max-w-md rounded-sm border border-white/10 bg-chinese-black px-5 py-8 text-white-smoke shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:px-8 sm:py-10">
          <h1 className="text-center text-lg font-bold leading-snug tracking-tight sm:text-xl">
            <span className="block">An account exists</span>
            <span className="block">with this email address!</span>
          </h1>

          <p className="mx-auto mt-4 text-center text-sm leading-snug text-white-smoke/90">
            We can connect your Google credentials to this account so you can use
            it to log in next time.
          </p>

          <p className="mx-auto mt-4 text-center text-sm leading-snug text-white-smoke/95">
            To continue, enter the code we have sent to this email as verification.
          </p>

          <p className="mt-5 text-center text-base font-semibold leading-tight text-white-smoke">
            {email}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
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
                className="h-14 w-10 rounded-md border border-[#d7d7d7] bg-[#e9e9e9] text-center text-xl font-semibold text-[#101010] outline-none transition focus:border-white focus:shadow-[0_0_0_2px_rgba(255,255,255,0.15)] sm:h-16 sm:w-11 sm:text-2xl"
                aria-label={`Verification digit ${index + 1}`}
              />
            ))}
          </div>

          {(localError || error) && (
            <p className="mx-auto mt-3 text-center text-sm text-red-400">
              {localError || error}
            </p>
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={isDisabled}
            className="mx-auto mt-6 block h-10 w-full max-w-xs rounded-md bg-white-smoke px-6 text-base font-semibold text-chinese-black disabled:cursor-not-allowed disabled:opacity-70 enabled:cursor-pointer enabled:hover:bg-[#ededed]"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>

          <button
            type="button"
            onClick={() => setLocalError(null)}
            className="mx-auto mt-3 block text-center text-sm text-[#4285f4] hover:text-[#6ea3ff] cursor-pointer"
          >
            Send again
          </button>

          <p className="mx-auto mt-5 text-center text-sm leading-snug text-white-smoke/90">
            Otherwise, you can go back and choose another authentication method.
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