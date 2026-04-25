import { useRouter } from "next/navigation";

function StreamingPlatformItem({ mark, className }: { mark: string; className: string }) {
  return (
    <div className="flex min-h-8 items-center justify-center text-white-smoke opacity-90">
      <span className={`text-[18px] ${className}`}>{mark}</span>
    </div>
  );
}

function DistributionHowItWorksStep({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="shrink-0 text-[60px] font-black leading-none text-white-smoke">{num}</span>
      <div className="pt-3">
        <h4 className="text-[15px] font-bold text-white-smoke">{title}</h4>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#888]">{body}</p>
      </div>
    </div>
  );
}

export function DistributionTab() {
  const router = useRouter();
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 border-b border-[#262626] pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-[28px] font-bold leading-tight text-white-smoke">
            Distribute your music to Spotify, Apple Music, YouTube, and more
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#aaa]">
            As an Artist Pro subscriber, you get unlimited music distribution to all the major streaming platforms like Spotify, YouTube Music, Apple Music, TIDAL, and more all around the world.
          </p>
          <button type="button" onClick={() => router.push("/artistpro")} className="mt-4 rounded-full bg-white-smoke px-7 py-2.5 text-[14px] font-bold text-chinese-black hover:bg-[#eee] transition-colors">
            Get Artist Pro
          </button>
        </div>
        <div className="hidden lg:flex shrink-0">
          <div className="relative h-52 w-50">
            <img src="artists-icons/music-globe.svg" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-x-8 gap-y-6 border-b border-[#262626] pb-8 md:grid-cols-5 lg:grid-cols-9">
        <StreamingPlatformItem mark="Spotify"      className="font-bold" />
        <StreamingPlatformItem mark="Apple Music"  className="font-medium" />
        <StreamingPlatformItem mark="DEEZER"       className="font-semibold tracking-[1px]" />
        <StreamingPlatformItem mark="amazon music" className="font-semibold lowercase" />
        <StreamingPlatformItem mark="TikTok"       className="font-bold" />
        <StreamingPlatformItem mark="Instagram"    className="font-medium" />
        <StreamingPlatformItem mark="YouTube"      className="font-bold" />
        <StreamingPlatformItem mark="TIDAL"        className="font-semibold tracking-[2px]" />
        <StreamingPlatformItem mark="pandora"      className="font-semibold lowercase" />
      </div>

      <div className="mt-2 border-t border-[#262626] pt-8">
        <h3 className="mb-6 text-[18px] font-bold text-white-smoke">How it works</h3>
        <div className="grid gap-8 md:grid-cols-3">
          <DistributionHowItWorksStep num="1" title="Select your membership"    body="Choose the membership plan that works best for you. Get started with distribution for as little as $3.25 a month." />
          <DistributionHowItWorksStep num="2" title="Create your release"       body="We'll guide you through the simple steps to add credits and release information to make sure you get paid for your plays." />
          <DistributionHowItWorksStep num="3" title="We'll deliver your tracks" body="We'll double-check your release to help ensure it is successfully delivered to Spotify, Apple Music, TIDAL and so many more." />
        </div>
      </div>
    </div>
  );
}