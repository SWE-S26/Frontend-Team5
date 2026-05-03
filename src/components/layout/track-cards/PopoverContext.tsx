"use client";
import { createContext, useContext, useState, useRef } from "react";

const PopoverContext = createContext<{
  openId: string | null;
  setOpenId: (id: string | null) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
}>({
  openId: null,
  setOpenId: () => {},
  scheduleClose: () => {},
  cancelClose: () => {},
});

export function PopoverProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleClose() {
    hideTimer.current = setTimeout(() => setOpenId(null), 200);
  }

  function cancelClose() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  return (
    <PopoverContext.Provider value={{ openId, setOpenId, scheduleClose, cancelClose }}>
      {children}
    </PopoverContext.Provider>
  );
}

export const usePopover = () => useContext(PopoverContext);
