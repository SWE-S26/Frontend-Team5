"use client";

import { useState, useCallback, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

import { FcGoogle } from "react-icons/fc";
import { IoChevronBack, IoEyeOutline, IoEyeOffOutline, IoQrCode } from "react-icons/io5";

import ForgotPasswordForm from "./ForgotPasswordForm";
import RegisterDetailsForm from "./RegisterDetailsForm";
import DetailsValidationForm from "./DetailsValidationForm";
import { z } from "zod"

import {
  useFindEmail,
  useForgetPassword,
  useGoogleComplete,
  useGoogleVerifyCode,
  useLogin,
  useSignup,
  useResendVerificationEmail
} from "@/hooks/useAuth";

type Step =
  | "email"
  | "password"
  | "forgot"
  | "register-details"
  | "validation"
  | "google-complete"
  | "google-verify";

export default function LoginForm({
  onAuthSuccess,
}: {
  onAuthSuccess?: () => void;
} = {}) {
  const [step, setStep] = useState<Step>("email");
  const [validationSource, setValidationSource] = useState<"signup" | "reset-password">("signup");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Controls UI layout (back button, compact header, hide social buttons) — sticky, never resets on blur
  const [isEmailEverFocused, setIsEmailEverFocused] = useState(false);
  // Controls only the label float position — resets on blur
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const emailSchema = z.string().email("Please enter a valid email address")
  const [emailError, setEmailError] = useState("")

  const [userExists, setUserExists] = useState(false);
  const [passwordError, setPasswordError] = useState("")

  // ref to hold latest step so handleSubmit never captures a stale closure value
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // mobile browsers to fire blur/re-render cycles that stale-close handleSubmit
  const passwordRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (step === "password") {
      const timer = setTimeout(() => passwordRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

  const validatePassword = (value: string) => {
    const result = passwordSchema.safeParse(value)
    if (!result.success) {
      setPasswordError(result.error.issues[0].message)
      return false
    }
    setPasswordError("")
    return true
  }

  const [googleIncompleteToken, setGoogleIncompleteToken] = useState("");
  const [googlePendingToken, setGooglePendingToken] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleDisplayName, setGoogleDisplayName] = useState("");
  const [googleCode, setGoogleCode] = useState("");
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isNavigating, startTransition] = useTransition();

  const isEmailActive = isEmailFocused || email.length > 0;
  const isPasswordActive = isPasswordFocused || password.length > 0;

  const { findEmail, loading: emailLoading } = useFindEmail();
  const { forgetPassword } = useForgetPassword();
  const { login, loading: loginLoading, error: loginError } = useLogin();
  const { signup, loading: signupLoading } = useSignup();
  const {
    completeGoogleSignup,
    loading: googleCompleteLoading,
    error: googleCompleteError,
  } = useGoogleComplete();
  const {
    verifyGoogleCode,
    loading: googleVerifyLoading,
    error: googleVerifyError,
  } = useGoogleVerifyCode();
  const { resendVerificationEmail, loading: resendLoading, success: resendSuccess } = useResendVerificationEmail();
  const [isUnverified, setIsUnverified] = useState(false)
  const router = useRouter();

  //refs for loading states so handleSubmit always reads fresh values
  const emailLoadingRef = useRef(emailLoading);
  const loginLoadingRef = useRef(loginLoading);
  useEffect(() => { emailLoadingRef.current = emailLoading; }, [emailLoading]);
  useEffect(() => { loginLoadingRef.current = loginLoading; }, [loginLoading]);

  const navigateToPostAuth = useCallback((result?: any) => {
    let target = "/home";

    if (typeof window !== "undefined") {
      const urlClient = new URLSearchParams(window.location.search).get("client")?.toLowerCase();

      if (urlClient === "android") {
        window.localStorage.setItem("beatza:auth-client", "Android");
        const payload = result?.data ?? result ?? {};
        const accessToken = payload.accessToken ?? payload.authToken ?? payload.token;
        const refreshToken = payload.refreshToken ?? payload.refresh_token;

        const params = new URLSearchParams();
        if (accessToken) params.set("accessToken", String(accessToken));
        if (refreshToken) params.set("refreshToken", String(refreshToken));

        const suffix = params.toString();
        target = suffix ? `/cross-callback?${suffix}` : "/cross-callback";
      }
    }

    startTransition(() => {
      router.replace(target);
    });
  }, [router, startTransition]);

  const handleGoogleSignIn = useCallback(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const urlClient =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("client")
        : null;
    const isAndroidClient = urlClient?.toLowerCase() === "android";

    const googleUrl = new URL(
      "/api/auth/v1/google",
      baseUrl || window.location.origin,
    );

    if (isAndroidClient) {
      window.localStorage.setItem("beatza:auth-client", "Android");
      googleUrl.searchParams.set("client", "Android");
    } else if (typeof window !== "undefined") {
      window.localStorage.removeItem("beatza:auth-client");
    }

    window.location.href = googleUrl.toString();
  }, []);

  const handleContinueFromEmail = useCallback(async () => {
    setLoginSuccess(false);
    
    const result = emailSchema.safeParse(email)
    if (!result.success) {
      setEmailError(result.error.issues[0].message)
      return
    }
    setEmailError("")

    const res = await findEmail(email)
    if (!res) return
    setUserExists(res.data.exists)
    setStep("password")
  }, [email, findEmail]);

  const handleContinueFromPassword = useCallback(async () => {
    if (userExists) {
      setIsUnverified(false)
      const res = await login(email, password);
      if (res?.message === "Authenticated successfully") {
        onAuthSuccess?.();
        setLoginSuccess(true);
        navigateToPostAuth(res);
        return
      }
    } else {
      if (!validatePassword(password)) return
      setRegisterError(null);
      setStep("register-details");
    }
  }, [userExists, email, password, login, onAuthSuccess, navigateToPostAuth]);

  const handleBackToEmail = useCallback(() => {
    setStep("email");
    setIsEmailEverFocused(false);
    setIsEmailFocused(false);
    setIsPasswordFocused(false);
    setLoginSuccess(false);
    setPassword("");
    setRegisterError(null);
    setGoogleCode("");
    setGoogleError(null);
  }, []);

  const handleBackToLogin = useCallback(() => {
    setStep("email");
    setIsEmailEverFocused(false);
    setIsEmailFocused(false);
    setIsPasswordFocused(false);
    setLoginSuccess(false);
    setPassword("");
    setRegisterError(null);
    setEmail("");
    setGoogleCode("");
    setGoogleError(null);
  }, []);

  const handleGoogleComplete = useCallback(
    async (details: { displayName: string; dob: string; gender: string }) => {
      if (!googleIncompleteToken) return;
      const res = await completeGoogleSignup(
        googleIncompleteToken,
        details.dob,
        details.gender,
      );
      if (res) {
        onAuthSuccess?.();
        setLoginSuccess(true);
        navigateToPostAuth(res);
      }
    },
    [completeGoogleSignup, googleIncompleteToken, onAuthSuccess, navigateToPostAuth],
  );

  const handleGoogleVerify = useCallback(async () => {
    if (!googlePendingToken || googleCode.trim().length !== 6) return;
    const res = await verifyGoogleCode(googlePendingToken, googleCode.trim());
    if (res) {
      onAuthSuccess?.();
      setLoginSuccess(true);
      navigateToPostAuth(res);
    }
  }, [googlePendingToken, googleCode, onAuthSuccess, verifyGoogleCode, navigateToPostAuth]);

  const handleQrSignIn = useCallback(() => {
    router.push("/qr-login");
  }, [router]);

  useEffect(() => {
    if (loginError?.toLowerCase().includes("not verified") ||
        loginError?.toLowerCase().includes("verify your email")) {
      setIsUnverified(true)
    } else {
      setIsUnverified(false)
    }
  }, [loginError])

  if (step === "validation") {
    return (
      <DetailsValidationForm
        email={email}
        onBackToLogin={handleBackToLogin}
        onSendAgain={() => {
          if (validationSource === "reset-password") {
            forgetPassword(email);
            return;
          }

          resendVerificationEmail(email);
        }}
      />
    );
  }

  if (step === "register-details") {
    return (
      <RegisterDetailsForm
        email={email}
        submitError={registerError}
        isSubmitting={signupLoading}
        onBack={() => setStep("password")}
        onComplete={async (details) => {
          setRegisterError(null);
          const res = await signup(
            email,
            password,
            details.displayName,
            details.dob,
            details.gender
          );

          if (res?.success === false) {
            const message = res?.message || "Could not create account. Please try again.";
            if (/already|exists|conflict|registered/i.test(message)) {
              setUserExists(true);
              setStep("password");
              return;
            }

            setRegisterError(message);
            return;
          }

          setValidationSource("signup");
          setStep("validation");
        }}
      />
    );
  }

  if (step === "google-complete") {
    return (
      <RegisterDetailsForm
        email={googleEmail || email}
        requireDisplayName={false}
        onBack={handleBackToEmail}
        onComplete={handleGoogleComplete}
      />
    );
  }

  if (step === "google-verify") {
    return (
      <div className="w-full text-white-smoke transition-all duration-300">
        <button
          data-testid="back-google-verify"
          onClick={handleBackToEmail}
          className="mb-4 -ml-2 p-2 bg-[#303030] rounded-full transition-colors cursor-pointer"
        >
          <IoChevronBack size={26} />
        </button>
        <h1 className="text-[28px] font-bold leading-tight mb-3 text-left">Verify your Google sign-in</h1>
        <p className="text-sm text-gray-400 mb-6">
          We sent a 6-digit code to {googleEmail || "your email"}. Enter it below to continue.
        </p>
        <div className="relative bg-chinese-black border border-white/10 rounded p-3 h-16 flex flex-col justify-center mb-4">
          <label className="absolute left-3 text-[10px] top-2 text-gray-400 font-bold tracking-wider pointer-events-none">
            Verification code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={googleCode}
            onChange={(e) => setGoogleCode(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-transparent border-none outline-none text-white-smoke text-base pt-4 tracking-[0.3em]"
          />
        </div>
        <button
          data-testid="verify-google-code"
          onClick={handleGoogleVerify}
          disabled={googleVerifyLoading || googleCode.trim().length !== 6}
          className={`w-full h-12 font-bold rounded transition-all duration-200 ${
            googleVerifyLoading || googleCode.trim().length !== 6
              ? "bg-white-smoke/60 text-chinese-black"
              : "bg-white-smoke text-chinese-black cursor-pointer"
          }`}
        >
          {googleVerifyLoading ? "Verifying..." : "Verify and continue"}
        </button>
        {(googleVerifyError || googleError) && (
          <p className="mt-3 text-sm text-red-400">{googleVerifyError || googleError}</p>
        )}
      </div>
    );
  }

  if (step === "forgot") {
    return (
      <ForgotPasswordForm
        email={email}
        setEmail={setEmail}
        onBack={handleBackToEmail}
        onSuccess={() => {
          setValidationSource("reset-password");
          setStep("validation");
        }}
      />
    );
  }

  const isPasswordStep = step === "password";
  const isBusy = (isPasswordStep ? loginLoading : emailLoading) || isNavigating;
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const currentStep = stepRef.current;
      const currentlyBusy =
        currentStep === "password"
          ? loginLoadingRef.current
          : emailLoadingRef.current;

      if (currentlyBusy) return;

      if (currentStep === "password") {
        await handleContinueFromPassword();
        return;
      }

      await handleContinueFromEmail();
    },
    [handleContinueFromEmail, handleContinueFromPassword],
  );

  return (
    <div data-testid="Login-Form" className="w-full text-white-smoke transition-all duration-300">
      <div className="relative flex items-center mb-6">
        {(isEmailEverFocused || isPasswordStep) && (
          <button
            data-testid="back-to-login-button-login"
            onClick={handleBackToEmail}
            className="p-2 -ml-2 bg-back rounded-full cursor-pointer z-10"
          >
            <IoChevronBack size={26} />
          </button>
        )}

        {!isEmailEverFocused && !isPasswordStep && (
          <h1 className="text-[28px] font-bold leading-tight">
            Sign in or create an account
          </h1>
        )}

        {isEmailEverFocused && !isPasswordStep && (
          <h1 className="absolute pl-20 p-12 text-[18px] font-semibold pointer-events-none">
            Sign in or create an account
          </h1>
        )}

        {isPasswordStep && (
          <h1 className="absolute pl-30 p-12 text-[18px] font-semibold pointer-events-none">
            {userExists ? "Welcome back!" : "Create an account"}
          </h1>
        )}
      </div>

      {!isPasswordStep && !isEmailEverFocused && (
        <div className="animate-in fade-in duration-500">
          <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
            By clicking on any of the "Continue" buttons below, you agree to
            BeatZa's
            <span className="text-[#699FFF] cursor-pointer ml-1">Terms of Use</span>{" "}
            and
            <span className="text-[#699FFF] cursor-pointer ml-1">Privacy Policy</span>.
          </p>
          <div className="space-y-2 mb-8">
            <button
              data-testid="signin-google"
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-11 cursor-pointer bg-white-smoke text-chinese-black rounded flex items-center justify-center gap-3 font-semibold text-sm"
            >
              <FcGoogle size={20} /> Continue with Google
            </button>

            <button
              data-testid="signin-qrCode"
              type="button"
              onClick={handleQrSignIn}
              className="w-full h-11 cursor-pointer bg-[#F97316] text-chinese-black rounded flex items-center justify-center gap-3 font-semibold text-sm"
            >
              <IoQrCode size={20} /> Continue with QrCode
            </button>
          </div>
          <div className="relative mb-6 flex justify-start">
            <span className="bg-chinese-black text-sm font-bold text-white-smoke">
              Or with email
            </span>
          </div>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div
          className={`relative transition-all duration-300 rounded p-3 h-16 flex flex-col justify-center ${
            isPasswordStep
              ? "bg-transparent border-none"
              : "bg-chinese-black border border-white/10"
          }`}
        >
          <label
            className={`absolute left-3 transition-all duration-200 text-gray-400 font-bold tracking-wider pointer-events-none ${
              isEmailActive
                ? "text-[10px] top-2"
                : "text-[12px] top-1/2 -translate-y-1/2"
            }`}
          >
            Your email address or profile URL
          </label>
          <input
            data-testid="email-input"
            type="email"
            value={email}
            disabled={isPasswordStep}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            onFocus={() => {
              setIsEmailFocused(true);
              setIsEmailEverFocused(true);
            }}
            onBlur={() => setIsEmailFocused(false)}
            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError("") }}
            className={`w-full bg-transparent p-2 border-none outline-none text-white-smoke text-base ${
              isEmailActive ? "pt-4" : "pt-0"
            } ${isPasswordStep ? "opacity-80" : ""}`}
          />
        </div>

        {!isPasswordStep && emailError && (
          <p className="text-red-500 text-xs">{emailError}</p>
        )}

        {isPasswordStep && (
          <div className="relative bg-chinese-black border border-white/30 rounded p-3 h-16 flex flex-col justify-center animate-in slide-in-from-top-2">
            <label
              className={`absolute left-3 transition-all duration-200 text-gray-400 font-bold tracking-wider pointer-events-none ${
                isPasswordActive
                  ? "text-[10px] top-2"
                  : "text-[12px] top-1/2 -translate-y-1/2"
              }`}
            >
              {userExists
                ? "Your Password (min. 6 characters)"
                : "Choose a password (min. 8 characters)"}
            </label>
            <div className="flex items-center">
              <input
                data-testid="password-input"
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                value={password}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (!userExists && passwordError) validatePassword(e.target.value)
                }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className={`w-full bg-transparent border-none outline-none text-white-smoke text-base ${
                  isPasswordActive ? "pt-4" : "pt-0"
                }`}
              />
              <button
                data-testid="show-password-button"
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
          </div>
        )}

        {isPasswordStep && !userExists && passwordError && (
          <p className="text-red-500 text-xs">{passwordError}</p>
        )}

        <button
          data-testid="continue-button-login"
          type="submit"
          disabled={
            isBusy ||
            (isPasswordStep ? !password.trim() : !email.trim())
          }
          className={`w-full h-12 font-bold rounded transition-all duration-200 ${
            isBusy || !email.trim() || (isPasswordStep && !password.trim())
              ? "bg-white-smoke/60 text-chinese-black"
              : "bg-white-smoke text-chinese-black cursor-pointer"
          }`}
        >
          {isBusy ? "Please wait..." : "Continue"}
        </button>
      </form>

      {loginSuccess && isPasswordStep && (
        <p className="mt-3 text-sm text-green-400">
          {isNavigating ? "Signed in successfully. Loading your home page..." : "Signed in successfully."}
        </p>
      )}

      {loginError && isPasswordStep && !loginSuccess && (
        <div className="mt-3">
          <p className="text-sm text-red-400">{loginError}</p>
          {isUnverified && (
            <button
              onClick={() => resendVerificationEmail(email)}
              disabled={resendLoading}
              className="mt-2 text-sm text-[#699FFF] hover:underline cursor-pointer font-medium"
            >
              {resendLoading ? "Sending..." : "Send a Verification Email"}
            </button>
          )}
          {resendSuccess && (
            <p className="mt-2 text-sm text-green-400">Verification email sent! Check your inbox.</p>
          )}
        </div>
      )}

      {(googleCompleteError || googleError) && (
        <p className="mt-3 text-sm text-red-400">{googleCompleteError || googleError}</p>
      )}

      {isPasswordStep && userExists && (
        <button
          data-testid="forgot-password-button"
          onClick={() => setStep("forgot")}
          className="mt-6 text-sm cursor-pointer text-[#699FFF] hover:underline block text-left font-medium"
        >
          Forgot your password?
        </button>
      )}

      {!isPasswordStep && (
        <button data-testid="need-help-button" className="mt-6 text-sm cursor-pointer text-[#699FFF] hover:underline font-medium">
          Need help?
        </button>
      )}
    </div>
  );
}