"use client";

import { useState } from "react";
import { IoChevronBack, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (val: string) => void;
}

export default function ForgotPasswordForm({
  email,
  setEmail,
}: ForgotPasswordFormProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  const isEmailEmpty = !email.trim();

  const isEmailActive = isInteracting || email.length > 0;

  const handleBack = () => {
    setIsInteracting(false);
  };
  return (
    <div className="w-full text-white transition-all duration-300">
        {/* Back Button */}
        {(isInteracting) && (
          <button
            onClick={handleBack}
            className="mb-4 -ml-2 p-2 bg-[#303030] rounded-full transition-colors cursor-pointer hover:bg-[#404040]"
          >
            <IoChevronBack size={26} />
          </button>
        )}
    </div>
  );
}