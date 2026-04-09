"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export default function Tooltip({ label, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  function updatePosition() {
    if (!triggerRef.current || !tooltipRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRef.current.offsetWidth;
    setCoords({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2 - 6,
    });
  }

  useEffect(() => {
    if (visible) updatePosition();
  }, [visible]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => {
          // Dispatch event to close any open dropdowns
          document.dispatchEvent(new CustomEvent("tooltip-opening"));
          setVisible(true);
        }}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{ top: coords.top, left: coords.left }}
            className="fixed pointer-events-none whitespace-nowrap z-[9999]"
          >
            {/* Arrow */}
            <div
              style={{ top: -4, left: "50%", transform: "translateX(-50%)" }}
              className="absolute w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-off-black"
            />
            {/* Box */}
            <div className="px-2 py-1 bg-off-black text-white-smoke text-[11px] rounded border border-chinese-black">
              {label}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
