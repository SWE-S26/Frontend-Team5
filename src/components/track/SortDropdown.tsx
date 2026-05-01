"use client"
import { useState, useRef, useEffect } from "react"
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

export type SortOption = "Newest" | "Oldest" | "Track Time"

interface SortDropdownProps {
  value?:    SortOption
  onChange?: (value: SortOption) => void
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [selected, setSelected] = useState<SortOption>(value ?? "Newest")
  const [open, setOpen]         = useState(false)
  const ref                     = useRef<HTMLDivElement>(null)

  const options: SortOption[] = ["Newest", "Oldest", "Track Time"]

  const handleSelect = (option: SortOption) => {
    setSelected(option)
    setOpen(false)
    onChange?.(option)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white-smoke/10 text-white-smoke text-sm rounded cursor-pointer hover:bg-white-smoke/15 transition"
      >
        Sorted by: {selected}
        <span>{open ? <FaChevronUp /> : <FaChevronDown /> }</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-chinese-black border border-white-smoke/10 rounded shadow-xl z-50">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-3 text-sm cursor-pointer transition
                ${selected === option
                  ? "text-white-smoke font-bold"
                  : "text-gray-400 hover:text-white-smoke"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}