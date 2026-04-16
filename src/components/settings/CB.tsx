"use client"

export default function CB({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
        checked ? "border-white-smoke bg-white-smoke" : "bg-transparent border-(--fg)/50"
      }`}
    >
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path
            d="M1 4L4 7.5L10 1"
            stroke="var(--bg)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}