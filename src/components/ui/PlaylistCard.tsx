"use client";

import { IoMdPlay, IoMdPause, IoIosMore } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { play, pause, playAudio, playNext } from "@/store/slices/playerSlice";
import { useGetPlaylistById } from "@/hooks/usePlaylists";
import { useState } from "react";
import { useLikePlaylistOptimistic } from "@/hooks/useLikes";
import { HiHeart } from "react-icons/hi";
import { RiPlayListAddLine } from "react-icons/ri";
import { ListStart } from "lucide-react";
import MoreDropdown from "./MoreDropdown";

type Props = {
  img?: string;
  title?: string;
  artist?: string;
  playlistId?: string;
  isLikedByUser?: boolean;
  appearance?: "interactive" | "static";
  tracks?: {
    id: string;
    url: string;
    title?: string;
    artist?: string;
    img?: string;
    duration?: number;
  }[];
};

export default function PlaylistCard({
  img,
  title,
  artist,
  playlistId,
  isLikedByUser = false,
  appearance = "interactive",
}: Props) {
  const dispatch = useDispatch();
  const { currentTrackId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );
  const { getPlaylistById } = useGetPlaylistById();

  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { likePlaylist } = useLikePlaylistOptimistic(playlistId ?? "");

  const [cachedTracks, setCachedTracks] = useState<
    {
      id: string;
      url: string;
      title?: string;
      artist?: string;
      img?: string;
      duration?: number;
    }[]
  >([]);

  const isThisPlaying =
    isPlaying &&
    cachedTracks.length > 0 &&
    cachedTracks.some((t) => t.id === currentTrackId);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playlistId) return;

    likePlaylist();
    setIsLiked(!isLiked);
  };

  const handlePlayNextClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playlistId) return;

    let tracks = cachedTracks;

    if (!tracks.length) {
      const res = await getPlaylistById(playlistId);
      const playlist = res?.data?.playlist;
      const detail = Array.isArray(playlist) ? playlist[0] : playlist;
      if (!detail?.tracks?.length) return;

      tracks = detail.tracks.map((t: any) => ({
        id: t._id,
        url: t.audio.audioLink,
        title: t.basicInfo.title,
        artist: t.basicInfo.mainArtists[0],
        img: t.image.imgLink,
        duration: t.durationInSeconds,
      }));
      setCachedTracks(tracks);
    }

    dispatch(playNext({ tracks }));
  };

  async function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!playlistId) return;

    if (isThisPlaying) {
      dispatch(pause());
      return;
    }

    let tracks = cachedTracks;

    if (!tracks.length) {
      const res = await getPlaylistById(playlistId);
      const playlist = res?.data?.playlist;
      const detail = Array.isArray(playlist) ? playlist[0] : playlist;
      if (!detail?.tracks?.length) return;

      tracks = detail.tracks.map((t: any) => ({
        id: t._id,
        url: t.audio.audioLink,
        title: t.basicInfo.title,
        artist: t.basicInfo.mainArtists[0],
        img: t.image.imgLink,
        duration: t.durationInSeconds,
      }));

      setCachedTracks(tracks);
    }

    dispatch(playAudio({ tracks, startId: tracks[0].id }));
    setTimeout(() => dispatch(play()), 0);
  }

  return (
    <>
      {appearance === "interactive" ? (
        <div className="flex flex-col max-w-40">
          <div className="relative w-40 aspect-square rounded group cursor-pointer bg-off-black m-1 mb-1.75">
            <div className="absolute inset-0 rounded overflow-hidden">
              <div
                className={`absolute inset-0 rounded overflow-hidden ${
                  !img ? "bg-gradient-to-br from-off-black to-crusta/70" : ""
                }`}
              ></div>

              {img && (
                <div
                  className="absolute inset-0 bg-cover bg-center overflow-hidden rounded opacity-100 animate-fade-in"
                  style={{ backgroundImage: `url(${img})` }}
                />
              )}

              {img && (
                <div className="absolute inset-0 transition-all duration-200 bg-white/50 opacity-0 group-hover:opacity-100" />
              )}
            </div>

            {/* Play Button */}
            {img && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white-smoke rounded-full z-10 opacity-0 group/play group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                {!isThisPlaying ? (
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

            {/* Like Button */}
            {img && (
              <div className="absolute bottom-3.25 right-[48.5px] z-30 group/tooltip flex flex-col items-center w-10">
                <HiHeart
                  className={`text-[16px] font-bold opacity-0 group-hover:opacity-100 group-hover/tooltip:opacity-50 transition-all duration-200 cursor-pointer ${
                    isLiked ? "text-inferno" : "text-chinese-black"
                  }`}
                  onClick={handleLikeClick}
                />

                <div className="absolute top-full mt-2 px-2 py-1 bg-off-black text-white-smoke text-[11px] rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {isLiked ? "Unlike" : "Like"}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-off-black" />
                </div>
              </div>
            )}

            {/* More Button */}
            {img && (
              <div
                className="absolute bottom-1.25 right-2.25 z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMoreOpen((o) => !o);
                }}
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
                      icon: (
                        <RiPlayListAddLine className="text-lg scale-x-[-1] scale-y-[-1]" />
                      ),
                      onClick: () => console.log("playlist"),
                    },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Title */}
          <a
            href="#"
            className="text-white-smoke no-underline hover:text-gray-300 text-[14px] font-bold tracking-tight pl-1 truncate"
          >
            {title}
          </a>

          {/* Artist */}
          <p className="text-silver text-[14px] font-bold pl-1 truncate">
            {artist}
          </p>
        </div>
      ) : (
        <div className="relative w-40 aspect-square rounded group cursor-pointer bg-off-black m-1 mb-1.75">
          <div className="absolute inset-0 rounded overflow-hidden">
            <div
              className={`absolute inset-0 rounded overflow-hidden ${
                !img ? "bg-gradient-to-br from-off-black to-crusta/70" : ""
              }`}
            ></div>

            {img && (
              <div
                className="absolute inset-0 bg-cover bg-center overflow-hidden rounded cursor-pointer"
                style={{ backgroundImage: `url(${img})` }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
