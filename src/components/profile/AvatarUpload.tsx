"use client";

import React, { useRef, useState } from "react";

interface AvatarProps {
  children?: React.ReactNode;
  className?: string;
}

export default function AvatarUpload({ children, className }: AvatarProps) {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div
      className={`w-48 h-48 rounded-full bg-gradient-to-br from-[#8f6f79] to-[#c3adb4] flex items-center justify-center shadow-lg overflow-hidden ${className}`}
    >
      {image ? (
        <img src={image} alt="avatar" className="w-full h-full object-cover" />
      ) : null}

      {/* children (your button) */}
      <div onClick={openFilePicker} className="cursor-pointer">
        {children}
      </div>

      {/* hidden input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}