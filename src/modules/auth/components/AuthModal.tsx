"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isOpen) setView("login");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 p-4">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[60]
           w-10 h-10 rounded-full
           flex items-center justify-center
           text-white hover:text-gray-400
           bg-[#303030]
           transition-all duration-200 cursor-pointer"        aria-label="Close modal"
      >
        <IoClose size={32} />
      </button>

      <div className="relative w-full max-w-[420px] p-8 bg-[#111111] rounded-lg shadow-2xl border border-white/10">
        {view === "login" ? (
          <LoginForm 
            email={email} 
            setEmail={setEmail} 
            onSwitchToRegister={() => setView("register")} 
          />
        ) : (
          <RegisterForm 
            email={email} 
            onSwitchToLogin={() => setView("login")} 
          />
        )}
      </div>
    </div>
  );
}