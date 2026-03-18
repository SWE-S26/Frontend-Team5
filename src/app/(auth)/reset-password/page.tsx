"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useResetPassword } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signOutEverywhere, setSignOutEverywhere] = useState(true);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const router = useRouter();

  const params = useSearchParams();
  const token = params.get("token");

  const canSave =
    password.trim().length >= 8 && confirmPassword.trim().length >= 8;

  const { resetPassword, loading, error, success } = useResetPassword();

  const handleSave = async () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Please repeat your password.");
      return;
    }

    if (!token) {
      setConfirmPasswordError("Missing or Invalid token!");
      return;
    }

    setConfirmPasswordError("");

    const result = await resetPassword(token, password);

    if (result?.success) {
      router.push("/home");
    }
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <main className="h-dvh overflow-hidden bg-[#f2f2f2] text-[#333] flex flex-col">
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

      <section className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-3">
        <div className="w-full max-w-2xl border border-[#d7d7d7] bg-[#f5f5f5] px-5 pb-6 pt-8 shadow-[0_0_0_1px_rgba(255,255,255,0.3)_inset] sm:px-10 sm:pb-8 sm:pt-10">
          <h1 className="text-center text-3xl font-semibold leading-tight text-[#2b2b2b] sm:text-4xl">
            Change your password
          </h1>

          <p className="mt-3 text-center text-lg text-[#9d9d9d] sm:mt-4 sm:text-[15px]">
            Choose a strong, unique password.
          </p>

          <p className="mt-1 text-center text-sm text-[#8d8d8d] sm:mt-1 sm:text-[13px]">
            For tips on choosing a secure password,{" "}
            <a
              href="#"
              className="text-[#2f73c9] underline hover:text-[#1f5ca9]"
            >
              visit our Help Center.
            </a>
          </p>

          <div className="mt-5 border-t border-[#e2e2e2] pt-5 sm:mt-4 sm:pt-5">
            <label className="block text-base font-medium text-[#2b2b2b] sm:text-[18px] sm:leading-tight">
              Type your new password
            </label>
            <div className="relative mt-2">
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (confirmPasswordError) {
                    setConfirmPasswordError("");
                  }
                }}
                className={`h-11 w-full rounded-md border bg-[#e9e9e9] px-4 pr-10 text-base text-[#2b2b2b] outline-none sm:h-12 sm:px-4 sm:pr-10 sm:text-base ${
                  confirmPasswordError
                    ? "border-[#d91c5c] focus:border-[#d91c5c]"
                    : "border-[#e6e6e6] focus:border-[#b8b8b8]"
                }`}
              />
              {confirmPasswordError ? (
                <span className="pointer-events-none absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#d91c5c] text-xs font-bold text-white">
                  !
                </span>
              ) : null}
            </div>

            <label className="mt-5 block text-base font-medium text-[#2b2b2b] sm:mt-5 sm:text-[18px] sm:leading-tight">
              Type your new password again, to confirm
            </label>
            <div className="relative mt-2">
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (confirmPasswordError) {
                    setConfirmPasswordError("");
                  }
                }}
                className={`h-11 w-full rounded-md border bg-[#e9e9e9] px-4 pr-10 text-base text-[#2b2b2b] outline-none sm:h-12 sm:px-4 sm:pr-10 sm:text-base ${
                  confirmPasswordError
                    ? "border-[#d91c5c] focus:border-[#d91c5c]"
                    : "border-[#e6e6e6] focus:border-[#b8b8b8]"
                }`}
              />
              {confirmPasswordError ? (
                <span className="pointer-events-none absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#d91c5c] text-xs font-bold text-white">
                  !
                </span>
              ) : null}
            </div>
            {confirmPasswordError ? (
              <p className="mt-2 text-sm text-[#d02f2f]">
                {confirmPasswordError}
              </p>
            ) : null}

            <label className="mt-5 flex cursor-pointer items-center gap-3 text-base text-[#2b2b2b] sm:mt-6 sm:text-[18px]">
              <input
                type="checkbox"
                checked={signOutEverywhere}
                onChange={(event) => setSignOutEverywhere(event.target.checked)}
                className="h-4 w-4 accent-[#ff5a00] sm:h-5 sm:w-5"
              />
              Also sign me out everywhere
            </label>

            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="mt-5 h-11 w-full rounded-md border border-[#d6d6d6] bg-[#e6e6e6] text-base font-medium text-[#c7c7c7] disabled:cursor-not-allowed enabled:cursor-pointer enabled:bg-[black] enabled:text-white sm:mt-6 sm:h-11 sm:text-base"
            >
              Save
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
