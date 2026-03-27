"use client"

import React, { useRef } from "react"

interface CoverProps {
  children?: React.ReactNode
  onImageChange: (file: File, previewUrl: string) => void // ← updated
}

export default function CoverPhotoUpload({ children, onImageChange }: CoverProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const previewUrl = URL.createObjectURL(file)
      onImageChange(file, previewUrl) // ← pass both
    }
  }

  return (
    <div>
      <div onClick={openFilePicker} className="cursor-pointer">
        {children}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
