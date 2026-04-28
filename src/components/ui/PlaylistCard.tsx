"use client";

import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { play, pause, playAudio } from "@/store/slices/playerSlice";
import { useGetPlaylistById } from "@/hooks/usePlaylists";
import { useState } from "react";

type Props = {
  img?: string;
  title?: string;
  artist?: string;
  playlistId?: string;
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
}: Props) {
  const dispatch = useDispatch();
  const { currentTrackId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );
  const { getPlaylistById, loading } = useGetPlaylistById();

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

      tracks = detail.tracks.map((t) => ({
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
    <div className="flex flex-col max-w-40">
      <div className="relative w-40 aspect-square rounded group cursor-pointer bg-off-black m-1 mb-1.75">
        {img && (
          <button
            className="absolute inset-0 bg-cover bg-center overflow-hidden rounded opacity-0 animate-fade-in"
            style={{ backgroundImage: `url(${img})` }}
          />
        )}

        {img && (
          <div className="absolute inset-0 transition-all duration-200 bg-white/50 opacity-0 group-hover:opacity-100" />
        )}

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
      </div>

      <a
        href="#"
        className="text-white-smoke no-underline hover:text-gray-300 text-[14px] font-bold tracking-tight pl-1 animate-fade-in truncate"
      >
        {title}
      </a>
      <p className="text-silver text-[14px] font-bold pl-1 animate-fade-in truncate">
        {artist}
      </p>
    </div>
  );
}
