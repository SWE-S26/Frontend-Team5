// src/components/ui/FloatingInput.tsx
'use client'

import { useState } from 'react'

interface FloatingInputProps {
  placeholder: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  format?: string
  required?: boolean
  errorMessage?: string
  maxLength?: number
  numbersOnly?: boolean
}

export default function FloatingInput({ placeholder, type = 'text', value, onChange, className = '', format, required, errorMessage, maxLength, numbersOnly }: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const [touched, setTouched] = useState(false)
  const [internalValue, setInternalValue] = useState('')

  const val = value !== undefined ? value : internalValue
  const isFloating = focused || val.length > 0
  const hasError = touched && required && val.length === 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (numbersOnly) {
      e.target.value = e.target.value.replace(/\D/g, '')
    }
    if (onChange) onChange(e)
    else setInternalValue(e.target.value)
  }

  const handleBlur = () => {
    setFocused(false)
    setTouched(true)
  }

  return (
    <div className={className}>
      <div className={`relative bg-gray-100 rounded-lg border-2 transition-colors duration-150 ${
        hasError ? 'border-red-500' : focused ? 'border-black' : 'border-transparent'
      }`}>
        <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-400
                          ${isFloating ? 'top-1.5 text-[10px]' : 'top-1/2 -translate-y-1/2 text-sm'} `}>
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
          onBlur={handleBlur}
          className="w-full bg-transparent rounded-lg px-4 pt-5 pb-2 text-sm text-gray-700 outline-none"
          maxLength={maxLength}
          inputMode={numbersOnly ? 'numeric' : 'text'}
        />
      </div>
      {hasError && (
        <p className="text-red-500 text-xs mt-1 ml-4.5">
          {errorMessage || `Enter a ${placeholder.toLowerCase()}`}
        </p>
      )}
    </div>
  )
}