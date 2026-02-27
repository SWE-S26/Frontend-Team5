"use client";

import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoChevronBack, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ email, setEmail, onSwitchToRegister }: LoginFormProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPasswordStep, setShowPasswordStep] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isEmailEmpty = !email.trim();
  const isPasswordEmpty = !password.trim();
  
  // Logic for shifting labels
  const isEmailActive = isFocused || email.length > 0;
  const isPasswordActive = isPasswordFocused || password.length > 0;

  const handleBack = () => {
    setShowPasswordStep(false);
    setIsFocused(false);
    setIsPasswordFocused(false);
    setPassword("");
  };

  return (
    <div className="w-full text-white">
      {(isFocused || showPasswordStep) && (
        <button 
          onClick={handleBack}
          className="mb-4 -ml-2 p-2 bg-[#303030] rounded-full transition-colors cursor-pointer hover:bg-[#404040]"
        >
          <IoChevronBack size={26} />
        </button>
      )}

      <h1 className="text-[28px] font-bold leading-tight mb-4 text-left font-sans">
        {showPasswordStep ? "Sign in" : "Sign in or create an account"}
      </h1>
      
      {!isFocused && !showPasswordStep && (
        <>
          <p className="text-[13px] text-gray-400 mb-6 leading-relaxed font-sans">
            By clicking on any of the "Continue" buttons below, you agree to BeatZa's 
            <span className="text-[#699FFF] cursor-pointer ml-1 font-sans">Terms of Use</span> and 
            <span className="text-[#699FFF] cursor-pointer ml-1 font-sans"> Privacy Policy</span>.
          </p>

          <div className="space-y-2 mb-8">
            <button className="w-full h-11 cursor-pointer bg-[#003bb3] rounded flex items-center justify-center gap-3 font-sans font-semibold text-sm">
              <FaFacebook size={20} /> Continue with Facebook
            </button>
            <button className="w-full h-11 cursor-pointer bg-[#333333] rounded flex items-center justify-center gap-3 font-sans font-semibold text-sm">
              <FcGoogle size={20} /> Continue with Google
            </button>
          </div>

          <div className="relative mb-6 flex justify-start">
            <span className="bg-[#111111] font-sans text-sm font-bold text-white">Or with email</span>
          </div>
        </>
      )}

      <div className="space-y-4">
        {/* Email Box */}
        <div className={`relative transition-all duration-300 rounded p-3 h-[64px] flex flex-col justify-center ${
          showPasswordStep 
            ? "bg-transparent border-none" 
            : "bg-[#222222] border border-white/10 focus-within:border-white/40"
        }`}>  
          <label className={`absolute left-3 transition-all duration-200 font-sans text-gray-400 font-bold tracking-wider pointer-events-none ${
            isEmailActive ? "text-[10px] top-2 translate-y-0" : "text-base top-1/2 -translate-y-1/2"
          }`}>
            Your email address or profile URL
          </label>
          <input 
            type="email" 
            value={email}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setEmail(e.target.value)}
            disabled={showPasswordStep}
            className={`w-full font-sans bg-transparent border-none outline-none text-white text-base focus:ring-0 ${
              isEmailActive ? "pt-4" : "pt-0"
            } ${showPasswordStep ? "opacity-80" : "opacity-100"}`}
          />
        </div>

        {/* Password Box */}
        {showPasswordStep && (
          <div className="relative bg-[#222222] border border-white/30 rounded p-3 focus-within:border-white transition-colors h-[64px] flex flex-col justify-center animate-in fade-in slide-in-from-top-2">
            <label className={`absolute left-3 transition-all duration-200 font-sans text-gray-400 font-bold tracking-wider pointer-events-none ${
              isPasswordActive ? "text-[10px] top-2 translate-y-0" : "text-base top-1/2 -translate-y-1/2"
            }`}>
              Your Password (min. 6 characters)
            </label>
            <div className="flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full font-sans bg-transparent border-none outline-none text-white text-base focus:ring-0 ${
                  isPasswordActive ? "pt-4" : "pt-0"
                }`}
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
          </div>
        )}

        <button 
          disabled={showPasswordStep ? isPasswordEmpty : isEmailEmpty}
          onClick={() => !showPasswordStep ? setShowPasswordStep(true) : console.log("Login Action")}
          className={`w-full h-12 font-bold rounded transition-all duration-200 font-sans ${
            (showPasswordStep ? isPasswordEmpty : isEmailEmpty)
              ? "bg-white/60 text-[#121212] cursor-not-allowed" 
              : "bg-white text-[#121212] cursor-pointer hover:bg-gray-200"
          }`}
        >
          Continue
        </button>
      </div>

      {!showPasswordStep && (
        <button className="mt-6 text-sm cursor-pointer text-blue-500 hover:text-blue-400 font-medium font-sans">
          Need help?
        </button>
      )}
    </div>
  );
}