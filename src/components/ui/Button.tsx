import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, className = "", type = "button", icon, disabled }, ref) => {
    return (
      <button
        type={type}
        onClick={onClick}
        ref={ref}
        disabled={disabled}
        className={`
          group/scbutton 
          text-sm font-bold rounded-sm py-1.5 px-3 cursor-pointer
          ${className}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}
        `}
      >
        <span className="flex items-center transition">
          {icon && <span className={`${children ? "mr-2" : ""}`}>{icon}</span>}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
