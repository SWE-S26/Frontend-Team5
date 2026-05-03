"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex items-center justify-center min-w-7 h-7 px-1.5 bg-chinese-black text-white-smoke text-[11px] font-bold rounded border border-[#555] leading-none">
    {children}
  </kbd>
);

const leftShortcuts = [
  { keys: ["space"], label: "Play or pause" },
  { keys: ["↑", "→"], label: "Play next track" },
  { keys: ["↑", "L"], label: "Repeat playing track" },
  { keys: ["↑", "←"], label: "Play previous track" },
  { keys: ["→"], label: "Seek forward" },
  { keys: ["L"], label: "Like playing track" },
  { keys: ["R"], label: "Repost playing track" },
  { keys: ["S"], label: "Search" },
  { keys: ["G then L"], label: "Navigate to Likes" },
  { keys: ["G then C"], label: "Navigate to Library" },
  { keys: ["G then H"], label: "Navigate to History" },
  { keys: ["↑", "S"], label: "Shuffle" },
];

const rightShortcuts = [
  { keys: ["↑", "↓"], label: "Decrease volume" },
  { keys: ["↑", "↑"], label: "Increase volume" },
  { keys: ["M"], label: "Mute volume" },
  { keys: ["←"], label: "Seek backward" },
  { keys: ["0...9"], label: "Seek to position" },
  { keys: ["P"], label: "Navigate to playing track" },
  { keys: ["H"], label: "Show keyboard shortcuts" },
  { keys: ["G then S"], label: "Navigate to Feed" },
  { keys: ["G then P"], label: "Navigate to Profile" },
  { keys: ["Q"], label: "Show Next up" },
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 20);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white/40 transition-opacity duration-500 ease-in-out ${
        animate ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className={`fixed top-6 right-6 z-60 w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-gray-400 bg-[#303030] transition-all duration-500 cursor-pointer ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        aria-label="Close modal"
      >
        <IoClose size={32} />
      </button>

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-2xl p-8 bg-chinese-black rounded-lg shadow-2xl border border-white/10 transform transition-transform duration-500 ${
          animate ? "translate-y-0" : "-translate-y-[150vh]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white-smoke text-2xl font-bold mb-8">Keyboard shortcuts</h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {/* Left column */}
          <div className="flex flex-col gap-3">
            {leftShortcuts.map((s, i) => (
              <div key={i} className="flex items-center gap-3 min-h-7">
                <div className="flex items-center gap-1 min-w-22.5">
                  {s.keys.map((k, ki) => (
                    <Key key={ki}>{k}</Key>
                  ))}
                </div>
                <span className="text-white-smoke font-bold text-[13px]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3">
            {rightShortcuts.map((s, i) => (
              <div key={i} className="flex items-center gap-3 min-h-7">
                <div className="flex items-center gap-1 min-w-22.5">
                  {s.keys.map((k, ki) => (
                    <Key key={ki}>{k}</Key>
                  ))}
                </div>
                <span className="text-white-smoke font-bold text-[13px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
