"use client";

import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useAppSelector } from "@/store/hooks";

interface AvatarProps {
  children?: React.ReactNode;
  className?: string;
  onImageChange: (file: File, previewUrl: string) => void;
  avatarImage?: string | null;
  disableClick?: boolean; // ← new
}

export interface AvatarUploadHandle {
  openFilePicker: () => void; // ← expose trigger
}

const AvatarUpload = forwardRef<AvatarUploadHandle, AvatarProps>(
  ({ children, className, onImageChange, avatarImage, disableClick = false }, ref) => {
    // const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openFilePicker = () => {
      fileInputRef.current?.click();
    };

    useImperativeHandle(ref, () => ({ openFilePicker }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        e.target.value = "";
        return;
      }

      e.target.value = "";
      const previewUrl = URL.createObjectURL(file);
      onImageChange(file, previewUrl);
    };

    const isOwn = useAppSelector((state) => state.profile.isOwnProfile);

    return (
      <div
        className={`w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full bg-linear-to-br from-[#8f6f79] to-[#c3adb4] flex items-center justify-center shadow-lg overflow-hidden ${className}`}
      >
        {avatarImage && (
          <img src={avatarImage} alt="avatar" className="w-full h-full object-cover" />
        )}
        {isOwn && (
          <>
            <div
              onClick={disableClick ? undefined : openFilePicker}
              className={disableClick ? "" : "cursor-pointer"}
            >
              {children}
            </div>

            <input
              data-testid="Avatar-input"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>
    );
  }
);

AvatarUpload.displayName = "AvatarUpload";
export default AvatarUpload;
