"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function GoPlus() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero — same width as content below */}
      <div className="w-full flex justify-center pt-12">
        <div className="w-[80%] relative h-80 sm:h-105 overflow-hidden rounded-xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/landing-page/CallingAllCreators.png')" }}
          />
          <div className="absolute inset-0 bg-black/55" />

          {/* Hero text */}
          <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-16 max-w-3xl">
            <h1 className="text-white text-3xl sm:text-5xl font-bold leading-tight mb-8">
              Sorry, we're still working on launching BeatZa Go+ in your country.
            </h1>
            <Link href="/home">
              <Button className="bg-off-black text-white-smoke px-10 py-2.5 text-sm w-fit">
                Start Listening
              </Button>
            </Link>
          </div>

          {/* Bottom gradient border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-700 via-red-500 to-orange-400" />
        </div>
      </div>

      {/* Below hero — content section */}
      <div className="w-full flex justify-center py-12">
        <div className="w-[80%] bg-white rounded-xl px-10 py-10 shadow-sm">
          <h2 className="text-black text-sm font-black tracking-widest uppercase mb-3">
            Hear what's next, now
          </h2>
          <div className="w-12 h-0.5 bg-linear-to-r from-purple-700 to-orange-400 mb-5 rounded-full" />
          <p className="text-gray-700 text-base leading-relaxed">
            Until we can bring you offline and advert-free listening, check out some of the most
            buzzed about tracks trending in the BeatZa community.
          </p>
          <div className="my-10"></div>
          <h2 className="text-black text-sm font-black tracking-widest uppercase mb-3">
            Your subscription supports artists
          </h2>
          <div className="w-12 h-0.5 bg-linear-to-r from-purple-700 to-orange-400 mb-5 rounded-full" />
          <p className="text-gray-700 text-base leading-relaxed">
            When you listen as a Go+ subscriber, you contribute to fan-powered royalties that
            directly support and help break the next big independent artists growing their careers
            on SoundCloud.
          </p>
        </div>
      </div>
    </div>
  );
}
