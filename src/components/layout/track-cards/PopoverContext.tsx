// ProfilePopoverContext.tsx
"use client";
import { createContext, useContext, useState, useRef } from "react";

const PopoverContext = createContext<{
  openId: string | null;
  setOpenId: (id: string | null) => void;
  hideTimer: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}>({
  openId: null,
  setOpenId: () => {},
  hideTimer: { current: null },
});

export function PopoverProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <PopoverContext.Provider value={{ openId, setOpenId, hideTimer }}>
      {children}
    </PopoverContext.Provider>
  );
}

export const usePopover = () => useContext(PopoverContext);
