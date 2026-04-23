import { useRef, useState } from "react";
import type { ArtistTrackRow } from "../ArtistStudioContent";
import { RiLockFill } from "react-icons/ri";

export function BulkEditPanel({ selectedIds, tracks, onClose }: {
  selectedIds: Set<string>;
  tracks: ArtistTrackRow[];
  onClose: () => void;
}) {
  const count = selectedIds.size;
  const [artworkSrc, setArtworkSrc]             = useState<string | null>(null);
  const [genre, setGenre]                       = useState("");
  const [tags, setTags]                         = useState("");
  const [privacy, setPrivacy]                   = useState<"dont-change" | "all-public" | "all-private">("dont-change");
  const [downloads, setDownloads]               = useState<"dont-change" | "all-on" | "all-off">("dont-change");
  const [allowComments, setAllowComments]       = useState(true);
  const [showComments, setShowComments]         = useState(true);
  const [showStats, setShowStats]               = useState(true);
  const [advancedOpen, setAdvancedOpen]         = useState(false);
  const artworkInputRef = useRef<HTMLInputElement | null>(null);

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArtworkSrc(URL.createObjectURL(file));
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${value ? "bg-[#1db954]" : "bg-[#444]"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 z-100 bg-black/40" onClick={onClose} />
      <div className="fixed right-0 top-0 z-110 flex h-full w-full max-w-150 flex-col bg-[#111] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="text-[#aaa] hover:text-white transition-colors text-[20px] leading-none cursor-pointer">✕</button>
            <h2 className="text-[15px] font-bold text-white">Edit {count} tracks</h2>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Artwork */}
          <div>
            <button
              type="button"
              onClick={() => artworkInputRef.current?.click()}
              className="flex h-55 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#333] bg-[#181818] hover:border-[#555] transition-colors cursor-pointer overflow-hidden"
            >
              {artworkSrc ? (
                <img src={artworkSrc} alt="New artwork" className="h-full w-full object-cover" />
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded border border-[#444] text-[#888]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-semibold text-white">Add new artwork</span>
                </>
              )}
            </button>
            <input ref={artworkInputRef} type="file" accept="image/*" className="hidden" onChange={handleArtworkChange} />
          </div>

          {/* Primary genre */}
          <div>
            <label className="mb-1 block text-[13px] font-semibold text-white">Primary genre</label>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-[#2a2a2a] bg-transparent px-4 py-3 text-[13px] text-[#666] hover:border-[#444] transition-colors cursor-pointer"
            >
              <span>{genre || "Add or search for a genre"}</span>
              <span>⌄</span>
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 flex items-center gap-1 text-[13px] font-semibold text-white">
              Tags <span className="ml-1 cursor-help text-[#888] text-[12px]">ⓘ</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add styles, moods, tempo."
              className="w-full rounded-lg border border-[#2a2a2a] bg-transparent px-4 py-3 text-[13px] text-white outline-none focus:border-[#444] transition-colors placeholder:text-[#666]"
            />
          </div>

          {/* Tracks privacy */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-white">Tracks privacy</p>
            <div className="flex items-center gap-0 rounded-lg border border-[#2a2a2a] overflow-hidden text-[12px] font-semibold">
              {([
                { key: "dont-change",  label: "Don't Change" },
                { key: "all-public",   label: "All Public"   },
                { key: "all-private",  label: "All Private"  },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPrivacy(key)}
                  className={`flex-1 py-2.5 transition-colors cursor-pointer ${
                    privacy === key ? "bg-white text-black" : "bg-transparent text-[#888] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced settings accordion */}
          <div className="rounded-lg border border-[#2a2a2a] overflow-hidden">
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            >
              <span className="text-[14px] font-semibold text-white">Advanced settings</span>
              <span className="text-[#888] text-[14px]">{advancedOpen ? "∧" : "∨"}</span>
            </button>
            {advancedOpen && (
              <div className="border-t border-[#2a2a2a] px-4 py-4 space-y-5">
                {/* Enable direct downloads */}
                <div>
                  <p className="text-[13px] font-semibold text-white mb-2">Enable direct downloads</p>
                  <div className="flex items-center gap-0 rounded-lg border border-[#2a2a2a] overflow-hidden text-[12px] font-semibold">
                    {([
                      { key: "dont-change", label: "Don't Change" },
                      { key: "all-on",      label: "All on"       },
                      { key: "all-off",     label: "All off"      },
                    ] as const).map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setDownloads(key)}
                        className={`flex-1 py-2 transition-colors cursor-pointer ${
                          downloads === key ? "bg-white text-black" : "bg-transparent text-[#888] hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Toggles */}
                {[
                  { label: "Allow people to comment on your track", value: allowComments, onChange: setAllowComments },
                  { label: "Show track comments to public",         value: showComments,  onChange: setShowComments  },
                  { label: "Show track stats to public",            value: showStats,     onChange: setShowStats     },
                ].map(({ label, value, onChange }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[13px] text-white">{label}</span>
                    <div className="flex items-center gap-2">
                      <RiLockFill className="text-[#555] text-[13px]" />
                      <Toggle value={value} onChange={onChange} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#2a2a2a] px-6 py-4">
          <button
            type="button"
            className="rounded-full bg-[#333] px-7 py-2.5 text-[13px] font-bold text-white hover:bg-[#444] transition-colors cursor-pointer"
          >
            Apply changes
          </button>
        </div>
      </div>
    </>
  );
}