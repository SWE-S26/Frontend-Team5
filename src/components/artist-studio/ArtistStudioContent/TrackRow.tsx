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
import { type ArtistTrackRow } from "../ArtistStudioContent";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { PrettyCheckbox } from "@/components/upload/TrackInfoForm";

export function TrackRow({
  track,
  isMobile,
  isArtistPro,
  isSelected,
  onSelect,
  onAmplify,
  onContextMenu,
  isDeleting,
}: {
  track: ArtistTrackRow;
  isMobile: boolean;
  isArtistPro: boolean;
  isSelected: boolean;
  onSelect: (id: string, v: boolean) => void;
  onAmplify: (id: string) => void;
  onContextMenu: (id: string, e: React.MouseEvent) => void;
  isDeleting: boolean;
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
      data-testid={`artist-track-row-play-${track.id}`}
      className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-chinese-black cursor-pointer"
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
        <div className="absolute inset-0 flex items-center justify-center bg-chinese-black/50">
          {rowIsPlaying
            ? <IoPauseCircleSharp className="text-white-smoke text-[32px]" />
            : <IoIosPlayCircle    className="text-white-smoke text-[32px]" />
          }
        </div>
      )}
    </button>
  );

  const trackMeta = (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="truncate text-[13px] font-medium text-white-smoke">{track.title}</span>
        {track.hd && <span className="shrink-0 rounded bg-[#555] px-1 py-px text-[9px] font-bold text-white-smoke">HD</span>}
      </div>
      <p className="text-[11px] text-white-smoke">{track.label}</p>
    </div>
  );

  const rowBg = isSelected
    ? "bg-upload-select"
    : isHovered || rowIsPlaying
    ? "bg-upload-select"
    : "bg-transparent";

  if (isMobile) {
    return (
      <div
        className={`border-b border-[#1e1e1e] px-3 py-2.5 ${rowBg}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2.5">
          <PrettyCheckbox checked={isSelected} onChange={(v) => onSelect(track.id, v)} />
          {trackCover}
          <div className="min-w-0 flex-1">{trackMeta}</div>
          <button
            type="button"
            onClick={(e) => onContextMenu(track.id, e)}
            data-testid={`artist-track-row-menu-${track.id}`}
            className="text-[18px] text-[#666] hover:text-[#aaa] transition-colors cursor-pointer"
            aria-label="Track actions"
          >
            ⋮
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-white-smoke">
          <span className="inline-flex items-center gap-1"><FaRegClock /> {track.duration}</span>
          <span>{track.date}</span>
          <span className="inline-flex items-center gap-1"><IoHeartOutline /> {track.likes > 0 ? track.likes : "-"}</span>
          <span className="inline-flex items-center gap-1"><FiMessageSquare /> {track.comments > 0 ? track.comments : "-"}</span>
          <span className="inline-flex items-center gap-1"><TbRepeat /> {track.reposts > 0 ? track.reposts : "-"}</span>
          {isArtistPro && <span className="inline-flex items-center gap-1"><MdOutlineDownloadForOffline /> 0</span>}
          <span className="font-semibold">{track.plays} plays</span>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onAmplify(track.id)}
            data-testid={`artist-track-row-amplify-${track.id}`}
            className="inline-flex items-center gap-1 rounded-full bg-linear-to-br from-[#7b4fff] to-[#5533ff] px-3 py-1 text-[11px] font-bold text-white-smoke"
          >
            <BsLightningChargeFill /> Amplify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid min-w-175 items-center border-b border-[#1e1e1e] px-3 py-2 transition-colors ${rowBg}`}
      style={{ gridTemplateColumns: "32px 1fr 80px 120px 220px 80px 130px 30px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <PrettyCheckbox checked={isSelected} onChange={(v) => onSelect(track.id, v)} />
      </div>

      <div className="flex min-w-0 items-center gap-3">
        {trackCover}
        {trackMeta}
      </div>

      <div className="text-center text-[12px] text-white-smoke">{track.duration}</div>
      <div className="text-center text-[12px] text-white-smoke">{track.date}</div>

      <div className="flex items-center justify-center gap-3 text-[11px] text-white-smoke">
        <span className="inline-flex items-center gap-1"><IoHeartOutline />   {track.likes    > 0 ? track.likes    : "-"}</span>
        <span className="inline-flex items-center gap-1"><FiMessageSquare /> {track.comments > 0 ? track.comments : "-"}</span>
        <span className="inline-flex items-center gap-1"><TbRepeat />        {track.reposts  > 0 ? track.reposts  : "-"}</span>
        {isArtistPro && <span className="inline-flex items-center gap-1"><MdOutlineDownloadForOffline /> 0</span>}
      </div>

      <div className="text-center text-[13px] font-semibold text-white-smoke">{track.plays}</div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onAmplify(track.id)}
          data-testid={`artist-track-row-amplify-${track.id}`}
          className="flex items-center gap-1 rounded-full bg-linear-to-br from-[#7b4fff] to-[#5533ff] px-3 py-1 text-[11px] font-bold text-white-smoke hover:opacity-90 transition-opacity cursor-pointer"
        >
          <BsLightningChargeFill /> Amplify
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={(e) => onContextMenu(track.id, e)}
          data-testid={`artist-track-row-menu-${track.id}`}
          className="text-[18px] text-[#666] hover:text-[#aaa] transition-colors cursor-pointer"
          aria-label="Track actions"
        >
          ⋮
        </button>
      </div>
    </div>
  );
}