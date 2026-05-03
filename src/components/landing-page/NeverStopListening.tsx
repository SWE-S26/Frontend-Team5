import Image from "next/image";
import IPhoneMockup from "@/components/landing-page/iPhoneMockup";
import AndroidMockup from "@/components/landing-page/AndroidMockup";
import IPadMockup from "@/components/landing-page/iPadMockup";

export default function NeverStopListening() {
  return (
    <section className="w-full bg-[#f2f2f2] overflow-hidden">
      <div className="max-w-6xl mx-auto px-8 py-12 sm:py-16 flex flex-col sm:flex-row items-center gap-10 sm:gap-0">
        {/* ── Devices — hidden on mobile, visible on sm+ ─────────── */}
        <div className="hidden sm:flex w-[70%] relative h-85">
          <AndroidMockup
            className="absolute left-10 top-50 z-30"
            screenImage="/landing-page/mock-phone/Mobile2.png"
          />
          <IPhoneMockup
            className="absolute -left-10 top-25 z-20"
            screenImage="/landing-page/mock-phone/Mobile1.png"
          />
          <IPadMockup
            className="absolute right-35 top-38 z-10"
            screenImage="/landing-page/mock-phone/Mobile3.jpeg"
          />
        </div>

        {/* ── Copy + store buttons ──────────────────────────────── */}
        <div className="w-full sm:w-[30%] shrink-0 text-center sm:text-left">
          <h2 className="text-[2rem] sm:text-[2.5rem] font-light text-[#1a1a1a] leading-tight mb-3">
            Never stop listening
          </h2>

          <div className="w-12 h-0.75 bg-linear-to-r from-[#FF5500] to-[#FF8800] mb-5 rounded-full mx-auto sm:mx-0" />

          <p className="text-[15px] font-semibold text-[#1a1a1a] leading-relaxed mb-8">
            Beatza is available on Web and Android
          </p>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <a
              href="#"
              className="transition-opacity hover:opacity-80"
              aria-label="Download on the App Store"
            >
              <Image
                src="/stores-buttons/app-store-button.png"
                alt="Download on the App Store"
                width={140}
                height={44}
                className="h-10 sm:h-11 w-auto"
              />
            </a>
            <a
              href="#"
              className="transition-opacity hover:opacity-80"
              aria-label="Get it on Google Play"
            >
              <Image
                src="/stores-buttons/google-play-button.png"
                alt="Get it on Google Play"
                width={148}
                height={44}
                className="h-10 sm:h-11 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
