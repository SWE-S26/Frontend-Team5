"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useAppSelector } from "@/store/hooks";

interface CoverProps {
  children?: React.ReactNode;
  onImageChange: (file: File, previewUrl: string) => void;
  disableClick?: boolean;
}

export interface CoverUploadHandle {
  openFilePicker: () => void;
}

const CoverPhotoUpload = forwardRef<CoverUploadHandle, CoverProps>(
  ({ children, onImageChange, disableClick = false }, ref) => {
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

      const previewUrl = URL.createObjectURL(file);
      onImageChange(file, previewUrl);
    };

    const isOwn = useAppSelector((state) => state.profile.isOwnProfile);

    return (
      <div>
        {isOwn && (
          <>
            <div
              onClick={disableClick ? undefined : openFilePicker}
              className={disableClick ? "" : "cursor-pointer"}
            >
              {children}
            </div>

            <input
              data-testid="Cover-input"
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

CoverPhotoUpload.displayName = "CoverPhotoUpload";
export default CoverPhotoUpload;
