"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  play,
  pause,
  playAudio,
  playNext,
  Track,
} from "@/store/slices/playerSlice";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useIsVisible } from "@/hooks/useIsVisible";
import {
  useLikeTrackOptimistic,
  useLikePlaylistOptimistic,
} from "@/hooks/useLikes";
import { useRepostTrack, useRepostPlaylist } from "@/hooks/useReposts";
import { useGetPlaylistById } from "@/hooks/usePlaylists";

import SausageWaveform from "@/components/ui/SausageWaveform";
import PlaylistCard from "@/components/ui/PlaylistCard";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";

import { IoMdPlay, IoMdPause } from "react-icons/io";
import { HiHeart } from "react-icons/hi";
import { LuRepeat2, LuShare } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";
import { ListStart, MoreHorizontal } from "lucide-react";

type PlaylistTrack = {
  _id: string;
  basicInfo: { title: string; mainArtists: string[]; permalink: string };
  audio: { audioLink: string; waveformLink: string };
  image: { imgLink: string };
  durationInSeconds: number;
  numOfPlays: number;
  numOfLikes: number;
  isLiked: boolean;
  isReposted: boolean;
};

type Props = {
  img?: string;
  title?: string;
  artist?: string;
  playlistId?: string;
  tag?: string;
  likeCount?: number;
  repostCount?: number;
  isLikedByUser?: boolean;
  isRepostedByUser?: boolean;
  preloadedTracks?: PlaylistTrack[];
  totalTracks?: number;
};

