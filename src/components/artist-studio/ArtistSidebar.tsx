"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { BiCollection } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { LuLibraryBig } from "react-icons/lu";
import { PiShootingStar } from "react-icons/pi";
import { TbGridDots } from "react-icons/tb";
import { useRouter } from "next/navigation";


export default function ArtistSidebar() {
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 1024);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  if (isMobile) return null;

  return (
    <aside className="fixed inset-y-0 left-0 top-0 z-300 flex w-20 flex-col items-center justify-between border-r border-white-smoke bg-chinese-black pb-4 pt-3.5">
      <div className="flex w-full flex-col items-center gap-1">
        <button onClick={() => router.push("/home")} type="button" className="mb-1 flex h-11 w-full items-center justify-center cursor-pointer" aria-label="Beatza">
          <Image
            src="/app-logo/whitelogo.png"
            alt="Beatza"
            width={26}
            height={26}
            className="h-12 w-12 logo-dark object-contain"
          />
          <Image
            src="/app-logo/blacklogo.png"
            alt="Beatza"
            width={26}
            height={26}
            className="h-12 w-12 logo-light object-contain"
          />
        </button>

        {/* Sidebar nav as plain buttons, not mapped from array */}
        <button onClick={ () => router.push("/home")} type="button" className="group flex h-12 w-full flex-col items-center justify-center gap-1 bg-transparent transition-colors text-white-smoke cursor-pointer" aria-label="Home">
          <span className="inline-flex text-[28px] transition-transform duration-200 group-hover:-translate-y-1 ">
            <GoHome />
          </span>
          <span className="pointer-events-none text-[10px] font-bold leading-none transition-all duration-200 text-white-smoke/90 opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
            Home
          </span>
        </button>
        <button onClick={ () => router.push("/feed")} type="button" className="group flex h-12 w-full flex-col items-center justify-center gap-1 bg-transparent transition-colors text-white-smoke cursor-pointer" aria-label="Feed">
          <span className="inline-flex text-[28px] transition-transform duration-200 group-hover:-translate-y-1">
            <BiCollection />
          </span>
          <span className="pointer-events-none text-[10px] font-bold leading-none transition-all duration-200 text-white-smoke opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
            Feed
          </span>
        </button>
        <button onClick={ () => router.push("/library")} type="button" className="group flex h-12 w-full flex-col items-center justify-center gap-1 bg-transparent transition-colors text-white-smoke cursor-pointer" aria-label="Library">
          <span className="inline-flex text-[28px] transition-transform duration-200 group-hover:-translate-y-1">
            <LuLibraryBig />
          </span>
          <span className="pointer-events-none text-[10px] font-bold leading-none transition-all duration-200 text-white-smoke opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
            Library
          </span>
        </button>
        <button type="button" className="group flex h-12 w-full flex-col items-center justify-center gap-1 bg-transparent transition-colors text-white-smoke cursor-pointer" aria-label="For Artist">
          <span className="inline-flex text-[28px] transition-transform duration-200 group-hover:-translate-y-1">
            <PiShootingStar />
          </span>
          <span className="pointer-events-none text-[10px] font-bold leading-none transition-all duration-200 text-white-smoke opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
            For Artist
          </span>
        </button>
      </div>

      <button
        type="button"
        className="pb-10 text-[20px] text-white-smoke transition-colors hover:text-[#8a8a8a] cursor-pointer"
        aria-label="more-apps"
      >
        <TbGridDots />
      </button>
    </aside>
  );
}
