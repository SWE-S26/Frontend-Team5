export function AmplifyModal({ onClose, onUnlock }: { onClose: () => void; onUnlock: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-2xl rounded-2xl bg-[#111] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a2a] text-[#aaa] hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1">
            <h2 className="text-[26px] font-black leading-tight text-white">
              Reach more listeners with Artist Pro
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#aaa]">
              In order to be eligible, you must have an Artist or Artist Pro subscription.
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#aaa]">
              With an Artist Pro subscription you can have this track analyzed and recommended to reach{" "}
              <span className="font-bold text-white">100+ plays by listeners on BeatZa.</span>
            </p>

            <div className="mt-5 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4">
              <p className="mb-3 text-[13px] font-bold text-white">Upgrade to Artist Pro to get:</p>
              <ul className="space-y-2.5">
                {["Unlimited track recommendations", "Unlimited uploads + replace tracks", "Unlimited track distribution"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-[#ccc]">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7b4fff]">
                      <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                        <path d="M1 3L3 5.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={onUnlock}
                className="rounded-full bg-[#7b4fff] px-6 py-2.5 text-[14px] font-bold text-white hover:bg-[#6a3eee] transition-colors"
              >
                Unlock with Artist Pro
              </button>
              <button type="button" onClick={onClose} className="text-[14px] text-[#888] hover:text-white transition-colors">
                Maybe later
              </button>
            </div>
          </div>

          <div className="hidden lg:flex shrink-0 items-center justify-center">
            <div className="relative h-48 w-48">
              <img src="artists-icons/wavespeaker.svg" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}