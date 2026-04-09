import Image from "next/image";
import IPhoneMockup from "@/components/landing-page/iPhoneMockup";
import AndroidMockup from "@/components/landing-page/AndroidMockup";
import IPadMockup from "@/components/landing-page/iPadMockup";

export default function NeverStopListening() {
  return (
    <section className="w-full bg-[#f2f2f2] overflow-hidden">
      <div className="max-w-6xl mx-auto px-8 py-16 flex items-center">

        {/* ── Left: devices ───────────────────────────────────────── */}
        {/* Layout from reference: phone-back top-left, phone-front bottom-left, tablet right */}
        <div className="w-[70%] flex relative">

          {/* Phone back — taller, slight left tilt, behind */}
          <IPhoneMockup className="absolute z-10" />

          {/* Phone front — overlapping, slight right tilt, in front */}
          <AndroidMockup className="..." />

          {/* Tablet — right side, upright */}
          <IPadMockup className="absolute z-10" />

        </div>

        {/* ── Right: copy + store buttons ──────────────────────────── */}
        <div className="w-[30%] shrink-0">
          <h2 className="text-[2.5rem] font-light text-[#1a1a1a] leading-tight mb-3">
            Never stop listening
          </h2>

          <div className="w-12 h-[3px] bg-gradient-to-r from-[#FF5500] to-[#FF8800] mb-5 rounded-full" />

          <p className="text-[15px] font-semibold text-[#1a1a1a] leading-relaxed mb-8">
            Beatza is available on Web, iOS, Android, Sonos, Chromecast, and Xbox One.
          </p>

          <div className="flex items-center gap-3">
            <a href="#" className="transition-opacity hover:opacity-80" aria-label="Download on the App Store">
              <Image
                src="/stores-buttons/app-store-button.png"
                alt="Download on the App Store"
                width={140}
                height={44}
                className="h-11 w-auto"
              />
            </a>
            <a href="#" className="transition-opacity hover:opacity-80" aria-label="Get it on Google Play">
              <Image
                src="/stores-buttons/google-play-button.png"
                alt="Get it on Google Play"
                width={148}
                height={44}
                className="h-11 w-auto"
              />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}