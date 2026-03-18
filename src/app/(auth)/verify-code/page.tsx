"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGoogleVerifyCode } from "@/hooks/useAuth";

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingToken = searchParams.get("pendingToken") || "";
  const email = searchParams.get("email") || "your email";

  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const { verifyGoogleCode, loading, error } = useGoogleVerifyCode();

  const isCodeValid = code.trim().length === 6;
  const isDisabled = loading || !isCodeValid || !pendingToken;

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
    <main className="min-h-dvh bg-[#f2f2f2] text-[#333] flex flex-col">
      <header className="h-13 bg-chinese-black">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center">
          <div className="flex h-full w-60 items-center bg-chinese-black px-5">
            <Image
              src="/beatza.png"
              alt="BeatZa logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
              priority
            />
            <span className="ml-3 text-sm font-semibold tracking-[0.14em] text-white uppercase">
              BeatZa
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl border border-[#d7d7d7] bg-[#f5f5f5] px-5 pb-6 pt-8 shadow-[0_0_0_1px_rgba(255,255,255,0.3)_inset] sm:px-10 sm:pb-8 sm:pt-10">
          <h1 className="text-center text-3xl font-semibold leading-tight text-[#2b2b2b] sm:text-4xl">
            Enter verification code
          </h1>

          <p className="mt-4 text-center text-[15px] text-[#7d7d7d]">
            We sent a 6-digit code to {email}. Enter it below to continue.
          </p>

          <div className="mt-8">
            <label
              htmlFor="verification-code"
              className="block text-base font-medium text-[#2b2b2b] sm:text-[18px]"
            >
              Verification code
            </label>

            <input
              id="verification-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ""));
                if (localError) {
                  setLocalError(null);
                }
              }}
              className="mt-2 h-12 w-full rounded-md border border-[#d7d7d7] bg-[#ececec] px-4 text-center text-xl tracking-[0.35em] text-[#2b2b2b] outline-none focus:border-[#b8b8b8]"
              placeholder="000000"
            />

            {(localError || error) && (
              <p className="mt-2 text-sm text-[#d02f2f]">{localError || error}</p>
            )}

            <button
              type="button"
              onClick={handleVerify}
              disabled={isDisabled}
              className="mt-6 h-11 w-full rounded-md border border-[#d6d6d6] bg-[#e6e6e6] text-base font-medium text-[#c7c7c7] disabled:cursor-not-allowed enabled:cursor-pointer enabled:bg-black enabled:text-white"
            >
              {loading ? "Verifying..." : "Verify code"}
            </button>
          </div>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-7xl border-t border-[#e3e3e3] px-4 py-3 sm:py-4">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#636363] sm:text-base">
          <Link href="#" className="hover:underline">
            Legal
          </Link>
          <Link href="#" className="hover:underline">
            Privacy
          </Link>
          <Link href="#" className="hover:underline">
            Cookies
          </Link>
          <Link href="#" className="hover:underline">
            Imprint
          </Link>
        </nav>
      </footer>
    </main>
  );
}
