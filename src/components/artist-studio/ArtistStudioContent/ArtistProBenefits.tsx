function BenefitCard({
  img,
  title,
  save,
  fallback,
}: {
  img: string;
  title: string;
  save: string;
  fallback: string;
}) {
  return (
    <div className="group overflow-hidden rounded-lg bg-chinese-black cursor-pointer">
      <div className="relative h-36 w-full overflow-hidden bg-linear-to-br from-[#2b2b2b] via-[#1d1d1d] to-[#111]">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-127"
          onError={(e) => {
            e.currentTarget.style.opacity = "0";
          }}
        />

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            clipPath: "polygon(0 0, 60% 0, 40% 120%, 0% 120%)",
            background: "rgba(0,0,0,0.7)",
          }}
        />

        <img
          src={fallback}
          className="pointer-events-none absolute bottom-10 left-0 z-20 text-[18px] font-bold text-white-smoke/85"
          onError={(e) => {
            e.currentTarget.style.opacity = "0";
          }}
        />
      </div>

      <div className="p-3 flex flex-col gap-2">
        <p className="text-[15px] font-bold leading-tight text-white-smoke line-clamp-2">
          {title}
        </p>
        <div className="flex flex-row gap-2">
          <span className="shrink-0 rounded-full bg-green-500 px-3 py-1 text-[11px] font-bold text-chinese-black shadow-md transition-all hover:bg-green-400 hover:scale-105">
            {save}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ArtistProBenefits() {
  return (
    <div className="mt-8 rounded-lg border border-[#2a2a2a] bg-chinese-black p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <h3 className="text-[16px] font-bold text-white-smoke">Artist Pro Membership Benefits</h3>
          <p className="mt-1 text-[13px] text-[#888]">
            Jump start your music career with Artist Pro and immediately unlock $100+ in premium music tools and services.
          </p>
        </div>
        <button type="button" className="w-full shrink-0 rounded-full border border-white px-5 py-2 text-[13px] font-bold text-white-smoke hover:bg-white hover:text-black transition-colors sm:w-auto">
          See all
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <BenefitCard img="/artists-icons/man-headphones.svg" title="Get 2 free months of Splice Sounds+ royalty-free samples" save="Save $25.98" fallback="/artists-icons/splice.svg" />
        <BenefitCard img="/artists-icons/send-campaign.svg"  title="Get 20% off all campaigns on Groover.co and free hype add-on" save="Save $21" fallback="/artists-icons/groover.svg" />
        <BenefitCard img="/artists-icons/dg-set.svg"         title="Get 1 month free of Native Instrument's 360 Pro suite" save="Save $50" fallback="/artists-icons/NI.svg" />
        <BenefitCard img="/artists-icons/edit-tracks.svg"    title="Get 3 free months of Output's Arcade plug-in and samples" save="Save $39" fallback="/artists-icons/arcade.svg" />
      </div>
    </div>
  );
}