"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex items-center shrink-0
        w-12 h-7 rounded-full transition-colors duration-200
        focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500
        ${checked ? "bg-anger" : "bg-white-smoke/20"}
      `}
    >
      <span
        className={`
          inline-block w-5 h-5 rounded-full bg-white shadow-sm
          transform transition-transform duration-200
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}