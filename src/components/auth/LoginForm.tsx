"use client";

import { useState, useCallback } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoChevronBack, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ForgotPasswordForm from "./ForgotPasswordForm";
import RegisterDetailsForm from "./RegisterDetailsForm";
import DetailsValidationForm from "./DetailsValidationForm";

type Step = "email" | "password" | "forgot" | "register-details" | "validation";

const mockUsers = ["karimhegab698@gmail.com", "test@test.com"];

export default function LoginForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const isEmailActive = isEmailFocused || email.length > 0;
  const isPasswordActive = password.length > 0;

  const handleContinueFromEmail = useCallback(() => {
    const exists = mockUsers.includes(email.trim().toLowerCase());
    setUserExists(exists);
    setStep("password");
  }, [email]);

  const handleContinueFromPassword = useCallback(() => {
    if (userExists) {
      console.log("Login:", { email, password });
    } else {
      setStep("register-details");
    }
  }, [userExists, email, password]);

  const handleBackToEmail = useCallback(() => {
    setStep("email");
    setIsEmailFocused(false);
    setPassword("");
  }, []);

  const handleBackToLogin = useCallback(() => {
    setStep("email");
    setIsEmailFocused(false);
    setPassword("");
    setEmail("");
  }, []);

  if (step === "validation") {
    return (
      <DetailsValidationForm
        email={email}
        onBackToLogin={handleBackToLogin}
        onSendAgain={() => console.log("Resend email to", email)}
      />
    );
  }

  if (step === "register-details") {
    return (
      <RegisterDetailsForm
        email={email}
        onBack={() => setStep("password")}
        onComplete={(details) => {
          console.log("Registration complete:", { email, password, ...details });
          setStep("validation");
        }}
      />
    );
  }

  if (step === "forgot") {
    return (
      <ForgotPasswordForm
        email={email}
        setEmail={setEmail}
        onBack={handleBackToEmail}
      />
    );
  }

  const isPasswordStep = step === "password";

  return (
    <div className="w-full text-white-smoke transition-all duration-300">
      {(isEmailFocused || isPasswordStep) && (
        <button
          onClick={handleBackToEmail}
          className="mb-4 -ml-2 p-2 bg-[#303030] rounded-full transition-colors cursor-pointer"
        >
          <IoChevronBack size={26} />
        </button>
      )}

      <h1 className="text-[28px] font-bold leading-tight mb-4 text-left">
        {isPasswordStep
          ? userExists
            ? "Welcome back!"
            : "Create an account"
          : "Sign in or create an account"}
      </h1>

      {!isPasswordStep && !isEmailFocused && (
        <div className="animate-in fade-in duration-500">
          <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
            By clicking on any of the "Continue" buttons below, you agree to
            BeatZa's
            <span className="text-[#699FFF] cursor-pointer ml-1">Terms of Use</span>{" "}
            and
            <span className="text-[#699FFF] cursor-pointer ml-1">Privacy Policy</span>.
          </p>
          <div className="space-y-2 mb-8">
            <button className="w-full h-11 cursor-pointer bg-[#003bb3] rounded flex items-center justify-center gap-3 font-semibold text-sm">
              <FaFacebook size={20} /> Continue with Facebook
            </button>
            <button className="w-full h-11 cursor-pointer bg-chinese-black rounded flex items-center justify-center gap-3 font-semibold text-sm">
              <FcGoogle size={20} /> Continue with Google
            </button>
          </div>
          <div className="relative mb-6 flex justify-start">
            <span className="bg-chinese-black text-sm font-bold text-white-smoke">Or with email</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div
          className={`relative transition-all duration-300 rounded p-3 h-16 flex flex-col justify-center ${
            isPasswordStep ? "bg-transparent border-none" : "bg-chinese-black border border-white/10"
          }`}
        >
          <label
            className={`absolute left-3 transition-all duration-200 text-gray-400 font-bold tracking-wider pointer-events-none ${
              isEmailActive ? "text-[10px] top-2" : "text-[12px] top-1/2 -translate-y-1/2"
            }`}
          >
            Your email address or profile URL
          </label>
          <input
            type="email"
            value={email}
            disabled={isPasswordStep}
            onFocus={() => setIsEmailFocused(true)}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-transparent border-none outline-none text-white-smoke text-base ${
              isEmailActive ? "pt-4" : "pt-0"
            } ${isPasswordStep ? "opacity-80" : ""}`}
          />
        </div>

        {isPasswordStep && (
          <div className="relative bg-chinese-black border border-white/30 rounded p-3 h-16 flex flex-col justify-center animate-in slide-in-from-top-2">
            <label
              className={`absolute left-3 transition-all duration-200 text-gray-400 font-bold tracking-wider pointer-events-none ${
                isPasswordActive ? "text-[10px] top-2" : "text-[12px] top-1/2 -translate-y-1/2"
              }`}
            >
              {userExists ? "Your Password (min. 6 characters)" : "Choose a password (min. 8 characters)"}
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className={`w-full bg-transparent border-none outline-none text-white-smoke text-base ${
                  isPasswordActive ? "pt-4" : "pt-0"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={isPasswordStep ? handleContinueFromPassword : handleContinueFromEmail}
          disabled={isPasswordStep ? !password.trim() : !email.trim()}
          className={`w-full h-12 font-bold rounded transition-all duration-200 ${
            !email.trim() || (isPasswordStep && !password.trim())
              ? "bg-white-smoke/60 text-chinese-black"
              : "bg-white-smoke text-chinese-black cursor-pointer"
          }`}
        >
          Continue
        </button>
      </div>

      {isPasswordStep && userExists && (
        <button
          onClick={() => setStep("forgot")}
          className="mt-6 text-sm cursor-pointer text-[#699FFF] hover:underline block text-left font-medium"
        >
          Forgot your password?
        </button>
      )}

      {!isPasswordStep && (
        <button className="mt-6 text-sm cursor-pointer text-[#699FFF] hover:underline font-medium">
          Need help?
        </button>
      )}
    </div>
  );
}
