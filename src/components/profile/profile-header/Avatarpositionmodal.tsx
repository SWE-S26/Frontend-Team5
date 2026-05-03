"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

import { useAppSelector, useAppDispatch } from "@/store/hooks";

interface AvatarPositionModalProps {
  isOpen: boolean;
  imageUrl: string;
  originalFile: File | null;
  onSave: (file: File, croppedDataUrl: string) => void;
  onCancel: () => void;
}

async function getCroppedImage(
  imageSrc: string,
  croppedAreaPixels: Area,
  fileName: string
): Promise<{ file: File; dataUrl: string }> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  ctx.beginPath();
  ctx.arc(
    croppedAreaPixels.width / 2,
    croppedAreaPixels.height / 2,
    Math.min(croppedAreaPixels.width, croppedAreaPixels.height) / 2,
    0,
    Math.PI * 2
  );
  ctx.clip();

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  const dataUrl = canvas.toDataURL("image/png");
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], fileName, { type: "image/png" });
  return { file, dataUrl };
}

export default function AvatarPositionModal({
  isOpen,
  imageUrl,
  originalFile,
  onSave,
  onCancel,
}: AvatarPositionModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    if (!croppedArea || !originalFile || !imageUrl) return;
    const { file, dataUrl } = await getCroppedImage(imageUrl, croppedArea, originalFile.name);
    onSave(file, dataUrl);
  }, [croppedArea, originalFile, imageUrl, onSave]);

  const displayName = useAppSelector((state) => state.profile.displayName);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/30 z-[1001] flex items-start pt-25 justify-center"
          onClick={onCancel}
        >
          <button
            data-testid="cancel-button-popup"
            className="fixed top-4 right-4 text-white text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center z-[1002] hover:text-silver cursor-pointer"
            onClick={onCancel}
          >
            ✕
          </button>

          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-110  p-6 bg-black rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xl text-white-smoke font-bold mb-1">{displayName}</p>
            <p className="text-sm text-silver mb-6">
              For best results, upload images of at least 1000x1000 pixels. 2MB file-size limit.
            </p>

            {/* Crop area — black background so outside circle blends with modal */}
            <div className="relative w-full mb-6 bg-black" style={{ height: 320 }}>
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                cropSize={{ width: 280, height: 280 }}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    background: "#000000",
                  },
                  mediaStyle: {},
                  // make the crop overlay (outside the circle) fully transparent
                  cropAreaStyle: {
                    border: "none",
                    boxShadow: "0 0 0 9999px #000000",
                  },
                }}
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                data-testid="cancel-button-AvatarPositionModalPopup"
                onClick={onCancel}
                className="bg-off-black text-white-smoke px-4 py-2 rounded cursor-pointer hover:text-silver transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="save-button-AvatarPositionModalPopup"
                onClick={handleSave}
                className="bg-white text-black px-4 py-2 rounded cursor-pointer hover:bg-gray-200 transition-colors font-semibold"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
