"use client"

import React, { useRef } from "react"

interface CoverProps {
  children?: React.ReactNode
  onImageChange: (image: string) => void
}

export default function CoverPhotoUpload({ children, onImageChange }: CoverProps) {

  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      onImageChange(imageUrl)
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