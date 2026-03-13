"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import LoginForm from "./LoginForm";
import { AuthModalProps } from "@/types/auth.types";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white/40 transition-opacity duration-500 ease-in-out ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className={`fixed top-6 right-6 z-60 w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-gray-400 bg-[#303030] transition-all duration-500 cursor-pointer ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        aria-label="Close modal"
      >
        <IoClose size={32} />
      </button>

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-105 p-8 bg-chinese-black text-white-smoke rounded-lg shadow-2xl border border-white/10 transform transition-transform duration-500 ${
          animate ? "translate-y-0" : "-translate-y-[150vh]"
        }`}
      >
        <LoginForm />
      </div>
    </div>
  );
}
