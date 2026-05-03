import React from "react";
interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const CustomCheckbox = ({ checked, onChange, label }: CustomCheckboxProps) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer group w-full">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`mt-0.5 w-5 h-5 shrink-0 rounded-sm border-2 flex items-center justify-center transition-colors
                    ${
                      checked
                        ? "bg-white-smoke border-white-smoke"
                        : "bg-chinese-black border-silver"
                    }`}
      >
        <svg
          viewBox="0 0 12 10"
          className={`w-3 h-3 transition-all
                        ${checked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          fill="none"
        >
          <path
            d="M1 5l3.5 3.5L11 1"
            stroke={checked ? "black" : "silver"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-sm font-bold text-white-smoke flex-1">{label}</span>
    </label>
  );
};

export default CustomCheckbox;
