"use client";

import { useEffect, useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { BsPersonCheckFill } from "react-icons/bs";
import { IoIosHeart, IoMdPlay, IoMdPause } from "react-icons/io";
import { MdPersonAddAlt1 } from "react-icons/md";
import { GripVertical } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearQueue, play, playAudio, reorderQueue, type Track } from "@/store/slices/playerSlice";
import { useLikeTrackOptimistic, useLikeStatus } from "@/hooks/useLikes";
import { setTrackLiked } from "@/store/slices/playerSlice";

type PlayerNextUpProps = {
  hasTrackInfo?: boolean;
};

const slideRightAnimation = `
  @keyframes slideRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(60px);
      opacity: 1;
    }
  }
`;

function formatDuration(seconds?: number) {
  const totalSeconds = Math.max(0, Math.floor(seconds ?? 0));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function QueueItem({
  track,
  index,
  isCurrent,
  queue,
  onPlay,
}: {
  track: Track;
  index: number;
  isCurrent: boolean;
  queue: Track[];
  onPlay: (trackId: string) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={track}
      dragListener={false}
      dragControls={dragControls}
      className="list-none"
      whileDrag={{
        scale: 1.01,
        zIndex: 20,
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
      }}
      transition={{ type: "spring", stiffness: 450, damping: 34 }}
    >
      <div
        className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
          isCurrent
            ? "border-white-smoke/20 bg-white-smoke/10"
            : "border-transparent bg-white-smoke/3 hover:bg-white-smoke/8"
        }`}
      >
        <button
          type="button"
          aria-label={`Drag ${track.title ?? "track"} to reorder`}
          onPointerDown={(event) => dragControls.start(event)}
          className="flex h-10 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-silver opacity-60 transition hover:text-white-smoke hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="group/play relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-off-black">
          {track.img ? (
            <img src={track.img} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-off-black to-crusta/70" />
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(track.id);
            }}
            className="absolute inset-0 flex items-center justify-center bg-chinese-black/40 opacity-0 transition-opacity group-hover/play:opacity-100"
          >
            {isCurrent ? (
              <IoMdPause className="text-chinese-black text-lg" />
            ) : (
              <IoMdPlay className="ml-0.5 text-chinese-black text-lg" />
            )}
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white-smoke">
            {track.title ?? "Unknown track"}
          </p>
          <p className="truncate text-xs text-silver">
            {track.artist ?? "Unknown artist"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isCurrent && (
            <span className="rounded-full bg-white-smoke/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white-smoke">
              Now playing
            </span>
          )}
          <span className="text-xs text-silver">
            {formatDuration(track.duration)}
          </span>
          <span className="min-w-4 text-right text-[11px] text-silver/70">
            {index + 1}
          </span>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function PlayerNextUp({
  hasTrackInfo = false,
}: PlayerNextUpProps) {
  const dispatch = useAppDispatch();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [added, setAdded] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const queue = useAppSelector((state) => state.player.tracks);
  const currentTrackId = useAppSelector((state) => state.player.currentTrackId);

  // Like — synced with current track
  const { isCurrentTrackLiked: isLiked, currentTrackLikeCount } = useAppSelector(
    (state) => state.player
  );
  const { likeTrack, loading: likeLoading } = useLikeTrackOptimistic(currentTrackId ?? "");


  const handleLike = async () => {
    if (!currentTrackId || likeLoading) return;
    try {
      await likeTrack();
      const nextLiked = !isLiked;
      dispatch(setTrackLiked({
        liked: nextLiked,
        likeCount: nextLiked ? currentTrackLikeCount + 1 : currentTrackLikeCount - 1,
      }));
      if (nextLiked) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 6000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  function handlePlayTrack(trackId: string) {
    dispatch(playAudio({ tracks: queue, startId: trackId }));
    setTimeout(() => dispatch(play()), 0);
    setIsQueueOpen(false);
  }

  useEffect(() => {
    if (!isQueueOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (panelRef.current?.contains(event.target as Node)) return;
      setIsQueueOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsQueueOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isQueueOpen]);

  function handleQueueReorder(nextQueue: Track[]) {
    if (nextQueue.length !== queue.length) return;

    const movedTrack = nextQueue.find(
      (track, index) => queue[index]?.id !== track.id,
    );
    if (!movedTrack) return;

    const from = queue.findIndex((track) => track.id === movedTrack.id);
    const to = nextQueue.findIndex((track) => track.id === movedTrack.id);

    if (from === -1 || to === -1 || from === to) return;

    dispatch(reorderQueue({ from, to }));
  }

  function handleClearQueue() {
    if (queue.length <= 1) return;
    dispatch(clearQueue());
  }

  return (
    <div
      ref={panelRef}
      className="relative flex shrink-0 items-center gap-4 text-white-smoke"
      style={
        hasTrackInfo
          ? {
              animation: "slideRight 0.3s ease-out forwards",
            }
          : {}
      }
    >
      <style>{slideRightAnimation}</style>

      <button
        onClick={handleLike}
        disabled={likeLoading || !currentTrackId}
        className={`${isLiked ? "text-anger" : "text-white-smoke"} cursor-pointer hover:text-silver disabled:opacity-40 disabled:cursor-not-allowed transition`}
      >
        <IoIosHeart size={16} />
      </button>

      <button
        onClick={() => setAdded(!added)}
        className="relative group cursor-pointer hover:text-silver"
      >
        {added ? (
          <BsPersonCheckFill className="h-5 w-5 fill-current text-anger" />
        ) : (
          <MdPersonAddAlt1 className="h-5 w-5 fill-current" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setIsQueueOpen((open) => !open)}
        aria-haspopup="dialog"
        aria-expanded={isQueueOpen}
        className="relative group cursor-pointer hover:text-silver"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-1 -1 26 26"
          className="h-4 w-3 fill-current stroke-current font-bold"
        >
          <polygon points="2,2 2,10 8,6" />
          <line
            x1="11"
            y1="6"
            x2="24"
            y2="6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="14"
            x2="24"
            y2="14"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="20"
            x2="24"
            y2="20"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap border border-gray-400 bg-[#f3f3f3] px-2 py-0.5 text-xs text-chinese-black opacity-0 transition-opacity duration-150 group-hover:opacity-100 pointer-events-none z-50">
          Next Up
        </span>
        {queue.length > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-anger px-1 text-[10px] font-bold text-white-smoke">
            {queue.length}
          </span>
        )}
      </button>

      {isQueueOpen && (
        <div className="absolute bottom-[calc(100%+0.75rem)] right-0 z-50 w-[min(92vw,25rem)] overflow-hidden rounded-2xl border border-white-smoke/10 bg-chinese-black shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-start justify-between gap-4 border-b border-white-smoke/10 px-4 py-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-silver">
                Play Queue
              </p>
              <p className="mt-1 text-sm text-silver">
                {queue.length} track{queue.length === 1 ? "" : "s"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearQueue}
              disabled={queue.length <= 1}
              className="rounded-full border border-white-smoke/10 px-3 py-1 text-xs font-bold text-white-smoke transition hover:bg-white-smoke/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>

          <div className="max-h-[55vh] overflow-y-auto px-2 py-2">
            {queue.length > 0 ? (
              <Reorder.Group
                axis="y"
                values={queue}
                onReorder={handleQueueReorder}
                className="space-y-1"
              >
                {queue.map((track, index) => (
                  <QueueItem
                    key={track.id}
                    track={track}
                    index={index}
                    isCurrent={track.id === currentTrackId}
                    queue={queue}
                    onPlay={handlePlayTrack}
                  />
                ))}
              </Reorder.Group>
            ) : (
              <div className="py-10 text-center text-sm text-silver">
                Your queue is empty.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
