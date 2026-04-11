"use client";

import { useState, useEffect, useRef } from "react";

interface InfoPopoverProps {
  text: string;
  className?: string;
}

export default function InfoPopover({ text, className }: InfoPopoverProps) {
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
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#999999] text-[10px] select-none cursor-pointer hover:bg-white/30 transition-colors"
      >
        i
      </button>
      {open && (
        <div className={`absolute left-0 top-6 z-50 rounded-lg bg-[#999999] p-4 shadow-xl ${className ?? "w-64"}`}>
          <p className="text-sm text-black leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  );
}