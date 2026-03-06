"use client";

import { useState } from "react";
import { IoChevronBack, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function RegisterForm({ email, onSwitchToLogin }: { email: string, onSwitchToLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full text-white">
      <button onClick={onSwitchToLogin} className="mb-6 p-2 -ml-2 rounded-full hover:bg-white/10 transition">
        <IoChevronBack size={24} />
      </button>

      <h1 className="text-[26px] font-bold mb-8">Create an account</h1>

      <div className="mb-6">
        <label className="block text-xs text-gray-400 mb-1">Your email address</label>
        <p className="text-lg font-medium">{email || "No email provided"}</p>
      </div>

      <div className="relative bg-transparent border border-white/30 rounded focus-within:border-white transition-colors mb-8">
        <input 
          type={showPassword ? "text" : "password"} 
          placeholder="Choose a password (min. 8 characters)"
          className="w-full bg-transparent p-4 pr-12 outline-none text-white placeholder:text-gray-500"
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
        </button>
      </div>

      <button className={`w-full h-12 font-bold rounded transition-colors ${
        email ? "bg-white text-black hover:bg-gray-200" : "bg-gray-600 text-gray-400 cursor-not-allowed"
      }`}>
        Continue
      </button>

      <button className="mt-8 text-sm text-blue-500 hover:underline">Need help?</button>
    </div>
  );
}