"use client";

import React, { useRef, useState } from "react";

interface AvatarProps {
  children?: React.ReactNode;
  className?: string;
  onImageChange: (file: File, previewUrl: string) => void; // ← updated
  avatarImage?: string | null;
}

export default function AvatarUpload({ children, className, onImageChange, avatarImage }: AvatarProps) {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      onImageChange(file, previewUrl); // ← pass both File + preview URL
    }
  };

  const displayImage = image || avatarImage;

  return (
    <div
      className={`w-48 h-48 rounded-full bg-linear-to-br from-[#8f6f79] to-[#c3adb4] flex items-center justify-center shadow-lg overflow-hidden ${className}`}
    >
      {displayImage && (
        <img src={displayImage} alt="avatar" className="w-full h-full object-cover" />
      )}

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
  );
}
