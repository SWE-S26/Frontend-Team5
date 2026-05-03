import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

interface HeroSectionProps {
  onScrollToPlans: () => void;
}

export function HeroSection({ onScrollToPlans }: HeroSectionProps) {
  const role = useAppSelector((state) => state.auth.role);

  return (
    <section
      className="bg-[#121212] flex justify-center min-h-screen"
      style={{
        backgroundImage: "url('/artist/hero-background-image-speakers.svg')",
        backgroundSize: "64%",
        backgroundPosition: "100% 0",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative w-full max-w-291 overflow-hidden px-4 sm:px-5.5">
        {/* Content */}
        <div className="flex flex-col items-start justify-center min-h-screen mt-20 sm:mt-36 relative z-10">
          <div>
            {/* Main heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-[86px] font-black text-white leading-tight">
              Reach more listeners.
            </h1>

            {/* Subheading */}
            <div className="mt-2.5">
              <p className="text-lg sm:text-2xl lg:text-[28px] font-bold text-white">
                Join millions of artists that use SoundCloud to get heard.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 sm:gap-8 mt-10 sm:mt-14.5">
              {role !== "Pro" && (
                <Link
                  href="/checkout"
                  className="rounded-full bg-white px-6 py-2.5 font-semibold text-black transition-all duration-200 text-sm hover:bg-black hover:text-white"
                >
                  Get Artist Pro
                </Link>
              )}
              <button
                onClick={onScrollToPlans}
                className="rounded-full border border-white px-6 py-2.5 font-semibold text-white transition-all duration-200 text-sm hover:bg-white hover:text-black"
              >
                See all plans
              </button>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-9 mt-16 sm:mt-20 mb-20">
              {[
                {
                  icon: "/artist/bullseye.svg",
                  title: "Grow your audience",
                  description:
                    "Artist Pro subscribers get on average 400% more listens, thanks to our audio algorithm and featured playlists.",
                },
                {
                  icon: "/artist/histogram.svg",
                  title: "Know your audience",
                  description:
                    "Get advanced fan insights and custom listening reports to build connections and plan promotions, releases, and tours.",
                },
                {
                  icon: "/artist/infinity.svg",
                  title: "Upload unlimited tracks",
                  description:
                    "Upload and replace unlimited tracks without losing your plays, likes, and comments.",
                },
                {
                  icon: "/artist/distribute.svg",
                  title: "Distribution is included",
                  description:
                    "Distribute and get paid on SoundCloud and 60+ platforms including Spotify, Apple Music, and TikTok.",
                },
              ].map((feature, idx) => (
                <div key={idx} className="w-full">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-12 h-12 sm:w-15 sm:h-15 mb-4 sm:mb-5"
                  />
                  <h3 className="text-base sm:text-[20px] font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
