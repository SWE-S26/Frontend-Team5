"use client";

import { useRouter } from "next/navigation";

export default function UnlockArtistBanner() {
  const router = useRouter();

  return (
    <div className=" hover:cursor-pointer">
      <button
        onClick={() => router.push("/artist")}
        className="
        flex items-center gap-3
        w-full px-4 py-3
        bg-[#7B61FF]/20 rounded-md
        focus:outline-none
        hover:brightness-110 transition-[filter] duration-150
      "
      >
        {/* ── Star circle — same as ArtistTools badge but larger ── */}
        <span
          className="
          flex-shrink-0
          w-[19px] h-[19px] rounded-full
          bg-[#7B61FF]
        
          flex items-center justify-center
        "
        >
          {/* 4-pointed star, filled purple */}
          <svg
            viewBox="0 0 24 24"
            className="w-[11px] h-[11px] fill-chinese-black justify-center items-center"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z" />
          </svg>
        </span>

        {/* ── Text ── */}
        <span className="text-white-smoke text-[12px] whitespace-nowrap px-2">
          Unlock Artist tools from EGP 29.99/month.
        </span>
      </button>
    </div>
  );
}
