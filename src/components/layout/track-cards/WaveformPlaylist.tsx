"use client";

import { useState, useEffect, useRef } from "react";
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

import { IoMdPlay, IoMdPause, IoIosMore } from "react-icons/io";
import { HiHeart } from "react-icons/hi";
import { LuRepeat2, LuShare } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";
import { ListStart } from "lucide-react";
import MoreDropdown from "@/components/ui/MoreDropdown";
import { BiStation } from "react-icons/bi";
import { RiPlayListAddLine } from "react-icons/ri";
import { getBaseUrl } from "@/utilities/getBaseUrl";
import { interactionToast } from "@/lib/interactive-toasts/interactiveToast";
import { interactiveToastBus } from "@/lib/interactive-toasts/interactiveToastBus";

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
  feedQueue?: Track[];
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
  rowRef,
}: {
  track: PlaylistTrack;
  index: number;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: () => void;
  rowRef?: (el: HTMLDivElement | null) => void;
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

  const dispatch = useDispatch();

  const indexColor = isCurrent ? "text-inferno" : "text-silver";
  const titleColor = isCurrent
    ? "text-inferno"
    : hovered
      ? "text-silver"
      : "text-white-smoke";

  function handleLikeClick() {
    likeTrack();
    setIsLiked((l) => !l);
    if (!isLiked) {
      interactionToast.liked(track.basicInfo.title, track.image.imgLink);
    }
  }
  function handleRepostClick() {
    repostTrack();
    setIsReposted((r) => !r);
    if (!isReposted) {
      interactionToast.reposted(track.basicInfo.title, track.image.imgLink);
    }
  }

  function handlePlayNextClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!track._id || !track.audio) return;

    interactionToast.queued(track.basicInfo.title, track.image.imgLink);

    dispatch(
      playNext({
        tracks: {
          id: track._id,
          url: track.audio.audioLink,
          title: track.basicInfo.title,
          artist: track.basicInfo.mainArtists[0],
          img: track.image.imgLink,
        },
      }),
    );
  }

  const handleCopyLink = () => {
    if (!track._id) return;

    const url = `${getBaseUrl()}/track/${track._id}`;

    navigator.clipboard.writeText(url);
    interactiveToastBus.emit({
      type: "copied",
    });
  };

  return (
    <div
      ref={rowRef}
      className="flex items-center gap-2 px-2 py-2 rounded hover:bg-white/5 transition-colors cursor-pointer group/row h-[52px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onPlay}
    >
      <div className="relative w-9 h-9 shrink-0">
        <img
          src={track.image.imgLink}
          className="w-9 h-9 rounded object-cover"
        />
        {(hovered || isPlaying) && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded"
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
          >
            <div className="w-5 h-5 bg-white-smoke rounded-full flex items-center justify-center group/playicon">
              {isPlaying ? (
                <IoMdPause className="text-chinese-black text-[11px] group-hover/playicon:opacity-50" />
              ) : (
                <IoMdPlay className="text-chinese-black text-[11px] ml-[1px] group-hover/playicon:opacity-50" />
              )}
            </div>
          </div>
        )}
      </div>

      <span className={`${indexColor} text-sm font-normal shrink-0`}>
        {index + 1}
      </span>
      <span className={`${indexColor} text-sm shrink-0`}>·</span>
      <a
        href="#"
        onClick={(e) => e.stopPropagation()}
        className={`text-sm font-bold flex-1 truncate min-w-0 no-underline transition-colors ${
          isCurrent
            ? "text-inferno"
            : hovered
              ? "text-silver"
              : "text-white-smoke"
        }`}
      >
        {track.basicInfo.title}
      </a>

      <div
        className="shrink-0 w-48 flex items-center justify-end"
        onClick={(e) => e.stopPropagation()}
      >
        {hovered || isPlaying ? (
          <div className="flex items-center gap-3">
            <Tooltip label="Like">
              <Button
                className={isPlaying ? "bg-off-black" : "bg-transparent"}
                onClick={handleLikeClick}
                icon={
                  <HiHeart
                    className={`text-[15px] ${isLiked ? "text-inferno" : ""}`}
                  />
                }
              />
            </Tooltip>
            <Tooltip label="Repost">
              <Button
                className={isPlaying ? "bg-off-black" : "bg-transparent"}
                onClick={handleRepostClick}
                icon={
                  <LuRepeat2
                    className={`text-[15px] ${isReposted ? "text-inferno" : ""}`}
                  />
                }
              />
            </Tooltip>
            <Tooltip label="Share">
              <Button
                className={isPlaying ? "bg-off-black" : "bg-transparent"}
                icon={<LuShare className="text-[15px]" />}
              />
            </Tooltip>
            <Tooltip label="Copy Link">
              <Button
                className={isPlaying ? "bg-off-black" : "bg-transparent"}
                icon={<TbCopy className="text-[15px]" />}
                onClick={handleCopyLink}
              />
            </Tooltip>
            <MoreDropdown
              trigger={
                <Button
                  className={isPlaying ? "bg-off-black" : "bg-transparent"}
                  icon={<IoIosMore className="text-[15px]" />}
                />
              }
              tooltipLabel="More"
              items={[
                {
                  label: "Add to Next up",
                  icon: <ListStart size={19} className="scale-x-[-1]" />,
                  onClick: handlePlayNextClick,
                },
                {
                  label: "Add to Playlist",
                  icon: (
                    <RiPlayListAddLine className="text-lg scale-x-[-1] scale-y-[-1]" />
                  ),
                  // onClick: handleOpenAddToPlaylistModal,
                },
                { label: "Station", icon: <BiStation className="text-lg" /> },
              ]}
            />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-silver text-[11px]">
            <IoMdPlay className="text-[11px]" />
            <span>{formatPlays(track.numOfPlays)}</span>
          </div>
        )}
      </div>
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
  feedQueue,
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

  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const { likePlaylist } = useLikePlaylistOptimistic(playlistId ?? "");
  const { repostPlaylist } = useRepostPlaylist(
    playlistId ?? "",
    isVisible,
    repostCount,
  );

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
    if (preloadedTracks && preloadedTracks.length > 0)
      setCachedTracks(preloadedTracks);
  }, [preloadedTracks]);

  useEffect(() => {
    if (!currentTrackId || !listRef.current || !isThisPlaying) return;
    const el = rowRefs.current.get(currentTrackId);
    if (!el) return;
    const container = listRef.current;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset = elRect.top - containerRect.top + container.scrollTop;
    container.scrollTo({ top: offset, behavior: "smooth" });
  }, [currentTrackId, isThisPlaying]);

  async function ensureTracks(): Promise<PlaylistTrack[]> {
    if (cachedTracks.length > 0) return cachedTracks;
    if (!playlistId) return [];
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

    const queue = feedQueue?.length
      ? feedQueue
      : tracks.map((t) => ({
          id: t._id,
          url: t.audio.audioLink,
          title: t.basicInfo.title,
          artist: t.basicInfo.mainArtists[0],
          img: t.image.imgLink,
          duration: t.durationInSeconds,
        }));

    dispatch(playAudio({ tracks: queue, startId: tracks[0]._id }));
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

  function handleLikeClick() {
    likePlaylist();
    setLikeCountState((c) => (isLiked ? (c ?? 0) - 1 : (c ?? 0) + 1));
    setIsLiked((l) => !l);
    if (!isLiked) {
      interactionToast.liked(title ?? "this playlist", img ?? "");
    }
  }

  function handleRepostClick() {
    repostPlaylist();
    setRepostCountState((c) => (isReposted ? (c ?? 0) - 1 : (c ?? 0) + 1));
    setIsReposted((r) => !r);
    if (!isReposted) {
      interactionToast.reposted(title ?? "this playlist", img ?? "");
    }
  }

  const handleCopyLink = () => {
    if (!playlistId) return;

    const url = `${getBaseUrl()}/playlist/${playlistId}`;

    navigator.clipboard.writeText(url);
    interactiveToastBus.emit({
      type: "copied",
    });
  };

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

        {/* Waveform */}
        <div className="w-full h-15 shrink-0">
          <SausageWaveform
            trackId={currentTrack?._id ?? playlistId}
            samplesUrl={currentTrack?.audio.waveformLink ?? "/waveform.json"}
            externalProgress={progress}
            onSeek={seekToPercentage}
            onPlay={() => handlePlayClick()}
            isPlaying={isThisPlaying}
            currentTime={currentTime}
            duration={currentTrack?.durationInSeconds}
            enabled={isVisible}
          />
        </div>

        {/* Track list */}
        <div
          ref={listRef}
          className={`mt-4 ${tracksExpanded ? "overflow-y-auto max-h-[260px]" : "overflow-hidden"}`}
        >
          {cachedTracks.map((track, i) => (
            <TrackRow
              key={track._id}
              track={track}
              index={i}
              isCurrent={currentTrackId === track._id}
              isPlaying={currentTrackId === track._id && isPlaying}
              onPlay={() => handleTrackPlay(track)}
              rowRef={(el) => {
                if (el) rowRefs.current.set(track._id, el);
                else rowRefs.current.delete(track._id);
              }}
            />
          ))}
        </div>

        {cachedTracks.length > 5 && (
          <button
            onClick={async () => {
              if (!tracksExpanded) await ensureTracks();
              setTracksExpanded((e) => !e);
            }}
            className="text-sm text-silver hover:text-white-smoke transition-colors mt-3 text-left"
          >
            {tracksExpanded
              ? "Show less"
              : `View ${totalTracks ?? cachedTracks.length} tracks`}
          </button>
        )}

        {/* Bottom actions */}
        <div className="flex items-center mt-4 gap-4">
          <Tooltip label="Like">
            <Button
              onClick={handleLikeClick}
              className="bg-off-black"
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
              className="bg-off-black"
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
              className="bg-off-black"
              icon={<LuShare className="text-xl" />}
            />
          </Tooltip>
          <Tooltip label="Copy Link">
            <Button
              className="bg-off-black"
              icon={<TbCopy className="text-xl" />}
              onClick={handleCopyLink}
            />
          </Tooltip>
          <Tooltip label="Add to Next up">
            <Button
              className="bg-off-black"
              onClick={async () => {
                interactiveToastBus.emit({
                  type: "queued",
                  name: title ?? "this playlist",
                  image: img ?? "",
                });
                const rawTracks = await ensureTracks();
                const mappedTracks = rawTracks.map((t) => ({
                  id: t._id,
                  url: t.audio.audioLink,
                  title: t.basicInfo.title,
                  artist: t.basicInfo.mainArtists[0],
                  img: t.image.imgLink,
                  duration: t.durationInSeconds,
                }));
                dispatch(playNext({ tracks: mappedTracks }));
              }}
              icon={<ListStart size={18} className="scale-x-[-1]" />}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