function formatPlays(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function TrackRow({
  track,
  index,
  isPlaying,
  isCurrent,
  onPlay,
}: {
  track: PlaylistTrack;
  index: number;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { likeTrack } = useLikeTrackOptimistic(track._id);
  const [isLiked, setIsLiked] = useState(track.isLiked);

  const { repostTrack } = useRepostTrack(
    track._id,
    true,
    track.isReposted ? 1 : 0,
  );
  const [isReposted, setIsReposted] = useState(track.isReposted);

  const indexColor = isCurrent ? "text-inferno" : "text-silver";
  const titleColor = isCurrent
    ? "text-inferno"
    : hovered
      ? "text-silver"
      : "text-white-smoke";

  function handleLikeClick() {
    likeTrack();
    setIsLiked((l) => !l);
  }

  function handleRepostClick() {
    repostTrack();
    setIsReposted((r) => !r);
  }

  return (
    <div
      className="flex items-center gap-2 px-2 py-2 rounded hover:bg-white/5 transition-colors cursor-pointer group/row overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onPlay}
    >
      <img
        src={track.image.imgLink}
        className="w-9 h-9 rounded object-cover shrink-0"
      />
      <span className={`${indexColor} text-sm font-normal shrink-0 w-4`}>
        {index + 1}
      </span>
      <span className="text-silver text-sm shrink-0">·</span>
      <span
        className={`text-sm font-bold min-w-0 flex-1 truncate transition-colors ${titleColor}`}
      >
        {track.basicInfo.title}
      </span>

      <AnimatePresence mode="wait">
        {hovered ? (
          <motion.div
            key="buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1 shrink-0 h-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip label="Like">
              <Button
                className="bg-transparent p-1"
                onClick={handleLikeClick}
                icon={
                  <HiHeart
                    className={`text-[14px] ${isLiked ? "text-inferno" : ""}`}
                  />
                }
              />
            </Tooltip>
            <Tooltip label="Repost">
              <Button
                className="bg-transparent p-1"
                onClick={handleRepostClick}
                icon={
                  <LuRepeat2
                    className={`text-[14px] ${isReposted ? "text-inferno" : ""}`}
                  />
                }
              />
            </Tooltip>
            <Tooltip label="Share">
              <Button
                className="bg-transparent p-1"
                icon={<LuShare className="text-[14px]" />}
              />
            </Tooltip>
            <Tooltip label="Copy Link">
              <Button
                className="bg-transparent p-1"
                icon={<TbCopy className="text-[14px]" />}
              />
            </Tooltip>
            <Tooltip label="More">
              <Button
                className="bg-transparent p-1"
                icon={<MoreHorizontal className="text-[14px]" />}
              />
            </Tooltip>
          </motion.div>
        ) : (
          <motion.div
            key="playcount"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1 text-silver shrink-0 text-[11px] h-6"
          >
            <IoMdPlay className="text-[11px]" />
            <span>{formatPlays(track.numOfPlays)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PlaylistWaveformCard({
  img,
  title,
  artist,
  playlistId,
  tag,
  likeCount,
  repostCount,
  isLikedByUser = false,
  isRepostedByUser = false,
  preloadedTracks,
  totalTracks,
}: Props) {
  const dispatch = useDispatch();
  const { currentTrackId, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );
  const { progress, currentTime, seekToPercentage } = useAudioProgress();
  const { ref, isVisible } = useIsVisible("200px");
  const { getPlaylistById } = useGetPlaylistById();

  const [cachedTracks, setCachedTracks] = useState<PlaylistTrack[]>(
    preloadedTracks ?? [],
  );
  const [tracksExpanded, setTracksExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [isReposted, setIsReposted] = useState(isRepostedByUser);
  const [likeCountState, setLikeCountState] = useState(likeCount);
  const [repostCountState, setRepostCountState] = useState(repostCount);

  const { likePlaylist } = useLikePlaylistOptimistic(playlistId ?? "");
  const { repostPlaylist } = useRepostPlaylist(
    playlistId ?? "",
    isVisible,
    repostCount,
  );

  const transitionConfig: Transition = { duration: 0.25, ease: "easeOut" };

  const isThisPlaying =
    isPlaying && cachedTracks.some((t) => t._id === currentTrackId);
  const currentTrack =
    cachedTracks.find((t) => t._id === currentTrackId) ?? cachedTracks[0];

  useEffect(() => {
    if (likeCount !== undefined) setLikeCountState(likeCount);
    if (repostCount !== undefined) setRepostCountState(repostCount);
    setIsLiked(isLikedByUser);
    setIsReposted(isRepostedByUser);
  }, [likeCount, repostCount, isLikedByUser, isRepostedByUser]);

  useEffect(() => {
    if (preloadedTracks && preloadedTracks.length > 0) {
      setCachedTracks(preloadedTracks);
    }
  }, [preloadedTracks]);

  async function ensureTracks(): Promise<PlaylistTrack[]> {
    if (cachedTracks.length > 0) return cachedTracks;

    if (!playlistId) {
      console.error("Playlist ID is missing");
      return [];
    }

    const res = await getPlaylistById(playlistId);
    const pl = res?.data?.playlist;
    const detail = Array.isArray(pl) ? pl[0] : pl;
    const tracks = detail?.tracks ?? [];

    setCachedTracks(tracks);
    return tracks;
  }

  async function handlePlayClick() {
    if (isThisPlaying) {
      dispatch(pause());
      return;
    }
    const tracks = await ensureTracks();
    if (!tracks.length) return;
    const mapped = tracks.map((t) => ({
      id: t._id,
      url: t.audio.audioLink,
      title: t.basicInfo.title,
      artist: t.basicInfo.mainArtists[0],
      img: t.image.imgLink,
      duration: t.durationInSeconds,
    }));
    dispatch(playAudio({ tracks: mapped, startId: mapped[0].id }));
    setTimeout(() => dispatch(play()), 0);
  }

  async function handleTrackPlay(track: PlaylistTrack) {
    const tracks = await ensureTracks();
    const mapped = tracks.map((t) => ({
      id: t._id,
      url: t.audio.audioLink,
      title: t.basicInfo.title,
      artist: t.basicInfo.mainArtists[0],
      img: t.image.imgLink,
      duration: t.durationInSeconds,
    }));
    if (currentTrackId === track._id && isPlaying) {
      dispatch(pause());
      return;
    }
    dispatch(playAudio({ tracks: mapped, startId: track._id }));
    setTimeout(() => dispatch(play()), 0);
  }

  async function handleExpandTracks() {
    await ensureTracks();
    setTracksExpanded(true);
  }

  function handleLikeClick() {
    likePlaylist();
    if (isLiked) {
      setLikeCountState((c) => (c ?? 0) - 1);
    } else {
      setLikeCountState((c) => (c ?? 0) + 1);
    }
    setIsLiked((l) => !l);
  }

  function handleRepostClick() {
    repostPlaylist();
    if (isReposted) {
      setRepostCountState((c) => (c ?? 0) - 1);
    } else {
      setRepostCountState((c) => (c ?? 0) + 1);
    }
    setIsReposted((r) => !r);
  }

  return (
    <div className="flex items-stretch" ref={ref}>
      <div className="h-full overflow-hidden -m-1 -mb-1.75">
        <PlaylistCard
          img={img}
          title={title}
          artist={artist}
          playlistId={playlistId}
          appearance="static"
        />
      </div>

      <div className="flex flex-col flex-1 ml-6">
        {/* Header row */}
        <div className="flex items-center mb-4 relative">
          <div
            className="w-10 h-10 bg-white-smoke rounded-full flex items-center justify-center cursor-pointer shrink-0"
            onClick={handlePlayClick}
          >
            {!isThisPlaying ? (
              <IoMdPlay className="text-chinese-black text-[23px] ml-1" />
            ) : (
              <IoMdPause className="text-chinese-black text-[23px]" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-silver">{artist}</p>
            <p className="text-sm font-bold text-white-smoke">{title}</p>
          </div>
          {tag && (
            <a className="absolute top-0 right-0 cursor-pointer no-underline group">
              <span className="text-[13px] text-white-smoke bg-off-black px-2 py-1 rounded-full group-hover:text-white-smoke/50 transition-colors">
                # {tag}
              </span>
            </a>
          )}
        </div>

        {/* Waveform — updates to current playing track */}
        <div className="w-full max-w-158 h-15 shrink-0">
          <SausageWaveform
            trackId={currentTrack?._id ?? playlistId}
            samplesUrl={currentTrack?.audio.waveformLink ?? "/waveform.json"}
            externalProgress={isThisPlaying ? progress : 0}
            onSeek={seekToPercentage}
            onPlay={() => handlePlayClick()}
            isPlaying={isThisPlaying}
            currentTime={currentTime}
            duration={currentTrack?.durationInSeconds}
            enabled={isVisible}
          />
        </div>

        {/* Track list - always show first 5 tracks */}
        <div className="mt-4">
          {cachedTracks.slice(0, 5).map((track, i) => (
            <TrackRow
              key={track._id}
              track={track}
              index={i}
              isCurrent={currentTrackId === track._id}
              isPlaying={currentTrackId === track._id && isPlaying}
              onPlay={() => handleTrackPlay(track)}
            />
          ))}
        </div>

        {/* Expanded track list - show remaining tracks when expanded */}
        <AnimatePresence>
          {tracksExpanded && cachedTracks.length > 5 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={transitionConfig}
              className="overflow-y-auto max-h-64 mt-2"
            >
              {cachedTracks.slice(5).map((track, i) => (
                <TrackRow
                  key={track._id}
                  track={track}
                  index={i + 5}
                  isCurrent={currentTrackId === track._id}
                  isPlaying={currentTrackId === track._id && isPlaying}
                  onPlay={() => handleTrackPlay(track)}
                />
              ))}
              <button
                onClick={() => setTracksExpanded(false)}
                className="text-sm text-silver hover:text-white-smoke transition-colors mt-2 mb-1 px-2"
              >
                Show less
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View more tracks button */}
        {!tracksExpanded && cachedTracks.length > 5 && (
          <button
            onClick={handleExpandTracks}
            className="text-sm text-silver hover:text-white-smoke transition-colors mt-3 text-left"
          >
            View {(totalTracks ?? cachedTracks.length) - 5} more tracks
          </button>
        )}

        {/* Bottom actions */}
        <div className="flex items-center mt-4 gap-2">
          <Tooltip label="Like">
            <Button
              onClick={handleLikeClick}
              className="bg-off-black mr-2"
              icon={
                <HiHeart
                  className={`text-[16px] transition-colors ${isLiked ? "text-inferno" : ""}`}
                />
              }
            >
              <span
                className={`ml-0.5 inline-block min-w-[1ch] text-left transition-colors ${isLiked ? "text-inferno" : ""}`}
              >
                {likeCountState}
              </span>
            </Button>
          </Tooltip>
          <Tooltip label="Repost">
            <Button
              onClick={handleRepostClick}
              className="bg-off-black mr-2"
              icon={
                <LuRepeat2
                  className={`text-[16px] transition-colors ${isReposted ? "text-inferno" : ""}`}
                />
              }
            >
              <span
                className={`ml-0.5 inline-block min-w-[1ch] text-left transition-colors ${isReposted ? "text-inferno" : ""}`}
              >
                {repostCountState}
              </span>
            </Button>
          </Tooltip>
          <Tooltip label="Share">
            <Button
              className="bg-off-black mr-2"
              icon={<LuShare className="text-xl" />}
            />
          </Tooltip>
          <Tooltip label="Copy Link">
            <Button
              className="bg-off-black mr-2"
              icon={<TbCopy className="text-xl" />}
            />
          </Tooltip>
          <Tooltip label="Add to Queue">
            <Button
              className="bg-off-black"
              onClick={async () => {
                const rawTracks = await ensureTracks();

                const mappedTracks = rawTracks.map((t: any) => ({
                  id: t._id,
                  url: t.audio.audioLink,
                  title: t.basicInfo.title,
                  artist: t.basicInfo.mainArtists[0],
                  img: t.image.imgLink,
                  duration: t.durationInSeconds,
                }));

                dispatch(
                  playNext({
                    tracks: mappedTracks,
                  }),
                );
              }}
              icon={<ListStart size={18} className="scale-x-[-1]" />}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
