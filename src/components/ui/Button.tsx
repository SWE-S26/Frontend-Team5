
import React from "react";

interface ButtonProps {
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  type?: "button" | "submit" | "reset"; 
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-black text-white px-3 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;