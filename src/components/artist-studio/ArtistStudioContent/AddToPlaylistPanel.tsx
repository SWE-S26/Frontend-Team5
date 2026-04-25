export function AddToPlaylistPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-100 bg-chinese-black/40" onClick={onClose} />
      <div className="fixed right-0 top-0 z-110 flex h-full w-full max-w-150 flex-col bg-chinese-black shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[#2a2a2a] px-4 py-4 sm:px-6">
          <button type="button" onClick={onClose} className="text-[#888] hover:text-white-smoke transition-colors text-[18px] leading-none">✕</button>
          <h2 className="text-[16px] font-bold text-white-smoke">Add to playlist</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <button
            type="button"
            className="flex items-center gap-4 w-full rounded-xl border border-[#2a2a2a] bg-chinese-black p-4 hover:border-[#3a3a3a] transition-colors"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white-smoke bg-chinese-black text-white-smoke">
              <span className="text-[24px] font-thin leading-none">+</span>
            </div>
            <span className="text-[14px] font-semibold text-white-smoke">Create playlist</span>
          </button>
        </div>
      </div>
    </>
  );
}