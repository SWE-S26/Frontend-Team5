"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useResetPassword } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks"
import { clearAuth } from "@/store/slices/authSlice"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signOutEverywhere, setSignOutEverywhere] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const canSave = password.trim().length >= 8 && confirmPassword.trim().length >= 8;

  const { resetPassword, loading, error } = useResetPassword();

  const dispatch = useAppDispatch()

  const validatePassword = (value: string) => {
    const result = passwordSchema.safeParse(value)
    if (!result.success) {
      setPasswordError(result.error.issues[0].message)
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSave = async () => {
    const isPasswordValid = validatePassword(password)
    if (!isPasswordValid) return

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.")
      return
    }

    if (!token) {
      setConfirmPasswordError("Missing or invalid token!")
      return
    }

    setConfirmPasswordError("")

    const result = await resetPassword(token, password, signOutEverywhere)
    if (result?.message === "Password reset successfully") {
      setIsSuccess(true)
      dispatch(clearAuth()) // wipe Redux auth state
      setTimeout(() => router.push("/"), 2000)
    }
  }

  return (
    <main className="min-h-dvh bg-[#f2f2f2] text-[#333] flex flex-col">
      <header className="min-h-13 bg-chinese-black px-4 sm:px-0">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center">
          <div className="flex h-full w-full max-w-60 items-center bg-chinese-black px-2 sm:px-5">
            <Image
              src="/app-logo/beatza.png"
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

      <section className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-5 sm:py-7">
        <div className="w-full max-w-2xl border border-[#d7d7d7] bg-[#f5f5f5] px-5 pb-6 pt-8 shadow-[0_0_0_1px_rgba(255,255,255,0.3)_inset] sm:px-10 sm:pb-8 sm:pt-10">
          
          {isSuccess ? (
            // ── Success State ──
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-center text-2xl font-semibold text-[#2b2b2b]">
                Password changed!
              </h1>
              <p className="text-center text-[#9d9d9d]">
                Your password has been updated successfully. Redirecting you...
              </p>
            </div>
          ) : (
            // ── Form State ──
            <>
              <h1 className="text-center text-3xl font-semibold leading-tight text-[#2b2b2b] sm:text-4xl">
                Change your password
              </h1>
              <p className="mt-3 text-center text-lg text-[#9d9d9d] sm:mt-4 sm:text-[15px]">
                Choose a strong, unique password.
              </p>
              <p className="mt-1 text-center text-sm text-[#8d8d8d] sm:mt-1 sm:text-[13px]">
                For tips on choosing a secure password,{" "}
                <a href="#" className="text-[#2f73c9] underline hover:text-[#1f5ca9]">
                  visit our Help Center.
                </a>
              </p>

              <div className="mt-5 border-t border-[#e2e2e2] pt-5 sm:mt-4 sm:pt-5">
                {/* New Password */}
                <label className="block text-base font-medium text-[#2b2b2b] sm:text-[18px] sm:leading-tight">
                  Type your new password
                </label>
                <div className="relative mt-2">
                  <input
                    data-testid="reset-password-email-input"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) validatePassword(e.target.value)
                      if (confirmPasswordError) setConfirmPasswordError("")
                    }}
                    className={`h-11 w-full rounded-md border bg-[#e9e9e9] px-4 pr-10 text-base text-[#2b2b2b] outline-none sm:h-12 ${
                      passwordError ? "border-[#d91c5c] focus:border-[#d91c5c]" : "border-[#e6e6e6] focus:border-[#b8b8b8]"
                    }`}
                  />
                  {passwordError && (
                    <span className="pointer-events-none absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#d91c5c] text-xs font-bold text-white">
                      !
                    </span>
                  )}
                </div>
                {passwordError && (
                  <p className="mt-2 text-sm text-[#d02f2f]">{passwordError}</p>
                )}

                {/* Confirm Password */}
                <label className="mt-5 block text-base font-medium text-[#2b2b2b] sm:mt-5 sm:text-[18px] sm:leading-tight">
                  Type your new password again, to confirm
                </label>
                <div className="relative mt-2">
                  <input
                    data-testid="reset-password-password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (confirmPasswordError) setConfirmPasswordError("")
                    }}
                    className={`h-11 w-full rounded-md border bg-[#e9e9e9] px-4 pr-10 text-base text-[#2b2b2b] outline-none sm:h-12 ${
                      confirmPasswordError ? "border-[#d91c5c] focus:border-[#d91c5c]" : "border-[#e6e6e6] focus:border-[#b8b8b8]"
                    }`}
                  />
                  {confirmPasswordError && (
                    <span className="pointer-events-none absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#d91c5c] text-xs font-bold text-white">
                      !
                    </span>
                  )}
                </div>
                {confirmPasswordError && (
                  <p className="mt-2 text-sm text-[#d02f2f]">{confirmPasswordError}</p>
                )}

                {/* API error */}
                {error && (
                  <p className="mt-2 text-sm text-[#d02f2f]">{error}</p>
                )}

                {/* Sign out everywhere */}
                <label className="mt-5 flex cursor-pointer items-center gap-3 text-base text-[#2b2b2b] sm:mt-6 sm:text-[18px]">
                  <input
                    data-testid="sign-out-everywhere-input"
                    type="checkbox"
                    checked={signOutEverywhere}
                    onChange={(e) => setSignOutEverywhere(e.target.checked)}
                    className="h-4 w-4 accent-[#ff5a00] sm:h-5 sm:w-5"
                  />
                  Also sign me out everywhere
                </label>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave || loading}
                  className="mt-5 h-11 w-full rounded-md border border-[#d6d6d6] bg-[#e6e6e6] text-base font-medium text-[#c7c7c7] disabled:cursor-not-allowed enabled:cursor-pointer enabled:bg-[black] enabled:text-white sm:mt-6 sm:h-11 sm:text-base"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-7xl border-t border-[#e3e3e3] px-4 py-3 sm:py-4">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#636363] sm:text-base">
          <Link href="#" className="hover:underline">Legal</Link>
          <Link href="#" className="hover:underline">Privacy</Link>
          <Link href="#" className="hover:underline">Cookies</Link>
          <Link href="#" className="hover:underline">Imprint</Link>
        </nav>
      </footer>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#f2f2f2]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}