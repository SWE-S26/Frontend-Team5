"use client";

import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoChevronBack, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { LoginFormProps } from "@/modules/auth/types/auth.types";

const mockUsers = ["karimhegab698@gmail.com", "test@test.com"];

export default function LoginForm({
  email,
  setEmail,
  onSwitchToRegister,
}: LoginFormProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [showPasswordStep, setShowPasswordStep] = useState(false);
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const isEmailActive = isInteracting || email.length > 0;
  const isPasswordActive = password.length > 0;

  const handleContinue = () => {
    if (!showPasswordStep) {
      const exists = mockUsers.includes(email.trim().toLowerCase());
      setUserExists(exists);
      setShowPasswordStep(true);
    } else {
      console.log("Submit logic here");
    }
  };

  const handleBack = () => {
    setShowPasswordStep(false);
    setIsInteracting(false);
    setPassword("");
  };

  const handleForgotBack = () => {
    setShowForgotForm(false);
    setShowPasswordStep(false);
    setIsInteracting(false);
    setPassword("");
  };

  if (showForgotForm) {
    return (
      <ForgotPasswordForm
        email={email}
        setEmail={setEmail}
        onBack={handleForgotBack}
      />
    );
  }

  return (
    <div className="w-full text-white transition-all duration-300">
      {(isInteracting || showPasswordStep) && (
        <button
          onClick={handleBack}
          className="mb-4 -ml-2 p-2 bg-[#303030] rounded-full transition-colors cursor-pointer"
        >
          <IoChevronBack size={26} />
        </button>
      )}

      <h1 className="text-[28px] font-bold leading-tight mb-4 text-left">
        {showPasswordStep
          ? userExists
            ? "Welcome back!"
            : "Create an account"
          : "Sign in or create an account"}
      </h1>

      {!showPasswordStep && !isInteracting && (
        <div className="animate-in fade-in duration-500">
          <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
            By clicking on any of the "Continue" buttons below, you agree to
            BeatZa's
            <span className="text-[#699FFF] cursor-pointer ml-1">
              {" "}
              Terms of Use
            </span>{" "}
            and
            <span className="text-[#699FFF] cursor-pointer ml-1">
              {" "}
              Privacy Policy
            </span>
            .
          </p>
          <div className="space-y-2 mb-8">
            <button className="w-full h-11 cursor-pointer bg-[#003bb3] rounded flex items-center justify-center gap-3 font-semibold text-sm">
              <FaFacebook size={20} /> Continue with Facebook
            </button>
            <button className="w-full h-11 cursor-pointer bg-[#333333] rounded flex items-center justify-center gap-3 font-semibold text-sm">
              <FcGoogle size={20} /> Continue with Google
            </button>
          </div>
          <div className="relative mb-6 flex justify-start">
            <span className="bg-[#111111] text-sm font-bold text-white">
              Or with email
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div
          className={`relative transition-all duration-300 rounded p-3 h-16 flex flex-col justify-center ${showPasswordStep ? "bg-transparent border-none" : "bg-[#222222] border border-white/10"}`}
        >
          <label
            className={`absolute left-3 transition-all duration-200 text-gray-400 font-bold tracking-wider pointer-events-none ${isEmailActive ? "text-[10px] top-2" : "text-[12px] top-1/2 -translate-y-1/2"}`}
          >
            Your email address or profile URL
          </label>
          <input
            type="email"
            value={email}
            disabled={showPasswordStep}
            onFocus={() => setIsInteracting(true)}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-transparent border-none outline-none text-white text-base ${isEmailActive ? "pt-4" : "pt-0"} ${showPasswordStep ? "opacity-80" : ""}`}
          />
        </div>

        {showPasswordStep && (
          <div className="relative bg-[#222222] border border-white/30 rounded p-3 h-16 flex flex-col justify-center animate-in slide-in-from-top-2">
            <label
              className={`absolute left-3 transition-all duration-200 text-gray-400 font-bold tracking-wider pointer-events-none ${isPasswordActive ? "text-[10px] top-2" : "text-[12px] top-1/2 -translate-y-1/2"}`}
            >
              {userExists
                ? "Your Password (min. 6 characters)"
                : "Choose a password (min. 8 characters)"}
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className={`w-full bg-transparent border-none outline-none text-white text-base ${isPasswordActive ? "pt-4" : "pt-0"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={showPasswordStep ? !password.trim() : !email.trim()}
          className={`w-full h-12 font-bold rounded transition-all duration-200 ${!email.trim() || (showPasswordStep && !password.trim()) ? "bg-white/60 text-chinese-black" : "bg-white text-chinese-black cursor-pointer "}`}
        >
          Continue
        </button>
      </div>

      {showPasswordStep && userExists && (
        <button
          onClick={() => setShowForgotForm(true)}
          className="mt-6 text-sm cursor-pointer text-[#699FFF] hover:underline block text-left font-medium"
        >
          Forgot your password?
        </button>
      )}

      {!showPasswordStep && (
        <button className="mt-6 text-sm cursor-pointer text-[#699FFF] hover:underline font-medium">
          Need help?
        </button>
      )}
    </div>
  );
}
