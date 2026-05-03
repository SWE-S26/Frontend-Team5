"use client";
import { useEffect, useState } from "react";

import { IoIosMore, IoMdPlay, IoMdPause } from "react-icons/io";
import { RiPlayListAddLine } from "react-icons/ri";
import { HiHeart } from "react-icons/hi";
import { ListStart } from "lucide-react";

import MoreDropdown from "./MoreDropdown";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { play, pause, playAudio, playNext } from "@/store/slices/playerSlice";

import { useLikeTrackOptimistic } from "@/hooks/useLikes";

import { Track } from "@/store/slices/playerSlice";
import { interactionToast } from "@/lib/interactive-toasts/interactiveToast";
import { createPortal } from "react-dom";

type CardProps = {
  img?: string;
  title?: string;
  artist?: string;
  trackId?: string;
  trackUrl?: string;
  duration?: number;
  isLikedByUser?: boolean;
  appearance?: "interactive" | "static";
  allTracks?: Track[];
};

export default function TrackCard({
  img,
  title,
  artist,
  trackId,
  trackUrl,
  duration,
  isLikedByUser = false,
  appearance = "interactive",
  allTracks,
}: CardProps) {
  const { likeTrack } = useLikeTrackOptimistic(trackId ?? "");
  const [isLiked, setIsLiked] = useState<boolean>(isLikedByUser);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);

  const dispatch = useDispatch();

  const { currentTrackId, isPlaying } = useSelector((state: RootState) => state.player);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handler = () => setIsMoreOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isMoreOpen]);

  const isThisCardPlaying = currentTrackId === trackId && isPlaying;
  const trackHref = trackId ? `/track/${trackId}` : "#";

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!trackId || !trackUrl) return;
    if (isThisCardPlaying) {
      dispatch(pause());
      return;
    }
    dispatch(
      playAudio({
        tracks: allTracks?.length
          ? allTracks
          : [{ id: trackId, url: trackUrl, title, artist, img, duration }],
        startId: trackId,
      })
    );
    setTimeout(() => {
      dispatch(play());
    }, 0);
  }

  function handleLikeClick(e: React.MouseEvent) {
    e.stopPropagation();
    likeTrack();
    setIsLiked((l) => !l);
    if (!isLiked) {
      interactionToast.liked(title ?? "track", img ?? "");
    }
  }

  function handlePlayNextClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!trackId || !trackUrl) return;
    interactionToast.queued(title ?? "track", img ?? "");
    dispatch(
      playNext({
        tracks: {
          id: trackId,
          url: trackUrl,
          title,
          artist,
          img,
          duration,
        },
      })
    );
  }

  return (
    <>
      {appearance === "interactive" ? (
        <div className="flex flex-col max-w-40">
          <div className="relative w-40 aspect-square rounded group cursor-pointer bg-off-black m-1 mb-1.75">
            <div className="absolute inset-0 rounded overflow-hidden">
              <div
                className={`absolute inset-0 rounded overflow-hidden ${
                  !img ? "bg-linear-to-br from-off-black to-crusta/70" : ""
                }`}
              ></div>

              {img && (
                <a
                  href={`/track/${trackId}`}
                  className="absolute inset-0 bg-cover bg-center overflow-hidden rounded opacity-100 animate-fade-in"
                  style={{ backgroundImage: `url(${img})` }}
                />
              )}

              {img && (
                <div className="absolute inset-0 transition-all duration-200 bg-white/50 pointer-events-none opacity-0 group-hover:opacity-100" />
              )}
            </div>

            {img && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white-smoke rounded-full z-10 opacity-0 group/play group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                {!isThisCardPlaying ? (
                  <IoMdPlay
                    className="text-chinese-black text-[38px] ml-1.5 group-hover/play:opacity-50"
                    onClick={handlePlayClick}
                  />
                ) : (
                  <IoMdPause
                    className="text-chinese-black text-[38px] group-hover/play:opacity-50"
                    onClick={handlePlayClick}
                  />
                )}
              </div>
            )}

            {img && (
              <div className="absolute bottom-3.25 right-[48.5px] z-30 group/tooltip flex flex-col items-center w-10">
                <HiHeart
                  className={
                    "text-[16px] font-bold opacity-0 group-hover:opacity-100 group-hover/tooltip:opacity-50 transition-all duration-200" +
                    (isLiked ? " text-inferno" : " text-chinese-black")
                  }
                  onClick={handleLikeClick}
                />
                <div className="absolute top-full mt-2 px-2 py-1 bg-off-black text-white-smoke text-[11px] rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  Like
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-off-black" />
                </div>
              </div>
            )}

            {img && (
              <div
                className="absolute bottom-1.25 right-2.25 z-30"
                onClick={() => setIsMoreOpen((o) => !o)}
              >
                <MoreDropdown
                  trigger={
                    <div className="group/tooltip flex flex-col items-center w-10 cursor-pointer">
                      <IoIosMore
                        className={`text-[20px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                          isMoreOpen ? "text-inferno" : "text-chinese-black"
                        }`}
                      />
                    </div>
                  }
                  tooltipLabel="More"
                  items={[
                    {
                      label: "Add to Next up",
                      icon: <ListStart size={19} className="scale-x-[-1]" />,
                      onClick: (e) => handlePlayNextClick(e),
                    },
                    {
                      label: "Add to Playlist",
                      icon: <RiPlayListAddLine className="text-lg scale-x-[-1] scale-y-[-1]" />,
                      onClick: () => setIsAddToPlaylistOpen(true),
                    },
                  ]}
                />
              </div>
            )}
          </div>

          <a
            href={trackHref}
            className="block text-white-smoke no-underline hover:text-gray-300 text-[14px] font-bold tracking-tight pl-1 animate-fade-in truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {title}
          </a>

          <a
            href={trackHref}
            className="block text-silver text-[14px] font-bold pl-1 animate-fade-i truncate no-underline hover:text-white-smoke transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {artist}
          </a>
        </div>
      ) : (
        <div className="relative w-40 aspect-square rounded group cursor-pointer bg-off-black m-1 mb-1.75">
          {img && (
            <a
              href={`/track/${trackId}`}
              className="absolute inset-0 bg-cover bg-center overflow-hidden rounded opacity-100 animate-fade-in"
              style={{ backgroundImage: `url(${img})` }}
            />
          )}
        </div>
      )}

      {isAddToPlaylistOpen &&
        createPortal(
          <AddToPlaylistModal
            isOpen={isAddToPlaylistOpen}
            onClose={() => setIsAddToPlaylistOpen(false)}
            trackId={trackId ?? ""}
            trackTitle={title}
            artistName={artist}
            trackImage={img}
          />,
          document.body
        )}
    </>
  );
}
