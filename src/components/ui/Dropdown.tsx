"use client";
import { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  type?: "separator";
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  width?: string;
  position?: string;
  testId?: string;
}

export default function Dropdown({
  trigger,
  items,
  width = "w-40",
  position = "right-0",
  testId,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          data-testid={testId}
          className={`flex flex-col absolute ${width} ${position} mt-5 py-2 bg-chinese-black border border-silver rounded-sm`}
        >
          {items.map((item, index) =>
            item.type === "separator" ? (
              <hr key={index} className="border-silver my-1" />
            ) : (
              <button
                key={index}
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className="flex items-center text-sm gap-3 text-white-smoke hover:text-silver font-bold px-4 py-2 text-left transition-all duration-300 cursor-pointer"
              >
                {item.icon && <span className="text-md">{item.icon}</span>}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
