"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCollection } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { LuLibraryBig } from "react-icons/lu";
import { PiShootingStar } from "react-icons/pi";
import { TbGridDots } from "react-icons/tb";

type ArtistSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const footerLinks = [
  { label: "Legal", path: "/legal" },
  { label: "Privacy", path: "/privacy" },
  { label: "About us", path: "/about" },
  { label: "Copyright", path: "/copyright" },
];

export default function ArtistSidebar({ open = false, onClose }: ArtistSidebarProps) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 1024);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    onClose?.();
  };

  const FooterLinks = () => (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      {footerLinks.map(({ label, path }, index) => (
        <div key={label} className="flex items-center gap-2">
          {index > 0 && <span className="text-[#555]">-</span>}
          <button
            type="button"
            onClick={() => navigate(path)}
            className="transition-colors hover:text-white-smoke cursor-pointer"
          >
            {label}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-200 bg-black/60 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 top-0 z-300 flex w-72 flex-col border-r border-white-smoke bg-chinese-black pb-4 pt-3.5 transition-transform duration-200 ease-out lg:w-20 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex w-full flex-col items-stretch gap-1 px-3 lg:w-full lg:items-center lg:px-0">
          <button onClick={() => navigate("/home")} type="button" className="mb-1 flex h-11 w-full items-center justify-center cursor-pointer" aria-label="Beatza">
            <Image src="/app-logo/whitelogo.png" alt="Beatza" width={26} height={26} className="h-12 w-12 logo-dark object-contain" />
            <Image src="/app-logo/blacklogo.png" alt="Beatza" width={26} height={26} className="h-12 w-12 logo-light object-contain" />
          </button>

          <button onClick={() => navigate("/home")} type="button" className="group flex h-12 w-full items-center gap-3 rounded-xl bg-transparent px-3 text-white-smoke transition-colors hover:bg-white/5 cursor-pointer lg:flex-col lg:justify-center lg:gap-1 lg:px-0" aria-label="Home">
            <span className="inline-flex text-[28px] transition-transform duration-200 group-hover:-translate-y-1"><GoHome /></span>
            <span className="text-[13px] font-medium leading-none text-white-smoke/90 lg:pointer-events-none lg:text-[10px] lg:font-bold lg:opacity-0 lg:translate-y-1 lg:transition-all lg:duration-200 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">Home</span>
          </button>

          <button onClick={() => navigate("/feed")} type="button" className="group flex h-12 w-full items-center gap-3 rounded-xl bg-transparent px-3 text-white-smoke transition-colors hover:bg-white/5 cursor-pointer lg:flex-col lg:justify-center lg:gap-1 lg:px-0" aria-label="Feed">
            <span className="inline-flex text-[28px] transition-transform duration-200 group-hover:-translate-y-1"><BiCollection /></span>
            <span className="text-[13px] font-medium leading-none text-white-smoke/90 lg:pointer-events-none lg:text-[10px] lg:font-bold lg:opacity-0 lg:translate-y-1 lg:transition-all lg:duration-200 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">Feed</span>
          </button>

          <button onClick={() => navigate("/library")} type="button" className="group flex h-12 w-full items-center gap-3 rounded-xl bg-transparent px-3 text-white-smoke transition-colors hover:bg-white/5 cursor-pointer lg:flex-col lg:justify-center lg:gap-1 lg:px-0" aria-label="Library">
            <span className="inline-flex text-[28px] transition-transform duration-200 group-hover:-translate-y-1"><LuLibraryBig /></span>
            <span className="text-[13px] font-medium leading-none text-white-smoke/90 lg:pointer-events-none lg:text-[10px] lg:font-bold lg:opacity-0 lg:translate-y-1 lg:transition-all lg:duration-200 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">Library</span>
          </button>

          <button onClick={() => navigate("/artist")} type="button" className="group flex h-12 w-full items-center gap-3 rounded-xl bg-transparent px-3 text-white-smoke transition-colors hover:bg-white/5 cursor-pointer lg:flex-col lg:justify-center lg:gap-1 lg:px-0" aria-label="For Artist">
            <span className="inline-flex text-[28px] transition-transform duration-200 group-hover:-translate-y-1"><PiShootingStar /></span>
            <span className="text-[13px] font-medium leading-none text-white-smoke/90 lg:pointer-events-none lg:text-[10px] lg:font-bold lg:opacity-0 lg:translate-y-1 lg:transition-all lg:duration-200 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">For Artist</span>
          </button>
        </div>

        <div className="mt-auto w-full px-3 pb-6 lg:px-0">
          {isDesktop && (
            <div className="relative flex flex-col items-center group">
              <button
                type="button"
                className="flex h-10 mb-2 items-center justify-center text-[20px] text-white-smoke transition-colors hover:text-[#8a8a8a] cursor-pointer"
                aria-label="more-apps"
              >
                <TbGridDots />
              </button>
              <div className="absolute bottom-0 left-full w-3 h-10" />
              <div className="
                pointer-events-none absolute bottom-0 left-full ml-3
                w-52 rounded-lg border border-white/10 bg-chinese-black p-3
                text-[11px] text-white-smoke/70
                opacity-0 translate-x-1
                transition-all duration-150
                group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto
                delay-400 group-hover:delay-[0ms]
              ">
                <FooterLinks />
              </div>
          </div>
          )}

          {!isDesktop && (
            <div className="text-[11px] text-white-smoke/70">
              <FooterLinks />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}