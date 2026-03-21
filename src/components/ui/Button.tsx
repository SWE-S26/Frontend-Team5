import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center text-sm font-bold rounded-sm bg-off-black py-1.5 px-3 mr-4 hover:text-silver transition ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}

      {children}
    </button>
  );
};

export default Button;
