import { useRouter } from "next/navigation";

function VinylPricingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 sm:gap-16">
      <span className="text-[14px] font-semibold text-white-smoke">{label}</span>
      <span className="text-[16px] font-black text-white-smoke">{value}</span>
    </div>
  );
}

function VinylHowItWorksStep({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <span className="shrink-0 text-[44px] font-black leading-none text-white-smoke sm:text-[60px]">{num}</span>
      <div className="pt-1.5 sm:pt-3">
        <h4 className="text-[15px] font-bold text-white-smoke">{title}</h4>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#888]">{body}</p>
      </div>
    </div>
  );
}

export function VinylTab({ isArtistPro }: { isArtistPro: boolean }) {
  const router = useRouter();
  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-6 border-b border-[#262626] pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-chinese-black px-2 py-0.5 text-[10px] font-bold text-yellow-400">★ ARTIST PRO</span>
          </div>
          <h2 className="text-[24px] font-bold leading-tight text-white-smoke sm:text-[28px]">Your music. On vinyl. On demand</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#aaa]">
            We're partnering with elasticStage to{" "}
            <span className="font-semibold text-white-smoke">release your albums on vinyl, on-demand, with no up-front cost to you.</span>
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#aaa]">
            You and your fans can purchase just one record or a thousand. Either way, you get paid for every sale.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            {!isArtistPro && (
              <button
                type="button"
                onClick={() => router.push("/artistpro")}
                className="rounded-full bg-white px-7 py-2.5 text-[14px] font-bold text-black hover:bg-[#eee] transition-colors"
              >
                Get Artist Pro
              </button>
            )}
            <button type="button" className="rounded-full border border-[#444] bg-transparent px-7 py-2.5 text-[14px] font-bold text-white-smoke hover:border-[#666] transition-colors">Learn More</button>
          </div>
        </div>
        <div className="hidden lg:flex shrink-0 items-center justify-center">
          <div className="relative h-64 w-80">
            <img src="artists-icons/record.png" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-[#262626] pt-8 sm:mt-10">
        <h3 className="mb-5 text-[18px] font-bold text-white-smoke">No upfront cost to you</h3>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex items-start gap-5">
            <span className="shrink-0 text-[68px] font-black leading-none text-transparent [-webkit-text-stroke:2px_#8c8c8c] sm:text-[92px]">$0</span>
            <div>
              <p className="text-[16px] font-bold text-white-smoke">You pay nothing to create a record.</p>
              <p className="mt-1 text-[13px] text-[#888]">Your fans pay for every purchase, and we pass the royalties on to you.</p>
            </div>
          </div>
          <div className="shrink-0 space-y-2">
            <VinylPricingRow label="Your upfront cost"   value="$0" />
            <VinylPricingRow label="Sales price for fan" value="$39*" />
            <VinylPricingRow label="Royalties you earn"  value="$11*" />
            <p className="pt-1 text-[11px] text-[#666]">*Prices vary slightly due to currency conversions.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[#262626] pt-8">
        <h3 className="mb-6 text-[18px] font-bold text-white-smoke">How it works</h3>
        <div className="grid gap-8 md:grid-cols-3">
          <VinylHowItWorksStep num="1" title="Create your new record from your tracks."      body="Just pick your tracks on SoundCloud, add credits, upload artwork, and submit your new record for review." />
          <VinylHowItWorksStep num="2" title="We create a web page and list your record for sale." body="No need to worry about out-of-pocket fees or leftover stock. Each album will cost your fans around $39 plus shipping and handling." />
          <VinylHowItWorksStep num="3" title="We print and ship your record. You get paid." body="Records are shipped to fans within weeks of their order. And every record sold means you get paid." />
        </div>
      </div>
    </div>
  );
}