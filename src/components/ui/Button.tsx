import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
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
      className={` group/scbutton text-sm font-bold rounded-sm py-1.5 px-3 cursor-pointer ${className}`}
    >
      <span className="flex items-center group-hover/scbutton:opacity-60 transition">
        {icon && <span className={`${children ? "mr-2" : ""}`}>{icon}</span>}

        {children}
      </span>
    </button>
  );
};

export default Button;
