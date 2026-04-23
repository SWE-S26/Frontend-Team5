import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { pause, play, playAudio } from "@/store/slices/playerSlice";
import { IoHeartOutline, IoPauseCircleSharp } from "react-icons/io5";
import { IoIosPlayCircle } from "react-icons/io"
import { FiMessageSquare } from "react-icons/fi";
import { TbRepeat } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { Checkbox, type ArtistTrackRow } from "../ArtistStudioContent";
import { MdOutlineDownloadForOffline } from "react-icons/md";


export function TrackRow({
  track,
  isMobile,
  isSelected,
  onSelect,
  onAmplify,
  onContextMenu,
}: {
  track: ArtistTrackRow;
  isMobile: boolean;
  isSelected: boolean;
  onSelect: (id: string, v: boolean) => void;
  onAmplify: (id: string) => void;
  onContextMenu: (id: string, e: React.MouseEvent) => void;
}) {
  const dispatch = useDispatch();
  const { currentTrackId, isPlaying } = useAppSelector((state: RootState) => state.player);
  const [isHovered, setIsHovered] = useState(false);
  const rowIsPlaying = String(currentTrackId) === String(track.id) && isPlaying;

  const togglePlay = () => {
    if (!track.url) return;
    if (rowIsPlaying) { dispatch(pause()); return; }
    dispatch(playAudio({
      tracks: [{ id: track.id, url: track.url, title: track.title, artist: track.label, img: track.cover }],
      startId: track.id,
    }));
    setTimeout(() => dispatch(play()), 0);
  };

  const trackCover = (
    <button
      type="button"
      onClick={togglePlay}
      className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-[#222] cursor-pointer"
      aria-label={rowIsPlaying ? "Pause track" : "Play track"}
    >
      <img
        src={track.cover}
        alt={track.title}
        className="h-full w-full object-cover"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.endsWith("/test.jpg")) return;
          target.src = "/test.jpg";
        }}
      />
      {(isHovered || rowIsPlaying) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          {rowIsPlaying
            ? <IoPauseCircleSharp className="text-white text-[32px]" />
            : <IoIosPlayCircle    className="text-white text-[32px]" />
          }
        </div>
      )}
    </button>
  );

  const trackMeta = (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="truncate text-[13px] font-medium text-white">{track.title}</span>
        {track.hd && <span className="shrink-0 rounded bg-[#555] px-1 py-px text-[9px] font-bold text-white">HD</span>}
      </div>
      <p className="text-[11px] text-[#888]">{track.label}</p>
    </div>
  );

  const rowBg = isSelected
    ? "bg-[#1d1d2e]"
    : isHovered || rowIsPlaying
    ? "bg-[#1a1a1a]"
    : "bg-transparent";

  if (isMobile) {
    return (
      <div
        className={`border-b border-[#1e1e1e] px-3 py-2.5 ${rowBg}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          {trackCover}
          <div className="flex-1 min-w-0">{trackMeta}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid items-center border-b border-[#1e1e1e] px-3 py-2 transition-colors ${rowBg}`}
      style={{ gridTemplateColumns: "32px 1fr 80px 120px 220px 80px 130px 30px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <Checkbox checked={isSelected} onChange={(v) => onSelect(track.id, v)} />
      </div>

      <div className="flex min-w-0 items-center gap-3">
        {trackCover}
        {trackMeta}
      </div>

      <div className="text-center text-[12px] text-[#aaa]">{track.duration}</div>
      <div className="text-center text-[12px] text-[#aaa]">{track.date}</div>

      <div className="flex items-center justify-center gap-3 text-[11px] text-[#777]">
        <span className="inline-flex items-center gap-1"><IoHeartOutline />   {track.likes    > 0 ? track.likes    : "-"}</span>
        <span className="inline-flex items-center gap-1"><FiMessageSquare /> {track.comments > 0 ? track.comments : "-"}</span>
        <span className="inline-flex items-center gap-1"><TbRepeat />        {track.reposts  > 0 ? track.reposts  : "-"}</span>
        <span className="inline-flex items-center gap-1"><MdOutlineDownloadForOffline />      -</span>
      </div>

      <div className="text-right text-[13px] font-semibold text-[#aaa]">{track.plays}</div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onAmplify(track.id)}
          className="flex items-center gap-1 rounded-full bg-linear-to-br from-[#7b4fff] to-[#5533ff] px-3 py-1 text-[11px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          <BsLightningChargeFill /> Amplify
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={(e) => onContextMenu(track.id, e)}
          className="text-[18px] text-[#666] hover:text-[#aaa] transition-colors"
          aria-label="Track actions"
        >
          ⋮
        </button>
      </div>
    </div>
  );
}