"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdPause, IoMdPlay } from "react-icons/io";

export default function PreviewTooltip({
  x,
  y,
  img,
  title,
  artist,
  isPreviewActive,
}: {
  x: number;
  y: number;
  img?: string;
  title?: string;
  artist?: string;
  isPreviewActive: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed z-9999 rounded-lg border border-[#2f3035] bg-chinese-black p-2 text-white-smoke shadow-xl pointer-events-none"
      style={{ left: `${x + 12}px`, top: `${y + 12}px` }}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 overflow-hidden rounded">
          {img ? (
            <img src={img} alt="Track" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[#2a2a2a]" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white-smoke/90">
              {isPreviewActive ? (
                <IoMdPause className="text-[16px] text-chinese-black" />
              ) : (
                <IoMdPlay className="text-[16px] text-chinese-black" />
              )}
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-white-smoke">
            {title || "Untitled"}
          </div>
          <div className="truncate text-[12px] text-white-smoke/70">
            {artist || "Unknown artist"}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
