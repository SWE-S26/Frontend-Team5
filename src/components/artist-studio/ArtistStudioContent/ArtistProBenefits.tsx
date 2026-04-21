function BenefitCard({ img, title, save, fallback }: { img: string; title: string; save: string; fallback: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-[#1a1a1a]">
      <div className="relative h-36 w-full bg-linear-to-br from-[#2b2b2b] via-[#1d1d1d] to-[#111] overflow-hidden">
        <img src={img} alt={title} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.opacity = "0"; }} />
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ clipPath: "polygon(0 0, 60% 0, 40% 100%, 0% 100%)", background: "rgba(0,0,0,0.7)" }} />
        <img src={fallback} className="pointer-events-none absolute bottom-10 left-0 text-[18px] font-bold text-white/85 z-20" onError={(e) => { e.currentTarget.style.opacity = "0"; }} />
      </div>
      <div className="p-3">
        <p className="text-[12px] font-semibold leading-tight text-white">{title}</p>
        <span className="mt-1 inline-block rounded bg-[#232323] px-2 py-0.5 text-[11px] font-bold text-[#f7c873]">{save}</span>
      </div>
    </div>
  );
}

export function ArtistProBenefits() {
  return (
    <div className="mt-8 rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-white">Artist Pro Membership Benefits</h3>
          <p className="mt-1 text-[13px] text-[#888]">
            Jump start your music career with Artist Pro and immediately unlock $100+ in premium music tools and services.
          </p>
        </div>
        <button type="button" className="shrink-0 rounded-full border border-white px-5 py-2 text-[13px] font-bold text-white hover:bg-white hover:text-black transition-colors">
          See all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <BenefitCard img="/artists-icons/man-headphones.svg" title="Get 2 free months of Splice Sounds+ royalty-free samples" save="Save $25.98" fallback="/artists-icons/splice.svg" />
        <BenefitCard img="/artists-icons/send-campaign.svg"  title="Get 20% off all campaigns on Groover.co and free hype add-on" save="Save $21" fallback="/artists-icons/groover.svg" />
        <BenefitCard img="/artists-icons/dg-set.svg"         title="Get 1 month free of Native Instrument's 360 Pro suite" save="Save $50" fallback="/artists-icons/NI.svg" />
        <BenefitCard img="/artists-icons/edit-tracks.svg"    title="Get 3 free months of Output's Arcade plug-in and samples" save="Save $39" fallback="/artists-icons/arcade.svg" />
      </div>
    </div>
  );
}