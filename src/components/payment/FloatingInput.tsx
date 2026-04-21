'use client'

import { useState } from 'react'

interface FloatingInputProps {
  placeholder: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  format?: string
}

export default function FloatingInput({ placeholder, type = 'text', value, onChange, className = '', format }: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const [internalValue, setInternalValue] = useState('')

  const val = value !== undefined ? value : internalValue
  const isFloating = focused || val.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e)
    else setInternalValue(e.target.value)
  }

  return (
    <div className={`relative bg-gray-100 rounded-lg border-2 transition-colors duration-150 ${
      focused ? 'border-[0.75px] border-black' : 'border-transparent'
    } ${className}`}>
      <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
        isFloating ? 'top-1.5 text-[10px] text-gray-400' : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
      }`}>
        {placeholder}
      </label>
      {isFloating && format && val.length === 0 && (
        <span className="absolute left-4 top-[60%] -translate-y-1/2 text-sm text-gray-300 pointer-events-none">
          {format}
        </span>
      )}
      <input
        type={type}
        value={val}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent rounded-lg px-4 pt-5 pb-2 text-sm text-gray-700 outline-none"
      />
    </div>
  )
}