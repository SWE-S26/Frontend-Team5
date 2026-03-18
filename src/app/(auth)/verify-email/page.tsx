"use client";

import Link from "next/link";
import { useEffect } from "react";
import Button from "@/components/ui/Button"

export default function ResetPasswordPage() {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <main className="h-dvh overflow-hidden bg-[#f2f2f2] text-[#333] flex flex-col">
      <header className="h-13 bg-chinese-black">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center">
          <div className="flex h-full w-60 items-center bg-chinese-black px-5">
            <img
              src="/beatza.png"
              alt="BeatZa logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <span className="ml-3 text-sm font-semibold tracking-[0.14em] text-white uppercase">
              BeatZa
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-3">
        <div className="text-center w-full max-w-2xl border border-[#d7d7d7] bg-[#f5f5f5] px-5 pb-6 pt-8 shadow-[0_0_0_1px_rgba(255,255,255,0.3)_inset] sm:px-10 sm:pb-8 sm:pt-10">
          <h1 className="text-3xl">Your email address is verified!</h1>
          <p className="mt-6">Now you can enjoy all the powerful features Beatza has to offer</p>
          <div className="mt-5 flex justify-center gap-5">
            <a href="/home">
                <Button className="px-4.5 py-3 bg-chinese-black text-white-smoke text-md cursor-pointer hover:bg-anger hover:text-white-smoke">
                    Discover new music
                </Button>
            </a>

            <a href="/upload">
                <Button className="px-4.5 py-3 bg-transparent text-anger border border-anger text-md cursor-pointer hover:bg-anger hover:text-white-smoke">
                    Upload your first track
                </Button>
            </a>

          </div>

        </div>
      </section>

      <footer className="mx-auto w-full max-w-7xl border-t border-[#e3e3e3] px-4 py-3 sm:py-4">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#636363] sm:text-base">
          <Link href="#" className="hover:underline">
            Legal
          </Link>
          <Link href="#" className="hover:underline">
            Privacy
          </Link>
          <Link href="#" className="hover:underline">
            Cookies
          </Link>
          <Link href="#" className="hover:underline">
            Imprint
          </Link>
        </nav>
      </footer>
    </main>
  );
}
