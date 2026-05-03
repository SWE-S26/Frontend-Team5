"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import LoginForm from "./LoginForm";
import { AuthModalProps } from "@/types/auth.types";

export default function AuthModal({ isOpen, onClose, redirectTo }: AuthModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 20);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4 sm:p-0 bg-login transition-opacity duration-500 ease-in-out ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Close Button */}
      <button
        data-testid="close-button"
        onClick={onClose}
        className={`fixed top-6 right-6 z-60 w-10 h-10 rounded-full flex items-center justify-center text-white-smoke hover:text-gray-400 bg-chinese-black transition-all duration-500 cursor-pointer ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        aria-label="Close modal"
      >
        <IoClose size={32} />
      </button>

      {/* Modal Content */}
      <div
        className={`relative mt-6 sm:mt-0 w-full max-w-110 max-h-[95vh] overflow-y-auto pb-10 p-6 sm:p-8 bg-chinese-black text-white-smoke shadow-2xl border rounded border-white/10 transform transition-transform duration-500 ${
          animate ? "translate-y-0" : "-translate-y-[150vh]"
        }`}
      >
        <LoginForm onAuthSuccess={onClose} redirectTo={redirectTo} />
      </div>
    </div>
  );
}
