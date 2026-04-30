"use client";

import { useState, useEffect, useRef } from "react";

interface InfoPopoverProps {
  text: string;
  className?: string;
  size?: number;
  position?: "left" | "right";
}

export default function InfoPopover({ text, className, size = 16, position = "left" }: InfoPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex ml-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-full bg-white-smoke text-chinese-black text-[10px] select-none cursor-pointer hover:bg-white/30 hover:text-white-smoke transition-colors"
        style={{ width: size, height: size }}
      >
        i
      </button>
      {open && (
        <div
          className={`absolute top-6 z-50 rounded-lg bg-white-smoke p-4 shadow-xl w-64 ${position === "right" ? "right-0" : "left-0"} ${className ?? ""}`}
        >
          <p className="text-sm text-chinese-black leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  );
}