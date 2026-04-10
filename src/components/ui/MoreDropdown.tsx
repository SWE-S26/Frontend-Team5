"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface DropdownItem {
  type?: "separator";
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface MoreDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  width?: string;
  tooltipLabel?: string;
}

export default function MoreDropdown({
  trigger,
  items,
  width = "w-auto",
  tooltipLabel,
}: MoreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipCoords, setTooltipCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  function updatePosition() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const t = triggerRef.current;
      const d = dropdownRef.current;
      if (!t || !d) return;
      const rect = t.getBoundingClientRect();
      const dropdownHeight = d.offsetHeight ?? 120;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < dropdownHeight + 8;

      d.style.top = `${openUpward ? rect.top - dropdownHeight : rect.bottom}px`;
      d.style.left = `${rect.left}px`;
    });
  }

  function updateTooltipPosition() {
    const t = triggerRef.current;
    if (!t) return;
    const rect = t.getBoundingClientRect();
    setTooltipCoords({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  }

  function handleOpen() {
    setIsOpen((o) => !o);
  }

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(updatePosition);
    document.addEventListener("scroll", updatePosition, true);
    return () => document.removeEventListener("scroll", updatePosition, true);
  }, [isOpen]);

  useEffect(() => {
    if (!showTooltip || isOpen) return;
    updateTooltipPosition();
    document.addEventListener("scroll", updateTooltipPosition, true);
    return () =>
      document.removeEventListener("scroll", updateTooltipPosition, true);
  }, [showTooltip, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent) {
        if (triggerRef.current?.contains(e.target as Node)) return;
        if (dropdownRef.current?.contains(e.target as Node)) return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClose);
    document.addEventListener("keydown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("keydown", handleClose);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleOpen}
        onMouseEnter={() => tooltipLabel && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-block"
      >
        {trigger}
      </div>

      {showTooltip &&
        tooltipLabel &&
        !isOpen &&
        createPortal(
          <div
            style={{
              top: tooltipCoords.top,
              left: tooltipCoords.left,
              transform: "translateX(-50%)",
            }}
            className="fixed pointer-events-none whitespace-nowrap z-[9999]"
          >
            <div
              style={{ top: -4, left: "50%", transform: "translateX(-50%)" }}
              className="absolute w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-off-black"
            />
            <div className="px-2 py-1 bg-off-black text-white-smoke text-[11px] rounded border border-chinese-black">
              {tooltipLabel}
            </div>
          </div>,
          document.body,
        )}

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ top: 0, left: 0 }}
            className={`fixed z-[9999] flex flex-col ${width} bg-chinese-black border border-silver/40 rounded-sm py-2`}
          >
            {items.map((item, index) => (
              <button
                key={index}
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 pl-3 pr-6 py-1.5 text-left transition-colors ${
                  item.disabled
                    ? "text-silver/50 cursor-not-allowed"
                    : "text-white-smoke hover:text-white-smoke/50 cursor-pointer"
                }`}
              >
                {item.icon && (
                  <span className="text-lg shrink-0">{item.icon}</span>
                )}
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
