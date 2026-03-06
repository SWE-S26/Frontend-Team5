"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import LoginForm from "./LoginForm";
import { AuthModalProps } from "@/types/auth.types";


export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay ensures the browser registers the "off-screen" position first
      const timer = setTimeout(() => setAnimate(true), 20);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      // Wait for transition duration (500ms for a smoother slide) before unmounting
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
      {/* Close Button - Fades in separately */}
      <button
        onClick={onClose}
        className={`fixed top-6 right-6 z-60 w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-gray-400 bg-[#303030] transition-all duration-500 cursor-pointer ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        aria-label="Close modal"
      >
        <IoClose size={32} />
      </button>

      {/* Modal Content - Sliding from Top to Down */}
      <div
        className={`relative w-full max-w-105 p-8 bg-[#111111] rounded-lg shadow-2xl border border-white/10 transform transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
          animate ? "translate-y-0" : "-translate-y-[150vh]"
        }`}
      >
        <LoginForm
          email={email}
          setEmail={setEmail}
          onSwitchToRegister={() => {}}
        />
      </div>
    </div>
  );
}
