"use client"

interface CBProps {
  checked: boolean
  onChange: (v: boolean) => void
  uncheckedClassName?: string
  checkStroke?: string
}

export default function CB({ checked, onChange, uncheckedClassName = "bg-transparent border-(--fg)/50", checkStroke = "var(--bg)" }: CBProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
        checked ? "border-chinese-black bg-white-smoke" : uncheckedClassName
      }`}
    >
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path
            d="M1 4L4 7.5L10 1"
            stroke={checkStroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}