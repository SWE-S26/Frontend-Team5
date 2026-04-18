"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { BiCollection } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { LuLibraryBig } from "react-icons/lu";
import { PiShootingStar } from "react-icons/pi";
import { TbGridDots } from "react-icons/tb";

type SidebarItem = {
  icon: ReactNode;
  label: string;
  active?: boolean;
};

const NAV_ITEMS: SidebarItem[] = [
  { icon: <GoHome />, label: "Home" },
  { icon: <BiCollection />, label: "Feed" },
  { icon: <LuLibraryBig />, label: "Library" },
  { icon: <PiShootingStar />, label: "For Artist" },
];

export default function ArtistSidebar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 1024);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  if (isMobile) return null;

  return (
    <aside className="fixed inset-y-0 left-0 top-0 z-300 flex w-20 flex-col items-center justify-between border-r border-[#1e1e1e] bg-[#111] pb-4 pt-3.5">
      <div className="flex w-full flex-col items-center gap-1">
        <button type="button" className="mb-1 flex h-11 w-full items-center justify-center" aria-label="Beatza">
          <Image
            src="/app-logo/whitelogo.png"
            alt="Beatza"
            width={26}
            height={26}
            className="h-12 w-12 logo-dark object-contain"
          />
          <Image
            src="/app-logo/whitelogo.png"
            alt="Beatza"
            width={26}
            height={26}
            className="h-12 w-12 logo-light object-contain"
          />
        </button>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`group flex h-12 w-full flex-col items-center justify-center gap-1 bg-transparent transition-colors ${
              item.active ? "text-white-smoke" : "text-[#666]"
            }`}
            aria-label={item.label}
          >
            <span className="inline-flex text-[28px] transition-transform duration-200 group-hover:-translate-y-1 cursor-pointer">
              {item.icon}
            </span>
            <span
              className={`pointer-events-none text-[10px] font-bold leading-none transition-all duration-200 ${
                item.active ? "text-white-smoke/90" : "text-[#9a9a9a]"
              } opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pb-2 text-[20px] text-[#666] transition-colors hover:text-[#8a8a8a]"
        aria-label="more-apps"
      >
        <TbGridDots />
      </button>
    </aside>
  );
}
